import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { MoneyField } from '@/src/components/common/MoneyField';
import { ResultHero } from '@/src/components/common/ResultHero';
import { Section } from '@/src/components/common/Section';
import { StickyActionBar } from '@/src/components/common/StickyActionBar';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { OtherIncomeBreakdownCard } from '@/src/components/otherIncome/OtherIncomeBreakdownCard';
import { emptyCopy, miuTips } from '@/src/copy/miu';
import type { HkdBreakdown, HkdIndustryId } from '@/src/domain/types/otherIncome';
import { calculateHkd } from '@/src/engine/otherIncome/hkd';
import { annualFromMonthly } from '@/src/engine/otherIncome/simpleEstimate';
import { successHaptic } from '@/src/theme/haptics';
import { parseMoney } from '@/src/theme/money';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Props = { taxYear: number };

/** Three common industries for F016′ — full list stays in Đầy đủ mode. */
const SIMPLE_INDUSTRIES: { id: HkdIndustryId; label: string }[] = [
  { id: 'distribution', label: 'Hàng hóa / tạp hóa' },
  { id: 'services', label: 'Dịch vụ' },
  { id: 'production_transport', label: 'Sản xuất / vận tải' },
];

/**
 * F016′ — bản đơn giản: ngành phổ biến + DT tháng ×12, không nhập chi phí.
 */
export function SimpleHkdCalculator({ taxYear }: Props) {
  const [industryId, setIndustryId] = useState<HkdIndustryId>('distribution');
  const [monthlyText, setMonthlyText] = useState('125.000.000');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HkdBreakdown | null>(null);

  const clearResult = () => setResult(null);

  const onCalculate = () => {
    setError(null);
    const monthly = parseMoney(monthlyText);
    if (monthly == null || monthly < 0) {
      setError('Nhập doanh thu tháng hợp lệ.');
      setResult(null);
      return;
    }
    try {
      const annualRevenue = annualFromMonthly(monthly);
      setResult(
        calculateHkd({
          annualRevenue,
          industryId,
          taxYear,
        }),
      );
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <Section
          title="Hộ kinh doanh — ước nhanh"
          subtitle="Chọn nhóm gần đúng + doanh thu tháng. Tôi nhân ×12; không so sánh chi phí ở chế độ này."
        >
          <ChipRow>
            {SIMPLE_INDUSTRIES.map((ind) => (
              <ChoiceChip
                key={ind.id}
                label={ind.label}
                selected={industryId === ind.id}
                tone="secondary"
                onPress={() => {
                  setIndustryId(ind.id);
                  clearResult();
                }}
              />
            ))}
          </ChipRow>
          <MoneyField
            label="Doanh thu / tháng"
            accessibilityLabel="Doanh thu HKD mỗi tháng"
            value={monthlyText}
            onValueChange={(formatted) => {
              setMonthlyText(formatted || '0');
              clearResult();
            }}
          />
          <Text style={styles.hint}>
            Ngành khác hoặc so sánh (DT − CP) × 15% → bật «Đầy đủ».
          </Text>
        </Section>

        {error ? (
          <EmptyErrorState variant="error" title={emptyCopy.calculateError.title} body={error} />
        ) : null}

        {result ? (
          <>
            <ResultHero
              tone="primary"
              eyebrow={`HKD · ${result.industryLabel}`}
              label="Tổng thuế"
              amount={result.totalTax}
            />
            <NgaiMiuTip tip={miuTips.hkdSimple} />
            <OtherIncomeBreakdownCard
              title={`HKD — ${result.industryLabel}`}
              total={result.totalTax}
              formula={result.formula}
              lines={[
                { id: 'vat', label: 'GTGT', amount: result.vat, tipId: 'other.vat' },
                { id: 'pit', label: 'TNCN', amount: result.pit, tipId: 'other.pit' },
              ]}
              explanations={result.explanations}
              note={
                result.exempt
                  ? 'Miễn thuế tỷ lệ — vẫn kê khai doanh thu.'
                  : undefined
              }
              hideTotal
            />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : !error ? (
          <EmptyErrorState
            title="Chưa có ước HKD"
            body="Chọn nhóm ngành và doanh thu tháng, rồi bấm Ước nhanh."
          />
        ) : null}
      </View>

      <StickyActionBar aboveTabBar={false}>
        <Button label="Ước nhanh" onPress={onCalculate} />
      </StickyActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexGrow: 1 },
  body: {
    gap: space[4],
    paddingBottom: layout.stickyBarHeight + space[8],
  },
  hint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    color: colors.foregroundMuted,
    marginTop: space[2],
    lineHeight: 18,
  },
});
