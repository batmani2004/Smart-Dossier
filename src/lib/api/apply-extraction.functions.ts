// Apply AI-extracted fields to a dossier, writing an audit event.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getById, upsert } from "./store";
import type { AuditEvent, Dossier } from "@/core/types";
import { extractionResultSchema } from "@/lib/ai/extraction-schemas";

function audit(d: Dossier, ev: Omit<AuditEvent, "id" | "at">) {
  d.audit = [
    ...d.audit,
    {
      id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
      at: new Date().toISOString(),
      ...ev,
    },
  ];
}

export const applyExtractedFields = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.string(),
        result: extractionResultSchema,
        sourceDocumentId: z.string().optional(),
        fileName: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const d = getById(data.id);
    if (!d) throw new Error("Dossier not found");

    const applied: string[] = [];
    const skipped: string[] = [];
    const conflicts: { field: string; old: string; next: string }[] = [];
    const c = data.result.common ?? {};
    const ekb = data.result.ekb ?? {};
    const exp = data.result.expropriation ?? {};

    const set = <K extends string>(
      label: K,
      next: unknown,
      apply: () => void,
      current: unknown,
    ) => {
      if (next === null || next === undefined || next === "") {
        skipped.push(label);
        return;
      }
      if (current !== undefined && current !== null && current !== "" && current !== next) {
        conflicts.push({ field: label, old: String(current), next: String(next) });
      }
      apply();
      applied.push(label);
    };

    // Common
    if (c.applicantName?.value) {
      const p = d.parties[0];
      if (p) {
        set(
          "applicantName",
          c.applicantName.value,
          () => {
            p.fullName = String(c.applicantName!.value);
          },
          p.fullName,
        );
      }
    }
    if (c.nidMasked?.value && d.parties[0]) {
      const p = d.parties[0];
      set(
        "nidMasked",
        c.nidMasked.value,
        () => {
          p.nationalIdMasked = String(c.nidMasked!.value);
        },
        p.nationalIdMasked,
      );
    }
    if (c.phone?.value || c.email?.value || c.address?.value) {
      const p = d.parties[0];
      if (p) {
        p.contact = {
          ...p.contact,
          phone: c.phone?.value ? String(c.phone.value) : p.contact?.phone,
          email: c.email?.value ? String(c.email.value) : p.contact?.email,
          address: c.address?.value ? String(c.address.value) : p.contact?.address,
        };
        applied.push("contact");
      }
    }
    if (c.propertyId?.value) {
      set(
        "cadastralNo",
        c.propertyId.value,
        () => {
          d.property.cadastralNo = String(c.propertyId!.value);
        },
        d.property.cadastralNo,
      );
    }
    if (c.cadastralZone?.value) {
      set(
        "zone",
        c.cadastralZone.value,
        () => {
          d.property.zone = String(c.cadastralZone!.value);
        },
        d.property.zone,
      );
    }
    if (c.propertyAreaM2?.value !== undefined && c.propertyAreaM2?.value !== null) {
      set(
        "areaSqm",
        c.propertyAreaM2.value,
        () => {
          d.property.areaSqm = Number(c.propertyAreaM2!.value);
        },
        d.property.areaSqm,
      );
    }

    // EKB
    if (ekb.familyIncomeAll?.value !== undefined && ekb.familyIncomeAll?.value !== null) {
      set(
        "familyIncomeAll",
        ekb.familyIncomeAll.value,
        () => {
          d.property.familyIncomeAll = Number(ekb.familyIncomeAll!.value);
        },
        d.property.familyIncomeAll,
      );
    }
    if (ekb.marketPriceAll?.value !== undefined && ekb.marketPriceAll?.value !== null) {
      set(
        "marketPriceAll",
        ekb.marketPriceAll.value,
        () => {
          d.property.marketPriceAll = Number(ekb.marketPriceAll!.value);
        },
        d.property.marketPriceAll,
      );
    }
    if (ekb.landPriceAll?.value !== undefined && ekb.landPriceAll?.value !== null) {
      set(
        "landPriceAll",
        ekb.landPriceAll.value,
        () => {
          d.property.landPriceAll = Number(ekb.landPriceAll!.value);
        },
        d.property.landPriceAll,
      );
    }

    // Expropriation
    if (
      exp.compensationAmountAll?.value !== undefined &&
      exp.compensationAmountAll?.value !== null
    ) {
      set(
        "finalValueAll",
        exp.compensationAmountAll.value,
        () => {
          d.finalValueAll = Number(exp.compensationAmountAll!.value);
        },
        d.finalValueAll,
      );
    }

    // Track insight + audit
    d.insights = [
      ...d.insights,
      {
        id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
        kind: "extraction",
        createdAt: new Date().toISOString(),
        text: `Fusha të aplikuara nga AI (${data.result.documentType})`,
        data: {
          documentType: data.result.documentType,
          applied,
          conflicts: conflicts.length,
          fileName: data.fileName ?? null,
        },
        confidence: data.result.overallConfidence,
        sourceDocumentId: data.sourceDocumentId,
      },
    ];
    audit(d, {
      actor: "ai_assistant",
      action: "Aplikim i fushave të nxjerra me AI",
      details: `${applied.length} fusha; ${conflicts.length} konflikte; tipi=${data.result.documentType}`,
    });
    d.updatedAt = new Date().toISOString();
    upsert(d);

    return { ok: true, applied, skipped, conflicts };
  });
