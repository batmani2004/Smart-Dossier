// Knowledge base for RAG: both real processes + legal basis + critical points.
// The AI may only cite these facts; it is not allowed to fabricate.

export const PROCESS_KNOWLEDGE = `
# SMART DOSSIER — KNOWLEDGE BASE

The system covers two real property management processes in Albania.

================================================================
## PROCESS A — EXPROPRIATION FOR PUBLIC INTEREST
Legal basis: Law No. 8561/1999 and related sub-legal acts.

### Key acronyms
- SAE — State Agency for Expropriation
- SCA — State Cadastre Agency (IPRO)
- NTPA — National Territorial Planning Agency
- GDCS — General Directorate of Civil Status
- CMD — Council of Ministers Decision
- Min. of Economy — Ministry of Economy (compensation disbursement)
- e-Albania 9482 — SCA's online cadastral service

### PHASE 1 — INITIATION
The line ministry or municipality identifies a public-interest need (road,
infrastructure, state facility). The Council of Ministers issues a CMD that
declares public interest and authorizes the procedure.

### PHASE 2 — IDENTIFICATION OF PROPERTIES AND OWNERS
Parallel work:
- SCA issues the cadastral extract and the ownership map for the affected zone.
- GDCS verifies owner identities.
CRITICAL POINT ✕: no automated integration between SCA and GDCS.

### PHASE 3 — EXPROPRIATION VALUATION
- SAE coordinates valuation based on cadastral data.
- The Revaluation Committee values the property by market price, category and
  legal destination.
- NTPA (e-Map GIS) is consulted read-only — no active integration. CRITICAL
  POINT ⚠.
- A Revaluation Act with the proposed sum is drafted.

### PHASE 4 — NOTIFICATION AND APPEAL
SAE sends the revaluation act to the owner; the legal appeal window is
30 days. CRITICAL POINT ✕: notification is by letter only — no SMS / email /
citizen portal.
- If the owner agrees → an agreement is signed.
- If the owner refuses → the Administrative Court reviews the appeal and
  rules on the final sum.

### PHASE 5 — DISBURSEMENT AND TRANSFER OF OWNERSHIP
Parallel work:
- The Ministry of Economy authorizes payment via the banking system.
  CRITICAL POINT ⚠: manual steps in disbursement.
- SCA (e-Albania 9482) records the ownership change. CRITICAL POINT ✕:
  no SCA ↔ Min. of Economy integration.

### PHASE 6 — PHYSICAL HANDOVER AND CLOSURE
SAE + Municipality carry out the physical handover with a signed protocol.
SCA performs the final cadastral registration — the property becomes
state-owned.

================================================================
## PROCESS B — DWELLING PRIVATIZATION (HCA)
Legal basis: CMD 179/2020 and CMD 898/2020.
Only external system currently used: SCA-IPRO. NAIS does not interoperate.
Total duration: 6–18 months.

### Precondition
SCA issues the ownership certificate — the property is registered in HCA's name.

### STEP 1 — PUBLIC NOTICE
HCA notifies the public via physical posting and at ekb.gov.al. CRITICAL
POINT: very limited reach, no e-Albania.

### STEP 2 — CITIZEN APPLICATION
Fully physical. The citizen presents in person at HCA with 12–18 paper
documents (physical family certificate). CRITICAL POINT: zero digital,
manual counter.

### STEP 3 — VERIFICATION OF LEGAL CONDITIONS
HCA manually verifies the housing zone, the legal entitlement and standards.
CRITICAL POINT: no API with SCA, consultation by email/letter, 2–4 week
delays.
Decision: if the conditions are not met → rejection with reasons.

### STEP 4 — PRIVATIZATION VALUE CALCULATION
Calculated from housing standards + land price. Excel or manual calculation
is used. CRITICAL POINT: error-prone, zero audit trail.
Scheme by family income:
- Above 14,000 ALL → 100% market price
- 9,000–14,000 ALL → 50% market price (reduced)
- Below 9,000 ALL → free of charge (0% land)

### STEP 5 — CITIZEN INVOICE GENERATION
After the value calculation, HCA/Finance generates the citizen invoice or
payment mandate. Operational SLA: 3 days. The invoice includes the payable
amount, payment deadline and reference number. It must be generated before the
contract signing phase.

### STEP 6 — PRIVATIZATION CONTRACT SIGNING
HCA and citizen within 2 years. The contract is drafted in Word and printed.
CRITICAL POINT: mandatory physical presence, wet signature + stamp + by hand.

### STEP 7 — SENDING THE FILE TO SCA
The file (contract + documents) is delivered physically. CRITICAL POINT:
loss risk, 4–8 week delays, no API.

### STEP 8 — OWNERSHIP REGISTRATION BY SCA
SCA registers the contract in the cadastral registry and issues the new
certificate. CRITICAL POINT: long queue, 4–8 more weeks.
The family becomes the full owner.

================================================================
## RULES FOR THE ASSISTANT
- Answer based only on this knowledge base and the dossier data given in
  context.
- If the question is outside the process, say clearly: "This is not covered
  by the current registered process."
- Always cite the relevant phase / step / legal basis.
- Respond in clear, concise English.
`.trim();

