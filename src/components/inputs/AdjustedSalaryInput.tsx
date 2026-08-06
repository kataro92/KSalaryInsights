import { Pressable, Text, View } from "react-native";

import { MoneyField } from "@/src/components/common/MoneyField";
import {
  getInflationAdjustment,
  listInflationAdjustmentYears,
} from "@/src/engine/rulesetLoader";
import { requiredPositiveMoney } from "@/src/theme/fieldValidation";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  mbqtlText: string;
  tableYear: number;
  onMbqtlChange: (text: string) => void;
  onTableYearChange: (year: number) => void;
};

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
      <MoneyField
        accessibilityLabel="Lương bình quân đã điều chỉnh"
        value={mbqtlText}
        error={requiredPositiveMoney(
          mbqtlText,
          "Nhập lương bình quân đã điều chỉnh lớn hơn 0."
        )}
        onValueChange={(formatted) => {
          onMbqtlChange(formatted);
        }}
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
    hint: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.7,
    },
  } satisfies ThemedStyleSheet;
}
