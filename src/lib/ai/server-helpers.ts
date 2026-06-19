// Server-only helpers for /api/ai/* routes:
// - load dossier + record AiInsight + AuditEvent
// - JSON response shape

import { getById, upsert } from "@/lib/api/store";
import type { AuditEvent, Dossier, AiInsight, JsonValue } from "@/core/types";

export function loadDossierOr404(id: string): Dossier {
  const d = getById(id);
  if (!d) throw new Response("Dossier not found", { status: 404 });
  return d;
}

export function recordAiRun(
  d: Dossier,
  opts: {
    kind: AiInsight["kind"];
    text: string;
    data?: { [key: string]: JsonValue };
    confidence?: number;
    auditAction: string;
    auditDetails?: string;
  },
) {
  const now = new Date().toISOString();
  d.insights = [
    ...d.insights,
    {
      id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
      kind: opts.kind,
      createdAt: now,
      text: opts.text,
      data: opts.data,
      confidence: opts.confidence,
    },
  ];
  const ev: AuditEvent = {
    id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
    at: now,
    actor: "ai_assistant",
    action: opts.auditAction,
    details: opts.auditDetails,
  };
  d.audit = [...d.audit, ev];
  d.updatedAt = now;
  upsert(d);
}

export async function readJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Response("Invalid JSON body", { status: 400 });
  }
}

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}
