import { canShowRetirementAmounts } from '@/src/components/disclaimer/LumpSumDisclaimerGate';

describe('LumpSumDisclaimerGate / SC-002', () => {
  it('chưa acknowledge → không hiện số', () => {
    expect(canShowRetirementAmounts(false)).toBe(false);
  });

  it('sau acknowledge → được hiện số', () => {
    expect(canShowRetirementAmounts(true)).toBe(true);
  });
});
