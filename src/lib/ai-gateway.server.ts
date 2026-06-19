import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Mungon LOVABLE_API_KEY.");
  return createLovableAiGatewayProvider(key);
}

export const MODEL_ID = "google/gemini-3-flash-preview";
