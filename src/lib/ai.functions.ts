import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PROCESS_KNOWLEDGE } from "./process-knowledge";

async function getAiClient() {
  const [{ generateText }, { getGateway, MODEL_ID }] = await Promise.all([
    import("ai"),
    import("./ai-gateway.server"),
  ]);

  return { generateText, model: getGateway()(MODEL_ID) };
}

function extractJson(s: string): unknown {
  const cleaned = s.replace(/```json\s*|\s*```/g, "");
  const start = cleaned.search(/[{[]/);
  if (start < 0) throw new Error("No JSON found in response");
  const end = cleaned.lastIndexOf(cleaned[start] === "{" ? "}" : "]");
  return JSON.parse(cleaned.slice(start, end + 1));
}

const DossierContextSchema = z.object({
  id: z.string(),
  kodi: z.string(),
  titulli: z.string(),
  procesi: z.enum(["shpronesim", "privatizim_ekb"]),
  qytetariEmri: z.string(),
  pasuriaPershkrim: z.string(),
  pasuriaZona: z.string(),
  vleraPropozuar: z.number().optional(),
  dataKrijimit: z.string(),
  afatLigjor: z.string().optional(),
  fazaAktuale: z.object({
    numri: z.number(),
    titulli: z.string(),
    institucion: z.string(),
    pershkrim: z.string(),
    manual: z.boolean().optional(),
  }),
  totaliFazave: z.number(),
  dokumentet: z.array(z.object({ emri: z.string(), tipi: z.string(), dataNgarkimit: z.string() })),
  historiku: z.array(z.object({ data: z.string(), veprimi: z.string() })),
  shenime: z.string().optional(),
});

export type DossierContext = z.infer<typeof DossierContextSchema>;

function buildDossierBlock(d: DossierContext) {
  const proces =
    d.procesi === "shpronesim"
      ? "Expropriation for public interest"
      : "Dwelling privatization (HCA)";
  return [
    `CODE: ${d.kodi}`,
    `TITLE: ${d.titulli}`,
    `PROCESS: ${proces}`,
    `CITIZEN: ${d.qytetariEmri}`,
    `PROPERTY: ${d.pasuriaPershkrim} — ${d.pasuriaZona}`,
    d.vleraPropozuar ? `PROPOSED VALUE: ${d.vleraPropozuar.toLocaleString("en-US")} ALL` : null,
    `CREATED: ${new Date(d.dataKrijimit).toLocaleDateString("en-US")}`,
    d.afatLigjor ? `LEGAL DEADLINE: ${new Date(d.afatLigjor).toLocaleDateString("en-US")}` : null,
    `CURRENT PHASE: ${d.fazaAktuale.numri}/${d.totaliFazave} — ${d.fazaAktuale.titulli} (${d.fazaAktuale.institucion})${d.fazaAktuale.manual ? " [MANUAL]" : ""}`,
    `Phase description: ${d.fazaAktuale.pershkrim}`,
    "",
    "UPLOADED DOCUMENTS:",
    ...d.dokumentet.map(
      (doc) =>
        `- ${doc.emri} [${doc.tipi}] (${new Date(doc.dataNgarkimit).toLocaleDateString("en-US")})`,
    ),
    "",
    "ACTION HISTORY:",
    ...d.historiku.map((h) => `- ${new Date(h.data).toLocaleDateString("en-US")}: ${h.veprimi}`),
    d.shenime ? `\nNOTES: ${d.shenime}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

// ───────────────────────────────────────────────────────────
// 1) Summary + next step + critical points (3-in-1)
// ───────────────────────────────────────────────────────────
export const analizoDosjen = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DossierContextSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateText, model } = await getAiClient();
    try {
      const { text } = await generateText({
        model,
        system: `You are an assistant for Albanian public officers managing property dossiers. Answer ONLY in English and ONLY as clean JSON (no other words, no \`\`\` fences). Ground your answer in the process below and the dossier data — do not fabricate.\n\nRESPONSE FORMAT:\n{\n  "permbledhje": "3-5 sentences",\n  "hapiTjeter": "concrete next action",\n  "pikatKritike": ["alert 1", "alert 2"]\n}\n\n${PROCESS_KNOWLEDGE}`,
        prompt: `DOSSIER TO ANALYZE:\n\n${buildDossierBlock(data)}\n\nReturn JSON only.`,
      });
      const obj = extractJson(text) as {
        permbledhje?: string;
        hapiTjeter?: string;
        pikatKritike?: unknown[];
      };
      return {
        permbledhje: String(obj.permbledhje ?? ""),
        hapiTjeter: String(obj.hapiTjeter ?? ""),
        pikatKritike: Array.isArray(obj.pikatKritike) ? obj.pikatKritike.map(String) : [],
      };
    } catch (e) {
      console.error("[analizoDosjen]", e);
      throw new Error(e instanceof Error ? e.message : "AI failed");
    }
  });

