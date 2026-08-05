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
import { useRouter } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { AnnualBreakdownCard } from '@/src/components/breakdown/AnnualBreakdownCard';
import { SettlementDisclaimer } from '@/src/components/disclaimer/SettlementDisclaimer';
import { DependentCountInput } from '@/src/components/inputs/DependentCountInput';
import { DualScenarioCard } from '@/src/components/settlement/DualScenarioCard';
import { SettlementResultCard } from '@/src/components/settlement/SettlementResultCard';
import { REGION_OPTIONS, TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type { AnnualSettlementResult } from '@/src/domain/types/settlement';
import type { RegionCode } from '@/src/domain/types/salary';
import { calculateAnnualSettlement } from '@/src/engine/annualSettlement';
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

export function SettlementScreen() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2025,
  );
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [numDependents, setNumDependents] = useState(0);
  const [monthlyText, setMonthlyText] = useState('30.000.000');
  const [monthsText, setMonthsText] = useState('10');
  const [withheldText, setWithheldText] = useState('16.275.000');
  const [includeCasual, setIncludeCasual] = useState(false);
  const [casualGrossText, setCasualGrossText] = useState('0');
  const [casualWithheldText, setCasualWithheldText] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnnualSettlementResult | null>(null);

  const onCalculate = () => {
    setError(null);
    const monthlyGross = parseMoney(monthlyText);
    const monthsWorked = Number(monthsText.replace(/[^\d]/g, ''));
    const salaryWithheld = parseMoney(withheldText) ?? 0;
    if (monthlyGross == null || monthlyGross <= 0) {
      setError('Nhập lương tháng hợp lệ.');
      setResult(null);
      return;
    }
    if (!Number.isInteger(monthsWorked) || monthsWorked < 1 || monthsWorked > 12) {
      setError('Số tháng làm việc phải từ 1 đến 12.');
      setResult(null);
      return;
    }

    try {
      const next = calculateAnnualSettlement({
        taxYear,
        region,
        numDependents,
        monthlyGross,
        monthsWorked,
        salaryWithheld,
        casual: includeCasual
          ? {
              gross: parseMoney(casualGrossText) ?? 0,
              withheld: parseMoney(casualWithheldText) ?? 0,
            }
          : undefined,
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
      accessibilityLabel="Màn hình quyết toán thuế"
    >
      <View style={styles.inner}>
        <Section title="Năm quyết toán" subtitle="Ruleset theo năm thu nhập, không theo ngày mở app.">
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

        <Section title="Vùng LTTV">
          <View style={styles.row}>
            {REGION_OPTIONS.map(({ code, label }) => {
              const selected = region === code;
              return (
                <Pressable
                  key={code}
                  onPress={() => setRegion(code)}
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

        <Section title="Người phụ thuộc">
          <DependentCountInput value={numDependents} onChange={setNumDependents} />
        </Section>

        <Section title="Lương tháng (trung bình)" subtitle="× số tháng có lương trong năm.">
          <TextInput
            accessibilityLabel="Lương gross tháng"
            keyboardType="number-pad"
            value={monthlyText}
            onChangeText={(t) => setMonthlyText(formatInput(parseMoney(t)))}
            style={styles.input}
          />
          <Text style={styles.fieldLabel}>Số tháng làm việc</Text>
          <TextInput
            accessibilityLabel="Số tháng làm việc"
            keyboardType="number-pad"
            value={monthsText}
            onChangeText={setMonthsText}
            style={styles.input}
          />
        </Section>

        <Section title="Thuế đã khấu trừ (lương)">
          <TextInput
            accessibilityLabel="Thuế đã khấu trừ"
            keyboardType="number-pad"
            value={withheldText}
            onChangeText={(t) => setWithheldText(formatInput(parseMoney(t)))}
            style={styles.input}
          />
        </Section>

        <ColorBlock tone="muted">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Thêm thu nhập vãng lai</Text>
            <Switch
              value={includeCasual}
              onValueChange={setIncludeCasual}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          {includeCasual ? (
            <>
              <Text style={styles.fieldLabel}>Tổng vãng lai năm</Text>
              <TextInput
                keyboardType="number-pad"
                value={casualGrossText}
                onChangeText={(t) => setCasualGrossText(formatInput(parseMoney(t)))}
                style={styles.input}
              />
              <Text style={styles.fieldLabel}>Thuế đã khấu trừ vãng lai (10%)</Text>
              <TextInput
                keyboardType="number-pad"
                value={casualWithheldText}
                onChangeText={(t) => setCasualWithheldText(formatInput(parseMoney(t)))}
                style={styles.input}
              />
            </>
          ) : null}
        </ColorBlock>

        <Button label="Ước quyết toán" onPress={onCalculate} />
        <Button
          label="Wizard ủy quyền / tự QT"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: '/filing-wizard',
              params: { year: String(taxYear) },
            })
          }
        />

        {error ? (
          <ColorBlock tone="primarySoft">
            <Text style={styles.error}>{error}</Text>
          </ColorBlock>
        ) : null}

        {result ? (
          <>
            {result.casualStatus === 'exempt' ? (
              <DualScenarioCard scenarios={result.scenarios} />
            ) : (
              <>
                <SettlementResultCard
                  delta={result.primary.breakdown.delta}
                  withheldMissingWarning={result.primary.breakdown.withheldMissingWarning}
                />
                <AnnualBreakdownCard breakdown={result.primary.breakdown} />
              </>
            )}
            <SettlementDisclaimer legalSources={result.primary.breakdown.legalSources} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingVertical: space[6],
    paddingHorizontal: layout.pagePaddingX,
    alignItems: 'center',
  },
  inner: { width: '100%', maxWidth: layout.maxContentWidth, gap: space[5] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.primary },
  chipLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.foreground,
  },
  chipLabelSelected: { color: colors.white },
  input: {
    minHeight: 52,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    paddingHorizontal: space[4],
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
  },
  fieldLabel: {
    marginTop: space[3],
    marginBottom: space[2],
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.foreground,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouch,
  },
  switchLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
});
