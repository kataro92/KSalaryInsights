import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { Section } from '@/src/components/common/Section';
import { OtherIncomeDisclaimer } from '@/src/components/disclaimer/OtherIncomeDisclaimer';
import { CasualWithholdingCalculator } from '@/src/components/otherIncome/CasualWithholdingCalculator';
import { EsopCalculator } from '@/src/components/otherIncome/EsopCalculator';
import { HkdCalculator } from '@/src/components/otherIncome/HkdCalculator';
import { RentCalculator } from '@/src/components/otherIncome/RentCalculator';
import { SecuritiesCalculator } from '@/src/components/otherIncome/SecuritiesCalculator';
import { TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import { usePreferences } from '@/src/hooks/usePreferences';
import { colors, space, typography } from '@/src/theme/tokens';

type Mode = 'rent' | 'hkd' | 'securities' | 'esop' | 'casual';

const MODES: { id: Mode; label: string }[] = [
  { id: 'rent', label: 'Cho thuê' },
  { id: 'hkd', label: 'HKD' },
  { id: 'securities', label: 'CK' },
  { id: 'esop', label: 'ESOP' },
  { id: 'casual', label: 'Vãng lai' },
];

export function OtherIncomeScreen() {
  const { preferences } = usePreferences();
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026,
  );
  const [mode, setMode] = useState<Mode>('rent');

  return (
    <ScreenShell accessibilityLabel="Thu nhập khác" decorated>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Ngoài HĐLĐ</Text>
        <Text style={styles.title}>Thu nhập khác</Text>
        <Text style={styles.body}>
          Không cộng vào máy tính lương. Mỗi loại đọc tỷ lệ / ngưỡng từ ruleset năm.
        </Text>
      </View>

      <OtherIncomeDisclaimer />

      <Section title="Năm ruleset">
        <View style={styles.row}>
          {TAX_YEAR_OPTIONS.map((y) => (
            <ChoiceChip
              key={y}
              label={String(y)}
              selected={taxYear === y}
              onPress={() => setTaxYear(y)}
            />
          ))}
        </View>
      </Section>

      <Section title="Loại thu nhập">
        <View style={styles.row}>
          {MODES.map((m) => (
            <ChoiceChip
              key={m.id}
              label={m.label}
              selected={mode === m.id}
              tone="secondary"
              onPress={() => setMode(m.id)}
            />
          ))}
        </View>
      </Section>

      {mode === 'rent' ? <RentCalculator taxYear={taxYear} /> : null}
      {mode === 'hkd' ? <HkdCalculator taxYear={taxYear} /> : null}
      {mode === 'securities' ? <SecuritiesCalculator taxYear={taxYear} /> : null}
      {mode === 'esop' ? <EsopCalculator taxYear={taxYear} /> : null}
      {mode === 'casual' ? (
        <CasualWithholdingCalculator taxYear={taxYear} asOfDate={`${taxYear}-08-15`} />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: { gap: space[2] },
  eyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 28,
    letterSpacing: typography.letterSpacingTight,
    color: colors.foreground,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foreground,
    opacity: 0.75,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