// ───────────────────────────────────────────────────────────
// 2) RAG assistant over process + dossier
// ───────────────────────────────────────────────────────────
const ChatSchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  dossierContext: DossierContextSchema.optional(),
});

export const pyetAsistentin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatSchema.parse(data))
  .handler(async ({ data }) => {
    const { generateText, model } = await getAiClient();
    const dossierBlock = data.dossierContext
      ? `\n\nCURRENT DOSSIER CONTEXT:\n${buildDossierBlock(data.dossierContext)}`
      : "";
    const system = `You are an expert assistant for Albanian property procedures. Answer in clear, concise English. Ground your answers STRICTLY in the knowledge base and dossier context. If the question is outside scope, say: "This is not covered by the registered process." Always cite the relevant phase/step or legal basis.\n\n${PROCESS_KNOWLEDGE}${dossierBlock}`;
    const { text } = await generateText({
      model,
      system,
      messages: data.messages,
    });
    return { content: text };
  });

// ───────────────────────────────────────────────────────────
// 3) Field extraction from a document text
// ───────────────────────────────────────────────────────────
export const nxirrTeDhena = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        tekstiDokumentit: z.string().min(20, "Text is too short"),
        procesi: z.enum(["shpronesim", "privatizim_ekb"]).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { generateText, model } = await getAiClient();
    try {
      const { text } = await generateText({
        model,
        system:
          'You extract structured data from Albanian official property documents. Respond ONLY as clean JSON (no fences, no other words) in English. If a field is missing, return null — do not fabricate.\n\nFORMAT:\n{\n  "tipiDokumentit": "...",\n  "emriQytetarit": "..."|null,\n  "atesia": "..."|null,\n  "numriID": "..."|null,\n  "pasuriaPershkrim": "..."|null,\n  "pasuriaZona": "..."|null,\n  "siperfaqe": "..."|null,\n  "numriPasurise": "..."|null,\n  "vlera": number_in_ALL|null,\n  "bazaLigjore": "..."|null,\n  "dataDokumentit": "..."|null,\n  "institucioniLeshues": "..."|null,\n  "permbledhje": "2-3 sentences"\n}',
        prompt: `Process type: ${data.procesi ?? "unknown"}\n\nDOCUMENT TEXT:\n"""\n${data.tekstiDokumentit}\n"""\n\nReturn JSON only.`,
      });
      const obj = extractJson(text) as Record<string, unknown>;
      const str = (k: string) => {
        const v = obj[k];
        return typeof v === "string" && v.trim() ? v : null;
      };
      return {
        tipiDokumentit: str("tipiDokumentit") ?? "Document",
        emriQytetarit: str("emriQytetarit"),
        atesia: str("atesia"),
        numriID: str("numriID"),
        pasuriaPershkrim: str("pasuriaPershkrim"),
        pasuriaZona: str("pasuriaZona"),
        siperfaqe: str("siperfaqe"),
        numriPasurise: str("numriPasurise"),
        vlera: typeof obj.vlera === "number" ? obj.vlera : null,
        bazaLigjore: str("bazaLigjore"),
        dataDokumentit: str("dataDokumentit"),
        institucioniLeshues: str("institucioniLeshues"),
        permbledhje: str("permbledhje") ?? "",
      };
    } catch (e) {
      console.error("[nxirrTeDhena]", e);
      throw new Error(e instanceof Error ? e.message : "AI failed");
    }
  });

// ───────────────────────────────────────────────────────────
// 4) Standard letter / decision generation
// ───────────────────────────────────────────────────────────
export const gjenerojShkrese = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        dossier: DossierContextSchema,
        tipi: z.enum([
          "njoftim_pronari",
          "akt_rivleresimi",
          "kontrate_privatizimi",
          "vendim_refuzimi",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { generateText, model } = await getAiClient();
    const tipiEmertim = {
      njoftim_pronari:
        "Official notice to the owner (notice including the 30-day legal appeal window)",
      akt_rivleresimi: "Expropriation Revaluation Act",
      kontrate_privatizimi: "Dwelling Privatization Contract (HCA scheme)",
      vendim_refuzimi: "Rejection Decision with detailed reasoning",
    }[data.tipi];

    const { text } = await generateText({
      model,
      system: `You are an Albanian administrative officer. You draft official letters in formal, institutional English. Use the standard structure: title, legal basis, parties, description, decision, deadlines, signature. Ground the text only in the real dossier data.\n\n${PROCESS_KNOWLEDGE}`,
      prompt: `Draft: ${tipiEmertim}\n\nDOSSIER DATA:\n${buildDossierBlock(data.dossier)}\n\nReturn only the letter text in Markdown.`,
    });
    return { text };
  });
