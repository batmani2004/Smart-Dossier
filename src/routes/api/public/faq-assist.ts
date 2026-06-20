import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { callOpenAi } from "@/lib/ai/openai";
import { buildTrackingPayload } from "@/lib/api/dossiers.functions";
import { fallbackFaqAnswer, renderFaqForPrompt, retrieveFaq, type FaqItem } from "@/lib/faq";

const inputSchema = z.object({
  question: z.string().min(2).max(1000),
  trackingCode: z.string().max(32).optional(),
});

const llmSchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()).default([]),
  hasEnoughInfo: z.boolean(),
});

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    ...init,
    headers: { "cache-control": "no-store", ...(init?.headers ?? {}) },
  });
}

function mapCitations(ids: string[], sourceItems: FaqItem[]) {
  const byId = new Map(sourceItems.map((item) => [item.id, item]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is FaqItem => Boolean(item))
    .map((item) => ({ id: item.id, title: item.question, source: item.category }));
}

type TrackingPayload = NonNullable<ReturnType<typeof buildTrackingPayload>>;

function isTrackingQuestion(question: string) {
  const normalized = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return [
    "status",
    "dosj",
    "faze",
    "hap",
    "afat",
    "mung",
    "dokument",
    "vulos",
    "ankes",
    "pershpejt",
  ].some((token) => normalized.includes(token));
}

function renderTrackingForPrompt(tracking: TrackingPayload) {
  return [
    `Kodi: ${tracking.trackingCode}`,
    `Procesi: ${tracking.process}`,
    `Statusi: ${tracking.status}`,
    `Faza aktuale: ${tracking.currentPhase.number}. ${tracking.currentPhase.title}`,
    `Institucioni: ${tracking.currentPhase.institution}`,
    tracking.nextMilestone ? `Hapi tjeter: ${tracking.nextMilestone}` : "Hapi tjeter: nuk ka",
    tracking.nextInstitution ? `Institucioni i radhes: ${tracking.nextInstitution}` : null,
    tracking.deadline
      ? `Afati kryesor: ${tracking.deadline.label}, ${tracking.deadline.daysRemaining} dite, gjendja ${tracking.deadline.state}`
      : "Pa afat kryesor aktiv",
    tracking.missingDocuments.length
      ? `Dokumente qe mungojne: ${tracking.missingDocuments.map((item) => item.label).join(", ")}`
      : "Nuk shfaqen dokumente te munguar",
    `Verifikimi i te drejtes: ${tracking.requesterVerification.status}`,
    tracking.requesterVerification.canReceiveDocuments
      ? "Dokumentet e vulosura mund te shfaqen per qytetarin"
      : `Dokumentet e vulosura mbahen ne pritje: ${tracking.requesterVerification.heldDocumentsCount}`,
    `Procedura e pershpejtuar: ${tracking.expeditedProcedure.status}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function trackingCitation(tracking: TrackingPayload) {
  return {
    id: `tracking:${tracking.trackingCode}`,
    title: `Status publik ${tracking.trackingCode}`,
    source: "Gjurmimi i dosjes",
  };
}

function fallbackAnswer(question: string, tracking: TrackingPayload | null) {
  const local = fallbackFaqAnswer(question);
  if (!tracking || !isTrackingQuestion(question)) return local;

  const missing = tracking.missingDocuments.map((item) => item.label).join(", ");
  const lines = [
    `Dosja ${tracking.trackingCode} eshte ne statusin "${tracking.status}".`,
    `Faza aktuale: ${tracking.currentPhase.number}. ${tracking.currentPhase.title} (${tracking.currentPhase.institution}).`,
    tracking.nextMilestone
      ? `Hapi tjeter i pritshëm: ${tracking.nextMilestone}.`
      : "Nuk ka hap tjeter te shfaqur publikisht.",
    missing ? `Dokumente qe mungojne: ${missing}.` : "Aktualisht nuk shfaqen dokumente te munguar.",
    tracking.deadline
      ? `Afati kryesor: ${tracking.deadline.label}, ${tracking.deadline.daysRemaining} dite.`
      : null,
    tracking.requesterVerification.canReceiveDocuments
      ? "Dokumentet e vulosura mund te shfaqen per shkarkim."
      : "Dokumentet e vulosura hapen pas verifikimit te te drejtes se kerkuesit.",
  ].filter(Boolean);

  return {
    answer: lines.join("\n"),
    citations: [trackingCitation(tracking), ...local.citations],
    hasEnoughInfo: true,
  };
}

export const Route = createFileRoute("/api/public/faq-assist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: z.infer<typeof inputSchema>;
        try {
          parsed = inputSchema.parse(await request.json());
        } catch {
          return json({ ok: false, error: "Pyetja nuk eshte e vlefshme." }, { status: 400 });
        }

        const tracking = parsed.trackingCode
          ? buildTrackingPayload(parsed.trackingCode.trim().toUpperCase())
          : null;
        const retrieved = retrieveFaq(parsed.question, 5);
        const local = fallbackAnswer(parsed.question, tracking);
        const sourceItems = retrieved.length ? retrieved : [];
        if (!sourceItems.length && !tracking) {
          return json({ ok: true, ...local, mode: "local" });
        }

        const system =
          "Je ndihmes AI per qytetaret ne Smart Dossier. Pergjigju shkurt ne shqip. " +
          "Perdor vetem FAQ-te dhe statusin publik te dosjes qe jepen. Mos jep keshille ligjore perfundimtare dhe mos shpik afate, tarifa ose institucione. " +
          'Nese FAQ nuk mjafton, kthe hasEnoughInfo=false dhe answer="Kjo pyetje nuk mbulohet nga FAQ aktuale." ' +
          "Kthe vetem JSON me fushat answer, citations (id te FAQ-ve te perdorura), hasEnoughInfo.";
        const user = [
          `PYETJA: ${parsed.question}`,
          tracking ? "" : null,
          tracking ? "STATUS PUBLIK I DOSJES:" : null,
          tracking ? renderTrackingForPrompt(tracking) : null,
          "",
          sourceItems.length ? "FAQ:" : "FAQ: nuk ka perputhje te forte",
          sourceItems.length ? renderFaqForPrompt(sourceItems) : "",
        ]
          .filter((line) => line !== null)
          .join("\n");

        const r = await callOpenAi({ system, user, jsonMode: true, temperature: 0.1 });
        if (!r.ok) {
          return json({ ok: true, ...local, mode: "local", aiUnavailable: r.error });
        }

        try {
          const llm = llmSchema.parse(JSON.parse(r.content));
          const citations = [
            ...(tracking && isTrackingQuestion(parsed.question)
              ? [trackingCitation(tracking)]
              : []),
            ...mapCitations(llm.citations, sourceItems),
          ];
          return json({
            ok: true,
            answer: llm.answer,
            hasEnoughInfo: llm.hasEnoughInfo,
            citations,
            mode: "ai",
            model: r.model,
          });
        } catch {
          return json({ ok: true, ...local, mode: "local" });
        }
      },
    },
  },
});
