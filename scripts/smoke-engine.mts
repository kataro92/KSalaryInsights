import { grossToNet } from '../src/engine/grossToNet.ts';
import { compareRulesets } from '../src/engine/compareRulesets.ts';
import { validateDependents } from '../src/domain/constants/dependents.ts';
import { calculateAnnualSettlement } from '../src/engine/annualSettlement.ts';
import { evaluateCasualExemption } from '../src/engine/casualExemption.ts';
import { evaluateFilingWizard } from '../src/engine/filingWizard.ts';
import { calcSeverancePay, roundServiceYears } from '../src/engine/severance.ts';
import { calcUnemploymentBenefit } from '../src/engine/unemploymentBenefit.ts';
import { getRuleset } from '../src/engine/rulesetLoader.ts';
import { calculateMaternity } from '../src/engine/maternity.ts';
import { calculateSickLeave } from '../src/engine/sickLeave.ts';
import { calcLumpSum, roundContributionYears } from '../src/engine/bhxhLumpSum.ts';
import { calcPensionMonthly } from '../src/engine/pensionEstimate.ts';
import { getInflationAdjustment } from '../src/engine/rulesetLoader.ts';
import { calculateRent } from '../src/engine/otherIncome/rent.ts';
import { calculateHkd } from '../src/engine/otherIncome/hkd.ts';
import { calculateSecuritiesTransfer } from '../src/engine/otherIncome/securities.ts';
import { calculateEsop } from '../src/engine/otherIncome/esop.ts';
import { calculateCasualWithholding } from '../src/engine/otherIncome/casualWithholding.ts';

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(String(msg));
}

const d2026 = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2026,
  asOfDate: '2026-03-15',
  numDependents: 2,
});
assert(d2026.reliefBreakdown.total === 27_900_000, `gtgc ${d2026.reliefBreakdown.total}`);
assert(d2026.pit.totalTax === 0, 'tax0');
assert(d2026.net === 26_850_000, `net ${d2026.net}`);

const d0 = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2026,
  asOfDate: '2026-03-15',
  numDependents: 0,
});
assert(d0.reliefBreakdown.dependent === 0, 'dep0');

assert(validateDependents(-1).ok === false, 'neg');
assert(validateDependents(21).ok === false, 'max');

const y25 = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2025,
  asOfDate: '2025-06-15',
  numDependents: 1,
});
const y26 = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2026,
  asOfDate: '2026-03-15',
  numDependents: 1,
});
assert(
  y25.reliefBreakdown.personal === 11_000_000 && y26.reliefBreakdown.personal === 15_500_000,
  'switch',
);

const cmp = compareRulesets({ gross: 30_000_000, region: 'I', numDependents: 0, month: 3 });
assert(cmp.ok, 'cmp ok');
if (cmp.ok) assert(Math.abs(cmp.result.delta.tax) === 992_500, `delta ${cmp.result.delta.tax}`);

const miss = compareRulesets({
  gross: 30_000_000,
  region: 'I',
  year1: 2099,
  year2: 2026,
});
assert(!miss.ok, 'missing');

const base = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2025,
  asOfDate: '2025-06-15',
  numDependents: 0,
});
assert(base.net === 25_222_500, `2025 net ${base.net}`);
assert(base.reliefBreakdown.total === 11_000_000, '2025 relief');

// --- 004 quyết toán ---
const qt2025 = calculateAnnualSettlement({
  taxYear: 2025,
  region: 'I',
  numDependents: 0,
  monthlyGross: 30_000_000,
  monthsWorked: 10,
  salaryWithheld: 16_275_000,
});
assert(qt2025.primary.breakdown.annualTax === 11_475_000, 'qt25 tax');
assert(qt2025.primary.breakdown.delta.kind === 'refund', 'qt25 refund');
assert(qt2025.primary.breakdown.delta.amount === 4_800_000, 'qt25 amount');

const qt2026m = calculateAnnualSettlement({
  taxYear: 2026,
  region: 'I',
  numDependents: 0,
  monthlyGross: 30_000_000,
  monthsWorked: 12,
  salaryWithheld: 7_620_000,
  casual: { gross: 240_000_000, withheld: 24_000_000 },
});
assert(qt2026m.casualStatus === 'mandatory_merge', 'qt26 mandatory');
assert(qt2026m.primary.breakdown.annualTax === 33_240_000, 'qt26 tax');
assert(qt2026m.primary.breakdown.delta.amount === 1_620_000, 'qt26 pay');

