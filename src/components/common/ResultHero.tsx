import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { InfoTip } from "@/src/components/common/InfoTip";
import type { TipId } from "@/src/i18n/types";
import type { ColorTokens } from "@/src/theme/palettes";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { formatVnd, moneyAccessibilityLabel } from "@/src/theme/money";
import { motion, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Tone = "positive" | "primary" | "muted";

type Props = {
  label?: string;
  eyebrow?: string;
  amount: number;
  /** Animate amount on mount / amount change (≤ countUpMs). */
  animate?: boolean;
  accessibilityLabel?: string;
  /** positive = mint Net; primary = cobalt pay-more; muted = soft surface. */
  tone?: Tone;
  /** Optional info tip next to the eyebrow. */
  tipId?: TipId;
};

function toneStylesFor(colors: ColorTokens): Record<
  Tone,
  {
    root: { backgroundColor: string };
    text: { color: string };
    eyebrowOpacity: number;
  }
> {
  return {
    positive: {
      root: { backgroundColor: colors.resultPositive },
      text: { color: colors.white },
      eyebrowOpacity: 0.88,
    },
    primary: {
      root: { backgroundColor: colors.primary },
      text: { color: colors.white },
      eyebrowOpacity: 0.88,
    },
    muted: {
      root: { backgroundColor: colors.muted },
      text: { color: colors.foreground },
      eyebrowOpacity: 0.75,
    },
  };
}

/**
 * Poster-level result block. Net / hoàn thuế / quyền lợi peak.
 */
export function ResultHero({
  label = "Net",
  eyebrow = "Thực nhận",
  amount,
  animate = true,
  accessibilityLabel,
  tone = "positive",
  tipId,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const [display, setDisplay] = useState(animate ? 0 : amount);
  const palette = toneStylesFor(colors)[tone];

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 8;
    opacity.value = withTiming(1, {
      duration: motion.transitionMs,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(0, {
      duration: motion.transitionMs,
      easing: Easing.out(Easing.cubic),
    });

    if (!animate) {
      setDisplay(amount);
      return;
    }

    const start = performance.now();
    const from = 0;
    const to = amount;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / motion.countUpMs);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [amount, animate, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconColor = tone === "muted" ? colors.foregroundMuted : colors.white;

  return (
    <Animated.View
      style={[styles.root, palette.root, animStyle]}
      accessibilityLabel={
        accessibilityLabel ??
        moneyAccessibilityLabel(amount, `${eyebrow} ${label}`)
      }
    >
      <View style={styles.eyebrowRow}>
        <Text
          style={[
            styles.eyebrow,
            palette.text,
            { opacity: palette.eyebrowOpacity },
          ]}
        >
          {eyebrow}
        </Text>
        {tipId ? <InfoTip tipId={tipId} color={iconColor} size={16} /> : null}
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, palette.text]}>{label}</Text>
        <Text
          style={[styles.amount, palette.text]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {formatVnd(display)}
        </Text>
      </View>
    </Animated.View>
  );
}

function makeStyles(_theme: ThemeContextValue) {
  return {
    root: {
      borderRadius: radii.lg,
      paddingVertical: space[5],
      paddingHorizontal: space[5],
    },
    eyebrowRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[2],
      marginBottom: space[2],
    },
    eyebrow: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.caption.fontSize,
      letterSpacing: typography.letterSpacingLabel,
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: space[3],
    },
    label: {
      flexShrink: 1,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.subtitle.fontSize,
    },
    amount: {
      flexShrink: 1,
      flexGrow: 1,
      minWidth: 0,
      fontFamily: typography.fontFamily.extraBold,
      fontSize: typography.scale.moneyLg.fontSize,
      lineHeight: typography.scale.moneyLg.lineHeight,
      fontVariant: ["tabular-nums"],
      textAlign: "right",
    },
  } satisfies ThemedStyleSheet;
}
