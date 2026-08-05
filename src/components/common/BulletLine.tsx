import { Text, View, type StyleProp, type TextStyle } from "react-native";

import { AppIcon } from "@/src/components/common/AppIcon";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
  bulletColor?: string;
};

/** List row with PNG bullet. Replaces "•" text in UI content. */
export function BulletLine({ children, style, bulletColor }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <AppIcon
        name="bullet"
        size={8}
        color={bulletColor ?? colors.foregroundMuted}
        style={styles.bullet}
      />
      <Text style={[styles.text, style]}>{children}</Text>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: space[2],
    },
    bullet: {
      marginTop: 6,
    },
    text: {
      flex: 1,
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      lineHeight: 18,
      color: colors.foreground,
    },
  } as const;
}
