import { rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { d as upsert, r as getById } from "./store-mnrjP0DR.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as extractionResultSchema } from "./extraction-schemas-CiVuWAU6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply-extraction.functions-sf65G7z6.js
function audit(d, ev) {
	d.audit = [...d.audit, {
		id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		...ev
	}];
}
var applyExtractedFields_createServerFn_handler = createServerRpc({
	id: "9cd5dfa34d2e41b216ebda6b1de936d6c17b3e4ee7a3933f7f04be650e52bc8b",
	name: "applyExtractedFields",
	filename: "src/lib/api/apply-extraction.functions.ts"
}, (opts) => applyExtractedFields.__executeServer(opts));
var applyExtractedFields = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	result: extractionResultSchema,
	sourceDocumentId: stringType().optional(),
	fileName: stringType().optional()
}).parse(input)).handler(applyExtractedFields_createServerFn_handler, async ({ data }) => {
	const d = getById(data.id);
	if (!d) throw new Error("Dossier not found");
	const applied = [];
	const skipped = [];
	const conflicts = [];
	const c = data.result.common ?? {};
	const ekb = data.result.ekb ?? {};
	const exp = data.result.expropriation ?? {};
	const set = (label, next, apply, current) => {
		if (next === null || next === void 0 || next === "") {
			skipped.push(label);
			return;
		}
		if (current !== void 0 && current !== null && current !== "" && current !== next) conflicts.push({
			field: label,
			old: String(current),
			next: String(next)
		});
		apply();
		applied.push(label);
	};
	if (c.applicantName?.value) {
		const p = d.parties[0];
		if (p) set("applicantName", c.applicantName.value, () => {
			p.fullName = String(c.applicantName.value);
		}, p.fullName);
	}
	if (c.nidMasked?.value && d.parties[0]) {
		const p = d.parties[0];
		set("nidMasked", c.nidMasked.value, () => {
			p.nationalIdMasked = String(c.nidMasked.value);
		}, p.nationalIdMasked);
	}
	if (c.phone?.value || c.email?.value || c.address?.value) {
		const p = d.parties[0];
		if (p) {
			p.contact = {
				...p.contact,
				phone: c.phone?.value ? String(c.phone.value) : p.contact?.phone,
				email: c.email?.value ? String(c.email.value) : p.contact?.email,
				address: c.address?.value ? String(c.address.value) : p.contact?.address
			};
			applied.push("contact");
		}
	}
	if (c.propertyId?.value) set("cadastralNo", c.propertyId.value, () => {
		d.property.cadastralNo = String(c.propertyId.value);
	}, d.property.cadastralNo);
	if (c.cadastralZone?.value) set("zone", c.cadastralZone.value, () => {
		d.property.zone = String(c.cadastralZone.value);
	}, d.property.zone);
	if (c.propertyAreaM2?.value !== void 0 && c.propertyAreaM2?.value !== null) set("areaSqm", c.propertyAreaM2.value, () => {
		d.property.areaSqm = Number(c.propertyAreaM2.value);
	}, d.property.areaSqm);
	if (ekb.familyIncomeAll?.value !== void 0 && ekb.familyIncomeAll?.value !== null) set("familyIncomeAll", ekb.familyIncomeAll.value, () => {
		d.property.familyIncomeAll = Number(ekb.familyIncomeAll.value);
	}, d.property.familyIncomeAll);
	if (ekb.marketPriceAll?.value !== void 0 && ekb.marketPriceAll?.value !== null) set("marketPriceAll", ekb.marketPriceAll.value, () => {
		d.property.marketPriceAll = Number(ekb.marketPriceAll.value);
	}, d.property.marketPriceAll);
	if (ekb.landPriceAll?.value !== void 0 && ekb.landPriceAll?.value !== null) set("landPriceAll", ekb.landPriceAll.value, () => {
		d.property.landPriceAll = Number(ekb.landPriceAll.value);
	}, d.property.landPriceAll);
	if (exp.compensationAmountAll?.value !== void 0 && exp.compensationAmountAll?.value !== null) set("finalValueAll", exp.compensationAmountAll.value, () => {
		d.finalValueAll = Number(exp.compensationAmountAll.value);
	}, d.finalValueAll);
	d.insights = [...d.insights, {
		id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
		kind: "extraction",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		text: `Fusha të aplikuara nga AI (${data.result.documentType})`,
		data: {
			documentType: data.result.documentType,
			applied,
			conflicts: conflicts.length,
			fileName: data.fileName ?? null
		},
		confidence: data.result.overallConfidence,
		sourceDocumentId: data.sourceDocumentId
	}];
	audit(d, {
		actor: "ai_assistant",
		action: "Aplikim i fushave të nxjerra me AI",
		details: `${applied.length} fusha; ${conflicts.length} konflikte; tipi=${data.result.documentType}`
	});
	d.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	upsert(d);
	return {
		ok: true,
		applied,
		skipped,
		conflicts
	};
});
//#endregion
export { applyExtractedFields_createServerFn_handler };
