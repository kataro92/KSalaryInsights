import { useEffect } from "react";
import type { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/src/theme/ThemeProvider";
import { motion } from "@/src/theme/tokens";

type Props = {
  children: ReactNode;
  /** When true, icon scales up slightly (active tab). */
  focused: boolean;
};

/** Tab bar icon with snappy scale on focus. Intentional motion beat. */
export function TabBarIcon({ children, focused }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(focused ? 1.08 : 1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.08 : 1, {
      duration: motion.interactionMs,
    });
  }, [focused, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          paddingHorizontal: 12,
          paddingVertical: 2,
          borderRadius: 12,
          backgroundColor: focused ? colors.primarySoft : "transparent",
          borderBottomWidth: focused ? 2 : 0,
          borderBottomColor: colors.primary,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
