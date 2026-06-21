import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-gateway.server-Doq022hY.js
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		}
	});
}
function getGateway() {
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Mungon LOVABLE_API_KEY.");
	return createLovableAiGatewayProvider(key);
}
var MODEL_ID = "google/gemini-3-flash-preview";
//#endregion
export { MODEL_ID, createLovableAiGatewayProvider, getGateway };
