import type { Dossier, ProcessDefinition } from "@/core/types";
import { calculateEkbDetailedValuation, calculateEkbPrivatizationValue } from "@/core/value";
import type { DocSection, DocTemplateKey, GeneratedDoc } from "./types";

export const TEMPLATE_LABELS: Record<DocTemplateKey, string> = {
  ekb_missing_docs_notice: "EKB — Njoftim për dokumente që mungojnë",
  ekb_refusal_decision: "EKB — Vendim refuzimi me arsye",
  ekb_value_calculation: "EKB - Akt Vleresimi",
  ekb_citizen_invoice: "EKB - Fature qytetari / mandat pagese",
  ekb_contract_draft: "EKB — Draft kontrate privatizimi",
  exp_owner_notification: "Shpronësim — Njoftim pronari (afat 30 ditë)",
  exp_compensation_proposal: "Shpronësim — Propozim kompensimi / akt rivlerësimi",
};

export const TEMPLATES_FOR_PROCESS: Record<Dossier["process"], DocTemplateKey[]> = {
  ekb_privatization: [
    "ekb_missing_docs_notice",
    "ekb_refusal_decision",
    "ekb_value_calculation",
    "ekb_citizen_invoice",
    "ekb_contract_draft",
  ],
  expropriation: ["exp_owner_notification", "exp_compensation_proposal"],
  property_registration: [],
};

// ---------- helpers ----------

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function fmtAll(n: number | undefined): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "—";
  return `${new Intl.NumberFormat("sq-AL").format(Math.round(n))} ALL`;
}

function nextDocNumber(d: Dossier, suffix: string): string {
  // deterministic: dossier code + counter based on existing documents + suffix
  const idx = d.documents.length + 1;
  return `${d.trackingCode}/${suffix}-${String(idx).padStart(2, "0")}`;
}

function addDays(iso: string, days: number): string {
  const dt = new Date(iso);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString();
}

function propertyLines(d: Dossier): string[] {
  const p = d.property ?? {};
  const lines: string[] = [];
  if (p.description) lines.push(`Përshkrimi: ${p.description}`);
  if (p.zone) lines.push(`Zona/Bashkia: ${p.zone}`);
  if (p.areaSqm) lines.push(`Sipërfaqja: ${p.areaSqm} m²`);
  if (p.cadastralNo) lines.push(`Nr. kadastrale: ${p.cadastralNo}`);
  // (cadastral zone field not modeled separately on Dossier.property)
  if (lines.length === 0) lines.push("Përshkrim pasurie: i papërcaktuar.");
  return lines;
}

function institutionForPhase(d: Dossier, process: ProcessDefinition): string {
  const phase = process.phases.find((p) => p.id === d.currentPhaseId);
  return phase?.institutions[0] ?? process.title;
}

function legalBasis(process: ProcessDefinition): string[] {
  return process.legalBasis.map((l) => (l.title ? `${l.reference} — ${l.title}` : l.reference));
}

function addressee(d: Dossier): { name: string; address?: string } {
  const p = d.parties[0];
  return {
    name: p?.fullName ?? "Aplikantit",
    address: undefined,
  };
}

function commonHeader(
  d: Dossier,
  process: ProcessDefinition,
  template: DocTemplateKey,
  title: string,
  suffix: string,
): Pick<
  GeneratedDoc,
  | "template"
  | "title"
  | "number"
  | "date"
  | "institution"
  | "addressee"
  | "addresseeAddress"
  | "propertyLines"
  | "legalBasis"
> {
  const a = addressee(d);
  return {
    template,
    title,
    number: nextDocNumber(d, suffix),
    date: new Date().toISOString(),
    institution: institutionForPhase(d, process),
    addressee: a.name,
    addresseeAddress: a.address,
    propertyLines: propertyLines(d),
    legalBasis: legalBasis(process),
  };
}

const STANDARD_FOOTER =
  "Ky dokument është gjeneruar automatikisht nga Smart Dossier mbi bazën e të dhënave të dosjes. Faktet ligjore dhe procedurale janë deterministe.";

// ---------- 1. EKB missing docs notice ----------

