//#region node_modules/.nitro/vite/services/ssr/assets/value-C0fg0E9w.js
/**
* Income brackets (monthly family income in ALL):
*  - > 14,000  => 100% housing, 100% land
*  - 9,000..14,000 inclusive => 50% housing, 100% land
*  - < 9,000   => 0% housing (no payment), 0% land
*/
function calculateEkbPrivatizationValue(input) {
	const { familyIncomeAll, marketPriceAll, landPriceAll } = input;
	if (!Number.isFinite(familyIncomeAll) || familyIncomeAll < 0) throw new Error("familyIncomeAll must be a non-negative number");
	if (marketPriceAll < 0 || landPriceAll < 0) throw new Error("prices must be non-negative");
	let bracket;
	let housingPercent;
	let landPercent;
	let ruleApplied;
	if (familyIncomeAll > 14e3) {
		bracket = "high";
		housingPercent = 100;
		landPercent = 100;
		ruleApplied = "income > 14000 ALL → 100% housing + 100% land";
	} else if (familyIncomeAll >= 9e3) {
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
	const housingPayableAll = Math.round(marketPriceAll * housingPercent / 100);
	const landPayableAll = Math.round(landPriceAll * landPercent / 100);
	return {
		bracket,
		housingPercent,
		landPercent,
		housingPayableAll,
		landPayableAll,
		totalPayableAll: housingPayableAll + landPayableAll,
		ruleApplied
	};
}
function calculateEkbDetailedValuation(input) {
	const previousPaymentsAll = input.previousPaymentsAll ?? 0;
	const approvedDeductionsAll = input.approvedDeductionsAll ?? 0;
	if (previousPaymentsAll < 0 || approvedDeductionsAll < 0) throw new Error("deductions must be non-negative");
	const base = calculateEkbPrivatizationValue(input);
	const grossValueAll = base.housingPayableAll + base.landPayableAll;
	const finalValueAll = Math.max(0, grossValueAll - previousPaymentsAll - approvedDeductionsAll);
	const legalReferences = ["VKM nr. 179, date 26.02.2020 - rregullat, kushtet dhe procedurat e privatizimit te banesave.", "VKM nr. 898, date 18.11.2020 - privatizimi sipas normave te strehimit dhe formula Vp = Vb + Vt - Vsh - Vg."];
	return {
		...base,
		input: {
			familyIncomeAll: input.familyIncomeAll,
			marketPriceAll: input.marketPriceAll,
			landPriceAll: input.landPriceAll,
			areaSqm: input.areaSqm,
			previousPaymentsAll,
			approvedDeductionsAll
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
				explanation: `Te ardhura mujore ${input.familyIncomeAll} ALL; siperfaqe ${input.areaSqm ?? 0} m2; cmim tregu ${input.marketPriceAll} ALL; truall ${input.landPriceAll} ALL.`
			},
			{
				id: "income-bracket",
				title: "Percaktimi i fashes se te ardhurave",
				legalReference: "VKM 179/2020 + VKM 898/2020 - skema sipas te ardhurave familjare",
				formula: base.ruleApplied,
				explanation: `Fasha e aplikuar: ${base.bracket}. Banesa paguhet ${base.housingPercent}%, trualli ${base.landPercent}%.`
			},
			{
				id: "housing",
				title: "Vlera e njesise se banimit",
				legalReference: "VKM 898/2020 - Vb, sipas normave te strehimit",
				formula: `Vb = ${input.marketPriceAll} x ${base.housingPercent}%`,
				resultAll: base.housingPayableAll,
				explanation: `Vlera e baneses per pagese eshte ${base.housingPayableAll} ALL.`
			},
			{
				id: "land",
				title: "Vlera e truallit",
				legalReference: "VKM 898/2020 - Vt",
				formula: `Vt = ${input.landPriceAll} x ${base.landPercent}%`,
				resultAll: base.landPayableAll,
				explanation: `Vlera e truallit per pagese eshte ${base.landPayableAll} ALL.`
			},
			{
				id: "formula",
				title: "Formula perfundimtare",
				legalReference: "VKM 898/2020 - formula Vp = Vb + Vt - Vsh - Vg",
				formula: `${base.housingPayableAll} + ${base.landPayableAll} - ${previousPaymentsAll} - ${approvedDeductionsAll}`,
				resultAll: finalValueAll,
				explanation: `Vlera perfundimtare e privatizimit eshte ${finalValueAll} ALL.`
			}
		]
	};
}
//#endregion
export { calculateEkbPrivatizationValue as n, calculateEkbDetailedValuation as t };
