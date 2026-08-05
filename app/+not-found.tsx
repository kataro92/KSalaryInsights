import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export default function NotFoundScreen() {
  const styles = useThemedStyles(makeStyles);
  return (
    <>
      <Stack.Screen options={{ title: "Không tìm thấy" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy màn hình</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Về trang chính</Text>
        </Link>
      </View>
    </>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      padding: space[6],
    },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 20,
      color: colors.foreground,
    },
    link: {
      marginTop: space[4],
      minHeight: 44,
      justifyContent: "center",
    },
    linkText: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 16,
      color: colors.primary,
    },
  } satisfies ThemedStyleSheet;
}