function tplEkbMissingDocs(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const phase = process.phases.find((p) => p.id === d.currentPhaseId);
  const missing =
    d.missingDocumentTypes.length > 0
      ? d.missingDocumentTypes
      : (phase?.steps.find((s) => s.id === d.currentStepId)?.requiredDocuments ?? []);

  const sections: DocSection[] = [
    {
      heading: "Lënda",
      paragraphs: [
        `Plotësim i dokumentacionit për dosjen e privatizimit me kod ${d.trackingCode}.`,
      ],
    },
    {
      paragraphs: [
        `I/E nderuar ${addressee(d).name},`,
        `Pas shqyrtimit fillestar të dosjes Suaj në fazën "${phase?.title}", konstatojmë se dokumentet e mëposhtme mungojnë ose janë të paplota. Ju lutemi t'i dorëzoni brenda 15 (pesëmbëdhjetë) ditëve kalendarike nga marrja e këtij njoftimi, në zyrat e ${institutionForPhase(d, process)}.`,
      ],
    },
    {
      heading: "Dokumentet që mungojnë",
      paragraphs:
        missing.length > 0
          ? missing.map((m, i) => `${i + 1}. ${m}`)
          : ["Nuk ka dokumente të identifikuara si mungues në këtë moment."],
    },
    {
      paragraphs: [
        "Mosdorëzimi i dokumentacionit brenda afatit mund të sjellë pezullimin ose refuzimin e shqyrtimit të mëtejshëm të dosjes, sipas akteve ligjore në fuqi.",
      ],
    },
  ];

  return {
    ...commonHeader(
      d,
      process,
      "ekb_missing_docs_notice",
      "Njoftim për plotësim dokumentacioni",
      "N",
    ),
    sections,
    deadlineLine: `Afati i dorëzimit: 15 ditë kalendarike (deri më ${fmtDate(addDays(new Date().toISOString(), 15))}).`,
    signatures: [
      {
        role: "Përgjegjës i shqyrtimit",
        institution: institutionForPhase(d, process),
      },
    ],
    footer: STANDARD_FOOTER,
  };
}

// ---------- 2. EKB refusal decision ----------

function tplEkbRefusal(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const reasons: string[] = [];
  if (d.notes) reasons.push(d.notes);
  if (d.missingDocumentTypes.length > 0) {
    reasons.push(
      `Mungesa të dokumentacionit të detyrueshëm: ${d.missingDocumentTypes.join(", ")}.`,
    );
  }
  if (reasons.length === 0) {
    reasons.push(
      "Dokumentacioni i paraqitur nuk plotëson kushtet e parashikuara nga VKM 179/2020 dhe aktet plotësuese.",
    );
  }

  const sections: DocSection[] = [
    {
      heading: "Vendos",
      paragraphs: [
        `Refuzimin e aplikimit për privatizimin e banesës EKB të identifikuar me kodin ${d.trackingCode}, paraqitur nga ${addressee(d).name}.`,
      ],
    },
    {
      heading: "Arsyetimi",
      paragraphs: reasons,
    },
    {
      heading: "Mjetet e ankimit",
      paragraphs: [
        "Pala e interesuar ka të drejtë të ankimojë këtë vendim brenda 30 (tridhjetë) ditëve nga marrja e tij, pranë organit kompetent, sipas akteve ligjore në fuqi.",
      ],
    },
  ];

  return {
    ...commonHeader(d, process, "ekb_refusal_decision", "Vendim refuzimi", "V"),
    sections,
    deadlineLine: `Afati i ankimit: 30 ditë (deri më ${fmtDate(addDays(new Date().toISOString(), 30))}).`,
    signatures: [{ role: "Drejtor", institution: institutionForPhase(d, process) }],
    footer: STANDARD_FOOTER,
  };
}

// ---------- 3. EKB value calculation sheet ----------

