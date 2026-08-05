import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { MoneyField } from '@/src/components/common/MoneyField';
import { PageHero } from '@/src/components/common/PageHero';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { SeasonalBanner } from '@/src/components/common/SeasonalBanner';
import { Section } from '@/src/components/common/Section';
import { StickyActionBar } from '@/src/components/common/StickyActionBar';
import { TextField } from '@/src/components/common/TextField';
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
import { colors, layout, space, typography } from '@/src/theme/tokens';
import { parseMoney } from '@/src/theme/money';

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

  const clearResult = () => setResult(null);

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
    <View style={styles.root}>
      <ScreenShell
        accessibilityLabel="Màn hình quyết toán thuế"
        decorated
        contentContainerStyle={styles.scrollContent}
      >
      <PageHero
        title="Quyết toán"
        subtitle="Ước tính quyết toán thuế năm — đối chiếu với bảng lương trước khi nộp."
      />

      <SeasonalBanner />

      <Section
        title="Năm quyết toán"
        subtitle="Ruleset theo năm thu nhập, không theo ngày mở app."
      >
        <ChipRow equal>
          {TAX_YEAR_OPTIONS.map((y) => (
            <ChoiceChip
              key={y}
              flex
              label={String(y)}
              selected={taxYear === y}
              onPress={() => {
                setTaxYear(y);
                clearResult();
              }}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title="Vùng LTTV">
        <ChipRow equal>
          {REGION_OPTIONS.map(({ code, label }) => (
            <ChoiceChip
              key={code}
              flex
              label={label}
              selected={region === code}
              onPress={() => {
                setRegion(code);
                clearResult();
              }}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title="Người phụ thuộc">
        <DependentCountInput
          value={numDependents}
          onChange={(n) => {
            setNumDependents(n);
            clearResult();
          }}
        />
      </Section>

      <Section title="Lương tháng (trung bình)" subtitle="× số tháng có lương trong năm.">
        <MoneyField
          accessibilityLabel="Lương gross tháng"
          value={monthlyText}
          onValueChange={(formatted) => {
            setMonthlyText(formatted);
            clearResult();
          }}
        />
        <TextField
          label="Số tháng làm việc"
          accessibilityLabel="Số tháng làm việc"
          keyboardType="number-pad"
          value={monthsText}
          onChangeText={(t) => {
            setMonthsText(t.replace(/[^\d]/g, ''));
            clearResult();
          }}
        />
      </Section>

      <Section title="Thuế đã khấu trừ (lương)">
        <MoneyField
          accessibilityLabel="Thuế đã khấu trừ"
          value={withheldText}
          onValueChange={(formatted) => {
            setWithheldText(formatted);
            clearResult();
          }}
        />
      </Section>

      <ColorBlock tone="muted">
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Thêm thu nhập vãng lai</Text>
            <Text style={styles.switchHint}>Thu nhập ngoài lương đã khấu trừ 10%</Text>
          </View>
          <Switch
            accessibilityLabel="Thêm thu nhập vãng lai"
            value={includeCasual}
            onValueChange={(v) => {
              setIncludeCasual(v);
              clearResult();
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
        {includeCasual ? (
          <View style={styles.casualFields}>
            <MoneyField
              label="Tổng vãng lai năm"
              value={casualGrossText}
              onValueChange={(formatted) => {
                setCasualGrossText(formatted);
                clearResult();
              }}
            />
            <MoneyField
              label="Thuế đã khấu trừ vãng lai (10%)"
              value={casualWithheldText}
              onValueChange={(formatted) => {
                setCasualWithheldText(formatted);
                clearResult();
              }}
            />
          </View>
        ) : null}
      </ColorBlock>

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
      </ScreenShell>

      <StickyActionBar>
        <Button label="Ước quyết toán" onPress={onCalculate} />
        <Button
          label="Wizard ủy quyền / tự QT"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/filing-wizard',
              params: { year: String(taxYear) },
            })
          }
        />
      </StickyActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingBottom: space[12] + layout.stickyBarHeight + layout.tabBarClearance,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    minHeight: layout.minTouch,
  },
  switchText: { flex: 1, gap: 2 },
  switchLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.foreground,
  },
  switchHint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.foregroundMuted,
  },
  casualFields: {
    marginTop: space[4],
    gap: space[3],
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
});
