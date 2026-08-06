import { Text, View } from "react-native";

import { useFontsReady } from "@/src/theme/FontsReady";
import { brand } from "@/src/copy/miu";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  title: string;
  subtitle?: string;
  /** Show product brand above the title (hero-level signal). */
  showBrand?: boolean;
};

/**
 * Page intro shared by every tab root (and non-nested tools).
 * Brand + ExtraBold title + muted subtitle. Identical on all four tabs.
 */
export function PageHero({ title, subtitle, showBrand = true }: Props) {
  const styles = useThemedStyles(makeStyles);
  const fontsReady = useFontsReady();
  // Remount text nodes when faces become ready (avoids sticky system fallback).
  const faceKey = fontsReady ? "jakarta" : "pending";

  return (
    <View style={styles.hero} accessibilityRole="header">
      {showBrand ? (
        <Text key={`brand-${faceKey}`} style={styles.brand}>
          {brand.name}
        </Text>
      ) : null}
      <Text
        key={`title-${faceKey}`}
        style={styles.title}
        maxFontSizeMultiplier={1.35}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          key={`subtitle-${faceKey}`}
          style={styles.subtitle}
          maxFontSizeMultiplier={1.35}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    hero: {
      gap: space[2],
      marginBottom: space[1],
      paddingBottom: space[2],
    },
    brand: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: typography.scale.caption.fontSize,
      lineHeight: typography.scale.caption.lineHeight,
      letterSpacing: 1.4,
      textTransform: "uppercase" as const,
      color: colors.primary,
    },
    title: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: typography.scale.title.fontSize,
      lineHeight: typography.scale.title.lineHeight,
      letterSpacing: typography.letterSpacingTight,
      color: colors.foreground,
      paddingRight: 2,
    },
    subtitle: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.body.fontSize,
      lineHeight: typography.scale.body.lineHeight,
      color: colors.foregroundMuted,
      maxWidth: 420,
    },
  };
}
