// Server function: AI extraction from already-extracted document text.
// Uses raw OpenAI Chat Completions per user requirements (OPENAI_API_KEY, OPENAI_MODEL).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildSchemaDescription,
  extractionResultSchema,
  type ExtractionResult,
} from "./extraction-schemas";

const SYSTEM_PROMPT = `You are an extractor of structured data from Albanian property-procedure documents
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

export type ExtractResponse =
  | { ok: true; result: ExtractionResult; model: string }
  | { ok: false; error: string; raw?: string };

// Returns whether the server has an OpenAI key configured.
export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  return { enabled: Boolean(key && key.length > 8), model };
});

export type ExtractInput = {
  processKind: "ekb_privatization" | "expropriation" | "property_registration";
  documentType: string;
  text: string;
  fileName?: string;
};

/** Plain (testable) implementation. Reads env at call time. */
export async function runExtraction(input: ExtractInput): Promise<ExtractResponse> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) {
    return {
      ok: false,
      error:
        "OPENAI_API_KEY mungon. Vendoseni në variablat e mjedisit për të aktivizuar nxjerrjen me AI.",
    };
  }

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
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  let raw = "";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `OpenAI ${res.status}: ${body.slice(0, 300)}` };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    raw = json.choices?.[0]?.message?.content ?? "";
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }

  return parseExtractionPayload(raw, model);
}

export const extractFromText = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        processKind: z.enum(["ekb_privatization", "expropriation", "property_registration"]),
        documentType: z.string().min(1),
        text: z.string().min(1).max(120_000),
        fileName: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<ExtractResponse> => runExtraction(data));

/** Exported for tests + reuse by mocked LLM paths. */
export function parseExtractionPayload(raw: string, model: string): ExtractResponse {
  if (!raw.trim()) return { ok: false, error: "empty model response" };
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    // sometimes models wrap in ```json fences — try to recover
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (!m) return { ok: false, error: "model did not return JSON", raw };
    try {
      parsedJson = JSON.parse(m[1]);
    } catch {
      return { ok: false, error: "JSON parse failed", raw };
    }
  }
  const result = extractionResultSchema.safeParse(parsedJson);
  if (!result.success) {
    return {
      ok: false,
      error: `schema validation failed: ${result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
      raw,
    };
  }
  return { ok: true, result: result.data, model };
}
