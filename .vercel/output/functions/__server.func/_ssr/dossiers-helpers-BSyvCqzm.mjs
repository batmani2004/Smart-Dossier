import { t as PROCESSES } from "./processes-CMdovryr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossiers-helpers-BSyvCqzm.js
/** Returns the next step to execute. If the current step is final returns it with isFinal=true. */
function getNextStep(dossier, process) {
	const phaseIdx = process.phases.findIndex((p) => p.id === dossier.currentPhaseId);
	if (phaseIdx === -1) return null;
	const phase = process.phases[phaseIdx];
	const stepIdx = phase.steps.findIndex((s) => s.id === dossier.currentStepId);
	if (stepIdx === -1) return null;
	if (stepIdx + 1 < phase.steps.length) return {
		phase,
		step: phase.steps[stepIdx + 1],
		isFinal: false
	};
	if (phaseIdx + 1 < process.phases.length) {
		const next = process.phases[phaseIdx + 1];
		return {
			phase: next,
			step: next.steps[0],
			isFinal: false
		};
	}
	return {
		phase,
		step: phase.steps[stepIdx],
		isFinal: true
	};
}
/** Returns the set of critical alerts that apply to the dossier *right now*. */
function getCriticalAlerts(dossier, process, now = /* @__PURE__ */ new Date()) {
	const alerts = [];
	const phase = process.phases.find((p) => p.id === dossier.currentPhaseId);
	const step = phase?.steps.find((s) => s.id === dossier.currentStepId);
	if (phase && step) for (const cp of step.criticalPoints ?? []) alerts.push({
		id: `cp:${cp.id}`,
		source: "process",
		severity: cp.severity,
		label: cp.label,
		description: cp.description,
		phaseId: phase.id,
		stepId: step.id,
		tags: cp.tags
	});
	if (step?.requiredDocuments) {
		for (const docType of step.requiredDocuments) if (!dossier.documents.some((d) => d.type === docType && (d.status === "uploaded" || d.status === "verified"))) alerts.push({
			id: `doc:${docType}`,
			source: "document",
			severity: "warning",
			label: `Dokument mungon: ${docType}`,
			description: `Hapi aktual kërkon dokumentin "${docType}".`,
			phaseId: phase?.id,
			stepId: step.id,
			tags: ["missing-document"]
		});
	}
	for (const d of dossier.deadlines) {
		if (d.resolvedAt) continue;
		if (new Date(d.dueAt).getTime() < now.getTime()) alerts.push({
			id: `dl:${d.id}`,
			source: "deadline",
			severity: d.kind === "legal" ? "critical" : "warning",
			label: `Afat i kaluar: ${d.label}`,
			description: `Afati ka kaluar më ${d.dueAt}.`,
			phaseId: d.phaseId,
			stepId: d.stepId,
			tags: ["overdue", d.kind]
		});
	}
	if (dossier.status === "blocked") alerts.push({
		id: "status:blocked",
		source: "integration",
		severity: "critical",
		label: "Dosja është bllokuar",
		description: dossier.notes ?? "Bllokuar — kërkohet ndërhyrje manuale.",
		tags: ["blocked"]
	});
	return alerts;
}
/** Aggregate deadline state for the dossier. "due_soon" = <= 7 days. */
function getDeadlineState(dossier, _process, now = /* @__PURE__ */ new Date(), dueSoonDays = 7) {
	const open = dossier.deadlines.filter((d) => !d.resolvedAt);
	if (open.length === 0) return {
		state: "none",
		overdueCount: 0,
		dueSoonCount: 0
	};
	const nearest = [...open].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];
	const ms = new Date(nearest.dueAt).getTime() - now.getTime();
	const days = Math.ceil(ms / (1440 * 60 * 1e3));
	const overdueCount = open.filter((d) => new Date(d.dueAt).getTime() < now.getTime()).length;
	const dueSoonCount = open.filter((d) => {
		const dms = new Date(d.dueAt).getTime() - now.getTime();
		const dd = Math.ceil(dms / (1440 * 60 * 1e3));
		return dd >= 0 && dd <= dueSoonDays;
	}).length;
	let state;
	if (days < 0) state = "overdue";
	else if (days <= dueSoonDays) state = "due_soon";
	else state = "ok";
	return {
		state,
		nearest,
		daysRemaining: days,
		overdueCount,
		dueSoonCount
	};
}
var OSM_EMBED_DELTA = .004;
function normalize(value) {
	return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function mapPlaceForZone(zone) {
	const q = normalize(zone);
	if (q.includes("durres") || q.includes("durr")) return {
		label: "Durres",
		lat: 41.3231,
		lon: 19.4414,
		zoom: 15
	};
	if (q.includes("vlore") || q.includes("vlor")) return {
		label: "Vlore",
		lat: 40.4661,
		lon: 19.4914,
		zoom: 15
	};
	if (q.includes("shkoder") || q.includes("shkod")) return {
		label: "Shkoder",
		lat: 42.0693,
		lon: 19.5033,
		zoom: 15
	};
	if (q.includes("elbasan")) return {
		label: "Elbasan",
		lat: 41.1125,
		lon: 20.0822,
		zoom: 15
	};
	if (q.includes("fier")) return {
		label: "Fier",
		lat: 40.7239,
		lon: 19.5561,
		zoom: 15
	};
	if (q.includes("maliq")) return {
		label: "Maliq",
		lat: 40.7083,
		lon: 20.7,
		zoom: 17
	};
	if (q.includes("korce") || q.includes("korc")) return {
		label: "Korce",
		lat: 40.6186,
		lon: 20.7808,
		zoom: 16
	};
	return {
		label: "Tirane",
		lat: 41.3275,
		lon: 19.8187,
		zoom: 15
	};
}
function stableHash(value) {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 1e6;
	return hash;
}
function propertyParcelPolygon(place, hash) {
	const latSize = 3e-4 + hash % 5 * 35e-6;
	const lonSize = 42e-5 + Math.floor(hash / 7) % 5 * 45e-6;
	return [
		{
			lat: Number((place.lat - latSize * .56).toFixed(6)),
			lon: Number((place.lon - lonSize * .68).toFixed(6))
		},
		{
			lat: Number((place.lat - latSize * .36).toFixed(6)),
			lon: Number((place.lon + lonSize * .58).toFixed(6))
		},
		{
			lat: Number((place.lat + latSize * .42).toFixed(6)),
			lon: Number((place.lon + lonSize * .72).toFixed(6))
		},
		{
			lat: Number((place.lat + latSize * .64).toFixed(6)),
			lon: Number((place.lon - lonSize * .32).toFixed(6))
		}
	];
}
function knownParcelForDossier(dossier) {
	const zone = normalize(dossier.property.zone);
	const cadastralNo = dossier.property.cadastralNo?.trim();
	if (dossier.trackingCode === "EXP-2026-000003" || (zone.includes("maliq") || zone.includes("maliqi")) && cadastralNo === "6/9") return {
		label: "Parcela demo 6/9 - Maliq",
		lat: 40.70402,
		lon: 20.69816,
		zoom: 18,
		parcelPolygon: [
			{
				lat: 40.703818,
				lon: 20.697905
			},
			{
				lat: 40.70391,
				lon: 20.698438
			},
			{
				lat: 40.70419,
				lon: 20.698366
			},
			{
				lat: 40.704128,
				lon: 20.697872
			}
		]
	};
	return null;
}
function propertyMapLocation(dossier) {
	const base = mapPlaceForZone(dossier.property.zone);
	const knownParcel = knownParcelForDossier(dossier);
	if (knownParcel) return {
		...base,
		label: `Vendndodhja e parceles - ${base.label}`,
		lat: knownParcel.lat,
		lon: knownParcel.lon,
		zoom: Math.max(base.zoom, knownParcel.zoom),
		parcelPolygon: knownParcel.parcelPolygon,
		accuracyLabel: "Poligon demo i korrigjuar ne terren per kete dosje; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG."
	};
	const hash = stableHash(`${dossier.trackingCode}:${dossier.property.zone}:${dossier.property.description}:${dossier.property.cadastralNo ?? ""}`);
	const latOffset = (hash % 201 - 100) / 100 * .0042;
	const lonOffset = (Math.floor(hash / 201) % 201 - 100) / 100 * .0062;
	const lat = Number((base.lat + latOffset).toFixed(6));
	const lon = Number((base.lon + lonOffset).toFixed(6));
	return {
		...base,
		label: `Vendndodhja orientuese e prones - ${base.label}`,
		lat,
		lon,
		zoom: Math.max(base.zoom, 17),
		parcelPolygon: propertyParcelPolygon({
			lat,
			lon
		}, hash),
		accuracyLabel: "Poligon demo i parceles; ne zbatim real merret nga koordinatat/poligoni kadastral ASHK/ASIG."
	};
}
function osmViewUrl(place) {
	return `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=${place.zoom}/${place.lat}/${place.lon}`;
}
function osmEmbedUrl(place) {
	return `https://www.openstreetmap.org/export/embed.html?bbox=${[
		(place.lon - OSM_EMBED_DELTA).toFixed(5),
		(place.lat - OSM_EMBED_DELTA).toFixed(5),
		(place.lon + OSM_EMBED_DELTA).toFixed(5),
		(place.lat + OSM_EMBED_DELTA).toFixed(5)
	].join(",")}&layer=mapnik&marker=${place.lat},${place.lon}`;
}
function processAiUse(process) {
	return {
		ekb_privatization: "AI e perdor kontrollin GIS per te krahasuar zonen, pasurine dhe dokumentet qe mungojne para vendimit.",
		expropriation: "AI e perdor kontrollin GIS per te sinjalizuar zonimin, kategorine e tokes dhe rrezikun ne vleresim kompensimi.",
		property_registration: "AI e perdor kontrollin GIS per te sinjalizuar mbivendosje, verifikim kadastral dhe dokumente qe duhen kontrolluar."
	}[process];
}
function buildAiGisAssessment(dossier) {
	const description = normalize(dossier.property.description);
	const zone = normalize(dossier.property.zone);
	const hasCadastralNo = Boolean(dossier.property.cadastralNo?.trim());
	const hasArea = Boolean(dossier.property.areaSqm && dossier.property.areaSqm > 0);
	const isAgricultural = description.includes("bujq") || description.includes("agric") || description.includes("toke") || description.includes("tok");
	const isBuilding = description.includes("ndertes") || description.includes("objekt") || description.includes("apartament");
	const isPeriurban = zone.includes("tiran") || zone.includes("durres") || zone.includes("durr");
	const zoning = isPeriurban ? "Zone periurbane / verifikim me harte" : isAgricultural ? "Zone rurale" : "Zone urbane";
	const landCategory = isAgricultural ? "Toke bujqesore" : isBuilding ? "Truall + ndertese" : "Pasuri e paluajtshme";
	let aiRiskLevel = "low";
	let aiSignal = "Sinjal normal: zona dhe pasuria mund te verifikohen nga harta orientuese.";
	if (!hasCadastralNo) {
		aiRiskLevel = "high";
		aiSignal = "Rrezik i larte: mungon numri kadastral per lidhjen me poligonin.";
	} else if (dossier.status === "awaiting_external" || isPeriurban) {
		aiRiskLevel = "medium";
		aiSignal = "Rrezik mesatar: kerkohet verifikim i zones dhe koordinatave me ASHK/ASIG.";
	} else if (!hasArea) {
		aiRiskLevel = "medium";
		aiSignal = "Rrezik mesatar: siperfaqja nuk eshte e plotesuar per krahasim me harten.";
	} else if (dossier.process === "expropriation" && isAgricultural) {
		aiRiskLevel = "medium";
		aiSignal = "Rrezik mesatar: toka bujqesore ndikon ne vleresimin e kompensimit.";
	}
	const place = propertyMapLocation(dossier);
	return {
		provider: "OpenStreetMap",
		sourceLabel: "AKPT / e-Harta GIS demo",
		zoning,
		landCategory,
		aiRiskLevel,
		aiSignal,
		aiUse: processAiUse(dossier.process),
		place,
		realMapUrl: osmViewUrl(place),
		embedUrl: osmEmbedUrl(place)
	};
}
/** Compact, AI-friendly fact bag derived from a dossier + its process. */
function buildDossierSummaryFacts(dossier, process, now = /* @__PURE__ */ new Date()) {
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
		nextStep: next && !next.isFinal ? next.step.title : void 0,
		isFinal: !!next?.isFinal,
		partiesCount: dossier.parties.length,
		applicantName: applicant?.fullName,
		documentsUploaded: dossier.documents.filter((d) => d.status === "uploaded" || d.status === "verified").length,
		documentsMissing: dossier.missingDocumentTypes,
		criticalAlerts: alerts.map((a) => ({
			label: a.label,
			severity: a.severity
		})),
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
			accuracyLabel: gis.place.accuracyLabel
		}
	};
}
function audit(d, ev) {
	const entry = {
		id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		...ev
	};
	d.audit = [...d.audit, entry];
	return d;
}
function notFound() {
	throw new Error("Dossier not found");
}
function inferPriority(d) {
	if (d.expeditedProcedure?.status === "approved") return "high";
	const ds = getDeadlineState(d, PROCESSES[d.process]);
	if (ds.state === "overdue") return "high";
	const crit = getCriticalAlerts(d, PROCESSES[d.process]).filter((a) => a.severity === "critical");
	if (crit.length >= 2) return "high";
	if (ds.state === "due_soon" || crit.length === 1) return "normal";
	return "low";
}
//#endregion
export { getDeadlineState as a, notFound as c, getCriticalAlerts as i, buildAiGisAssessment as n, getNextStep as o, buildDossierSummaryFacts as r, inferPriority as s, audit as t };
