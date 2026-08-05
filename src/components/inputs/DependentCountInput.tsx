import { Pressable, Text, View } from "react-native";

import { NgaiMiuPlaceholder } from "@/src/components/mascot/NgaiMiuPlaceholder";
import {
  MAX_DEPENDENTS,
  MIN_DEPENDENTS,
  clampDependents,
} from "@/src/domain/constants/dependents";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  value: number;
  onChange: (next: number) => void;
};

export function DependentCountInput({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  const safe = clampDependents(value);

  const dec = () => onChange(clampDependents(safe - 1));
  const inc = () => onChange(clampDependents(safe + 1));

  return (
    <View style={styles.wrap} accessibilityLabel="Số người phụ thuộc">
      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giảm số người phụ thuộc"
          disabled={safe <= MIN_DEPENDENTS}
          onPress={dec}
          style={[styles.btn, safe <= MIN_DEPENDENTS && styles.btnDisabled]}
        >
          <Text style={styles.btnLabel}>−</Text>
        </Pressable>
        <Text
          style={styles.value}
          accessibilityLabel={`${safe} người phụ thuộc`}
        >
          {safe}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tăng số người phụ thuộc"
          disabled={safe >= MAX_DEPENDENTS}
          onPress={inc}
          style={[styles.btn, safe >= MAX_DEPENDENTS && styles.btnDisabled]}
        >
          <Text style={styles.btnLabel}>+</Text>
        </Pressable>
      </View>
      <View style={styles.tipRow}>
        <NgaiMiuPlaceholder
          size={48}
          pose="confused"
          accessibilityLabel="Ngài Miu"
        />
        <Text style={styles.tip}>
          Điều kiện NPT theo luật; mỗi NPT chỉ giảm trừ một lần. App giới hạn{" "}
          {MAX_DEPENDENTS} người (không lưu tên/ngày sinh).
        </Text>
      </View>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: {
      gap: space[3],
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[4],
    },
    btn: {
      minWidth: layout.minTouch,
      minHeight: layout.minTouch,
      borderRadius: radii.md,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    btnDisabled: {
      opacity: 0.4,
    },
    btnLabel: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 22,
      color: colors.white,
    },
    value: {
      minWidth: 48,
      textAlign: "center",
      fontFamily: typography.fontFamily.extraBold,
      fontSize: 28,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
    },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: space[3],
      backgroundColor: colors.primarySoft,
      padding: space[3],
      borderRadius: radii.lg,
    },
    tip: {
      flex: 1,
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 19,
      color: colors.foreground,
    },
  } satisfies ThemedStyleSheet;
}
