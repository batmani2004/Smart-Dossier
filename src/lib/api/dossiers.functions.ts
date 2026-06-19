import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allDossiers, getById, getByTrackingCode, nextId, resetStore, upsert } from "./store";
import {
  PROCESSES,
  buildDossierSummaryFacts,
  getCriticalAlerts,
  getDeadlineState,
  getNextStep,
} from "@/core";
import type {
  Dossier,
  DossierDocument,
  DossierStatus,
  JsonValue,
  ProcessKind,
} from "@/core/types";
import { audit, inferPriority, notFound, type Priority } from "./dossiers-helpers";

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
);

// helpers moved to ./dossiers-helpers

// --------------------- list / filter ---------------------

export const listDossiers = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        process: z.enum(["ekb_privatization", "expropriation"]).optional(),
        status: z
          .enum(["draft", "in_progress", "blocked", "awaiting_external", "completed", "rejected"])
          .optional(),
        phaseId: z.string().optional(),
        search: z.string().optional(),
        priority: z.enum(["low", "normal", "high"]).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const q = (data.search ?? "").trim().toLowerCase();
    const items = allDossiers()
      .filter((d) => !data.process || d.process === data.process)
      .filter((d) => !data.status || d.status === data.status)
      .filter((d) => !data.phaseId || d.currentPhaseId === data.phaseId)
      .filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.trackingCode.toLowerCase().includes(q) ||
          d.parties.some((p) => p.fullName.toLowerCase().includes(q)),
      )
      .map((d) => {
        const proc = PROCESSES[d.process];
        const alerts = getCriticalAlerts(d, proc);
        const ds = getDeadlineState(d, proc);
        return {
          ...d,
          priority: inferPriority(d),
          criticalCount: alerts.filter((a) => a.severity === "critical").length,
          warningCount: alerts.filter((a) => a.severity === "warning").length,
          deadlineState: ds.state,
        };
      })
      .filter((d) => !data.priority || d.priority === data.priority)
      .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
    return { items, total: items.length };
  });

// --------------------- get one ---------------------

export const getDossier = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    return {
      dossier: d,
      summary: buildDossierSummaryFacts(d, process),
      alerts: getCriticalAlerts(d, process),
      deadline: getDeadlineState(d, process),
      nextStep: getNextStep(d, process),
    };
  });

// --------------------- create ---------------------

export const createDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        process: z.enum(["ekb_privatization", "expropriation"]),
        title: z.string().min(3),
        applicantName: z.string().min(2),
        zone: z.string().min(1),
        propertyDescription: z.string().min(1),
        areaSqm: z.number().positive().optional(),
        familyIncomeAll: z.number().nonnegative().optional(),
        marketPriceAll: z.number().nonnegative().optional(),
        landPriceAll: z.number().nonnegative().optional(),
        notes: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const process = PROCESSES[data.process as ProcessKind];
    const first = process.phases[0];
    const prefix = data.process === "ekb_privatization" ? "d-ekb-" : "d-exp-";
    const trackPrefix = data.process === "ekb_privatization" ? "EKB" : "EXP";
    const counter = allDossiers().filter((d) => d.process === data.process).length + 1;
    const now = new Date().toISOString();
    const d: Dossier = {
      id: nextId(prefix),
      trackingCode: `${trackPrefix}-2026-${String(counter + 900).padStart(6, "0")}`,
      process: data.process,
      title: data.title,
      status: "draft",
      currentPhaseId: first.id,
      currentStepId: first.steps[0].id,
      parties: [
        {
          id: "p1",
          role: data.process === "expropriation" ? "expropriated_owner" : "applicant",
          fullName: data.applicantName,
        },
      ],
      property: {
        description: data.propertyDescription,
        zone: data.zone,
        areaSqm: data.areaSqm,
        familyIncomeAll: data.familyIncomeAll,
        marketPriceAll: data.marketPriceAll,
        landPriceAll: data.landPriceAll,
      },
      documents: [],
      missingDocumentTypes: first.steps[0].requiredDocuments ?? [],
      deadlines: [],
      audit: [],
      insights: [],
      createdAt: now,
      updatedAt: now,
      notes: data.notes,
    };
    audit(d, { actor: "civil_servant_demo", action: "Dosja u krijua" });
    upsert(d);
    return { id: d.id, trackingCode: d.trackingCode };
  });

