// Local retrieval (RAG) over process definitions, legal bases, critical points,
// and the current dossier facts. Pure in-memory keyword scoring — no embeddings.
import type { Dossier, ProcessDefinition } from "@/core/types";
import { buildDossierSummaryFacts } from "@/core";

export type RagChunk = {
  id: string;
  title: string;
  text: string;
  source: "process" | "legal" | "critical_point" | "dossier";
  phaseId?: string;
  stepId?: string;
};

export function buildChunks(dossier: Dossier, process: ProcessDefinition): RagChunk[] {
  const chunks: RagChunk[] = [];

  // Process-level legal basis
  for (const lb of process.legalBasis) {
    chunks.push({
      id: `legal:${lb.reference}`,
      title: `Baza ligjore: ${lb.reference}`,
      text: `${lb.title ?? lb.reference}${lb.url ? ` (${lb.url})` : ""}`,
      source: "legal",
    });
  }

  for (const phase of process.phases) {
    if (phase.legalBasis?.length) {
      for (const lb of phase.legalBasis) {
        chunks.push({
          id: `legal:${phase.id}:${lb.reference}`,
          title: `${process.title} — Faza ${phase.order}: ${phase.title} (baza ligjore ${lb.reference})`,
          text: `${lb.title ?? lb.reference}${lb.url ? ` ${lb.url}` : ""}`,
          source: "legal",
          phaseId: phase.id,
        });
      }
    }
    for (const step of phase.steps) {
      chunks.push({
        id: `step:${phase.id}:${step.id}`,
        title: `${process.title} — Faza ${phase.order} ${phase.title} · Hapi ${step.order}: ${step.title}`,
        text: [
          step.description,
          `Institucioni: ${step.institution}.`,
          step.slaDays ? `Afat operacional: ${step.slaDays} ditë.` : null,
          step.manual ? "Procedurë manuale (jashtë e-Albania)." : null,
          step.requiredDocuments?.length
            ? `Dokumente të kërkuara: ${step.requiredDocuments.join(", ")}.`
            : null,
        ]
          .filter(Boolean)
          .join(" "),
        source: "process",
        phaseId: phase.id,
        stepId: step.id,
      });
      for (const cp of step.criticalPoints ?? []) {
        chunks.push({
          id: `cp:${phase.id}:${step.id}:${cp.id}`,
          title: `Pikë kritike — ${process.title} · ${phase.title}: ${cp.label}`,
          text: `${cp.description} [severity=${cp.severity}; tags=${cp.tags.join(",")}]${
            cp.expectedDelayDays ? ` Vonesë e pritshme: ~${cp.expectedDelayDays} ditë.` : ""
          }`,
          source: "critical_point",
          phaseId: phase.id,
          stepId: step.id,
        });
      }
    }
  }

  // Dossier facts — single compact chunk so the LLM always sees current state.
  const facts = buildDossierSummaryFacts(dossier, process);
  chunks.push({
    id: `dossier:${dossier.id}`,
    title: `Faktet e dosjes ${dossier.trackingCode}`,
    text: [
      `Statusi: ${facts.status}. Faza aktuale: ${facts.currentPhase}. Hapi aktual: ${facts.currentStep}.`,
      facts.nextStep ? `Hapi tjetër: ${facts.nextStep}.` : "Hapi tjetër: (final ose i panjohur).",
      facts.applicantName ? `Aplikanti: ${facts.applicantName}.` : "",
      `Dokumente të ngarkuara: ${facts.documentsUploaded}.`,
      facts.documentsMissing.length
        ? `Dokumente që mungojnë: ${facts.documentsMissing.join(", ")}.`
        : "Asnjë dokument në listën e detyrueshme nuk mungon.",
      facts.criticalAlerts.length
        ? `Alarme: ${facts.criticalAlerts.map((a) => `${a.label} (${a.severity})`).join("; ")}.`
        : "Pa alarme aktive.",
      facts.deadlineState !== "none"
        ? `Afat: ${facts.deadlineState}${
            facts.daysToNearestDeadline !== undefined
              ? ` (${facts.daysToNearestDeadline} ditë)`
              : ""
          }; të kaluara: ${facts.overdueDeadlines}.`
        : "Pa afate aktive.",
      `AI GIS/AKPT: ${facts.gisAssessment.zoning}; ${facts.gisAssessment.landCategory}; sinjali ${facts.gisAssessment.aiRiskLevel}: ${facts.gisAssessment.aiSignal} ${facts.gisAssessment.aiUse}`,
      facts.finalValueAll !== undefined ? `Vlera përfundimtare: ${facts.finalValueAll} ALL.` : "",
    ]
      .filter(Boolean)
      .join(" "),
    source: "dossier",
    phaseId: dossier.currentPhaseId,
    stepId: dossier.currentStepId,
  });

  return chunks;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics so "afat" ~ "afát"
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length > 2);
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "che",
  "qe",
  "per",
  "dhe",
  "nga",
  "kjo",
  "kete",
  "cili",
  "cila",
  "cfare",
  "eshte",
  "jane",
  "edhe",
  "ose",
  "nese",
]);

export function retrieveChunks(
  chunks: RagChunk[],
  opts: { query: string; phaseId?: string; topK?: number },
): RagChunk[] {
  const k = opts.topK ?? 6;
  const qTokens = tokenize(opts.query).filter((t) => !STOPWORDS.has(t));
  const scored = chunks.map((c) => {
    const blob = `${c.title} ${c.text}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let score = 0;
    for (const t of qTokens) {
      if (blob.includes(t)) score += 2;
    }
    if (opts.phaseId && c.phaseId === opts.phaseId) score += 3;
    if (c.source === "dossier") score += 4; // always include current dossier facts
    if (c.source === "critical_point") score += 1;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const picked = scored
    .filter((s) => s.score > 0)
    .slice(0, k)
    .map((s) => s.c);
  // Guarantee dossier chunk is included.
  const dossier = chunks.find((c) => c.source === "dossier");
  if (dossier && !picked.includes(dossier)) picked.unshift(dossier);
  return picked;
}

export function renderChunksForPrompt(chunks: RagChunk[]): string {
  return chunks.map((c, i) => `[#${i + 1} | id=${c.id}] ${c.title}\n${c.text}`).join("\n\n");
}
