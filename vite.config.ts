// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config/dist/index.js";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Nitro is normally only active inside the Lovable sandbox.
  // Setting an explicit preset forces it on for any `vite build` (including Vercel CI).
  nitro: { preset: "vercel" },
  vite: {
    cacheDir: ".tanstack/vite",
    resolve: {
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
    },
    server: {
      watch: {
        ignored: ["**/apps/mobile/**"],
      },
    },
  },
});