// --------------------- patch ---------------------

export const patchDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        title: z.string().optional(),
        status: z
          .enum(["draft", "in_progress", "blocked", "awaiting_external", "completed", "rejected"])
          .optional(),
        notes: z.string().optional(),
        finalValueAll: z.number().nonnegative().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const changes: string[] = [];
    if (data.title && data.title !== d.title) {
      d.title = data.title;
      changes.push("titulli");
    }
    if (data.status && data.status !== d.status) {
      d.status = data.status as DossierStatus;
      changes.push(`status=${data.status}`);
    }
    if (data.notes !== undefined) {
      d.notes = data.notes;
      changes.push("shënime");
    }
    if (data.finalValueAll !== undefined) {
      d.finalValueAll = data.finalValueAll;
      changes.push(`vlerë=${data.finalValueAll}`);
    }
    if (changes.length) {
      audit(d, {
        actor: "civil_servant_demo",
        action: "Përditësim dosjeje",
        details: changes.join(", "),
      });
      upsert(d);
    }
    return { ok: true, changes };
  });

// --------------------- advance phase/step ---------------------

export const advanceDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    const next = getNextStep(d, process);
    if (!next) throw new Error("Cannot advance: invalid current state");
    if (next.isFinal) {
      if (d.status !== "completed") {
        d.status = "completed";
        audit(d, {
          actor: "civil_servant_demo",
          action: "Procedura u mbyll",
          phaseId: d.currentPhaseId,
          stepId: d.currentStepId,
        });
        upsert(d);
      }
      return { ok: true, final: true };
    }
    const fromPhase = d.currentPhaseId;
    const fromStep = d.currentStepId;
    d.currentPhaseId = next.phase.id;
    d.currentStepId = next.step.id;
    if (d.status === "draft") d.status = "in_progress";
    audit(d, {
      actor: "civil_servant_demo",
      action: "Kalim në hapin tjetër",
      phaseId: next.phase.id,
      stepId: next.step.id,
      details: `nga ${fromPhase}/${fromStep} → ${next.phase.id}/${next.step.id}`,
    });
    upsert(d);
    return {
      ok: true,
      final: false,
      currentPhaseId: d.currentPhaseId,
      currentStepId: d.currentStepId,
    };
  });

// --------------------- upload document ---------------------

export const uploadDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        type: z.string().min(1),
        name: z.string().min(1),
        // demo only — base64 or short text representation. capped to keep things lightweight
        content: z.string().max(200_000).optional(),
        aiGenerated: z.boolean().optional(),
        extracted: z.record(jsonValueSchema).optional(),
        confidence: z.number().min(0).max(1).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const doc: DossierDocument = {
      id: `doc-${d.documents.length + 1}-${Date.now().toString(36)}`,
      type: data.type,
      name: data.name,
      status: "uploaded",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "civil_servant_demo",
      notes: data.content ? `inline content (${data.content.length} bytes)` : undefined,
    };
    d.documents = [...d.documents, doc];
    d.missingDocumentTypes = d.missingDocumentTypes.filter((t) => t !== data.type);
    if (data.extracted) {
      d.insights = [
        ...d.insights,
        {
          id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
          kind: "extraction",
          createdAt: new Date().toISOString(),
          text: `AI extraction: ${data.type}`,
          data: data.extracted,
          confidence: data.confidence ?? 0.8,
          sourceDocumentId: doc.id,
        },
      ];
    }
    audit(d, {
      actor: data.aiGenerated ? "ai_assistant" : "civil_servant_demo",
      action: data.aiGenerated ? "Dokument i gjeneruar (AI)" : "Dokument u ngarkua",
      details: `${data.type} — ${data.name}`,
    });
    upsert(d);
    return { ok: true, documentId: doc.id };
  });

