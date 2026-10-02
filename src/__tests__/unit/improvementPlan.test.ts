import { grossToNet } from "@/src/engine/grossToNet";
import { calculateAnnualSettlement } from "@/src/engine/annualSettlement";
import { calculateHkd } from "@/src/engine/otherIncome/hkd";
import { calculateRent } from "@/src/engine/otherIncome/rent";
import { getRuleset } from "@/src/engine/rulesetLoader";
import { validateRuleset } from "@/src/engine/rulesetValidate";
import { netToGrossWithPreset } from "@/src/engine/insuranceBase";
import { summarizeMultiSource } from "@/src/engine/multiSourceAnnual";
import { mapSalaryLine, mapRentLine } from "@/src/engine/multiSourceMappers";
import {
  parseCalculatorInputs,
  parseSettlementInputs,
  parseMultiSourceInputs,
} from "@/src/store/scenarios";

const monthly = {
  gross: 30_000_000,
  region: "I" as const,
  taxYear: 2026,
  asOfDate: "2026-07-15",
  numDependents: 0,
};
const annual = {
  taxYear: 2026,
  region: "I" as const,
  numDependents: 0,
  monthlyGross: 30_000_000,
  monthsWorked: 12,
  salaryWithheld: 0,
};
const hkd = { taxYear: 2026, industryId: "distribution" as const };

