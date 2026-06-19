# Smart Dossier — Demo Script (5–6 min)

> **Përgatitja:** `bun install && bun dev` (web në `http://localhost:8080`). Opsionale: `OPENAI_API_KEY=sk-...` për ekstraktim real me AI (pa çelës: ekstraktimi shfaq një gabim të qartë — kurrë të dhëna fake). Për Mobile: `cd apps/mobile && npm install && EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:8080 npx expo start`.

---

## 1. Opening (00:00 – 00:30)

> "Privatizimi i banesave EKB dhe shpronësimet në Shqipëri janë sot procese letre, të copëzuara midis ASHK, bashkive, ministrive dhe qytetarit. Një dosje mund të mbetet me javë në sirtar pa e ditur kush. **Smart Dossier** bën të dukshëm çdo hap, çdo afat dhe çdo dokument që mungon — dhe e bën këtë pa shtuar punë te nëpunësi civil, sepse AI lexon dokumentet dhe sugjeron hapin tjetër, gjithmonë mbi rregullat zyrtare të procesit."

---

## 2. Civil Servant Dashboard (00:30 – 01:30)

1. Hap `/`. Trego **KPI-të** sipër: dosje aktive, të bllokuara, total.
2. Trego kolonën **Sinjale kritike** — secila e gjeneruar nga `getCriticalAlerts()` mbi përkufizimet e procesit (`src/core/processes/ekb.ts`, `expropriation.ts`).
3. Trego panelin **Pengesat (bottlenecks)** — i renditur sipas dosjeve të bllokuara, ditëve mesatare në fazë dhe peshës së sinjaleve.
4. Kliko **AI Risk Brief** — LLM thirret realisht me të dhënat e sinjaleve dhe kthen 5 risqet kryesore operacionale.
5. Hap `/dosjet`. Filtro **Proces = Privatizim EKB**, pastaj **Faza = Aplikimi i qytetarit**. Trego pamjen me kolona sipas fazës.

---

## 3. AI Document Extraction (01:30 – 02:45)

1. Hap **EKB-2026-000014** (Arta Beqiri, Rr. Don Bosko). Statusi: **I bllokuar**, hapi: *Dorëzimi i dosjes fizike*.
2. Tab **Dokumentet** — `family_certificate` dhe `ashk_certificate` shënohen `MUNGON`.
3. Tab **Ngarko** — zgjidh `sample-documents/ekb-family-certificate.txt`.
4. Kliko **Nxirr me AI**. Pa çelës AI? Paneli shfaq një kuti të verdhë "OPENAI_API_KEY mungon" — asnjë rresht i sajuar. Me çelës: AI kthen `applicant.fullName = "Arta Beqiri"`, `monthlyIncomeAll = 12000`, anëtarët e familjes, secila me `confidence` dhe një snippet **sourceEvidence** verbatim nga dokumenti.
5. Kliko **Apliko ekstraktimin** → dosja shënon dokumentin si të marrë, heq nga `missingDocumentTypes`, avancon hapin dhe shton një **AuditEvent** të pakthyeshëm.

---

## 4. Bottleneck & Critical Alerts (02:45 – 03:30)

1. Mbi të njëjtën dosje, trego tab-in **AI Asistent** → kliko **Sugjero hapin tjetër**. LLM merr fazat e mëposhtme nga `PROCESSES[d.process]` dhe nuk mund të shpikë hapa — outputi është i kufizuar me Zod te steps reale, dhe paralajmëron 2–4 javë vonesë sepse ASHK nuk ka API.
2. Pyetje në AI Asistent: *"Cili eshte afati i ankimit?"* — përgjigjja vjen vetëm nga chunk-et e procesit me **citation** "Expropriation Phase 4 — Notification and appeal". Pyet diçka jashtë temës — kthen "Platforma nuk e ka këtë informacion".
3. Kthehu te dashboard-i, trego kartën **Bottleneck** për fazën EKB Step 2 me etiketat "Aplikim fizik: 12–18 dokumente letre" dhe "Pa e-Albania për këtë procedurë" — të njëjtat që përmenden te legjislacioni.

---

## 5. Generated Documents (03:30 – 04:15)

1. Tab **Gjenero** te dosja. Zgjidh **"Kërkesë për dokumente që mungojnë"**. Preview hapet në iframe me letër A4, numër dokumenti, datë, institucioni përgjegjës, palët, bazën ligjore dhe bllokun e nënshkrimit.
2. Aktivizo **AI improve wording** — LLM ripunon vetëm gjuhën; numrat, datat, baza ligjore dhe llogaritjet janë të mbyllura në template-in deterministik (`src/lib/docs/templates.ts`).
3. Shkarko **PDF** (print-to-PDF i browser-it) ose **DOCX** (server-side me `docx`). Kliko **Ruaj në dosje** → krijohet `DossierDocument` + `AuditEvent`.
4. Bonus: tek dosja EKB me të ardhura të miratuara, trego template-in **Llogaritja e vlerës 50%** dhe **Draft kontrate privatizimi**.

