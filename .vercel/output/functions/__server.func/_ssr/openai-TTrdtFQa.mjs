//#region node_modules/.nitro/vite/services/ssr/assets/openai-TTrdtFQa.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var openai_exports = /* @__PURE__ */ __exportAll({ callOpenAi: () => callOpenAi });
async function callOpenAi({ system, user, jsonMode, temperature = .2 }) {
	const key = process.env.OPENAI_API_KEY;
	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
	if (!key) return {
		ok: false,
		error: "OPENAI_API_KEY mungon. Vendoseni në variablat e mjedisit për të aktivizuar funksionet e AI."
	};
	try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`
			},
			body: JSON.stringify({
				model,
				temperature,
				...jsonMode ? { response_format: { type: "json_object" } } : {},
				messages: [{
					role: "system",
					content: system
				}, {
					role: "user",
					content: user
				}]
			})
		});
		if (!res.ok) {
			const body = await res.text();
			return {
				ok: false,
				status: res.status,
				error: `OpenAI ${res.status}: ${body.slice(0, 300)}`
			};
		}
		const content = (await res.json()).choices?.[0]?.message?.content ?? "";
		if (!content.trim()) return {
			ok: false,
			error: "empty model response"
		};
		return {
			ok: true,
			content,
			model
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "network error"
		};
	}
}
//#endregion
export { openai_exports as n, callOpenAi as t };
