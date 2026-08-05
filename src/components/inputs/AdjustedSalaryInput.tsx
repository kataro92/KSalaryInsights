import { Pressable, Text, TextInput, View } from "react-native";

import {
  getInflationAdjustment,
  listInflationAdjustmentYears,
} from "@/src/engine/rulesetLoader";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  mbqtlText: string;
  tableYear: number;
  onMbqtlChange: (text: string) => void;
  onTableYearChange: (year: number) => void;
};

function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatInput(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "";
  return n.toLocaleString("vi-VN");
}

export function AdjustedSalaryInput({
  mbqtlText,
  tableYear,
  onMbqtlChange,
  onTableYearChange,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const inflation = getInflationAdjustment(tableYear);
  const years = listInflationAdjustmentYears();

  return (
    <View style={styles.wrap}>
      <TextInput
        accessibilityLabel="MBQTL đã trượt giá"
        keyboardType="number-pad"
        value={mbqtlText}
        onChangeText={(t) => {
          const n = parseMoney(t);
          onMbqtlChange(n == null ? t.replace(/[^\d.]/g, "") : formatInput(n));
        }}
        style={styles.input}
      />
      <Text style={styles.hint}>
        Tham chiếu bảng {inflation.table_year} ({inflation.legal_source}). Hệ số
        2014 = {inflation.coefficients_by_year["2014"]}.
      </Text>
      <View style={styles.row}>
        {years.map((y) => {
          const selected = tableYear === y;
          return (
            <Pressable
              key={y}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onTableYearChange(y)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipLabel, selected && styles.chipLabelSelected]}
              >
                Bảng {y}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[2] },
    row: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[4],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      justifyContent: "center",
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
      fontVariant: ["tabular-nums"],
      backgroundColor: colors.white,
    },
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.7,
    },
  } satisfies ThemedStyleSheet;
}
