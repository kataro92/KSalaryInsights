import { Pressable, Text, TextInput, View } from "react-native";

import { Section } from "@/src/components/common/Section";
import type { SickLeaveHazard } from "@/src/domain/types/benefits";
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

export function SickLeaveInputs({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  const patch = (partial: Partial<SickLeaveInputsValue>) =>
    onChange({ ...value, ...partial });

  return (
    <View style={styles.wrap}>
      <Section
        title="Lương tháng liền kề"
        subtitle="Căn cứ đóng BHXH tháng gần nhất trước tháng nghỉ."
      >
        <TextInput
          accessibilityLabel="Lương tháng liền kề"
          keyboardType="number-pad"
          value={value.salaryText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            patch({
              salaryText: n == null ? t.replace(/[^\d.]/g, "") : formatInput(n),
            });
          }}
          style={styles.input}
        />
      </Section>

      <Section
        title="Số ngày nghỉ"
        subtitle="V1: ngày làm việc trong hạn trần năm."
      >
        <TextInput
          accessibilityLabel="Số ngày nghỉ ốm"
          keyboardType="number-pad"
          value={value.daysText}
          onChangeText={(t) => patch({ daysText: t.replace(/[^\d]/g, "") })}
          style={styles.input}
        />
      </Section>

      <Section
        title="Năm đóng BHXH"
        subtitle="Chọn trần 30/40/60 (hoặc 40/50/70 nếu nặng nhọc)."
      >
        <TextInput
          accessibilityLabel="Số năm đóng BHXH"
          keyboardType="number-pad"
          value={value.yearsText}
          onChangeText={(t) => patch({ yearsText: t.replace(/[^\d]/g, "") })}
          style={styles.input}
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
  } satisfies ThemedStyleSheet;
}
