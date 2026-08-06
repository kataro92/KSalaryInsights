import { Image, StyleSheet, View } from "react-native";

import { brand } from "@/src/copy/miu";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  visible: boolean;
};

/**
 * Full-bleed branded splash: Ngài Miu introducing KSalaryInsights.
 * Artwork lives in assets/images/splash-full.png (also used by native splash).
 */
export function SplashView({ visible }: Props) {
  const styles = useThemedStyles(makeStyles);
  if (!visible) return null;

  return (
    <View
      style={styles.root}
      accessibilityRole="summary"
      accessibilityLabel={`Màn hình chào ${brand.name}. Xin chào, tôi là Ngài Miu. ${brand.tagline}`}
    >
      <Image
        source={require("../../../assets/images/splash-full.png")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 20,
    },
  } as const;
}
