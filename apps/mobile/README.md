# Smart Dossier — Mobile App (Expo)

Mobile companion for Smart Dossier. Built with **Expo + Expo Router**, it hits the same public REST API as the web app so you only need the local web dev server running.

## Screens

| Screen | Description |
|---|---|
| **Kreu** (Home) | Dashboard cards: active/blocked totals, critical alerts, deadlines, recent dossiers |
| **Dosjet** | Searchable dossier list with process + status filters |
| **Ngarko** | Pick a file or paste text, send to `/api/public/extract`, see structured fields with confidence scores and source evidence |
| **Gjurmim** | Type a tracking code or use the deep link `albturf://track/EKB-2026-000014` |
| **Detaji i dosjes** | Summary, current phase, next step, critical alerts, documents, missing docs, parties |

## Run locally

### 1. Start the web API

From the repo root:

```bash
bun install
bun run dev   # http://localhost:8080
```

Public endpoints used by the mobile app:

```
GET  /api/public/dashboard
GET  /api/public/dossiers?process=&status=&search=
GET  /api/public/dossiers/:id
GET  /api/public/track/:code
POST /api/public/extract
```

### 2. Start Expo

```bash
cd apps/mobile
npm install
npx expo start
```

Press `i` (iOS Simulator), `a` (Android), or scan the QR with **Expo Go**.

### 3. Configure the API base URL

| Scenario | Command |
|---|---|
| Phone on same Wi-Fi | `EXPO_PUBLIC_API_BASE_URL="http://192.168.1.42:8080" npx expo start` |
| Android emulator | `EXPO_PUBLIC_API_BASE_URL="http://10.0.2.2:8080" npx expo start --android` |
| iOS Simulator | No config needed — `localhost:8080` works directly |

## Deep linking

```
albturf://track/EKB-2026-000014
```

## Notes

- No auth — same demo dataset as the web app.
- Document upload accepts text files or pasted text. Photo/PDF picking is wired up; for non-text files the user is prompted to paste the content. Full PDF + OCR runs server-side on the web app.
- Offline: list and detail screens show a friendly error with a "Provo përsëri" retry button. Pull-to-refresh on home and dossier list.
- Types are mirrored (not imported) from `src/` to avoid pulling the TanStack Start runtime into Expo Metro. If you change Albanian UI labels in the web app, update `apps/mobile/src/labels.ts` to match.
