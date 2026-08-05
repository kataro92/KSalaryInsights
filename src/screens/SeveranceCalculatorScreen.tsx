import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BenefitBreakdownCard } from '@/src/components/benefits/BenefitBreakdownCard';
import { Button } from '@/src/components/common/Button';
import { Section } from '@/src/components/common/Section';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type { SeveranceBreakdown, SeveranceMode } from '@/src/domain/types/benefits';
import { calcSeverancePay } from '@/src/engine/severance';
import { usePreferences } from '@/src/hooks/usePreferences';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

function parseIntSafe(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return 0;
  return Number(digits);
}

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

export function SeveranceCalculatorScreen() {
  const { preferences } = usePreferences();
  const [mode, setMode] = useState<SeveranceMode>('resignation');
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026,
  );
  const [totalYears, setTotalYears] = useState('7');
  const [totalMonths, setTotalMonths] = useState('0');
  const [bhtnYears, setBhtnYears] = useState('5');
  const [bhtnMonths, setBhtnMonths] = useState('0');
  const [paidYears, setPaidYears] = useState('0');
  const [paidMonths, setPaidMonths] = useState('0');
  const [salaryText, setSalaryText] = useState('20.000.000');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeveranceBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const avg = parseMoney(salaryText);
    if (avg == null || avg <= 0) {
      setError('Nhập lương bình quân 6 tháng hợp lệ.');
      setResult(null);
      return;
    }
    const extraM = parseIntSafe(totalMonths);
    const bhtnM = parseIntSafe(bhtnMonths);
    const paidM = parseIntSafe(paidMonths);
    if (extraM > 11 || bhtnM > 11 || paidM > 11) {
      setError('Tháng lẻ phải từ 0 đến 11.');
      setResult(null);
      return;
    }

    try {
      const next = calcSeverancePay({
        mode,
        totalYears: parseIntSafe(totalYears),
        totalExtraMonths: extraM,
        bhtnYears: parseIntSafe(bhtnYears),
        bhtnExtraMonths: bhtnM,
        previouslyPaidYears: parseIntSafe(paidYears),
        previouslyPaidExtraMonths: paidM,
        avgSalary6m: avg,
        taxYear,
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
      accessibilityLabel="Máy tính trợ cấp thôi việc mất việc"
    >
      <View style={styles.inner}>
        <Section
          title="Loại trợ cấp"
          subtitle="Thôi việc (Đ.46) và mất việc (Đ.47) là hai công thức riêng."
        >
          <View style={styles.row}>
            {(
              [
                { id: 'resignation' as const, label: 'Thôi việc' },
                { id: 'job_loss' as const, label: 'Mất việc' },
              ] as const
            ).map((opt) => {
              const selected = mode === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setMode(opt.id);
                    setResult(null);
                  }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Năm ruleset" subtitle="Tham số hệ số lấy từ ruleset năm thuế.">
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
        </Section>

        <Section title="Thời gian làm việc" subtitle="Năm + tháng lẻ; trừ BHTN và đã chi trả.">
          <View style={styles.pair}>
            <Field
              label="Tổng (năm)"
              value={totalYears}
              onChange={(v) => {
                setTotalYears(v);
                setResult(null);
              }}
            />
            <Field
              label="Tháng lẻ"
              value={totalMonths}
              onChange={(v) => {
                setTotalMonths(v);
                setResult(null);
              }}
            />
          </View>
          <View style={styles.pair}>
            <Field
              label="Đã đóng BHTN (năm)"
              value={bhtnYears}
              onChange={(v) => {
                setBhtnYears(v);
                setResult(null);
              }}
            />
            <Field
              label="Tháng lẻ BHTN"
              value={bhtnMonths}
              onChange={(v) => {
                setBhtnMonths(v);
                setResult(null);
              }}
            />
          </View>
          <View style={styles.pair}>
            <Field
              label="Đã chi trả (năm)"
              value={paidYears}
              onChange={(v) => {
                setPaidYears(v);
                setResult(null);
              }}
            />
            <Field
              label="Tháng lẻ đã trả"
              value={paidMonths}
              onChange={(v) => {
                setPaidMonths(v);
                setResult(null);
              }}
            />
          </View>
        </Section>

        <Section title="Lương căn cứ" subtitle="Bình quân tiền lương 6 tháng liền kề.">
          <TextInput
            accessibilityLabel="Lương bình quân 6 tháng"
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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Tính trợ cấp" onPress={onCalculate} />

        {result ? (
          <>
            <BenefitBreakdownCard result={result} />
            <DisclaimerFooter legalSources={result.legalSources} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
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
  pair: { flexDirection: 'row', gap: space[3], marginBottom: space[3] },
  field: { flex: 1, gap: space[1] },
  fieldLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.foreground,
    opacity: 0.7,
  },
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
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: '#DC2626',
  },
});
