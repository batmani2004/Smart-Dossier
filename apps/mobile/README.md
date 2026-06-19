# AlbTurf Mobile (Expo)

Mobile companion app for AlbTurf — built with **Expo + Expo Router**. Hits the same REST endpoints as the web app (`/api/public/*`), so for the hackathon you just need the local web dev server running.

## Screens

- **Kreu** (Home) — dashboard cards: active/blocked totals, critical alerts, deadlines, recent dossiers.
- **Dosjet** — searchable list with process + status filters.
- **Ngarko** — pick a file/photo or paste text, send to `/api/public/extract`, see structured fields with confidence + source evidence.
- **Gjurmim** — type a tracking code or use the deep link `albturf://track/EKB-2026-000014`.
- **Detaji i dosjes** — summary, current phase, next step, critical alerts, documents, missing docs, parties.

All UI labels are in Albanian and mirror the web app's `src/lib/api/dossiers.functions.ts` and `src/core` types.

## Run locally

The mobile app expects the **web API on localhost:8080** (or anything you point it at via env var).

### 1. Start the web API

From the repo root:

```bash
bun install
bun dev   # serves the TanStack Start app on http://localhost:8080
```

The mobile app uses these endpoints (added for this purpose):

- `GET  /api/public/dashboard`
- `GET  /api/public/dossiers?process=&status=&search=`
- `GET  /api/public/dossiers/:id`
- `GET  /api/public/track/:code`
- `POST /api/public/extract`

### 2. Start Expo

```bash
cd apps/mobile
npm install        # or: bun install / pnpm install
npx expo start
```

Then press `i` (iOS sim), `a` (Android), or scan the QR with **Expo Go**.

### 3. Configure the API base URL

Order of resolution (highest first):

1. `EXPO_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_API_BASE_URL`
3. `expo.extra.apiBaseUrl` in `app.json` (defaults to `http://localhost:8080`)

```bash
# Phone on the same Wi-Fi → use your laptop's LAN IP
EXPO_PUBLIC_API_BASE_URL="http://192.168.1.42:8080" npx expo start

# Android emulator → 10.0.2.2 maps to host loopback
EXPO_PUBLIC_API_BASE_URL="http://10.0.2.2:8080" npx expo start --android
```

> iOS Simulator can reach `http://localhost:8080` directly. Physical iOS device needs your LAN IP and HTTP allowed (Expo dev client tolerates this).

## Deep linking

The app scheme is `albturf://`. Open citizen tracking directly:

```
albturf://track/EKB-2026-000014
```

## Notes / hackathon scope

- No auth — same as the web demo dataset.
- No on-device OCR yet: the upload screen accepts text files or pasted text. Photo/PDF picking works; for non-text files we prompt the user to paste the document text. The web app's PDF + OCR pipeline runs server-side and is the authoritative path.
- Offline: list/detail screens show a friendly error state with "Provo përsëri" retry. Pull-to-refresh on home and dossier list.
- Shared types are mirrored (not imported) from `src/` to avoid pulling the TanStack Start runtime into Expo Metro. Update `apps/mobile/src/labels.ts` if you change canonical Albanian labels.