const qt2026e = calculateAnnualSettlement({
  taxYear: 2026,
  region: 'I',
  numDependents: 0,
  monthlyGross: 20_000_000,
  monthsWorked: 12,
  salaryWithheld: 1_440_000,
  casual: { gross: 60_000_000, withheld: 6_000_000 },
});
assert(qt2026e.casualStatus === 'exempt', 'qt26 exempt');
assert(qt2026e.scenarios.length === 2, 'dual');
const noMerge = qt2026e.scenarios.find((s) => s.id === 'exempt_no_merge');
const merge = qt2026e.scenarios.find((s) => s.id === 'voluntary_merge');
assert(!!noMerge && noMerge.breakdown.delta.amount === 0, 'no merge even');
assert(!!merge && merge.breakdown.delta.amount === 3_000_000, 'voluntary refund');

assert(
  evaluateCasualExemption(2026, { gross: 60_000_000, withheld: 6_000_000 }).status ===
    'exempt',
  'exempt eval',
);

const wiz = evaluateFilingWizard(
  {
    hasSingleEmployerFullYear: true,
    hasOtherIncome: false,
    employerOffersAuthorization: true,
  },
  2025,
);
assert(wiz.conclusion === 'authorize', 'wizard authorize');

const mTax = grossToNet({
  gross: 30_000_000,
  region: 'I',
  taxYear: 2026,
  asOfDate: '2026-03-15',
  numDependents: 0,
}).pit.totalTax;
const ann = calculateAnnualSettlement({
  taxYear: 2026,
  region: 'I',
  numDependents: 0,
  monthlyGross: 30_000_000,
  monthsWorked: 12,
  salaryWithheld: mTax * 12,
});
assert(Math.abs(ann.primary.breakdown.annualTax - mTax * 12) <= 12, 'SC-002');

// --- 005 quyền lợi nghỉ việc ---
assert(getRuleset(2026, '2026-03-15').id === 'ruleset-2026-h1', 'rs h1');
assert(getRuleset(2026, '2026-08-15').id === 'ruleset-2026-h2', 'rs h2');

assert(roundServiceYears(1, 7) === 2, 'round 1y7m');
assert(roundServiceYears(1, 5) === 1.5, 'round 1y5m');

const sev01 = calcSeverancePay({
  mode: 'resignation',
  totalYears: 7,
  bhtnYears: 5,
  avgSalary6m: 20_000_000,
  taxYear: 2026,
});
assert(sev01.yearsCounted === 2, `sev01 years ${sev01.yearsCounted}`);
assert(sev01.amount === 20_000_000, `sev01 ${sev01.amount}`);
assert(
  sev01.explanations.some((e) => e.includes('bảo hiểm thất nghiệp')),
  'sev01 explain'
);

const sev02 = calcSeverancePay({
  mode: 'resignation',
  totalYears: 1,
  totalExtraMonths: 7,
  bhtnYears: 0,
  avgSalary6m: 20_000_000,
  taxYear: 2026,
});
assert(sev02.yearsCounted === 2, `sev02 years ${sev02.yearsCounted}`);
assert(sev02.amount === 20_000_000, `sev02 ${sev02.amount}`);

const job01 = calcSeverancePay({
  mode: 'job_loss',
  totalYears: 1,
  bhtnYears: 0,
  avgSalary6m: 20_000_000,
  taxYear: 2026,
});
assert(job01.amount === 40_000_000, `job01 ${job01.amount}`);

const sevFull = calcSeverancePay({
  mode: 'resignation',
  totalYears: 5,
  bhtnYears: 5,
  avgSalary6m: 20_000_000,
  taxYear: 2026,
});
assert(sevFull.amount === 0, 'full bhtn 0');
assert(sevFull.explanations.some((e) => e.includes('0')), 'full explain');

const ue01 = calcUnemploymentBenefit({
  monthsPaid: 72,
  avgSalaryBhtn6m: 15_000_000,
  region: 'I',
  lastContributionDate: '2026-03-15',
  taxYear: 2026,
});
assert(ue01.eligible, 'ue01 elig');
assert(ue01.monthlyBenefit === 9_000_000, `ue01 mo ${ue01.monthlyBenefit}`);
assert(ue01.benefitMonths === 6, `ue01 months ${ue01.benefitMonths}`);
assert(ue01.totalBenefit === 54_000_000, `ue01 total ${ue01.totalBenefit}`);
assert(ue01.checklist.some((c) => c.label.includes('10')), 'ue checklist 10');

