import { Pressable, Switch, Text, TextInput, View } from "react-native";

import { Section } from "@/src/components/common/Section";
import type { ChildOrder } from "@/src/domain/types/benefits";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export type MaternityInputsValue = {
  avgText: string;
  birthDate: string;
  childOrder: ChildOrder;
  numChildren: number;
  hasMinContribution: boolean;
};

type Props = {
  value: MaternityInputsValue;
  onChange: (next: MaternityInputsValue) => void;
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

export function MaternityInputs({ value, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const patch = (partial: Partial<MaternityInputsValue>) =>
    onChange({ ...value, ...partial });

  return (
    <View style={styles.wrap}>
      <Section
        title="Bình quân 6 tháng"
        subtitle="Tiền lương đóng BHXH bình quân 6 tháng trước nghỉ."
      >
        <TextInput
          accessibilityLabel="Bình quân lương 6 tháng"
          keyboardType="number-pad"
          value={value.avgText}
          onChangeText={(t) => {
            const n = parseMoney(t);
            patch({
              avgText: n == null ? t.replace(/[^\d.]/g, "") : formatInput(n),
            });
          }}
          style={styles.input}
        />
      </Section>

      <Section
        title="Ngày sinh dự kiến"
        subtitle="YYYY-MM-DD. Chọn mức tham chiếu và tháng nghỉ."
      >
        <TextInput
          accessibilityLabel="Ngày sinh YYYY-MM-DD"
          autoCapitalize="none"
          value={value.birthDate}
          onChangeText={(t) => patch({ birthDate: t.trim() })}
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.border}
        />
      </Section>

      <Section
        title="Thứ tự con"
        subtitle="Con thứ hai từ 01/07/2026 được nghỉ 7 tháng."
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
        subtitle="Sinh đôi trở lên: +1 tháng/con từ con thứ 2."
      >
        <View style={styles.row}>
          {[1, 2, 3].map((n) => {
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
                  {n === 1 ? "1 con" : n === 2 ? "Sinh đôi" : "Sinh ba"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section
        title="Điều kiện đóng"
        subtitle="Đủ 6 tháng BHXH trong 12 tháng trước sinh."
      >
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Đủ điều kiện 6/12 tháng đóng</Text>
          <Switch
            value={value.hasMinContribution}
            onValueChange={(v) => patch({ hasMinContribution: v })}
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
