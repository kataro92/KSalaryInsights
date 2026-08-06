import { Text, TextInput, View } from "react-native";

import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { MoneyField } from "@/src/components/common/MoneyField";
import type { InsuranceBasePreset } from "@/src/domain/types/insuranceBase";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { formatMoneyInput, parseMoney } from "@/src/theme/money";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  value: InsuranceBasePreset;
  onChange: (next: InsuranceBasePreset) => void;
  /** Show note for Net→Gross percent semantics. */
  netToGrossHint?: boolean;
};

/**
 * F022: Full / % HĐ / absolute insurance base picker.
 */
export function InsuranceBasePresetPicker({
  value,
  onChange,
  netToGrossHint = false,
}: Props) {
  const styles = useThemedStyles(makeStyles);

  const setMode = (mode: InsuranceBasePreset["mode"]) => {
    if (mode === "full") onChange({ mode: "full" });
    else if (mode === "percent") {
      onChange({
        mode: "percent",
        percent: value.mode === "percent" ? value.percent : 70,
      });
    } else {
      onChange({
        mode: "absolute",
        absoluteAmount:
          value.mode === "absolute" ? value.absoluteAmount : 15_000_000,
      });
    }
  };

  return (
    <View style={styles.wrap} accessibilityLabel="Mức đóng bảo hiểm">
      <ChipRow equal>
        <ChoiceChip
          flex
          label="Full"
          selected={value.mode === "full"}
          onPress={() => setMode("full")}
        />
        <ChoiceChip
          flex
          label="% HĐ"
          selected={value.mode === "percent"}
          onPress={() => setMode("percent")}
        />
        <ChoiceChip
          flex
          label="Số cố định"
          selected={value.mode === "absolute"}
          onPress={() => setMode("absolute")}
        />
      </ChipRow>

      {value.mode === "percent" ? (
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Tỷ lệ căn cứ BH (% lương)</Text>
          <TextInput
            accessibilityLabel="Phần trăm căn cứ bảo hiểm"
            keyboardType="number-pad"
            value={String(value.percent)}
            onChangeText={(t) => {
              const n = Number(t.replace(/[^\d]/g, ""));
              if (!Number.isFinite(n)) return;
              onChange({
                mode: "percent",
                percent: Math.min(100, Math.max(1, Math.trunc(n) || 1)),
              });
            }}
            style={styles.percentInput}
          />
          {netToGrossHint ? (
            <Text style={styles.hint}>
              Net→Gross: % áp trên gross tìm được mỗi bước.
            </Text>
          ) : (
            <Text style={styles.hint}>
              Căn cứ BH = {value.percent}% × Gross (trần BH vẫn áp dụng).
            </Text>
          )}
        </View>
      ) : null}

      {value.mode === "absolute" ? (
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Mức lương đóng BH (VNĐ)</Text>
          <MoneyField
            accessibilityLabel="Nhập mức lương đóng bảo hiểm"
            value={formatMoneyInput(value.absoluteAmount)}
            onValueChange={(formatted) => {
              const n = parseMoney(formatted);
              if (n == null || n <= 0) return;
              onChange({ mode: "absolute", absoluteAmount: n });
            }}
          />
        </View>
      ) : null}

      {value.mode === "full" ? (
        <Text style={styles.hint}>Căn cứ BH = Gross (mặc định).</Text>
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    fieldBlock: { gap: space[2] },
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
    },
    percentInput: {
      minHeight: layout.minTouch,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingHorizontal: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
      backgroundColor: colors.white,
    },
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      lineHeight: 18,
    },
  } satisfies ThemedStyleSheet;
}
