import { createFileRoute } from "@tanstack/react-router";
import { corsJson, corsOptions, listDossiersPublic } from "@/lib/api/public-helpers";

export const Route = createFileRoute("/api/public/dossiers")({
  server: {
    handlers: {
      OPTIONS: async () => corsOptions(),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const items = listDossiersPublic({
          process: url.searchParams.get("process") ?? undefined,
          status: url.searchParams.get("status") ?? undefined,
          search: url.searchParams.get("search") ?? undefined,
        });
        return corsJson({ items });
      },
    },
  },
});