const ue02 = calcUnemploymentBenefit({
  monthsPaid: 72,
  avgSalaryBhtn6m: 50_000_000,
  region: 'I',
  lastContributionDate: '2026-03-15',
  taxYear: 2026,
});
assert(ue02.monthlyBenefit === 26_550_000, `ue02 cap ${ue02.monthlyBenefit}`);
assert(ue02.hitCap, 'ue02 hit');

const ue03 = calcUnemploymentBenefit({
  monthsPaid: 10,
  avgSalaryBhtn6m: 15_000_000,
  region: 'I',
  lastContributionDate: '2026-03-15',
  taxYear: 2026,
});
assert(!ue03.eligible, 'ue03 inelig');
assert(!!ue03.ineligibilityReason, 'ue03 reason');

const ueH2 = calcUnemploymentBenefit({
  monthsPaid: 72,
  avgSalaryBhtn6m: 50_000_000,
  region: 'I',
  lastContributionDate: '2026-08-15',
  taxYear: 2026,
});
assert(ueH2.rulesetId === 'ruleset-2026-h2', 'ue h2 ruleset');
assert(ue02.rulesetId === 'ruleset-2026-h1', 'ue h1 ruleset');

// --- 006 thai sản / ốm đau ---
assert(getRuleset(2026, '2026-03-15').reference_salary === 2_340_000, 'ref h1');
assert(getRuleset(2026, '2026-08-15').reference_salary === 2_530_000, 'ref h2');

const mat01 = calculateMaternity({
  avgSalary6m: 18_000_000,
  birthDate: '2026-08-15',
  childOrder: 'first',
  numChildren: 1,
  hasMinContribution: true,
});
assert(mat01.total === 113_060_000, `mat01 ${mat01.total}`);

const mat02 = calculateMaternity({
  avgSalary6m: 18_000_000,
  birthDate: '2026-08-15',
  childOrder: 'second',
  numChildren: 1,
  hasMinContribution: true,
});
assert(mat02.total === 131_060_000, `mat02 ${mat02.total}`);

const mat03 = calculateMaternity({
  avgSalary6m: 18_000_000,
  birthDate: '2026-08-15',
  childOrder: 'first',
  numChildren: 2,
  hasMinContribution: true,
});
assert(mat03.total === 136_120_000, `mat03 ${mat03.total}`);
assert(mat03.twinBonusMonths === 1, 'mat03 twin');

const matPre = calculateMaternity({
  avgSalary6m: 18_000_000,
  birthDate: '2026-03-15',
  childOrder: 'first',
  numChildren: 1,
  hasMinContribution: true,
});
assert(matPre.oneTimeAllowance === 4_680_000, `matPre ${matPre.oneTimeAllowance}`);

const matWarn = calculateMaternity({
  avgSalary6m: 18_000_000,
  birthDate: '2026-08-15',
  childOrder: 'first',
  numChildren: 1,
  hasMinContribution: false,
});
assert(!!matWarn.eligibilityWarning, 'mat warn');

const sick01 = calculateSickLeave({
  salaryLastMonth: 12_000_000,
  daysRequested: 5,
  contributionYears: 5,
  taxYear: 2026,
  asOfDate: '2026-03-15',
});
assert(sick01.amount === 1_875_000, `sick01 ${sick01.amount}`);

const sickCap = calculateSickLeave({
  salaryLastMonth: 12_000_000,
  daysRequested: 50,
  contributionYears: 5,
  taxYear: 2026,
  asOfDate: '2026-03-15',
});
assert(sickCap.daysPaid === 30 && sickCap.capped, 'sick cap');

// --- 007 hưu / BHXH một lần ---
assert(getInflationAdjustment(2026).coefficients_by_year['2014'] === 1.36, 'inf 2014');
assert(roundContributionYears(4, 8) === 5, 'round 4y8m');

const lump01 = calcLumpSum({
  yearsPre2014: 4,
  yearsFrom2014: 10,
  adjustedAvgSalary: 12_000_000,
});
assert(lump01.amount === 312_000_000, `lump01 ${lump01.amount}`);

