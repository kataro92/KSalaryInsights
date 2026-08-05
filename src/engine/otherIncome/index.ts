/**
 * Facade thu nhập khác (spec 008).
 *
 * FR-001: Module này **không** import `grossToNet` / không mở rộng `SalaryInput`.
 * Calculator lương HĐLĐ và thu nhập khác hoàn toàn tách biệt.
 */
export { calculateRent } from '@/src/engine/otherIncome/rent';
export { calculateHkd } from '@/src/engine/otherIncome/hkd';
export { calculateSecuritiesTransfer } from '@/src/engine/otherIncome/securities';
export { calculateEsop } from '@/src/engine/otherIncome/esop';
export { calculateCasualWithholding } from '@/src/engine/otherIncome/casualWithholding';
export { annualFromMonthly } from '@/src/engine/otherIncome/simpleEstimate';
