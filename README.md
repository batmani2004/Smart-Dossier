# Smart Dossier

Procedurë e digjitalizuar për EKB (privatizim banese) dhe shpronësim. Stack: TanStack Start, React 19, Tailwind v4, Lovable AI Gateway.

## Komandat

Requires Node.js 22.13.0 or newer.

Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
# open http://127.0.0.1:8080
```

If PowerShell blocks `npm` with `npm.ps1 cannot be loaded`, keep using `npm.cmd`.

If your installed Node is older, for example `v22.11.0`, use the compatibility command:

```powershell
npm.cmd run dev:compat
# open http://127.0.0.1:8080
```

Bun:

```bash
bun install
bun run dev      # http://localhost:8080
bun run lint
bun run test     # Vitest (engine + AI extraction)
bun run smoke    # Playwright smoke test (kërkon dev server aktiv)
bun run build
```

## Demo Mode

Aplikacioni vjen i mbushur me të dhëna demo (8 dosje EKB + 5 shpronësim) dhe një dosje speciale për prezantim:

- **EKB-2026-000014** — Arta Beqiri, Rr. Don Bosko, Tiranë. E bllokuar në hapin e dorëzimit të dosjes fizike, mungojnë certifikatat familjare dhe ASHK.

Reset i të dhënave: hap menunë e vogël me tri pika në krye të dashboard-it (**Demo / Dev → Reset demo data**) ose thirre direkt server-fn `resetDemo`.

### Skript 5-minutësh për prezantim

1. **Dashboard (00:00–00:45).** Hap `/`. Trego KPI-të, kolonën "Sinjale" me badge-t kritike, panelin e pengesave dhe kliko **AI Risk Brief** për 5 risqet kryesore të gjeneruara nga AI.
2. **Lista e dosjeve (00:45–01:15).** `/dosjet`. Filtër proces = "Privatizim EKB". Trego pamjen me kolona sipas fazës.
3. **Dosja demo (01:15–02:30).** Hap **EKB-2026-000014** (Arta Beqiri). Trego:
   - Statusi _I bllokuar_, hapi aktual _Dorëzimi i dosjes fizike_.
   - Tab **Dokumentet** — mungojnë `family_certificate` dhe `ashk_certificate`.
   - Tab **Ngarko** — ngarko `sample-documents/ekb-family-certificate.txt`. AI nxjerr aplikantin (Arta Beqiri), të ardhurat **12,000 ALL**, anëtarët e familjes.
   - Kliko **Apliko ekstraktimin** → dosja avancon drejt hapit tjetër; krijohet AuditEvent.
4. **Hapi tjetër me AI (02:30–03:15).** Tab **AI Asistent** → **Sugjero hapin tjetër**. AI thotë: EKB duhet të verifikojë manualisht me ASHK; paralajmëron 2–4 javë vonesë (pa integrim API).
5. **Llogaritja e vlerës (03:15–04:00).** Hap `ekb-property-certificate.txt` për të nxjerrë `propertyId` dhe sipërfaqen. Trego tab-in **Vlerësimi**: të ardhurat 12,000 ALL → **kategoria e reduktuar 50%** mbi çmimin e tregut.
6. **Gjenero dokument (04:00–04:30).** Tab **Gjenero** → zgjidh "Kërkesë për dokumente që mungojnë" ose "Draft kontrate privatizimi". Preview, eksport PDF/DOCX, **Ruaj në dosje** (AuditEvent shtohet).
7. **Portali i qytetarit (04:30–05:00).** Në header të dosjes kliko **Linku për qytetarin** → QR + link i kopjueshëm. Hap `/track/EKB-2026-000014` (mobile-first). Tregon fazat, dokumentet e kërkuara, afatet, njoftimet — pa shënime të brendshme, pa konfidencë AI.

### Të dhënat e fshehura nga portali i qytetarit

- Shënimet e brendshme të nëpunësit civil.
- Metadata e auditit (aktori, detajet teknike, hash-et).
- Konfidenca dhe burimet e modelit AI.
- Dosjet e qytetarëve të tjerë (kërkohet kodi unik i gjurmimit).

## Struktura

- `src/core/` — definicionet e proceseve (EKB, shpronësim), motor i fazave, fixtures.
- `src/lib/api/` — server functions (TanStack Start) + store in-memory.
- `src/lib/ai/` — Lovable AI Gateway, RAG, ekstraktimi i dokumenteve, gjenerimi.
- `src/routes/` — UI (dashboard, dosjet, dosja, raporte, track, api).
- `sample-documents/` — dokumente shembull për demo.
- `tests/smoke.py` — smoke test Playwright (dashboard, dosja, ngarkim, track).

## AI

Të gjitha thirrjet AI bëhen përmes Lovable AI Gateway me modelin `google/gemini-3-flash-preview`. Çelësi `LOVABLE_API_KEY` qëndron vetëm në server. Çdo veprim AI ose dokument i gjeneruar shkruan një **AuditEvent**; historiku nuk humbet asnjëherë gjatë ndryshimit të fazës.
