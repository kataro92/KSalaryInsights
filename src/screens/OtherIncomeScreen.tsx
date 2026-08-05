import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { PageHero } from '@/src/components/common/PageHero';
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
import { space } from '@/src/theme/tokens';

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
      <PageHero
        title="Thu nhập khác"
        subtitle="Không cộng vào máy tính lương. Mỗi loại đọc tỷ lệ / ngưỡng từ ruleset năm."
      />

      <OtherIncomeDisclaimer />

      <Section title="Năm ruleset">
        <ChipRow equal>
          {TAX_YEAR_OPTIONS.map((y) => (
            <ChoiceChip
              key={y}
              flex
              label={String(y)}
              selected={taxYear === y}
              onPress={() => setTaxYear(y)}
            />
          ))}
        </ChipRow>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
