import { ActivityIndicator, Text, View } from "react-native";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  label?: string;
};

export function InlineLoading({ label = "Đang tải…" }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[3],
      minHeight: 44,
    },
    label: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      color: colors.foreground,
    },
  } as const;
}
