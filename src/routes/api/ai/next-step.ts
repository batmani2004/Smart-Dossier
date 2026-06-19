import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PROCESSES, getCriticalAlerts, getDeadlineState, getNextStep } from "@/core";
import { callOpenAi } from "@/lib/ai/openai";
import { jsonResponse, loadDossierOr404, readJson, recordAiRun } from "@/lib/ai/server-helpers";

const inputSchema = z.object({ id: z.string().min(1) });

const nextStepResponseSchema = z.object({
  nextAction: z.string(),
  responsibleInstitution: z.string(),
  requiredDocuments: z.array(z.string()).default([]),
  deadline: z.string().nullable(),
  risk: z.string(),
  legalOrProcessSource: z.string(),
});

export const Route = createFileRoute("/api/ai/next-step")({
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
        const det = getNextStep(d, proc);
        const alerts = getCriticalAlerts(d, proc);
        const deadline = getDeadlineState(d, proc);

        // Authoritative deterministic frame — the LLM rewords, never invents a new step.
        const frame = det
          ? {
              isFinal: det.isFinal,
              phaseId: det.phase.id,
              phaseTitle: det.phase.title,
              stepId: det.step.id,
              stepTitle: det.step.title,
              stepDescription: det.step.description,
              responsibleInstitution: det.step.institution,
              requiredDocuments: det.step.requiredDocuments ?? [],
              slaDays: det.step.slaDays ?? null,
              criticalPoints: (det.step.criticalPoints ?? []).map((c) => ({
                label: c.label,
                severity: c.severity,
                description: c.description,
              })),
              legalBasis: [...proc.legalBasis, ...(det.phase.legalBasis ?? [])].map(
                (l) => l.reference,
              ),
            }
          : null;

        if (!frame) {
          return jsonResponse(
            {
              ok: false,
              error: "Nuk u gjet hapi tjetër — gjendja aktuale e dosjes nuk përputhet me procesin.",
            },
            { status: 409 },
          );
        }

        const sourceLabel = `${proc.kind === "ekb_privatization" ? "EKB" : "Shpronësim"} · ${frame.phaseTitle} → ${frame.stepTitle}`;

        if (frame.isFinal) {
          const result = {
            nextAction: "Procesi është në hapin final; nuk ka veprim të mëtejshëm.",
            responsibleInstitution: frame.responsibleInstitution,
            requiredDocuments: frame.requiredDocuments,
            deadline: null as string | null,
            risk: "Pa rrezik të mëtejshëm operacional.",
            legalOrProcessSource: sourceLabel,
          };
          recordAiRun(d, {
            kind: "next_step",
            text: result.nextAction,
            data: { ...result, source: sourceLabel },
            auditAction: "Sugjerim AI: hap tjetër (final)",
          });
          return jsonResponse({ ok: true, result });
        }

        const system =
          "Je asistent procesi. Përshtat hapin DETERMINISTIK të mëposhtëm në një rekomandim të qartë në shqip. " +
          "MOS shpik hap, institucion, dokumente ose afat. Përdor saktësisht stepTitle, responsibleInstitution dhe requiredDocuments të dhëna. " +
          "Kthe JSON me fushat: nextAction (1-2 fjali), responsibleInstitution, requiredDocuments[], deadline (string ose null), risk (1 fjali bazuar te criticalPoints dhe alarmet), legalOrProcessSource (string).";

        const user = JSON.stringify(
          {
            frame,
            alerts: alerts.map((a) => ({ label: a.label, severity: a.severity })),
            deadline,
            suggestedSource: sourceLabel,
          },
          null,
          2,
        );

        const r = await callOpenAi({ system, user, jsonMode: true, temperature: 0.1 });
        if (!r.ok) return jsonResponse({ ok: false, error: r.error }, { status: 502 });

        let llm: z.infer<typeof nextStepResponseSchema>;
        try {
          llm = nextStepResponseSchema.parse(JSON.parse(r.content));
        } catch {
          // Fall back to deterministic frame if model output is malformed.
          llm = {
            nextAction: frame.stepDescription || frame.stepTitle,
            responsibleInstitution: frame.responsibleInstitution,
            requiredDocuments: frame.requiredDocuments,
            deadline: frame.slaDays ? `~${frame.slaDays} ditë` : null,
            risk: frame.criticalPoints[0]?.description ?? "Pa rrezik të identifikuar.",
            legalOrProcessSource: sourceLabel,
          };
        }

        // SAFETY: force authoritative fields back to the deterministic values.
        const result = {
          nextAction: llm.nextAction,
          responsibleInstitution: frame.responsibleInstitution,
          requiredDocuments: frame.requiredDocuments,
          deadline: llm.deadline ?? (frame.slaDays ? `~${frame.slaDays} ditë` : null),
          risk: llm.risk,
          legalOrProcessSource: sourceLabel,
        };

        recordAiRun(d, {
          kind: "next_step",
          text: result.nextAction,
          data: { ...result, model: r.model, source: sourceLabel },
          auditAction: "Sugjerim AI: hap tjetër",
          auditDetails: `${frame.phaseId}/${frame.stepId}`,
        });

        return jsonResponse({ ok: true, result, source: sourceLabel });
      },
    },
  },
});
