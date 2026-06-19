import Constants from "expo-constants";

// Resolves API base URL from (in order): EXPO_PUBLIC_API_BASE_URL,
// NEXT_PUBLIC_API_BASE_URL, expo extra.apiBaseUrl, then localhost fallback.
export function getApiBaseUrl(): string {
  const env =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl;
  return (env || "http://localhost:8080").replace(/\/$/, "");
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200) || res.statusText}`);
  }
  return (await res.json()) as T;
}

// ---------- types (mirrors of server payloads) ----------

export interface DossierSummary {
  id: string;
  trackingCode: string;
  title: string;
  process: "ekb_privatization" | "expropriation";
  processTitle: string;
  status: string;
  phaseId: string;
  phaseTitle: string;
  stepTitle: string;
  institution: string;
  deadline: {
    label: string;
    dueAt: string;
    daysRemaining: number | null;
    state: string;
  } | null;
  deadlineState: string;
  criticalAlertCount: number;
  updatedAt: string;
}

export interface DossierDetail {
  summary: DossierSummary;
  phase: {
    id: string;
    order: number;
    title: string;
    description: string;
    institutions: string[];
    stepTitle: string;
  } | null;
  nextStep: { title: string; institution: string } | null;
  isFinal: boolean;
  deadline: DossierSummary["deadline"];
  alerts: { severity: string; label: string; description: string }[];
  documents: {
    id: string;
    type: string;
    name: string;
    status: string;
    uploadedAt?: string;
  }[];
  missingDocumentTypes: string[];
  parties: { role: string; fullName: string }[];
  facts: Record<string, unknown>;
}

export interface Dashboard {
  totals: { dossiers: number; active: number; blocked: number };
  criticalAlerts: {
    dossierId: string;
    trackingCode: string;
    title: string;
    label: string;
    description: string;
  }[];
  expiringDeadlines: {
    dossierId: string;
    trackingCode: string;
    title: string;
    state: string;
    daysRemaining: number | null;
    label: string;
    dueAt: string;
  }[];
  recent: DossierSummary[];
}

export interface TrackingPayload {
  trackingCode: string;
  process: string;
  processKind: string;
  status: string;
  currentPhase: { number: number; title: string; institution: string; description: string };
  phasesTimeline: { order: number; title: string; institution: string; state: string }[];
  nextMilestone: string | null;
  nextInstitution: string | null;
  isFinal: boolean;
  deadline: { label: string; dueAt: string; daysRemaining: number | null; state: string } | null;
  citizenDeadlines: { label: string; dueAt: string; kind: string; daysRemaining: number }[];
  missingDocuments: { type: string; label: string }[];
  notifications: { at: string; action: string }[];
  updatedAt: string;
}

export type ExtractResult =
  | {
      ok: true;
      result: {
        processKind: string;
        overallConfidence: number;
        fields: Record<string, { value: unknown; confidence: number; sourceEvidence?: string }>;
        missingFields: string[];
      };
      model: string;
    }
  | { ok: false; error: string };

// ---------- API calls ----------

export const api = {
  dashboard: () => http<Dashboard>("/api/public/dashboard"),
  listDossiers: (q: { process?: string; status?: string; search?: string } = {}) => {
    const u = new URLSearchParams();
    if (q.process) u.set("process", q.process);
    if (q.status) u.set("status", q.status);
    if (q.search) u.set("search", q.search);
    const qs = u.toString();
    return http<{ items: DossierSummary[] }>(`/api/public/dossiers${qs ? `?${qs}` : ""}`);
  },
  dossier: (id: string) => http<DossierDetail>(`/api/public/dossiers/${encodeURIComponent(id)}`),
  track: (code: string) =>
    http<TrackingPayload>(`/api/public/track/${encodeURIComponent(code)}`),
  extract: (input: {
    processKind: "ekb_privatization" | "expropriation";
    documentType: string;
    text: string;
    fileName?: string;
  }) =>
    http<ExtractResult>("/api/public/extract", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
