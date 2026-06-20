import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getById, upsert } from "./store";
import { PROCESSES } from "@/core";
import type { AuditEvent, Dossier, DossierDocument } from "@/core/types";
import { buildDocument, TEMPLATES_FOR_PROCESS } from "@/lib/docs/templates";
import type { DocTemplateKey, GeneratedDoc } from "@/lib/docs/types";
import { renderDocHtml } from "@/lib/docs/render-html";

const TEMPLATE_KEYS = [
  "ekb_missing_docs_notice",
  "ekb_refusal_decision",
  "ekb_value_calculation",
  "ekb_citizen_invoice",
  "ekb_contract_draft",
  "exp_owner_notification",
  "exp_compensation_proposal",
] as const;

function audit(d: Dossier, ev: Omit<AuditEvent, "id" | "at">) {
  d.audit = [
    ...d.audit,
    {
      id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
      at: new Date().toISOString(),
      ...ev,
    },
  ];
}

function notFound(): never {
  throw new Error("Dossier not found");
}

function ensureTemplateAllowed(d: Dossier, key: DocTemplateKey) {
  const allowed = TEMPLATES_FOR_PROCESS[d.process];
  if (!allowed.includes(key)) {
    throw new Error(`Template ${key} nuk është i lejuar për procesin ${d.process}.`);
  }
}

// --------------------- list templates for a dossier ---------------------

export const listDocTemplates = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ dossierId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const d = getById(data.dossierId);
    if (!d) notFound();
    const keys = TEMPLATES_FOR_PROCESS[d.process];
    const { TEMPLATE_LABELS } = await import("@/lib/docs/templates");
    return {
      templates: keys.map((k) => ({ key: k, label: TEMPLATE_LABELS[k] })),
    };
  });

// --------------------- preview (HTML + structured doc) ---------------------

export const previewDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        dossierId: z.string(),
        template: z.enum(TEMPLATE_KEYS),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.dossierId);
    if (!d) notFound();
    ensureTemplateAllowed(d, data.template);
    const doc = buildDocument(data.template, d, PROCESSES[d.process]);
    const html = renderDocHtml(doc);
    return { doc, html };
  });

// --------------------- generate (persist + audit) ---------------------

export const generateDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        dossierId: z.string(),
        template: z.enum(TEMPLATE_KEYS),
        /** optional AI-improved sections to use instead of the raw template body */
        improvedSections: z
          .array(
            z.object({
              heading: z.string().optional(),
              paragraphs: z.array(z.string()),
            }),
          )
          .optional(),
        format: z.enum(["html", "docx"]).default("html"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.dossierId);
    if (!d) notFound();
    ensureTemplateAllowed(d, data.template);
    const doc = buildDocument(data.template, d, PROCESSES[d.process]);
    if (data.improvedSections && data.improvedSections.length === doc.sections.length) {
      doc.sections = doc.sections.map((s, i) => ({
        heading: data.improvedSections![i].heading ?? s.heading,
        paragraphs: data.improvedSections![i].paragraphs,
      }));
    }

    const documentType = data.template === "ekb_citizen_invoice" ? "citizen_invoice" : data.template;
    const record: DossierDocument = {
      id: `gen-${d.documents.length + 1}-${Date.now().toString(36)}`,
      type: documentType,
      name: `${doc.title} — ${doc.number}`,
      status: "uploaded",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "ai_assistant",
      notes: `Generated (${data.format})${data.improvedSections ? " + AI-improved wording" : ""}`,
    };
    d.documents = [...d.documents, record];
    d.missingDocumentTypes = d.missingDocumentTypes.filter((t) => t !== documentType);
    audit(d, {
      actor: "ai_assistant",
      action: "Dokument i gjeneruar",
      details: `${data.template} — ${doc.number}${data.improvedSections ? " (wording AI)" : ""}`,
    });
    upsert(d);

    let docxBase64: string | undefined;
    if (data.format === "docx") {
      const { renderDocxBuffer } = await import("@/lib/docs/render-docx.server");
      const buf = await renderDocxBuffer(doc);
      docxBase64 = buf.toString("base64");
    }

    return {
      doc,
      html: renderDocHtml(doc),
      docxBase64,
      docxMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileName: `${doc.number.replace(/[^a-zA-Z0-9-_.]/g, "_")}.${data.format === "docx" ? "docx" : "html"}`,
      documentRecordId: record.id,
    };
  });