function tplEkbValueCalc(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const p = d.property ?? {};
  const income = p.familyIncomeAll ?? 0;
  const market = p.marketPriceAll ?? 0;
  const land = p.landPriceAll ?? 0;

  const calc = (() => {
    try {
      return calculateEkbDetailedValuation({
        familyIncomeAll: income,
        marketPriceAll: market,
        landPriceAll: land,
        areaSqm: p.areaSqm,
      });
    } catch {
      return null;
    }
  })();

  const sections: DocSection[] = [
    {
      heading: "Të dhënat hyrëse",
      paragraphs: [
        `Të ardhura mujore familjare: ${fmtAll(income)}`,
        `Sipërfaqja e pasurisë: ${p.areaSqm ? `${p.areaSqm} m²` : "e papërcaktuar"}`,
        `Çmimi i tregut i banesës: ${fmtAll(market)}`,
        `Çmimi i truallit: ${fmtAll(land)}`,
      ],
    },
    {
      heading: "Baza ligjore dhe formula",
      paragraphs: [
        calc?.ruleApplied ?? "Të dhënat hyrëse janë të pamjaftueshme për të aplikuar rregullin.",
        "Formula e aktit: Vp = Vb + Vt - Vsh - Vg.",
        "Referenca: VKM 179/2020 per proceduren e privatizimit dhe VKM 898/2020 per vleresimin sipas normave te strehimit.",
      ],
    },
    ...(calc
      ? [
          {
            heading: "Hapat e llogaritjes",
            paragraphs: calc.steps.map(
              (step, index) =>
                `${index + 1}. ${step.title}: ${step.formula}. ${step.explanation} (${step.legalReference})`,
            ),
          },
        ]
      : []),
  ];

  return {
    ...commonHeader(
      d,
      process,
      "ekb_value_calculation",
      "Akt Vleresimi i vleres se privatizimit",
      "LL",
    ),
    sections,
    table: calc
      ? {
          heading: "Tabela e llogaritjes",
          columns: ["Zëri", "Bazë (ALL)", "Përqindje", "Pagueshme (ALL)"],
          rows: [
            [
              "Banesa",
              new Intl.NumberFormat("sq-AL").format(market),
              `${calc.housingPercent}%`,
              new Intl.NumberFormat("sq-AL").format(calc.housingPayableAll),
            ],
            [
              "Trualli",
              new Intl.NumberFormat("sq-AL").format(land),
              `${calc.landPercent}%`,
              new Intl.NumberFormat("sq-AL").format(calc.landPayableAll),
            ],
            [
              "Zbritje / pagesa te meparshme",
              "",
              "",
              `-${new Intl.NumberFormat("sq-AL").format(calc.previousPaymentsAll + calc.approvedDeductionsAll)}`,
            ],
            ["TOTAL", "", "", new Intl.NumberFormat("sq-AL").format(calc.finalValueAll)],
          ],
        }
      : undefined,
    signatures: [
      { role: "Specialist vlerësimi", institution: institutionForPhase(d, process) },
      { role: "Përgjegjës sektori", institution: institutionForPhase(d, process) },
    ],
    footer:
      "Akt Vleresimi i gjeneruar nga Smart Dossier. Llogaritja eshte deterministe dhe auditohet me kohe, operator dhe rezultat.",
  };
}

// ---------- 4. EKB citizen invoice ----------

function tplEkbCitizenInvoice(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const p = d.property ?? {};
  const income = p.familyIncomeAll ?? 0;
  const market = p.marketPriceAll ?? 0;
  const land = p.landPriceAll ?? 0;
  const total =
    d.finalValueAll ??
    (() => {
      try {
        return calculateEkbPrivatizationValue({
          familyIncomeAll: income,
          marketPriceAll: market,
          landPriceAll: land,
        }).totalPayableAll;
      } catch {
        return 0;
      }
    })();
  const due = addDays(new Date().toISOString(), 30);
  const reference = `${d.trackingCode}-FAT-${String(d.documents.length + 1).padStart(2, "0")}`;

  const sections: DocSection[] = [
    {
      heading: "Lënda",
      paragraphs: [`Gjenerim fature / mandat pagese për dosjen e privatizimit ${d.trackingCode}.`],
    },
    {
      heading: "Detyrimi për pagesë",
      paragraphs: [
        `I/E nderuar ${addressee(d).name}, në bazë të llogaritjes së vlerës së privatizimit, shuma për t'u paguar është ${fmtAll(total)}.`,
        "Kjo faturë shërben si dokument pune për pagesën para lidhjes së kontratës së privatizimit.",
      ],
    },
    {
      heading: "Afati dhe referenca",
      paragraphs: [
        `Afati i pagesës: 30 ditë kalendarike, deri më ${fmtDate(due)}.`,
        `Numri i referencës: ${reference}.`,
      ],
    },
  ];

  return {
    ...commonHeader(d, process, "ekb_citizen_invoice", "Faturë qytetari / mandat pagese", "FAT"),
    sections,
    table: {
      heading: "Përmbledhje pagese",
      columns: ["Zëri", "Vlera"],
      rows: [
        ["Kodi i dosjes", d.trackingCode],
        ["Aplikanti", addressee(d).name],
        ["Pasuria", p.description ?? "—"],
        ["Zona", p.zone ?? "—"],
        ["Shuma për pagesë", fmtAll(total)],
        ["Afati i pagesës", fmtDate(due)],
        ["Referenca", reference],
      ],
    },
    deadlineLine: `Afati i pagesës: 30 ditë kalendarike (deri më ${fmtDate(due)}).`,
    signatures: [
      { role: "Specialist finance", institution: "Financa EKB" },
      { role: "Përgjegjës dosjeje", institution: institutionForPhase(d, process) },
    ],
    footer:
      "Fatura është gjeneruar automatikisht nga Smart Dossier pas llogaritjes së vlerës. Gjenerimi regjistrohet në historikun e audituar të dosjes.",
  };
}

