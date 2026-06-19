// Shared Albanian labels mirrored from the web app's src/lib/api/dossiers.functions.ts.
// Keep these in sync when web labels change.

export const STATUS_LABEL_SQ: Record<string, string> = {
  draft: "Draft",
  in_progress: "Në proces",
  blocked: "Bllokuar",
  awaiting_external: "Pret institucion",
  completed: "Përfunduar",
  rejected: "Refuzuar",
};

export const PROCESS_LABEL_SQ: Record<string, string> = {
  ekb_privatization: "Privatizim EKB",
  expropriation: "Shpronësim",
};

export const DEADLINE_STATE_SQ: Record<string, string> = {
  ok: "Në kohë",
  due_soon: "Afër afatit",
  overdue: "Vonesë",
  none: "Pa afat",
};

export const DOC_TYPE_LABEL_SQ: Record<string, string> = {
  family_certificate: "Certifikatë familjare",
  ashk_certificate: "Certifikatë pronësie (ASHK)",
  ashk_certificate_final: "Certifikatë përfundimtare ASHK",
  income_proof: "Vërtetim të ardhurash",
  id_card_copy: "Kopje e kartës së identitetit",
  signed_contract: "Kontratë e nënshkruar",
  vkm_decision: "Vendim VKM",
  valuation_report: "Raport vlerësimi",
  public_interest_justification: "Justifikim interesi publik",
  appeal_form: "Formular ankimi",
  payment_receipt: "Mandat pagese",
};

export function docLabel(type: string): string {
  return (
    DOC_TYPE_LABEL_SQ[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
