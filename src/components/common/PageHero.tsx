import { Text, View } from "react-native";

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
 * Consistent page intro. Brand + title + one supporting line.
 * Brand lives here (not duplicated in the nav header).
 */
export function PageHero({ title, subtitle, showBrand = true }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.hero} accessibilityRole="header">
      {showBrand ? <Text style={styles.brand}>{brand.name}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
      letterSpacing: 1.4,
      textTransform: "uppercase",
      color: colors.primary,
    },
    title: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: typography.scale.title.fontSize,
      lineHeight: typography.scale.title.lineHeight,
      letterSpacing: typography.letterSpacingTight,
      color: colors.foreground,
    },
    subtitle: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.body.fontSize,
      lineHeight: typography.scale.body.lineHeight,
      color: colors.foregroundMuted,
      maxWidth: 420,
    },
  } as const;
}
