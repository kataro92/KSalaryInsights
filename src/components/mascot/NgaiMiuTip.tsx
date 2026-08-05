import { Text, View } from "react-native";

import { GlassSurface } from "@/src/components/common/GlassSurface";
import {
  NgaiMiuPlaceholder,
  type MascotPose,
} from "@/src/components/mascot/NgaiMiuPlaceholder";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  tip: string;
  pose?: MascotPose;
};

/** Tip beside results. Glass chrome, never overlays numeric rows. */
export function NgaiMiuTip({ tip, pose = "tip" }: Props) {
  const { glass } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <GlassSurface
      intensity="regular"
      tintColor={glass.primaryFill}
      contentStyle={styles.row}
      accessibilityLabel={`Gợi ý từ Ngài Miu: ${tip}`}
    >
      <NgaiMiuPlaceholder size={56} pose={pose} accessibilityLabel="Ngài Miu" />
      <View style={styles.copy}>
        <Text style={styles.name}>Ngài Miu gợi ý</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </GlassSurface>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[3],
      padding: space[4],
    },
    copy: {
      flex: 1,
      gap: space[1],
    },
    name: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.caption.fontSize,
      letterSpacing: typography.letterSpacingLabel,
      textTransform: "uppercase",
      color: colors.primary,
    },
    tip: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      lineHeight: 21,
      color: colors.foreground,
    },
  } as const;
}
