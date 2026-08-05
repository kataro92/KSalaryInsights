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
import { SimpleHkdCalculator } from '@/src/components/otherIncome/SimpleHkdCalculator';
import { SimpleRentCalculator } from '@/src/components/otherIncome/SimpleRentCalculator';
import { TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import { usePreferences } from '@/src/hooks/usePreferences';
import { space } from '@/src/theme/tokens';

type Depth = 'simple' | 'full';
type SimpleMode = 'rent' | 'hkd';
type FullMode = 'rent' | 'hkd' | 'securities' | 'esop' | 'casual';

const DEPTHS: { id: Depth; label: string }[] = [
  { id: 'simple', label: 'Ước nhanh' },
  { id: 'full', label: 'Đầy đủ' },
];

const SIMPLE_MODES: { id: SimpleMode; label: string }[] = [
  { id: 'rent', label: 'Cho thuê' },
  { id: 'hkd', label: 'HKD' },
];

const FULL_MODES: { id: FullMode; label: string }[] = [
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
  const [depth, setDepth] = useState<Depth>('simple');
  const [simpleMode, setSimpleMode] = useState<SimpleMode>('rent');
  const [fullMode, setFullMode] = useState<FullMode>('rent');

  return (
    <ScreenShell accessibilityLabel="Thu nhập khác" decorated>
      <PageHero
        title="Thu nhập khác"
        subtitle={
          depth === 'simple'
            ? 'F016′ — ước nhanh cho thuê / HKD từ doanh thu tháng. Không cộng vào máy tính lương.'
            : 'Đầy đủ: CK, ESOP, vãng lai và tuỳ chọn nâng cao. Không cộng vào máy tính lương.'
        }
      />

      <OtherIncomeDisclaimer />

      <Section title="Chế độ" subtitle="Ước nhanh = bản đơn giản (tháng ×12). Đầy đủ = mọi loại + tuỳ chọn.">
        <ChipRow equal>
          {DEPTHS.map((d) => (
            <ChoiceChip
              key={d.id}
              flex
              label={d.label}
              selected={depth === d.id}
              onPress={() => setDepth(d.id)}
            />
          ))}
        </ChipRow>
      </Section>

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

      {depth === 'simple' ? (
        <>
          <Section title="Loại thu nhập">
            <View style={styles.row}>
              {SIMPLE_MODES.map((m) => (
                <ChoiceChip
                  key={m.id}
                  label={m.label}
                  selected={simpleMode === m.id}
                  tone="secondary"
                  onPress={() => setSimpleMode(m.id)}
                />
              ))}
            </View>
          </Section>
          {simpleMode === 'rent' ? <SimpleRentCalculator taxYear={taxYear} /> : null}
          {simpleMode === 'hkd' ? <SimpleHkdCalculator taxYear={taxYear} /> : null}
        </>
      ) : (
        <>
          <Section title="Loại thu nhập">
            <View style={styles.row}>
              {FULL_MODES.map((m) => (
                <ChoiceChip
                  key={m.id}
                  label={m.label}
                  selected={fullMode === m.id}
                  tone="secondary"
                  onPress={() => setFullMode(m.id)}
                />
              ))}
            </View>
          </Section>
          {fullMode === 'rent' ? <RentCalculator taxYear={taxYear} /> : null}
          {fullMode === 'hkd' ? <HkdCalculator taxYear={taxYear} /> : null}
          {fullMode === 'securities' ? <SecuritiesCalculator taxYear={taxYear} /> : null}
          {fullMode === 'esop' ? <EsopCalculator taxYear={taxYear} /> : null}
          {fullMode === 'casual' ? (
            <CasualWithholdingCalculator taxYear={taxYear} asOfDate={`${taxYear}-08-15`} />
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
});
