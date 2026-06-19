import {
  PROCESSES,
  getCriticalAlerts,
  getDeadlineState,
} from "@/core";
import type { AuditEvent, Dossier } from "@/core/types";

export function audit(d: Dossier, ev: Omit<AuditEvent, "id" | "at">): Dossier {
  const entry: AuditEvent = {
    id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    ...ev,
  };
  // append-only — history must be preserved across phase changes
  d.audit = [...d.audit, entry];
  return d;
}

export function notFound(): never {
  throw new Error("Dossier not found");
}

export type Priority = "low" | "normal" | "high";

export function inferPriority(d: Dossier): Priority {
  const ds = getDeadlineState(d, PROCESSES[d.process]);
  if (ds.state === "overdue") return "high";
  const crit = getCriticalAlerts(d, PROCESSES[d.process]).filter(
    (a) => a.severity === "critical",
  );
  if (crit.length >= 2) return "high";
  if (ds.state === "due_soon" || crit.length === 1) return "normal";
  return "low";
}
