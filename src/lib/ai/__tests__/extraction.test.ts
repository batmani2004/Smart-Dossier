import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { extractionResultSchema, buildSchemaDescription } from "../extraction-schemas";
import { parseExtractionPayload } from "../extract.functions";

const validPayload = {
  documentType: "family_certificate",
  language: "sq",
  common: {
    applicantName: {
      value: "Arta Beqiri",
      confidence: 0.95,
      sourceEvidence: "Kryefamiljari: Arta Beqiri",
    },
    nidMasked: { value: "I85*****G", confidence: 0.7 },
    propertyAreaM2: { value: null, confidence: 0.0 },
    municipality: { value: "Tiranë", confidence: 0.9 },
  },
  ekb: {
    familyIncomeAll: { value: 12000, confidence: 0.92, sourceEvidence: "12,000 ALL" },
    familyMembers: { value: 4, confidence: 0.9 },
  },
  missingFields: ["common.propertyAreaM2"],
  warnings: [],
  overallConfidence: 0.82,
};

describe("extractionResultSchema", () => {
  it("accepts a well-formed payload", () => {
    const r = extractionResultSchema.safeParse(validPayload);
    expect(r.success).toBe(true);
  });

  it("rejects out-of-range confidence", () => {
    const bad = JSON.parse(JSON.stringify(validPayload));
    bad.common.applicantName.confidence = 1.5;
    expect(extractionResultSchema.safeParse(bad).success).toBe(false);
  });

  it("requires overallConfidence", () => {
    const bad = JSON.parse(JSON.stringify(validPayload));
    delete bad.overallConfidence;
    expect(extractionResultSchema.safeParse(bad).success).toBe(false);
  });

  it("includes process-specific cues in the schema description", () => {
    expect(buildSchemaDescription("ekb_privatization")).toContain("familyIncomeAll");
    expect(buildSchemaDescription("expropriation")).toContain("appealDeadline");
  });
});

describe("parseExtractionPayload (mocked LLM output)", () => {
  it("parses raw JSON returned by the LLM", () => {
    const res = parseExtractionPayload(JSON.stringify(validPayload), "test-model");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.result.ekb?.familyIncomeAll?.value).toBe(12000);
      expect(res.result.overallConfidence).toBeGreaterThan(0.5);
    }
  });

  it("recovers JSON wrapped in markdown fences", () => {
    const wrapped = "```json\n" + JSON.stringify(validPayload) + "\n```";
    const res = parseExtractionPayload(wrapped, "test-model");
    expect(res.ok).toBe(true);
  });

  it("fails clearly on non-JSON output", () => {
    const res = parseExtractionPayload("I cannot answer that.", "test-model");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/JSON|not return/i);
  });

  it("fails when schema validation fails", () => {
    const res = parseExtractionPayload(
      JSON.stringify({ documentType: "x", common: {}, missingFields: [], warnings: [] }),
      "test-model",
    );
    expect(res.ok).toBe(false);
  });
});

describe("extractFromText integration (mocked fetch)", () => {
  const realFetch = globalThis.fetch;
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "sk-test-xxxxxxxx";
    process.env.OPENAI_MODEL = "gpt-test";
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
  });

  it("calls the OpenAI endpoint and returns a parsed result", async () => {
    const mockFetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ choices: [{ message: { content: JSON.stringify(validPayload) } }] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    );
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    const { runExtraction } = await import("../extract.functions");
    const res = await runExtraction({
      processKind: "ekb_privatization",
      documentType: "family_certificate",
      text: "Kryefamiljari: Arta Beqiri\nTë ardhura: 12,000 ALL",
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const call = mockFetch.mock.calls[0] as unknown as [string, unknown];
    expect(String(call[0])).toContain("api.openai.com");
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.result.documentType).toBe("family_certificate");
  });

  it("returns ok:false with no key", async () => {
    delete process.env.OPENAI_API_KEY;
    const { runExtraction } = await import("../extract.functions");
    const res = await runExtraction({
      processKind: "expropriation",
      documentType: "x",
      text: "hi",
    });
    expect(res.ok).toBe(false);
  });
});
