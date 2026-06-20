// EKB privatization value calculation per VKM 179/2020 + VKM 898/2020 income rules.

export interface EkbValueInput {
  /** Monthly family income (sum) in ALL. */
  familyIncomeAll: number;
  /** Market price of the housing unit in ALL. */
  marketPriceAll: number;
  /** Land price in ALL. */
  landPriceAll: number;
  /** Optional property area, shown in the valuation act for traceability. */
  areaSqm?: number;
  /** Amounts already paid by the citizen for provisional contracts, if known. */
  previousPaymentsAll?: number;
  /** Deductions/approved reductions, if known. */
  approvedDeductionsAll?: number;
}

export type EkbIncomeBracket = "high" | "mid" | "low";

export interface EkbValueResult {
  bracket: EkbIncomeBracket;
  /** Percentage of the housing price the citizen must pay (0, 50, or 100). */
  housingPercent: 0 | 50 | 100;
  /** Percentage of the land price the citizen must pay (0 or 100). */
  landPercent: 0 | 100;
  housingPayableAll: number;
  landPayableAll: number;
  totalPayableAll: number;
  /** Human-readable rule reference. */
  ruleApplied: string;
}

export interface EkbValueStep {
  id: string;
  title: string;
  legalReference: string;
  formula: string;
  resultAll?: number;
  explanation: string;
}

export interface EkbDetailedValueResult extends EkbValueResult {
  input: Required<
    Pick<
      EkbValueInput,
      | "familyIncomeAll"
      | "marketPriceAll"
      | "landPriceAll"
      | "previousPaymentsAll"
      | "approvedDeductionsAll"
    >
  > & { areaSqm?: number };
  grossValueAll: number;
  previousPaymentsAll: number;
  approvedDeductionsAll: number;
  finalValueAll: number;
  legalReferences: string[];
  formula: "Vp = Vb + Vt - Vsh - Vg";
  steps: EkbValueStep[];
}

/**
 * Income brackets (monthly family income in ALL):
 *  - > 14,000  => 100% housing, 100% land
 *  - 9,000..14,000 inclusive => 50% housing, 100% land
 *  - < 9,000   => 0% housing (no payment), 0% land
 */
export function calculateEkbPrivatizationValue(input: EkbValueInput): EkbValueResult {
  const { familyIncomeAll, marketPriceAll, landPriceAll } = input;

  if (!Number.isFinite(familyIncomeAll) || familyIncomeAll < 0) {
    throw new Error("familyIncomeAll must be a non-negative number");
  }
  if (marketPriceAll < 0 || landPriceAll < 0) {
    throw new Error("prices must be non-negative");
  }

  let bracket: EkbIncomeBracket;
  let housingPercent: 0 | 50 | 100;
  let landPercent: 0 | 100;
  let ruleApplied: string;

  if (familyIncomeAll > 14000) {
    bracket = "high";
    housingPercent = 100;
    landPercent = 100;
    ruleApplied = "income > 14000 ALL → 100% housing + 100% land";
  } else if (familyIncomeAll >= 9000) {
    bracket = "mid";
    housingPercent = 50;
    landPercent = 100;
    ruleApplied = "income 9000..14000 ALL → 50% housing + 100% land";
  } else {
    bracket = "low";
    housingPercent = 0;
    landPercent = 0;
    ruleApplied = "income < 9000 ALL → 0% (no payment, 0% land)";
  }

  const housingPayableAll = Math.round((marketPriceAll * housingPercent) / 100);
  const landPayableAll = Math.round((landPriceAll * landPercent) / 100);

  return {
    bracket,
    housingPercent,
    landPercent,
    housingPayableAll,
    landPayableAll,
    totalPayableAll: housingPayableAll + landPayableAll,
    ruleApplied,
  };
}

export function calculateEkbDetailedValuation(input: EkbValueInput): EkbDetailedValueResult {
  const previousPaymentsAll = input.previousPaymentsAll ?? 0;
  const approvedDeductionsAll = input.approvedDeductionsAll ?? 0;

  if (previousPaymentsAll < 0 || approvedDeductionsAll < 0) {
    throw new Error("deductions must be non-negative");
  }

  const base = calculateEkbPrivatizationValue(input);
  const grossValueAll = base.housingPayableAll + base.landPayableAll;
  const finalValueAll = Math.max(0, grossValueAll - previousPaymentsAll - approvedDeductionsAll);

  const legalReferences = [
    "VKM nr. 179, date 26.02.2020 - rregullat, kushtet dhe procedurat e privatizimit te banesave.",
    "VKM nr. 898, date 18.11.2020 - privatizimi sipas normave te strehimit dhe formula Vp = Vb + Vt - Vsh - Vg.",
  ];

  return {
    ...base,
    input: {
      familyIncomeAll: input.familyIncomeAll,
      marketPriceAll: input.marketPriceAll,
      landPriceAll: input.landPriceAll,
      areaSqm: input.areaSqm,
      previousPaymentsAll,
      approvedDeductionsAll,
    },
    grossValueAll,
    previousPaymentsAll,
    approvedDeductionsAll,
    finalValueAll,
    legalReferences,
    formula: "Vp = Vb + Vt - Vsh - Vg",
    steps: [
      {
        id: "input",
        title: "Te dhenat e nxjerra nga dokumentet",
        legalReference: "VKM 179/2020 - verifikimi i perfituesit dhe dokumentacionit",
        formula: "Te ardhura, siperfaqe, cmim tregu dhe vlere trualli",
        explanation: `Te ardhura mujore ${input.familyIncomeAll} ALL; siperfaqe ${input.areaSqm ?? 0} m2; cmim tregu ${input.marketPriceAll} ALL; truall ${input.landPriceAll} ALL.`,
      },
      {
        id: "income-bracket",
        title: "Percaktimi i fashes se te ardhurave",
        legalReference: "VKM 179/2020 + VKM 898/2020 - skema sipas te ardhurave familjare",
        formula: base.ruleApplied,
        explanation: `Fasha e aplikuar: ${base.bracket}. Banesa paguhet ${base.housingPercent}%, trualli ${base.landPercent}%.`,
      },
      {
        id: "housing",
        title: "Vlera e njesise se banimit",
        legalReference: "VKM 898/2020 - Vb, sipas normave te strehimit",
        formula: `Vb = ${input.marketPriceAll} x ${base.housingPercent}%`,
        resultAll: base.housingPayableAll,
        explanation: `Vlera e baneses per pagese eshte ${base.housingPayableAll} ALL.`,
      },
      {
        id: "land",
        title: "Vlera e truallit",
        legalReference: "VKM 898/2020 - Vt",
        formula: `Vt = ${input.landPriceAll} x ${base.landPercent}%`,
        resultAll: base.landPayableAll,
        explanation: `Vlera e truallit per pagese eshte ${base.landPayableAll} ALL.`,
      },
      {
        id: "formula",
        title: "Formula perfundimtare",
        legalReference: "VKM 898/2020 - formula Vp = Vb + Vt - Vsh - Vg",
        formula: `${base.housingPayableAll} + ${base.landPayableAll} - ${previousPaymentsAll} - ${approvedDeductionsAll}`,
        resultAll: finalValueAll,
        explanation: `Vlera perfundimtare e privatizimit eshte ${finalValueAll} ALL.`,
      },
    ],
  };
}
