import { describe, expect, it } from "vitest";
import { ekbPrivatizationProcess, expropriationProcess } from "../processes";
import { getNextStep, getCriticalAlerts, getDeadlineState } from "../engine";
import { calculateEkbPrivatizationValue } from "../value";
import { SEED_CORE_DOSSIERS } from "../seed";
import type { Dossier } from "../types";

function withDossier(overrides: Partial<Dossier>): Dossier {
  const base = SEED_CORE_DOSSIERS[0];
  return { ...base, ...overrides } as Dossier;
}

describe("getNextStep", () => {
  it("advances within the same phase when more steps exist", () => {
    const d = withDossier({
      process: "expropriation",
      currentPhaseId: "exp-p4",
      currentStepId: "exp-s4",
    });
    const res = getNextStep(d, expropriationProcess);
    expect(res?.step.id).toBe("exp-s4b");
    expect(res?.isFinal).toBe(false);
  });

  it("moves to the first step of the next phase when at end of current phase", () => {
    const d = withDossier({
      process: "ekb_privatization",
      currentPhaseId: "ekb-p1",
      currentStepId: "ekb-s1",
    });
    const res = getNextStep(d, ekbPrivatizationProcess);
    expect(res?.phase.id).toBe("ekb-p2");
    expect(res?.step.id).toBe("ekb-s2");
  });

  it("flags the final step", () => {
    const d = withDossier({
      process: "ekb_privatization",
      currentPhaseId: "ekb-p8",
      currentStepId: "ekb-s8",
    });
    const res = getNextStep(d, ekbPrivatizationProcess);
    expect(res?.isFinal).toBe(true);
  });

  it("returns null for unknown phase/step ids", () => {
    const d = withDossier({ currentPhaseId: "ghost", currentStepId: "ghost" });
    expect(getNextStep(d, ekbPrivatizationProcess)).toBeNull();
  });
});

describe("getCriticalAlerts", () => {
  it("surfaces process-defined critical points for the current step", () => {
    const d = withDossier({
      process: "ekb_privatization",
      currentPhaseId: "ekb-p3",
      currentStepId: "ekb-s3",
      documents: [],
      missingDocumentTypes: [],
      deadlines: [],
      status: "in_progress",
    });
    const alerts = getCriticalAlerts(d, ekbPrivatizationProcess, new Date());
    expect(alerts.some((a) => a.id === "cp:aplikim-fizik")).toBe(true);
    expect(alerts.some((a) => a.id === "cp:no-e-albania")).toBe(true);
  });

  it("flags missing required documents for the current step", () => {
    const d = withDossier({
      process: "ekb_privatization",
      currentPhaseId: "ekb-p3",
      currentStepId: "ekb-s3",
      documents: [],
      deadlines: [],
      status: "in_progress",
    });
    const alerts = getCriticalAlerts(d, ekbPrivatizationProcess);
    expect(alerts.some((a) => a.id === "doc:family_certificate")).toBe(true);
  });

  it("flags overdue unresolved deadlines and blocked status", () => {
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const d = withDossier({
      process: "ekb_privatization",
      currentPhaseId: "ekb-p1",
      currentStepId: "ekb-s1",
      status: "blocked",
      deadlines: [{ id: "dl-x", kind: "legal", label: "Test", dueAt: past }],
    });
    const alerts = getCriticalAlerts(d, ekbPrivatizationProcess);
    expect(alerts.some((a) => a.id === "dl:dl-x" && a.severity === "critical")).toBe(true);
    expect(alerts.some((a) => a.id === "status:blocked")).toBe(true);
  });
});

describe("getDeadlineState", () => {
  it("returns 'none' when there are no open deadlines", () => {
    const d = withDossier({ deadlines: [] });
    expect(getDeadlineState(d, ekbPrivatizationProcess).state).toBe("none");
  });

  it("returns 'overdue' when nearest deadline is in the past", () => {
    const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const d = withDossier({
      deadlines: [{ id: "x", kind: "sla", label: "X", dueAt: past }],
    });
    const s = getDeadlineState(d, ekbPrivatizationProcess);
    expect(s.state).toBe("overdue");
    expect(s.overdueCount).toBe(1);
  });

  it("returns 'due_soon' within the 7-day window", () => {
    const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const d = withDossier({
      deadlines: [{ id: "x", kind: "sla", label: "X", dueAt: soon }],
    });
    const s = getDeadlineState(d, ekbPrivatizationProcess);
    expect(s.state).toBe("due_soon");
    expect(s.dueSoonCount).toBe(1);
  });

  it("returns 'ok' when the nearest deadline is far in the future", () => {
    const far = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
    const d = withDossier({
      deadlines: [{ id: "x", kind: "sla", label: "X", dueAt: far }],
    });
    expect(getDeadlineState(d, ekbPrivatizationProcess).state).toBe("ok");
  });
});

describe("calculateEkbPrivatizationValue", () => {
  it("high income -> 100% housing + 100% land", () => {
    const r = calculateEkbPrivatizationValue({
      familyIncomeAll: 20000,
      marketPriceAll: 3_000_000,
      landPriceAll: 500_000,
    });
    expect(r.bracket).toBe("high");
    expect(r.housingPercent).toBe(100);
    expect(r.landPercent).toBe(100);
    expect(r.totalPayableAll).toBe(3_500_000);
  });

  it("mid income (boundary 14000) -> 50% housing + 100% land", () => {
    const r = calculateEkbPrivatizationValue({
      familyIncomeAll: 14000,
      marketPriceAll: 2_000_000,
      landPriceAll: 400_000,
    });
    expect(r.bracket).toBe("mid");
    expect(r.housingPercent).toBe(50);
    expect(r.housingPayableAll).toBe(1_000_000);
    expect(r.landPayableAll).toBe(400_000);
    expect(r.totalPayableAll).toBe(1_400_000);
  });

  it("mid income (lower boundary 9000) -> 50% housing + 100% land", () => {
    const r = calculateEkbPrivatizationValue({
      familyIncomeAll: 9000,
      marketPriceAll: 1_000_000,
      landPriceAll: 200_000,
    });
    expect(r.bracket).toBe("mid");
    expect(r.housingPercent).toBe(50);
    expect(r.totalPayableAll).toBe(500_000 + 200_000);
  });

  it("low income -> 0% (no payment, 0% land)", () => {
    const r = calculateEkbPrivatizationValue({
      familyIncomeAll: 5000,
      marketPriceAll: 3_000_000,
      landPriceAll: 500_000,
    });
    expect(r.bracket).toBe("low");
    expect(r.housingPercent).toBe(0);
    expect(r.landPercent).toBe(0);
    expect(r.totalPayableAll).toBe(0);
  });

  it("rejects negative income", () => {
    expect(() =>
      calculateEkbPrivatizationValue({
        familyIncomeAll: -1,
        marketPriceAll: 1,
        landPriceAll: 1,
      }),
    ).toThrow();
  });
});

describe("seed fixtures", () => {
  it("ships at least 8 EKB and 5 expropriation dossiers", () => {
    const ekb = SEED_CORE_DOSSIERS.filter((d) => d.process === "ekb_privatization");
    const exp = SEED_CORE_DOSSIERS.filter((d) => d.process === "expropriation");
    expect(ekb.length).toBeGreaterThanOrEqual(8);
    expect(exp.length).toBeGreaterThanOrEqual(5);
    for (const d of SEED_CORE_DOSSIERS) {
      expect(d.trackingCode).toMatch(/^(EKB|EXP)-2026-\d{6}$/);
    }
  });
});
