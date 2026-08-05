import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { ResultHero } from '@/src/components/common/ResultHero';
import { Section } from '@/src/components/common/Section';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { OtherIncomeBreakdownCard } from '@/src/components/otherIncome/OtherIncomeBreakdownCard';
import type { EsopBreakdown } from '@/src/domain/types/otherIncome';
import { calculateEsop } from '@/src/engine/otherIncome/esop';
import { successHaptic } from '@/src/theme/haptics';
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

type Props = { taxYear: number };

export function EsopCalculator({ taxYear }: Props) {
  const [useBookCost, setUseBookCost] = useState(true);
  const [bookText, setBookText] = useState('100.000.000');
  const [sharesText, setSharesText] = useState('10000');
  const [parText, setParText] = useState('10.000');
  const [paidText, setPaidText] = useState('0');
  const [saleText, setSaleText] = useState('300.000.000');
  const [asOfDate, setAsOfDate] = useState('2026-08-15');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EsopBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const salePrice = parseMoney(saleText);
    if (salePrice == null || salePrice < 0) {
      setError('Nhập giá bán hợp lệ.');
      setResult(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) {
      setError('Ngày phải dạng YYYY-MM-DD.');
      setResult(null);
      return;
    }
    try {
      setResult(
        calculateEsop({
          salePrice,
          taxYear,
          asOfDate,
          bookCostAtGrant: useBookCost ? parseMoney(bookText) ?? undefined : undefined,
          shares: useBookCost ? undefined : Number(sharesText.replace(/[^\d]/g, '') || '0'),
          parValue: useBookCost ? undefined : parseMoney(parText) ?? undefined,
          amountPaid: useBookCost ? undefined : parseMoney(paidText) ?? 0,
        }),
      );
      void successHaptic();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Section title="ESOP" subtitle="TLTC khấu trừ + thuế chuyển nhượng.">
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Dùng chi phí ghi sổ</Text>
          <Switch
            value={useBookCost}
            onValueChange={(v) => {
              setUseBookCost(v);
              setResult(null);
            }}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
        </View>
        {useBookCost ? (
          <>
            <Text style={styles.fieldLabel}>Chi phí ghi sổ tại trao</Text>
            <TextInput
              accessibilityLabel="Chi phí ghi sổ ESOP"
              keyboardType="number-pad"
              value={bookText}
              onChangeText={(t) => {
                const n = parseMoney(t);
                setBookText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
                setResult(null);
              }}
              style={styles.input}
            />
          </>
        ) : (
          <>
            <Text style={styles.fieldLabel}>Số cổ phiếu / Mệnh giá / Đã trả</Text>
            <TextInput
              accessibilityLabel="Số cổ phiếu"
              keyboardType="number-pad"
              value={sharesText}
              onChangeText={(t) => {
                setSharesText(t.replace(/[^\d]/g, ''));
                setResult(null);
              }}
              style={styles.input}
            />
            <TextInput
              accessibilityLabel="Mệnh giá"
              keyboardType="number-pad"
              value={parText}
              onChangeText={(t) => {
                const n = parseMoney(t);
                setParText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
                setResult(null);
              }}
              style={styles.input}
            />
            <TextInput
              accessibilityLabel="Số đã trả"
              keyboardType="number-pad"
              value={paidText}
              onChangeText={(t) => {
                const n = parseMoney(t);
                setPaidText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
                setResult(null);
              }}
              style={styles.input}
            />
          </>
        )}
        <Text style={styles.fieldLabel}>Giá bán</Text>
        <TextInput
          accessibilityLabel="Giá bán ESOP"
          keyboardType="number-pad"
          value={saleText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            setSaleText(n == null ? t.replace(/[^\d.]/g, '') : formatInput(n));
            setResult(null);
          }}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Ngày (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="Ngày ESOP"
          autoCapitalize="none"
          value={asOfDate}
          onChangeText={(t) => {
            setAsOfDate(t.trim());
            setResult(null);
          }}
          style={styles.input}
        />
      </Section>
      {error ? <EmptyErrorState variant="error" title="Chưa tính được" body={error} /> : null}
      <Button label="Tính ESOP" onPress={onCalculate} />
      {result ? (
        <>
          <ResultHero
            tone="primary"
            eyebrow="Ước thuế ESOP"
            label="Tổng thuế"
            amount={result.totalTax}
          />
          <NgaiMiuTip tip="TLTC khấu trừ và thuế chuyển nhượng tách dòng — đọc ghi chú quyết toán nếu có." />
          <OtherIncomeBreakdownCard
            title="ESOP"
            total={result.totalTax}
            formula={result.formula}
            lines={[
              { id: 'tlcc', label: 'TLTC khấu trừ', amount: result.tlccWithholding },
              { id: 'cn', label: 'Thuế chuyển nhượng', amount: result.transferTax },
            ]}
            explanations={result.explanations}
            note={result.settlementNote}
            hideTotal
          />
          <DisclaimerFooter legalSources={result.legalSources} />
        </>
      ) : !error ? (
        <EmptyErrorState
          title="Chưa có ước ESOP"
          body="Nhập chi phí / giá bán, rồi bấm Tính ESOP."
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[4] },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouch,
    marginBottom: space[2],
  },
  switchLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.foreground,
    opacity: 0.7,
    marginBottom: space[1],
    marginTop: space[2],
  },
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
    marginBottom: space[2],
  },
});
