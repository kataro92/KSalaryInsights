import { View, type ViewProps } from "react-native";

import { GlassSurface } from "@/src/components/common/GlassSurface";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { radii, space } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Tone = "default" | "primarySoft" | "secondarySoft" | "muted";

type Props = ViewProps & {
  tone?: Tone;
  /**
   * Opt-in frosted panel (spec 010). Default solid. Keep forms/results opaque.
   * Prefer GlassSurface directly for chrome; use this for rare soft callouts only.
   */
  glass?: boolean;
};

export function ColorBlock({
  tone = "default",
  glass: useGlass = false,
  style,
  children,
  ...rest
}: Props) {
  const { colors, glass } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const toneBg: Record<Tone, string> = {
    default: colors.white,
    primarySoft: colors.primarySoft,
    secondarySoft: colors.secondarySoft,
    muted: colors.muted,
  };

  const toneGlass: Record<Tone, string | undefined> = {
    default: undefined,
    primarySoft: glass.primaryFill,
    secondarySoft: glass.secondaryFill,
    muted: glass.regularFill,
  };

  if (useGlass) {
    return (
      <GlassSurface
        intensity="regular"
        tintColor={toneGlass[tone]}
        style={style}
        contentStyle={styles.block}
        {...rest}
      >
        {children}
      </GlassSurface>
    );
  }

  return (
    <View
      style={[styles.block, { backgroundColor: toneBg[tone] }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

function makeStyles(_theme: ThemeContextValue) {
  return {
    block: {
      borderRadius: radii.lg,
      padding: space[6],
    },
  } as const;
}
