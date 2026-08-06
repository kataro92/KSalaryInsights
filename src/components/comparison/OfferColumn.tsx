import { Text, View } from "react-native";

import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { MoneyField } from "@/src/components/common/MoneyField";
import { InsuranceBasePresetPicker } from "@/src/components/inputs/InsuranceBasePresetPicker";
import type { OfferSideInput, OfferSideResult } from "@/src/domain/types/offerCompare";
import type { CalculationMode } from "@/src/domain/types/salary";
import { formatMoneyInput, formatVnd, parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  title: string;
  value: OfferSideInput;
  onChange: (next: OfferSideInput) => void;
  result: OfferSideResult | null;
};

export function OfferColumn({ title, value, onChange, result }: Props) {
  const styles = useThemedStyles(makeStyles);

  const setMode = (mode: CalculationMode) => {
    onChange({ ...value, mode });
  };

  return (
    <ColorBlock tone="muted" accessibilityLabel={title}>
      <Text style={styles.title}>{title}</Text>
      <ChipRow equal>
        <ChoiceChip
          flex
          label="Gross sang Net"
          selected={value.mode === "gross-to-net"}
          onPress={() => setMode("gross-to-net")}
        />
        <ChoiceChip
          flex
          label="Net sang Gross"
          selected={value.mode === "net-to-gross"}
          onPress={() => setMode("net-to-gross")}
        />
      </ChipRow>
      <Text style={styles.fieldLabel}>
        {value.mode === "gross-to-net" ? "Lương Gross" : "Net muốn nhận"}
      </Text>
      <MoneyField
        accessibilityLabel={`${title} số tiền`}
        value={formatMoneyInput(value.amount)}
        onValueChange={(formatted) => {
          const n = parseMoney(formatted);
          if (n == null || n <= 0) return;
          onChange({ ...value, amount: n });
        }}
      />
      <InsuranceBasePresetPicker
        value={value.insurance}
        netToGrossHint={value.mode === "net-to-gross"}
        onChange={(insurance) => onChange({ ...value, insurance })}
      />

      {result ? (
        result.ok ? (
          <View style={styles.result} accessibilityLabel={`${title} kết quả`}>
            <Text style={styles.resultLine}>Gross: {formatVnd(result.gross)}</Text>
            <Text style={styles.resultLine}>Net: {formatVnd(result.net)}</Text>
            <Text style={styles.resultLine}>
              Bảo hiểm người lao động: {formatVnd(result.insuranceEmployeeTotal)}
            </Text>
            <Text style={styles.resultLine}>
              Thuế thu nhập cá nhân: {formatVnd(result.pitTotal)}
            </Text>
            <Text style={styles.meta}>
              Lương làm căn cứ đóng bảo hiểm: {result.insuranceBaseLabel} ·{" "}
              {formatVnd(result.insuranceBaseUsed)}
            </Text>
          </View>
        ) : (
          <View style={styles.result}>
            <Text style={styles.error}>{result.errorMessage}</Text>
            {result.minFeasibleNet != null ? (
              <Text style={styles.meta}>
                Net tối thiểu tham khảo: {formatVnd(result.minFeasibleNet)}
              </Text>
            ) : null}
          </View>
        )
      ) : null}
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.subtitle.fontSize,
      lineHeight: typography.scale.subtitle.lineHeight,
      color: colors.foreground,
      letterSpacing: typography.letterSpacingTight,
      paddingRight: 2,
    },
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
    },
    result: { gap: space[1], marginTop: space[2] },
    resultLine: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[1],
    },
    error: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.danger,
    },
  } satisfies ThemedStyleSheet;
}
