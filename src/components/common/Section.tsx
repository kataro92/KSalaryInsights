import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";

import { useFontsReady } from "@/src/theme/FontsReady";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = ViewProps & {
  title: string;
  subtitle?: string;
  /** Optional control next to the title (e.g. InfoTip). */
  titleAccessory?: ReactNode;
};

/**
 * Section heading block. Title: Bold + subtitle scale (same on every screen).
 */
export function Section({
  title,
  subtitle,
  titleAccessory,
  children,
  style,
  ...rest
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const fontsReady = useFontsReady();
  const faceKey = fontsReady ? "jakarta" : "pending";

  return (
    <View style={[styles.section, style]} {...rest}>
      <View style={styles.titleRow}>
        <Text key={`section-title-${faceKey}`} style={styles.title}>
          {title}
        </Text>
        {titleAccessory ? (
          <View style={styles.accessory}>{titleAccessory}</View>
        ) : null}
      </View>
      {subtitle ? (
        <Text key={`section-sub-${faceKey}`} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    section: {
      gap: space[3],
    },
    titleRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: space[2],
      flexWrap: "wrap" as const,
    },
    title: {
      flexShrink: 0,
      maxWidth: "100%" as const,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.subtitle.fontSize,
      lineHeight: typography.scale.subtitle.lineHeight,
      color: colors.foreground,
      letterSpacing: typography.letterSpacingTight,
      paddingRight: 2,
    },
    accessory: {
      flexShrink: 0,
    },
    subtitle: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.body.fontSize,
      lineHeight: typography.scale.body.lineHeight,
      color: colors.foregroundMuted,
    },
    body: {
      gap: space[3],
    },
  };
}
