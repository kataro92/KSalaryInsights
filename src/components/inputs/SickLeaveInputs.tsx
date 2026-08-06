import { Pressable, Text, View } from "react-native";

import { MoneyField } from "@/src/components/common/MoneyField";
import { Section } from "@/src/components/common/Section";
import { TextField } from "@/src/components/common/TextField";
import type { SickLeaveHazard } from "@/src/domain/types/benefits";
import {
  requiredNonNegativeInt,
  requiredPositiveMoney,
} from "@/src/theme/fieldValidation";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export type SickLeaveInputsValue = {
  salaryText: string;
  daysText: string;
  yearsText: string;
  hazard: SickLeaveHazard;
};

type Props = {
  value: SickLeaveInputsValue;
  onChange: (next: SickLeaveInputsValue) => void;
};

export function SickLeaveInputs({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  const patch = (partial: Partial<SickLeaveInputsValue>) =>
    onChange({ ...value, ...partial });

  const daysError = (() => {
    if (!value.daysText.trim()) return "Nhập số ngày nghỉ.";
    const n = Number(value.daysText.replace(/[^\d]/g, ""));
    if (!Number.isInteger(n) || n < 0) return "Số ngày nghỉ không hợp lệ.";
    return null;
  })();

  return (
    <View style={styles.wrap}>
      <Section
        title="Lương tháng liền kề"
        subtitle="Lương làm căn cứ đóng bảo hiểm xã hội tháng gần nhất trước tháng nghỉ."
      >
        <MoneyField
          accessibilityLabel="Lương tháng liền kề"
          value={value.salaryText}
          error={requiredPositiveMoney(
            value.salaryText,
            "Nhập lương tháng liền kề lớn hơn 0."
          )}
          onValueChange={(formatted) => {
            patch({ salaryText: formatted });
          }}
        />
      </Section>

      <Section
        title="Số ngày nghỉ"
        subtitle="V1: ngày làm việc trong hạn trần năm."
      >
        <TextField
          accessibilityLabel="Số ngày nghỉ ốm"
          keyboardType="number-pad"
          value={value.daysText}
          error={daysError}
          onChangeText={(t) => patch({ daysText: t.replace(/[^\d]/g, "") })}
        />
      </Section>

      <Section
        title="Năm đóng bảo hiểm xã hội"
        subtitle="Chọn trần 30/40/60 (hoặc 40/50/70 nếu nặng nhọc)."
      >
        <TextField
          accessibilityLabel="Số năm đóng bảo hiểm xã hội"
          keyboardType="number-pad"
          value={value.yearsText}
          error={requiredNonNegativeInt(
            value.yearsText,
            "Nhập số năm đóng bảo hiểm xã hội (≥ 0)."
          )}
          onChangeText={(t) => patch({ yearsText: t.replace(/[^\d]/g, "") })}
        />
      </Section>

      <Section
        title="Điều kiện làm việc"
        subtitle="Nặng nhọc / độc hại / vùng đặc biệt khó khăn."
      >
        <View style={styles.row}>
          {(
            [
              { id: "normal" as const, label: "Bình thường" },
              { id: "hazardous" as const, label: "Nặng nhọc" },
            ] as const
          ).map((opt) => {
            const selected = value.hazard === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => patch({ hazard: opt.id })}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected && styles.chipLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[5] },
    row: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
    chip: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[4],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      justifyContent: "center",
    },
    chipSelected: { backgroundColor: colors.secondary },
    chipLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 14,
      color: colors.foreground,
    },
    chipLabelSelected: { color: colors.white },
  } satisfies ThemedStyleSheet;
}
