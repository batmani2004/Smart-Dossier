import { describe, expect, it } from "vitest";
import { SEED_CORE_DOSSIERS } from "../seed";

describe("demo dataset", () => {
  it("includes the EKB-2026-000014 demo dossier with the expected demo state", () => {
    const demo = SEED_CORE_DOSSIERS.find((d) => d.trackingCode === "EKB-2026-000014");
    expect(demo, "demo dossier EKB-2026-000014 must exist").toBeTruthy();
    if (!demo) return;
    expect(demo.process).toBe("ekb_privatization");
    expect(demo.parties[0]?.fullName).toBe("Arta Beqiri");
    expect(demo.status).toBe("blocked");
    expect(demo.missingDocumentTypes).toEqual(
      expect.arrayContaining(["family_certificate", "ashk_certificate"]),
    );
    // citizen-application step
    expect(demo.currentPhaseId).toBe("ekb-p3");
    expect(demo.currentStepId).toBe("ekb-s3");
  });
});
