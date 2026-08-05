import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { CollapseSection } from '@/src/components/common/CollapseSection';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { MoneyField } from '@/src/components/common/MoneyField';
import { PageHero } from '@/src/components/common/PageHero';
import { ResultHero } from '@/src/components/common/ResultHero';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { SeasonalBanner } from '@/src/components/common/SeasonalBanner';
import { Section } from '@/src/components/common/Section';
import { StickyActionBar } from '@/src/components/common/StickyActionBar';
import { SalaryBreakdownCard } from '@/src/components/breakdown/SalaryBreakdownCard';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { DependentCountInput } from '@/src/components/inputs/DependentCountInput';
import { MonthPicker } from '@/src/components/inputs/MonthPicker';
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
import { parseMoney } from '@/src/theme/money';
import { colors, layout, space, typography } from '@/src/theme/tokens';

function asOfFromMonth(taxYear: number, month: number): string {
  const m = String(month).padStart(2, '0');
  return `${taxYear}-${m}-15`;
}

function formatAsOfVi(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function CalculatorScreen() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const scrollRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (!breakdown) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(t);
  }, [breakdown]);

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
    <View style={styles.root}>
      <ScreenShell
        ref={scrollRef}
        accessibilityLabel="Máy tính lương gross net"
        decorated
        contentContainerStyle={styles.scrollContent}
      >
        <PageHero
          title="Tính lương"
          subtitle="Gross ↔ Net offline · biểu thuế 2025 / 2026"
        />

        <SeasonalBanner />

        <Section title="Chế độ tính">
          <ChipRow equal>
            {(
              [
                ['gross-to-net', 'Gross → Net'],
                ['net-to-gross', 'Net → Gross'],
              ] as const
            ).map(([id, label]) => (
              <ChoiceChip
                key={id}
                flex
                label={label}
                selected={mode === id}
                onPress={() => {
                  setMode(id);
                  setBreakdown(null);
                  setError(null);
                }}
              />
            ))}
          </ChipRow>
        </Section>

        <Section
          title={mode === 'gross-to-net' ? 'Lương Gross' : 'Net mong muốn'}
          subtitle="Nhập số nguyên VNĐ"
        >
          <MoneyField
            accessibilityLabel={
              mode === 'gross-to-net' ? 'Nhập lương gross' : 'Nhập net mong muốn'
            }
            value={amountText}
            onValueChange={(formatted) => {
              setAmountText(formatted);
              clearResult();
            }}
          />
        </Section>

        <Section title="Năm thuế">
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

        <CollapseSection title="Tùy chỉnh · vùng, tháng, NPT, BH">
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

          <Section
            title="Tháng tính lương"
            subtitle="Chọn đúng tháng để áp trần BH (2026 đổi từ 01/07)."
          >
            <MonthPicker
              value={month}
              onChange={(m) => {
                setMonth(m);
                clearResult();
              }}
            />
            <Text style={styles.meta}>Ngày áp dụng: {formatAsOfVi(asOfDate)}</Text>
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
              <View style={styles.switchText}>
                <Text style={styles.switchLabel}>Mức đóng BH riêng</Text>
                <Text style={styles.switchHint}>Khi lương đóng BH khác Gross</Text>
              </View>
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
              <MoneyField
                accessibilityLabel="Nhập mức lương đóng bảo hiểm"
                value={bhText}
                onValueChange={(formatted) => {
                  setBhText(formatted);
                  clearResult();
                }}
                style={{ marginTop: space[3] }}
              />
            ) : null}
          </ColorBlock>
        </CollapseSection>

      {error ? (
        <ColorBlock tone="primarySoft">
          <Text style={styles.error}>{error}</Text>
        </ColorBlock>
      ) : null}

        {breakdown ? (
          <View style={styles.resultBlock}>
            <ResultHero amount={breakdown.net} />
            <NgaiMiuTip tip="Tôi tách từng khoản trừ để bạn thấy rõ — số liệu không bị che." />
            <SalaryBreakdownCard breakdown={breakdown} hideNet />
            <DisclaimerFooter legalSources={breakdown.legalSources} collapseSources />
            {mode === 'gross-to-net' ? (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="So sánh biểu thuế 2025 và 2026"
                onPress={openComparison}
                style={styles.compareLink}
              >
                <Text style={styles.compareLinkText}>So sánh 2025 vs 2026 →</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScreenShell>

      <StickyActionBar>
        <Button label="Tính" onPress={onCalculate} />
      </StickyActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingBottom: space[12] + layout.stickyBarHeight + layout.tabBarClearance,
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    color: colors.foregroundMuted,
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
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
  },
  switchHint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    color: colors.foregroundMuted,
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foregroundMuted,
  },
  actions: {
    gap: space[3],
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
  },
  resultBlock: {
    gap: space[4],
  },
  compareLink: {
    minHeight: layout.minTouch,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  compareLinkText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.body.fontSize,
    color: colors.primary,
  },
});
