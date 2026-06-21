import { $ as nullType, Q as lazyType, X as booleanType, Y as arrayType, Z as enumType, et as numberType, it as unionType, nt as recordType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DJVdNaWQ.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./esm-B50dUWcE.mjs";
import { d as upsert, i as getByTrackingCode, s as operatorName } from "./store-mnrjP0DR.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { a as getDeadlineState, n as buildAiGisAssessment, o as getNextStep, t as audit } from "./dossiers-helpers-BSyvCqzm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossiers.functions-D8xRMefQ.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var jsonValueSchema = lazyType(() => unionType([
	stringType(),
	numberType(),
	booleanType(),
	nullType(),
	arrayType(jsonValueSchema),
	recordType(jsonValueSchema)
]));
var OPERATOR_LABELS = {
	civil_servant_demo: "Operator kadastre",
	ai_assistant: "Asistent AI",
	system: "Sistem"
};
var IDENTITY_DOC_TYPE = "id_card_copy";
var REPRESENTATION_DOC_TYPE = "legal_authorization";
var EXPEDITE_DEMO_FEE_ALL = 1e3;
var EXPEDITE_REASON_LABELS = {
	health: "Gjendje shendetesore / sociale",
	deadline: "Afat ligjor ose administrativ i afert",
	court: "Vendim gjykate / detyrim institucional",
	social: "Rast social i dokumentuar",
	other: "Arsye tjeter e dokumentuar"
};
var processKindSchema = enumType([
	"ekb_privatization",
	"expropriation",
	"property_registration"
]);
function cadastralProofDocType(process) {
	if (process === "property_registration") return "ownership_origin_document";
	return process === "expropriation" ? "ownership_extract" : "ashk_certificate";
}
function requesterRequiredDocuments(process, claimType) {
	if (process === "property_registration") return [
		"business_nipt_extract",
		"legal_representative_id",
		"property_registration_request",
		"ownership_origin_document",
		"property_plan"
	];
	const base = [IDENTITY_DOC_TYPE, cadastralProofDocType(process)];
	return claimType === "legal_representative" ? [...base, REPRESENTATION_DOC_TYPE] : base;
}
function hasSupportingDocument(d, type) {
	if (type === "ashk_certificate") return d.documents.some((doc) => (doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	if (type === "ownership_extract") return d.documents.some((doc) => (doc.type === "ownership_extract" || doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	return d.documents.some((doc) => doc.type === type && doc.status !== "rejected");
}
function requesterEvidence(d) {
	const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
	const current = d.requesterVerification;
	const claimType = current?.claimType ?? "owner";
	const requiredDocumentTypes = current?.requiredDocumentTypes?.length ? current.requiredDocumentTypes : requesterRequiredDocuments(d.process, claimType);
	const missingDocumentTypes = requiredDocumentTypes.filter((type) => !hasSupportingDocument(d, type));
	return {
		claimType,
		cadastralSubjectName: current?.cadastralSubjectName ?? applicant?.fullName ?? "",
		status: current?.status ?? "pending",
		requiredDocumentTypes,
		missingDocumentTypes,
		canApprove: missingDocumentTypes.length === 0,
		verifiedAt: current?.verifiedAt,
		verifiedBy: current?.verifiedBy,
		notes: current?.notes
	};
}
function canCitizenReceiveDocuments(d) {
	return requesterEvidence(d).status === "verified";
}
function base64ToBytes(value) {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
var listDossiers = createServerFn({ method: "GET" }).validator((input) => objectType({
	process: processKindSchema.optional(),
	status: enumType([
		"draft",
		"in_progress",
		"blocked",
		"awaiting_external",
		"completed",
		"rejected"
	]).optional(),
	phaseId: stringType().optional(),
	search: stringType().optional(),
	priority: enumType([
		"low",
		"normal",
		"high"
	]).optional()
}).parse(input ?? {})).handler(createSsrRpc("80c96e2840c88865dae9824ca05fbdd70d622f4b49b768966182333db8947a14"));
var getDossier = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(createSsrRpc("f3750e373eca6abac627b0c4170263e1421d7f06012da2c79b0021f2db265358"));
var createDossier = createServerFn({ method: "POST" }).validator((input) => objectType({
	process: processKindSchema,
	title: stringType().min(3),
	applicantName: stringType().min(2),
	applicantNipt: stringType().min(3).optional(),
	zone: stringType().min(1),
	propertyDescription: stringType().min(1),
	areaSqm: numberType().positive().optional(),
	familyIncomeAll: numberType().nonnegative().optional(),
	marketPriceAll: numberType().nonnegative().optional(),
	landPriceAll: numberType().nonnegative().optional(),
	notes: stringType().optional(),
	documents: arrayType(objectType({
		type: stringType().min(1),
		name: stringType().min(1)
	})).default([])
}).parse(input)).handler(createSsrRpc("c53ebd925849cac9290687e3c83599ed0df953bdbc87d8e60aef7e84861d1808"));
var createBusinessPropertyApplication = createServerFn({ method: "POST" }).validator((input) => objectType({
	businessName: stringType().min(2),
	nipt: stringType().min(3),
	representativeName: stringType().min(2),
	zone: stringType().min(1),
	propertyDescription: stringType().min(1),
	cadastralNo: stringType().optional(),
	areaSqm: numberType().positive().optional(),
	notes: stringType().optional(),
	documents: arrayType(objectType({
		type: stringType().min(1),
		name: stringType().min(1)
	})).default([])
}).parse(input)).handler(createSsrRpc("bd2ab22d6bb16d724197024431b8eb2bbccbfbbb662db1da1fc8f94e30c4ecc5"));
var createExpropriationCompensationApplication = createServerFn({ method: "POST" }).validator((input) => objectType({
	applicantType: enumType(["citizen", "business"]),
	applicantName: stringType().min(2),
	nipt: stringType().optional(),
	representativeName: stringType().optional(),
	zone: stringType().min(1),
	propertyDescription: stringType().min(1),
	cadastralNo: stringType().optional(),
	areaSqm: numberType().positive().optional(),
	projectName: stringType().optional(),
	compensationAmountAll: numberType().nonnegative().optional(),
	bankAccountLabel: stringType().optional(),
	notes: stringType().optional(),
	documents: arrayType(objectType({
		type: stringType().min(1),
		name: stringType().min(1)
	})).default([])
}).parse(input)).handler(createSsrRpc("c8ad3116e9583dd944513df8d4f90c71f8ace4f6bef0306a0e879e733037f7e9"));
createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	title: stringType().optional(),
	status: enumType([
		"draft",
		"in_progress",
		"blocked",
		"awaiting_external",
		"completed",
		"rejected"
	]).optional(),
	notes: stringType().optional(),
	finalValueAll: numberType().nonnegative().optional()
}).parse(input)).handler(createSsrRpc("b33afff6fc891b390f1c42da8f63fc618a630773d6382b92d2451cd209e67a9f"));
var calculateEkbValuation = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(createSsrRpc("bf0de61d89aec0f26c0d94c9dc0a79fddaa1f37259745931d936885dced9bcd6"));
var updateRequesterVerification = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	claimType: enumType(["owner", "legal_representative"]),
	cadastralSubjectName: stringType().min(2).optional(),
	status: enumType([
		"pending",
		"verified",
		"needs_documents",
		"rejected"
	]),
	notes: stringType().max(1e3).optional()
}).parse(input)).handler(createSsrRpc("2107c001eb9accb79e957effa2e83c01d120d64c8e4effce687dd41ec2776183"));
var reviewExpeditedProcedure = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	status: enumType(["approved", "rejected"]),
	reviewNote: stringType().max(1e3).optional()
}).parse(input)).handler(createSsrRpc("98f818cdd1a70f4673585b72d35015eb2005866271e5b9e9734a2373b6b98f08"));
var advanceDossier = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(createSsrRpc("065d4fcd30e1c8e67eccb3f8c7a0dc1e64e83e0ffdd6a79af075417468fcf256"));
var uploadDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	type: stringType().min(1),
	name: stringType().min(1),
	content: stringType().max(2e5).optional(),
	aiGenerated: booleanType().optional(),
	electronicSeal: booleanType().optional(),
	extracted: recordType(jsonValueSchema).optional(),
	confidence: numberType().min(0).max(1).optional()
}).parse(input)).handler(createSsrRpc("de89a94eba4b27a6ba8f67bd1943f8f7dabb13f56e5c2a651d24f926676a394f"));
var assignDossier = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	operatorId: stringType().min(1)
}).parse(input)).handler(createSsrRpc("8c174ad2d17609d8cfe955d80b3a6e49780d3b581dd3bc26d837d7c4b8f89629"));
var runAutoAssignment = createServerFn({ method: "POST" }).handler(createSsrRpc("04956febe7ce79ad1900babc735441a572ffc65dc2db8937b51267f25537f313"));
var addOperator = createServerFn({ method: "POST" }).validator((input) => objectType({
	name: stringType().min(2),
	unit: stringType().min(2)
}).parse(input)).handler(createSsrRpc("4de42a5fd7ad902b30f7fde1f9df2aceb8e165e1128c7f5c246fd3561fad419a"));
var removeOperator = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType().min(1) }).parse(input)).handler(createSsrRpc("7196d0b08bf7b696f8a023127eac7d78ad2b43b2c101637c36716417bb479fb1"));
var getDashboard = createServerFn({ method: "GET" }).handler(createSsrRpc("211f31dda31166e18b0c1106d9cb5cda479b700322f598442c6a24ded448401c"));
createServerFn({ method: "GET" }).handler(createSsrRpc("f51eedb684a8e9b5ba65ae42a8f98d6f6b37d708a898f7e92a7fb16b60140d53"));
var resetDemo = createServerFn({ method: "POST" }).handler(createSsrRpc("62c433e4d6a224bd1a41a4f240f319e9dd5ef3ea635ff271e853a3723841c360"));
var DOC_TYPE_LABELS_SQ = {
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
	expedite_supporting_document: "Dokument provues per pershpejtim"
};
function docLabel(type) {
	return DOC_TYPE_LABELS_SQ[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function operatorLabel(actor) {
	return OPERATOR_LABELS[actor] ?? actor.replace(/_/g, " ");
}
function routedOperatorForDossier(d) {
	if (d.assignedOperatorId) return {
		actor: d.assignedOperatorId,
		label: d.assignedOperatorName ?? operatorName(d.assignedOperatorId)
	};
	const lastHuman = [...d.audit ?? []].reverse().find((event) => event.actor !== "system" && event.actor !== "ai_assistant")?.actor ?? d.documents.find((doc) => doc.uploadedBy && doc.uploadedBy !== "ai_assistant")?.uploadedBy ?? "civil_servant_demo";
	return {
		actor: lastHuman,
		label: operatorLabel(lastHuman)
	};
}
var CITIZEN_AUDIT_DENY = [
	"asistent",
	"AI",
	"Përditësim dosjeje",
	"nxjerra me AI",
	"paraprak"
];
function isCitizenAudit(action) {
	return !CITIZEN_AUDIT_DENY.some((kw) => action.toLowerCase().includes(kw.toLowerCase()));
}
function buildTrackingPayload(code) {
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
		state: p.order < currentOrder ? "completed" : p.order === currentOrder ? "current" : "upcoming"
	}));
	const missingDocuments = (d.missingDocumentTypes ?? []).map((t) => ({
		type: t,
		label: docLabel(t)
	}));
	const deliveredDocuments = d.documents.filter((doc) => doc.status === "verified" || doc.notes?.includes("Vulosur elektronikisht"));
	const citizenDocuments = (canReceiveDocuments ? deliveredDocuments : []).filter((doc) => doc.status === "verified" || doc.notes?.includes("Vulosur elektronikisht")).map((doc) => ({
		id: doc.id,
		type: doc.type,
		label: docLabel(doc.type),
		name: doc.name,
		status: doc.status,
		uploadedAt: doc.uploadedAt ?? null,
		deliveredAt: doc.uploadedAt ?? d.updatedAt,
		electronicallySealed: doc.status === "verified" || !!doc.notes?.includes("Vulosur elektronikisht"),
		sealSource: doc.notes?.includes("/stamps/ashk-demo-stamp.png") ? "/stamps/ashk-demo-stamp.png" : null
	}));
	const now = Date.now();
	const citizenDeadlines = (d.deadlines ?? []).filter((dl) => !dl.resolvedAt).filter((dl) => dl.kind === "legal" || dl.kind === "external").map((dl) => ({
		label: dl.label,
		dueAt: dl.dueAt,
		kind: dl.kind,
		daysRemaining: Math.ceil((new Date(dl.dueAt).getTime() - now) / 864e5)
	})).sort((a, b) => a.dueAt < b.dueAt ? -1 : 1);
	const notifications = (d.audit ?? []).filter((a) => isCitizenAudit(a.action)).map((a) => ({
		at: a.at,
		action: a.action
	})).slice(-20).reverse();
	const citizenComplaints = (d.citizenComplaints ?? []).map((c) => ({
		id: c.id,
		createdAt: c.createdAt,
		subject: c.subject,
		status: c.status,
		stage: c.stage,
		phaseTitle: c.phaseTitle ?? null,
		routedToLabel: c.routedToLabel
	})).slice(-10).reverse();
	const expeditedProcedure = d.expeditedProcedure ? {
		status: d.expeditedProcedure.status,
		reason: d.expeditedProcedure.reason,
		reasonLabel: d.expeditedProcedure.reasonLabel,
		justification: d.expeditedProcedure.justification,
		requestedAt: d.expeditedProcedure.requestedAt,
		requestPdfName: d.expeditedProcedure.requestPdfName,
		requestPdfDocumentId: d.expeditedProcedure.requestPdfDocumentId ?? d.documents.find((doc) => doc.type === "expedite_request_form" && doc.name === d.expeditedProcedure?.requestPdfName)?.id ?? null,
		supportingDocumentName: d.expeditedProcedure.supportingDocumentName,
		supportingDocumentId: d.expeditedProcedure.supportingDocumentId ?? d.documents.find((doc) => doc.type === "expedite_supporting_document" && doc.name === d.expeditedProcedure?.supportingDocumentName)?.id ?? null,
		paymentRequired: d.expeditedProcedure.paymentRequired,
		paymentAmountAll: d.expeditedProcedure.paymentAmountAll ?? null,
		paymentReceiptName: d.expeditedProcedure.paymentReceiptName ?? null,
		paymentReceiptDocumentId: d.expeditedProcedure.paymentReceiptDocumentId ?? d.documents.find((doc) => doc.type === "payment_receipt" && doc.name === d.expeditedProcedure?.paymentReceiptName)?.id ?? null,
		reviewedAt: d.expeditedProcedure.reviewedAt ?? null,
		reviewNote: d.expeditedProcedure.reviewNote ?? null
	} : {
		status: "not_requested",
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
		reviewNote: null
	};
	const mapPreview = (() => {
		const facts = buildAiGisAssessment(d);
		return {
			provider: facts.provider,
			sourceLabel: facts.sourceLabel,
			label: facts.place.label,
			lat: facts.place.lat,
			lon: facts.place.lon,
			zoom: facts.place.zoom,
			accuracyLabel: facts.place.accuracyLabel,
			embedUrl: facts.embedUrl,
			url: facts.realMapUrl,
			zoning: facts.zoning,
			landCategory: facts.landCategory,
			aiRiskLevel: facts.aiRiskLevel,
			aiSignal: facts.aiSignal,
			aiUse: facts.aiUse,
			parcelPolygon: facts.place.parcelPolygon
		};
	})();
	const compensation = d.process === "expropriation" ? (() => {
		const paymentOrder = d.documents.find((doc) => doc.type === "payment_order");
		const paymentConfirmation = d.documents.find((doc) => doc.type === "payment_confirmation");
		const statusLabel = currentOrder >= 6 || paymentConfirmation ? "Pagesa e konfirmuar / ne regjistrim final" : currentOrder === 5 || paymentOrder ? "Ne disbursim nga Ministria e Ekonomise" : currentOrder === 4 ? "Ne njoftim dhe afat ankimi" : currentOrder === 3 ? "Ne vleresim te kompensimit" : "Ne verifikim te pronesise";
		const nextAction = currentOrder >= 6 || paymentConfirmation ? "ASHK kryen regjistrimin perfundimtar dhe mbylljen e dosjes." : currentOrder >= 5 || paymentOrder ? "Pritet konfirmimi i pageses / disbursimit nga Ministria e Ekonomise." : "Operatori verifikon dokumentacionin dhe kalon dosjen ne vleresim.";
		return {
			amountAll: d.finalValueAll ?? null,
			ministry: "Ministria e Ekonomise",
			statusLabel,
			nextAction,
			paymentOrderUploaded: !!paymentOrder,
			paymentConfirmed: !!paymentConfirmation
		};
	})() : null;
	return {
		trackingCode: d.trackingCode,
		process: process.title,
		processKind: d.process,
		status: d.status,
		currentPhase: {
			number: phase?.order ?? 0,
			title: phase?.title ?? "—",
			institution: phase?.institutions[0] ?? "—",
			description: phase?.description ?? ""
		},
		phasesTimeline,
		nextMilestone: next && !next.isFinal ? next.step.title : null,
		nextInstitution: next && !next.isFinal ? next.step.institution : null,
		isFinal: !!next?.isFinal,
		deadline: ds.nearest ? {
			label: ds.nearest.label,
			dueAt: ds.nearest.dueAt,
			daysRemaining: ds.daysRemaining,
			state: ds.state
		} : null,
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
				uploaded: hasSupportingDocument(d, type)
			})),
			missingDocuments: requester.missingDocumentTypes.map((type) => ({
				type,
				label: docLabel(type)
			})),
			verifiedAt: requester.verifiedAt ?? null,
			notes: requester.notes ?? null
		},
		citizenDocuments,
		citizenComplaints,
		expeditedProcedure,
		mapPreview,
		compensation,
		notifications,
		updatedAt: d.updatedAt
	};
}
function submitExpeditedProcedureRequest(code, input) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	if (input.paymentRequired && !input.paymentReceipt) throw new Error("Mandati i pageses kerkohet kur zgjidhet tarifa e pershpejtimit.");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const requestPdfDocumentId = `doc-${d.documents.length + 1}-${Date.now().toString(36)}`;
	const supportingDocumentId = `doc-${d.documents.length + 2}-${Date.now().toString(36)}`;
	const paymentReceiptDocumentId = input.paymentRequired && input.paymentReceipt ? `doc-${d.documents.length + 3}-${Date.now().toString(36)}` : void 0;
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
		paymentAmountAll: input.paymentRequired ? EXPEDITE_DEMO_FEE_ALL : void 0,
		paymentReceiptName: input.paymentRequired ? input.paymentReceipt?.name : void 0,
		paymentReceiptDocumentId
	};
	const docsToAdd = [{
		id: requestPdfDocumentId,
		type: "expedite_request_form",
		file: input.requestPdf,
		notes: "Formular i plotesuar nga qytetari per procedure te pershpejtuar."
	}, {
		id: supportingDocumentId,
		type: "expedite_supporting_document",
		file: input.supportingDocument,
		notes: `Dokument provues: ${d.expeditedProcedure.reasonLabel}.`
	}];
	if (d.expeditedProcedure.paymentRequired && input.paymentReceipt && paymentReceiptDocumentId) docsToAdd.push({
		id: paymentReceiptDocumentId,
		type: "payment_receipt",
		file: input.paymentReceipt,
		notes: `Mandat pagese per tarife demo ${EXPEDITE_DEMO_FEE_ALL} ALL.`
	});
	for (const doc of docsToAdd) {
		d.documents = [...d.documents, {
			id: doc.id,
			type: doc.type,
			name: doc.file.name,
			status: "uploaded",
			uploadedAt: now,
			uploadedBy: "citizen_portal",
			mimeType: doc.file.mimeType,
			sizeBytes: doc.file.sizeBytes,
			contentBase64: doc.file.contentBase64,
			notes: doc.notes
		}];
		d.missingDocumentTypes = d.missingDocumentTypes.filter((type) => type !== doc.type);
	}
	audit(d, {
		actor: "citizen_portal",
		action: "Kerkese per procedure te pershpejtuar u dorezua",
		details: `${d.expeditedProcedure.reasonLabel} · ${d.expeditedProcedure.paymentRequired ? "me mandat pagese" : "pa tarife"}`
	});
	upsert(d);
	return {
		status: d.expeditedProcedure.status,
		reasonLabel: d.expeditedProcedure.reasonLabel,
		requestedAt: d.expeditedProcedure.requestedAt
	};
}
function submitCitizenComplaint(code, input) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	const phase = PROCESSES[d.process].phases.find((p) => p.id === d.currentPhaseId);
	const step = phase?.steps.find((s) => s.id === d.currentStepId);
	const routedTo = routedOperatorForDossier(d);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const stage = input.stage ?? (d.status === "completed" || d.status === "rejected" ? "final_review" : "phase_review");
	const complaint = {
		id: `cmp-${(d.citizenComplaints?.length ?? 0) + 1}-${Date.now().toString(36)}`,
		createdAt: now,
		stage,
		subject: input.subject.trim(),
		message: input.message.trim(),
		contact: input.contact?.trim() || void 0,
		status: "new",
		phaseId: phase?.id,
		phaseTitle: phase?.title,
		stepId: step?.id,
		stepTitle: step?.title,
		routedTo: routedTo.actor,
		routedToLabel: routedTo.label
	};
	d.citizenComplaints = [...d.citizenComplaints ?? [], complaint];
	audit(d, {
		actor: "citizen_portal",
		action: "Ankesë qytetari u përcoll te operatori",
		phaseId: phase?.id,
		stepId: step?.id,
		details: `${complaint.subject} — ${complaint.routedToLabel}`
	});
	upsert(d);
	return {
		id: complaint.id,
		createdAt: complaint.createdAt,
		subject: complaint.subject,
		status: complaint.status,
		stage: complaint.stage,
		phaseTitle: complaint.phaseTitle ?? null,
		routedToLabel: complaint.routedToLabel
	};
}
function stripForPdf(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "-");
}
function escapePdfText(value) {
	return stripForPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function sanitizePdfFileName(value) {
	return stripForPdf(value).replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 90);
}
function sanitizeDownloadFileName(value) {
	return stripForPdf(value).replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 100) || "dokument";
}
function buildSimplePdf(content) {
	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
		`<< /Length ${content.length} >>\nstream\n${content}\nendstream`
	];
	let pdf = "%PDF-1.4\n";
	const offsets = [];
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
function pdfAshkStampCommands(x, y, size = 116) {
	const cx = x + size / 2;
	const cy = y + size / 2;
	const r = size / 2;
	const k = .5522847498;
	const c = r * k;
	const inner = r * .76;
	const ic = inner * k;
	const roofTop = y + size * .82;
	const roofLeft = x + size * .18;
	const roofRight = x + size * .82;
	const roofBase = y + size * .63;
	const text = {
		ashkSize: Math.max(20, size * .24),
		smallSize: Math.max(5.5, size * .058),
		sealSize: Math.max(7, size * .07)
	};
	return [
		"q",
		"1 1 1 rg",
		`${x - 4} ${y - 4} ${size + 8} ${size + 8} re f`,
		"0.90 0.08 0.08 RG",
		"0.90 0.08 0.08 rg",
		"2.2 w",
		`${cx} ${cy + r} m`,
		`${cx + c} ${cy + r} ${cx + r} ${cy + c} ${cx + r} ${cy} c`,
		`${cx + r} ${cy - c} ${cx + c} ${cy - r} ${cx} ${cy - r} c`,
		`${cx - c} ${cy - r} ${cx - r} ${cy - c} ${cx - r} ${cy} c`,
		`${cx - r} ${cy + c} ${cx - c} ${cy + r} ${cx} ${cy + r} c S`,
		"1 w",
		`${cx} ${cy + inner} m`,
		`${cx + ic} ${cy + inner} ${cx + inner} ${cy + ic} ${cx + inner} ${cy} c`,
		`${cx + inner} ${cy - ic} ${cx + ic} ${cy - inner} ${cx} ${cy - inner} c`,
		`${cx - ic} ${cy - inner} ${cx - inner} ${cy - ic} ${cx - inner} ${cy} c`,
		`${cx - inner} ${cy + ic} ${cx - ic} ${cy + inner} ${cx} ${cy + inner} c S`,
		"0.95 0.30 0.02 RG",
		"0.95 0.30 0.02 rg",
		"5 w",
		`${roofLeft} ${roofBase} m ${cx} ${roofTop} l ${roofRight} ${roofBase} l S`,
		"0.02 0.02 0.02 rg",
		"BT",
		`/F1 ${text.ashkSize} Tf`,
		`1 0 0 1 ${x + size * .24} ${y + size * .47} Tm`,
		"(ASHK) Tj",
		`/F1 ${text.smallSize} Tf`,
		`1 0 0 1 ${x + size * .19} ${y + size * .39} Tm`,
		"(AGJENCIA SHTETERORE E KADASTRES) Tj",
		"ET",
		"0.90 0.08 0.08 rg",
		"BT",
		`/F1 ${text.sealSize} Tf`,
		`1 0 0 1 ${x + size * .19} ${y + size * .19} Tm`,
		"(SMART DOSSIER DEMO) Tj",
		`/F1 ${text.smallSize} Tf`,
		`1 0 0 1 ${x + size * .25} ${y + size * .11} Tm`,
		"(VULE ELEKTRONIKE) Tj",
		"ET",
		"Q"
	].join("\n");
}
function parcelPolygonLabel(points) {
	return points.map((point) => `${point.lat}, ${point.lon}`).join(" | ");
}
function akptGisFacts(d) {
	return buildAiGisAssessment(d);
}
function buildAkptMapPdf(d) {
	const process = PROCESSES[d.process];
	const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
	const facts = akptGisFacts(d);
	const { zoning, landCategory, place, realMapUrl } = facts;
	const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString("sq-AL");
	return buildSimplePdf([
		"q",
		"0.96 0.99 0.97 rg",
		"36 36 523 770 re f",
		"Q",
		"q",
		"0.01 0.18 0.35 rg",
		"BT",
		[
			"SMART DOSSIER",
			"PRINTIM AI GIS - VENDODHJA E PRONES",
			"AKPT / e-Harta GIS - konsultim read-only i perdorur nga AI",
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
			`Sinjali AI: ${facts.aiSignal}`,
			`Perdorimi ne proces: ${facts.aiUse}`,
			`Harta reale: ${realMapUrl}`,
			`Gjeneruar: ${generatedAt}`,
			"",
			"Shenim: Ky PDF eshte printim demo i konsultimit te hartes. Nuk kryen shkrim",
			"ne sistemet e AKPT/ASHK dhe perdoret vetem si evidence pune ne dosje.",
			"Ne zbatim real marker/poligon vjen nga koordinatat kadastrale te prones."
		].map((line, index) => {
			const y = 790 - index * 18;
			return `/F1 ${index === 0 ? 18 : index === 1 ? 14 : 9.5} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
		}).join("\n"),
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
		`(Printim GIS - ${escapePdfText(`${d.property.zone} - ${zoning}`)}) Tj`,
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
		pdfAshkStampCommands(392, 188, 122)
	].join("\n"));
}
function buildAkptMapDownload(code) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	return {
		body: buildAkptMapPdf(d),
		fileName: `${sanitizePdfFileName(d.trackingCode)}-harta-gis-akpt.pdf`,
		mimeType: "application/pdf"
	};
}
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function buildAkptMapPrintPage(code) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	const process = PROCESSES[d.process];
	const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
	const facts = akptGisFacts(d);
	const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString("sq-AL");
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
		["Sinjali AI", facts.aiSignal],
		["Perdorimi ne proces", facts.aiUse],
		["Gjeneruar", generatedAt]
	];
	const mapPayload = JSON.stringify({
		center: {
			lat: facts.place.lat,
			lon: facts.place.lon,
			zoom: facts.place.zoom
		},
		polygon: facts.place.parcelPolygon
	});
	return {
		body: `<!doctype html>
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
    .map-stamp { position: absolute; right: 16px; bottom: 18px; width: 128px; height: 128px; object-fit: contain; mix-blend-mode: multiply; opacity: .92; filter: drop-shadow(0 2px 4px rgba(16, 32, 51, .12)); pointer-events: none; }
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
        <h1>Printim AI GIS - vendodhja e prones</h1>
        <div class="sub">AKPT / e-Harta GIS demo me baze OpenStreetMap, i perdorur nga AI</div>
      </div>
      <div class="badge">AI GIS / evidence pune</div>
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
      <img class="map-stamp" src="/stamps/ashk-demo-stamp.png" alt="Vule demo ASHK" />
      <div class="osm-credit">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a></div>
    </section>
    <section class="grid">
      ${rows.map(([label, value]) => `<div class="cell"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></div>`).join("")}
    </section>
    <div class="note">
      ${escapeHtml(facts.place.accuracyLabel)}
      <br />${escapeHtml(facts.aiUse)}
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
  <\/script>
</body>
</html>`,
		fileName: `${sanitizePdfFileName(d.trackingCode)}-printim-gis.html`
	};
}
function buildCitizenPdf(d, doc) {
	const process = PROCESSES[d.process];
	const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
	const deliveredAt = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("sq-AL") : "";
	return buildSimplePdf([
		"q",
		"0.97 0.98 0.99 rg",
		"36 36 523 770 re f",
		"Q",
		"q",
		"0 0 0 rg",
		"BT",
		[
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
			"e ngarkuar nga operatori dhe te vulosur elektronikisht nga sistemi."
		].map((line, index) => {
			const y = 775 - index * 18;
			return `/F1 ${index === 0 ? 18 : 11} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
		}).join("\n"),
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
		"Q"
	].join("\n"));
}
function buildCitizenDocumentDownload(code, documentId) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	if (!canCitizenReceiveDocuments(d)) return null;
	const doc = d.documents.find((item) => item.id === documentId);
	if (!doc) return null;
	if (!(doc.status === "verified" || !!doc.notes?.includes("Vulosur elektronikisht"))) return null;
	return {
		body: buildCitizenPdf(d, doc),
		fileName: `${sanitizePdfFileName(doc.name) || "dokument-i-vulosur"}.pdf`,
		mimeType: "application/pdf"
	};
}
function buildExpeditedProcedureForm(code) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	const applicant = d.parties.find((p) => p.role === "applicant") ?? d.parties[0];
	return {
		body: buildSimplePdf([
			"q",
			"0.98 0.99 1 rg",
			"36 36 523 770 re f",
			"Q",
			"q",
			"0.01 0.18 0.35 rg",
			"BT",
			[
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
				"Data: ____ / ____ / ______        Nenshkrimi: _______________"
			].map((line, index) => {
				const y = 790 - index * 21;
				return `/F1 ${index === 0 ? 18 : index === 1 ? 13 : 10} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
			}).join("\n"),
			"ET",
			"Q",
			"q",
			"0.95 0.73 0.10 RG",
			"3 w",
			"36 744 523 0 m S",
			"Q"
		].join("\n")),
		fileName: `${sanitizePdfFileName(d.trackingCode)}-formular-pershpejtimi.pdf`,
		mimeType: "application/pdf"
	};
}
function buildUploadedDocumentDownload(code, documentId) {
	const d = getByTrackingCode(code);
	if (!d) return null;
	const doc = d.documents.find((item) => item.id === documentId);
	if (!doc) return null;
	if (!(doc.uploadedBy === "citizen_portal" || doc.type === "expedite_request_form" || doc.type === "expedite_supporting_document" || doc.type === "payment_receipt")) return null;
	if (doc.contentBase64) return {
		body: base64ToBytes(doc.contentBase64),
		fileName: sanitizeDownloadFileName(doc.name),
		mimeType: doc.mimeType || "application/octet-stream"
	};
	return {
		body: buildSimplePdf([
			"q",
			"0.98 0.99 1 rg",
			"36 36 523 770 re f",
			"Q",
			"q",
			"0.01 0.18 0.35 rg",
			"BT",
			[
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
				"Ne ngarkimet e reja, Smart Dossier ruan edhe permbajtjen e skedarit."
			].map((line, index) => {
				const y = 790 - index * 21;
				return `/F1 ${index === 0 ? 18 : index === 1 ? 13 : 10} Tf\n1 0 0 1 54 ${y} Tm\n(${escapePdfText(line)}) Tj`;
			}).join("\n"),
			"ET",
			"Q"
		].join("\n")),
		fileName: `${sanitizePdfFileName(doc.name) || "dokument-demo"}.pdf`,
		mimeType: "application/pdf"
	};
}
createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	question: stringType().min(2).max(2e3)
}).parse(input)).handler(createSsrRpc("29e038faedf80ac0bf2555e6ab221d45e2ea7940bc9fba766d3ce367e28e03e6"));
var aiRiskBrief = createServerFn({ method: "POST" }).handler(createSsrRpc("626a3bacfc2dc615929a8fe8699f97d715328a5df78601fbd93b8cc60802d7c0"));
//#endregion
export { submitCitizenComplaint as C, uploadDocument as E, runAutoAssignment as S, updateRequesterVerification as T, getDossier as _, buildAkptMapDownload as a, resetDemo as b, buildExpeditedProcedureForm as c, calculateEkbValuation as d, createBusinessPropertyApplication as f, getDashboard as g, createSsrRpc as h, assignDossier as i, buildTrackingPayload as l, createExpropriationCompensationApplication as m, advanceDossier as n, buildAkptMapPrintPage as o, createDossier as p, aiRiskBrief as r, buildCitizenDocumentDownload as s, addOperator as t, buildUploadedDocumentDownload as u, listDossiers as v, submitExpeditedProcedureRequest as w, reviewExpeditedProcedure as x, removeOperator as y };
