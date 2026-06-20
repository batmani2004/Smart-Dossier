import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PROCESSES, buildDossierSummaryFacts, getCriticalAlerts, getDeadlineState } from "@/core";
import { callOpenAi } from "@/lib/ai/openai";
import { jsonResponse, loadDossierOr404, readJson, recordAiRun } from "@/lib/ai/server-helpers";

const inputSchema = z.object({ id: z.string().min(1) });

export const Route = createFileRoute("/api/ai/summary")({
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
        const facts = buildDossierSummaryFacts(d, proc);
        const alerts = getCriticalAlerts(d, proc);
        const deadline = getDeadlineState(d, proc);

        const context = {
          dossier: facts,
          alerts: alerts.map((a) => ({
            label: a.label,
            severity: a.severity,
            description: a.description,
          })),
          deadline,
        };

        const system =
          "Je analist i nje ekipi sherbimi civil shqiptar. Jep nje permbledhje per menaxherin, " +
          "3-5 fjali, ne shqip, EKSKLUZIVISHT bazuar te konteksti. " +
          "Mbulo: (1) ku ndodhet dosja, (2) cfare mungon, (3) rreziku me i madh i voneses, " +
          "(4) si perdoret sinjali AI GIS/AKPT kur eshte relevant, (5) veprimi i rekomanduar tjeter. " +
          "Mos shpik fakte ose hapa jashte procesit.";
        const user = `KONTEKSTI (JSON):\n${JSON.stringify(context, null, 2)}`;

        const r = await callOpenAi({ system, user, temperature: 0.2 });
        if (!r.ok) return jsonResponse({ ok: false, error: r.error }, { status: 502 });

        recordAiRun(d, {
          kind: "summary",
          text: r.content,
          data: {
            model: r.model,
            phaseId: d.currentPhaseId,
            stepId: d.currentStepId,
          },
          auditAction: "Permbledhje AI",
          auditDetails: `model=${r.model}`,
        });

        return jsonResponse({ ok: true, summary: r.content, model: r.model });
      },
    },
  },
});