const lumpShort = calcLumpSum({
  yearsPre2014: 0,
  monthsPre2014: 8,
  yearsFrom2014: 0,
  adjustedAvgSalary: 10_000_000,
});
assert(lumpShort.underOneYear && lumpShort.amount === 20_000_000, 'lump short');

const lumpNew = calcLumpSum({
  yearsPre2014: 0,
  yearsFrom2014: 5,
  adjustedAvgSalary: 12_000_000,
  firstParticipationDate: '2025-08-01',
});
assert(!lumpNew.beforeCutoff, 'lump cutoff');
assert(lumpNew.checklist.every((c) => !c.label.includes('12 tháng')), 'no 12m');

const pen01 = calcPensionMonthly({
  sex: 'female',
  contributionYears: 25,
  adjustedAvgSalary: 10_000_000,
});
assert(pen01.monthlyAmount === 6_500_000, `pen01 ${pen01.monthlyAmount}`);

const pen02 = calcPensionMonthly({
  sex: 'male',
  contributionYears: 17,
  adjustedAvgSalary: 10_000_000,
});
assert(pen02.monthlyAmount === 4_200_000, `pen02 ${pen02.monthlyAmount}`);

// --- 008 thu nhập khác ---
const rent01 = calculateRent({ annualRevenue: 240_000_000, taxYear: 2026 });
assert(rent01.totalTax === 0 && rent01.reportingRequired, 'rent01');
const rent02 = calculateRent({ annualRevenue: 1_500_000_000, taxYear: 2026 });
assert(rent02.vat === 75_000_000 && rent02.pit === 25_000_000, 'rent02');
const rent03 = calculateRent({ annualRevenue: 1_000_000_000, taxYear: 2026 });
assert(rent03.totalTax === 0, 'rent03');

const hkd01 = calculateHkd({
  annualRevenue: 800_000_000,
  industryId: 'distribution',
  taxYear: 2026,
});
assert(hkd01.totalTax === 0, 'hkd01');
const hkd02 = calculateHkd({
  annualRevenue: 1_500_000_000,
  industryId: 'distribution',
  taxYear: 2026,
});
assert(hkd02.vat === 15_000_000 && hkd02.pit === 2_500_000, 'hkd02');

const sec01 = calculateSecuritiesTransfer({
  transferPrice: 100_000_000,
  taxYear: 2026,
  asOfDate: '2026-08-15',
});
assert(sec01.tax === 100_000, 'sec01');

const esop01 = calculateEsop({
  bookCostAtGrant: 100_000_000,
  salePrice: 300_000_000,
  taxYear: 2026,
  asOfDate: '2026-08-15',
});
assert(esop01.tlccWithholding === 10_000_000 && esop01.transferTax === 300_000, 'esop01');

const cas01 = calculateCasualWithholding({
  paymentAmount: 10_000_000,
  taxYear: 2026,
  asOfDate: '2026-08-15',
});
assert(cas01.withheld === 1_000_000, 'cas01');
const cas02 = calculateCasualWithholding({
  paymentAmount: 4_000_000,
  taxYear: 2026,
  asOfDate: '2026-08-15',
});
assert(cas02.withheld === 0, 'cas02');
const cas25 = calculateCasualWithholding({
  paymentAmount: 4_000_000,
  taxYear: 2025,
  asOfDate: '2025-06-15',
});
assert(cas25.withheld === 400_000, 'cas25');

assert(getRuleset(2026).other_income!.hkd.industry_rates.length === 5, 'hkd industries');

import { calcOvertimePay } from '../src/engine/overtime.ts';
import { calculateBonusMonth } from '../src/engine/bonusMonth.ts';

const ot01 = calcOvertimePay({
  monthlySalary: 20_000_000,
  hours: 10,
  dayType: 'weekday',
});
assert(ot01.otPay === 1_442_308, `ot01 ${ot01.otPay}`);

const bonus = calculateBonusMonth({
  baseGross: 30_000_000,
  bonus: 30_000_000,
  region: 'I',
  taxYear: 2026,
  asOfDate: '2026-12-15',
  numDependents: 0,
});
assert(bonus.withExtras.gross === 60_000_000, 'bonus gross');
assert(bonus.deltaTax > 0, 'bonus tax up');

console.log('ALL ENGINE ASSERTIONS PASSED');
