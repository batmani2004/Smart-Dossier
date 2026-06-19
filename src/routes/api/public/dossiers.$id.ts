import { createFileRoute } from "@tanstack/react-router";
import { corsJson, corsOptions, getDossierPublic } from "@/lib/api/public-helpers";

export const Route = createFileRoute("/api/public/dossiers/$id")({
  server: {
    handlers: {
      OPTIONS: async () => corsOptions(),
      GET: async ({ params }) => {
        const data = getDossierPublic(params.id);
        if (!data) return corsJson({ error: "not_found" }, { status: 404 });
        return corsJson(data);
      },
    },
  },
});
