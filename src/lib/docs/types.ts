// Generated document — neutral structure, rendered to HTML for preview and DOCX for download.

export type DocTemplateKey =
  | "ekb_missing_docs_notice"
  | "ekb_refusal_decision"
  | "ekb_value_calculation"
  | "ekb_citizen_invoice"
  | "ekb_contract_draft"
  | "exp_owner_notification"
  | "exp_compensation_proposal";

export interface DocSection {
  heading?: string;
  /** Paragraphs of body text. Newlines inside a string become line breaks. */
  paragraphs: string[];
}

export interface DocTable {
  heading?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface SignatureBlock {
  role: string;
  name?: string;
  institution: string;
}

export interface GeneratedDoc {
  template: DocTemplateKey;
  title: string;
  /** Document register number e.g. "EKB-2026-000123/N-04" */
  number: string;
  /** ISO date string */
  date: string;
  institution: string;
  /** Citizen / owner name. */
  addressee: string;
  /** Optional address line for the addressee. */
  addresseeAddress?: string;
  /** Property block lines (e.g. "Zona: Tirana", "Sipërfaqja: 62 m²"). */
  propertyLines: string[];
  /** Legal basis bullet list (e.g. "VKM 179/2020"). */
  legalBasis: string[];
  /** Body of the document, in order. */
  sections: DocSection[];
  /** Optional structured table (used by value-calculation sheet). */
  table?: DocTable;
  /** Optional deadline line, e.g. "Afat ankimi: 30 ditë nga marrja e këtij njoftimi (deri më 12.08.2026)." */
  deadlineLine?: string;
  /** One or two signature blocks. */
  signatures: SignatureBlock[];
  /** Short footer note (e.g. "Ky dokument është gjeneruar automatikisht …"). */
  footer?: string;
}
