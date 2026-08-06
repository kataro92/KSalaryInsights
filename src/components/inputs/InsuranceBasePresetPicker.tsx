import { useEffect, useState } from "react";
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

function percentError(text: string): string | null {
  if (!text.trim()) return "Nhập tỷ lệ từ 1 đến 100.";
  const n = Number(text);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    return "Tỷ lệ phải là số nguyên từ 1 đến 100.";
  }
  return null;
}

function absoluteError(text: string): string | null {
  const n = parseMoney(text);
  if (n == null || n <= 0) return "Nhập mức lương đóng bảo hiểm lớn hơn 0.";
  return null;
}

/**
 * F022: Full / % HĐ / absolute insurance base picker.
 * Draft text can be cleared; required fields show inline validation.
 */
export function InsuranceBasePresetPicker({
  value,
  onChange,
  netToGrossHint = false,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const [percentText, setPercentText] = useState(() =>
    value.mode === "percent" && value.percent >= 1 ? String(value.percent) : "70"
  );
  const [absoluteText, setAbsoluteText] = useState(() =>
    value.mode === "absolute" && value.absoluteAmount > 0
      ? formatMoneyInput(value.absoluteAmount)
      : formatMoneyInput(15_000_000)
  );

  // Sync drafts when parent loads a scenario / switches mode with a valid value.
  useEffect(() => {
    if (value.mode === "percent" && value.percent >= 1 && value.percent <= 100) {
      setPercentText(String(value.percent));
    }
    if (value.mode === "absolute" && value.absoluteAmount > 0) {
      setAbsoluteText(formatMoneyInput(value.absoluteAmount));
    }
  }, [
    value.mode,
    value.mode === "percent" ? value.percent : null,
    value.mode === "absolute" ? value.absoluteAmount : null,
  ]);

  const setMode = (mode: InsuranceBasePreset["mode"]) => {
    if (mode === "full") {
      onChange({ mode: "full" });
      return;
    }
    if (mode === "percent") {
      const percent =
        value.mode === "percent" && value.percent >= 1 && value.percent <= 100
          ? value.percent
          : 70;
      setPercentText(String(percent));
      onChange({ mode: "percent", percent });
      return;
    }
    const absoluteAmount =
      value.mode === "absolute" && value.absoluteAmount > 0
        ? value.absoluteAmount
        : 15_000_000;
    setAbsoluteText(formatMoneyInput(absoluteAmount));
    onChange({ mode: "absolute", absoluteAmount });
  };

  const pctError =
    value.mode === "percent" ? percentError(percentText) : null;
  const absError =
    value.mode === "absolute" ? absoluteError(absoluteText) : null;

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
            value={percentText}
            onChangeText={(t) => {
              const digits = t.replace(/[^\d]/g, "");
              setPercentText(digits);
              if (!digits) {
                onChange({ mode: "percent", percent: 0 });
                return;
              }
              const n = Math.trunc(Number(digits));
              if (n >= 1 && n <= 100) {
                onChange({ mode: "percent", percent: n });
              } else {
                // Keep draft as typed; mark parent invalid for Calculate.
                onChange({ mode: "percent", percent: 0 });
              }
            }}
            style={[styles.percentInput, pctError ? styles.inputError : null]}
          />
          {pctError ? (
            <Text style={styles.errorText}>{pctError}</Text>
          ) : netToGrossHint ? (
            <Text style={styles.hint}>
              Net→Gross: % áp trên gross tìm được mỗi bước.
            </Text>
          ) : (
            <Text style={styles.hint}>
              Căn cứ BH = {percentText || "…"}% × Gross (trần BH vẫn áp dụng).
            </Text>
          )}
        </View>
      ) : null}

      {value.mode === "absolute" ? (
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Mức lương đóng BH (VNĐ)</Text>
          <MoneyField
            accessibilityLabel="Nhập mức lương đóng bảo hiểm"
            value={absoluteText}
            error={absError}
            onValueChange={(formatted, parsed) => {
              setAbsoluteText(formatted);
              if (parsed == null || parsed <= 0) {
                onChange({ mode: "absolute", absoluteAmount: 0 });
                return;
              }
              onChange({ mode: "absolute", absoluteAmount: parsed });
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
    inputError: {
      borderColor: colors.danger,
      backgroundColor: colors.dangerSoft,
    },
    errorText: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
      color: colors.danger,
    },
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      lineHeight: 18,
    },
  } satisfies ThemedStyleSheet;
}
