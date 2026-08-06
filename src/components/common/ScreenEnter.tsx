import { useEffect, type ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/src/theme/tokens";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Soft enter. Slight rise + fade.
 * Starts fully opaque so the first tab never looks washed out if timing races.
 */
export function ScreenEnter({ children, style }: Props) {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = 0.92;
    translateY.value = 8;
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

  return (
    <Animated.View style={[styles.root, style, animStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
});
