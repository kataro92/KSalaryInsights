import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EligibilityChecklist } from '@/src/components/benefits/EligibilityChecklist';
import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { REGION_OPTIONS, TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type { UnemploymentBreakdown } from '@/src/domain/types/benefits';
import type { RegionCode } from '@/src/domain/types/salary';
import { calcUnemploymentBenefit } from '@/src/engine/unemploymentBenefit';
import { usePreferences } from '@/src/hooks/usePreferences';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '';
  return n.toLocaleString('vi-VN');
}

export function UnemploymentCalculatorScreen() {
  const { preferences } = usePreferences();
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026,
  );
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [monthsPaid, setMonthsPaid] = useState('72');
  const [salaryText, setSalaryText] = useState('15.000.000');
  const [lastDate, setLastDate] = useState('2026-03-15');
  const [shortTerm, setShortTerm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UnemploymentBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const avg = parseMoney(salaryText);
    const paid = Number(monthsPaid.replace(/[^\d]/g, ''));
    if (avg == null || avg <= 0) {
      setError('Nhập lương bình quân BHTN 6 tháng hợp lệ.');
      setResult(null);
      return;
    }
    if (!Number.isInteger(paid) || paid < 0) {
      setError('Số tháng đóng BHTN không hợp lệ.');
      setResult(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDate)) {
      setError('Ngày cuối đóng phải dạng YYYY-MM-DD.');
      setResult(null);
      return;
    }

    try {
      const next = calcUnemploymentBenefit({
        monthsPaid: paid,
        avgSalaryBhtn6m: avg,
        region,
        lastContributionDate: lastDate,
        taxYear,
        shortTermContract: shortTerm,
      });
      setResult(next);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Máy tính trợ cấp thất nghiệp BHTN"
    >
      <View style={styles.inner}>
        <Section title="Năm / vùng" subtitle="Trần 5×LTTV theo ruleset tại ngày cuối đóng.">
          <View style={styles.row}>
            {TAX_YEAR_OPTIONS.map((y) => {
              const selected = taxYear === y;
              return (
                <Pressable
                  key={y}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setTaxYear(y);
                    setResult(null);
                  }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {y}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.row, { marginTop: space[2] }]}>
            {REGION_OPTIONS.map(({ code, label }) => {
              const selected = region === code;
              return (
                <Pressable
                  key={code}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setRegion(code);
                    setResult(null);
                  }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Tháng đóng BHTN" subtitle="Tối thiểu 12 tháng để đủ điều kiện.">
          <TextInput
            accessibilityLabel="Số tháng đã đóng BHTN"
            keyboardType="number-pad"
            value={monthsPaid}
            onChangeText={(t) => {
              setMonthsPaid(t.replace(/[^\d]/g, ''));
              setResult(null);
            }}
            style={styles.input}
          />
        </Section>

        <Section title="Lương BQ 6 tháng" subtitle="Căn cứ đóng BHTN bình quân 6 tháng cuối.">
          <TextInput
            accessibilityLabel="Lương bình quân BHTN 6 tháng"
            keyboardType="number-pad"
            value={salaryText}
            onChangeText={(t) => {
              const n = parseMoney(t);
              setSalaryText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
              setResult(null);
            }}
            style={styles.input}
          />
        </Section>

        <Section
          title="Ngày cuối đóng"
          subtitle="Chọn LTTV / ruleset (ví dụ 2026-03-15 = H1)."
        >
          <TextInput
            accessibilityLabel="Ngày cuối đóng BHTN YYYY-MM-DD"
            autoCapitalize="none"
            value={lastDate}
            onChangeText={(t) => {
              setLastDate(t.trim());
              setResult(null);
            }}
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.border}
          />
        </Section>

        <Section title="Hợp đồng ngắn" subtitle="HĐ dưới 12 tháng → lookback 36 tháng.">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Hợp đồng ngắn hạn</Text>
            <Switch
              value={shortTerm}
              onValueChange={(v) => {
                setShortTerm(v);
                setResult(null);
              }}
              trackColor={{ false: colors.border, true: colors.secondary }}
            />
          </View>
        </Section>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Tính BHTN" onPress={onCalculate} />

        {result ? (
          <>
            <ColorBlock
              tone={result.eligible ? 'secondarySoft' : 'muted'}
              accessibilityLabel="Kết quả trợ cấp thất nghiệp"
            >
              {result.eligible ? (
                <>
                  <Text style={styles.eyebrow}>Trợ cấp thất nghiệp</Text>
                  <Text style={styles.amount}>
                    {result.totalBenefit.toLocaleString('vi-VN')} ₫
                  </Text>
                  <Text style={styles.formula}>{result.formula}</Text>
                  <Text style={styles.meta}>
                    {result.monthlyBenefit.toLocaleString('vi-VN')} ₫/tháng ×{' '}
                    {result.benefitMonths} tháng
                    {result.hitCap ? ' · Đã chạm trần 5×LTTV' : ''}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.eyebrow}>Không đủ điều kiện</Text>
                  <Text style={styles.ineligible}>{result.ineligibilityReason}</Text>
                </>
              )}
              {result.explanations.map((line) => (
                <Text key={line} style={styles.explain}>
                  • {line}
                </Text>
              ))}
            </ColorBlock>
            <EligibilityChecklist items={result.checklist} />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: space[10] },
  inner: {
    paddingHorizontal: layout.pagePaddingX,
    paddingTop: space[4],
    gap: space[5],
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.secondary },
  chipLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  chipLabelSelected: { color: colors.white },
  input: {
    minHeight: layout.minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: space[3],
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    backgroundColor: colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouch,
  },
  switchLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.foreground,
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: '#DC2626',
  },
  eyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.secondary,
    marginBottom: space[2],
  },
  amount: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 32,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
    marginBottom: space[2],
  },
  formula: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.75,
    marginBottom: space[3],
  },
  ineligible: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: space[3],
  },
  explain: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.85,
    marginBottom: space[1],
  },
});
