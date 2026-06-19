// Smart Dossier — shared domain types.
// Self-contained: this module has no runtime deps on the rest of the app.

export type ProcessKind = "ekb_privatization" | "expropriation";

export type DossierStatus =
  | "draft"
  | "in_progress"
  | "blocked"
  | "awaiting_external"
  | "completed"
  | "rejected";

export type Severity = "info" | "warning" | "critical";

export interface LegalBasis {
  /** e.g. "VKM 179/2020", "Law 8561/1999" */
  reference: string;
  title?: string;
  url?: string;
}

export interface CriticalPoint {
  id: string;
  label: string;
  description: string;
  severity: Severity;
  /** Tags like "no-api", "paper-only", "no-e-albania", "delay-2-4w". */
  tags: string[];
  /** Expected delay introduced by this critical point. */
  expectedDelayDays?: number;
}

export interface StepDefinition {
  id: string;
  /** Order within the phase. */
  order: number;
  title: string;
  description: string;
  /** Institution responsible. */
  institution: string;
  /** Documents typically required to complete the step. */
  requiredDocuments?: string[];
  /** Soft deadline in days from the moment the step becomes active. */
  slaDays?: number;
  /** Critical points that apply to this step. */
  criticalPoints?: CriticalPoint[];
  /** Whether this step is currently performed manually (no integration). */
  manual?: boolean;
}

export interface PhaseDefinition {
  id: string;
  order: number;
  title: string;
  description: string;
  institutions: string[];
  steps: StepDefinition[];
  legalBasis?: LegalBasis[];
}

export interface ProcessDefinition {
  kind: ProcessKind;
  code: string;
  title: string;
  description: string;
  legalBasis: LegalBasis[];
  phases: PhaseDefinition[];
}

// ---------- Runtime dossier model ----------

export type PartyRole = "applicant" | "co_owner" | "heir" | "representative" | "expropriated_owner";

export interface DossierParty {
  id: string;
  role: PartyRole;
  fullName: string;
  /** Masked national ID, e.g. "I85******G". */
  nationalIdMasked?: string;
  contact?: { email?: string; phone?: string; address?: string };
  fatherName?: string;
}

export type DocumentStatus = "pending" | "uploaded" | "verified" | "rejected" | "missing";

export interface DossierDocument {
  id: string;
  /** e.g. "family_certificate", "ashk_certificate", "valuation_report". */
  type: string;
  name: string;
  status: DocumentStatus;
  uploadedAt?: string; // ISO
  uploadedBy?: string;
  /** Phase/step where the document is required. */
  requiredAtStepId?: string;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  at: string; // ISO
  actor: string; // synthetic civil servant or "system"
  action: string; // short verb phrase
  phaseId?: string;
  stepId?: string;
  details?: string;
}

export type DeadlineKind =
  | "legal" // bound by law (e.g. 2 years for EKB contract, 30 days appeal)
  | "sla" // operational SLA
  | "external"; // waiting on another institution

export interface Deadline {
  id: string;
  kind: DeadlineKind;
  label: string;
  /** ISO due date. */
  dueAt: string;
  /** Phase/step this deadline belongs to. */
  phaseId?: string;
  stepId?: string;
  /** Once met, the deadline is considered resolved. */
  resolvedAt?: string;
}

export type AiInsightKind =
  | "summary"
  | "next_step"
  | "missing_document"
  | "critical_alert"
  | "extraction";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface AiInsight {
  id: string;
  kind: AiInsightKind;
  createdAt: string;
  text: string;
  /** Optional structured payload (e.g. extracted fields). JSON-serializable. */
  data?: { [key: string]: JsonValue };
  /** Confidence 0..1 if applicable. */
  confidence?: number;
  sourceDocumentId?: string;
}

export interface Dossier {
  id: string;
  /** Synthetic citizen tracking code, e.g. "EKB-2026-000123". */
  trackingCode: string;
  process: ProcessKind;
  title: string;
  status: DossierStatus;
  /** Current phase + step ids from the matching ProcessDefinition. */
  currentPhaseId: string;
  currentStepId: string;
  parties: DossierParty[];
  property: {
    description: string;
    zone: string;
    areaSqm?: number;
    cadastralNo?: string;
    /** EKB only. */
    marketPriceAll?: number;
    landPriceAll?: number;
    /** EKB only — declared monthly family income in ALL. */
    familyIncomeAll?: number;
  };
  documents: DossierDocument[];
  /** Document types still missing (canonical type ids). */
  missingDocumentTypes: string[];
  deadlines: Deadline[];
  audit: AuditEvent[];
  insights: AiInsight[];
  createdAt: string;
  updatedAt: string;
  /** Final dossier value once computed (EKB) or compensation (expropriation). */
  finalValueAll?: number;
  notes?: string;
}
