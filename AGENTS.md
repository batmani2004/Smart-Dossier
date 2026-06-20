# AGENTS.md

## Cursor Cloud specific instructions

Smart Dossier is a full-stack **TanStack Start** (React 19 + Vite) web app. A single dev
server process serves the SSR UI **and** all REST API routes (`/api/public/*`, `/api/ai/*`).
There is **no database or other backing service** — state is an in-memory store seeded from
`src/core/seed.ts`, so nothing else needs to be started.

There is also a separate Expo/React Native app under `apps/mobile/` (product "AlbTurf
Mobile"). It is **not** part of the npm workspace and has its own dependencies; install them
separately with `cd apps/mobile && npm install`. It is not needed to run or test the web app.

### Running / commands

Standard commands live in `package.json`. Notable points:

- Use **npm** (`package-lock.json` is the lockfile honored by the update script). The README
  also mentions `bun`, but bun is not installed in this environment.
- `npm run dev` starts the web app at `http://127.0.0.1:8080` (host is pinned to `127.0.0.1`).
  This one process is the entire backend + frontend.
- AI features (document extraction, risk brief, next-step) call external gateways and require
  `LOVABLE_API_KEY` and/or `OPENAI_API_KEY`. They are **optional**: without keys the app and
  all seeded demo data still work; only AI actions return an error message.

### Tests / lint

- `npm run test` (Vitest) passes (engine + AI-extraction unit tests).
- `npm run smoke` runs `tests/smoke.py` (Playwright, Python) and **requires the dev server to
  already be running** plus Playwright installed: `pip install playwright && python3 -m
  playwright install chromium`. Override the target with `SMOKE_BASE_URL`.
- Pre-existing issues on `main` (unrelated to environment setup): `npm run lint` reports
  errors (prettier formatting + a conditional `useEffect` in `src/routes/dosja.$id.tsx`), and
  the same `dosja.$id.tsx` hook bug makes the dossier-workspace route crash, so 2 of the 4
  smoke routes fail. The dashboard route also defaults to the citizen homepage rather than the
  civil-servant "Paneli operacional" the smoke test expects. Do not treat these as setup
  failures.