// ---------- 5. EKB contract draft ----------

function tplEkbContract(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const p = d.property ?? {};
  const total =
    d.finalValueAll ??
    (() => {
      try {
        return calculateEkbPrivatizationValue({
          familyIncomeAll: p.familyIncomeAll ?? 0,
          marketPriceAll: p.marketPriceAll ?? 0,
          landPriceAll: p.landPriceAll ?? 0,
        }).totalPayableAll;
      } catch {
        return undefined;
      }
    })();

  const sections: DocSection[] = [
    {
      heading: "Palët kontraktuese",
      paragraphs: [
        `1. ${institutionForPhase(d, process)} (më poshtë "Shitësi"), përfaqësuar nga Drejtori.`,
        `2. ${addressee(d).name}, me banim sipas dokumentit të identifikimit (më poshtë "Blerësi").`,
      ],
    },
    {
      heading: "Objekti i kontratës",
      paragraphs: [
        `Shitësi i kalon Blerësit në pronësi pasurinë e mëposhtme: ${p.description ?? "banesa EKB sipas dosjes"}${p.areaSqm ? `, me sipërfaqe ${p.areaSqm} m²` : ""}${p.cadastralNo ? `, nr. kadastrale ${p.cadastralNo}` : ""}.`,
      ],
    },
    {
      heading: "Çmimi dhe mënyra e pagesës",
      paragraphs: [
        `Çmimi total i privatizimit është ${fmtAll(total)}, i llogaritur sipas VKM 179/2020 dhe VKM 898/2020.`,
        "Pagesa kryhet sipas grafikut të dakordësuar mes palëve, me dëshmi bankare të arkëtimit.",
      ],
    },
    {
      heading: "Detyrimet e palëve",
      paragraphs: [
        "Shitësi garanton se pasuria është e regjistruar dhe e lirë nga barrë të paregjistruara.",
        "Blerësi merr përsipër regjistrimin përfundimtar të pronës pranë ASHK pas firmosjes.",
      ],
    },
    {
      heading: "Dispozita të fundit",
      paragraphs: [
        "Kontrata lidhet brenda afatit ligjor 2-vjeçar nga njoftimi i fituesit. Mosmarrëveshjet zgjidhen sipas legjislacionit shqiptar.",
      ],
    },
  ];

  return {
    ...commonHeader(d, process, "ekb_contract_draft", "DRAFT KONTRATË PRIVATIZIMI EKB", "K"),
    sections,
    signatures: [
      { role: "Për Shitësin", institution: institutionForPhase(d, process) },
      { role: "Blerësi", institution: addressee(d).name },
    ],
    footer:
      "Ky është një DRAFT i gjeneruar automatikisht. Kërkohet rishikim ligjor para firmosjes.",
  };
}

// ---------- 5. Expropriation owner notification ----------

