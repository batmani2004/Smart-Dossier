import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { runExtraction } from "@/lib/ai/extract.functions";
import { corsJson, corsOptions } from "@/lib/api/public-helpers";

const inputSchema = z.object({
  processKind: z.enum(["ekb_privatization", "expropriation", "property_registration"]),
  documentType: z.string().min(1),
  text: z.string().min(1).max(200_000),
  fileName: z.string().optional(),
});

export const Route = createFileRoute("/api/public/extract")({
  server: {
    handlers: {
      OPTIONS: async () => corsOptions(),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return corsJson({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = inputSchema.safeParse(body);
        if (!parsed.success) {
          return corsJson({ ok: false, error: "Invalid input" }, { status: 400 });
        }
        const result = await runExtraction(parsed.data);
        return corsJson(result, { status: result.ok ? 200 : 502 });
      },
    },
  },
});
