import { useEffect, type ReactNode } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/src/theme/tokens';

type Props = {
  children: ReactNode;
  style?: object;
};

/** Soft enter — opacity + slight rise (≤ transitionMs). */
export function ScreenEnter({ children, style }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: motion.transitionMs,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(0, {
      duration: motion.transitionMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}
