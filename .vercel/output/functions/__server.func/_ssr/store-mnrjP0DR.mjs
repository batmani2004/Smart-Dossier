//#region node_modules/.nitro/vite/services/ssr/assets/store-mnrjP0DR.js
var DEFAULT_DEMO_OPERATORS = [
	{
		id: "op-elira-kola",
		name: "Elira Kola",
		unit: "Kadaster - Tirane"
	},
	{
		id: "op-ardit-leka",
		name: "Ardit Leka",
		unit: "Kadaster - Durres"
	},
	{
		id: "op-mira-hoxha",
		name: "Mira Hoxha",
		unit: "Kadaster - Shkoder"
	}
];
var DEMO_OPERATORS = DEFAULT_DEMO_OPERATORS;
var g$1 = globalThis;
function cloneDefaults() {
	return DEFAULT_DEMO_OPERATORS.map((operator) => ({ ...operator }));
}
function listDemoOperators() {
	if (!g$1.__smartDossierOperators) g$1.__smartDossierOperators = cloneDefaults();
	return g$1.__smartDossierOperators;
}
function resetDemoOperators() {
	g$1.__smartDossierOperators = cloneDefaults();
	return g$1.__smartDossierOperators;
}
function slugifyOperatorId(name) {
	const slug = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "operator";
	const existing = new Set(listDemoOperators().map((operator) => operator.id));
	let id = `op-${slug}`;
	let counter = 2;
	while (existing.has(id)) {
		id = `op-${slug}-${counter}`;
		counter += 1;
	}
	return id;
}
function addDemoOperator(data) {
	const operator = {
		id: slugifyOperatorId(data.name),
		name: data.name.trim(),
		unit: data.unit.trim()
	};
	listDemoOperators().push(operator);
	return operator;
}
function removeDemoOperator(id) {
	const operators = listDemoOperators();
	const index = operators.findIndex((operator) => operator.id === id);
	if (index === -1) return null;
	const [removed] = operators.splice(index, 1);
	return removed;
}
function operatorName(id) {
	return listDemoOperators().find((operator) => operator.id === id)?.name ?? "Operator kadastre";
}
var DAY = 1440 * 60 * 1e3;
function iso(offsetDays, base = Date.now()) {
	return new Date(base + offsetDays * DAY).toISOString();
}
function code(kind, n) {
	return `${kind === "ekb_privatization" ? "EKB" : kind === "property_registration" ? "BIZ" : "EXP"}-2026-${String(n).padStart(6, "0")}`;
}
function requesterRequiredDocuments(process, claimType) {
	if (process === "property_registration") return [
		"business_nipt_extract",
		"legal_representative_id",
		"property_registration_request",
		"ownership_origin_document",
		"property_plan"
	];
	const base = ["id_card_copy", process === "expropriation" ? "ownership_extract" : "ashk_certificate"];
	return claimType === "legal_representative" ? [...base, "legal_authorization"] : base;
}
function seedHasDocument(docs, type) {
	if (type === "ashk_certificate") return docs.some((doc) => (doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	if (type === "ownership_extract") return docs.some((doc) => (doc.type === "ownership_extract" || doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	return docs.some((doc) => doc.type === type && doc.status !== "rejected");
}
function buildDossier(s) {
	const createdAt = iso(-30);
	const updatedAt = iso(-1);
	const assignedOperator = DEMO_OPERATORS[(s.n - 1) % DEMO_OPERATORS.length];
	const requesterClaimType = s.requesterClaimType ?? "owner";
	const requesterRequired = requesterRequiredDocuments(s.process, requesterClaimType);
	const requesterMissing = requesterRequired.filter((type) => !seedHasDocument(s.uploadedDocs, type));
	const requesterVerified = requesterMissing.length === 0;
	return {
		id: `d-${s.process === "ekb_privatization" ? "ekb" : s.process === "property_registration" ? "biz" : "exp"}-${String(s.n).padStart(3, "0")}`,
		trackingCode: code(s.process, s.n),
		process: s.process,
		title: s.title,
		status: s.status,
		currentPhaseId: s.currentPhaseId,
		currentStepId: s.currentStepId,
		parties: [{
			id: "p1",
			role: s.process === "expropriation" ? "expropriated_owner" : "applicant",
			fullName: s.applicant,
			fatherName: s.fatherName,
			nationalIdMasked: s.nid,
			businessNipt: s.nipt
		}],
		property: {
			description: s.propertyDescription,
			zone: s.zone,
			areaSqm: s.areaSqm,
			cadastralNo: s.cadastralNo,
			marketPriceAll: s.marketPriceAll,
			landPriceAll: s.landPriceAll,
			familyIncomeAll: s.familyIncomeAll
		},
		documents: s.uploadedDocs.map((d, i) => ({
			id: `doc-${i + 1}`,
			type: d.type,
			name: d.name,
			status: d.status ?? "uploaded",
			uploadedAt: iso(-10 + i),
			uploadedBy: "civil_servant_demo",
			requiredAtStepId: d.stepId,
			notes: d.notes
		})),
		missingDocumentTypes: Array.from(new Set([...s.missing, ...requesterMissing])),
		deadlines: s.deadlines.map((d) => ({
			id: d.id,
			kind: d.kind,
			label: d.label,
			dueAt: iso(d.dueInDays),
			phaseId: d.phaseId,
			stepId: d.stepId,
			resolvedAt: d.resolved ? iso(-2) : void 0
		})),
		audit: s.audit.map((a, i) => ({
			id: `a-${i + 1}`,
			at: iso(a.atDays),
			actor: a.actor,
			action: a.action,
			stepId: a.stepId,
			details: a.details
		})),
		insights: (s.insights ?? []).map((i, idx) => ({
			id: `ai-${idx + 1}`,
			kind: i.kind,
			createdAt: iso(i.atDays),
			text: i.text,
			confidence: .82
		})),
		requesterVerification: {
			claimType: requesterClaimType,
			cadastralSubjectName: s.cadastralSubjectName ?? s.applicant,
			status: requesterVerified ? "verified" : "needs_documents",
			requiredDocumentTypes: requesterRequired,
			verifiedAt: requesterVerified ? iso(-8) : void 0,
			verifiedBy: requesterVerified ? "civil_servant_demo" : void 0,
			notes: requesterVerified ? "Identiteti dhe lidhja me kartelen kadastrale jane verifikuar." : "Duhet plotesuar prova qe kerkuesi eshte pronari ne kadaster ose perfaqesues ligjor."
		},
		createdAt,
		updatedAt,
		assignedOperatorId: s.assignment === "unassigned" ? void 0 : assignedOperator?.id,
		assignedOperatorName: s.assignment === "unassigned" ? void 0 : assignedOperator?.name,
		assignedAt: s.assignment === "unassigned" ? void 0 : iso(-29),
		assignmentMode: s.assignment === "unassigned" ? void 0 : "manual",
		assignmentDueAt: s.assignment === "unassigned" ? new Date(Date.now() + 1200 * 1e3).toISOString() : void 0,
		submittedFrom: s.assignment === "unassigned" ? s.process === "property_registration" ? "business_portal" : "citizen_portal" : "admin",
		finalValueAll: s.finalValueAll,
		notes: s.notes
	};
}
var EKB_SEEDS = [
	{
		n: 1,
		process: "ekb_privatization",
		title: "Privatizim banese — Rr. Kavajës, Tiranë",
		status: "in_progress",
		currentPhaseId: "ekb-p1",
		currentStepId: "ekb-s1",
		applicant: "Arta Beqiri",
		fatherName: "Petrit",
		nid: "I85******A",
		zone: "Tiranë",
		propertyDescription: "Apartament 2+1, kati 3",
		areaSqm: 68,
		cadastralNo: "8/241-N12",
		marketPriceAll: 42e5,
		landPriceAll: 6e5,
		familyIncomeAll: 22e3,
		uploadedDocs: [],
		missing: ["ashk_certificate"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Certifikata ASHK",
			dueInDays: 14,
			phaseId: "ekb-p1"
		}],
		audit: [{
			atDays: -28,
			actor: "system",
			action: "Dosja u krijua"
		}],
		insights: [{
			kind: "missing_document",
			text: "Mungon certifikata ASHK e pasurisë.",
			atDays: -1
		}]
	},
	{
		n: 2,
		process: "ekb_privatization",
		title: "Privatizim banese — Lagjja 5, Durrës",
		status: "in_progress",
		currentPhaseId: "ekb-p3",
		currentStepId: "ekb-s3",
		applicant: "Edmond Hoxha",
		fatherName: "Skënder",
		nid: "J72******B",
		zone: "Durrës",
		propertyDescription: "Apartament 1+1",
		areaSqm: 52,
		cadastralNo: "12/115",
		marketPriceAll: 28e5,
		landPriceAll: 4e5,
		familyIncomeAll: 11500,
		uploadedDocs: [{
			type: "ashk_certificate",
			name: "Certifikatë ASHK.pdf",
			stepId: "ekb-s1"
		}, {
			type: "id_card_copy",
			name: "ID Edmond.pdf",
			stepId: "ekb-s3"
		}],
		missing: ["family_certificate", "income_proof"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Dosja fizike e plotë",
			dueInDays: 5,
			phaseId: "ekb-p3"
		}],
		audit: [{
			atDays: -20,
			actor: "civil_servant_demo",
			action: "Dorëzim dosjeje fizike pjesërisht"
		}]
	},
	{
		n: 3,
		process: "ekb_privatization",
		title: "Privatizim banese — Pogradec, qendër",
		status: "blocked",
		currentPhaseId: "ekb-p4",
		currentStepId: "ekb-s4",
		applicant: "Mirela Çela",
		nid: "G91******C",
		zone: "Pogradec",
		propertyDescription: "Apartament 2+1",
		areaSqm: 71,
		cadastralNo: "5/77",
		marketPriceAll: 31e5,
		landPriceAll: 5e5,
		familyIncomeAll: 9500,
		uploadedDocs: [
			{
				type: "ashk_certificate",
				name: "Certifikatë ASHK.pdf"
			},
			{
				type: "family_certificate",
				name: "Certifikatë familjare.pdf"
			},
			{
				type: "id_card_copy",
				name: "ID.pdf"
			},
			{
				type: "income_proof",
				name: "Vërtetim të ardhurash.pdf"
			}
		],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "external",
			label: "Përgjigje nga ASHK/IPRO",
			dueInDays: -4,
			phaseId: "ekb-p4"
		}],
		audit: [{
			atDays: -14,
			actor: "civil_servant_demo",
			action: "Kërkesë me email për ASHK"
		}, {
			atDays: -2,
			actor: "system",
			action: "Pa përgjigje — bllokuar"
		}],
		notes: "Pa përgjigje nga ASHK/IPRO mbi 2 javë."
	},
	{
		n: 4,
		process: "ekb_privatization",
		title: "Privatizim banese — Shkodër, qendër",
		status: "in_progress",
		currentPhaseId: "ekb-p5-invoice",
		currentStepId: "ekb-s5-invoice",
		applicant: "Gent Marku",
		nid: "F77******D",
		zone: "Shkodër",
		propertyDescription: "Apartament 3+1",
		areaSqm: 92,
		cadastralNo: "2/19",
		marketPriceAll: 54e5,
		landPriceAll: 8e5,
		familyIncomeAll: 18e3,
		uploadedDocs: [{
			type: "ashk_certificate",
			name: "Certifikatë ASHK.pdf"
		}, {
			type: "family_certificate",
			name: "Certifikatë familjare.pdf"
		}],
		missing: ["citizen_invoice"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Gjenerimi i faturës së qytetarit",
			dueInDays: 3,
			phaseId: "ekb-p5-invoice"
		}],
		audit: [{
			atDays: -3,
			actor: "civil_servant_demo",
			action: "Vlera e privatizimit u miratua"
		}, {
			atDays: -1,
			actor: "system",
			action: "Kalim në fazën e faturimit",
			stepId: "ekb-s5-invoice"
		}],
		insights: [{
			kind: "summary",
			text: "Familje me të ardhura mesatare; pritet pagesë 100% banesë + 100% trualli.",
			atDays: -1
		}]
	},
	{
		n: 5,
		process: "ekb_privatization",
		title: "Privatizim banese — Fier, lagjia 11 Janari",
		status: "in_progress",
		currentPhaseId: "ekb-p6",
		currentStepId: "ekb-s6",
		applicant: "Drita Kola",
		nid: "H62******E",
		zone: "Fier",
		propertyDescription: "Apartament 2+1",
		areaSqm: 64,
		cadastralNo: "9/300",
		marketPriceAll: 25e5,
		landPriceAll: 35e4,
		familyIncomeAll: 8200,
		finalValueAll: 0,
		uploadedDocs: [
			{
				type: "ashk_certificate",
				name: "Certifikatë ASHK.pdf"
			},
			{
				type: "family_certificate",
				name: "Certifikatë familjare.pdf"
			},
			{
				type: "income_proof",
				name: "Vërtetim të ardhurash.pdf"
			}
		],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "legal",
			label: "Lidhja e kontratës (afat 2 vjet)",
			dueInDays: 540,
			phaseId: "ekb-p6"
		}],
		audit: [{
			atDays: -2,
			actor: "civil_servant_demo",
			action: "Vlerësimi miratuar — pa pagesë"
		}],
		notes: "Të ardhura nën 9000 ALL — pa pagesë (0% banesa, 0% trualli)."
	},
	{
		n: 6,
		process: "ekb_privatization",
		title: "Privatizim banese — Korçë, qendër",
		status: "in_progress",
		currentPhaseId: "ekb-p7",
		currentStepId: "ekb-s7",
		applicant: "Aleksandër Naço",
		nid: "C45******F",
		zone: "Korçë",
		propertyDescription: "Apartament 2+1",
		areaSqm: 70,
		cadastralNo: "4/55",
		marketPriceAll: 36e5,
		landPriceAll: 5e5,
		familyIncomeAll: 16500,
		finalValueAll: 41e5,
		uploadedDocs: [{
			type: "ashk_certificate",
			name: "Certifikatë ASHK.pdf"
		}, {
			type: "signed_contract",
			name: "Kontratë e nënshkruar.pdf"
		}],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "external",
			label: "Pranim dosjeje nga ASHK",
			dueInDays: 21,
			phaseId: "ekb-p7"
		}],
		audit: [{
			atDays: -1,
			actor: "civil_servant_demo",
			action: "Dosja u dorëzua fizikisht në ASHK"
		}]
	},
	{
		n: 7,
		process: "ekb_privatization",
		title: "Privatizim banese — Elbasan, lagjia Kongresi",
		status: "awaiting_external",
		currentPhaseId: "ekb-p8",
		currentStepId: "ekb-s8",
		applicant: "Kreshnik Sula",
		nid: "B33******G",
		zone: "Elbasan",
		propertyDescription: "Apartament 1+1",
		areaSqm: 48,
		cadastralNo: "3/12",
		marketPriceAll: 21e5,
		landPriceAll: 3e5,
		familyIncomeAll: 15e3,
		finalValueAll: 24e5,
		uploadedDocs: [{
			type: "signed_contract",
			name: "Kontratë.pdf"
		}],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "external",
			label: "Certifikatë përfundimtare ASHK",
			dueInDays: 35,
			phaseId: "ekb-p8"
		}],
		audit: [{
			atDays: -10,
			actor: "system",
			action: "Në radhë ASHK"
		}]
	},
	{
		n: 8,
		process: "ekb_privatization",
		title: "Privatizim banese — Vlorë, lagjia Pavarësia",
		status: "completed",
		currentPhaseId: "ekb-p8",
		currentStepId: "ekb-s8",
		applicant: "Suela Dervishi",
		nid: "A21******H",
		zone: "Vlorë",
		propertyDescription: "Apartament 2+1",
		areaSqm: 66,
		cadastralNo: "7/204",
		marketPriceAll: 3e6,
		landPriceAll: 45e4,
		familyIncomeAll: 25e3,
		finalValueAll: 345e4,
		uploadedDocs: [{
			type: "ashk_certificate_final",
			name: "Certifikatë përfundimtare.pdf"
		}],
		missing: [],
		deadlines: [],
		audit: [{
			atDays: -1,
			actor: "system",
			action: "Procedura u mbyll"
		}]
	},
	{
		n: 14,
		process: "ekb_privatization",
		title: "Privatizim banese — Rr. Don Bosko, Tiranë (DEMO)",
		status: "blocked",
		currentPhaseId: "ekb-p3",
		currentStepId: "ekb-s3",
		applicant: "Arta Beqiri",
		fatherName: "Petrit",
		nid: "I85******G",
		zone: "Tiranë",
		propertyDescription: "Apartament 2+1, kati 3, Rr. Don Bosko",
		areaSqm: void 0,
		cadastralNo: void 0,
		marketPriceAll: void 0,
		landPriceAll: void 0,
		familyIncomeAll: void 0,
		uploadedDocs: [{
			type: "id_card_copy",
			name: "ID Arta.pdf",
			stepId: "ekb-s3"
		}, {
			type: "dossier_pdf",
			name: "Dosja e aplikimit - e vulosur.pdf",
			stepId: "ekb-s3",
			status: "verified",
			notes: "Vulosur elektronikisht nga Smart Dossier me vulen e institucionit (/stamps/ashk-demo-stamp.png)."
		}],
		missing: ["family_certificate", "ashk_certificate"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Plotësimi i dosjes fizike",
			dueInDays: 3,
			phaseId: "ekb-p3"
		}],
		audit: [
			{
				atDays: -10,
				actor: "system",
				action: "Dosja u krijua"
			},
			{
				atDays: -7,
				actor: "civil_servant_demo",
				action: "Dorëzim dosjeje fizike pjesërisht",
				details: "Mungojnë certifikata familjare dhe certifikata e pronës (ASHK)."
			},
			{
				atDays: -2,
				actor: "system",
				action: "Bllokuar — mungojnë dokumente"
			}
		],
		notes: "Dosja DEMO për prezantim. Aplikim fizik me dokumente që mungojnë; pritet ngarkim sample-documents/ekb-family-certificate.txt për ekstraktim AI."
	},
	{
		n: 15,
		process: "ekb_privatization",
		title: "Aplikim i ri qytetari - Kombinat, Tiranë",
		status: "draft",
		currentPhaseId: "ekb-p3",
		currentStepId: "ekb-s3",
		applicant: "Ilir Meta",
		fatherName: "Agim",
		nid: "J72******K",
		zone: "Tiranë",
		propertyDescription: "Apartament 1+1, Kombinat",
		uploadedDocs: [],
		missing: ["family_certificate", "ashk_certificate"],
		deadlines: [],
		audit: [{
			atDays: 0,
			actor: "citizen_portal",
			action: "Aplikim i ri nga qytetari",
			details: "Në pritje për caktim operatori."
		}],
		assignment: "unassigned",
		notes: "Aplikim hyrës demo: admini mund ta caktojë manualisht ose sistemi e cakton pas 30 minutash."
	}
];
var EXP_SEEDS = [
	{
		n: 1,
		process: "expropriation",
		title: "Shpronësim — Rruga Tiranë–Elbasan, sektori 7",
		status: "in_progress",
		currentPhaseId: "exp-p1",
		currentStepId: "exp-s1",
		applicant: "Arben Hoxha",
		fatherName: "Bashkim",
		nid: "I85******G",
		zone: "Mullet, Tiranë",
		propertyDescription: "Tokë bujqësore + ndërtesë 1-katëshe",
		areaSqm: 1240,
		cadastralNo: "3/124",
		uploadedDocs: [{
			type: "public_interest_justification",
			name: "Justifikim interesi publik.pdf"
		}],
		missing: ["vkm_decision"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Miratim VKM",
			dueInDays: 21,
			phaseId: "exp-p1"
		}],
		audit: [{
			atDays: -25,
			actor: "ministria",
			action: "Hartim propozimi"
		}]
	},
	{
		n: 2,
		process: "expropriation",
		title: "Shpronësim — Bypass Fier, sektori 3",
		status: "in_progress",
		currentPhaseId: "exp-p2",
		currentStepId: "exp-s2",
		applicant: "Linda Murati",
		nid: "K90******I",
		zone: "Fier",
		propertyDescription: "Tokë bujqësore",
		areaSqm: 2100,
		cadastralNo: "11/4",
		uploadedDocs: [{
			type: "vkm_decision",
			name: "VKM 2026-44.pdf"
		}],
		missing: ["ownership_extract", "civil_status_extract"],
		deadlines: [{
			id: "dl1",
			kind: "external",
			label: "Përgjigje ASHK + DPGJC",
			dueInDays: -2,
			phaseId: "exp-p2"
		}],
		audit: [{
			atDays: -18,
			actor: "ministria",
			action: "Kërkesë drejt ASHK"
		}, {
			atDays: -16,
			actor: "ministria",
			action: "Kërkesë drejt DPGJC"
		}],
		notes: "Mungon integrimi automatik ASHK–DPGJC."
	},
	{
		n: 3,
		process: "expropriation",
		title: "Shpronësim — Linja elektrike Pogradec–Maliq",
		status: "in_progress",
		currentPhaseId: "exp-p3",
		currentStepId: "exp-s3",
		applicant: "Petrit Cani",
		nid: "L11******J",
		zone: "Maliq",
		propertyDescription: "Sipërfaqe e vogël për shtyllë e.l.",
		areaSqm: 120,
		cadastralNo: "6/9",
		uploadedDocs: [{
			type: "vkm_decision",
			name: "VKM.pdf"
		}, {
			type: "ownership_extract",
			name: "Ekstrakt pronësie.pdf"
		}],
		missing: ["valuation_report"],
		deadlines: [{
			id: "dl1",
			kind: "sla",
			label: "Raport vlerësimi",
			dueInDays: 8,
			phaseId: "exp-p3"
		}],
		audit: [{
			atDays: -7,
			actor: "ashsh",
			action: "Vlerësim në proces"
		}]
	},
	{
		n: 4,
		process: "expropriation",
		title: "Shpronësim — Aksi Lezhë–Shëngjin",
		status: "in_progress",
		currentPhaseId: "exp-p4",
		currentStepId: "exp-s4b",
		applicant: "Vjollca Gjini",
		nid: "M22******K",
		zone: "Lezhë",
		propertyDescription: "Tokë bujqësore",
		areaSqm: 880,
		cadastralNo: "2/56",
		uploadedDocs: [{
			type: "notification_letter",
			name: "Njoftim.pdf"
		}, {
			type: "valuation_report",
			name: "Raport vlerësimi.pdf"
		}],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "legal",
			label: "Afat ankimi (30 ditë)",
			dueInDays: 12,
			phaseId: "exp-p4",
			stepId: "exp-s4b"
		}],
		audit: [{
			atDays: -18,
			actor: "ministria",
			action: "Njoftim me letër u dërgua"
		}]
	},
	{
		n: 5,
		process: "expropriation",
		title: "Shpronësim — Hekurudha Durrës–Rrogozhinë",
		status: "awaiting_external",
		currentPhaseId: "exp-p5",
		currentStepId: "exp-s5",
		applicant: "Bashkim Lleshi",
		nid: "N33******L",
		zone: "Rrogozhinë",
		propertyDescription: "Tokë + magazinë",
		areaSqm: 1450,
		cadastralNo: "8/77",
		finalValueAll: 95e5,
		uploadedDocs: [{
			type: "payment_order",
			name: "Urdhër pagese.pdf"
		}],
		missing: [],
		deadlines: [{
			id: "dl1",
			kind: "external",
			label: "Disbursim nga Ministria e Ekonomisë",
			dueInDays: 30,
			phaseId: "exp-p5"
		}],
		audit: [{
			atDays: -5,
			actor: "min_ekonomise",
			action: "Urdhri i pagesës u lëshua"
		}],
		notes: "Pa integrim ASHK–Ministri për konfirmim pagese."
	}
];
var BIZ_SEEDS = [{
	n: 1,
	process: "property_registration",
	title: "Regjistrim prone biznesi - AlbaTech sh.p.k.",
	status: "draft",
	currentPhaseId: "biz-p1",
	currentStepId: "biz-s1",
	applicant: "AlbaTech sh.p.k.",
	nipt: "L12345678A",
	zone: "Tirane",
	propertyDescription: "Njesi sherbimi dhe magazine logjistike",
	areaSqm: 320,
	cadastralNo: "7/188",
	uploadedDocs: [
		{
			type: "business_nipt_extract",
			name: "Ekstrakt-QKB-AlbaTech.pdf",
			status: "verified"
		},
		{
			type: "legal_representative_id",
			name: "ID-administrator.pdf"
		},
		{
			type: "property_registration_request",
			name: "Kerkese-regjistrimi.pdf"
		},
		{
			type: "ownership_origin_document",
			name: "Kontrate-shitblerje.pdf"
		}
	],
	missing: ["property_plan"],
	deadlines: [{
		id: "dl1",
		kind: "sla",
		label: "Shqyrtim fillestar i dokumentacionit",
		dueInDays: 2,
		phaseId: "biz-p1",
		stepId: "biz-s1"
	}],
	audit: [{
		atDays: -1,
		actor: "business_portal",
		action: "Aplikim i ri biznesi per regjistrim prone",
		details: "NIPT L12345678A · mungon plan rilevimi."
	}],
	assignment: "unassigned",
	notes: "Shembull demo: biznesi aplikon me NIPT dhe operatori shqyrton dokumentacionin."
}];
var SEED_CORE_DOSSIERS = [
	...EKB_SEEDS.map(buildDossier),
	...EXP_SEEDS.map(buildDossier),
	...BIZ_SEEDS.map(buildDossier)
];
var g = globalThis;
function fresh() {
	return {
		dossiers: new Map(SEED_CORE_DOSSIERS.map((d) => [d.id, structuredClone(d)])),
		aiRuns: /* @__PURE__ */ new Map()
	};
}
function syncSeedDossiers(state) {
	const existingTrackingCodes = new Set(Array.from(state.dossiers.values()).map((d) => d.trackingCode));
	for (const seed of SEED_CORE_DOSSIERS) {
		if (state.dossiers.has(seed.id) || existingTrackingCodes.has(seed.trackingCode)) continue;
		state.dossiers.set(seed.id, structuredClone(seed));
		existingTrackingCodes.add(seed.trackingCode);
	}
	return state;
}
function store() {
	if (!g.__smartDossierStore) g.__smartDossierStore = fresh();
	return syncSeedDossiers(g.__smartDossierStore);
}
function resetStore() {
	g.__smartDossierStore = fresh();
	return { dossiers: g.__smartDossierStore.dossiers.size };
}
function allDossiers() {
	return Array.from(store().dossiers.values());
}
function getById(id) {
	return store().dossiers.get(id);
}
function getByTrackingCode(code) {
	for (const d of store().dossiers.values()) if (d.trackingCode === code) return d;
}
function upsert(d) {
	d.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	store().dossiers.set(d.id, d);
	return d;
}
function nextId(prefix) {
	const ids = Array.from(store().dossiers.keys()).filter((k) => k.startsWith(prefix));
	return `${prefix}${String(ids.length + 1).padStart(3, "0")}`;
}
//#endregion
export { listDemoOperators as a, removeDemoOperator as c, upsert as d, getByTrackingCode as i, resetDemoOperators as l, allDossiers as n, nextId as o, getById as r, operatorName as s, addDemoOperator as t, resetStore as u };
