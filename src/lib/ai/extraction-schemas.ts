// Zod schemas for AI-extracted document fields.
// Used both on the server (to validate LLM output) and on the client (to render fields).
import { z } from "zod";

/** A single field returned by the LLM with confidence and short evidence snippet. */
export const fieldSchema = <T extends z.ZodTypeAny>(value: T) =>
  z
    .object({
      value: value.nullable(),
      confidence: z.number().min(0).max(1),
      sourceEvidence: z.string().max(280).optional(),
    })
    .strict();

const str = fieldSchema(z.string());
const num = fieldSchema(z.number());
const dateStr = fieldSchema(z.string()); // ISO-ish; we don't force format from LLM

// --------------- Common fields (every document) ---------------
export const commonFieldsSchema = z.object({
  applicantName: str,
  nidMasked: str,
  address: str,
  phone: str,
  email: str,
  documentDate: dateStr,
  institution: str,
  propertyId: str,
  cadastralZone: str,
  propertyAreaM2: num,
  municipality: str,
});

// --------------- EKB-specific ---------------
export const ekbFieldsSchema = z.object({
  familyMembers: num,
  familyIncomeAll: num,
  marketPriceAll: num,
  landPriceAll: num,
  housingNorm: num,
  certificateNumber: str,
  qualifiesForPrivatization: fieldSchema(z.boolean()),
  suggestedPriceCategory: fieldSchema(z.enum(["subsidized", "market", "mixed", "unknown"])),
});

// --------------- Expropriation-specific ---------------
export const expropriationFieldsSchema = z.object({
  ownerName: str,
  projectName: str,
  publicInterestReason: str,
  compensationAmountAll: num,
  valuationMethod: str,
  appealDeadline: dateStr,
  acceptanceStatus: fieldSchema(z.enum(["pending", "accepted", "rejected", "unknown"])),
});

// --------------- Business property registration-specific ---------------
export const propertyRegistrationFieldsSchema = z.object({
  businessName: str,
  nipt: str,
  representativeName: str,
  ownershipActNumber: str,
  registrationReason: str,
  planReference: str,
  hasLegalRepresentation: fieldSchema(z.boolean()),
});

// --------------- Top-level extraction envelope ---------------
export const extractionResultSchema = z.object({
  documentType: z.string().min(1),
  language: z.string().default("sq"),
  common: commonFieldsSchema.partial(),
  ekb: ekbFieldsSchema.partial().optional(),
  expropriation: expropriationFieldsSchema.partial().optional(),
  propertyRegistration: propertyRegistrationFieldsSchema.partial().optional(),
  missingFields: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  overallConfidence: z.number().min(0).max(1),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;
export type FieldValue<T = unknown> = {
  value: T | null;
  confidence: number;
  sourceEvidence?: string;
};

/** Build the JSON schema description text used in the LLM system prompt. */
export function buildSchemaDescription(
  processKind: "ekb_privatization" | "expropriation" | "property_registration",
) {
  const common = `common: { applicantName, nidMasked, address, phone, email, documentDate, institution, propertyId, cadastralZone, propertyAreaM2, municipality } — each as { "value": <typed-or-null>, "confidence": 0..1, "sourceEvidence"?: "<short snippet>" }`;
  const ekb = `ekb: { familyMembers, familyIncomeAll, marketPriceAll, landPriceAll, housingNorm, certificateNumber, qualifiesForPrivatization (boolean), suggestedPriceCategory ("subsidized"|"market"|"mixed"|"unknown") }`;
  const exp = `expropriation: { ownerName, projectName, publicInterestReason, compensationAmountAll, valuationMethod, appealDeadline, acceptanceStatus ("pending"|"accepted"|"rejected"|"unknown") }`;
  const biz = `propertyRegistration: { businessName, nipt, representativeName, ownershipActNumber, registrationReason, planReference, hasLegalRepresentation (boolean) }`;
  const specific =
    processKind === "ekb_privatization" ? ekb : processKind === "property_registration" ? biz : exp;
  return `Return JSON ONLY matching:
{
  "documentType": string,
  "language": string,
  ${common},
  ${specific},
  "missingFields": string[],
  "warnings": string[],
  "overallConfidence": 0..1
}`;
}
