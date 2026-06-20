import type { ProcessDefinition } from "../types";

export const expropriationProcess: ProcessDefinition = {
  kind: "expropriation",
  code: "EXP",
  title: "Shpronësimi për interes publik",
  description:
    "Procedura e shpronësimit me 6 faza, nga nisma me VKM deri te regjistrimi përfundimtar në ASHK.",
  legalBasis: [
    { reference: "Law 8561/1999", title: "Për shpronësimet për interes publik" },
    { reference: "Aktet nënligjore përkatëse" },
  ],
  phases: [
    {
      id: "exp-p1",
      order: 1,
      title: "Iniciimi",
      description: "Nismë nga ministria/bashkia dhe miratim me VKM.",
      institutions: ["Ministria", "Bashkia", "Këshilli i Ministrave"],
      steps: [
        {
          id: "exp-s1",
          order: 1,
          title: "Propozim dhe VKM",
          description: "Hartimi i propozimit dhe miratimi me Vendim të Këshillit të Ministrave.",
          institution: "Ministria",
          requiredDocuments: ["vkm_decision", "public_interest_justification"],
          slaDays: 60,
          manual: true,
        },
      ],
    },
    {
      id: "exp-p2",
      order: 2,
      title: "Identifikimi i pronës dhe pronarëve",
      description: "Identifikimi nëpërmjet ASHK dhe DPGJC. Mungon integrimi automatik.",
      institutions: ["ASHK", "DPGJC"],
      steps: [
        {
          id: "exp-s2",
          order: 1,
          title: "Kërkesat te ASHK dhe DPGJC",
          description: "Kërkesat dërgohen veçmas; pa integrim automatik me regjistrat.",
          institution: "ASHK",
          requiredDocuments: ["ownership_extract", "civil_status_extract"],
          slaDays: 30,
          manual: true,
          criticalPoints: [
            {
              id: "no-integration-ashk-dpgjc",
              label: "Pa integrim ASHK–DPGJC",
              description: "DPGJC dhe ASHK nuk janë të integruara automatikisht.",
              severity: "critical",
              tags: ["no-api", "manual-merge"],
              expectedDelayDays: 21,
            },
          ],
        },
      ],
    },
    {
      id: "exp-p3",
      order: 3,
      title: "Vleresimi me AI GIS",
      description:
        "Vleresimi nga ASHSh / komisioni i rivleresimit; konsultim AI me AKPT / e-Harta (vetem lexim).",
      institutions: ["ASHSh", "AKPT"],
      steps: [
        {
          id: "exp-s3",
          order: 1,
          title: "Vleresim nga ASHSh me sinjal AI GIS",
          description:
            "ASHSh ose komisioni i rivleresimit nxjerr vleren e kompensimit duke perdorur sinjalin GIS si evidence pune.",
          institution: "ASHSh",
          requiredDocuments: ["valuation_report"],
          slaDays: 30,
          manual: true,
          criticalPoints: [
            {
              id: "eharta-read-only",
              label: "AKPT / e-Harta vetëm lexim",
              description: "Nuk mund të shkruhen të dhëna automatikisht.",
              severity: "warning",
              tags: ["read-only", "no-api"],
            },
          ],
        },
      ],
    },
    {
      id: "exp-p4",
      order: 4,
      title: "Njoftimi dhe ankimi",
      description: "Njoftim me letër; afat ankimi 30 ditë.",
      institutions: ["Ministria", "Bashkia"],
      steps: [
        {
          id: "exp-s4",
          order: 1,
          title: "Njoftimi i pronarëve",
          description: "Njoftimet dërgohen vetëm me letër (paper-only).",
          institution: "Ministria",
          requiredDocuments: ["notification_letter"],
          slaDays: 15,
          manual: true,
          criticalPoints: [
            {
              id: "paper-only-notice",
              label: "Njoftim vetëm me letër",
              description: "Njoftim vetëm me letër; afat ankimi 30 ditë.",
              severity: "critical",
              tags: ["paper-only", "no-e-albania", "appeal-30d"],
            },
          ],
        },
        {
          id: "exp-s4b",
          order: 2,
          title: "Periudha e ankimit (30 ditë)",
          description: "Pronari ka 30 ditë afat ligjor për të bërë ankim.",
          institution: "Gjykata",
          slaDays: 30,
        },
      ],
    },
    {
      id: "exp-p5",
      order: 5,
      title: "Disbursimi",
      description:
        "Pagesa nga Ministria e Ekonomisë; tërheqja nga qytetari nëpërmjet ASHK / e-Albania shërbimi 9482. Pa integrim ASHK–Ministri.",
      institutions: ["Ministria e Ekonomisë", "ASHK"],
      steps: [
        {
          id: "exp-s5",
          order: 1,
          title: "Urdhri i pagesës dhe tërheqja",
          description:
            "Ministria e Ekonomisë urdhëron pagesën; qytetari aplikon te ASHK / e-Albania (9482).",
          institution: "Ministria e Ekonomisë",
          requiredDocuments: ["payment_order"],
          slaDays: 45,
          manual: true,
          criticalPoints: [
            {
              id: "no-ashk-ministry-integration",
              label: "Pa integrim ASHK–Ministria e Ekonomisë",
              description: "Pa integrim ASHK–Ministria e Ekonomisë për disbursim/regjistrim.",
              severity: "critical",
              tags: ["no-api", "disbursement"],
              expectedDelayDays: 14,
            },
          ],
        },
      ],
    },
    {
      id: "exp-p6",
      order: 6,
      title: "Dorëzimi fizik dhe regjistrimi përfundimtar",
      description: "Dorëzim fizik i pronës dhe regjistrim përfundimtar në ASHK.",
      institutions: ["ASHK"],
      steps: [
        {
          id: "exp-s6",
          order: 1,
          title: "Procesverbali i dorëzimit dhe regjistrimi",
          description:
            "Mbahet procesverbali i dorëzimit fizik dhe ASHK regjistron kalimin përfundimtar.",
          institution: "ASHK",
          requiredDocuments: ["handover_minutes"],
          slaDays: 30,
          manual: true,
        },
      ],
    },
  ],
};
