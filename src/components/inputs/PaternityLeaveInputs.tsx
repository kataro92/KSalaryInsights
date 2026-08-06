import { Pressable, Switch, Text, View } from "react-native";

import { MoneyField } from "@/src/components/common/MoneyField";
import { Section } from "@/src/components/common/Section";
import { TextField } from "@/src/components/common/TextField";
import type { ChildOrder } from "@/src/domain/types/benefits";
import {
  requiredIsoDate,
  requiredPositiveMoney,
} from "@/src/theme/fieldValidation";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export type PaternityLeaveInputsValue = {
  avgText: string;
  birthDate: string;
  childOrder: ChildOrder;
  numChildren: number;
  surgeryOrPreterm: boolean;
};

type Props = {
  value: PaternityLeaveInputsValue;
  onChange: (next: PaternityLeaveInputsValue) => void;
};

export function PaternityLeaveInputs({ value, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const patch = (partial: Partial<PaternityLeaveInputsValue>) =>
    onChange({ ...value, ...partial });

  return (
    <View style={styles.wrap}>
      <Section
        title="Bình quân 6 tháng của chồng"
        subtitle="Tiền lương đóng bảo hiểm xã hội bình quân 6 tháng trước nghỉ."
      >
        <MoneyField
          accessibilityLabel="Bình quân lương 6 tháng của chồng"
          value={value.avgText}
          error={requiredPositiveMoney(
            value.avgText,
            "Nhập bình quân lương lớn hơn 0."
          )}
          onValueChange={(formatted) => patch({ avgText: formatted })}
        />
      </Section>

      <Section
        title="Ngày vợ sinh"
        subtitle="YYYY-MM-DD. Chọn mức tham chiếu ngày và quy tắc từ 01/07/2026."
      >
        <TextField
          accessibilityLabel="Ngày vợ sinh YYYY-MM-DD"
          autoCapitalize="none"
          value={value.birthDate}
          error={requiredIsoDate(value.birthDate)}
          onChangeText={(t) => patch({ birthDate: t.trim() })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.border}
        />
      </Section>

      <Section
        title="Thứ tự con"
        subtitle="Con thứ hai từ 01/07/2026: chồng nghỉ tối thiểu 10 ngày làm việc."
      >
        <View style={styles.row}>
          {(
            [
              { id: "first" as const, label: "Con đầu" },
              { id: "second" as const, label: "Con thứ hai" },
            ] as const
          ).map((opt) => {
            const selected = value.childOrder === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => patch({ childOrder: opt.id })}
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

      <Section
        title="Số con lần sinh"
        subtitle="Sinh đôi trở lên: 10 hoặc 14 ngày +3 ngày/con từ con thứ 3."
      >
        <View style={styles.row}>
          {[1, 2, 3, 4].map((n) => {
            const selected = value.numChildren === n;
            return (
              <Pressable
                key={n}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => patch({ numChildren: n })}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected && styles.chipLabelSelected,
                  ]}
                >
                  {n === 1
                    ? "1 con"
                    : n === 2
                      ? "Sinh đôi"
                      : n === 3
                        ? "Sinh ba"
                        : "4 con"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section
        title="Phẫu thuật / sinh non"
        subtitle="Sinh phải phẫu thuật hoặc dưới 32 tuần tuổi."
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            Phẫu thuật hoặc sinh dưới 32 tuần
          </Text>
          <Switch
            value={value.surgeryOrPreterm}
            onValueChange={(v) => patch({ surgeryOrPreterm: v })}
            trackColor={{ false: colors.border, true: colors.secondary }}
          />
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
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: layout.minTouch,
    },
    switchLabel: {
      flex: 1,
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
      color: colors.foreground,
      paddingRight: space[3],
    },
  } satisfies ThemedStyleSheet;
}
