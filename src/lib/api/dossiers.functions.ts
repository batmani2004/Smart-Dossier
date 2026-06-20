import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allDossiers, getById, getByTrackingCode, nextId, resetStore, upsert } from "./store";
import {
  PROCESSES,
  buildDossierSummaryFacts,
  getCriticalAlerts,
  getDeadlineState,
  getNextStep,
} from "@/core";
import type {
  Dossier,
  DossierDocument,
  DossierStatus,
  ExpeditedProcedureReason,
  JsonValue,
  ProcessKind,
  RequesterClaimType,
  RequesterVerificationStatus,
} from "@/core/types";
import {
  addDemoOperator,
  listDemoOperators,
  operatorName,
  removeDemoOperator,
  resetDemoOperators,
} from "@/lib/demo-operators";
import { audit, inferPriority, notFound, type Priority } from "./dossiers-helpers";

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
);

const OPERATOR_LABELS: Record<string, string> = {
  civil_servant_demo: "Operator kadastre",
  ai_assistant: "Asistent AI",
  system: "Sistem",
};

const AUTO_ASSIGN_AFTER_MS = 30 * 60 * 1000;
const IDENTITY_DOC_TYPE = "id_card_copy";
const REPRESENTATION_DOC_TYPE = "legal_authorization";
const EXPEDITE_DEMO_FEE_ALL = 1000;
const EXPEDITE_REASON_LABELS: Record<ExpeditedProcedureReason, string> = {
  health: "Gjendje shendetesore / sociale",
  deadline: "Afat ligjor ose administrativ i afert",
  court: "Vendim gjykate / detyrim institucional",
  social: "Rast social i dokumentuar",
  other: "Arsye tjeter e dokumentuar",
};
const OSM_EMBED_DELTA = 0.004;
const processKindSchema = z.enum(["ekb_privatization", "expropriation", "property_registration"]);

type UploadedFilePayload = {
  name: string;
  mimeType: string;
  sizeBytes: number;
  contentBase64: string;
};

// helpers moved to ./dossiers-helpers

function isActiveDossier(d: Dossier) {
  return d.status !== "completed" && d.status !== "rejected";
}

function operatorWorkloads(dossiers = allDossiers()) {
  return listDemoOperators()
    .map((operator) => ({
      ...operator,
      activeCases: dossiers.filter(
        (d) => isActiveDossier(d) && d.assignedOperatorId === operator.id,
      ).length,
    }))
    .sort((a, b) => a.activeCases - b.activeCases || a.name.localeCompare(b.name));
}

function leastLoadedOperator(dossiers = allDossiers()) {
  return operatorWorkloads(dossiers)[0] ?? listDemoOperators()[0];
}

function applyAssignment(d: Dossier, operatorId: string, mode: "manual" | "auto") {
  const operator =
    listDemoOperators().find((item) => item.id === operatorId) ?? leastLoadedOperator();
  if (!operator) {
    throw new Error("Nuk ka operatore aktive per caktim.");
  }
  d.assignedOperatorId = operator.id;
  d.assignedOperatorName = operator.name;
  d.assignedAt = new Date().toISOString();
  d.assignmentMode = mode;
  d.assignmentDueAt = undefined;
  audit(d, {
    actor: mode === "auto" ? "system" : "admin_demo",
    action:
      mode === "auto"
        ? "Dosja u caktua automatikisht te operatori me më pak çështje"
        : "Admini caktoi operatorin e dosjes",
    details: `${operator.name} · ${operator.unit}`,
  });
  return d;
}

function pendingAssignmentDossiers(now = new Date()) {
  return allDossiers()
    .filter((d) => isActiveDossier(d) && !d.assignedOperatorId)
    .map((d) => ({
      dossier: d,
      dueAt:
        d.assignmentDueAt ??
        new Date(new Date(d.createdAt).getTime() + AUTO_ASSIGN_AFTER_MS).toISOString(),
      overdue:
        new Date(
          d.assignmentDueAt ?? new Date(new Date(d.createdAt).getTime() + AUTO_ASSIGN_AFTER_MS),
        ).getTime() <= now.getTime(),
    }))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

function applyDueAutoAssignments(now = new Date()) {
  return pendingAssignmentDossiers(now)
    .filter((item) => item.overdue)
    .map(({ dossier }) => {
      const operator = leastLoadedOperator();
      applyAssignment(dossier, operator.id, "auto");
      upsert(dossier);
      return {
        id: dossier.id,
        trackingCode: dossier.trackingCode,
        assignedOperatorName: dossier.assignedOperatorName,
      };
    });
}

function cadastralProofDocType(process: ProcessKind) {
  if (process === "property_registration") return "ownership_origin_document";
  return process === "expropriation" ? "ownership_extract" : "ashk_certificate";
}

function requesterRequiredDocuments(process: ProcessKind, claimType: RequesterClaimType) {
  if (process === "property_registration") {
    return [
      "business_nipt_extract",
      "legal_representative_id",
      "property_registration_request",
      "ownership_origin_document",
      "property_plan",
    ];
  }
  const base = [IDENTITY_DOC_TYPE, cadastralProofDocType(process)];
  return claimType === "legal_representative" ? [...base, REPRESENTATION_DOC_TYPE] : base;
}

function hasSupportingDocument(d: Dossier, type: string) {
  if (type === "ashk_certificate") {
    return d.documents.some(
      (doc) =>
        (doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") &&
        doc.status !== "rejected",
    );
  }
  if (type === "ownership_extract") {
    return d.documents.some(
      (doc) =>
        (doc.type === "ownership_extract" ||
          doc.type === "ashk_certificate" ||
          doc.type === "ashk_certificate_final") &&
        doc.status !== "rejected",
    );
  }
  return d.documents.some((doc) => doc.type === type && doc.status !== "rejected");
}

function requesterEvidence(d: Dossier) {
  const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
  const current = d.requesterVerification;
  const claimType = current?.claimType ?? "owner";
  const requiredDocumentTypes = current?.requiredDocumentTypes?.length
    ? current.requiredDocumentTypes
    : requesterRequiredDocuments(d.process, claimType);
  const missingDocumentTypes = requiredDocumentTypes.filter(
    (type) => !hasSupportingDocument(d, type),
  );
  return {
    claimType,
    cadastralSubjectName: current?.cadastralSubjectName ?? applicant?.fullName ?? "",
    status: current?.status ?? "pending",
    requiredDocumentTypes,
    missingDocumentTypes,
    canApprove: missingDocumentTypes.length === 0,
    verifiedAt: current?.verifiedAt,
    verifiedBy: current?.verifiedBy,
    notes: current?.notes,
  };
}

function syncRequesterMissingDocuments(d: Dossier, requiredDocumentTypes: string[]) {
  const nextMissing = new Set(d.missingDocumentTypes ?? []);
  for (const type of requiredDocumentTypes) {
    if (hasSupportingDocument(d, type)) nextMissing.delete(type);
    else nextMissing.add(type);
  }
  d.missingDocumentTypes = Array.from(nextMissing);
}

function canCitizenReceiveDocuments(d: Dossier) {
  return requesterEvidence(d).status === "verified";
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// --------------------- list / filter ---------------------

export const listDossiers = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        process: processKindSchema.optional(),
        status: z
          .enum(["draft", "in_progress", "blocked", "awaiting_external", "completed", "rejected"])
          .optional(),
        phaseId: z.string().optional(),
        search: z.string().optional(),
        priority: z.enum(["low", "normal", "high"]).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    applyDueAutoAssignments();
    const q = (data.search ?? "").trim().toLowerCase();
    const items = allDossiers()
      .filter((d) => !data.process || d.process === data.process)
      .filter((d) => !data.status || d.status === data.status)
      .filter((d) => !data.phaseId || d.currentPhaseId === data.phaseId)
      .filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.trackingCode.toLowerCase().includes(q) ||
          d.parties.some((p) => p.fullName.toLowerCase().includes(q)),
      )
      .map((d) => {
        const proc = PROCESSES[d.process];
        const alerts = getCriticalAlerts(d, proc);
        const ds = getDeadlineState(d, proc);
        return {
          ...d,
          priority: inferPriority(d),
          criticalCount: alerts.filter((a) => a.severity === "critical").length,
          warningCount: alerts.filter((a) => a.severity === "warning").length,
          deadlineState: ds.state,
        };
      })
      .filter((d) => !data.priority || d.priority === data.priority)
      .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
    return { items, total: items.length };
  });

// --------------------- get one ---------------------

export const getDossier = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    return {
      dossier: d,
      summary: buildDossierSummaryFacts(d, process),
      alerts: getCriticalAlerts(d, process),
      deadline: getDeadlineState(d, process),
      nextStep: getNextStep(d, process),
    };
  });

// --------------------- create ---------------------

export const createDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        process: processKindSchema,
        title: z.string().min(3),
        applicantName: z.string().min(2),
        applicantNipt: z.string().min(3).optional(),
        zone: z.string().min(1),
        propertyDescription: z.string().min(1),
        areaSqm: z.number().positive().optional(),
        familyIncomeAll: z.number().nonnegative().optional(),
        marketPriceAll: z.number().nonnegative().optional(),
        landPriceAll: z.number().nonnegative().optional(),
        notes: z.string().optional(),
        documents: z
          .array(
            z.object({
              type: z.string().min(1),
              name: z.string().min(1),
            }),
          )
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const processKind = data.process as ProcessKind;
    const process = PROCESSES[processKind];
    const first =
      processKind === "ekb_privatization" && data.documents.length > 0
        ? (process.phases.find((phase) => phase.id === "ekb-p3") ?? process.phases[0])
        : process.phases[0];
    const prefix =
      data.process === "ekb_privatization"
        ? "d-ekb-"
        : data.process === "property_registration"
          ? "d-biz-"
          : "d-exp-";
    const trackPrefix =
      data.process === "ekb_privatization"
        ? "EKB"
        : data.process === "property_registration"
          ? "BIZ"
          : "EXP";
    const counter = allDossiers().filter((d) => d.process === data.process).length + 1;
    const now = new Date().toISOString();
    const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
    const requesterRequired = requesterRequiredDocuments(processKind, "owner");
    const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
    const requiredDocumentTypes = Array.from(
      new Set([...(first.steps[0].requiredDocuments ?? []), ...requesterRequired]),
    );
    const d: Dossier = {
      id: nextId(prefix),
      trackingCode: `${trackPrefix}-2026-${String(counter + 900).padStart(6, "0")}`,
      process: data.process,
      title: data.title,
      status: "draft",
      currentPhaseId: first.id,
      currentStepId: first.steps[0].id,
      parties: [
        {
          id: "p1",
          role: data.process === "expropriation" ? "expropriated_owner" : "applicant",
          fullName: data.applicantName,
          businessNipt: data.applicantNipt,
        },
      ],
      property: {
        description: data.propertyDescription,
        zone: data.zone,
        areaSqm: data.areaSqm,
        familyIncomeAll: data.familyIncomeAll,
        marketPriceAll: data.marketPriceAll,
        landPriceAll: data.landPriceAll,
      },
      documents: data.documents.map((doc, index) => ({
        id: `doc-app-${index + 1}-${Date.now().toString(36)}`,
        type: doc.type,
        name: doc.name,
        status: "uploaded" as const,
        uploadedAt: now,
        uploadedBy: data.process === "property_registration" ? "business_portal" : "citizen_portal",
        requiredAtStepId: first.steps[0].id,
        notes:
          data.process === "property_registration"
            ? "Ngarkuar nga biznesi ne aplikimin fillestar."
            : "Ngarkuar nga qytetari ne aplikimin fillestar.",
      })),
      missingDocumentTypes: requiredDocumentTypes.filter((type) => !uploadedTypes.has(type)),
      deadlines: [],
      audit: [],
      insights: [],
      requesterVerification: {
        claimType: "owner",
        cadastralSubjectName: data.applicantName,
        status: requiredDocumentTypes.every((type) => uploadedTypes.has(type))
          ? "verified"
          : "needs_documents",
        requiredDocumentTypes: requesterRequired,
        verifiedAt: requiredDocumentTypes.every((type) => uploadedTypes.has(type))
          ? now
          : undefined,
        verifiedBy: requiredDocumentTypes.every((type) => uploadedTypes.has(type))
          ? "system"
          : undefined,
        notes:
          "Duhet vertetuar qe kerkuesi eshte personi ne kartelen kadastrale ose perfaqesues ligjor.",
      },
      createdAt: now,
      updatedAt: now,
      assignmentDueAt,
      submittedFrom:
        data.process === "property_registration" ? "business_portal" : "citizen_portal",
      notes: data.notes,
    };
    audit(d, {
      actor: data.process === "property_registration" ? "business_portal" : "citizen_portal",
      action:
        data.process === "property_registration"
          ? "Aplikim i ri nga biznesi"
          : "Aplikim i ri nga qytetari",
      details:
        data.process === "property_registration"
          ? `NIPT ${data.applicantNipt ?? "-"} · ne pritje per caktim operatori · auto pas 30 minutash`
          : `Në pritje për caktim operatori · auto pas 30 minutash`,
    });
    upsert(d);
    return { id: d.id, trackingCode: d.trackingCode, trackingUrl: `/track/${d.trackingCode}` };
  });

