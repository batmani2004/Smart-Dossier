import { X as booleanType, Y as arrayType, Z as enumType, et as numberType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extraction-schemas-CiVuWAU6.js
/** A single field returned by the LLM with confidence and short evidence snippet. */
var fieldSchema = (value) => objectType({
	value: value.nullable(),
	confidence: numberType().min(0).max(1),
	sourceEvidence: stringType().max(280).optional()
}).strict();
var str = fieldSchema(stringType());
var num = fieldSchema(numberType());
var dateStr = fieldSchema(stringType());
var commonFieldsSchema = objectType({
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
	municipality: str
});
var ekbFieldsSchema = objectType({
	familyMembers: num,
	familyIncomeAll: num,
	marketPriceAll: num,
	landPriceAll: num,
	housingNorm: num,
	certificateNumber: str,
	qualifiesForPrivatization: fieldSchema(booleanType()),
	suggestedPriceCategory: fieldSchema(enumType([
		"subsidized",
		"market",
		"mixed",
		"unknown"
	]))
});
var expropriationFieldsSchema = objectType({
	ownerName: str,
	projectName: str,
	publicInterestReason: str,
	compensationAmountAll: num,
	valuationMethod: str,
	appealDeadline: dateStr,
	acceptanceStatus: fieldSchema(enumType([
		"pending",
		"accepted",
		"rejected",
		"unknown"
	]))
});
var propertyRegistrationFieldsSchema = objectType({
	businessName: str,
	nipt: str,
	representativeName: str,
	ownershipActNumber: str,
	registrationReason: str,
	planReference: str,
	hasLegalRepresentation: fieldSchema(booleanType())
});
var extractionResultSchema = objectType({
	documentType: stringType().min(1),
	language: stringType().default("sq"),
	common: commonFieldsSchema.partial(),
	ekb: ekbFieldsSchema.partial().optional(),
	expropriation: expropriationFieldsSchema.partial().optional(),
	propertyRegistration: propertyRegistrationFieldsSchema.partial().optional(),
	missingFields: arrayType(stringType()).default([]),
	warnings: arrayType(stringType()).default([]),
	overallConfidence: numberType().min(0).max(1)
});
/** Build the JSON schema description text used in the LLM system prompt. */
function buildSchemaDescription(processKind) {
	return `Return JSON ONLY matching:
{
  "documentType": string,
  "language": string,
  common: { applicantName, nidMasked, address, phone, email, documentDate, institution, propertyId, cadastralZone, propertyAreaM2, municipality } — each as { "value": <typed-or-null>, "confidence": 0..1, "sourceEvidence"?: "<short snippet>" },
  ${processKind === "ekb_privatization" ? `ekb: { familyMembers, familyIncomeAll, marketPriceAll, landPriceAll, housingNorm, certificateNumber, qualifiesForPrivatization (boolean), suggestedPriceCategory ("subsidized"|"market"|"mixed"|"unknown") }` : processKind === "property_registration" ? `propertyRegistration: { businessName, nipt, representativeName, ownershipActNumber, registrationReason, planReference, hasLegalRepresentation (boolean) }` : `expropriation: { ownerName, projectName, publicInterestReason, compensationAmountAll, valuationMethod, appealDeadline, acceptanceStatus ("pending"|"accepted"|"rejected"|"unknown") }`},
  "missingFields": string[],
  "warnings": string[],
  "overallConfidence": 0..1
}`;
}
//#endregion
export { extractionResultSchema as n, buildSchemaDescription as t };
