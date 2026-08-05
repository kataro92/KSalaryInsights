/** F016′ — monthly revenue × 12 for simple estimators. */
export function annualFromMonthly(monthly: number): number {
  if (!Number.isFinite(monthly) || monthly < 0) {
    throw new Error('Doanh thu tháng không hợp lệ');
  }
  return Math.round(monthly * 12);
}
