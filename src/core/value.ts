// EKB privatization value calculation per VKM 179/2020 + VKM 898/2020 income rules.

export interface EkbValueInput {
  /** Monthly family income (sum) in ALL. */
  familyIncomeAll: number;
  /** Market price of the housing unit in ALL. */
  marketPriceAll: number;
  /** Land price in ALL. */
  landPriceAll: number;
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
