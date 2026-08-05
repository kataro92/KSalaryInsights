import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LumpSumEligibilityChecklist } from '@/src/components/checklist/LumpSumEligibilityChecklist';
import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { MoneyField } from '@/src/components/common/MoneyField';
import { Section } from '@/src/components/common/Section';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { RetirementComparisonView } from '@/src/components/comparison/RetirementComparisonView';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import {
  canShowRetirementAmounts,
  LumpSumDisclaimerGate,
} from '@/src/components/disclaimer/LumpSumDisclaimerGate';
import type {
  DisclaimerAckState,
  LumpSumBreakdown,
  PensionBreakdown,
  Sex,
} from '@/src/domain/types/retirement';
import { calcLumpSum } from '@/src/engine/bhxhLumpSum';
import { calcPensionMonthly } from '@/src/engine/pensionEstimate';
import {
  getInflationAdjustment,
  listInflationAdjustmentYears,
} from '@/src/engine/rulesetLoader';
import { parseMoney } from '@/src/theme/money';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

function parseIntSafe(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return 0;
  return Number(digits);
}

export function RetirementComparisonScreen() {
  const [ack, setAck] = useState<DisclaimerAckState>({ acknowledged: false });
  const [sex, setSex] = useState<Sex>('female');
  const [t1Years, setT1Years] = useState('4');
  const [t1Months, setT1Months] = useState('0');
  const [t2Years, setT2Years] = useState('10');
  const [t2Months, setT2Months] = useState('0');
  const [pensionYears, setPensionYears] = useState('25');
  const [mbqtlText, setMbqtlText] = useState('12.000.000');
  const [participationDate, setParticipationDate] = useState('2020-01-15');
  const [tableYear, setTableYear] = useState(2026);
  const [error, setError] = useState<string | null>(null);
  const [lumpSum, setLumpSum] = useState<LumpSumBreakdown | null>(null);
  const [pension, setPension] = useState<PensionBreakdown | null>(null);

  const tableYears = useMemo(() => listInflationAdjustmentYears(), []);
  const inflation = useMemo(() => getInflationAdjustment(tableYear), [tableYear]);

  const showAmounts = canShowRetirementAmounts(ack.acknowledged);

  const onCalculate = () => {
    setError(null);
    const mbqtl = parseMoney(mbqtlText);
    if (mbqtl == null || mbqtl <= 0) {
      setError('Nhập MBQTL hợp lệ.');
      setLumpSum(null);
      setPension(null);
      return;
    }
    try {
      const nextLump = calcLumpSum({
        yearsPre2014: parseIntSafe(t1Years),
        monthsPre2014: parseIntSafe(t1Months),
        yearsFrom2014: parseIntSafe(t2Years),
        monthsFrom2014: parseIntSafe(t2Months),
        adjustedAvgSalary: mbqtl,
        firstParticipationDate: participationDate || undefined,
      });
      const nextPension = calcPensionMonthly({
        sex,
        contributionYears: parseIntSafe(pensionYears),
        adjustedAvgSalary: mbqtl,
      });
      setLumpSum(nextLump);
      setPension(nextPension);
    } catch (e) {
      setLumpSum(null);
      setPension(null);
      setError(e instanceof Error ? e.message : 'Không tính được.');
    }
  };

  const legalSources = [
    ...(lumpSum?.legalSources ?? []),
    ...(pension?.legalSources ?? []),
    inflation.legal_source,
  ];

  return (
    <ToolScreen
      nested
      title="Hưu / BHXH một lần"
      subtitle="So sánh hai kịch bản · bắt buộc đọc cảnh báo trước khi xem số."
      accessibilityLabel="So sánh hưu trí và BHXH một lần"
      sticky={<Button label="Tính so sánh" onPress={onCalculate} />}
    >
        <LumpSumDisclaimerGate
          acknowledged={ack.acknowledged}
          onAcknowledge={() =>
            setAck({
              acknowledged: true,
              acknowledgedAt: new Date().toISOString(),
            })
          }
        />

        <Section title="Giới tính" subtitle="Chọn nhánh tỷ lệ lương hưu Đ.66.">
          <View style={styles.row}>
            {(
              [
                { id: 'female' as const, label: 'Nữ' },
                { id: 'male' as const, label: 'Nam' },
              ] as const
            ).map((opt) => {
              const selected = sex === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setSex(opt.id);
                    setLumpSum(null);
                    setPension(null);
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

        <Section
          title="Năm đóng BHXH một lần"
          subtitle="T1 trước 2014 · T2 từ 2014 (tháng lẻ Đ.5 k.6)."
        >
          <View style={styles.pair}>
            <Field label="T1 năm" value={t1Years} onChange={setT1Years} clear={() => { setLumpSum(null); setPension(null); }} />
            <Field label="T1 tháng lẻ" value={t1Months} onChange={setT1Months} clear={() => { setLumpSum(null); setPension(null); }} />
          </View>
          <View style={styles.pair}>
            <Field label="T2 năm" value={t2Years} onChange={setT2Years} clear={() => { setLumpSum(null); setPension(null); }} />
            <Field label="T2 tháng lẻ" value={t2Months} onChange={setT2Months} clear={() => { setLumpSum(null); setPension(null); }} />
          </View>
        </Section>

        <Section title="Năm đóng cho lương hưu" subtitle="Tổng năm đóng dùng cho tỷ lệ Đ.66.">
          <Field
            label="Tổng năm đóng"
            value={pensionYears}
            onChange={setPensionYears}
            clear={() => {
              setLumpSum(null);
              setPension(null);
            }}
          />
        </Section>

        <Section
          title="MBQTL đã trượt giá"
          subtitle={`Nhập thủ công hoặc tham chiếu bảng CV ${inflation.table_year}.`}
        >
          <MoneyField
            accessibilityLabel="MBQTL đã trượt giá"
            value={mbqtlText}
            onValueChange={(formatted) => {
              setMbqtlText(formatted);
              setLumpSum(null);
              setPension(null);
            }}
          />
          <Text style={styles.hint}>
            Bảng hệ số {inflation.table_year}: ví dụ 2014 = {inflation.coefficients_by_year['2014']},
            2025 = {inflation.coefficients_by_year['2025']} ({inflation.legal_source}).
          </Text>
          <View style={styles.row}>
            {tableYears.map((y) => {
              const selected = tableYear === y;
              return (
                <Pressable
                  key={y}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setTableYear(y)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    Bảng {y}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section
          title="Ngày tham gia lần đầu"
          subtitle="Chỉ ảnh hưởng checklist điều kiện rút (không đổi số tiền)."
        >
          <TextInput
            accessibilityLabel="Ngày tham gia BHXH YYYY-MM-DD"
            autoCapitalize="none"
            value={participationDate}
            onChangeText={(t) => {
              setParticipationDate(t.trim());
              setLumpSum(null);
              setPension(null);
            }}
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.border}
          />
        </Section>

        {error ? (
          <ColorBlock tone="primarySoft">
            <Text style={styles.error}>{error}</Text>
          </ColorBlock>
        ) : null}

        <RetirementComparisonView
          lumpSum={lumpSum}
          pension={pension}
          showAmounts={showAmounts}
        />

        {showAmounts && lumpSum ? (
          <LumpSumEligibilityChecklist
            items={lumpSum.checklist}
            beforeCutoff={lumpSum.beforeCutoff}
          />
        ) : null}

        {showAmounts && lumpSum && pension ? (
          <DisclaimerFooter legalSources={[...new Set(legalSources)]} collapseSources />
        ) : null}
    </ToolScreen>
  );
}

function Field({
  label,
  value,
  onChange,
  clear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  clear: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        value={value}
        onChangeText={(t) => {
          onChange(t.replace(/[^\d]/g, ''));
          clear();
        }}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  chipSelected: { backgroundColor: colors.primary },
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
  hint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.7,
    marginTop: space[2],
    marginBottom: space[2],
  },
  error: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.danger,
  },
});
