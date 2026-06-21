import { $ as nullType, Q as lazyType, X as booleanType, Y as arrayType, Z as enumType, et as numberType, it as unionType, nt as recordType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as listDemoOperators, c as removeDemoOperator, d as upsert, l as resetDemoOperators, n as allDossiers, o as nextId, r as getById, t as addDemoOperator, u as resetStore } from "./store-mnrjP0DR.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { a as getDeadlineState, c as notFound, i as getCriticalAlerts, o as getNextStep, r as buildDossierSummaryFacts, s as inferPriority, t as audit } from "./dossiers-helpers-BSyvCqzm.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { t as calculateEkbDetailedValuation } from "./value-C0fg0E9w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossiers.functions-CkLjTu_L.js
var jsonValueSchema = lazyType(() => unionType([
	stringType(),
	numberType(),
	booleanType(),
	nullType(),
	arrayType(jsonValueSchema),
	recordType(jsonValueSchema)
]));
var AUTO_ASSIGN_AFTER_MS = 1800 * 1e3;
var IDENTITY_DOC_TYPE = "id_card_copy";
var REPRESENTATION_DOC_TYPE = "legal_authorization";
var processKindSchema = enumType([
	"ekb_privatization",
	"expropriation",
	"property_registration"
]);
function isActiveDossier(d) {
	return d.status !== "completed" && d.status !== "rejected";
}
function operatorWorkloads(dossiers = allDossiers()) {
	return listDemoOperators().map((operator) => ({
		...operator,
		activeCases: dossiers.filter((d) => isActiveDossier(d) && d.assignedOperatorId === operator.id).length
	})).sort((a, b) => a.activeCases - b.activeCases || a.name.localeCompare(b.name));
}
function leastLoadedOperator(dossiers = allDossiers()) {
	return operatorWorkloads(dossiers)[0] ?? listDemoOperators()[0];
}
function applyAssignment(d, operatorId, mode) {
	const operator = listDemoOperators().find((item) => item.id === operatorId) ?? leastLoadedOperator();
	if (!operator) throw new Error("Nuk ka operatore aktive per caktim.");
	d.assignedOperatorId = operator.id;
	d.assignedOperatorName = operator.name;
	d.assignedAt = (/* @__PURE__ */ new Date()).toISOString();
	d.assignmentMode = mode;
	d.assignmentDueAt = void 0;
	audit(d, {
		actor: mode === "auto" ? "system" : "admin_demo",
		action: mode === "auto" ? "Dosja u caktua automatikisht te operatori me më pak çështje" : "Admini caktoi operatorin e dosjes",
		details: `${operator.name} · ${operator.unit}`
	});
	return d;
}
function pendingAssignmentDossiers(now = /* @__PURE__ */ new Date()) {
	return allDossiers().filter((d) => isActiveDossier(d) && !d.assignedOperatorId).map((d) => ({
		dossier: d,
		dueAt: d.assignmentDueAt ?? new Date(new Date(d.createdAt).getTime() + AUTO_ASSIGN_AFTER_MS).toISOString(),
		overdue: new Date(d.assignmentDueAt ?? new Date(new Date(d.createdAt).getTime() + AUTO_ASSIGN_AFTER_MS)).getTime() <= now.getTime()
	})).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}
