import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { TextField } from '@/src/components/common/TextField';
import { SalaryBreakdownCard } from '@/src/components/breakdown/SalaryBreakdownCard';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { DependentCountInput } from '@/src/components/inputs/DependentCountInput';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { REGION_OPTIONS, TAX_YEAR_OPTIONS } from '@/src/domain/constants/salary';
import type {
  CalculationMode,
  RegionCode,
  SalaryBreakdown,
} from '@/src/domain/types/salary';
import { grossToNet } from '@/src/engine/grossToNet';
import { netToGross } from '@/src/engine/netToGross';
import { usePreferences } from '@/src/hooks/usePreferences';
import { colors, layout, space, typography } from '@/src/theme/tokens';

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

function asOfFromMonth(taxYear: number, month: number): string {
  const m = String(month).padStart(2, '0');
  return `${taxYear}-${m}-15`;
}

export function CalculatorScreen() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const [mode, setMode] = useState<CalculationMode>('gross-to-net');
  const [amountText, setAmountText] = useState('30.000.000');
  const [region, setRegion] = useState<RegionCode>(preferences.defaultRegion);
  const [taxYear, setTaxYear] = useState(() =>
    (TAX_YEAR_OPTIONS as readonly number[]).includes(preferences.defaultTaxYear)
      ? preferences.defaultTaxYear
      : 2026,
  );
  const [month, setMonth] = useState(3);
  const [numDependents, setNumDependents] = useState(0);
  const [customBh, setCustomBh] = useState(false);
  const [bhText, setBhText] = useState('30.000.000');
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);

  const asOfDate = useMemo(() => asOfFromMonth(taxYear, month), [taxYear, month]);

  const clearResult = () => {
    setBreakdown(null);
    setError(null);
  };

  const onCalculate = () => {
    setError(null);
    const amount = parseMoney(amountText);
    if (amount == null || amount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ (> 0).');
      setBreakdown(null);
      return;
    }

    const insuranceSalary = customBh ? parseMoney(bhText) ?? undefined : undefined;
    if (customBh && (insuranceSalary == null || insuranceSalary < 0)) {
      setError('Mức đóng BH không hợp lệ.');
      setBreakdown(null);
      return;
    }

    try {
      if (mode === 'gross-to-net') {
        const result = grossToNet({
          gross: amount,
          region,
          taxYear,
          asOfDate,
          numDependents,
          insuranceSalary,
        });
        setBreakdown(result);
      } else {
        const result = netToGross({
          net: amount,
          region,
          taxYear,
          asOfDate,
          numDependents,
          insuranceTracksGross: !customBh,
          insuranceSalary,
        });
        if (!result.ok) {
          setBreakdown(null);
          setError(
            `Không khả thi với vùng/tham số hiện tại. Net tối thiểu tham khảo: ${result.minFeasibleNet.toLocaleString('vi-VN')} ₫`,
          );
          return;
        }
        setBreakdown(result.breakdown);
      }
    } catch (e) {
      setBreakdown(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  const openComparison = () => {
    const amount = parseMoney(amountText);
    if (amount == null || amount <= 0) {
      setError('Nhập Gross hợp lệ trước khi so sánh.');
      return;
    }
    const insuranceSalary = customBh ? parseMoney(bhText) : null;
    router.push({
      pathname: '/comparison',
      params: {
        gross: String(amount),
        region,
        numDependents: String(numDependents),
        month: String(month),
        insuranceSalary: insuranceSalary != null ? String(insuranceSalary) : '',
      },
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Máy tính lương gross net"
    >
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Text style={styles.brand}>KVSalaryTools</Text>
          <Text style={styles.heroTitle}>Tính lương</Text>
          <Text style={styles.heroBody}>Gross ↔ Net offline · ruleset 2025 / 2026</Text>
        </View>

        <Section title="Chế độ tính">
          <View style={styles.modeRow}>
            {(
              [
                ['gross-to-net', 'Gross → Net'],
                ['net-to-gross', 'Net → Gross'],
              ] as const
            ).map(([id, label]) => (
              <ChoiceChip
                key={id}
                label={label}
                selected={mode === id}
                onPress={() => {
                  setMode(id);
                  setBreakdown(null);
                  setError(null);
                }}
              />
            ))}
          </View>
        </Section>

        <Section
          title={mode === 'gross-to-net' ? 'Lương Gross' : 'Net mong muốn'}
          subtitle="Nhập số nguyên VNĐ"
        >
          <TextField
            accessibilityLabel={
              mode === 'gross-to-net' ? 'Nhập lương gross' : 'Nhập net mong muốn'
            }
            keyboardType="number-pad"
            value={amountText}
            onChangeText={(t) => {
              setAmountText(formatInput(parseMoney(t)));
              clearResult();
            }}
            placeholder="0"
            style={styles.amountInput}
          />
        </Section>

        <Section title="Vùng LTTV">
          <View style={styles.modeRow}>
            {REGION_OPTIONS.map(({ code, label }) => (
              <ChoiceChip
                key={code}
                label={label}
                selected={region === code}
                onPress={() => {
                  setRegion(code);
                  clearResult();
                }}
              />
            ))}
          </View>
        </Section>

        <Section title="Năm thuế">
          <View style={styles.modeRow}>
            {TAX_YEAR_OPTIONS.map((y) => (
              <ChoiceChip
                key={y}
                label={String(y)}
                selected={taxYear === y}
                onPress={() => {
                  setTaxYear(y);
                  clearResult();
                }}
              />
            ))}
          </View>
        </Section>

        <Section
          title="Tháng tính lương"
          subtitle="Chọn đúng tháng để áp trần BH (2026 đổi 01/07)."
        >
          <View style={styles.modeRow}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <ChoiceChip
                key={m}
                label={String(m)}
                selected={month === m}
                onPress={() => {
                  setMonth(m);
                  clearResult();
                }}
              />
            ))}
          </View>
          <Text style={styles.meta}>as_of: {asOfDate}</Text>
        </Section>

        <Section title="Người phụ thuộc" subtitle="Chỉ nhập số lượng — không thu thập PII.">
          <DependentCountInput
            value={numDependents}
            onChange={(n) => {
              setNumDependents(n);
              clearResult();
            }}
          />
        </Section>

        <ColorBlock tone="muted">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Mức đóng BH riêng (≠ gross)</Text>
            <Switch
              accessibilityLabel="Bật mức đóng bảo hiểm riêng"
              value={customBh}
              onValueChange={(v) => {
                setCustomBh(v);
                clearResult();
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          {customBh ? (
            <TextField
              accessibilityLabel="Nhập mức lương đóng bảo hiểm"
              keyboardType="number-pad"
              value={bhText}
              onChangeText={(t) => {
                setBhText(formatInput(parseMoney(t)));
                clearResult();
              }}
              style={{ marginTop: space[3] }}
            />
          ) : null}
        </ColorBlock>

        <Button label="Tính" onPress={onCalculate} />
        {mode === 'gross-to-net' ? (
          <Button
            label="So sánh 2025 vs 2026"
            variant="outline"
            onPress={openComparison}
          />
        ) : null}

        {error ? (
          <ColorBlock tone="primarySoft">
            <Text style={styles.error}>{error}</Text>
          </ColorBlock>
        ) : null}

        {breakdown ? (
          <>
            <NgaiMiuTip tip="Tôi tách từng khoản trừ để bạn thấy rõ — số liệu không bị che." />
            <SalaryBreakdownCard breakdown={breakdown} />
            <DisclaimerFooter legalSources={breakdown.legalSources} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: space[6],
    paddingHorizontal: layout.pagePaddingX,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    gap: space[5],
  },
  hero: { gap: space[1], marginBottom: space[1] },
  brand: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 30,
    letterSpacing: typography.letterSpacingTight,
    color: colors.foreground,
  },
  heroBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foregroundMuted,
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  amountInput: {
    minHeight: 56,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 22,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    minHeight: layout.minTouch,
  },
  switchLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.foregroundMuted,
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
});
