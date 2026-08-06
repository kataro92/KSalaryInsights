import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = ViewProps & {
  title: string;
  subtitle?: string;
  /** Optional control next to the title (e.g. InfoTip). */
  titleAccessory?: ReactNode;
};

export function Section({
  title,
  subtitle,
  titleAccessory,
  children,
  style,
  ...rest
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.section, style]} {...rest}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {titleAccessory}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
      flexDirection: "row",
      alignItems: "center",
      gap: space[2],
      flexWrap: "wrap",
    },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 20,
      color: colors.foreground,
      letterSpacing: typography.letterSpacingTight,
      flexShrink: 1,
    },
    subtitle: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      color: colors.foreground,
      opacity: 0.72,
    },
    body: {
      gap: space[3],
    },
  } as const;
}
