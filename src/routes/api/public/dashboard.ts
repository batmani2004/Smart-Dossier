import { createFileRoute } from "@tanstack/react-router";
import { corsJson, corsOptions, dashboardPublic } from "@/lib/api/public-helpers";

export const Route = createFileRoute("/api/public/dashboard")({
  server: {
    handlers: {
      OPTIONS: async () => corsOptions(),
      GET: async () => corsJson(dashboardPublic()),
    },
  },
});
