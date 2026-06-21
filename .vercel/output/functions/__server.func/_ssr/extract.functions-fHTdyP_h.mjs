import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as enumType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { h as createSsrRpc } from "./dossiers.functions-D8xRMefQ.mjs";
import { n as extractionResultSchema, t as buildSchemaDescription } from "./extraction-schemas-CiVuWAU6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract.functions-fHTdyP_h.js
var $$splitComponentImporter = () => import("./dosja._id-D_orkGxm.mjs");
var Route = createFileRoute("/dosja/$id")({
	head: () => ({ meta: [{ title: "Dosja — Smart Dossier" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SYSTEM_PROMPT = `You are an extractor of structured data from Albanian property-procedure documents
(privatization of state-owned housing "EKB", expropriation procedures, and business property-registration procedures).

Rules:
- Return JSON ONLY, no prose, no markdown fences.
- For every field include: "value" (typed value or null if absent), "confidence" (0..1),
  and "sourceEvidence" (a SHORT verbatim snippet from the input — max ~25 words).
- If a value is absent or unreadable, set "value" to null and list its dotted name in "missingFields".
- Never invent legal steps, deadlines, or institution names that are not in the text.
- Use Albanian field semantics (ALL currency, dates in YYYY-MM-DD when possible).
- Mask national IDs: keep first 3 and last 1 chars, replace middle with "*".
- Set overallConfidence honestly (0.3 for thin text, 0.9+ only when key fields are explicit).`;
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("d21956ed0ebcd19b1520896e3dbc87859c486683e0de627204128328b66a5718"));
/** Plain (testable) implementation. Reads env at call time. */
async function runExtraction(input) {
	const key = process.env.OPENAI_API_KEY;
	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
	if (!key) return {
		ok: false,
		error: "OPENAI_API_KEY mungon. Vendoseni në variablat e mjedisit për të aktivizuar nxjerrjen me AI."
	};
	const userPrompt = [
		`Process: ${input.processKind}`,
		`Document type hint: ${input.documentType}`,
		input.fileName ? `File: ${input.fileName}` : null,
		"",
		buildSchemaDescription(input.processKind),
		"",
		"Document text:",
		"---",
		input.text,
		"---"
	].filter(Boolean).join("\n");
	let raw = "";
	try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`
			},
			body: JSON.stringify({
				model,
				temperature: .1,
				response_format: { type: "json_object" },
				messages: [{
					role: "system",
					content: SYSTEM_PROMPT
				}, {
					role: "user",
					content: userPrompt
				}]
			})
		});
		if (!res.ok) {
			const body = await res.text();
			return {
				ok: false,
				error: `OpenAI ${res.status}: ${body.slice(0, 300)}`
			};
		}
		raw = (await res.json()).choices?.[0]?.message?.content ?? "";
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "network error"
		};
	}
	return parseExtractionPayload(raw, model);
}
var extractFromText = createServerFn({ method: "POST" }).validator((input) => objectType({
	processKind: enumType([
		"ekb_privatization",
		"expropriation",
		"property_registration"
	]),
	documentType: stringType().min(1),
	text: stringType().min(1).max(12e4),
	fileName: stringType().optional()
}).parse(input)).handler(createSsrRpc("b8c3634854127e6a8b70b78f8e58cc270a004aa50ffa85f2ffa4efd705a505c0"));
/** Exported for tests + reuse by mocked LLM paths. */
function parseExtractionPayload(raw, model) {
	if (!raw.trim()) return {
		ok: false,
		error: "empty model response"
	};
	let parsedJson;
	try {
		parsedJson = JSON.parse(raw);
	} catch {
		const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
		if (!m) return {
			ok: false,
			error: "model did not return JSON",
			raw
		};
		try {
			parsedJson = JSON.parse(m[1]);
		} catch {
			return {
				ok: false,
				error: "JSON parse failed",
				raw
			};
		}
	}
	const result = extractionResultSchema.safeParse(parsedJson);
	if (!result.success) return {
		ok: false,
		error: `schema validation failed: ${result.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
		raw
	};
	return {
		ok: true,
		result: result.data,
		model
	};
}
//#endregion
export { runExtraction as i, extractFromText as n, getAiStatus as r, Route as t };
