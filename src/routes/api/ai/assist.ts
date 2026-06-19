import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PROCESSES } from "@/core";
import { callOpenAi } from "@/lib/ai/openai";
import { buildChunks, renderChunksForPrompt, retrieveChunks } from "@/lib/ai/rag";
import { jsonResponse, loadDossierOr404, readJson, recordAiRun } from "@/lib/ai/server-helpers";

const inputSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(2).max(2000),
});

const llmSchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()).default([]),
  hasEnoughInfo: z.boolean(),
});

export const Route = createFileRoute("/api/ai/assist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = inputSchema.parse(await readJson(request));
        } catch (e) {
          if (e instanceof Response) return e;
          return jsonResponse({ ok: false, error: "Invalid input" }, { status: 400 });
        }
        const d = loadDossierOr404(parsed.id);
        const proc = PROCESSES[d.process];

        const all = buildChunks(d, proc);
        const retrieved = retrieveChunks(all, {
          query: parsed.question,
          phaseId: d.currentPhaseId,
          topK: 6,
        });

        const citationsCatalog = retrieved.map((c, i) => ({
          marker: `#${i + 1}`,
          id: c.id,
          title: c.title,
        }));

        const system =
          "Je asistent procesi për nëpunësin civil. Përgjigju në shqip. " +
          "PËRDOR VETËM informacionin nga chunk-et e dhëna më poshtë dhe faktet e dosjes. " +
          "Mos shpik institucione, hapa, afate, ose baza ligjore që nuk janë në kontekst. " +
          'Nëse informacioni nuk mjafton, kthe hasEnoughInfo=false dhe answer="Platforma nuk ka këtë informacion." ' +
          "Kthe JSON me fushat: answer (string), citations (array me id-të e chunk-ve të përdorur, p.sh. ['step:ekb-3:value-calc']), hasEnoughInfo (boolean). " +
          "Çdo pretendim duhet të jetë i lidhshëm me një chunk të cituar.";

        const user = [
          `PYETJA: ${parsed.question}`,
          "",
          "CHUNK-ET E NJOHURISË (përdor VETËM këto):",
          renderChunksForPrompt(retrieved),
        ].join("\n");

        const r = await callOpenAi({ system, user, jsonMode: true, temperature: 0.1 });
        if (!r.ok) return jsonResponse({ ok: false, error: r.error }, { status: 502 });

        let llm: z.infer<typeof llmSchema>;
        try {
          llm = llmSchema.parse(JSON.parse(r.content));
        } catch {
          return jsonResponse(
            { ok: false, error: "Model nuk ktheu JSON të vlefshme.", raw: r.content },
            { status: 502 },
          );
        }

        // Map cited ids -> human titles; drop any id the model invented.
        const byId = new Map(retrieved.map((c) => [c.id, c]));
        const citations = llm.citations
          .map((cid) => byId.get(cid))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
          .map((c) => ({ id: c.id, title: c.title, source: c.source }));

        recordAiRun(d, {
          kind: "summary",
          text: `Q: ${parsed.question}\nA: ${llm.answer}`,
          data: {
            model: r.model,
            hasEnoughInfo: llm.hasEnoughInfo,
            citations: citations.map((c) => c.id),
          },
          auditAction: "Pyetje në asistentin RAG",
          auditDetails: parsed.question.slice(0, 200),
        });

        return jsonResponse({
          ok: true,
          answer: llm.answer,
          hasEnoughInfo: llm.hasEnoughInfo,
          citations,
          retrieved: citationsCatalog,
          model: r.model,
        });
      },
    },
  },
});