type FazaShabllon = {
  numri: number;
  titulli: string;
  institucion: string;
  pershkrim: string;
  manual?: boolean;
};

export const SHPRONESIM_FAZAT: readonly FazaShabllon[] = [
  {
    numri: 1,
    titulli: "Initiation",
    institucion: "Line Ministry / CoM",
    pershkrim: "Identify public interest and issue CMD",
  },
  {
    numri: 2,
    titulli: "Property identification",
    institucion: "SCA + GDCS",
    pershkrim: "Cadastral extract and owner verification",
    manual: true,
  },
  {
    numri: 3,
    titulli: "Valuation & Compensation",
    institucion: "SAE + NTPA",
    pershkrim: "Revaluation act with proposed sum",
  },
  {
    numri: 4,
    titulli: "Notice & Appeal",
    institucion: "SAE / Admin. Court",
    pershkrim: "30-day legal appeal window",
    manual: true,
  },
  {
    numri: 5,
    titulli: "Disbursement",
    institucion: "Min. of Economy + SCA",
    pershkrim: "Payment and ownership change",
    manual: true,
  },
  {
    numri: 6,
    titulli: "Final Handover",
    institucion: "SAE + SCA",
    pershkrim: "Protocol and final registration",
  },
];

export const EKB_FAZAT: readonly FazaShabllon[] = [
  {
    numri: 1,
    titulli: "Public Notice",
    institucion: "HCA",
    pershkrim: "Physical posting + ekb.gov.al",
    manual: true,
  },
  {
    numri: 2,
    titulli: "Citizen Application",
    institucion: "HCA — desk",
    pershkrim: "12–18 paper documents",
    manual: true,
  },
  {
    numri: 3,
    titulli: "Legal Verification",
    institucion: "HCA + SCA",
    pershkrim: "Zone + legal entitlement check",
    manual: true,
  },
  {
    numri: 4,
    titulli: "Value Calculation",
    institucion: "HCA",
    pershkrim: "Housing standards + land price",
    manual: true,
  },
  {
    numri: 5,
    titulli: "Citizen Invoice",
    institucion: "HCA Finance",
    pershkrim: "Payment mandate generated for citizen",
  },
  {
    numri: 6,
    titulli: "Contract Signing",
    institucion: "HCA + Citizen",
    pershkrim: "Wet signature within 2 years",
    manual: true,
  },
  {
    numri: 7,
    titulli: "Send to SCA",
    institucion: "HCA → SCA",
    pershkrim: "Physical file delivery",
    manual: true,
  },
  {
    numri: 8,
    titulli: "Final Registration",
    institucion: "SCA — IPRO",
    pershkrim: "New ownership certificate",
  },
];
