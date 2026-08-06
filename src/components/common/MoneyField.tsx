import { StyleSheet } from "react-native";

import { TextField } from "@/src/components/common/TextField";
import { formatMoneyInput, parseMoney } from "@/src/theme/money";
import { typography } from "@/src/theme/tokens";
import type { TextInputProps } from "react-native";

type Props = Omit<TextInputProps, "value" | "onChangeText" | "keyboardType"> & {
  label?: string;
  value: string;
  onValueChange: (formatted: string, parsed: number | null) => void;
  accessibilityLabel?: string;
  error?: string | null;
};

/**
 * Money input. Numeric pad, vi-VN grouping, tabular nums, large type.
 */
export function MoneyField({
  label,
  value,
  onValueChange,
  error,
  style,
  ...rest
}: Props) {
  return (
    <TextField
      {...rest}
      label={label}
      error={error}
      keyboardType="number-pad"
      value={value}
      onChangeText={(raw) => {
        const parsed = parseMoney(raw);
        onValueChange(formatMoneyInput(parsed), parsed);
      }}
      placeholder="0"
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.moneyMd.fontSize,
  },
});
