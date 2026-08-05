import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { formatVnd, moneyAccessibilityLabel } from '@/src/theme/money';
import { colors, motion, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  label?: string;
  eyebrow?: string;
  amount: number;
  /** Animate amount on mount / amount change (≤ countUpMs). */
  animate?: boolean;
  accessibilityLabel?: string;
};

/**
 * Poster-level result block — Net / hoàn thuế / quyền lợi peak.
 */
export function ResultHero({
  label = 'Net',
  eyebrow = 'Thực nhận',
  amount,
  animate = true,
  accessibilityLabel,
}: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const [display, setDisplay] = useState(animate ? 0 : amount);

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

  return (
    <Animated.View
      style={[styles.root, animStyle]}
      accessibilityLabel={
        accessibilityLabel ?? moneyAccessibilityLabel(amount, `${eyebrow} ${label}`)
      }
    >
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>{formatVnd(display)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.resultPositive,
    borderRadius: radii.lg,
    paddingVertical: space[5],
    paddingHorizontal: space[5],
  },
  eyebrow: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.white,
    opacity: 0.88,
    marginBottom: space[2],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[3],
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.scale.subtitle.fontSize,
    color: colors.white,
  },
  amount: {
    flexShrink: 1,
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.scale.moneyLg.fontSize,
    lineHeight: typography.scale.moneyLg.lineHeight,
    color: colors.white,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
