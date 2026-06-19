// Shared helpers used by /api/public/* REST endpoints (mobile + external).
import {
  PROCESSES,
  buildDossierSummaryFacts,
  getCriticalAlerts,
  getDeadlineState,
  getNextStep,
} from "@/core";
import type { Dossier, ProcessKind } from "@/core/types";
import { allDossiers, getById } from "./store";

export const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
  "cache-control": "no-store",
} as const;

export function corsJson(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...CORS_HEADERS, ...(init.headers ?? {}) },
  });
}

export function corsOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function summarizeDossier(d: Dossier) {
  const proc = PROCESSES[d.process];
  const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
  const step = phase?.steps.find((s) => s.id === d.currentStepId);
  const ds = getDeadlineState(d, proc);
  const alerts = getCriticalAlerts(d, proc);
  return {
    id: d.id,
    trackingCode: d.trackingCode,
    title: d.title,
    process: d.process as ProcessKind,
    processTitle: proc.title,
    status: d.status,
    phaseId: d.currentPhaseId,
    phaseTitle: phase?.title ?? d.currentPhaseId,
    stepTitle: step?.title ?? "",
    institution: phase?.institutions[0] ?? "—",
    deadline: ds.nearest
      ? {
          label: ds.nearest.label,
          dueAt: ds.nearest.dueAt,
          daysRemaining: ds.daysRemaining,
          state: ds.state,
        }
      : null,
    deadlineState: ds.state,
    criticalAlertCount: alerts.filter((a) => a.severity === "critical").length,
    updatedAt: d.updatedAt,
  };
}

export function listDossiersPublic(q: { process?: string; status?: string; search?: string }) {
  const term = (q.search ?? "").trim().toLowerCase();
  return allDossiers()
    .filter((d) => !q.process || d.process === q.process)
    .filter((d) => !q.status || d.status === q.status)
    .filter(
      (d) =>
        !term ||
        d.parties.some((p) => p.fullName.toLowerCase().includes(term)) ||
        d.title.toLowerCase().includes(term) ||
        d.trackingCode.toLowerCase().includes(term) ||
        false,
    )
    .map(summarizeDossier);
}

export function getDossierPublic(id: string) {
  const d = getById(id);
  if (!d) return null;
  const proc = PROCESSES[d.process];
  const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
  const step = phase?.steps.find((s) => s.id === d.currentStepId);
  const next = getNextStep(d, proc);
  const ds = getDeadlineState(d, proc);
  const alerts = getCriticalAlerts(d, proc);
  const facts = buildDossierSummaryFacts(d, proc);
  return {
    summary: summarizeDossier(d),
    phase: phase
      ? {
          id: phase.id,
          order: phase.order,
          title: phase.title,
          description: phase.description,
          institutions: phase.institutions,
          stepTitle: step?.title ?? "",
        }
      : null,
    nextStep:
      next && !next.isFinal ? { title: next.step.title, institution: next.step.institution } : null,
    isFinal: !!next?.isFinal,
    deadline: ds.nearest
      ? {
          label: ds.nearest.label,
          dueAt: ds.nearest.dueAt,
          daysRemaining: ds.daysRemaining,
          state: ds.state,
        }
      : null,
    alerts: alerts.map((a) => ({
      severity: a.severity,
      label: a.label,
      description: a.description,
    })),
    documents: d.documents.map((doc) => ({
      id: doc.id,
      type: doc.type,
      name: doc.name,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
    })),
    missingDocumentTypes: d.missingDocumentTypes,
    parties: d.parties.map((p) => ({ role: p.role, fullName: p.fullName })),
    facts,
  };
}

export function dashboardPublic() {
  const dossiers = allDossiers();
  const now = new Date();
  const active = dossiers.filter((d) => d.status !== "completed" && d.status !== "rejected");
  const blocked = dossiers.filter((d) => d.status === "blocked").length;
  const criticalAlerts = dossiers.flatMap((d) =>
    getCriticalAlerts(d, PROCESSES[d.process], now)
      .filter((a) => a.severity === "critical")
      .map((a) => ({
        dossierId: d.id,
        trackingCode: d.trackingCode,
        title: d.title,
        label: a.label,
        description: a.description,
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
      label: x.ds.nearest?.label ?? "",
      dueAt: x.ds.nearest?.dueAt ?? "",
    }))
    .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0))
    .slice(0, 10);
  return {
    totals: {
      dossiers: dossiers.length,
      active: active.length,
      blocked,
    },
    criticalAlerts: criticalAlerts.slice(0, 10),
    expiringDeadlines: expiring,
    recent: active.slice(0, 10).map(summarizeDossier),
  };
}