export const createBusinessPropertyApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        businessName: z.string().min(2),
        nipt: z.string().min(3),
        representativeName: z.string().min(2),
        zone: z.string().min(1),
        propertyDescription: z.string().min(1),
        cadastralNo: z.string().optional(),
        areaSqm: z.number().positive().optional(),
        notes: z.string().optional(),
        documents: z
          .array(
            z.object({
              type: z.string().min(1),
              name: z.string().min(1),
            }),
          )
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const processKind: ProcessKind = "property_registration";
    const process = PROCESSES[processKind];
    const first = process.phases[0];
    const counter = allDossiers().filter((d) => d.process === processKind).length + 1;
    const now = new Date().toISOString();
    const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
    const requiredDocumentTypes = requesterRequiredDocuments(processKind, "owner");
    const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
    const missing = Array.from(
      new Set([...(first.steps[0].requiredDocuments ?? []), ...requiredDocumentTypes]),
    ).filter((type) => !uploadedTypes.has(type));
    const d: Dossier = {
      id: nextId("d-biz-"),
      trackingCode: `BIZ-2026-${String(counter + 900).padStart(6, "0")}`,
      process: processKind,
      title: `Regjistrim prone biznesi - ${data.businessName}`,
      status: "draft",
      currentPhaseId: first.id,
      currentStepId: first.steps[0].id,
      parties: [
        {
          id: "p1",
          role: "applicant",
          fullName: data.businessName,
          businessNipt: data.nipt.trim().toUpperCase(),
        },
        {
          id: "p2",
          role: "representative",
          fullName: data.representativeName,
        },
      ],
      property: {
        description: data.propertyDescription,
        zone: data.zone,
        cadastralNo: data.cadastralNo?.trim() || undefined,
        areaSqm: data.areaSqm,
      },
      documents: data.documents.map((doc, index) => ({
        id: `doc-biz-${index + 1}-${Date.now().toString(36)}`,
        type: doc.type,
        name: doc.name,
        status: "uploaded" as const,
        uploadedAt: now,
        uploadedBy: "business_portal",
        notes: "Ngarkuar nga biznesi ne aplikimin fillestar.",
      })),
      missingDocumentTypes: missing,
      deadlines: [
        {
          id: "biz-dl-1",
          kind: "sla",
          label: "Shqyrtimi fillestar i dokumentacionit",
          dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          phaseId: first.id,
          stepId: first.steps[0].id,
        },
      ],
      audit: [],
      insights: [],
      requesterVerification: {
        claimType: "owner",
        cadastralSubjectName: data.businessName,
        status: missing.length === 0 ? "verified" : "needs_documents",
        requiredDocumentTypes,
        verifiedAt: missing.length === 0 ? now : undefined,
        verifiedBy: missing.length === 0 ? "system" : undefined,
        notes: `Subjekt biznesi i identifikuar me NIPT ${data.nipt.trim().toUpperCase()}.`,
      },
      createdAt: now,
      updatedAt: now,
      assignmentDueAt,
      submittedFrom: "business_portal",
      notes: data.notes?.trim() || undefined,
    };
    audit(d, {
      actor: "business_portal",
      action: "Aplikim i ri biznesi per regjistrim prone",
      details: `NIPT ${data.nipt.trim().toUpperCase()} · ${data.documents.length} dokumente te ngarkuara · auto-assign pas 30 minutash`,
    });
    upsert(d);
    return { id: d.id, trackingCode: d.trackingCode, trackingUrl: `/track/${d.trackingCode}` };
  });