function applyDueAutoAssignments(now = /* @__PURE__ */ new Date()) {
	return pendingAssignmentDossiers(now).filter((item) => item.overdue).map(({ dossier }) => {
		applyAssignment(dossier, leastLoadedOperator().id, "auto");
		upsert(dossier);
		return {
			id: dossier.id,
			trackingCode: dossier.trackingCode,
			assignedOperatorName: dossier.assignedOperatorName
		};
	});
}
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
function syncRequesterMissingDocuments(d, requiredDocumentTypes) {
	const nextMissing = new Set(d.missingDocumentTypes ?? []);
	for (const type of requiredDocumentTypes) if (hasSupportingDocument(d, type)) nextMissing.delete(type);
	else nextMissing.add(type);
	d.missingDocumentTypes = Array.from(nextMissing);
}
var listDossiers_createServerFn_handler = createServerRpc({
	id: "80c96e2840c88865dae9824ca05fbdd70d622f4b49b768966182333db8947a14",
	name: "listDossiers",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => listDossiers.__executeServer(opts));
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
}).parse(input ?? {})).handler(listDossiers_createServerFn_handler, async ({ data }) => {
	applyDueAutoAssignments();
	const q = (data.search ?? "").trim().toLowerCase();
	const items = allDossiers().filter((d) => !data.process || d.process === data.process).filter((d) => !data.status || d.status === data.status).filter((d) => !data.phaseId || d.currentPhaseId === data.phaseId).filter((d) => !q || d.title.toLowerCase().includes(q) || d.trackingCode.toLowerCase().includes(q) || d.parties.some((p) => p.fullName.toLowerCase().includes(q))).map((d) => {
		const proc = PROCESSES[d.process];
		const alerts = getCriticalAlerts(d, proc);
		const ds = getDeadlineState(d, proc);
		return {
			...d,
			priority: inferPriority(d),
			criticalCount: alerts.filter((a) => a.severity === "critical").length,
			warningCount: alerts.filter((a) => a.severity === "warning").length,
			deadlineState: ds.state
		};
	}).filter((d) => !data.priority || d.priority === data.priority).sort((a, b) => b.updatedAt > a.updatedAt ? 1 : -1);
	return {
		items,
		total: items.length
	};
});
var getDossier_createServerFn_handler = createServerRpc({
	id: "f3750e373eca6abac627b0c4170263e1421d7f06012da2c79b0021f2db265358",
	name: "getDossier",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => getDossier.__executeServer(opts));
var getDossier = createServerFn({ method: "GET" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(getDossier_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	const process = PROCESSES[d.process];
	return {
		dossier: d,
		summary: buildDossierSummaryFacts(d, process),
		alerts: getCriticalAlerts(d, process),
		deadline: getDeadlineState(d, process),
		nextStep: getNextStep(d, process)
	};
});
var createDossier_createServerFn_handler = createServerRpc({
	id: "c53ebd925849cac9290687e3c83599ed0df953bdbc87d8e60aef7e84861d1808",
	name: "createDossier",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => createDossier.__executeServer(opts));
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
}).parse(input)).handler(createDossier_createServerFn_handler, async ({ data }) => {
	const processKind = data.process;
	const process = PROCESSES[processKind];
	const first = processKind === "ekb_privatization" && data.documents.length > 0 ? process.phases.find((phase) => phase.id === "ekb-p3") ?? process.phases[0] : process.phases[0];
	const prefix = data.process === "ekb_privatization" ? "d-ekb-" : data.process === "property_registration" ? "d-biz-" : "d-exp-";
	const trackPrefix = data.process === "ekb_privatization" ? "EKB" : data.process === "property_registration" ? "BIZ" : "EXP";
	const counter = allDossiers().filter((d) => d.process === data.process).length + 1;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
	const requesterRequired = requesterRequiredDocuments(processKind, "owner");
	const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
	const requiredDocumentTypes = Array.from(new Set([...first.steps[0].requiredDocuments ?? [], ...requesterRequired]));
	const d = {
		id: nextId(prefix),
		trackingCode: `${trackPrefix}-2026-${String(counter + 900).padStart(6, "0")}`,
		process: data.process,
		title: data.title,
		status: "draft",
		currentPhaseId: first.id,
		currentStepId: first.steps[0].id,
		parties: [{
			id: "p1",
			role: data.process === "expropriation" ? "expropriated_owner" : "applicant",
			fullName: data.applicantName,
			businessNipt: data.applicantNipt
		}],
		property: {
			description: data.propertyDescription,
			zone: data.zone,
			areaSqm: data.areaSqm,
			familyIncomeAll: data.familyIncomeAll,
			marketPriceAll: data.marketPriceAll,
			landPriceAll: data.landPriceAll
		},
		documents: data.documents.map((doc, index) => ({
			id: `doc-app-${index + 1}-${Date.now().toString(36)}`,
			type: doc.type,
			name: doc.name,
			status: "uploaded",
			uploadedAt: now,
			uploadedBy: data.process === "property_registration" ? "business_portal" : "citizen_portal",
			requiredAtStepId: first.steps[0].id,
			notes: data.process === "property_registration" ? "Ngarkuar nga biznesi ne aplikimin fillestar." : "Ngarkuar nga qytetari ne aplikimin fillestar."
		})),
		missingDocumentTypes: requiredDocumentTypes.filter((type) => !uploadedTypes.has(type)),
		deadlines: [],
		audit: [],
		insights: [],
		requesterVerification: {
			claimType: "owner",
			cadastralSubjectName: data.applicantName,
			status: requiredDocumentTypes.every((type) => uploadedTypes.has(type)) ? "verified" : "needs_documents",
			requiredDocumentTypes: requesterRequired,
			verifiedAt: requiredDocumentTypes.every((type) => uploadedTypes.has(type)) ? now : void 0,
			verifiedBy: requiredDocumentTypes.every((type) => uploadedTypes.has(type)) ? "system" : void 0,
			notes: "Duhet vertetuar qe kerkuesi eshte personi ne kartelen kadastrale ose perfaqesues ligjor."
		},
		createdAt: now,
		updatedAt: now,
		assignmentDueAt,
		submittedFrom: data.process === "property_registration" ? "business_portal" : "citizen_portal",
		notes: data.notes
	};
	audit(d, {
		actor: data.process === "property_registration" ? "business_portal" : "citizen_portal",
		action: data.process === "property_registration" ? "Aplikim i ri nga biznesi" : "Aplikim i ri nga qytetari",
		details: data.process === "property_registration" ? `NIPT ${data.applicantNipt ?? "-"} · ne pritje per caktim operatori · auto pas 30 minutash` : `Në pritje për caktim operatori · auto pas 30 minutash`
	});
	upsert(d);
	return {
		id: d.id,
		trackingCode: d.trackingCode,
		trackingUrl: `/track/${d.trackingCode}`
	};
});
var createBusinessPropertyApplication_createServerFn_handler = createServerRpc({
	id: "bd2ab22d6bb16d724197024431b8eb2bbccbfbbb662db1da1fc8f94e30c4ecc5",
	name: "createBusinessPropertyApplication",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => createBusinessPropertyApplication.__executeServer(opts));
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
}).parse(input)).handler(createBusinessPropertyApplication_createServerFn_handler, async ({ data }) => {
	const processKind = "property_registration";
	const first = PROCESSES[processKind].phases[0];
	const counter = allDossiers().filter((d) => d.process === processKind).length + 1;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
	const requiredDocumentTypes = requesterRequiredDocuments(processKind, "owner");
	const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
	const missing = Array.from(new Set([...first.steps[0].requiredDocuments ?? [], ...requiredDocumentTypes])).filter((type) => !uploadedTypes.has(type));
	const d = {
		id: nextId("d-biz-"),
		trackingCode: `BIZ-2026-${String(counter + 900).padStart(6, "0")}`,
		process: processKind,
		title: `Regjistrim prone biznesi - ${data.businessName}`,
		status: "draft",
		currentPhaseId: first.id,
		currentStepId: first.steps[0].id,
		parties: [{
			id: "p1",
			role: "applicant",
			fullName: data.businessName,
			businessNipt: data.nipt.trim().toUpperCase()
		}, {
			id: "p2",
			role: "representative",
			fullName: data.representativeName
		}],
		property: {
			description: data.propertyDescription,
			zone: data.zone,
			cadastralNo: data.cadastralNo?.trim() || void 0,
			areaSqm: data.areaSqm
		},
		documents: data.documents.map((doc, index) => ({
			id: `doc-biz-${index + 1}-${Date.now().toString(36)}`,
			type: doc.type,
			name: doc.name,
			status: "uploaded",
			uploadedAt: now,
			uploadedBy: "business_portal",
			notes: "Ngarkuar nga biznesi ne aplikimin fillestar."
		})),
		missingDocumentTypes: missing,
		deadlines: [{
			id: "biz-dl-1",
			kind: "sla",
			label: "Shqyrtimi fillestar i dokumentacionit",
			dueAt: new Date(Date.now() + 2880 * 60 * 1e3).toISOString(),
			phaseId: first.id,
			stepId: first.steps[0].id
		}],
		audit: [],
		insights: [],
		requesterVerification: {
			claimType: "owner",
			cadastralSubjectName: data.businessName,
			status: missing.length === 0 ? "verified" : "needs_documents",
			requiredDocumentTypes,
			verifiedAt: missing.length === 0 ? now : void 0,
			verifiedBy: missing.length === 0 ? "system" : void 0,
			notes: `Subjekt biznesi i identifikuar me NIPT ${data.nipt.trim().toUpperCase()}.`
		},
		createdAt: now,
		updatedAt: now,
		assignmentDueAt,
		submittedFrom: "business_portal",
		notes: data.notes?.trim() || void 0
	};
	audit(d, {
		actor: "business_portal",
		action: "Aplikim i ri biznesi per regjistrim prone",
		details: `NIPT ${data.nipt.trim().toUpperCase()} · ${data.documents.length} dokumente te ngarkuara · auto-assign pas 30 minutash`
	});
	upsert(d);
	return {
		id: d.id,
		trackingCode: d.trackingCode,
		trackingUrl: `/track/${d.trackingCode}`
	};
});
var createExpropriationCompensationApplication_createServerFn_handler = createServerRpc({
	id: "c8ad3116e9583dd944513df8d4f90c71f8ace4f6bef0306a0e879e733037f7e9",
	name: "createExpropriationCompensationApplication",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => createExpropriationCompensationApplication.__executeServer(opts));
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
}).parse(input)).handler(createExpropriationCompensationApplication_createServerFn_handler, async ({ data }) => {
	if (data.applicantType === "business" && !data.nipt?.trim()) throw new Error("Per biznesin kerkohet NIPT.");
	const processKind = "expropriation";
	const process = PROCESSES[processKind];
	const currentPhase = process.phases.find((phase) => phase.id === "exp-p2") ?? process.phases[0];
	const currentStep = currentPhase.steps.find((step) => step.id === "exp-s2") ?? currentPhase.steps[0];
	const counter = allDossiers().filter((d) => d.process === processKind).length + 1;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const assignmentDueAt = new Date(Date.now() + AUTO_ASSIGN_AFTER_MS).toISOString();
	const source = data.applicantType === "business" ? "business_portal" : "citizen_portal";
	const requiredDocumentTypes = data.applicantType === "business" ? [
		"business_nipt_extract",
		"legal_representative_id",
		"ownership_extract",
		"expropriation_notice",
		"compensation_claim_request",
		"bank_account_certificate"
	] : [
		"id_card_copy",
		"ownership_extract",
		"civil_status_extract",
		"expropriation_notice",
		"compensation_claim_request",
		"bank_account_certificate"
	];
	const uploadedTypes = new Set(data.documents.map((doc) => doc.type));
	const missing = requiredDocumentTypes.filter((type) => !uploadedTypes.has(type));
	const projectName = data.projectName?.trim() || "Projekt publik me vendim shpronesimi / interes publik";
	const bankTail = data.bankAccountLabel?.trim().slice(-4);
	const d = {
		id: nextId("d-exp-"),
		trackingCode: `EXP-2026-${String(counter + 900).padStart(6, "0")}`,
		process: processKind,
		title: data.applicantType === "business" ? `Kompensim shpronesimi biznesi - ${data.applicantName}` : `Kompensim shpronesimi qytetari - ${data.applicantName}`,
		status: "draft",
		currentPhaseId: currentPhase.id,
		currentStepId: currentStep.id,
		parties: [{
			id: "p1",
			role: "expropriated_owner",
			fullName: data.applicantName,
			businessNipt: data.applicantType === "business" ? data.nipt?.trim().toUpperCase() : void 0
		}, ...data.representativeName?.trim() ? [{
			id: "p2",
			role: "representative",
			fullName: data.representativeName.trim()
		}] : []],
		property: {
			description: data.propertyDescription,
			zone: data.zone,
			cadastralNo: data.cadastralNo?.trim() || void 0,
			areaSqm: data.areaSqm
		},
		documents: data.documents.map((doc, index) => ({
			id: `doc-exp-${index + 1}-${Date.now().toString(36)}`,
			type: doc.type,
			name: doc.name,
			status: "uploaded",
			uploadedAt: now,
			uploadedBy: source,
			notes: data.applicantType === "business" ? "Ngarkuar nga biznesi per kompensim shpronesimi." : "Ngarkuar nga qytetari per kompensim shpronesimi."
		})),
		missingDocumentTypes: missing,
		deadlines: [{
			id: "exp-claim-dl-1",
			kind: "sla",
			label: "Verifikim i pronesise dhe dokumentacionit",
			dueAt: new Date(Date.now() + 7200 * 60 * 1e3).toISOString(),
			phaseId: currentPhase.id,
			stepId: currentStep.id
		}, {
			id: "exp-claim-dl-2",
			kind: "external",
			label: "Pagesa nga Ministria e Ekonomise",
			dueAt: new Date(Date.now() + 1080 * 60 * 60 * 1e3).toISOString(),
			phaseId: "exp-p5",
			stepId: "exp-s5"
		}],
		audit: [],
		insights: [{
			id: "ins-exp-payment",
			kind: "next_step",
			createdAt: now,
			text: "Pas verifikimit dhe vleresimit, dosja kalon te faza e pageses nga Ministria e Ekonomise.",
			confidence: .88
		}],
		requesterVerification: {
			claimType: data.representativeName?.trim() ? "legal_representative" : "owner",
			cadastralSubjectName: data.applicantName,
			status: missing.length === 0 ? "verified" : "needs_documents",
			requiredDocumentTypes,
			verifiedAt: missing.length === 0 ? now : void 0,
			verifiedBy: missing.length === 0 ? "system" : void 0,
			notes: data.applicantType === "business" ? `Subjekt biznesi me NIPT ${data.nipt?.trim().toUpperCase()} ne kerkese kompensimi.` : "Kerkese kompensimi nga pronari / perfaqesuesi i prones se shpronesuar."
		},
		createdAt: now,
		updatedAt: now,
		assignmentDueAt,
		submittedFrom: source,
		finalValueAll: data.compensationAmountAll,
		notes: [
			data.notes?.trim(),
			`Projekt: ${projectName}`,
			bankTail ? `IBAN/llogari bankare e deklaruar: ****${bankTail}` : null
		].filter(Boolean).join("\n")
	};
	audit(d, {
		actor: source,
		action: data.applicantType === "business" ? "Aplikim biznesi per kompensim shpronesimi" : "Aplikim qytetari per kompensim shpronesimi",
		details: `${projectName} · kalon per shqyrtim operatori dhe disbursim nga Ministria e Ekonomise`
	});
	upsert(d);
	return {
		id: d.id,
		trackingCode: d.trackingCode,
		trackingUrl: `/track/${d.trackingCode}`
	};
});
var patchDossier_createServerFn_handler = createServerRpc({
	id: "b33afff6fc891b390f1c42da8f63fc618a630773d6382b92d2451cd209e67a9f",
	name: "patchDossier",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => patchDossier.__executeServer(opts));
var patchDossier = createServerFn({ method: "POST" }).validator((input) => objectType({
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
}).parse(input)).handler(patchDossier_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	const changes = [];
	if (data.title && data.title !== d.title) {
		d.title = data.title;
		changes.push("titulli");
	}
	if (data.status && data.status !== d.status) {
		d.status = data.status;
		changes.push(`status=${data.status}`);
	}
	if (data.notes !== void 0) {
		d.notes = data.notes;
		changes.push("shënime");
	}
	if (data.finalValueAll !== void 0) {
		d.finalValueAll = data.finalValueAll;
		changes.push(`vlerë=${data.finalValueAll}`);
	}
	if (changes.length) {
		audit(d, {
			actor: "civil_servant_demo",
			action: "Përditësim dosjeje",
			details: changes.join(", ")
		});
		upsert(d);
	}
	return {
		ok: true,
		changes
	};
});
var calculateEkbValuation_createServerFn_handler = createServerRpc({
	id: "bf0de61d89aec0f26c0d94c9dc0a79fddaa1f37259745931d936885dced9bcd6",
	name: "calculateEkbValuation",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => calculateEkbValuation.__executeServer(opts));
var calculateEkbValuation = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(calculateEkbValuation_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	if (d.process !== "ekb_privatization") throw new Error("Akt Vleresimi eshte i vlefshem vetem per dosjet EKB.");
	const income = d.property.familyIncomeAll;
	const market = d.property.marketPriceAll;
	const land = d.property.landPriceAll ?? 0;
	if (income === void 0 || market === void 0) throw new Error("Mungojne te ardhurat familjare ose cmimi i tregut. Kryeni nxjerrjen/verifikimin e dokumenteve fillimisht.");
	const valuation = calculateEkbDetailedValuation({
		familyIncomeAll: income,
		marketPriceAll: market,
		landPriceAll: land,
		areaSqm: d.property.areaSqm
	});
	d.finalValueAll = valuation.finalValueAll;
	d.insights = [...d.insights, {
		id: `ai-val-${d.insights.length + 1}-${Date.now().toString(36)}`,
		kind: "valuation",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		text: `Akt Vleresimi: ${valuation.finalValueAll.toLocaleString("sq-AL")} ALL (${valuation.ruleApplied})`,
		data: {
			formula: valuation.formula,
			finalValueAll: valuation.finalValueAll,
			housingPayableAll: valuation.housingPayableAll,
			landPayableAll: valuation.landPayableAll,
			legalReferences: valuation.legalReferences,
			steps: valuation.steps.map((step) => ({
				title: step.title,
				legalReference: step.legalReference,
				formula: step.formula,
				resultAll: step.resultAll ?? null,
				explanation: step.explanation
			}))
		},
		confidence: 1
	}];
	const documentRecord = {
		id: `val-${d.documents.filter((doc) => doc.type === "ekb_value_calculation").length + 1}-${Date.now().toString(36)}`,
		type: "ekb_value_calculation",
		name: `Akt Vleresimi - ${d.trackingCode}`,
		status: "uploaded",
		uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
		uploadedBy: "ai_assistant",
		notes: `Vlera finale ${valuation.finalValueAll.toLocaleString("sq-AL")} ALL; ${valuation.formula}`
	};
	d.documents = [...d.documents, documentRecord];
	d.missingDocumentTypes = d.missingDocumentTypes.filter((type) => type !== "valuation_report");
	audit(d, {
		actor: d.assignedOperatorId ?? "ai_assistant",
		action: "AI llogariti Akt Vleresimi",
		details: `${valuation.formula} = ${valuation.finalValueAll.toLocaleString("sq-AL")} ALL; dokument=${documentRecord.name}`
	});
	upsert(d);
	return {
		ok: true,
		valuation,
		document: documentRecord
	};
});
var updateRequesterVerification_createServerFn_handler = createServerRpc({
	id: "2107c001eb9accb79e957effa2e83c01d120d64c8e4effce687dd41ec2776183",
	name: "updateRequesterVerification",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => updateRequesterVerification.__executeServer(opts));
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
}).parse(input)).handler(updateRequesterVerification_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	const requiredDocumentTypes = requesterRequiredDocuments(d.process, data.claimType);
	syncRequesterMissingDocuments(d, requiredDocumentTypes);
	const missingDocumentTypes = requiredDocumentTypes.filter((type) => !hasSupportingDocument(d, type));
	if (data.status === "verified" && missingDocumentTypes.length > 0) throw new Error(`Nuk mund te verifikohet pa dokumentet: ${missingDocumentTypes.map(docLabel).join(", ")}`);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const nextStatus = data.status === "verified" && missingDocumentTypes.length === 0 ? "verified" : data.status;
	d.requesterVerification = {
		claimType: data.claimType,
		cadastralSubjectName: data.cadastralSubjectName?.trim() || d.parties[0]?.fullName,
		status: nextStatus,
		requiredDocumentTypes,
		verifiedAt: nextStatus === "verified" ? now : void 0,
		verifiedBy: nextStatus === "verified" ? "civil_servant_demo" : void 0,
		notes: data.notes?.trim() || void 0
	};
	audit(d, {
		actor: "civil_servant_demo",
		action: nextStatus === "verified" ? "E drejta e kerkuesit u verifikua" : nextStatus === "rejected" ? "E drejta e kerkuesit u refuzua" : "Verifikimi i kerkuesit kerkon plotesim",
		details: `${data.claimType === "legal_representative" ? "Perfaqesues ligjor" : "Pronari/kerkuesi"} · ${d.requesterVerification.cadastralSubjectName ?? "-"}`
	});
	upsert(d);
	return {
		ok: true,
		requesterVerification: d.requesterVerification
	};
});
var reviewExpeditedProcedure_createServerFn_handler = createServerRpc({
	id: "98f818cdd1a70f4673585b72d35015eb2005866271e5b9e9734a2373b6b98f08",
	name: "reviewExpeditedProcedure",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => reviewExpeditedProcedure.__executeServer(opts));
var reviewExpeditedProcedure = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	status: enumType(["approved", "rejected"]),
	reviewNote: stringType().max(1e3).optional()
}).parse(input)).handler(reviewExpeditedProcedure_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	if (!d.expeditedProcedure || d.expeditedProcedure.status === "not_requested") throw new Error("Nuk ka kerkese per procedure te pershpejtuar.");
	d.expeditedProcedure = {
		...d.expeditedProcedure,
		status: data.status,
		reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
		reviewedBy: "civil_servant_demo",
		reviewNote: data.reviewNote?.trim() || void 0
	};
	audit(d, {
		actor: "civil_servant_demo",
		action: data.status === "approved" ? "Procedura e pershpejtuar u miratua" : "Procedura e pershpejtuar u refuzua",
		details: data.reviewNote?.trim() || d.expeditedProcedure.reasonLabel
	});
	upsert(d);
	return {
		ok: true,
		expeditedProcedure: d.expeditedProcedure
	};
});
var advanceDossier_createServerFn_handler = createServerRpc({
	id: "065d4fcd30e1c8e67eccb3f8c7a0dc1e64e83e0ffdd6a79af075417468fcf256",
	name: "advanceDossier",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => advanceDossier.__executeServer(opts));
var advanceDossier = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType() }).parse(input)).handler(advanceDossier_createServerFn_handler, async ({ data }) => {
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
				stepId: d.currentStepId
			});
			upsert(d);
		}
		return {
			ok: true,
			final: true
		};
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
		details: `nga ${fromPhase}/${fromStep} → ${next.phase.id}/${next.step.id}`
	});
	upsert(d);
	return {
		ok: true,
		final: false,
		currentPhaseId: d.currentPhaseId,
		currentStepId: d.currentStepId
	};
});
var uploadDocument_createServerFn_handler = createServerRpc({
	id: "de89a94eba4b27a6ba8f67bd1943f8f7dabb13f56e5c2a651d24f926676a394f",
	name: "uploadDocument",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => uploadDocument.__executeServer(opts));
var uploadDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	type: stringType().min(1),
	name: stringType().min(1),
	content: stringType().max(2e5).optional(),
	aiGenerated: booleanType().optional(),
	electronicSeal: booleanType().optional(),
	extracted: recordType(jsonValueSchema).optional(),
	confidence: numberType().min(0).max(1).optional()
}).parse(input)).handler(uploadDocument_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	const doc = {
		id: `doc-${d.documents.length + 1}-${Date.now().toString(36)}`,
		type: data.type,
		name: data.name,
		status: data.electronicSeal ? "verified" : "uploaded",
		uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
		uploadedBy: "civil_servant_demo",
		notes: [data.content ? `inline content (${data.content.length} bytes)` : null, data.electronicSeal ? "Vulosur elektronikisht nga Smart Dossier me vulen e institucionit (/stamps/ashk-demo-stamp.png)." : null].filter(Boolean).join(" ")
	};
	d.documents = [...d.documents, doc];
	d.missingDocumentTypes = d.missingDocumentTypes.filter((t) => t !== data.type);
	syncRequesterMissingDocuments(d, requesterEvidence(d).requiredDocumentTypes);
	if (data.extracted) d.insights = [...d.insights, {
		id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
		kind: "extraction",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		text: `AI extraction: ${data.type}`,
		data: data.extracted,
		confidence: data.confidence ?? .8,
		sourceDocumentId: doc.id
	}];
	audit(d, {
		actor: data.aiGenerated ? "ai_assistant" : "civil_servant_demo",
		action: data.electronicSeal ? "PDF u ngarkua dhe u vulos elektronikisht" : data.aiGenerated ? "Dokument i gjeneruar (AI)" : "Dokument u ngarkua",
		details: data.electronicSeal ? `${data.type} — ${data.name} — dërguar qytetarit` : `${data.type} — ${data.name}`
	});
	upsert(d);
	return {
		ok: true,
		documentId: doc.id
	};
});
var assignDossier_createServerFn_handler = createServerRpc({
	id: "8c174ad2d17609d8cfe955d80b3a6e49780d3b581dd3bc26d837d7c4b8f89629",
	name: "assignDossier",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => assignDossier.__executeServer(opts));
var assignDossier = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	operatorId: stringType().min(1)
}).parse(input)).handler(assignDossier_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	applyAssignment(d, data.operatorId, "manual");
	upsert(d);
	return {
		ok: true,
		assignedOperatorId: d.assignedOperatorId,
		assignedOperatorName: d.assignedOperatorName
	};
});
var runAutoAssignment_createServerFn_handler = createServerRpc({
	id: "04956febe7ce79ad1900babc735441a572ffc65dc2db8937b51267f25537f313",
	name: "runAutoAssignment",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => runAutoAssignment.__executeServer(opts));
var runAutoAssignment = createServerFn({ method: "POST" }).handler(runAutoAssignment_createServerFn_handler, async () => {
	return {
		ok: true,
		assigned: applyDueAutoAssignments()
	};
});
var addOperator_createServerFn_handler = createServerRpc({
	id: "4de42a5fd7ad902b30f7fde1f9df2aceb8e165e1128c7f5c246fd3561fad419a",
	name: "addOperator",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => addOperator.__executeServer(opts));
var addOperator = createServerFn({ method: "POST" }).validator((input) => objectType({
	name: stringType().min(2),
	unit: stringType().min(2)
}).parse(input)).handler(addOperator_createServerFn_handler, async ({ data }) => {
	return {
		ok: true,
		operator: addDemoOperator(data)
	};
});
var removeOperator_createServerFn_handler = createServerRpc({
	id: "7196d0b08bf7b696f8a023127eac7d78ad2b43b2c101637c36716417bb479fb1",
	name: "removeOperator",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => removeOperator.__executeServer(opts));
var removeOperator = createServerFn({ method: "POST" }).validator((input) => objectType({ id: stringType().min(1) }).parse(input)).handler(removeOperator_createServerFn_handler, async ({ data }) => {
	if (listDemoOperators().length <= 1) throw new Error("Duhet te mbetet te pakten nje operator aktiv.");
	const removed = removeDemoOperator(data.id);
	if (!removed) throw new Error("Operatori nuk u gjet.");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let requeued = 0;
	for (const dossier of allDossiers()) {
		if (dossier.assignedOperatorId !== removed.id) continue;
		dossier.assignedOperatorId = void 0;
		dossier.assignedOperatorName = void 0;
		dossier.assignedAt = void 0;
		dossier.assignmentMode = void 0;
		dossier.assignmentDueAt = now;
		audit(dossier, {
			actor: "admin_demo",
			action: "Operatori u hoq nga lista aktive",
			details: `${removed.name} u hoq; dosja u kthye ne radhen e caktimit.`
		});
		upsert(dossier);
		requeued += 1;
	}
	return {
		ok: true,
		removed,
		requeued
	};
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "211f31dda31166e18b0c1106d9cb5cda479b700322f598442c6a24ded448401c",
	name: "getDashboard",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).handler(getDashboard_createServerFn_handler, async () => {
	applyDueAutoAssignments();
	const dossiers = allDossiers();
	const countsByProcess = {};
	const countsByStatus = {};
	const countsByPhase = [];
	const phaseAcc = /* @__PURE__ */ new Map();
	for (const d of dossiers) {
		countsByProcess[d.process] = (countsByProcess[d.process] ?? 0) + 1;
		countsByStatus[d.status] = (countsByStatus[d.status] ?? 0) + 1;
		const phase = PROCESSES[d.process].phases.find((p) => p.id === d.currentPhaseId);
		const key = `${d.process}:${d.currentPhaseId}`;
		const prev = phaseAcc.get(key);
		if (prev) prev.count += 1;
		else phaseAcc.set(key, {
			processKind: d.process,
			phaseId: d.currentPhaseId,
			phaseTitle: phase?.title ?? d.currentPhaseId,
			count: 1
		});
	}
	for (const v of phaseAcc.values()) countsByPhase.push(v);
	countsByPhase.sort((a, b) => b.count - a.count);
	const now = /* @__PURE__ */ new Date();
	const criticalAlerts = dossiers.flatMap((d) => getCriticalAlerts(d, PROCESSES[d.process], now).filter((a) => a.severity === "critical").map((a) => ({
		dossierId: d.id,
		trackingCode: d.trackingCode,
		title: d.title,
		alert: a
	})));
	const expiring = dossiers.map((d) => ({
		d,
		ds: getDeadlineState(d, PROCESSES[d.process], now)
	})).filter((x) => x.ds.state === "due_soon" || x.ds.state === "overdue").map((x) => ({
		dossierId: x.d.id,
		trackingCode: x.d.trackingCode,
		title: x.d.title,
		state: x.ds.state,
		daysRemaining: x.ds.daysRemaining,
		label: x.ds.nearest?.label,
		dueAt: x.ds.nearest?.dueAt
	})).sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0));
	const bottleneckMap = /* @__PURE__ */ new Map();
	const dayMs = 1440 * 60 * 1e3;
	for (const d of dossiers) {
		const phase = PROCESSES[d.process].phases.find((p) => p.id === d.currentPhaseId);
		const step = phase?.steps.find((s) => s.id === d.currentStepId);
		const key = `${d.process}:${d.currentPhaseId}`;
		const stuck = d.status === "blocked" || d.status === "awaiting_external" ? 1 : 0;
		const enteredAt = [...d.audit].reverse().find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ?? d.createdAt;
		const daysInPhase = Math.max(0, Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs));
		const sevWeight = (step?.criticalPoints ?? []).reduce((acc, c) => acc + (c.severity === "critical" ? 3 : c.severity === "warning" ? 1 : 0), 0);
		const prev = bottleneckMap.get(key);
		if (prev) {
			prev.stuck += stuck;
			prev.total += 1;
			prev.daysSum += daysInPhase;
			(step?.criticalPoints ?? []).forEach((c) => prev.alertLabels.add(c.label));
		} else bottleneckMap.set(key, {
			processKind: d.process,
			phaseId: d.currentPhaseId,
			phaseTitle: phase?.title ?? d.currentPhaseId,
			stuck,
			total: 1,
			daysSum: daysInPhase,
			severityWeight: sevWeight,
			alertLabels: new Set((step?.criticalPoints ?? []).map((c) => c.label))
		});
	}
	const bottlenecks = Array.from(bottleneckMap.values()).map((b) => {
		const avgDays = b.total ? Math.round(b.daysSum / b.total) : 0;
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
			score
		};
	}).sort((a, b) => b.score - a.score).slice(0, 5);
	const recentExtractions = dossiers.flatMap((d) => d.insights.filter((i) => i.kind === "extraction" || i.kind === "summary").map((i) => ({
		dossierId: d.id,
		trackingCode: d.trackingCode,
		insight: i
	}))).sort((a, b) => b.insight.createdAt > a.insight.createdAt ? 1 : -1).slice(0, 8);
	const assignmentQueue = pendingAssignmentDossiers(now).map(({ dossier, dueAt, overdue }) => ({
		id: dossier.id,
		trackingCode: dossier.trackingCode,
		title: dossier.title,
		applicantName: dossier.parties[0]?.fullName ?? "",
		process: dossier.process,
		submittedFrom: dossier.submittedFrom ?? "admin",
		createdAt: dossier.createdAt,
		assignmentDueAt: dueAt,
		overdue
	}));
	const workloads = operatorWorkloads(dossiers);
	return {
		totals: {
			dossiers: dossiers.length,
			...countsByProcess
		},
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
			autoDueCount: assignmentQueue.filter((item) => item.overdue).length
		}
	};
});
var getProcesses_createServerFn_handler = createServerRpc({
	id: "f51eedb684a8e9b5ba65ae42a8f98d6f6b37d708a898f7e92a7fb16b60140d53",
	name: "getProcesses",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => getProcesses.__executeServer(opts));
var getProcesses = createServerFn({ method: "GET" }).handler(getProcesses_createServerFn_handler, async () => {
	return { processes: Object.values(PROCESSES) };
});
var resetDemo_createServerFn_handler = createServerRpc({
	id: "62c433e4d6a224bd1a41a4f240f319e9dd5ef3ea635ff271e853a3723841c360",
	name: "resetDemo",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => resetDemo.__executeServer(opts));
var resetDemo = createServerFn({ method: "POST" }).handler(resetDemo_createServerFn_handler, async () => {
	resetDemoOperators();
	return resetStore();
});
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
var answerDossierQuestion_createServerFn_handler = createServerRpc({
	id: "29e038faedf80ac0bf2555e6ab221d45e2ea7940bc9fba766d3ce367e28e03e6",
	name: "answerDossierQuestion",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => answerDossierQuestion.__executeServer(opts));
var answerDossierQuestion = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	question: stringType().min(2).max(2e3)
}).parse(input)).handler(answerDossierQuestion_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) notFound();
	const process = PROCESSES[d.process];
	const facts = buildDossierSummaryFacts(d, process);
	const alerts = getCriticalAlerts(d, process);
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
						description: c.description
					})),
					requiredDocuments: s.requiredDocuments ?? []
				}))
			}))
		},
		dossier: facts,
		criticalAlerts: alerts.map((a) => ({
			label: a.label,
			severity: a.severity,
			description: a.description
		}))
	};
	try {
		const [{ generateText }, { getGateway, MODEL_ID }] = await Promise.all([import("../_libs/ai.mjs").then((n) => n.t), import("./ai-gateway.server-Doq022hY.mjs")]);
		const { text } = await generateText({
			model: getGateway()(MODEL_ID),
			system: "Je asistent për nëpunësin civil shqiptar. Përgjigju VETËM bazuar te konteksti i mëposhtëm (përkufizimi i procesit, baza ligjore, dhe faktet e dosjes). Nëse përgjigja nuk mbështetet nga konteksti, thuaj qartë 'Nuk kam të dhëna të mjaftueshme'. Ji konciz, përgjigju në shqip, dhe cito hapin/fazën përkatëse kur është e mundur.",
			prompt: `KONTEKSTI:\n${JSON.stringify(context, null, 2)}\n\nPYETJA: ${data.question}`
		});
		d.insights = [...d.insights, {
			id: `ai-q-${d.insights.length + 1}-${Date.now().toString(36)}`,
			kind: "summary",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			text: `Q: ${data.question}\nA: ${text}`
		}];
		audit(d, {
			actor: "ai_assistant",
			action: "Pyetje me asistent",
			details: data.question.slice(0, 200)
		});
		upsert(d);
		return { answer: text };
	} catch (err) {
		return {
			answer: "Asistenti nuk është i disponueshëm tani. Mund të shikoni faktet e dosjes në kontekst.",
			error: err instanceof Error ? err.message : "unknown"
		};
	}
});
var aiRiskBrief_createServerFn_handler = createServerRpc({
	id: "626a3bacfc2dc615929a8fe8699f97d715328a5df78601fbd93b8cc60802d7c0",
	name: "aiRiskBrief",
	filename: "src/lib/api/dossiers.functions.ts"
}, (opts) => aiRiskBrief.__executeServer(opts));
var aiRiskBrief = createServerFn({ method: "POST" }).handler(aiRiskBrief_createServerFn_handler, async () => {
	const dossiers = allDossiers().filter((d) => d.status !== "completed" && d.status !== "rejected");
	const now = /* @__PURE__ */ new Date();
	const buckets = /* @__PURE__ */ new Map();
	const dayMs = 1440 * 60 * 1e3;
	for (const d of dossiers) {
		const proc = PROCESSES[d.process];
		const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
		const alerts = getCriticalAlerts(d, proc, now);
		const enteredAt = [...d.audit].reverse().find((a) => a.phaseId === d.currentPhaseId && a.action.startsWith("Kalim"))?.at ?? d.createdAt;
		const daysInPhase = Math.max(0, Math.floor((now.getTime() - new Date(enteredAt).getTime()) / dayMs));
		for (const a of alerts) {
			if (a.severity === "info") continue;
			const key = `${d.process}:${d.currentPhaseId}:${a.label}`;
			const prev = buckets.get(key);
			if (prev) {
				prev.affectedCount += 1;
				prev.daysSum += daysInPhase;
				prev.avgDaysInPhase = Math.round(prev.daysSum / prev.affectedCount);
				if (prev.affectedCodes.length < 6) prev.affectedCodes.push(d.trackingCode);
			} else buckets.set(key, {
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
				daysSum: daysInPhase
			});
		}
	}
	const ranked = Array.from(buckets.values()).map((b) => ({
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
		score: b.affectedCount * (b.severity === "critical" ? 3 : 1) + Math.round(b.avgDaysInPhase / 7)
	})).sort((a, b) => b.score - a.score).slice(0, 8);
	const stats = {
		activeDossiers: dossiers.length,
		blocked: dossiers.filter((d) => d.status === "blocked").length,
		awaitingExternal: dossiers.filter((d) => d.status === "awaiting_external").length,
		overdue: dossiers.filter((d) => getDeadlineState(d, PROCESSES[d.process], now).state === "overdue").length
	};
	const { callOpenAi } = await import("./openai-TTrdtFQa.mjs").then((n) => n.n);
	const res = await callOpenAi({
		system: "Je analist operacional për nëpunësit civilë shqiptarë. Përmblidh 5 risqet kryesore operacionale nga të dhënat e paketuara. Përgjigju në shqip, në Markdown me listë të numëruar 1–5. Për secilin: titull i shkurtër, ndikimi (sa dosje, faza, ditë mesatare), dhe një veprim i rekomanduar. Mos shpik fakte: përdor vetëm fushat 'ranked' dhe 'stats'.",
		user: JSON.stringify({
			stats,
			ranked
		}, null, 2),
		temperature: .2
	});
	if (!res.ok) return {
		ok: false,
		error: res.error,
		ranked,
		stats
	};
	return {
		ok: true,
		brief: res.content,
		model: res.model,
		ranked,
		stats,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
//#endregion
export { addOperator_createServerFn_handler, advanceDossier_createServerFn_handler, aiRiskBrief_createServerFn_handler, answerDossierQuestion_createServerFn_handler, assignDossier_createServerFn_handler, calculateEkbValuation_createServerFn_handler, createBusinessPropertyApplication_createServerFn_handler, createDossier_createServerFn_handler, createExpropriationCompensationApplication_createServerFn_handler, getDashboard_createServerFn_handler, getDossier_createServerFn_handler, getProcesses_createServerFn_handler, listDossiers_createServerFn_handler, patchDossier_createServerFn_handler, removeOperator_createServerFn_handler, resetDemo_createServerFn_handler, reviewExpeditedProcedure_createServerFn_handler, runAutoAssignment_createServerFn_handler, updateRequesterVerification_createServerFn_handler, uploadDocument_createServerFn_handler };
