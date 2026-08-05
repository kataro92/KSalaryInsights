import { useEffect } from "react";
import type { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/src/theme/tokens";

type Props = {
  children: ReactNode;
  /** When true, icon scales up slightly (active tab). */
  focused: boolean;
};

/** Tab bar icon with snappy scale on focus. Intentional motion beat. */
export function TabBarIcon({ children, focused }: Props) {
  const scale = useSharedValue(focused ? 1.08 : 1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.08 : 1, {
      duration: motion.interactionMs,
    });
  }, [focused, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
