import type {
  CriticalPoint,
  Deadline,
  Dossier,
  PhaseDefinition,
  ProcessDefinition,
  StepDefinition,
} from "./types";

export interface NextStepResult {
  phase: PhaseDefinition;
  step: StepDefinition;
  /** True when the dossier has reached the last step of the last phase. */
  isFinal: boolean;
}

/** Returns the next step to execute. If the current step is final returns it with isFinal=true. */
export function getNextStep(dossier: Dossier, process: ProcessDefinition): NextStepResult | null {
  const phaseIdx = process.phases.findIndex((p) => p.id === dossier.currentPhaseId);
  if (phaseIdx === -1) return null;
  const phase = process.phases[phaseIdx];
  const stepIdx = phase.steps.findIndex((s) => s.id === dossier.currentStepId);
  if (stepIdx === -1) return null;

  // next step within same phase
  if (stepIdx + 1 < phase.steps.length) {
    return { phase, step: phase.steps[stepIdx + 1], isFinal: false };
  }
  // first step of next phase
  if (phaseIdx + 1 < process.phases.length) {
    const next = process.phases[phaseIdx + 1];
    return { phase: next, step: next.steps[0], isFinal: false };
  }
  // already at final step
  return { phase, step: phase.steps[stepIdx], isFinal: true };
}

export interface CriticalAlert {
  id: string;
  source: "process" | "document" | "deadline" | "integration";
  severity: CriticalPoint["severity"];
  label: string;
  description: string;
  phaseId?: string;
  stepId?: string;
  tags: string[];
}

/** Returns the set of critical alerts that apply to the dossier *right now*. */
export function getCriticalAlerts(
  dossier: Dossier,
  process: ProcessDefinition,
  now: Date = new Date(),
): CriticalAlert[] {
  const alerts: CriticalAlert[] = [];

  // 1. critical points attached to the current step
  const phase = process.phases.find((p) => p.id === dossier.currentPhaseId);
  const step = phase?.steps.find((s) => s.id === dossier.currentStepId);
  if (phase && step) {
    for (const cp of step.criticalPoints ?? []) {
      alerts.push({
        id: `cp:${cp.id}`,
        source: "process",
        severity: cp.severity,
        label: cp.label,
        description: cp.description,
        phaseId: phase.id,
        stepId: step.id,
        tags: cp.tags,
      });
    }
  }

  // 2. missing required documents for the current step
  if (step?.requiredDocuments) {
    for (const docType of step.requiredDocuments) {
      const has = dossier.documents.some(
        (d) => d.type === docType && (d.status === "uploaded" || d.status === "verified"),
      );
      if (!has) {
        alerts.push({
          id: `doc:${docType}`,
          source: "document",
          severity: "warning",
          label: `Dokument mungon: ${docType}`,
          description: `Hapi aktual kërkon dokumentin "${docType}".`,
          phaseId: phase?.id,
          stepId: step.id,
          tags: ["missing-document"],
        });
      }
    }
  }

  // 3. unresolved overdue deadlines
  for (const d of dossier.deadlines) {
    if (d.resolvedAt) continue;
    if (new Date(d.dueAt).getTime() < now.getTime()) {
      alerts.push({
        id: `dl:${d.id}`,
        source: "deadline",
        severity: d.kind === "legal" ? "critical" : "warning",
        label: `Afat i kaluar: ${d.label}`,
        description: `Afati ka kaluar më ${d.dueAt}.`,
        phaseId: d.phaseId,
        stepId: d.stepId,
        tags: ["overdue", d.kind],
      });
    }
  }

  // 4. blocked / awaiting external
  if (dossier.status === "blocked") {
    alerts.push({
      id: "status:blocked",
      source: "integration",
      severity: "critical",
      label: "Dosja është bllokuar",
      description: dossier.notes ?? "Bllokuar — kërkohet ndërhyrje manuale.",
      tags: ["blocked"],
    });
  }

  return alerts;
}

export type DeadlineState = "ok" | "due_soon" | "overdue" | "none";

export interface DeadlineSummary {
  state: DeadlineState;
  nearest?: Deadline;
  daysRemaining?: number;
  overdueCount: number;
  dueSoonCount: number;
}

/** Aggregate deadline state for the dossier. "due_soon" = <= 7 days. */
export function getDeadlineState(
  dossier: Dossier,
  _process: ProcessDefinition,
  now: Date = new Date(),
  dueSoonDays = 7,
): DeadlineSummary {
  const open = dossier.deadlines.filter((d) => !d.resolvedAt);
  if (open.length === 0) return { state: "none", overdueCount: 0, dueSoonCount: 0 };

  const sorted = [...open].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );
  const nearest = sorted[0];
  const ms = new Date(nearest.dueAt).getTime() - now.getTime();
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));

  const overdueCount = open.filter((d) => new Date(d.dueAt).getTime() < now.getTime()).length;
  const dueSoonCount = open.filter((d) => {
    const dms = new Date(d.dueAt).getTime() - now.getTime();
    const dd = Math.ceil(dms / (24 * 60 * 60 * 1000));
    return dd >= 0 && dd <= dueSoonDays;
  }).length;

  let state: DeadlineState;
  if (days < 0) state = "overdue";
  else if (days <= dueSoonDays) state = "due_soon";
  else state = "ok";

  return { state, nearest, daysRemaining: days, overdueCount, dueSoonCount };
}
