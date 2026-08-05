import {
  calculateMaternity,
  resolveMaternityLeaveMonths,
} from '@/src/engine/maternity';

const leaveParams = {
  first_child_months: 6,
  second_child_months: 7,
  second_child_extended_from: '2026-07-01',
  twin_bonus_from_child: 2,
};

describe('resolveMaternityLeaveMonths', () => {
  it('con đầu = 6', () => {
    const r = resolveMaternityLeaveMonths(
      { birthDate: '2026-08-15', childOrder: 'first', numChildren: 1 },
      leaveParams,
    );
    expect(r.leaveMonths).toBe(6);
  });

  it('con thứ hai sau 01/07/2026 = 7', () => {
    const r = resolveMaternityLeaveMonths(
      { birthDate: '2026-08-15', childOrder: 'second', numChildren: 1 },
      leaveParams,
    );
    expect(r.leaveMonths).toBe(7);
  });

  it('sinh đôi lần đầu = 6 + 1', () => {
    const r = resolveMaternityLeaveMonths(
      { birthDate: '2026-08-15', childOrder: 'first', numChildren: 2 },
      leaveParams,
    );
    expect(r.leaveMonths).toBe(7);
    expect(r.twinBonusMonths).toBe(1);
  });
});

describe('TC-MAT-01/02/03', () => {
  it('TC-MAT-01: avg 18tr, con đầu 08/2026 → 113.060.000', () => {
    const r = calculateMaternity({
      avgSalary6m: 18_000_000,
      birthDate: '2026-08-15',
      childOrder: 'first',
      numChildren: 1,
      hasMinContribution: true,
    });
    expect(r.leaveMonths).toBe(6);
    expect(r.monthlyBenefitTotal).toBe(108_000_000);
    expect(r.oneTimeAllowance).toBe(5_060_000);
    expect(r.total).toBe(113_060_000);
    expect(r.referenceSalary).toBe(2_530_000);
  });

  it('TC-MAT-02: con thứ hai sau 01/07/2026 → 131.060.000', () => {
    const r = calculateMaternity({
      avgSalary6m: 18_000_000,
      birthDate: '2026-08-15',
      childOrder: 'second',
      numChildren: 1,
      hasMinContribution: true,
    });
    expect(r.leaveMonths).toBe(7);
    expect(r.total).toBe(131_060_000);
  });

  it('TC-MAT-03: sinh đôi lần đầu → 136.120.000 + ghi twin', () => {
    const r = calculateMaternity({
      avgSalary6m: 18_000_000,
      birthDate: '2026-08-15',
      childOrder: 'first',
      numChildren: 2,
      hasMinContribution: true,
    });
    expect(r.leaveMonths).toBe(7);
    expect(r.oneTimeAllowance).toBe(10_120_000);
    expect(r.total).toBe(136_120_000);
    expect(r.twinBonusMonths).toBe(1);
    expect(
      r.explanations.some((e) => e.includes('sinh đôi') || e.includes('+1')),
    ).toBe(true);
  });
});

describe('pre-07/2026 + eligibility', () => {
  it('sinh trước 01/07/2026 → trợ cấp 4.680.000/con', () => {
    const r = calculateMaternity({
      avgSalary6m: 18_000_000,
      birthDate: '2026-03-15',
      childOrder: 'first',
      numChildren: 1,
      hasMinContribution: true,
    });
    expect(r.referenceSalary).toBe(2_340_000);
    expect(r.oneTimePerChild).toBe(4_680_000);
    expect(r.oneTimeAllowance).toBe(4_680_000);
  });

  it('bỏ tick 6/12 → eligibility_warning', () => {
    const r = calculateMaternity({
      avgSalary6m: 18_000_000,
      birthDate: '2026-08-15',
      childOrder: 'first',
      numChildren: 1,
      hasMinContribution: false,
    });
    expect(r.eligibilityWarning).toBeTruthy();
    expect(r.total).toBe(113_060_000);
  });
});