function tplExpOwnerNotification(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const p = d.property ?? {};

  const sections: DocSection[] = [
    {
      heading: "Lënda",
      paragraphs: [
        `Njoftim mbi nismën e shpronësimit për interes publik të pasurisë me dosje ${d.trackingCode}.`,
      ],
    },
    {
      paragraphs: [
        `I/E nderuar ${addressee(d).name},`,
        `Ju njoftojmë se, sipas Ligjit 8561/1999 "Për shpronësimet për interes publik" dhe akteve nënligjore përkatëse, ka nisur procedura e shpronësimit për pasurinë në pronësinë Tuaj të përshkruar më poshtë.`,
      ],
    },
    {
      heading: "Pasuria objekt shpronësimi",
      paragraphs: propertyLines(d),
    },
    {
      heading: "Vlera e propozuar e kompensimit",
      paragraphs: [
        `Vlera e propozuar e kompensimit: ${fmtAll(p.marketPriceAll)}.`,
        "Vlera është përcaktuar nga Agjencia Shtetërore për Shpronësimet / komisioni i rivlerësimit, sipas metodologjisë ligjore.",
      ],
    },
    {
      heading: "E drejta e ankimit",
      paragraphs: [
        "Ju keni të drejtë të paraqisni ankim ndaj këtij njoftimi brenda 30 (tridhjetë) ditëve kalendarike nga data e marrjes së tij, pranë organit kompetent dhe/ose Gjykatës Administrative.",
      ],
    },
  ];

  return {
    ...commonHeader(d, process, "exp_owner_notification", "Njoftim pronari për shpronësim", "NJ"),
    sections,
    deadlineLine: `Afati i ankimit: 30 ditë kalendarike nga marrja e njoftimit (deri më ${fmtDate(addDays(new Date().toISOString(), 30))}).`,
    signatures: [
      { role: "Titullar i organit shpronësues", institution: institutionForPhase(d, process) },
    ],
    footer: STANDARD_FOOTER,
  };
}

// ---------- 6. Expropriation compensation proposal / revaluation summary ----------

function tplExpCompensationProposal(d: Dossier, process: ProcessDefinition): GeneratedDoc {
  const p = d.property ?? {};

  const sections: DocSection[] = [
    {
      heading: "Objekti",
      paragraphs: [
        `Përmbledhje e propozimit të kompensimit / aktit të rivlerësimit për dosjen ${d.trackingCode}.`,
      ],
    },
    {
      heading: "Pasuria",
      paragraphs: propertyLines(d),
    },
    {
      heading: "Pronari",
      paragraphs: [`${addressee(d).name}.`],
    },
    {
      heading: "Metodologjia e vlerësimit",
      paragraphs: [
        "Vlerësimi është kryer mbi bazën e të dhënave të ASHK, zonës kadastrale dhe çmimeve referuese të tregut, sipas akteve nënligjore në fuqi.",
        "Jane konsultuar e-Harta / AKPT (vetem lexim) dhe sinjali AI GIS per konfirmimin e te dhenave hapesinore.",
      ],
    },
  ];

  return {
    ...commonHeader(
      d,
      process,
      "exp_compensation_proposal",
      "Propozim kompensimi / Akt rivlerësimi (përmbledhje)",
      "PK",
    ),
    sections,
    table: {
      heading: "Përmbledhje financiare",
      columns: ["Zëri", "Vlera (ALL)"],
      rows: [
        ["Vlera e pasurisë (treg)", new Intl.NumberFormat("sq-AL").format(p.marketPriceAll ?? 0)],
        ["Vlera e truallit", new Intl.NumberFormat("sq-AL").format(p.landPriceAll ?? 0)],
        [
          "TOTAL i propozuar",
          new Intl.NumberFormat("sq-AL").format((p.marketPriceAll ?? 0) + (p.landPriceAll ?? 0)),
        ],
      ],
    },
    signatures: [
      { role: "Vlerësues", institution: institutionForPhase(d, process) },
      { role: "Kryetar i komisionit", institution: institutionForPhase(d, process) },
    ],
    footer: STANDARD_FOOTER,
  };
}

// ---------- registry ----------

const REGISTRY: Record<DocTemplateKey, (d: Dossier, p: ProcessDefinition) => GeneratedDoc> = {
  ekb_missing_docs_notice: tplEkbMissingDocs,
  ekb_refusal_decision: tplEkbRefusal,
  ekb_value_calculation: tplEkbValueCalc,
  ekb_citizen_invoice: tplEkbCitizenInvoice,
  ekb_contract_draft: tplEkbContract,
  exp_owner_notification: tplExpOwnerNotification,
  exp_compensation_proposal: tplExpCompensationProposal,
};

export function buildDocument(
  template: DocTemplateKey,
  d: Dossier,
  process: ProcessDefinition,
): GeneratedDoc {
  return REGISTRY[template](d, process);
}