// --------------------- AI improve wording (preserves facts) ---------------------

export const aiImproveDocumentWording = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        dossierId: z.string(),
        template: z.enum(TEMPLATE_KEYS),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.dossierId);
    if (!d) notFound();
    ensureTemplateAllowed(d, data.template);
    const baseDoc: GeneratedDoc = buildDocument(data.template, d, PROCESSES[d.process]);

    const { callOpenAi } = await import("@/lib/ai/openai");
    const system =
      "Je redaktor zyrtar shqiptar për dokumente qeveritare. Përmirëso vetëm GJUHËN dhe TONIN " +
      "e seksioneve (formal, i qartë, koherent). NDALOHET të ndryshosh fakte ligjore, datat, " +
      "shumat, emrat, numrat e dokumentit, bazën ligjore ose strukturën. Mos shto seksione ose " +
      "fakte të reja. Mos hiq fakte ekzistuese. Mbaj saktësisht të njëjtin numër seksionesh dhe " +
      "të njëjtën rendje paragrafësh. Përgjigju VETËM me JSON në formatin: " +
      `{"sections":[{"heading":"...","paragraphs":["..."]}]}`;
    const user = JSON.stringify(
      {
        title: baseDoc.title,
        addressee: baseDoc.addressee,
        sections: baseDoc.sections,
      },
      null,
      2,
    );

    const res = await callOpenAi({ system, user, jsonMode: true, temperature: 0.2 });
    if (!res.ok) {
      return { ok: false as const, error: res.error };
    }
    try {
      const parsed = JSON.parse(res.content) as {
        sections?: { heading?: string; paragraphs?: string[] }[];
      };
      const sections = (parsed.sections ?? []).map((s) => ({
        heading: s.heading,
        paragraphs: (s.paragraphs ?? []).map(String),
      }));
      if (sections.length !== baseDoc.sections.length) {
        return {
          ok: false as const,
          error: `AI ndryshoi numrin e seksioneve (pritej ${baseDoc.sections.length}, mori ${sections.length}). U refuzua.`,
        };
      }
      audit(d, {
        actor: "ai_assistant",
        action: "AI përmirësoi formulimin (paraprak)",
        details: data.template,
      });
      upsert(d);
      return { ok: true as const, sections, model: res.model };
    } catch (e) {
      return {
        ok: false as const,
        error: `Përgjigja e AI nuk është JSON i vlefshëm: ${e instanceof Error ? e.message : "parse error"}`,
      };
    }
  });

// --------------------- on-demand DOCX download (no extra audit; only file bytes) ---------------------

export const downloadDocx = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        dossierId: z.string(),
        template: z.enum(TEMPLATE_KEYS),
        improvedSections: z
          .array(
            z.object({
              heading: z.string().optional(),
              paragraphs: z.array(z.string()),
            }),
          )
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.dossierId);
    if (!d) notFound();
    ensureTemplateAllowed(d, data.template);
    const doc = buildDocument(data.template, d, PROCESSES[d.process]);
    if (data.improvedSections && data.improvedSections.length === doc.sections.length) {
      doc.sections = doc.sections.map((s, i) => ({
        heading: data.improvedSections![i].heading ?? s.heading,
        paragraphs: data.improvedSections![i].paragraphs,
      }));
    }
    const { renderDocxBuffer } = await import("@/lib/docs/render-docx.server");
    const buf = await renderDocxBuffer(doc);
    return {
      base64: buf.toString("base64"),
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileName: `${doc.number.replace(/[^a-zA-Z0-9-_.]/g, "_")}.docx`,
    };
  });