export const createExpropriationCompensationApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        applicantType: z.enum(["citizen", "business"]),
        applicantName: z.string().min(2),
        nipt: z.string().optional(),
        representativeName: z.string().optional(),
        zone: z.string().min(1),
        propertyDescription: z.string().min(1),
        cadastralNo: z.string().optional(),
        areaSqm: z.number().positive().optional(),
        projectName: z.string().optional(),
        compensationAmountAll: z.number().nonnegative().optional(),
        bankAccountLabel: z.string().optional(),
        notes: z.string().optional(),
        documents: z
          .array(
            z.object({
              type: z.string().min(1),
              name: z.string().min(1),
            }),
          )
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (data.applicantType === "business" && !data.nipt?.trim()) {
      throw new Error("Per biznesin kerkohet NIPT.");
    }
    const processKind: ProcessKind = "expropriation";
    const process = PROCESSES[processKind];
    const currentPhase = process.phases.find((phase) => phase.id === "exp-p2") ?? process.phases[0];
    const currentStep =
      currentPhase.steps.find((step) => step.id === "exp-s2") ?? currentPhase.steps[0];
    const counter = allDossiers().filter((d) => d.process === processKind).length + 1;
    const now = new Date().toISOString();
    const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
    const source = data.applicantType === "business" ? "business_portal" : "citizen_portal";
    const requiredDocumentTypes =
      data.applicantType === "business"
        ? [
            "business_nipt_extract",
            "legal_representative_id",
            "ownership_extract",
            "expropriation_notice",
            "compensation_claim_request",
            "bank_account_certificate",
          ]
        : [
            "id_card_copy",
            "ownership_extract",
            "civil_status_extract",
            "expropriation_notice",
            "compensation_claim_request",
            "bank_account_certificate",
          ];
    const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
    const missing = requiredDocumentTypes.filter((type) => !uploadedTypes.has(type));
    const projectName =
      data.projectName?.trim() || "Projekt publik me vendim shpronesimi / interes publik";
    const bankTail = data.bankAccountLabel?.trim().slice(-4);
    const d: Dossier = {
      id: nextId("d-exp-"),
      trackingCode: `EXP-2026-${String(counter + 900).padStart(6, "0")}`,
      process: processKind,
      title:
        data.applicantType === "business"
          ? `Kompensim shpronesimi biznesi - ${data.applicantName}`
          : `Kompensim shpronesimi qytetari - ${data.applicantName}`,
      status: "draft",
      currentPhaseId: currentPhase.id,
      currentStepId: currentStep.id,
      parties: [
        {
          id: "p1",
          role: "expropriated_owner",
          fullName: data.applicantName,
          businessNipt:
            data.applicantType === "business" ? data.nipt?.trim().toUpperCase() : undefined,
        },
        ...(data.representativeName?.trim()
          ? [
              {
                id: "p2",
                role: "representative" as const,
                fullName: data.representativeName.trim(),
              },
            ]
          : []),
      ],
      property: {
        description: data.propertyDescription,
        zone: data.zone,
        cadastralNo: data.cadastralNo?.trim() || undefined,
        areaSqm: data.areaSqm,
      },
      documents: data.documents.map((doc, index) => ({
        id: `doc-exp-${index + 1}-${Date.now().toString(36)}`,
        type: doc.type,
        name: doc.name,
        status: "uploaded" as const,
        uploadedAt: now,
        uploadedBy: source,
        notes:
          data.applicantType === "business"
            ? "Ngarkuar nga biznesi per kompensim shpronesimi."
            : "Ngarkuar nga qytetari per kompensim shpronesimi.",
      })),
      missingDocumentTypes: missing,
      deadlines: [
        {
          id: "exp-claim-dl-1",
          kind: "sla",
          label: "Verifikim i pronesise dhe dokumentacionit",
          dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          phaseId: currentPhase.id,
          stepId: currentStep.id,
        },
        {
          id: "exp-claim-dl-2",
          kind: "external",
          label: "Pagesa nga Ministria e Ekonomise",
          dueAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          phaseId: "exp-p5",
          stepId: "exp-s5",
        },
      ],
      audit: [],
      insights: [
        {
          id: "ins-exp-payment",
          kind: "next_step",
          createdAt: now,
          text: "Pas verifikimit dhe vleresimit, dosja kalon te faza e pageses nga Ministria e Ekonomise.",
          confidence: 0.88,
        },
      ],
      requesterVerification: {
        claimType: data.representativeName?.trim() ? "legal_representative" : "owner",
        cadastralSubjectName: data.applicantName,
        status: missing.length === 0 ? "verified" : "needs_documents",
        requiredDocumentTypes,
        verifiedAt: missing.length === 0 ? now : undefined,
        verifiedBy: missing.length === 0 ? "system" : undefined,
        notes:
          data.applicantType === "business"
            ? `Subjekt biznesi me NIPT ${data.nipt?.trim().toUpperCase()} ne kerkese kompensimi.`
            : "Kerkese kompensimi nga pronari / perfaqesuesi i prones se shpronesuar.",
      },
      createdAt: now,
      updatedAt: now,
      assignmentDueAt,
      submittedFrom: source,
      finalValueAll: data.compensationAmountAll,
      notes: [
        data.notes?.trim(),
        `Projekt: ${projectName}`,
        bankTail ? `IBAN/llogari bankare e deklaruar: ****${bankTail}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    };
    audit(d, {
      actor: source,
      action:
        data.applicantType === "business"
          ? "Aplikim biznesi per kompensim shpronesimi"
          : "Aplikim qytetari per kompensim shpronesimi",
      details: `${projectName} · kalon per shqyrtim operatori dhe disbursim nga Ministria e Ekonomise`,
    });
    upsert(d);
    return { id: d.id, trackingCode: d.trackingCode, trackingUrl: `/track/${d.trackingCode}` };
  });

// --------------------- patch ---------------------

export const patchDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        title: z.string().optional(),
        status: z
          .enum(["draft", "in_progress", "blocked", "awaiting_external", "completed", "rejected"])
          .optional(),
        notes: z.string().optional(),
        finalValueAll: z.number().nonnegative().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const changes: string[] = [];
    if (data.title && data.title !== d.title) {
      d.title = data.title;
      changes.push("titulli");
    }
    if (data.status && data.status !== d.status) {
      d.status = data.status as DossierStatus;
      changes.push(`status=${data.status}`);
    }
    if (data.notes !== undefined) {
      d.notes = data.notes;
      changes.push("shënime");
    }
    if (data.finalValueAll !== undefined) {
      d.finalValueAll = data.finalValueAll;
      changes.push(`vlerë=${data.finalValueAll}`);
    }
    if (changes.length) {
      audit(d, {
        actor: "civil_servant_demo",
        action: "Përditësim dosjeje",
        details: changes.join(", "),
      });
      upsert(d);
    }
    return { ok: true, changes };
  });

// --------------------- requester / legal representative verification ---------------------

export const updateRequesterVerification = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        claimType: z.enum(["owner", "legal_representative"]),
        cadastralSubjectName: z.string().min(2).optional(),
        status: z.enum(["pending", "verified", "needs_documents", "rejected"]),
        notes: z.string().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();

    const requiredDocumentTypes = requesterRequiredDocuments(d.process, data.claimType);
    syncRequesterMissingDocuments(d, requiredDocumentTypes);
    const missingDocumentTypes = requiredDocumentTypes.filter(
      (type) => !hasSupportingDocument(d, type),
    );
    if (data.status === "verified" && missingDocumentTypes.length > 0) {
      throw new Error(
        `Nuk mund te verifikohet pa dokumentet: ${missingDocumentTypes.map(docLabel).join(", ")}`,
      );
    }

    const now = new Date().toISOString();
    const nextStatus: RequesterVerificationStatus =
      data.status === "verified" && missingDocumentTypes.length === 0 ? "verified" : data.status;
    d.requesterVerification = {
      claimType: data.claimType,
      cadastralSubjectName: data.cadastralSubjectName?.trim() || d.parties[0]?.fullName,
      status: nextStatus,
      requiredDocumentTypes,
      verifiedAt: nextStatus === "verified" ? now : undefined,
      verifiedBy: nextStatus === "verified" ? "civil_servant_demo" : undefined,
      notes: data.notes?.trim() || undefined,
    };

    audit(d, {
      actor: "civil_servant_demo",
      action:
        nextStatus === "verified"
          ? "E drejta e kerkuesit u verifikua"
          : nextStatus === "rejected"
            ? "E drejta e kerkuesit u refuzua"
            : "Verifikimi i kerkuesit kerkon plotesim",
      details: `${data.claimType === "legal_representative" ? "Perfaqesues ligjor" : "Pronari/kerkuesi"} · ${
        d.requesterVerification.cadastralSubjectName ?? "-"
      }`,
    });
    upsert(d);
    return { ok: true, requesterVerification: d.requesterVerification };
  });

// --------------------- expedited procedure review ---------------------

export const reviewExpeditedProcedure = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        status: z.enum(["approved", "rejected"]),
        reviewNote: z.string().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    if (!d.expeditedProcedure || d.expeditedProcedure.status === "not_requested") {
      throw new Error("Nuk ka kerkese per procedure te pershpejtuar.");
    }

    d.expeditedProcedure = {
      ...d.expeditedProcedure,
      status: data.status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "civil_servant_demo",
      reviewNote: data.reviewNote?.trim() || undefined,
    };
    audit(d, {
      actor: "civil_servant_demo",
      action:
        data.status === "approved"
          ? "Procedura e pershpejtuar u miratua"
          : "Procedura e pershpejtuar u refuzua",
      details: data.reviewNote?.trim() || d.expeditedProcedure.reasonLabel,
    });
    upsert(d);
    return { ok: true, expeditedProcedure: d.expeditedProcedure };
  });

// --------------------- advance phase/step ---------------------

export const advanceDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    const next = getNextStep(d, process);
    if (!next) throw new Error("Cannot advance: invalid current state");
    if (next.isFinal) {
      if (d.status !== "completed") {
        d.status = "completed";
        audit(d, {
          actor: "civil_servant_demo",
          action: "Procedura u mbyll",
          phaseId: d.currentPhaseId,
          stepId: d.currentStepId,
        });
        upsert(d);
      }
      return { ok: true, final: true };
    }
    const fromPhase = d.currentPhaseId;
    const fromStep = d.currentStepId;
    d.currentPhaseId = next.phase.id;
    d.currentStepId = next.step.id;
    if (d.status === "draft") d.status = "in_progress";
    audit(d, {
      actor: "civil_servant_demo",
      action: "Kalim në hapin tjetër",
      phaseId: next.phase.id,
      stepId: next.step.id,
      details: `nga ${fromPhase}/${fromStep} → ${next.phase.id}/${next.step.id}`,
    });
    upsert(d);
    return {
      ok: true,
      final: false,
      currentPhaseId: d.currentPhaseId,
      currentStepId: d.currentStepId,
    };
  });

// --------------------- upload document ---------------------

export const uploadDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string(),
        type: z.string().min(1),
        name: z.string().min(1),
        // demo only — base64 or short text representation. capped to keep things lightweight
        content: z.string().max(200_000).optional(),
        aiGenerated: z.boolean().optional(),
        electronicSeal: z.boolean().optional(),
        extracted: z.record(jsonValueSchema).optional(),
        confidence: z.number().min(0).max(1).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const doc: DossierDocument = {
      id: `doc-${d.documents.length + 1}-${Date.now().toString(36)}`,
      type: data.type,
      name: data.name,
      status: data.electronicSeal ? "verified" : "uploaded",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "civil_servant_demo",
      notes: [
        data.content ? `inline content (${data.content.length} bytes)` : null,
        data.electronicSeal
          ? "Vulosur elektronikisht nga Smart Dossier me vulen e institucionit (/stamps/ashk-demo-stamp.png)."
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    };
    d.documents = [...d.documents, doc];
    d.missingDocumentTypes = d.missingDocumentTypes.filter((t) => t !== data.type);
    syncRequesterMissingDocuments(d, requesterEvidence(d).requiredDocumentTypes);
    if (data.extracted) {
      d.insights = [
        ...d.insights,
        {
          id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
          kind: "extraction",
          createdAt: new Date().toISOString(),
          text: `AI extraction: ${data.type}`,
          data: data.extracted,
          confidence: data.confidence ?? 0.8,
          sourceDocumentId: doc.id,
        },
      ];
    }
    audit(d, {
      actor: data.aiGenerated ? "ai_assistant" : "civil_servant_demo",
      action: data.electronicSeal
        ? "PDF u ngarkua dhe u vulos elektronikisht"
        : data.aiGenerated
          ? "Dokument i gjeneruar (AI)"
          : "Dokument u ngarkua",
      details: data.electronicSeal
        ? `${data.type} — ${data.name} — dërguar qytetarit`
        : `${data.type} — ${data.name}`,
    });
    upsert(d);
    return { ok: true, documentId: doc.id };
  });

// --------------------- assignment ---------------------

export const assignDossier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string(), operatorId: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    applyAssignment(d, data.operatorId, "manual");
    upsert(d);
    return {
      ok: true,
      assignedOperatorId: d.assignedOperatorId,
      assignedOperatorName: d.assignedOperatorName,
    };
  });

export const runAutoAssignment = createServerFn({ method: "POST" }).handler(async () => {
  return { ok: true, assigned: applyDueAutoAssignments() };
});

export const addOperator = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().min(2),
        unit: z.string().min(2),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const operator = addDemoOperator(data);
    return { ok: true, operator };
  });

export const removeOperator = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    if (listDemoOperators().length <= 1) {
      throw new Error("Duhet te mbetet te pakten nje operator aktiv.");
    }
    const removed = removeDemoOperator(data.id);
    if (!removed) {
      throw new Error("Operatori nuk u gjet.");
    }
    const now = new Date().toISOString();
    let requeued = 0;
    for (const dossier of allDossiers()) {
      if (dossier.assignedOperatorId !== removed.id) continue;
      dossier.assignedOperatorId = undefined;
      dossier.assignedOperatorName = undefined;
      dossier.assignedAt = undefined;
      dossier.assignmentMode = undefined;
      dossier.assignmentDueAt = now;
      audit(dossier, {
        actor: "admin_demo",
        action: "Operatori u hoq nga lista aktive",
        details: `${removed.name} u hoq; dosja u kthye ne radhen e caktimit.`,
      });
      upsert(dossier);
      requeued += 1;
    }
    return { ok: true, removed, requeued };
  });

// --------------------- dashboard ---------------------

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  applyDueAutoAssignments();
  const dossiers = allDossiers();

  const countsByProcess: Record<string, number> = {};
  const countsByStatus: Record<string, number> = {};
  const countsByPhase: {
    processKind: ProcessKind;
    phaseId: string;
    phaseTitle: string;
    count: number;
  }[] = [];

  const phaseAcc = new Map<
    string,
    { processKind: ProcessKind; phaseId: string; phaseTitle: string; count: number }
  >();

  for (const d of dossiers) {
    countsByProcess[d.process] = (countsByProcess[d.process] ?? 0) + 1;
    countsByStatus[d.status] = (countsByStatus[d.status] ?? 0) + 1;
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const key = `${d.process}:${d.currentPhaseId}`;
    const prev = phaseAcc.get(key);
    if (prev) prev.count += 1;
    else
      phaseAcc.set(key, {
        processKind: d.process,
        phaseId: d.currentPhaseId,
        phaseTitle: phase?.title ?? d.currentPhaseId,
        count: 1,
      });
  }
  for (const v of phaseAcc.values()) countsByPhase.push(v);
  countsByPhase.sort((a, b) => b.count - a.count);

  const now = new Date();
  const criticalAlerts = dossiers.flatMap((d) =>
    getCriticalAlerts(d, PROCESSES[d.process], now)
      .filter((a) => a.severity === "critical")
      .map((a) => ({
        dossierId: d.id,
        trackingCode: d.trackingCode,
        title: d.title,
        alert: a,
      })),
  );

  const expiring = dossiers
    .map((d) => ({ d, ds: getDeadlineState(d, PROCESSES[d.process], now) }))
    .filter((x) => x.ds.state === "due_soon" || x.ds.state === "overdue")
    .map((x) => ({
      dossierId: x.d.id,
      trackingCode: x.d.trackingCode,
      title: x.d.title,
      state: x.ds.state,
      daysRemaining: x.ds.daysRemaining,
      label: x.ds.nearest?.label,
      dueAt: x.ds.nearest?.dueAt,
    }))
    .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0));

  // Bottleneck = phase ranked by (a) # dossiers blocked there, (b) avg days in phase,
  // (c) severity weight of step's critical points.
  type Bucket = {
    processKind: ProcessKind;
    phaseId: string;
    phaseTitle: string;
    stuck: number;
    total: number;
    daysSum: number;
    severityWeight: number;
    alertLabels: Set<string>;
  };
  const bottleneckMap = new Map<string, Bucket>();
  const dayMs = 24 * 60 * 60 * 1000;
  for (const d of dossiers) {
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const step = phase?.steps.find((s) => s.id === d.currentStepId);
    const key = `${d.process}:${d.currentPhaseId}`;
    const stuck = d.status === "blocked" || d.status === "awaiting_external" ? 1 : 0;
    // days in current phase — last "Kalim" audit into this phase, else createdAt
    const enteredAt =
      [...d.audit]
        .reverse()
        .find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ??
      d.createdAt;
    const daysInPhase = Math.max(
      0,
      Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs),
    );
    const sevWeight = (step?.criticalPoints ?? []).reduce(
      (acc, c) => acc + (c.severity === "critical" ? 3 : c.severity === "warning" ? 1 : 0),
      0,
    );
    const prev = bottleneckMap.get(key);
    if (prev) {
      prev.stuck += stuck;
      prev.total += 1;
      prev.daysSum += daysInPhase;
      (step?.criticalPoints ?? []).forEach((c) => prev.alertLabels.add(c.label));
    } else {
      bottleneckMap.set(key, {
        processKind: d.process,
        phaseId: d.currentPhaseId,
        phaseTitle: phase?.title ?? d.currentPhaseId,
        stuck,
        total: 1,
        daysSum: daysInPhase,
        severityWeight: sevWeight,
        alertLabels: new Set((step?.criticalPoints ?? []).map((c) => c.label)),
      });
    }
  }
  const bottlenecks = Array.from(bottleneckMap.values())
    .map((b) => {
      const avgDays = b.total ? Math.round(b.daysSum / b.total) : 0;
      // composite score: stuck*3 + avgDays/7 + severityWeight
      const score = b.stuck * 3 + Math.round(avgDays / 7) + b.severityWeight;
      return {
        processKind: b.processKind,
        phaseId: b.phaseId,
        phaseTitle: b.phaseTitle,
        stuck: b.stuck,
        total: b.total,
        avgDaysInPhase: avgDays,
        severityWeight: b.severityWeight,
        alertLabels: Array.from(b.alertLabels).slice(0, 3),
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const recentExtractions = dossiers
    .flatMap((d) =>
      d.insights
        .filter((i) => i.kind === "extraction" || i.kind === "summary")
        .map((i) => ({
          dossierId: d.id,
          trackingCode: d.trackingCode,
          insight: i,
        })),
    )
    .sort((a, b) => (b.insight.createdAt > a.insight.createdAt ? 1 : -1))
    .slice(0, 8);

  const assignmentQueue = pendingAssignmentDossiers(now).map(({ dossier, dueAt, overdue }) => ({
    id: dossier.id,
    trackingCode: dossier.trackingCode,
    title: dossier.title,
    applicantName: dossier.parties[0]?.fullName ?? "",
    process: dossier.process,
    submittedFrom: dossier.submittedFrom ?? "admin",
    createdAt: dossier.createdAt,
    assignmentDueAt: dueAt,
    overdue,
  }));
  const workloads = operatorWorkloads(dossiers);

  return {
    totals: { dossiers: dossiers.length, ...countsByProcess },
    countsByStatus,
    countsByPhase,
    criticalAlerts: criticalAlerts.slice(0, 12),
    expiringDeadlines: expiring.slice(0, 10),
    bottlenecks,
    recentExtractions,
    assignment: {
      queue: assignmentQueue,
      operatorWorkloads: workloads,
      unassignedCount: assignmentQueue.length,
      autoDueCount: assignmentQueue.filter((item) => item.overdue).length,
    },
  };
});

// --------------------- processes ---------------------

export const getProcesses = createServerFn({ method: "GET" }).handler(async () => {
  return { processes: Object.values(PROCESSES) };
});

// --------------------- reset demo data ---------------------

export const resetDemo = createServerFn({ method: "POST" }).handler(async () => {
  resetDemoOperators();
  return resetStore();
});

// --------------------- citizen tracking (used by /api/public route) ---------------------

const DOC_TYPE_LABELS_SQ: Record<string, string> = {
  family_certificate: "Certifikatë familjare",
  ashk_certificate: "Certifikatë pronësie (ASHK)",
  ashk_certificate_final: "Certifikatë përfundimtare ASHK",
  income_proof: "Vërtetim të ardhurash",
  id_card_copy: "Kopje e kartës së identitetit",
  legal_authorization: "Prokurë / autorizim përfaqësimi",
  ownership_extract: "Ekstrakt pronësie nga kadastra",
  rent_contract_history: "Historik kontrate / qiraje",
  ashk_certificate_copy: "Kopje certifikate ASHK",
  marriage_certificate: "Certifikatë martese",
  business_nipt_extract: "Ekstrakt QKB / NIPT",
  legal_representative_id: "ID e administratorit / perfaqesuesit",
  property_registration_request: "Kerkese per regjistrim prone",
  ownership_origin_document: "Akt origjine pronesie",
  property_plan: "Plan rilevimi / genplan",
  cadastral_map_extract: "Ekstrakt harte kadastrale",
  operator_review_report: "Raport shqyrtimi operatori",
  civil_status_extract: "Ekstrakt i gjendjes civile",
  signed_contract: "Kontratë e nënshkruar",
  citizen_invoice: "Faturë qytetari / mandat pagese",
  dossier_pdf: "Dosje PDF e vulosur",
  vkm_decision: "Vendim VKM",
  valuation_report: "Raport vlerësimi",
  public_interest_justification: "Justifikim interesi publik",
  appeal_form: "Formular ankimi",
  expropriation_notice: "Njoftim / akt shpronesimi",
  compensation_claim_request: "Kerkese per kompensim shpronesimi",
  bank_account_certificate: "Vertetim llogarie bankare / IBAN",
  payment_order: "Urdher pagese nga Ministria e Ekonomise",
  payment_confirmation: "Konfirmim pagese / disbursimi",
  payment_receipt: "Mandat pagese",
  expedite_request_form: "Formular per procedure te pershpejtuar",
  expedite_supporting_document: "Dokument provues per pershpejtim",
};
function docLabel(type: string): string {
  return (
    DOC_TYPE_LABELS_SQ[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function operatorLabel(actor: string): string {
  return OPERATOR_LABELS[actor] ?? actor.replace(/_/g, " ");
}

function routedOperatorForDossier(d: Dossier): { actor: string; label: string } {
  if (d.assignedOperatorId) {
    return {
      actor: d.assignedOperatorId,
      label: d.assignedOperatorName ?? operatorName(d.assignedOperatorId),
    };
  }
  const lastHuman =
    [...(d.audit ?? [])]
      .reverse()
      .find((event) => event.actor !== "system" && event.actor !== "ai_assistant")?.actor ??
    d.documents.find((doc) => doc.uploadedBy && doc.uploadedBy !== "ai_assistant")?.uploadedBy ??
    "civil_servant_demo";

  return { actor: lastHuman, label: operatorLabel(lastHuman) };
}

// Citizen-safe audit filter: only show externally meaningful events.
const CITIZEN_AUDIT_DENY = ["asistent", "AI", "Përditësim dosjeje", "nxjerra me AI", "paraprak"];
function isCitizenAudit(action: string): boolean {
  return !CITIZEN_AUDIT_DENY.some((kw) => action.toLowerCase().includes(kw.toLowerCase()));
}

export function buildTrackingPayload(code: string) {
  const d = getByTrackingCode(code);
  if (!d) return null;
  const process = PROCESSES[d.process];
  const phase = process.phases.find((p) => p.id === d.currentPhaseId);
  const next = getNextStep(d, process);
  const ds = getDeadlineState(d, process);
  const requester = requesterEvidence(d);
  const canReceiveDocuments = canCitizenReceiveDocuments(d);

  const currentOrder = phase?.order ?? 0;
  const phasesTimeline = process.phases.map((p) => ({
    order: p.order,
    title: p.title,
    institution: p.institutions[0] ?? "—",
    state:
      p.order < currentOrder
        ? ("completed" as const)
        : p.order === currentOrder
          ? ("current" as const)
          : ("upcoming" as const),
  }));

  const missingDocuments = (d.missingDocumentTypes ?? []).map((t) => ({
    type: t,
    label: docLabel(t),
  }));

  const deliveredDocuments = d.documents.filter(
    (doc) => doc.status === "verified" || doc.notes?.includes("Vulosur elektronikisht"),
  );
  const citizenDocuments = (canReceiveDocuments ? deliveredDocuments : [])
    .filter((doc) => doc.status === "verified" || doc.notes?.includes("Vulosur elektronikisht"))
    .map((doc) => ({
      id: doc.id,
      type: doc.type,
      label: docLabel(doc.type),
      name: doc.name,
      status: doc.status,
      uploadedAt: doc.uploadedAt ?? null,
      deliveredAt: doc.uploadedAt ?? d.updatedAt,
      electronicallySealed:
        doc.status === "verified" || !!doc.notes?.includes("Vulosur elektronikisht"),
      sealSource: doc.notes?.includes("/stamps/ashk-demo-stamp.png")
        ? "/stamps/ashk-demo-stamp.png"
        : null,
    }));

  const now = Date.now();
  const citizenDeadlines = (d.deadlines ?? [])
    .filter((dl) => !dl.resolvedAt)
    .filter((dl) => dl.kind === "legal" || dl.kind === "external")
    .map((dl) => ({
      label: dl.label,
      dueAt: dl.dueAt,
      kind: dl.kind,
      daysRemaining: Math.ceil((new Date(dl.dueAt).getTime() - now) / 86400000),
    }))
    .sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1));

  const notifications = (d.audit ?? [])
    .filter((a) => isCitizenAudit(a.action))
    .map((a) => ({ at: a.at, action: a.action }))
    .slice(-20)
    .reverse();

  const citizenComplaints = (d.citizenComplaints ?? [])
    .map((c) => ({
      id: c.id,
      createdAt: c.createdAt,
      subject: c.subject,
      status: c.status,
      stage: c.stage,
      phaseTitle: c.phaseTitle ?? null,
      routedToLabel: c.routedToLabel,
    }))
    .slice(-10)
    .reverse();
  const expeditedProcedure = d.expeditedProcedure
    ? {
        status: d.expeditedProcedure.status,
        reason: d.expeditedProcedure.reason,
        reasonLabel: d.expeditedProcedure.reasonLabel,
        justification: d.expeditedProcedure.justification,
        requestedAt: d.expeditedProcedure.requestedAt,
        requestPdfName: d.expeditedProcedure.requestPdfName,
        requestPdfDocumentId:
          d.expeditedProcedure.requestPdfDocumentId ??
          d.documents.find(
            (doc) =>
              doc.type === "expedite_request_form" &&
              doc.name === d.expeditedProcedure?.requestPdfName,
          )?.id ??
          null,
        supportingDocumentName: d.expeditedProcedure.supportingDocumentName,
        supportingDocumentId:
          d.expeditedProcedure.supportingDocumentId ??
          d.documents.find(
            (doc) =>
              doc.type === "expedite_supporting_document" &&
              doc.name === d.expeditedProcedure?.supportingDocumentName,
          )?.id ??
          null,
        paymentRequired: d.expeditedProcedure.paymentRequired,
        paymentAmountAll: d.expeditedProcedure.paymentAmountAll ?? null,
        paymentReceiptName: d.expeditedProcedure.paymentReceiptName ?? null,
        paymentReceiptDocumentId:
          d.expeditedProcedure.paymentReceiptDocumentId ??
          d.documents.find(
            (doc) =>
              doc.type === "payment_receipt" &&
              doc.name === d.expeditedProcedure?.paymentReceiptName,
          )?.id ??
          null,
        reviewedAt: d.expeditedProcedure.reviewedAt ?? null,
        reviewNote: d.expeditedProcedure.reviewNote ?? null,
      }
    : {
        status: "not_requested" as const,
        reason: null,
        reasonLabel: null,
        justification: null,
        requestedAt: null,
        requestPdfName: null,
        requestPdfDocumentId: null,
        supportingDocumentName: null,
        supportingDocumentId: null,
        paymentRequired: true,
        paymentAmountAll: EXPEDITE_DEMO_FEE_ALL,
        paymentReceiptName: null,
        paymentReceiptDocumentId: null,
        reviewedAt: null,
        reviewNote: null,
      };
  const mapPreview =
    d.process === "expropriation"
      ? (() => {
          const facts = akptGisFacts(d);
          return {
            provider: "OpenStreetMap",
            label: facts.place.label,
            lat: facts.place.lat,
            lon: facts.place.lon,
            zoom: facts.place.zoom,
            accuracyLabel: facts.place.accuracyLabel,
            embedUrl: facts.embedUrl,
            url: facts.realMapUrl,
            zoning: facts.zoning,
            landCategory: facts.landCategory,
            parcelPolygon: facts.place.parcelPolygon,
          };
        })()
      : null;

  const compensation =
    d.process === "expropriation"
      ? (() => {
          const paymentOrder = d.documents.find((doc) => doc.type === "payment_order");
          const paymentConfirmation = d.documents.find(
            (doc) => doc.type === "payment_confirmation",
          );
          const statusLabel =
            currentOrder >= 6 || paymentConfirmation
              ? "Pagesa e konfirmuar / ne regjistrim final"
              : currentOrder === 5 || paymentOrder
                ? "Ne disbursim nga Ministria e Ekonomise"
                : currentOrder === 4
                  ? "Ne njoftim dhe afat ankimi"
                  : currentOrder === 3
                    ? "Ne vleresim te kompensimit"
                    : "Ne verifikim te pronesise";
          const nextAction =
            currentOrder >= 6 || paymentConfirmation
              ? "ASHK kryen regjistrimin perfundimtar dhe mbylljen e dosjes."
              : currentOrder >= 5 || paymentOrder
                ? "Pritet konfirmimi i pageses / disbursimit nga Ministria e Ekonomise."
                : "Operatori verifikon dokumentacionin dhe kalon dosjen ne vleresim.";
          return {
            amountAll: d.finalValueAll ?? null,
            ministry: "Ministria e Ekonomise",
            statusLabel,
            nextAction,
            paymentOrderUploaded: !!paymentOrder,
            paymentConfirmed: !!paymentConfirmation,
          };
        })()
      : null;

  // citizen-safe — no PII, no internal staff notes, no AI confidence, no document contents
  return {
    trackingCode: d.trackingCode,
    process: process.title,
    processKind: d.process,
    status: d.status,
    currentPhase: {
      number: phase?.order ?? 0,
      title: phase?.title ?? "—",
      institution: phase?.institutions[0] ?? "—",
      description: phase?.description ?? "",
    },
    phasesTimeline,
    nextMilestone: next && !next.isFinal ? next.step.title : null,
    nextInstitution: next && !next.isFinal ? next.step.institution : null,
    isFinal: !!next?.isFinal,
    deadline: ds.nearest
      ? {
          label: ds.nearest.label,
          dueAt: ds.nearest.dueAt,
          daysRemaining: ds.daysRemaining,
          state: ds.state,
        }
      : null,
    citizenDeadlines,
    missingDocuments,
    requesterVerification: {
      claimType: requester.claimType,
      status: requester.status,
      cadastralSubjectName: requester.cadastralSubjectName,
      canReceiveDocuments,
      heldDocumentsCount: canReceiveDocuments ? 0 : deliveredDocuments.length,
      requiredDocuments: requester.requiredDocumentTypes.map((type) => ({
        type,
        label: docLabel(type),
        uploaded: hasSupportingDocument(d, type),
      })),
      missingDocuments: requester.missingDocumentTypes.map((type) => ({
        type,
        label: docLabel(type),
      })),
      verifiedAt: requester.verifiedAt ?? null,
      notes: requester.notes ?? null,
    },
    citizenDocuments,
    citizenComplaints,
    expeditedProcedure,
    mapPreview,
    compensation,
    notifications,
    updatedAt: d.updatedAt,
  };
}

export function submitExpeditedProcedureRequest(
  code: string,
  input: {
    reason: ExpeditedProcedureReason;
    justification: string;
    requestPdf: UploadedFilePayload;
    supportingDocument: UploadedFilePayload;
    paymentRequired: boolean;
    paymentReceipt?: UploadedFilePayload;
  },
) {
  const d = getByTrackingCode(code);
  if (!d) return null;

  if (input.paymentRequired && !input.paymentReceipt) {
    throw new Error("Mandati i pageses kerkohet kur zgjidhet tarifa e pershpejtimit.");
  }

  const now = new Date().toISOString();
  const requestPdfDocumentId = `doc-${d.documents.length + 1}-${Date.now().toString(36)}`;
  const supportingDocumentId = `doc-${d.documents.length + 2}-${Date.now().toString(36)}`;
  const paymentReceiptDocumentId =
    input.paymentRequired && input.paymentReceipt
      ? `doc-${d.documents.length + 3}-${Date.now().toString(36)}`
      : undefined;
  d.expeditedProcedure = {
    id: `exp-${Date.now().toString(36)}`,
    requestedAt: now,
    status: "submitted",
    reason: input.reason,
    reasonLabel: EXPEDITE_REASON_LABELS[input.reason],
    justification: input.justification.trim(),
    requestPdfName: input.requestPdf.name,
    requestPdfDocumentId,
    supportingDocumentName: input.supportingDocument.name,
    supportingDocumentId,
    paymentRequired: input.paymentRequired,
    paymentAmountAll: input.paymentRequired ? EXPEDITE_DEMO_FEE_ALL : undefined,
    paymentReceiptName: input.paymentRequired ? input.paymentReceipt?.name : undefined,
    paymentReceiptDocumentId,
  };

  const docsToAdd: Array<{
    id: string;
    type: string;
    file: UploadedFilePayload;
    notes: string;
  }> = [
    {
      id: requestPdfDocumentId,
      type: "expedite_request_form",
      file: input.requestPdf,
      notes: "Formular i plotesuar nga qytetari per procedure te pershpejtuar.",
    },
    {
      id: supportingDocumentId,
      type: "expedite_supporting_document",
      file: input.supportingDocument,
      notes: `Dokument provues: ${d.expeditedProcedure.reasonLabel}.`,
    },
  ];
  if (d.expeditedProcedure.paymentRequired && input.paymentReceipt && paymentReceiptDocumentId) {
    docsToAdd.push({
      id: paymentReceiptDocumentId,
      type: "payment_receipt",
      file: input.paymentReceipt,
      notes: `Mandat pagese per tarife demo ${EXPEDITE_DEMO_FEE_ALL} ALL.`,
    });
  }

  for (const doc of docsToAdd) {
    d.documents = [
      ...d.documents,
      {
        id: doc.id,
        type: doc.type,
        name: doc.file.name,
        status: "uploaded",
        uploadedAt: now,
        uploadedBy: "citizen_portal",
        mimeType: doc.file.mimeType,
        sizeBytes: doc.file.sizeBytes,
        contentBase64: doc.file.contentBase64,
        notes: doc.notes,
      },
    ];
    d.missingDocumentTypes = d.missingDocumentTypes.filter((type) => type !== doc.type);
  }

  audit(d, {
    actor: "citizen_portal",
    action: "Kerkese per procedure te pershpejtuar u dorezua",
    details: `${d.expeditedProcedure.reasonLabel} · ${d.expeditedProcedure.paymentRequired ? "me mandat pagese" : "pa tarife"}`,
  });
  upsert(d);
  return {
    status: d.expeditedProcedure.status,
    reasonLabel: d.expeditedProcedure.reasonLabel,
    requestedAt: d.expeditedProcedure.requestedAt,
  };
}

export function submitCitizenComplaint(
  code: string,
  input: {
    stage?: "phase_review" | "final_review";
    subject: string;
    message: string;
    contact?: string;
  },
) {
  const d = getByTrackingCode(code);
  if (!d) return null;

  const process = PROCESSES[d.process];
  const phase = process.phases.find((p) => p.id === d.currentPhaseId);
  const step = phase?.steps.find((s) => s.id === d.currentStepId);
  const routedTo = routedOperatorForDossier(d);
  const now = new Date().toISOString();
  const stage =
    input.stage ??
    ((d.status === "completed" || d.status === "rejected" ? "final_review" : "phase_review") as
      | "phase_review"
      | "final_review");
  const complaint = {
    id: `cmp-${(d.citizenComplaints?.length ?? 0) + 1}-${Date.now().toString(36)}`,
    createdAt: now,
    stage,
    subject: input.subject.trim(),
    message: input.message.trim(),
    contact: input.contact?.trim() || undefined,
    status: "new" as const,
    phaseId: phase?.id,
    phaseTitle: phase?.title,
    stepId: step?.id,
    stepTitle: step?.title,
    routedTo: routedTo.actor,
    routedToLabel: routedTo.label,
  };

  d.citizenComplaints = [...(d.citizenComplaints ?? []), complaint];
  audit(d, {
    actor: "citizen_portal",
    action: "Ankesë qytetari u përcoll te operatori",
    phaseId: phase?.id,
    stepId: step?.id,
    details: `${complaint.subject} — ${complaint.routedToLabel}`,
  });
  upsert(d);

  return {
    id: complaint.id,
    createdAt: complaint.createdAt,
    subject: complaint.subject,
    status: complaint.status,
    stage: complaint.stage,
    phaseTitle: complaint.phaseTitle ?? null,
    routedToLabel: complaint.routedToLabel,
  };
}

function stripForPdf(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "-");
}

function escapePdfText(value: string): string {
  return stripForPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function sanitizePdfFileName(value: string): string {
  return stripForPdf(value)
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90);
}

function sanitizeDownloadFileName(value: string): string {
  return (
    stripForPdf(value)
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 100) || "dokument"
  );
}

function buildSimplePdf(content: string): Uint8Array {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function mapPlaceForZone(zone: string) {
  const q = zone.toLowerCase();
  if (q.includes("durres") || q.includes("durr")) {
    return { label: "Durres", lat: 41.3231, lon: 19.4414, zoom: 15 };
  }
  if (q.includes("vlore") || q.includes("vlor")) {
    return { label: "Vlore", lat: 40.4661, lon: 19.4914, zoom: 15 };
  }
  if (q.includes("shkoder") || q.includes("shkod")) {
    return { label: "Shkoder", lat: 42.0693, lon: 19.5033, zoom: 15 };
  }
  if (q.includes("elbasan")) {
    return { label: "Elbasan", lat: 41.1125, lon: 20.0822, zoom: 15 };
  }
  if (q.includes("fier")) {
    return { label: "Fier", lat: 40.7239, lon: 19.5561, zoom: 15 };
  }
  if (q.includes("maliq") || q.includes("maliqi")) {
    return { label: "Maliq", lat: 40.7083, lon: 20.7, zoom: 17 };
  }
  if (q.includes("korce") || q.includes("korc")) {
    return { label: "Korce", lat: 40.6186, lon: 20.7808, zoom: 16 };
  }
  return { label: "Tirane", lat: 41.3275, lon: 19.8187, zoom: 15 };
}

function stableHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1_000_000;
  }
  return hash;
}

function propertyParcelPolygon(place: { lat: number; lon: number }, hash: number) {
  const latSize = 0.0003 + (hash % 5) * 0.000035;
  const lonSize = 0.00042 + (Math.floor(hash / 7) % 5) * 0.000045;
  return [
    {
      lat: Number((place.lat - latSize * 0.56).toFixed(6)),
      lon: Number((place.lon - lonSize * 0.68).toFixed(6)),
    },
    {
      lat: Number((place.lat - latSize * 0.36).toFixed(6)),
      lon: Number((place.lon + lonSize * 0.58).toFixed(6)),
    },
    {
      lat: Number((place.lat + latSize * 0.42).toFixed(6)),
      lon: Number((place.lon + lonSize * 0.72).toFixed(6)),
    },
    {
      lat: Number((place.lat + latSize * 0.64).toFixed(6)),
      lon: Number((place.lon - lonSize * 0.32).toFixed(6)),
    },
  ];
}

function parcelPolygonLabel(points: Array<{ lat: number; lon: number }>) {
  return points.map((point) => `${point.lat}, ${point.lon}`).join(" | ");
}

function knownParcelForDossier(d: Dossier) {
  const zone = d.property.zone.toLowerCase();
  const cadastralNo = d.property.cadastralNo?.trim();
  if (
    d.trackingCode === "EXP-2026-000003" ||
    ((zone.includes("maliq") || zone.includes("maliqi")) && cadastralNo === "6/9")
  ) {
    return {
      label: "Parcela demo 6/9 - Maliq",
      lat: 40.70402,
      lon: 20.69816,
      zoom: 18,
      parcelPolygon: [
        { lat: 40.703818, lon: 20.697905 },
        { lat: 40.70391, lon: 20.698438 },
        { lat: 40.70419, lon: 20.698366 },
        { lat: 40.704128, lon: 20.697872 },
      ],
    };
  }
  return null;
}

function propertyMapLocation(d: Dossier) {
  const base = mapPlaceForZone(d.property.zone);
  const knownParcel = knownParcelForDossier(d);
  if (knownParcel) {
    return {
      ...base,
      label: `Vendodhja e parceles - ${base.label}`,
      lat: knownParcel.lat,
      lon: knownParcel.lon,
      zoom: Math.max(base.zoom, knownParcel.zoom),
      parcelPolygon: knownParcel.parcelPolygon,
      accuracyLabel:
        "Poligon demo i korrigjuar ne toke per kete dosje; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
    };
  }
  const hash = stableHash(
    `${d.trackingCode}:${d.property.zone}:${d.property.description}:${d.property.cadastralNo ?? ""}`,
  );
  const latOffset = (((hash % 201) - 100) / 100) * 0.0042;
  const lonOffset = (((Math.floor(hash / 201) % 201) - 100) / 100) * 0.0062;
  const lat = Number((base.lat + latOffset).toFixed(6));
  const lon = Number((base.lon + lonOffset).toFixed(6));
  return {
    ...base,
    label: `Vendodhja orientuese e prones - ${base.label}`,
    lat,
    lon,
    zoom: Math.max(base.zoom, 17),
    parcelPolygon: propertyParcelPolygon({ lat, lon }, hash),
    accuracyLabel:
      "Poligon demo i parceles; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG.",
  };
}

function osmViewUrl(place: { lat: number; lon: number; zoom: number }) {
  return `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=${place.zoom}/${place.lat}/${place.lon}`;
}

function osmEmbedUrl(place: { lat: number; lon: number }) {
  const bbox = [
    (place.lon - OSM_EMBED_DELTA).toFixed(5),
    (place.lat - OSM_EMBED_DELTA).toFixed(5),
    (place.lon + OSM_EMBED_DELTA).toFixed(5),
    (place.lat + OSM_EMBED_DELTA).toFixed(5),
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat},${place.lon}`;
}

function akptGisFacts(d: Dossier) {
  const description = d.property.description.toLowerCase();
  const zone = d.property.zone.toLowerCase();
  const isAgricultural =
    description.includes("bujq") ||
    description.includes("agric") ||
    description.includes("toke") ||
    description.includes("tok");
  const zoning = zone.includes("tiran")
    ? "Zone periurbane / verifikim me harte"
    : isAgricultural
      ? "Zone rurale"
      : "Zone urbane";
  const landCategory = isAgricultural
    ? "Toke bujqesore"
    : description.includes("ndertes")
      ? "Truall + ndertese"
      : "Pasuri e paluajtshme";
  const place = propertyMapLocation(d);
  return {
    zoning,
    landCategory,
    place,
    realMapUrl: osmViewUrl(place),
    embedUrl: osmEmbedUrl(place),
  };
}

function buildAkptMapPdf(d: Dossier): Uint8Array {
  const process = PROCESSES[d.process];
  const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
  const { zoning, landCategory, place, realMapUrl } = akptGisFacts(d);
  const generatedAt = new Date().toLocaleString("sq-AL");
  const lines = [
    "SMART DOSSIER",
    "PRINTIM GIS - VENDODHJA E PRONES",
    "AKPT / e-Harta GIS - burim vizual OpenStreetMap",
    "",
    `Kodi i gjurmimit: ${d.trackingCode}`,
    `Link qytetari: /track/${d.trackingCode}`,
    `Procesi: ${process.title}`,
    `Qytetari / pronari: ${applicant?.fullName ?? "-"}`,
    `Pasuria: ${d.property.description}`,
    `Zona: ${d.property.zone}`,
    `Siperfaqe: ${d.property.areaSqm ? `${d.property.areaSqm} m2` : "-"}`,
    `Koordinata orientuese e prones: ${place.lat}, ${place.lon}`,
    `Poligoni i parceles: ${place.parcelPolygon.length} pika - ${parcelPolygonLabel(place.parcelPolygon).slice(0, 88)}`,
    `Zonimi GIS: ${zoning}`,
    `Kategoria ligjore e tokes: ${landCategory}`,
    `Harta reale: ${realMapUrl}`,
    `Gjeneruar: ${generatedAt}`,
    "",
    "Shenim: Ky PDF eshte printim demo i konsultimit te hartes. Nuk kryen shkrim",
    "ne sistemet e AKPT/ASHK dhe perdoret vetem si evidence pune ne dosje.",
    "Ne zbatim real marker/poligon vjen nga koordinatat kadastrale te prones.",
  ];

  const textCommands = lines
    .map((line, index) => {
      const y = 790 - index * 18;
      const fontSize = index === 0 ? 18 : index === 1 ? 14 : 9.5;
      return `/F1 ${fontSize} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
    })
    .join("\n");

  const mapLabel = escapePdfText(`${d.property.zone} - ${zoning}`);
  const content = [
    "q",
    "0.96 0.99 0.97 rg",
    "36 36 523 770 re f",
    "Q",
    "q",
    "0.01 0.18 0.35 rg",
    "BT",
    textCommands,
    "ET",
    "Q",
    "q",
    "0.0 0.43 0.32 RG",
    "2 w",
    "36 744 523 0 m S",
    "Q",
    "q",
    "0.91 0.96 0.93 rg",
    "54 70 487 305 re f",
    "0.0 0.43 0.32 RG",
    "1.2 w",
    "54 70 487 305 re S",
    "0.78 0.88 0.82 RG",
    "0.5 w",
    "108 70 m 108 375 l S",
    "162 70 m 162 375 l S",
    "216 70 m 216 375 l S",
    "270 70 m 270 375 l S",
    "324 70 m 324 375 l S",
    "378 70 m 378 375 l S",
    "432 70 m 432 375 l S",
    "486 70 m 486 375 l S",
    "54 120 m 541 120 l S",
    "54 170 m 541 170 l S",
    "54 220 m 541 220 l S",
    "54 270 m 541 270 l S",
    "54 320 m 541 320 l S",
    "0.74 0.88 0.72 rg",
    "88 260 108 70 re f",
    "0.80 0.90 0.76 rg",
    "408 100 92 62 re f",
    "0.78 0.65 0.36 RG",
    "3 w",
    "70 130 m 150 172 l 236 166 l 320 220 l 420 238 l 520 304 l S",
    "0.28 0.56 0.90 RG",
    "2 w",
    "74 300 m 142 270 l 218 284 l 286 246 l 362 260 l 456 212 l 528 226 l S",
    "0.92 0.92 0.86 RG",
    "4 w",
    "70 86 m 156 122 l 230 116 l 324 154 l 466 142 l 532 174 l S",
    "0.95 0.30 0.02 rg",
    "0.95 0.30 0.02 RG",
    "2 w",
    "236 166 m 324 188 l 362 250 l 298 300 l 210 262 l 190 202 l h B",
    "1 1 1 rg",
    "230 218 108 26 re f",
    "0.01 0.18 0.35 rg",
    "BT",
    "/F1 10 Tf",
    "1 0 0 1 242 227 Tm",
    "(VENDODHJA E PRONES) Tj",
    "ET",
    "0.01 0.18 0.35 rg",
    "BT",
    "/F1 9 Tf",
    "1 0 0 1 68 354 Tm",
    `(Printim GIS - ${mapLabel}) Tj`,
    "/F1 9 Tf",
    "1 0 0 1 470 348 Tm",
    "(N) Tj",
    "ET",
    "0.01 0.18 0.35 RG",
    "1.5 w",
    "476 330 m 476 346 l S",
    "476 346 m 470 337 l S",
    "476 346 m 482 337 l S",
    "Q",
    "q",
    "0.98 0.99 1 rg",
    "356 104 166 58 re f",
    "0.76 0.84 0.90 RG",
    "1 w",
    "356 104 166 58 re S",
    "0.01 0.18 0.35 rg",
    "BT",
    "/F1 9 Tf",
    "1 0 0 1 368 145 Tm",
    "(Legjenda) Tj",
    "1 0 0 1 385 128 Tm",
    "(Parcela e prekur) Tj",
    "1 0 0 1 385 113 Tm",
    "(Rruge / kufij orientues) Tj",
    "ET",
    "0.95 0.30 0.02 rg",
    "365 122 12 8 re f",
    "0.78 0.65 0.36 RG",
    "2 w",
    "365 111 m 377 111 l S",
    "Q",
  ].join("\n");

  return buildSimplePdf(content);
}

export function buildAkptMapDownload(
  code: string,
): { body: Uint8Array; fileName: string; mimeType: string } | null {
  const d = getByTrackingCode(code);
  if (!d) return null;
  return {
    body: buildAkptMapPdf(d),
    fileName: `${sanitizePdfFileName(d.trackingCode)}-harta-gis-akpt.pdf`,
    mimeType: "application/pdf",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAkptMapPrintPage(code: string): { body: string; fileName: string } | null {
  const d = getByTrackingCode(code);
  if (!d) return null;
  const process = PROCESSES[d.process];
  const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
  const facts = akptGisFacts(d);
  const generatedAt = new Date().toLocaleString("sq-AL");
  const rows = [
    ["Kodi i gjurmimit", d.trackingCode],
    ["Procesi", process.title],
    ["Qytetari / pronari", applicant?.fullName ?? "-"],
    ["Pasuria", d.property.description],
    ["Zona", d.property.zone],
    ["Vendodhja orientuese", `${facts.place.lat}, ${facts.place.lon}`],
    ["Poligoni i parceles", parcelPolygonLabel(facts.place.parcelPolygon)],
    ["Zonimi GIS", facts.zoning],
    ["Kategoria e tokes", facts.landCategory],
    ["Gjeneruar", generatedAt],
  ];
  const mapPayload = JSON.stringify({
    center: { lat: facts.place.lat, lon: facts.place.lon, zoom: facts.place.zoom },
    polygon: facts.place.parcelPolygon,
  });
  const body = `<!doctype html>
<html lang="sq">
<head>
  <meta charset="utf-8" />
  <title>Printim GIS ${escapeHtml(d.trackingCode)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; color: #102033; background: #eef4f1; }
    .sheet { min-height: 100vh; background: white; padding: 18px; }
    .top { display: flex; justify-content: space-between; gap: 16px; border-bottom: 4px solid #ef3340; padding-bottom: 12px; }
    h1 { margin: 0; font-size: 22px; color: #06365f; }
    .sub { margin-top: 4px; font-size: 12px; color: #48606f; }
    .badge { border: 1px solid #d8a900; background: #fff6d8; color: #654b00; padding: 6px 8px; border-radius: 6px; font-size: 12px; height: fit-content; }
    .map { position: relative; height: 520px; margin-top: 14px; border: 1px solid #b8d7ca; border-radius: 8px; overflow: hidden; background: #e8eef2; touch-action: none; }
    .tile-layer img { position: absolute; width: 256px; height: 256px; user-select: none; }
    .parcel-overlay { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .parcel-overlay polygon { fill: rgba(239, 51, 64, .30); stroke: #ef3340; stroke-width: 3; vector-effect: non-scaling-stroke; }
    .parcel-overlay circle { fill: #ef3340; stroke: #fff; stroke-width: 2; }
    .parcel-label { position: absolute; transform: translate(-50%, -100%); border: 1px solid rgba(239, 51, 64, .45); border-radius: 999px; background: rgba(255, 255, 255, .92); color: #06365f; padding: 4px 8px; font-size: 11px; font-weight: 700; pointer-events: none; }
    .map-controls { position: absolute; top: 10px; right: 10px; display: grid; overflow: hidden; border: 1px solid #d7e0e5; border-radius: 6px; background: #fff; box-shadow: 0 2px 8px rgba(16, 32, 51, .14); }
    .map-controls button { width: 32px; height: 32px; padding: 0; border-radius: 0; border-bottom: 1px solid #e5edf1; background: #fff; color: #102033; font-size: 16px; }
    .map-controls button:last-child { border-bottom: 0; }
    .osm-credit { position: absolute; right: 4px; bottom: 4px; border-radius: 4px; background: rgba(255, 255, 255, .86); padding: 2px 5px; font-size: 10px; color: #5b6975; }
    .osm-credit a { color: inherit; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
    .cell { border: 1px solid #d9e4e0; border-radius: 6px; padding: 8px 10px; font-size: 12px; }
    .label { color: #637684; text-transform: uppercase; font-size: 10px; letter-spacing: .04em; margin-bottom: 3px; }
    .value { font-weight: 700; word-break: break-word; }
    .note { margin-top: 12px; padding: 10px; border: 1px solid #f1d693; background: #fff8e4; border-radius: 6px; color: #69501a; font-size: 12px; }
    .actions { margin-top: 12px; display: flex; gap: 8px; }
    button, a.button { border: 0; border-radius: 6px; background: #06365f; color: white; padding: 9px 12px; font-weight: 700; text-decoration: none; font-size: 12px; cursor: pointer; }
    @media print {
      body { background: white; }
      .sheet { padding: 0; }
      .actions { display: none; }
      .map { height: 470px; }
      .map-controls { display: none; }
    }
  </style>
</head>
<body>
  <main class="sheet">
    <section class="top">
      <div>
        <h1>Printim GIS - vendodhja e prones</h1>
        <div class="sub">AKPT / e-Harta GIS demo me baze OpenStreetMap</div>
      </div>
      <div class="badge">read-only / evidence pune</div>
    </section>
    <section class="map" id="gis-map">
      <div class="tile-layer" aria-hidden="true"></div>
      <svg class="parcel-overlay" aria-hidden="true">
        <polygon></polygon>
        <circle r="5"></circle>
      </svg>
      <div class="parcel-label">PARCELA</div>
      <div class="map-controls" aria-label="Kontrollet e hartes">
        <button type="button" data-map-action="zoom-in" aria-label="Zmadho">+</button>
        <button type="button" data-map-action="zoom-out" aria-label="Zvogelo">-</button>
        <button type="button" data-map-action="reset" aria-label="Kthe te parcela">⌖</button>
      </div>
      <div class="osm-credit">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a></div>
    </section>
    <section class="grid">
      ${rows
        .map(
          ([label, value]) =>
            `<div class="cell"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></div>`,
        )
        .join("")}
    </section>
    <div class="note">
      ${escapeHtml(facts.place.accuracyLabel)}
      <br />Harta reale: ${escapeHtml(facts.realMapUrl)}
    </div>
    <div class="actions">
      <button onclick="window.print()">Printo / ruaj si PDF</button>
      <a class="button" href="${escapeHtml(facts.realMapUrl)}" target="_blank" rel="noreferrer">Hap harten reale</a>
    </div>
  </main>
  <script>
    (function () {
      var data = ${mapPayload};
      var map = document.getElementById("gis-map");
      var tileLayer = map.querySelector(".tile-layer");
      var polygon = map.querySelector("polygon");
      var circle = map.querySelector("circle");
      var label = map.querySelector(".parcel-label");
      var tileSize = 256;
      var minZoom = 12;
      var maxZoom = 19;
      var view = {
        lat: data.center.lat,
        lon: data.center.lon,
        zoom: Math.max(minZoom, Math.min(maxZoom, Math.round(data.center.zoom || 17)))
      };
      var drag = null;

      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }
      function wrap(value, max) {
        return ((value % max) + max) % max;
      }
      function project(lat, lon, zoom) {
        var scale = tileSize * Math.pow(2, zoom);
        var safeLat = clamp(lat, -85.05112878, 85.05112878);
        var sinLat = Math.sin((safeLat * Math.PI) / 180);
        return {
          x: ((lon + 180) / 360) * scale,
          y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
        };
      }
      function unproject(x, y, zoom) {
        var scale = tileSize * Math.pow(2, zoom);
        var lon = (x / scale) * 360 - 180;
        var n = Math.PI - (2 * Math.PI * y) / scale;
        var lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
        return { lat: clamp(lat, -85.05112878, 85.05112878), lon: lon };
      }
      function render() {
        var width = map.clientWidth;
        var height = map.clientHeight;
        var centerWorld = project(view.lat, view.lon, view.zoom);
        var tileCount = Math.pow(2, view.zoom);
        var startTileX = Math.floor((centerWorld.x - width / 2) / tileSize);
        var endTileX = Math.floor((centerWorld.x + width / 2) / tileSize);
        var startTileY = Math.floor((centerWorld.y - height / 2) / tileSize);
        var endTileY = Math.floor((centerWorld.y + height / 2) / tileSize);
        tileLayer.innerHTML = "";
        for (var x = startTileX; x <= endTileX; x += 1) {
          for (var y = startTileY; y <= endTileY; y += 1) {
            if (y < 0 || y >= tileCount) continue;
            var img = document.createElement("img");
            img.alt = "";
            img.draggable = false;
            img.src = "https://tile.openstreetmap.org/" + view.zoom + "/" + wrap(x, tileCount) + "/" + y + ".png";
            img.style.left = x * tileSize - centerWorld.x + width / 2 + "px";
            img.style.top = y * tileSize - centerWorld.y + height / 2 + "px";
            tileLayer.appendChild(img);
          }
        }
        var points = data.polygon.map(function (point) {
          var world = project(point.lat, point.lon, view.zoom);
          return { x: world.x - centerWorld.x + width / 2, y: world.y - centerWorld.y + height / 2 };
        });
        polygon.setAttribute("points", points.map(function (point) {
          return point.x.toFixed(1) + "," + point.y.toFixed(1);
        }).join(" "));
        var centerPoint = points.reduce(function (acc, point) {
          return { x: acc.x + point.x / points.length, y: acc.y + point.y / points.length };
        }, { x: 0, y: 0 });
        circle.setAttribute("cx", String(centerPoint.x));
        circle.setAttribute("cy", String(centerPoint.y));
        label.style.left = centerPoint.x + "px";
        label.style.top = Math.max(10, centerPoint.y - 12) + "px";
      }
      function zoomTo(nextZoom, anchorX, anchorY) {
        var zoom = clamp(nextZoom, minZoom, maxZoom);
        if (zoom === view.zoom) return;
        var width = map.clientWidth;
        var height = map.clientHeight;
        var centerWorld = project(view.lat, view.lon, view.zoom);
        var x = anchorX == null ? width / 2 : anchorX;
        var y = anchorY == null ? height / 2 : anchorY;
        var anchorWorld = { x: centerWorld.x + x - width / 2, y: centerWorld.y + y - height / 2 };
        var anchorLatLon = unproject(anchorWorld.x, anchorWorld.y, view.zoom);
        var anchorWorldAtZoom = project(anchorLatLon.lat, anchorLatLon.lon, zoom);
        var nextCenter = unproject(anchorWorldAtZoom.x - (x - width / 2), anchorWorldAtZoom.y - (y - height / 2), zoom);
        view = { lat: nextCenter.lat, lon: nextCenter.lon, zoom: zoom };
        render();
      }
      map.addEventListener("wheel", function (event) {
        event.preventDefault();
        var rect = map.getBoundingClientRect();
        zoomTo(view.zoom + (event.deltaY < 0 ? 1 : -1), event.clientX - rect.left, event.clientY - rect.top);
      }, { passive: false });
      map.addEventListener("pointerdown", function (event) {
        if (event.target.closest("button,a")) return;
        map.setPointerCapture(event.pointerId);
        drag = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          centerWorld: project(view.lat, view.lon, view.zoom),
          zoom: view.zoom
        };
      });
      map.addEventListener("pointermove", function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        var nextCenter = unproject(
          drag.centerWorld.x - (event.clientX - drag.startX),
          drag.centerWorld.y - (event.clientY - drag.startY),
          drag.zoom
        );
        view = { lat: nextCenter.lat, lon: nextCenter.lon, zoom: drag.zoom };
        render();
      });
      map.addEventListener("pointerup", function () { drag = null; });
      map.addEventListener("pointercancel", function () { drag = null; });
      map.querySelector("[data-map-action='zoom-in']").addEventListener("click", function () { zoomTo(view.zoom + 1); });
      map.querySelector("[data-map-action='zoom-out']").addEventListener("click", function () { zoomTo(view.zoom - 1); });
      map.querySelector("[data-map-action='reset']").addEventListener("click", function () {
        view = { lat: data.center.lat, lon: data.center.lon, zoom: Math.max(minZoom, Math.min(maxZoom, Math.round(data.center.zoom || 17))) };
        render();
      });
      window.addEventListener("resize", render);
      render();
    })();
  </script>
</body>
</html>`;
  return {
    body,
    fileName: `${sanitizePdfFileName(d.trackingCode)}-printim-gis.html`,
  };
}

function buildCitizenPdf(d: Dossier, doc: DossierDocument): Uint8Array {
  const process = PROCESSES[d.process];
  const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
  const deliveredAt = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("sq-AL") : "";
  const lines = [
    "SMART DOSSIER",
    "Dokument i vulosur elektronikisht per qytetarin",
    "",
    `Kodi i gjurmimit: ${d.trackingCode}`,
    `Procesi: ${process.title}`,
    `Dokumenti: ${doc.name}`,
    `Tipi: ${docLabel(doc.type)}`,
    `Qytetari: ${applicant?.fullName ?? "-"}`,
    `Pasuria: ${d.property.description}`,
    `Zona: ${d.property.zone}`,
    `Data e dergimit: ${deliveredAt || "-"}`,
    "",
    "Ky PDF eshte gjeneruar nga demo Smart Dossier per te paraqitur dokumentin",
    "e ngarkuar nga operatori dhe te vulosur elektronikisht nga sistemi.",
  ];

  const textCommands = lines
    .map((line, index) => {
      const y = 775 - index * 18;
      const fontSize = index === 0 ? 18 : 11;
      return `/F1 ${fontSize} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
    })
    .join("\n");

  const content = [
    "q",
    "0.97 0.98 0.99 rg",
    "36 36 523 770 re f",
    "Q",
    "q",
    "0 0 0 rg",
    "BT",
    textCommands,
    "ET",
    "Q",
    "q",
    "0.95 0.30 0.02 RG",
    "0.95 0.30 0.02 rg",
    "2 w",
    "356 95 175 86 re S",
    "BT",
    "/F1 24 Tf",
    "1 0 0 1 409 148 Tm",
    "(ASHK) Tj",
    "/F1 9 Tf",
    "1 0 0 1 377 128 Tm",
    "(AGJENCIA SHTETERORE E KADASTRES) Tj",
    "/F1 10 Tf",
    "1 0 0 1 386 111 Tm",
    "(VULE ELEKTRONIKE - DEMO) Tj",
    "ET",
    "Q",
  ].join("\n");

  return buildSimplePdf(content);
}

export function buildCitizenDocumentDownload(
  code: string,
  documentId: string,
): { body: Uint8Array; fileName: string; mimeType: string } | null {
  const d = getByTrackingCode(code);
  if (!d) return null;
  if (!canCitizenReceiveDocuments(d)) return null;
  const doc = d.documents.find((item) => item.id === documentId);
  if (!doc) return null;
  const canCitizenAccess =
    doc.status === "verified" || !!doc.notes?.includes("Vulosur elektronikisht");
  if (!canCitizenAccess) return null;

  return {
    body: buildCitizenPdf(d, doc),
    fileName: `${sanitizePdfFileName(doc.name) || "dokument-i-vulosur"}.pdf`,
    mimeType: "application/pdf",
  };
}

export function buildExpeditedProcedureForm(
  code: string,
): { body: Uint8Array; fileName: string; mimeType: string } | null {
  const d = getByTrackingCode(code);
  if (!d) return null;
  const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
  const lines = [
    "SMART DOSSIER",
    "FORMULAR KERKESE PER PROCEDURE TE PERSHPEJTUAR",
    "",
    `Kodi i dosjes: ${d.trackingCode}`,
    `Qytetari / kerkuesi: ${applicant?.fullName ?? "-"}`,
    `Pasuria: ${d.property.description}`,
    `Zona kadastrale: ${d.property.zone}`,
    "",
    "ARSYEJA E KERKESES",
    "[ ] Gjendje shendetesore / sociale",
    "[ ] Afat ligjor ose administrativ i afert",
    "[ ] Vendim gjykate / detyrim institucional",
    "[ ] Rast social i dokumentuar",
    "[ ] Tjeter: ________________________________________________",
    "",
    "PERSHKRIM I SHKURTER I ARSYES:",
    "____________________________________________________________",
    "____________________________________________________________",
    "____________________________________________________________",
    "",
    "DOKUMENTACION I BASHKELIDHUR:",
    "1. Dokument provues: ________________________________________",
    "2. Mandat pagese per tarife zyrtare (nese aplikohet): _______ ALL",
    "",
    "DEKLARATE",
    "Deklaroj se te dhenat jane te sakta dhe kerkoj shqyrtim te pershpejtuar",
    "vetem mbi bazen e dokumentacionit provues te bashkelidhur.",
    "",
    "Data: ____ / ____ / ______        Nenshkrimi: _______________",
  ];
  const textCommands = lines
    .map((line, index) => {
      const y = 790 - index * 21;
      const fontSize = index === 0 ? 18 : index === 1 ? 13 : 10;
      return `/F1 ${fontSize} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
    })
    .join("\n");
  const content = [
    "q",
    "0.98 0.99 1 rg",
    "36 36 523 770 re f",
    "Q",
    "q",
    "0.01 0.18 0.35 rg",
    "BT",
    textCommands,
    "ET",
    "Q",
    "q",
    "0.95 0.73 0.10 RG",
    "3 w",
    "36 744 523 0 m S",
    "Q",
  ].join("\n");
  return {
    body: buildSimplePdf(content),
    fileName: `${sanitizePdfFileName(d.trackingCode)}-formular-pershpejtimi.pdf`,
    mimeType: "application/pdf",
  };
}

export function buildUploadedDocumentDownload(
  code: string,
  documentId: string,
): { body: Uint8Array; fileName: string; mimeType: string } | null {
  const d = getByTrackingCode(code);
  if (!d) return null;
  const doc = d.documents.find((item) => item.id === documentId);
  if (!doc) return null;

  const canDownload =
    doc.uploadedBy === "citizen_portal" ||
    doc.type === "expedite_request_form" ||
    doc.type === "expedite_supporting_document" ||
    doc.type === "payment_receipt";
  if (!canDownload) return null;

  if (doc.contentBase64) {
    return {
      body: base64ToBytes(doc.contentBase64),
      fileName: sanitizeDownloadFileName(doc.name),
      mimeType: doc.mimeType || "application/octet-stream",
    };
  }

  const lines = [
    "SMART DOSSIER",
    "KOPJE DEMO E DOKUMENTIT TE NGARKUAR",
    "",
    `Kodi i dosjes: ${d.trackingCode}`,
    `Dokumenti: ${doc.name}`,
    `Tipi: ${docLabel(doc.type)}`,
    `Ngarkuar nga: ${operatorLabel(doc.uploadedBy ?? "citizen_portal")}`,
    `Data: ${doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("sq-AL") : "-"}`,
    "",
    "Shenim:",
    doc.notes ?? "Ky dokument eshte ruajtur si metadata demo.",
    "",
    "Ne ngarkimet e reja, Smart Dossier ruan edhe permbajtjen e skedarit.",
  ];
  const textCommands = lines
    .map((line, index) => {
      const y = 790 - index * 21;
      const fontSize = index === 0 ? 18 : index === 1 ? 13 : 10;
      return `/F1 ${fontSize} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
    })
    .join("\n");
  const content = [
    "q",
    "0.98 0.99 1 rg",
    "36 36 523 770 re f",
    "Q",
    "q",
    "0.01 0.18 0.35 rg",
    "BT",
    textCommands,
    "ET",
    "Q",
  ].join("\n");

  return {
    body: buildSimplePdf(content),
    fileName: `${sanitizePdfFileName(doc.name) || "dokument-demo"}.pdf`,
    mimeType: "application/pdf",
  };
}

// --------------------- grounded AI answer ---------------------

export const answerDossierQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string(), question: z.string().min(2).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) notFound();
    const process = PROCESSES[d.process];
    const facts = buildDossierSummaryFacts(d, process);
    const alerts = getCriticalAlerts(d, process);

    // Build grounded context — process knowledge + dossier facts only.
    const context = {
      process: {
        title: process.title,
        legalBasis: process.legalBasis,
        phases: process.phases.map((p) => ({
          id: p.id,
          order: p.order,
          title: p.title,
          institutions: p.institutions,
          steps: p.steps.map((s) => ({
            id: s.id,
            title: s.title,
            institution: s.institution,
            slaDays: s.slaDays,
            manual: s.manual ?? false,
            criticalPoints: (s.criticalPoints ?? []).map((c) => ({
              label: c.label,
              severity: c.severity,
              description: c.description,
            })),
            requiredDocuments: s.requiredDocuments ?? [],
          })),
        })),
      },
      dossier: facts,
      criticalAlerts: alerts.map((a) => ({
        label: a.label,
        severity: a.severity,
        description: a.description,
      })),
    };

    try {
      const [{ generateText }, { getGateway, MODEL_ID }] = await Promise.all([
        import("ai"),
        import("../ai-gateway.server"),
      ]);
      const model = getGateway()(MODEL_ID);
      const sys =
        "Je asistent për nëpunësin civil shqiptar. Përgjigju VETËM bazuar te konteksti i mëposhtëm (përkufizimi i procesit, baza ligjore, dhe faktet e dosjes). " +
        "Nëse përgjigja nuk mbështetet nga konteksti, thuaj qartë 'Nuk kam të dhëna të mjaftueshme'. " +
        "Ji konciz, përgjigju në shqip, dhe cito hapin/fazën përkatëse kur është e mundur.";
      const { text } = await generateText({
        model,
        system: sys,
        prompt: `KONTEKSTI:\n${JSON.stringify(context, null, 2)}\n\nPYETJA: ${data.question}`,
      });
      // log as AI insight + audit
      d.insights = [
        ...d.insights,
        {
          id: `ai-q-${d.insights.length + 1}-${Date.now().toString(36)}`,
          kind: "summary",
          createdAt: new Date().toISOString(),
          text: `Q: ${data.question}\nA: ${text}`,
        },
      ];
      audit(d, {
        actor: "ai_assistant",
        action: "Pyetje me asistent",
        details: data.question.slice(0, 200),
      });
      upsert(d);
      return { answer: text };
    } catch (err) {
      return {
        answer:
          "Asistenti nuk është i disponueshëm tani. Mund të shikoni faktet e dosjes në kontekst.",
        error: err instanceof Error ? err.message : "unknown",
      };
    }
  });

// --------------------- AI risk brief (top 5 operational risks across portfolio) ---------------------

export const aiRiskBrief = createServerFn({ method: "POST" }).handler(async () => {
  const dossiers = allDossiers().filter((d) => d.status !== "completed" && d.status !== "rejected");
  const now = new Date();

  type Bucket = {
    processKind: ProcessKind;
    processTitle: string;
    phaseId: string;
    phaseTitle: string;
    label: string;
    description: string;
    severity: "info" | "warning" | "critical";
    affectedCount: number;
    affectedCodes: string[];
    avgDaysInPhase: number;
    daysSum: number;
  };
  const buckets = new Map<string, Bucket>();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const d of dossiers) {
    const proc = PROCESSES[d.process];
    const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
    const alerts = getCriticalAlerts(d, proc, now);
    const enteredAt =
      [...d.audit]
        .reverse()
        .find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ??
      d.createdAt;
    const daysInPhase = Math.max(
      0,
      Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs),
    );
    for (const a of alerts) {
      if (a.severity === "info") continue;
      const key = `${d.process}:${d.currentPhaseId}:${a.label}`;
      const prev = buckets.get(key);
      if (prev) {
        prev.affectedCount += 1;
        prev.daysSum += daysInPhase;
        prev.avgDaysInPhase = Math.round(prev.daysSum / prev.affectedCount);
        if (prev.affectedCodes.length < 6) prev.affectedCodes.push(d.trackingCode);
      } else {
        buckets.set(key, {
          processKind: d.process,
          processTitle: proc.title,
          phaseId: d.currentPhaseId,
          phaseTitle: phase?.title ?? d.currentPhaseId,
          label: a.label,
          description: a.description,
          severity: a.severity,
          affectedCount: 1,
          affectedCodes: [d.trackingCode],
          avgDaysInPhase: daysInPhase,
          daysSum: daysInPhase,
        });
      }
    }
  }

  const ranked = Array.from(buckets.values())
    .map((b) => ({
      processKind: b.processKind,
      processTitle: b.processTitle,
      phaseId: b.phaseId,
      phaseTitle: b.phaseTitle,
      label: b.label,
      description: b.description,
      severity: b.severity,
      affectedCount: b.affectedCount,
      affectedCodes: b.affectedCodes,
      avgDaysInPhase: b.avgDaysInPhase,
      score:
        b.affectedCount * (b.severity === "critical" ? 3 : 1) + Math.round(b.avgDaysInPhase / 7),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const stats = {
    activeDossiers: dossiers.length,
    blocked: dossiers.filter((d) => d.status === "blocked").length,
    awaitingExternal: dossiers.filter((d) => d.status === "awaiting_external").length,
    overdue: dossiers.filter(
      (d) => getDeadlineState(d, PROCESSES[d.process], now).state === "overdue",
    ).length,
  };

  const { callOpenAi } = await import("@/lib/ai/openai");
  const sys =
    "Je analist operacional për nëpunësit civilë shqiptarë. Përmblidh 5 risqet kryesore operacionale " +
    "nga të dhënat e paketuara. Përgjigju në shqip, në Markdown me listë të numëruar 1–5. " +
    "Për secilin: titull i shkurtër, ndikimi (sa dosje, faza, ditë mesatare), dhe një veprim i rekomanduar. " +
    "Mos shpik fakte: përdor vetëm fushat 'ranked' dhe 'stats'.";
  const user = JSON.stringify({ stats, ranked }, null, 2);
  const res = await callOpenAi({ system: sys, user, temperature: 0.2 });
  if (!res.ok) {
    return { ok: false as const, error: res.error, ranked, stats };
  }
  return {
    ok: true as const,
    brief: res.content,
    model: res.model,
    ranked,
    stats,
    generatedAt: new Date().toISOString(),
  };
});
