import { createFileRoute } from "@tanstack/react-router";
import { buildTrackingPayload } from "@/lib/api/dossiers.functions";

export const Route = createFileRoute("/api/public/track/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const payload = buildTrackingPayload(params.code);
        if (!payload) {
          return Response.json({ error: "not_found" }, { status: 404 });
        }
        return Response.json(payload, {
          headers: { "cache-control": "no-store" },
        });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, OPTIONS",
          },
        }),
    },
  },
});
