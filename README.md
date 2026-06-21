# Smart Dossier

**AI-powered case management for Albanian public administration — EKB housing privatization and property expropriation.**

Citizens wait months for updates on their housing or land cases. Files get lost between ASHK, municipalities, and ministries. No one tracks deadlines. No one is accountable.

Smart Dossier is the missing link — one platform that tracks every dossier, every document, and every deadline in real time, for both civil servants and citizens.

---

## Features

### For Civil Servants
- **Live dashboard** — active cases, blocked dossiers, bottleneck analysis, and critical alerts generated automatically from process rules
- **AI Risk Brief** — one-click summary of the top operational risks across all open cases
- **AI document extraction** — upload any document; the AI extracts structured fields (applicant name, income, family members) with a confidence score and verbatim source evidence for every value
- **Legal document generation** — letters, value calculation sheets, citizen invoices, and draft privatization contracts — built on deterministic templates locked to Albanian law (VKM 179/2020, VKM 898/2020)
- **Immutable audit trail** — every action (upload, extraction, phase change, document generation) writes a permanent, tamper-proof audit event
- **GIS parcel map** — property boundary overlay on an interactive map per dossier

### For Citizens
- **Tracking portal** — scan a QR code or open a link to see case status in plain language: current phase, documents needed, days remaining
- No login required. No internal notes, AI confidence scores, or other citizens' data exposed — enforced in code, not by convention

### Mobile (Expo)
- Field inspectors access the same dashboard, dossier list, and document upload from their phone
- Deep link: `albturf://track/EKB-2026-000014`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web framework | TanStack Start (React 19, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Server functions | TanStack Start server functions (Node 22) |
| AI | Lovable AI Gateway — `google/gemini-3-flash-preview` |
| Document export | PDF (browser print), DOCX (`docx` library) |
| Mobile | Expo + Expo Router (React Native) |
| Tests | Vitest (unit), Playwright (smoke) |
| Runtime | Bun / Node.js ≥ 22.13 |

---

## Getting Started

> Requires **Node.js 22.13.0+** or **Bun**.

### Web app

```bash
# with Bun (recommended)
bun install
bun run dev
# open http://localhost:8080

# with npm on Windows
npm.cmd install
npm.cmd run dev
# open http://127.0.0.1:8080

# if your Node version is slightly older (e.g. v22.11)
npm.cmd run dev:compat
```

### Run tests

```bash
bun run lint      # ESLint — 0 errors
bun run test      # Vitest — 28/28 pass
bun run smoke     # Playwright smoke (requires dev server running)
```

### Mobile app

```bash
cd apps/mobile
npm install
npx expo start
# press i (iOS), a (Android), or scan with Expo Go
```

Point the mobile app at the web API:

```bash
# phone on the same Wi-Fi
EXPO_PUBLIC_API_BASE_URL="http://192.168.1.42:8080" npx expo start

# Android emulator
EXPO_PUBLIC_API_BASE_URL="http://10.0.2.2:8080" npx expo start --android
```

### AI extraction (optional)

Set `OPENAI_API_KEY` to enable real AI extraction. Without it the app runs fully — only AI panels show a clear "key missing" message. No fake fallback data is ever used.

---

## Demo Walkthrough

The app ships with pre-loaded demo data: **8 EKB privatization dossiers + 5 expropriation dossiers**.

The main demo dossier is **EKB-2026-000014** — Arta Beqiri, Rr. Don Bosko, Tirana. Blocked at the physical file submission step; two documents missing.

| Step | Where | What to show |
|---|---|---|
| 1. Dashboard | `/` | KPI cards, critical alerts, bottleneck panel, AI Risk Brief |
| 2. Dossier list | `/dosjet` | Filter by Process = EKB, column view by phase |
| 3. Open dossier | `/dosja/EKB-2026-000014` | Blocked status, missing documents tab |
| 4. AI extraction | Tab: Ngarko | Upload `sample-documents/ekb-family-certificate.txt`, apply extraction → dossier advances |
| 5. Next step | Tab: AI Asistent | "Suggest next step" — grounded in real process phases, cites the ASHK bottleneck |
| 6. Value calculation | Tab: Vlerësimi | Income 12,000 ALL → 50% reduced price bracket (VKM 179/2020) |
| 7. Generate document | Tab: Gjenero → Vendim | Pick "Akt Vleresimi" or "Draft kontrate privatizimi", export PDF/DOCX |
| 8. Citizen portal | Header → Linku për qytetarin | QR code + `/track/EKB-2026-000014` — clean public view |

To reset demo data: open the three-dot menu on the dashboard → **Demo / Dev → Reset demo data**.

---

## Project Structure

```
src/
  core/              # Process definitions (EKB, expropriation), phase engine, value calculation
  lib/
    api/             # Server functions + in-memory store
    ai/              # AI Gateway, RAG, document extraction, generation
    docs/            # Document templates (deterministic) + export (PDF/DOCX)
  routes/            # Pages: dashboard, dossiers, dossier detail, reports, track, API
  components/        # UI components
apps/
  mobile/            # Expo mobile app
sample-documents/    # Sample files for demo extraction
tests/               # Playwright smoke tests
```

---

## How AI is used (and constrained)

Smart Dossier uses AI in three specific, bounded ways:

1. **Document extraction** — reads uploaded text/PDF and returns structured fields with a confidence score and verbatim source snippet. The output is validated with Zod before being saved.
2. **Next-step suggestion** — the LLM receives the list of real process phases from `src/core/processes/` and can only suggest steps that exist. It cannot invent phases.
3. **Risk brief & AI assistant** — summaries and answers are generated from process knowledge chunks with citations. Out-of-scope questions return "Platform nuk e ka këtë informacion".

The value calculation (income brackets, 50% rule, land price) is **deterministic code** in `src/core/value.ts` — AI cannot alter the numbers.

---

## Legal Basis

- **VKM 179/2020** — EKB housing privatization procedures and income brackets
- **VKM 898/2020** — Updated income rules (>14,000 ALL = 100%, 9,000–14,000 = 50%, <9,000 = free)
- **Law 9235/2004 + amendments** — Property expropriation for public interest

---

## QA Summary

| Check | Result |
|---|---|
| `bun run lint` | 0 errors |
| `bun run test` | 28 / 28 pass |
| `bun run build` | Clean build |
| Playwright smoke | Dashboard, dossier, upload, citizen track |
| `/api/public/extract` without AI key | 502 with clear message — no fake data |
| Mobile → public API | List, tracking, extraction all working |
| Responsive (mobile / desktop) | Tailwind responsive + Expo screens |
