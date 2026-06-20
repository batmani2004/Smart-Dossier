import { getCriticalAlerts, getDeadlineState, getNextStep } from "./engine";
import { buildAiGisAssessment, type AiGisRiskLevel } from "./gis";
import type { Dossier, ProcessDefinition } from "./types";

export interface DossierSummaryFacts {
  trackingCode: string;
  process: ProcessDefinition["title"];
  status: Dossier["status"];
  currentPhase: string;
  currentStep: string;
  nextStep?: string;
  isFinal: boolean;
  partiesCount: number;
  applicantName?: string;
  documentsUploaded: number;
  documentsMissing: string[];
  criticalAlerts: { label: string; severity: string }[];
  deadlineState: ReturnType<typeof getDeadlineState>["state"];
  daysToNearestDeadline?: number;
  overdueDeadlines: number;
  finalValueAll?: number;
  legalBasis: string[];
  gisAssessment: {
    provider: string;
    sourceLabel: string;
    locationLabel: string;
    zoning: string;
    landCategory: string;
    aiRiskLevel: AiGisRiskLevel;
    aiSignal: string;
    aiUse: string;
    parcelPoints: number;
    accuracyLabel: string;
  };
}

/** Compact, AI-friendly fact bag derived from a dossier + its process. */
export function buildDossierSummaryFacts(
  dossier: Dossier,
  process: ProcessDefinition,
  now: Date = new Date(),
): DossierSummaryFacts {
  const phase = process.phases.find((p) => p.id === dossier.currentPhaseId);
  const step = phase?.steps.find((s) => s.id === dossier.currentStepId);
  const next = getNextStep(dossier, process);
  const alerts = getCriticalAlerts(dossier, process, now);
  const ds = getDeadlineState(dossier, process, now);
  const applicant = dossier.parties.find((p) => p.role === "applicant");
  const gis = buildAiGisAssessment(dossier);

  return {
    trackingCode: dossier.trackingCode,
    process: process.title,
    status: dossier.status,
    currentPhase: phase?.title ?? "—",
    currentStep: step?.title ?? "—",
    nextStep: next && !next.isFinal ? next.step.title : undefined,
    isFinal: !!next?.isFinal,
    partiesCount: dossier.parties.length,
    applicantName: applicant?.fullName,
    documentsUploaded: dossier.documents.filter(
      (d) => d.status === "uploaded" || d.status === "verified",
    ).length,
    documentsMissing: dossier.missingDocumentTypes,
    criticalAlerts: alerts.map((a) => ({ label: a.label, severity: a.severity })),
    deadlineState: ds.state,
    daysToNearestDeadline: ds.daysRemaining,
    overdueDeadlines: ds.overdueCount,
    finalValueAll: dossier.finalValueAll,
    legalBasis: process.legalBasis.map((l) => l.reference),
    gisAssessment: {
      provider: gis.provider,
      sourceLabel: gis.sourceLabel,
      locationLabel: gis.place.label,
      zoning: gis.zoning,
      landCategory: gis.landCategory,
      aiRiskLevel: gis.aiRiskLevel,
      aiSignal: gis.aiSignal,
      aiUse: gis.aiUse,
      parcelPoints: gis.place.parcelPolygon.length,
      accuracyLabel: gis.place.accuracyLabel,
    },
  };
}
