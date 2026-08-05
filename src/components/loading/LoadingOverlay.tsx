import { ActivityIndicator, Text, View } from "react-native";

import { NgaiMiuPlaceholder } from "@/src/components/mascot/NgaiMiuPlaceholder";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  visible: boolean;
  message?: string;
  showMascot?: boolean;
};

export function LoadingOverlay({
  visible,
  message = "Đang xử lý…",
  showMascot = true,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  if (!visible) return null;

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityState={{ busy: true }}
    >
      {showMascot ? (
        <NgaiMiuPlaceholder
          size={88}
          pose="confused"
          accessibilityLabel="Ngài Miu đang chờ"
        />
      ) : null}
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function makeStyles({ colors, isDark }: ThemeContextValue) {
  return {
    root: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: isDark
        ? "rgba(15,23,36,0.96)"
        : "rgba(247,250,255,0.96)",
      alignItems: "center",
      justifyContent: "center",
      padding: space[6],
      zIndex: 30,
    },
    spinner: {
      marginTop: space[4],
    },
    message: {
      marginTop: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
    },
  } as const;
}