// --------------------- dashboard ---------------------

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const dossiers = allDossiers();

  const countsByProcess: Record<string, number> = {};
  const countsByStatus: Record<string, number> = {};
  const countsByPhase: {
    processKind: ProcessKind;
    phaseId: string;
    phaseTitle: string;
    count: number;
  }[] = [];

  const phaseAcc = new Map<
    string,
    { processKind: ProcessKind; phaseId: string; phaseTitle: string; count: number }
  >();

  for (const d of dossiers) {
    countsByProcess[d.process] = (countsByProcess[d.process] ?? 0) + 1;
    countsByStatus[d.status] = (countsByStatus[d.status] ?? 0) + 1;
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const key = `${d.process}:${d.currentPhaseId}`;
    const prev = phaseAcc.get(key);
    if (prev) prev.count += 1;
    else
      phaseAcc.set(key, {
        processKind: d.process,
        phaseId: d.currentPhaseId,
        phaseTitle: phase?.title ?? d.currentPhaseId,
        count: 1,
      });
  }
  for (const v of phaseAcc.values()) countsByPhase.push(v);
  countsByPhase.sort((a, b) => b.count - a.count);

  const now = new Date();
  const criticalAlerts = dossiers.flatMap((d) =>
    getCriticalAlerts(d, PROCESSES[d.process], now)
      .filter((a) => a.severity === "critical")
      .map((a) => ({
        dossierId: d.id,
        trackingCode: d.trackingCode,
        title: d.title,
        alert: a,
      })),
  );

  const expiring = dossiers
    .map((d) => ({ d, ds: getDeadlineState(d, PROCESSES[d.process], now) }))
    .filter((x) => x.ds.state === "due_soon" || x.ds.state === "overdue")
    .map((x) => ({
      dossierId: x.d.id,
      trackingCode: x.d.trackingCode,
      title: x.d.title,
      state: x.ds.state,
      daysRemaining: x.ds.daysRemaining,
      label: x.ds.nearest?.label,
      dueAt: x.ds.nearest?.dueAt,
    }))
    .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0));

  // Bottleneck = phase ranked by (a) # dossiers blocked there, (b) avg days in phase,
  // (c) severity weight of step's critical points.
  type Bucket = {
    processKind: ProcessKind;
    phaseId: string;
    phaseTitle: string;
    stuck: number;
    total: number;
    daysSum: number;
    severityWeight: number;
    alertLabels: Set<string>;
  };
  const bottleneckMap = new Map<string, Bucket>();
  const dayMs = 24 * 60 * 60 * 1000;
  for (const d of dossiers) {
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const step = phase?.steps.find((s) => s.id === d.currentStepId);
    const key = `${d.process}:${d.currentPhaseId}`;
    const stuck = d.status === "blocked" || d.status === "awaiting_external" ? 1 : 0;
    // days in current phase — last "Kalim" audit into this phase, else createdAt
    const enteredAt =
      [...d.audit]
        .reverse()
        .find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ??
      d.createdAt;
    const daysInPhase = Math.max(
      0,
      Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs),
    );
    const sevWeight = (step?.criticalPoints ?? []).reduce(
      (acc, c) => acc + (c.severity === "critical" ? 3 : c.severity === "warning" ? 1 : 0),
      0,
    );
    const prev = bottleneckMap.get(key);
    if (prev) {
      prev.stuck += stuck;
      prev.total += 1;
      prev.daysSum += daysInPhase;
      (step?.criticalPoints ?? []).forEach((c) => prev.alertLabels.add(c.label));
    } else {
      bottleneckMap.set(key, {
        processKind: d.process,
        phaseId: d.currentPhaseId,
        phaseTitle: phase?.title ?? d.currentPhaseId,
        stuck,
        total: 1,
        daysSum: daysInPhase,
        severityWeight: sevWeight,
        alertLabels: new Set((step?.criticalPoints ?? []).map((c) => c.label)),
      });
    }
  }
  const bottlenecks = Array.from(bottleneckMap.values())
    .map((b) => {
      const avgDays = b.total ? Math.round(b.daysSum / b.total) : 0;
      // composite score: stuck*3 + avgDays/7 + severityWeight
      const score = b.stuck * 3 + Math.round(avgDays / 7) + b.severityWeight;
      return {
        processKind: b.processKind,
        phaseId: b.phaseId,
        phaseTitle: b.phaseTitle,
        stuck: b.stuck,
        total: b.total,
        avgDaysInPhase: avgDays,
        severityWeight: b.severityWeight,
        alertLabels: Array.from(b.alertLabels).slice(0, 3),
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const recentExtractions = dossiers
    .flatMap((d) =>
      d.insights
        .filter((i) => i.kind === "extraction" || i.kind === "summary")
        .map((i) => ({
          dossierId: d.id,
          trackingCode: d.trackingCode,
          insight: i,
        })),
    )
    .sort((a, b) => (b.insight.createdAt > a.insight.createdAt ? 1 : -1))
    .slice(0, 8);

  return {
    totals: { dossiers: dossiers.length, ...countsByProcess },
    countsByStatus,
    countsByPhase,
    criticalAlerts: criticalAlerts.slice(0, 12),
    expiringDeadlines: expiring.slice(0, 10),
    bottlenecks,
    recentExtractions,
  };
});

// --------------------- processes ---------------------

export const getProcesses = createServerFn({ method: "GET" }).handler(async () => {
  return { processes: Object.values(PROCESSES) };
});

// --------------------- reset demo data ---------------------

export const resetDemo = createServerFn({ method: "POST" }).handler(async () => {
  return resetStore();
});

// --------------------- citizen tracking (used by /api/public route) ---------------------

const DOC_TYPE_LABELS_SQ: Record<string, string> = {
  family_certificate: "Certifikatë familjare",
  ashk_certificate: "Certifikatë pronësie (ASHK)",
  ashk_certificate_final: "Certifikatë përfundimtare ASHK",
  income_proof: "Vërtetim të ardhurash",
  id_card_copy: "Kopje e kartës së identitetit",
  signed_contract: "Kontratë e nënshkruar",
  vkm_decision: "Vendim VKM",
  valuation_report: "Raport vlerësimi",
  public_interest_justification: "Justifikim interesi publik",
  appeal_form: "Formular ankimi",
  payment_receipt: "Mandat pagese",
};
function docLabel(type: string): string {
  return (
    DOC_TYPE_LABELS_SQ[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// Citizen-safe audit filter: only show externally meaningful events.
const CITIZEN_AUDIT_DENY = ["asistent", "AI", "Përditësim dosjeje", "nxjerra me AI", "paraprak"];
function isCitizenAudit(action: string): boolean {
  return !CITIZEN_AUDIT_DENY.some((kw) => action.toLowerCase().includes(kw.toLowerCase()));
}

export function buildTrackingPayload(code: string) {
  const d = getByTrackingCode(code);
  if (!d) return null;
  const process = PROCESSES[d.process];
  const phase = process.phases.find((p) => p.id === d.currentPhaseId);
  const next = getNextStep(d, process);
  const ds = getDeadlineState(d, process);

  const currentOrder = phase?.order ?? 0;
  const phasesTimeline = process.phases.map((p) => ({
    order: p.order,
    title: p.title,
    institution: p.institutions[0] ?? "—",
    state:
      p.order < currentOrder
        ? ("completed" as const)
        : p.order === currentOrder
          ? ("current" as const)
          : ("upcoming" as const),
  }));

  const missingDocuments = (d.missingDocumentTypes ?? []).map((t) => ({
    type: t,
    label: docLabel(t),
  }));

  const now = Date.now();
  const citizenDeadlines = (d.deadlines ?? [])
    .filter((dl) => !dl.resolvedAt)
    .filter((dl) => dl.kind === "legal" || dl.kind === "external")
    .map((dl) => ({
      label: dl.label,
      dueAt: dl.dueAt,
      kind: dl.kind,
      daysRemaining: Math.ceil((new Date(dl.dueAt).getTime() - now) / 86400000),
    }))
    .sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1));

  const notifications = (d.audit ?? [])
    .filter((a) => isCitizenAudit(a.action))
    .map((a) => ({ at: a.at, action: a.action }))
    .slice(-20)
    .reverse();

  // citizen-safe — no PII, no internal staff notes, no AI confidence, no document contents
  return {
    trackingCode: d.trackingCode,
    process: process.title,
    processKind: d.process,
    status: d.status,
    currentPhase: {
      number: phase?.order ?? 0,
      title: phase?.title ?? "—",
      institution: phase?.institutions[0] ?? "—",
      description: phase?.description ?? "",
    },
    phasesTimeline,
    nextMilestone: next && !next.isFinal ? next.step.title : null,
    nextInstitution: next && !next.isFinal ? next.step.institution : null,
    isFinal: !!next?.isFinal,
    deadline: ds.nearest
      ? {
          label: ds.nearest.label,
          dueAt: ds.nearest.dueAt,
          daysRemaining: ds.daysRemaining,
          state: ds.state,
        }
      : null,
    citizenDeadlines,
    missingDocuments,
    notifications,
    updatedAt: d.updatedAt,
  };
}

// --------------------- grounded AI answer ---------------------

export const answerDossierQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string(), question: z.string().min(2).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    const facts = buildDossierSummaryFacts(d, process);
    const alerts = getCriticalAlerts(d, process);

    // Build grounded context — process knowledge + dossier facts only.
    const context = {
      process: {
        title: process.title,
        legalBasis: process.legalBasis,
        phases: process.phases.map((p) => ({
          id: p.id,
          order: p.order,
          title: p.title,
          institutions: p.institutions,
          steps: p.steps.map((s) => ({
            id: s.id,
            title: s.title,
            institution: s.institution,
            slaDays: s.slaDays,
            manual: s.manual ?? false,
            criticalPoints: (s.criticalPoints ?? []).map((c) => ({
              label: c.label,
              severity: c.severity,
              description: c.description,
            })),
            requiredDocuments: s.requiredDocuments ?? [],
          })),
        })),
      },
      dossier: facts,
      criticalAlerts: alerts.map((a) => ({
        label: a.label,
        severity: a.severity,
        description: a.description,
      })),
    };

    try {
      const [{ generateText }, { getGateway, MODEL_ID }] = await Promise.all([
        import("ai"),
        import("../ai-gateway.server"),
      ]);
      const model = getGateway()(MODEL_ID);
      const sys =
        "Je asistent për nëpunësin civil shqiptar. Përgjigju VETËM bazuar te konteksti i mëposhtëm (përkufizimi i procesit, baza ligjore, dhe faktet e dosjes). " +
        "Nëse përgjigja nuk mbështetet nga konteksti, thuaj qartë 'Nuk kam të dhëna të mjaftueshme'. " +
        "Ji konciz, përgjigju në shqip, dhe cito hapin/fazën përkatëse kur është e mundur.";
      const { text } = await generateText({
        model,
        system: sys,
        prompt: `KONTEKSTI:\n${JSON.stringify(context, null, 2)}\n\nPYETJA: ${data.question}`,
      });
      // log as AI insight + audit
      d.insights = [
        ...d.insights,
        {
          id: `ai-q-${d.insights.length + 1}-${Date.now().toString(36)}`,
          kind: "summary",
          createdAt: new Date().toISOString(),
          text: `Q: ${data.question}\nA: ${text}`,
        },
      ];
      audit(d, {
        actor: "ai_assistant",
        action: "Pyetje me asistent",
        details: data.question.slice(0, 200),
      });
      upsert(d);
      return { answer: text };
    } catch (err) {
      return {
        answer:
          "Asistenti nuk është i disponueshëm tani. Mund të shikoni faktet e dosjes në kontekst.",
        error: err instanceof Error ? err.message : "unknown",
      };
    }
  });

