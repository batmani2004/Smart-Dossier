import { Y as arrayType, Z as enumType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { d as upsert, r as getById } from "./store-mnrjP0DR.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as calculateEkbPrivatizationValue, t as calculateEkbDetailedValuation } from "./value-C0fg0E9w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents.functions-na0w-1AS.js
var TEMPLATE_LABELS = {
	ekb_missing_docs_notice: "EKB — Njoftim për dokumente që mungojnë",
	ekb_refusal_decision: "EKB — Vendim refuzimi me arsye",
	ekb_value_calculation: "EKB - Akt Vleresimi",
	ekb_citizen_invoice: "EKB - Fature qytetari / mandat pagese",
	ekb_contract_draft: "EKB — Draft kontrate privatizimi",
	exp_owner_notification: "Shpronësim — Njoftim pronari (afat 30 ditë)",
	exp_compensation_proposal: "Shpronësim — Propozim kompensimi / akt rivlerësimi"
};
var TEMPLATES_FOR_PROCESS = {
	ekb_privatization: [
		"ekb_missing_docs_notice",
		"ekb_refusal_decision",
		"ekb_value_calculation",
		"ekb_citizen_invoice",
		"ekb_contract_draft"
	],
	expropriation: ["exp_owner_notification", "exp_compensation_proposal"],
	property_registration: []
};
function fmtDate$1(iso) {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}
function fmtAll(n) {
	if (n === void 0 || n === null || !Number.isFinite(n)) return "—";
	return `${new Intl.NumberFormat("sq-AL").format(Math.round(n))} ALL`;
}
function nextDocNumber(d, suffix) {
	const idx = d.documents.length + 1;
	return `${d.trackingCode}/${suffix}-${String(idx).padStart(2, "0")}`;
}
function addDays(iso, days) {
	const dt = new Date(iso);
	dt.setDate(dt.getDate() + days);
	return dt.toISOString();
}
function propertyLines(d) {
	const p = d.property ?? {};
	const lines = [];
	if (p.description) lines.push(`Përshkrimi: ${p.description}`);
	if (p.zone) lines.push(`Zona/Bashkia: ${p.zone}`);
	if (p.areaSqm) lines.push(`Sipërfaqja: ${p.areaSqm} m²`);
	if (p.cadastralNo) lines.push(`Nr. kadastrale: ${p.cadastralNo}`);
	if (lines.length === 0) lines.push("Përshkrim pasurie: i papërcaktuar.");
	return lines;
}
function institutionForPhase(d, process) {
	return process.phases.find((p) => p.id === d.currentPhaseId)?.institutions[0] ?? process.title;
}
function legalBasis(process) {
	return process.legalBasis.map((l) => l.title ? `${l.reference} — ${l.title}` : l.reference);
}
function addressee(d) {
	return {
		name: d.parties[0]?.fullName ?? "Aplikantit",
		address: void 0
	};
}
function commonHeader(d, process, template, title, suffix) {
	const a = addressee(d);
	return {
		template,
		title,
		number: nextDocNumber(d, suffix),
		date: (/* @__PURE__ */ new Date()).toISOString(),
		institution: institutionForPhase(d, process),
		addressee: a.name,
		addresseeAddress: a.address,
		propertyLines: propertyLines(d),
		legalBasis: legalBasis(process)
	};
}
var STANDARD_FOOTER = "Ky dokument është gjeneruar automatikisht nga Smart Dossier mbi bazën e të dhënave të dosjes. Faktet ligjore dhe procedurale janë deterministe.";
function tplEkbMissingDocs(d, process) {
	const phase = process.phases.find((p) => p.id === d.currentPhaseId);
	const missing = d.missingDocumentTypes.length > 0 ? d.missingDocumentTypes : phase?.steps.find((s) => s.id === d.currentStepId)?.requiredDocuments ?? [];
	const sections = [
		{
			heading: "Lënda",
			paragraphs: [`Plotësim i dokumentacionit për dosjen e privatizimit me kod ${d.trackingCode}.`]
		},
		{ paragraphs: [`I/E nderuar ${addressee(d).name},`, `Pas shqyrtimit fillestar të dosjes Suaj në fazën "${phase?.title}", konstatojmë se dokumentet e mëposhtme mungojnë ose janë të paplota. Ju lutemi t'i dorëzoni brenda 15 (pesëmbëdhjetë) ditëve kalendarike nga marrja e këtij njoftimi, në zyrat e ${institutionForPhase(d, process)}.`] },
		{
			heading: "Dokumentet që mungojnë",
			paragraphs: missing.length > 0 ? missing.map((m, i) => `${i + 1}. ${m}`) : ["Nuk ka dokumente të identifikuara si mungues në këtë moment."]
		},
		{ paragraphs: ["Mosdorëzimi i dokumentacionit brenda afatit mund të sjellë pezullimin ose refuzimin e shqyrtimit të mëtejshëm të dosjes, sipas akteve ligjore në fuqi."] }
	];
	return {
		...commonHeader(d, process, "ekb_missing_docs_notice", "Njoftim për plotësim dokumentacioni", "N"),
		sections,
		deadlineLine: `Afati i dorëzimit: 15 ditë kalendarike (deri më ${fmtDate$1(addDays((/* @__PURE__ */ new Date()).toISOString(), 15))}).`,
		signatures: [{
			role: "Përgjegjës i shqyrtimit",
			institution: institutionForPhase(d, process)
		}],
		footer: STANDARD_FOOTER
	};
}
function tplEkbRefusal(d, process) {
	const reasons = [];
	if (d.notes) reasons.push(d.notes);
	if (d.missingDocumentTypes.length > 0) reasons.push(`Mungesa të dokumentacionit të detyrueshëm: ${d.missingDocumentTypes.join(", ")}.`);
	if (reasons.length === 0) reasons.push("Dokumentacioni i paraqitur nuk plotëson kushtet e parashikuara nga VKM 179/2020 dhe aktet plotësuese.");
	const sections = [
		{
			heading: "Vendos",
			paragraphs: [`Refuzimin e aplikimit për privatizimin e banesës EKB të identifikuar me kodin ${d.trackingCode}, paraqitur nga ${addressee(d).name}.`]
		},
		{
			heading: "Arsyetimi",
			paragraphs: reasons
		},
		{
			heading: "Mjetet e ankimit",
			paragraphs: ["Pala e interesuar ka të drejtë të ankimojë këtë vendim brenda 30 (tridhjetë) ditëve nga marrja e tij, pranë organit kompetent, sipas akteve ligjore në fuqi."]
		}
	];
	return {
		...commonHeader(d, process, "ekb_refusal_decision", "Vendim refuzimi", "V"),
		sections,
		deadlineLine: `Afati i ankimit: 30 ditë (deri më ${fmtDate$1(addDays((/* @__PURE__ */ new Date()).toISOString(), 30))}).`,
		signatures: [{
			role: "Drejtor",
			institution: institutionForPhase(d, process)
		}],
		footer: STANDARD_FOOTER
	};
}
function tplEkbValueCalc(d, process) {
	const p = d.property ?? {};
	const income = p.familyIncomeAll ?? 0;
	const market = p.marketPriceAll ?? 0;
	const land = p.landPriceAll ?? 0;
	const calc = (() => {
		try {
			return calculateEkbDetailedValuation({
				familyIncomeAll: income,
				marketPriceAll: market,
				landPriceAll: land,
				areaSqm: p.areaSqm
			});
		} catch {
			return null;
		}
	})();
	const sections = [
		{
			heading: "Të dhënat hyrëse",
			paragraphs: [
				`Të ardhura mujore familjare: ${fmtAll(income)}`,
				`Sipërfaqja e pasurisë: ${p.areaSqm ? `${p.areaSqm} m²` : "e papërcaktuar"}`,
				`Çmimi i tregut i banesës: ${fmtAll(market)}`,
				`Çmimi i truallit: ${fmtAll(land)}`
			]
		},
		{
			heading: "Baza ligjore dhe formula",
			paragraphs: [
				calc?.ruleApplied ?? "Të dhënat hyrëse janë të pamjaftueshme për të aplikuar rregullin.",
				"Formula e aktit: Vp = Vb + Vt - Vsh - Vg.",
				"Referenca: VKM 179/2020 per proceduren e privatizimit dhe VKM 898/2020 per vleresimin sipas normave te strehimit."
			]
		},
		...calc ? [{
			heading: "Hapat e llogaritjes",
			paragraphs: calc.steps.map((step, index) => `${index + 1}. ${step.title}: ${step.formula}. ${step.explanation} (${step.legalReference})`)
		}] : []
	];
	return {
		...commonHeader(d, process, "ekb_value_calculation", "Akt Vleresimi i vleres se privatizimit", "LL"),
		sections,
		table: calc ? {
			heading: "Tabela e llogaritjes",
			columns: [
				"Zëri",
				"Bazë (ALL)",
				"Përqindje",
				"Pagueshme (ALL)"
			],
			rows: [
				[
					"Banesa",
					new Intl.NumberFormat("sq-AL").format(market),
					`${calc.housingPercent}%`,
					new Intl.NumberFormat("sq-AL").format(calc.housingPayableAll)
				],
				[
					"Trualli",
					new Intl.NumberFormat("sq-AL").format(land),
					`${calc.landPercent}%`,
					new Intl.NumberFormat("sq-AL").format(calc.landPayableAll)
				],
				[
					"Zbritje / pagesa te meparshme",
					"",
					"",
					`-${new Intl.NumberFormat("sq-AL").format(calc.previousPaymentsAll + calc.approvedDeductionsAll)}`
				],
				[
					"TOTAL",
					"",
					"",
					new Intl.NumberFormat("sq-AL").format(calc.finalValueAll)
				]
			]
		} : void 0,
		signatures: [{
			role: "Specialist vlerësimi",
			institution: institutionForPhase(d, process)
		}, {
			role: "Përgjegjës sektori",
			institution: institutionForPhase(d, process)
		}],
		footer: "Akt Vleresimi i gjeneruar nga Smart Dossier. Llogaritja eshte deterministe dhe auditohet me kohe, operator dhe rezultat."
	};
}
function tplEkbCitizenInvoice(d, process) {
	const p = d.property ?? {};
	const income = p.familyIncomeAll ?? 0;
	const market = p.marketPriceAll ?? 0;
	const land = p.landPriceAll ?? 0;
	const total = d.finalValueAll ?? (() => {
		try {
			return calculateEkbPrivatizationValue({
				familyIncomeAll: income,
				marketPriceAll: market,
				landPriceAll: land
			}).totalPayableAll;
		} catch {
			return 0;
		}
	})();
	const due = addDays((/* @__PURE__ */ new Date()).toISOString(), 30);
	const reference = `${d.trackingCode}-FAT-${String(d.documents.length + 1).padStart(2, "0")}`;
	const sections = [
		{
			heading: "Lënda",
			paragraphs: [`Gjenerim fature / mandat pagese për dosjen e privatizimit ${d.trackingCode}.`]
		},
		{
			heading: "Detyrimi për pagesë",
			paragraphs: [`I/E nderuar ${addressee(d).name}, në bazë të llogaritjes së vlerës së privatizimit, shuma për t'u paguar është ${fmtAll(total)}.`, "Kjo faturë shërben si dokument pune për pagesën para lidhjes së kontratës së privatizimit."]
		},
		{
			heading: "Afati dhe referenca",
			paragraphs: [`Afati i pagesës: 30 ditë kalendarike, deri më ${fmtDate$1(due)}.`, `Numri i referencës: ${reference}.`]
		}
	];
	return {
		...commonHeader(d, process, "ekb_citizen_invoice", "Faturë qytetari / mandat pagese", "FAT"),
		sections,
		table: {
			heading: "Përmbledhje pagese",
			columns: ["Zëri", "Vlera"],
			rows: [
				["Kodi i dosjes", d.trackingCode],
				["Aplikanti", addressee(d).name],
				["Pasuria", p.description ?? "—"],
				["Zona", p.zone ?? "—"],
				["Shuma për pagesë", fmtAll(total)],
				["Afati i pagesës", fmtDate$1(due)],
				["Referenca", reference]
			]
		},
		deadlineLine: `Afati i pagesës: 30 ditë kalendarike (deri më ${fmtDate$1(due)}).`,
		signatures: [{
			role: "Specialist finance",
			institution: "Financa EKB"
		}, {
			role: "Përgjegjës dosjeje",
			institution: institutionForPhase(d, process)
		}],
		footer: "Fatura është gjeneruar automatikisht nga Smart Dossier pas llogaritjes së vlerës. Gjenerimi regjistrohet në historikun e audituar të dosjes."
	};
}
function tplEkbContract(d, process) {
	const p = d.property ?? {};
	const total = d.finalValueAll ?? (() => {
		try {
			return calculateEkbPrivatizationValue({
				familyIncomeAll: p.familyIncomeAll ?? 0,
				marketPriceAll: p.marketPriceAll ?? 0,
				landPriceAll: p.landPriceAll ?? 0
			}).totalPayableAll;
		} catch {
			return;
		}
	})();
	const sections = [
		{
			heading: "Palët kontraktuese",
			paragraphs: [`1. ${institutionForPhase(d, process)} (më poshtë "Shitësi"), përfaqësuar nga Drejtori.`, `2. ${addressee(d).name}, me banim sipas dokumentit të identifikimit (më poshtë "Blerësi").`]
		},
		{
			heading: "Objekti i kontratës",
			paragraphs: [`Shitësi i kalon Blerësit në pronësi pasurinë e mëposhtme: ${p.description ?? "banesa EKB sipas dosjes"}${p.areaSqm ? `, me sipërfaqe ${p.areaSqm} m²` : ""}${p.cadastralNo ? `, nr. kadastrale ${p.cadastralNo}` : ""}.`]
		},
		{
			heading: "Çmimi dhe mënyra e pagesës",
			paragraphs: [`Çmimi total i privatizimit është ${fmtAll(total)}, i llogaritur sipas VKM 179/2020 dhe VKM 898/2020.`, "Pagesa kryhet sipas grafikut të dakordësuar mes palëve, me dëshmi bankare të arkëtimit."]
		},
		{
			heading: "Detyrimet e palëve",
			paragraphs: ["Shitësi garanton se pasuria është e regjistruar dhe e lirë nga barrë të paregjistruara.", "Blerësi merr përsipër regjistrimin përfundimtar të pronës pranë ASHK pas firmosjes."]
		},
		{
			heading: "Dispozita të fundit",
			paragraphs: ["Kontrata lidhet brenda afatit ligjor 2-vjeçar nga njoftimi i fituesit. Mosmarrëveshjet zgjidhen sipas legjislacionit shqiptar."]
		}
	];
	return {
		...commonHeader(d, process, "ekb_contract_draft", "DRAFT KONTRATË PRIVATIZIMI EKB", "K"),
		sections,
		signatures: [{
			role: "Për Shitësin",
			institution: institutionForPhase(d, process)
		}, {
			role: "Blerësi",
			institution: addressee(d).name
		}],
		footer: "Ky është një DRAFT i gjeneruar automatikisht. Kërkohet rishikim ligjor para firmosjes."
	};
}
function tplExpOwnerNotification(d, process) {
	const p = d.property ?? {};
	const sections = [
		{
			heading: "Lënda",
			paragraphs: [`Njoftim mbi nismën e shpronësimit për interes publik të pasurisë me dosje ${d.trackingCode}.`]
		},
		{ paragraphs: [`I/E nderuar ${addressee(d).name},`, `Ju njoftojmë se, sipas Ligjit 8561/1999 "Për shpronësimet për interes publik" dhe akteve nënligjore përkatëse, ka nisur procedura e shpronësimit për pasurinë në pronësinë Tuaj të përshkruar më poshtë.`] },
		{
			heading: "Pasuria objekt shpronësimi",
			paragraphs: propertyLines(d)
		},
		{
			heading: "Vlera e propozuar e kompensimit",
			paragraphs: [`Vlera e propozuar e kompensimit: ${fmtAll(p.marketPriceAll)}.`, "Vlera është përcaktuar nga Agjencia Shtetërore për Shpronësimet / komisioni i rivlerësimit, sipas metodologjisë ligjore."]
		},
		{
			heading: "E drejta e ankimit",
			paragraphs: ["Ju keni të drejtë të paraqisni ankim ndaj këtij njoftimi brenda 30 (tridhjetë) ditëve kalendarike nga data e marrjes së tij, pranë organit kompetent dhe/ose Gjykatës Administrative."]
		}
	];
	return {
		...commonHeader(d, process, "exp_owner_notification", "Njoftim pronari për shpronësim", "NJ"),
		sections,
		deadlineLine: `Afati i ankimit: 30 ditë kalendarike nga marrja e njoftimit (deri më ${fmtDate$1(addDays((/* @__PURE__ */ new Date()).toISOString(), 30))}).`,
		signatures: [{
			role: "Titullar i organit shpronësues",
			institution: institutionForPhase(d, process)
		}],
		footer: STANDARD_FOOTER
	};
}
function tplExpCompensationProposal(d, process) {
	const p = d.property ?? {};
	const sections = [
		{
			heading: "Objekti",
			paragraphs: [`Përmbledhje e propozimit të kompensimit / aktit të rivlerësimit për dosjen ${d.trackingCode}.`]
		},
		{
			heading: "Pasuria",
			paragraphs: propertyLines(d)
		},
		{
			heading: "Pronari",
			paragraphs: [`${addressee(d).name}.`]
		},
		{
			heading: "Metodologjia e vlerësimit",
			paragraphs: ["Vlerësimi është kryer mbi bazën e të dhënave të ASHK, zonës kadastrale dhe çmimeve referuese të tregut, sipas akteve nënligjore në fuqi.", "Jane konsultuar e-Harta / AKPT (vetem lexim) dhe sinjali AI GIS per konfirmimin e te dhenave hapesinore."]
		}
	];
	return {
		...commonHeader(d, process, "exp_compensation_proposal", "Propozim kompensimi / Akt rivlerësimi (përmbledhje)", "PK"),
		sections,
		table: {
			heading: "Përmbledhje financiare",
			columns: ["Zëri", "Vlera (ALL)"],
			rows: [
				["Vlera e pasurisë (treg)", new Intl.NumberFormat("sq-AL").format(p.marketPriceAll ?? 0)],
				["Vlera e truallit", new Intl.NumberFormat("sq-AL").format(p.landPriceAll ?? 0)],
				["TOTAL i propozuar", new Intl.NumberFormat("sq-AL").format((p.marketPriceAll ?? 0) + (p.landPriceAll ?? 0))]
			]
		},
		signatures: [{
			role: "Vlerësues",
			institution: institutionForPhase(d, process)
		}, {
			role: "Kryetar i komisionit",
			institution: institutionForPhase(d, process)
		}],
		footer: STANDARD_FOOTER
	};
}
var REGISTRY = {
	ekb_missing_docs_notice: tplEkbMissingDocs,
	ekb_refusal_decision: tplEkbRefusal,
	ekb_value_calculation: tplEkbValueCalc,
	ekb_citizen_invoice: tplEkbCitizenInvoice,
	ekb_contract_draft: tplEkbContract,
	exp_owner_notification: tplExpOwnerNotification,
	exp_compensation_proposal: tplExpCompensationProposal
};
function buildDocument(template, d, process) {
	return REGISTRY[template](d, process);
}
function escape(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fmtDate(iso) {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}
/**
* Returns a full, self-contained HTML document — safe to render in an iframe
* (using srcDoc) for preview, and printable via the browser print dialog
* which produces a clean A4 PDF without external dependencies.
*/
function renderDocHtml(doc) {
	const stampHtml = `
    <section class="stamp-block" aria-label="Vula digjitale e institucionit">
      <img src="/stamps/ashk-demo-stamp.png" alt="Vule demo ASHK" />
      <div class="stamp-caption">Vule demo nga sistemi Smart Dossier</div>
    </section>`;
	const sectionsHtml = doc.sections.map((s) => `
      <section class="block">
        ${s.heading ? `<h2>${escape(s.heading)}</h2>` : ""}
        ${s.paragraphs.map((p) => `<p>${escape(p).replace(/\n/g, "<br/>")}</p>`).join("")}
      </section>`).join("");
	const tableHtml = doc.table ? `<section class="block">
        ${doc.table.heading ? `<h2>${escape(doc.table.heading)}</h2>` : ""}
        <table class="data">
          <thead><tr>${doc.table.columns.map((c) => `<th>${escape(c)}</th>`).join("")}</tr></thead>
          <tbody>
            ${doc.table.rows.map((r) => `<tr>${r.map((c) => `<td>${escape(String(c))}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </section>` : "";
	const sigHtml = `
    <section class="signatures">
      ${doc.signatures.map((sig) => `
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-role">${escape(sig.role)}</div>
          <div class="sig-inst">${escape(sig.institution)}</div>
          ${sig.name ? `<div class="sig-name">${escape(sig.name)}</div>` : ""}
        </div>`).join("")}
    </section>`;
	return `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8" />
<title>${escape(doc.title)} — ${escape(doc.number)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { background: #f4f4f5; margin: 0; padding: 0; }
  body { font-family: "Times New Roman", Georgia, serif; color: #111; }
  .page {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 22mm 20mm;
    margin: 16px auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid #111;
    padding-bottom: 8mm;
    margin-bottom: 8mm;
  }
  .header .left { font-size: 11pt; line-height: 1.4; }
  .header .left .institution { font-weight: 700; text-transform: uppercase; }
  .header .right { font-size: 10pt; text-align: right; line-height: 1.5; }
  h1 {
    font-size: 14pt;
    text-align: center;
    text-transform: uppercase;
    margin: 6mm 0 2mm;
    letter-spacing: 0.04em;
  }
  .docnum { text-align: center; font-size: 10pt; color: #444; margin-bottom: 8mm; }
  .meta {
    border: 1px solid #d4d4d8;
    padding: 4mm 5mm;
    font-size: 10.5pt;
    line-height: 1.55;
    margin-bottom: 6mm;
  }
  .meta dt { font-weight: 700; display: inline; }
  .meta .row { margin: 0 0 2px; }
  .block { margin: 5mm 0; font-size: 11pt; line-height: 1.55; }
  .block h2 {
    font-size: 11.5pt;
    text-transform: uppercase;
    border-bottom: 1px solid #d4d4d8;
    padding-bottom: 1mm;
    margin: 0 0 3mm;
    letter-spacing: 0.03em;
  }
  .block p { margin: 0 0 2.5mm; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-top: 2mm; }
  table.data th, table.data td {
    border: 1px solid #a1a1aa;
    padding: 2mm 3mm;
    text-align: left;
  }
  table.data th { background: #f4f4f5; font-weight: 700; }
  .deadline {
    background: #fef3c7;
    border-left: 4px solid #b45309;
    padding: 3mm 4mm;
    font-size: 11pt;
    margin: 6mm 0;
    font-weight: 600;
  }
  .legal {
    font-size: 10pt;
    color: #3f3f46;
    margin-top: 6mm;
    border-top: 1px dashed #d4d4d8;
    padding-top: 3mm;
  }
  .legal strong { color: #111; }
  .signatures {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60mm, 1fr));
    gap: 16mm;
    margin-top: 16mm;
  }
  .sig { font-size: 10pt; text-align: center; }
  .sig-line { border-top: 1px solid #111; margin-bottom: 2mm; height: 12mm; }
  .sig-role { font-weight: 700; }
  .sig-inst { color: #3f3f46; }
  .stamp-block {
    width: 52mm;
    margin: 8mm 0 0 auto;
    text-align: center;
    break-inside: avoid;
  }
  .stamp-block img {
    display: block;
    width: 52mm;
    height: 52mm;
    object-fit: contain;
    margin: 0 auto;
  }
  .stamp-caption {
    margin-top: 1mm;
    font-size: 7.5pt;
    color: #71717a;
    font-style: italic;
  }
  .footer {
    margin-top: 14mm;
    border-top: 1px dotted #a1a1aa;
    padding-top: 3mm;
    font-size: 8.5pt;
    color: #6b7280;
    font-style: italic;
  }
  @media print {
    html, body { background: white; }
    .page { box-shadow: none; margin: 0; width: auto; min-height: auto; padding: 18mm 16mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="left">
        <div class="institution">${escape(doc.institution)}</div>
        <div>Republika e Shqipërisë</div>
      </div>
      <div class="right">
        <div><strong>Nr. prot.:</strong> ${escape(doc.number)}</div>
        <div><strong>Data:</strong> ${escape(fmtDate(doc.date))}</div>
      </div>
    </div>

    <h1>${escape(doc.title)}</h1>
    <div class="docnum">Dosja: ${escape(doc.number.split("/")[0])}</div>

    <div class="meta">
      <div class="row"><dt>Drejtuar:</dt> ${escape(doc.addressee)}${doc.addresseeAddress ? `, ${escape(doc.addresseeAddress)}` : ""}</div>
      <div class="row"><dt>Pasuria:</dt> ${doc.propertyLines.map(escape).join(" · ")}</div>
    </div>

    ${sectionsHtml}
    ${tableHtml}

    ${doc.deadlineLine ? `<div class="deadline">⚠ ${escape(doc.deadlineLine)}</div>` : ""}

    <div class="legal">
      <strong>Bazë ligjore:</strong>
      <ul>
        ${doc.legalBasis.map((l) => `<li>${escape(l)}</li>`).join("")}
      </ul>
    </div>

    ${sigHtml}
    ${stampHtml}

    ${doc.footer ? `<div class="footer">${escape(doc.footer)}</div>` : ""}
  </div>
</body>
</html>`;
}
var TEMPLATE_KEYS = [
	"ekb_missing_docs_notice",
	"ekb_refusal_decision",
	"ekb_value_calculation",
	"ekb_citizen_invoice",
	"ekb_contract_draft",
	"exp_owner_notification",
	"exp_compensation_proposal"
];
function audit(d, ev) {
	d.audit = [...d.audit, {
		id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		...ev
	}];
}
function notFound() {
	throw new Error("Dossier not found");
}
function ensureTemplateAllowed(d, key) {
	if (!TEMPLATES_FOR_PROCESS[d.process].includes(key)) throw new Error(`Template ${key} nuk është i lejuar për procesin ${d.process}.`);
}
var listDocTemplates_createServerFn_handler = createServerRpc({
	id: "d4e3984ef2f1ed25e6c561027e5788f1c8aecfecddeb5f09c20ef0332f018bf1",
	name: "listDocTemplates",
	filename: "src/lib/api/documents.functions.ts"
}, (opts) => listDocTemplates.__executeServer(opts));
var listDocTemplates = createServerFn({ method: "GET" }).validator((input) => objectType({ dossierId: stringType() }).parse(input)).handler(listDocTemplates_createServerFn_handler, async ({ data }) => {
	const d = getById(data.dossierId);
	if (!d) notFound();
	const keys = TEMPLATES_FOR_PROCESS[d.process];
	const { TEMPLATE_LABELS } = await import("./templates-BagsaLpg.mjs");
	return { templates: keys.map((k) => ({
		key: k,
		label: TEMPLATE_LABELS[k]
	})) };
});
var previewDocument_createServerFn_handler = createServerRpc({
	id: "d7d391ad79521e503c357131d1d205274d8160ae074c871dc3759e999317a4d9",
	name: "previewDocument",
	filename: "src/lib/api/documents.functions.ts"
}, (opts) => previewDocument.__executeServer(opts));
var previewDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS)
}).parse(input)).handler(previewDocument_createServerFn_handler, async ({ data }) => {
	const d = getById(data.dossierId);
	if (!d) notFound();
	ensureTemplateAllowed(d, data.template);
	const doc = buildDocument(data.template, d, PROCESSES[d.process]);
	return {
		doc,
		html: renderDocHtml(doc)
	};
});
var generateDocument_createServerFn_handler = createServerRpc({
	id: "54b746f20c01ae1b2a610eb327ed545963c6f0a9bed65c324d57fa8de18a8c2a",
	name: "generateDocument",
	filename: "src/lib/api/documents.functions.ts"
}, (opts) => generateDocument.__executeServer(opts));
var generateDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS),
	/** optional AI-improved sections to use instead of the raw template body */
	improvedSections: arrayType(objectType({
		heading: stringType().optional(),
		paragraphs: arrayType(stringType())
	})).optional(),
	format: enumType(["html", "docx"]).default("html")
}).parse(input)).handler(generateDocument_createServerFn_handler, async ({ data }) => {
	const d = getById(data.dossierId);
	if (!d) notFound();
	ensureTemplateAllowed(d, data.template);
	const doc = buildDocument(data.template, d, PROCESSES[d.process]);
	if (data.improvedSections && data.improvedSections.length === doc.sections.length) doc.sections = doc.sections.map((s, i) => ({
		heading: data.improvedSections[i].heading ?? s.heading,
		paragraphs: data.improvedSections[i].paragraphs
	}));
	const documentType = data.template === "ekb_citizen_invoice" ? "citizen_invoice" : data.template;
	const record = {
		id: `gen-${d.documents.length + 1}-${Date.now().toString(36)}`,
		type: documentType,
		name: `${doc.title} — ${doc.number}`,
		status: "uploaded",
		uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
		uploadedBy: "ai_assistant",
		notes: `Generated (${data.format})${data.improvedSections ? " + AI-improved wording" : ""}`
	};
	d.documents = [...d.documents, record];
	d.missingDocumentTypes = d.missingDocumentTypes.filter((t) => t !== documentType);
	audit(d, {
		actor: "ai_assistant",
		action: "Dokument i gjeneruar",
		details: `${data.template} — ${doc.number}${data.improvedSections ? " (wording AI)" : ""}`
	});
	upsert(d);
	let docxBase64;
	if (data.format === "docx") {
		const { renderDocxBuffer } = await import("./render-docx.server-CgW7Rq8J.mjs");
		docxBase64 = (await renderDocxBuffer(doc)).toString("base64");
	}
	return {
		doc,
		html: renderDocHtml(doc),
		docxBase64,
		docxMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		fileName: `${doc.number.replace(/[^a-zA-Z0-9-_.]/g, "_")}.${data.format === "docx" ? "docx" : "html"}`,
		documentRecordId: record.id
	};
});
var aiImproveDocumentWording_createServerFn_handler = createServerRpc({
	id: "3ab2de3e5aba1cc8cc6bb6528697319e212ef65160cb7f996b0c0c4ebd664a5b",
	name: "aiImproveDocumentWording",
	filename: "src/lib/api/documents.functions.ts"
}, (opts) => aiImproveDocumentWording.__executeServer(opts));
var aiImproveDocumentWording = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS)
}).parse(input)).handler(aiImproveDocumentWording_createServerFn_handler, async ({ data }) => {
	const d = getById(data.dossierId);
	if (!d) notFound();
	ensureTemplateAllowed(d, data.template);
	const baseDoc = buildDocument(data.template, d, PROCESSES[d.process]);
	const { callOpenAi } = await import("./openai-TTrdtFQa.mjs").then((n) => n.n);
	const res = await callOpenAi({
		system: "Je redaktor zyrtar shqiptar për dokumente qeveritare. Përmirëso vetëm GJUHËN dhe TONIN e seksioneve (formal, i qartë, koherent). NDALOHET të ndryshosh fakte ligjore, datat, shumat, emrat, numrat e dokumentit, bazën ligjore ose strukturën. Mos shto seksione ose fakte të reja. Mos hiq fakte ekzistuese. Mbaj saktësisht të njëjtin numër seksionesh dhe të njëjtën rendje paragrafësh. Përgjigju VETËM me JSON në formatin: {\"sections\":[{\"heading\":\"...\",\"paragraphs\":[\"...\"]}]}",
		user: JSON.stringify({
			title: baseDoc.title,
			addressee: baseDoc.addressee,
			sections: baseDoc.sections
		}, null, 2),
		jsonMode: true,
		temperature: .2
	});
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	try {
		const sections = (JSON.parse(res.content).sections ?? []).map((s) => ({
			heading: s.heading,
			paragraphs: (s.paragraphs ?? []).map(String)
		}));
		if (sections.length !== baseDoc.sections.length) return {
			ok: false,
			error: `AI ndryshoi numrin e seksioneve (pritej ${baseDoc.sections.length}, mori ${sections.length}). U refuzua.`
		};
		audit(d, {
			actor: "ai_assistant",
			action: "AI përmirësoi formulimin (paraprak)",
			details: data.template
		});
		upsert(d);
		return {
			ok: true,
			sections,
			model: res.model
		};
	} catch (e) {
		return {
			ok: false,
			error: `Përgjigja e AI nuk është JSON i vlefshëm: ${e instanceof Error ? e.message : "parse error"}`
		};
	}
});
var downloadDocx_createServerFn_handler = createServerRpc({
	id: "40ebf0a6479a0b5b1d3e473b3a3c0801bfbc6abd0220b495d3bb2386d01a04c6",
	name: "downloadDocx",
	filename: "src/lib/api/documents.functions.ts"
}, (opts) => downloadDocx.__executeServer(opts));
var downloadDocx = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS),
	improvedSections: arrayType(objectType({
		heading: stringType().optional(),
		paragraphs: arrayType(stringType())
	})).optional()
}).parse(input)).handler(downloadDocx_createServerFn_handler, async ({ data }) => {
	const d = getById(data.dossierId);
	if (!d) notFound();
	ensureTemplateAllowed(d, data.template);
	const doc = buildDocument(data.template, d, PROCESSES[d.process]);
	if (data.improvedSections && data.improvedSections.length === doc.sections.length) doc.sections = doc.sections.map((s, i) => ({
		heading: data.improvedSections[i].heading ?? s.heading,
		paragraphs: data.improvedSections[i].paragraphs
	}));
	const { renderDocxBuffer } = await import("./render-docx.server-CgW7Rq8J.mjs");
	return {
		base64: (await renderDocxBuffer(doc)).toString("base64"),
		mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		fileName: `${doc.number.replace(/[^a-zA-Z0-9-_.]/g, "_")}.docx`
	};
});
//#endregion
export { aiImproveDocumentWording_createServerFn_handler, downloadDocx_createServerFn_handler, generateDocument_createServerFn_handler, listDocTemplates_createServerFn_handler, TEMPLATE_LABELS as n, previewDocument_createServerFn_handler, buildDocument as r, TEMPLATES_FOR_PROCESS as t };