describe("October business improvement acceptance", () => {
  it("zero deductions preserve existing salary and settlement fixtures", () => {
    const zero = grossToNet({
      ...monthly,
      mealAllowance: 0,
      exemptAllowances: 0,
      voluntaryInsurance: 0,
    });
    expect(zero).toEqual(grossToNet(monthly));
    expect(
      calculateAnnualSettlement({
        ...annual,
        medicalExpenses: 0,
        educationExpenses: 0,
      }).primary.breakdown.annualTax,
    ).toBe(calculateAnnualSettlement(annual).primary.breakdown.annualTax);
  });
  it("clamps monthly insurance and meal; new meal limit starts in July only", () => {
    const r = grossToNet({
      ...monthly,
      mealAllowance: 2_000_000,
      voluntaryInsurance: 5_000_000,
      exemptAllowances: 500_000,
    });
    expect(r.deductions).toEqual({
      mealExempt: 1_200_000,
      voluntaryInsurance: 3_000_000,
      exemptAllowances: 500_000,
    });
    expect(r.pit.taxableIncome).toBe(6_650_000);
    expect(r.net).toBe(26_517_500);
    expect(
      grossToNet({
        ...monthly,
        asOfDate: "2026-06-15",
        mealAllowance: 2_000_000,
      }).deductions?.mealExempt,
    ).toBe(0);
    expect(
      grossToNet({
        ...monthly,
        taxYear: 2025,
        asOfDate: "2025-07-15",
        mealAllowance: 2_000_000,
        voluntaryInsurance: 5_000_000,
      }).deductions?.voluntaryInsurance,
    ).toBe(0);
  });
  it.each([
    { mode: "full" as const },
    { mode: "percent" as const, percent: 60 },
    { mode: "absolute" as const, absoluteAmount: 10_000_000 },
  ])("inverse solver retains deductions for %j", (preset) => {
    const result = netToGrossWithPreset({
      ...monthly,
      net: 27_000_000,
      preset,
      mealAllowance: 1_200_000,
      voluntaryInsurance: 3_000_000,
      exemptAllowances: 6_000_000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Math.abs(result.breakdown.net - 27_000_000)).toBeLessThanOrEqual(
        1,
      );
      expect(result.breakdown.deductions?.voluntaryInsurance).toBe(3_000_000);
    }
  });
  it("annual medical/education caps, donation, monthly insurance and dependent period compose once", () => {
    const r = calculateAnnualSettlement({
      ...annual,
      numDependents: 1,
      dependentPeriods: [{ startMonth: 7, endMonth: 12 }],
      medicalExpenses: 30_000_000,
      educationExpenses: 30_000_000,
      voluntaryInsuranceMonthly: 5_000_000,
      voluntaryInsuranceMonths: 6,
      charitableContributions: 1_000_000,
    }).primary.breakdown;
    expect(r.dependentReliefYear).toBe(37_200_000);
    expect(r.additionalReliefYear).toEqual({
      medical: 23_000_000,
      education: 24_000_000,
      voluntaryInsurance: 18_000_000,
      charity: 1_000_000,
    });
    expect(r.taxableIncomeAfterRelief).toBe(33_000_000);
    expect(r.annualTax).toBe(1_650_000);
  });
  it("2025 ignores new capped deductions; dependent periods still apply", () => {
    const old = { ...annual, taxYear: 2025 };
    expect(
      calculateAnnualSettlement({
        ...old,
        medicalExpenses: 30_000_000,
        educationExpenses: 30_000_000,
        voluntaryInsuranceMonthly: 5_000_000,
      }).primary.breakdown.annualTax,
    ).toBe(calculateAnnualSettlement(old).primary.breakdown.annualTax);
  });
  it("annual cash meals are limited to eligible months, not the whole year", () => {
    const r = calculateAnnualSettlement({
      ...annual,
      mealAllowanceMonthly: 2_000_000,
      mealAllowanceMonths: 6,
    }).primary.breakdown;
    expect(r.exemptIncomeYear).toBe(7_200_000);
    expect(r.taxableIncomeYear).toBe(315_000_000);
    expect(() =>
      calculateAnnualSettlement({ ...annual, mealAllowanceMonths: 7 }),
    ).toThrow();
  });
  it("reduces PIT only for 2026 and 2027 qualifying business revenue", () => {
    for (const taxYear of [2026, 2027]) {
      const r = calculateHkd({ ...hkd, taxYear, annualRevenue: 1_500_000_000 });
      expect(r.pitBeforeReduction).toBe(2_500_000);
      expect(r.pitReduction).toBe(750_000);
      expect(r.pit).toBe(1_750_000);
      expect(r.vat).toBe(15_000_000);
    }
    expect(
      calculateHkd({ ...hkd, annualRevenue: 1_000_000_000 }).pitReduction,
    ).toBe(0);
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 10_000_000_000,
        costs: 9_000_000_000,
      }).pit,
    ).toBe(119_000_000);
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 10_000_000_001,
        costs: 9_000_000_001,
      }).pitReduction,
    ).toBe(0);
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 1_500_000_000,
        totalBusinessRevenue: 11_000_000_000,
        costs: 1_000_000_000,
      }).pitReduction,
    ).toBe(0);
  });
  it("income method is mandatory above 3bn with costs, rates 17 and 20 percent", () => {
    expect(() =>
      calculateHkd({ ...hkd, annualRevenue: 4_000_000_000 }),
    ).toThrow("chi phí");
    const r = calculateHkd({
      ...hkd,
      annualRevenue: 4_000_000_000,
      costs: 3_000_000_000,
    });
    expect(r.method).toBe("income");
    expect(r.pitBeforeReduction).toBe(170_000_000);
    expect(r.pit).toBe(119_000_000);
    expect(r.incomeMethodHint).toBeUndefined();
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 50_000_000_000,
        costs: 49_000_000_000,
      }).pit,
    ).toBe(170_000_000);
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 50_000_000_001,
        costs: 49_000_000_001,
      }).pit,
    ).toBe(200_000_000);
    expect(
      calculateHkd({
        ...hkd,
        annualRevenue: 4_000_000_000,
        costs: 5_000_000_000,
      }).pit,
    ).toBe(0);
  });
  it("rent is business income eligible for NQ43, VAT unchanged; 2025 uses full revenue", () => {
    const r = calculateRent({ taxYear: 2026, annualRevenue: 1_500_000_000 });
    expect(r.pitBeforeReduction).toBe(25_000_000);
    expect(r.pit).toBe(17_500_000);
    expect(r.vat).toBe(75_000_000);
    expect(
      calculateRent({
        taxYear: 2026,
        annualRevenue: 1_500_000_000,
        totalBusinessRevenue: 11_000_000_000,
      }).pit,
    ).toBe(25_000_000);
    expect(
      calculateRent({ taxYear: 2025, annualRevenue: 100_000_000 }).totalTax,
    ).toBe(0);
    expect(
      calculateRent({ taxYear: 2025, annualRevenue: 240_000_000 }).totalTax,
    ).toBe(24_000_000);
    const old = calculateHkd({
      ...hkd,
      taxYear: 2025,
      annualRevenue: 1_500_000_000,
    });
    expect(old.pit).toBe(7_500_000);
    expect(old.pitReduction).toBe(0);
  });
  it("consolidated salary relief is applied once; independent rent tax is unchanged", () => {
    const lines = [
      mapSalaryLine({
        taxYear: 2026,
        revenueOrIncome: 200_000_000,
        estimatedPit: 10_000_000,
      }),
      mapSalaryLine({
        taxYear: 2026,
        revenueOrIncome: 122_200_000,
        estimatedPit: 5_000_000,
      }),
      mapRentLine({ taxYear: 2026, annualRevenue: 1_500_000_000 }),
    ];
    const r = summarizeMultiSource({
      lines,
      taxYear: 2026,
      salaryRelief: {
        numDependents: 0,
        medicalExpenses: 30_000_000,
        educationExpenses: 30_000_000,
      },
    });
    expect(r.salaryReliefApplied).toBe(47_000_000);
    expect(r.salaryAnnualTax).toBe(4_460_000);
    expect(r.estimatedTax).toBe(96_960_000);
    expect(
      summarizeMultiSource({
        lines: lines.map((l) => ({ ...l, excluded: l.kind === "salary" })),
        taxYear: 2026,
        salaryRelief: { numDependents: 0, medicalExpenses: 30_000_000 },
      }).salaryAnnualTax,
    ).toBe(0);
  });
  it("rejects invalid inputs and unsafe remote parameters", () => {
    expect(() => grossToNet({ ...monthly, voluntaryInsurance: NaN })).toThrow();
    expect(() =>
      grossToNet({
        ...monthly,
        mealAllowance: 20_000_000,
        exemptAllowances: 20_000_000,
      }),
    ).toThrow();
    expect(() =>
      calculateAnnualSettlement({
        ...annual,
        dependentPeriods: [{ startMonth: 7, endMonth: 12 }],
      }),
    ).toThrow();
    expect(() =>
      calculateAnnualSettlement({ ...annual, medicalExpenses: -1 }),
    ).toThrow();
    expect(() => calculateHkd({ ...hkd, annualRevenue: NaN })).toThrow();
    expect(
      validateRuleset({
        ...getRuleset(2026),
        salary_deductions: {
          ...getRuleset(2026).salary_deductions,
          medical_annual_cap: -1,
        },
      }),
    ).toBeNull();
    expect(
      validateRuleset({
        ...getRuleset(2026),
        business_tax_reduction: {
          rate: 3,
          revenue_cap: 1,
          tax_years: [2026],
          includes_rent: true,
        },
      }),
    ).toBeNull();
  });
  it("round-trips new saved values and retains legacy defaults", () => {
    const c = {
      mode: "gross-to-net",
      amount: 30_000_000,
      region: "I",
      taxYear: 2026,
      month: 7,
      numDependents: 0,
      insurance: { mode: "full" },
      bonus: 0,
      otHours: 0,
      otDayType: "weekday",
      mealAllowance: 1_200_000,
      voluntaryInsurance: 3_000_000,
    };
    expect(parseCalculatorInputs(c)?.mealAllowance).toBe(1_200_000);
    expect(parseCalculatorInputs({ ...c, voluntaryInsurance: -1 })).toBeNull();
    const s = {
      ...annual,
      includeCasual: false,
      casualGross: 0,
      casualWithheld: 0,
      numDependents: 1,
      dependentPeriods: [{ startMonth: 7, endMonth: 12 }],
      medicalExpenses: 23_000_000,
    };
    expect(parseSettlementInputs(s)?.dependentPeriods).toEqual(
      s.dependentPeriods,
    );
    expect(
      parseSettlementInputs({
        ...s,
        dependentPeriods: [{ startMonth: 12, endMonth: 7 }],
      }),
    ).toBeNull();
    expect(
      parseMultiSourceInputs({
        id: "a",
        taxYear: 2026,
        updatedAt: "2026-10-02",
        lines: [],
        salaryRelief: { numDependents: 0, educationExpenses: 24_000_000 },
      })?.salaryRelief?.educationExpenses,
    ).toBe(24_000_000);
  });
});