---

## 6. Citizen Tracking (04:15 – 05:00)

1. Tek header-i i dosjes kliko **Linku për qytetarin** → dialog me **QR code** + link i kopjueshëm `/track/EKB-2026-000014`.
2. Hap linkun (mobile-first). Qytetari sheh:
   - Fazën aktuale me përshkrim të thjeshtë.
   - Timeline-in (i kryer / aktual / i ardhshëm).
   - Dokumentet që duhen sjellë (etiketa në shqip).
   - Afatin e tij (p.sh. 30-ditësh ankimi) me ditë të mbetura / vonesë.
   - Njoftimet — të filtruara nga `isCitizenAudit()`.
3. Theksoni se **nuk** shfaqen: shënimet e brendshme, aktori, hash-et, konfidenca AI, dokumentet e ngarkuara, dosjet e tjera. Implementuar te `buildTrackingPayload()` në `src/lib/api/dossiers.functions.ts`.

---

## 7. Mobile Bonus (05:00 – 05:45)

1. Në telefon (Expo Go) ose simulator: hap **AlbTurf Mobile**.
2. Tab **Kreu** — të njëjtat KPI dhe sinjale kritike që ushqehen nga `/api/public/dashboard`.
3. Tab **Dosjet** — kërko "Arta", filtro me proces. Hap dosjen → faza, hapi tjetër, sinjale, dokumente që mungojnë.
4. Tab **Ngarko** — zgjidh foto / skedar tekst, dërgo te `/api/public/extract`. Trego fushat me `confidence` dhe `sourceEvidence`.
5. Tab **Gjurmim** — shkruaj `EKB-2026-000014` ose hap deep link `albturf://track/EKB-2026-000014`. E njëjta pamje qytetari, e thjeshtuar për ekranin e telefonit.

---

## 8. Why This Solves a Real Civil-Servant Problem

- **Asnjë dosje nuk humbet më në sirtar.** Çdo dosje ka një fazë, një institucion përgjegjës, një afat dhe një hap tjetër — të dukshëm njëkohësisht për nëpunësin dhe qytetarin.
- **AI pa halucinacione.** Hapat e procesit, llogaritja 50%, afatet 30-ditëshe dhe lista e dokumenteve janë **kod deterministik** (`src/core/`). LLM përdoret vetëm për (a) nxjerrjen e fushave me snippet burimi, (b) sugjerim hapi mbi listën e fazave reale, (c) përmbledhje me citime. Pa çelës AI: aplikacioni vazhdon plotësisht — vetëm panelet AI shfaqin mesazh të qartë.
- **Audit i pakthyeshëm.** Çdo veprim — ngarkim, ekstraktim, gjenerim dokumenti, ndryshim faze — shkruan një `AuditEvent` që ruhet edhe pas avancimit.
- **Transparencë me qytetarin pa rrjedhje.** I njëjti backend prodhon dy pamje: të plotë për nëpunësin, të filtruar për qytetarin. Filtrimi është te kodi, jo te konventa.
- **Punon në fushë.** Aplikacioni mobile lejon nëpunësin/inspektorin të hapë dosjen dhe të ngarkojë një dokument direkt nga terreni; qytetari hap të njëjtin link nga SMS-ja pa instalim.

> "Kjo nuk është një portal më shumë — është rrjeti nervor që mungonte midis ASHK, bashkive, ministrive dhe qytetarit, ndërtuar mbi rregullat ekzistuese të EKB-së dhe shpronësimit."

---

## QA Pass Summary (Final Run)

| Check | Result |
| --- | --- |
| `bun run lint` | ✅ 0 errors (7 preexisting warnings në shadcn UI + 1 hook dep) |
| `bun run test` | ✅ 28/28 pass (engine, demo-seed, AI extraction with mocked LLM) |
| `bun run build` | ✅ run by harness |
| `bun run smoke` (Playwright) | ✅ dashboard, dosja, ngarkim, track |
| `/api/public/dashboard` | ✅ 200 |
| `/api/public/dossiers` (+ filtra) | ✅ 200 |
| `/api/public/dossiers/:id` | ✅ 200 |
| `/api/public/track/:code` | ✅ 200, pa të dhëna të brendshme |
| `/api/public/extract` pa OPENAI_API_KEY | ✅ 502 me mesazh të qartë, **pa fallback fake** |
| Mobile (Expo) → public API | ✅ list + tracking + extract |
| Përgjegjësia (mobile/desktop) | ✅ Tailwind responsive + Expo screens |
