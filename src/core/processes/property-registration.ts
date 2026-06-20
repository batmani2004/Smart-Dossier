import type { CriticalPoint, ProcessDefinition } from "../types";

const BUSINESS_DOCUMENT_RISK: CriticalPoint = {
  id: "business-documents",
  label: "Dokumentacion biznesi",
  description:
    "Operatori duhet te verifikoje NIPT-in, tagrin e perfaqesimit dhe dokumentet e origjines se prones.",
  severity: "warning",
  tags: ["business", "nipt", "documents"],
};

export const propertyRegistrationProcess: ProcessDefinition = {
  kind: "property_registration",
  code: "BIZ",
  title: "Regjistrim prone per biznes",
  description:
    "Aplikim nga subjekt biznesi i identifikuar me NIPT per regjistrimin ose perditesimin e nje prone ne kadaster.",
  legalBasis: [
    { reference: "Ligj 111/2018", title: "Per kadastren" },
    { reference: "Ligj 9723/2007", title: "Per Qendren Kombetare te Biznesit" },
    { reference: "VKM per sherbimet kadastrale", title: "Tarifa dhe dokumentacioni shoqerues" },
  ],
  phases: [
    {
      id: "biz-p1",
      order: 1,
      title: "Aplikimi i biznesit",
      description:
        "Subjekti regjistrohet me NIPT, identifikon perfaqesuesin dhe ngarkon dokumentacionin baze.",
      institutions: ["Portali Smart Dossier", "QKB", "ASHK"],
      steps: [
        {
          id: "biz-s1",
          order: 1,
          title: "Regjistrimi elektronik i kerkeses",
          description:
            "Verifikohet NIPT-i, subjekti, perfaqesuesi ligjor dhe pranohen dokumentet e para.",
          institution: "Portali Smart Dossier",
          requiredDocuments: [
            "business_nipt_extract",
            "legal_representative_id",
            "property_registration_request",
            "ownership_origin_document",
            "property_plan",
          ],
          slaDays: 2,
          criticalPoints: [BUSINESS_DOCUMENT_RISK],
        },
      ],
    },
    {
      id: "biz-p2",
      order: 2,
      title: "Shqyrtimi nga operatori",
      description:
        "Operatori i kadastres kontrollon saktesine e dokumenteve dhe kerkon plotesime nese mungon dicka.",
      institutions: ["ASHK"],
      steps: [
        {
          id: "biz-s2",
          order: 1,
          title: "Verifikimi i dokumentacionit",
          description:
            "Kontrollohen aktet e pronesise, plani i rilevimit, autorizimi dhe perputhja me subjektin NIPT.",
          institution: "Operator kadastre",
          requiredDocuments: [
            "ownership_origin_document",
            "property_plan",
            "legal_representative_id",
          ],
          slaDays: 7,
          criticalPoints: [BUSINESS_DOCUMENT_RISK],
        },
      ],
    },
    {
      id: "biz-p3",
      order: 3,
      title: "Kontroll kadastral dhe AI GIS",
      description:
        "Kryhet kontrolli i parceles, mbivendosjeve, kufijve dhe te dhenave ne harte me sinjalizim AI.",
      institutions: ["ASHK", "ASIG"],
      steps: [
        {
          id: "biz-s3",
          order: 1,
          title: "Kontroll AI i prones dhe zones kadastrale",
          description:
            "Operatori verifikon koordinatat, planin dhe perputhjen me regjistrin kadastral duke perdorur sinjalin AI GIS.",
          institution: "ASHK",
          requiredDocuments: ["property_plan", "cadastral_map_extract"],
          slaDays: 10,
          criticalPoints: [
            {
              id: "gis-overlap-risk",
              label: "Rrezik mbivendosjeje",
              description:
                "Duhet kontrolluar nese parcela ka mbivendosje ose mospërputhje me hartat ekzistuese.",
              severity: "warning",
              tags: ["gis", "overlap", "ashk"],
            },
          ],
        },
      ],
    },
    {
      id: "biz-p4",
      order: 4,
      title: "Vendimi dhe regjistrimi",
      description:
        "Pas miratimit, operatori finalizon regjistrimin dhe gjeneron dokumentin e vulosur elektronikisht.",
      institutions: ["ASHK"],
      steps: [
        {
          id: "biz-s4",
          order: 1,
          title: "Miratim ose refuzim i arsyetuar",
          description:
            "Merret vendimi administrativ dhe njoftohet biznesi me dokumentin perfundimtar.",
          institution: "ASHK",
          requiredDocuments: ["operator_review_report"],
          slaDays: 5,
        },
      ],
    },
  ],
};