// --------------------- AI risk brief (top 5 operational risks across portfolio) ---------------------

export const aiRiskBrief = createServerFn({ method: "POST" }).handler(async () => {
  const dossiers = allDossiers().filter((d) => d.status !== "completed" && d.status !== "rejected");
  const now = new Date();

  type Bucket = {
    processKind: ProcessKind;
    processTitle: string;
    phaseId: string;
    phaseTitle: string;
    label: string;
    description: string;
    severity: "info" | "warning" | "critical";
    affectedCount: number;
    affectedCodes: string[];
    avgDaysInPhase: number;
    daysSum: number;
  };
  const buckets = new Map<string, Bucket>();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const d of dossiers) {
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const alerts = getCriticalAlerts(d, proc, now);
    const enteredAt =
      [...d.audit]
        .reverse()
        .find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ??
      d.createdAt;
    const daysInPhase = Math.max(
      0,
      Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs),
    );
    for (const a of alerts) {
      if (a.severity === "info") continue;
      const key = `${d.process}:${d.currentPhaseId}:${a.label}`;
      const prev = buckets.get(key);
      if (prev) {
        prev.affectedCount += 1;
        prev.daysSum += daysInPhase;
        prev.avgDaysInPhase = Math.round(prev.daysSum / prev.affectedCount);
        if (prev.affectedCodes.length < 6) prev.affectedCodes.push(d.trackingCode);
      } else {
        buckets.set(key, {
          processKind: d.process,
          processTitle: proc.title,
          phaseId: d.currentPhaseId,
          phaseTitle: phase?.title ?? d.currentPhaseId,
          label: a.label,
          description: a.description,
          severity: a.severity,
          affectedCount: 1,
          affectedCodes: [d.trackingCode],
          avgDaysInPhase: daysInPhase,
          daysSum: daysInPhase,
        });
      }
    }
  }

  const ranked = Array.from(buckets.values())
    .map((b) => ({
      processKind: b.processKind,
      processTitle: b.processTitle,
      phaseId: b.phaseId,
      phaseTitle: b.phaseTitle,
      label: b.label,
      description: b.description,
      severity: b.severity,
      affectedCount: b.affectedCount,
      affectedCodes: b.affectedCodes,
      avgDaysInPhase: b.avgDaysInPhase,
      score:
        b.affectedCount * (b.severity === "critical" ? 3 : 1) + Math.round(b.avgDaysInPhase / 7),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const stats = {
    activeDossiers: dossiers.length,
    blocked: dossiers.filter((d) => d.status === "blocked").length,
    awaitingExternal: dossiers.filter((d) => d.status === "awaiting_external").length,
    overdue: dossiers.filter(
      (d) => getDeadlineState(d, PROCESSES[d.process], now).state === "overdue",
    ).length,
  };

  const { callOpenAi } = await import("@/lib/ai/openai");
  const sys =
    "Je analist operacional për nëpunësit civilë shqiptarë. Përmblidh 5 risqet kryesore operacionale " +
    "nga të dhënat e paketuara. Përgjigju në shqip, në Markdown me listë të numëruar 1–5. " +
    "Për secilin: titull i shkurtër, ndikimi (sa dosje, faza, ditë mesatare), dhe një veprim i rekomanduar. " +
    "Mos shpik fakte: përdor vetëm fushat 'ranked' dhe 'stats'.";
  const user = JSON.stringify({ stats, ranked }, null, 2);
  const res = await callOpenAi({ system: sys, user, temperature: 0.2 });
  if (!res.ok) {
    return { ok: false as const, error: res.error, ranked, stats };
  }
  return {
    ok: true as const,
    brief: res.content,
    model: res.model,
    ranked,
    stats,
    generatedAt: new Date().toISOString(),
  };
});
