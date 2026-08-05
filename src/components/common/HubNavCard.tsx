import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AppIcon } from "@/src/components/common/AppIcon";
import { GlassSurface } from "@/src/components/common/GlassSurface";
import type { GlassTokens } from "@/src/theme/palettes";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, motion, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Tone = "primarySoft" | "secondarySoft" | "muted" | "accentSoft";

type Props = {
  title: string;
  description: string;
  onPress: () => void;
  tone?: Tone;
  icon?: ReactNode;
  accessibilityLabel?: string;
};

function toneTintFor(glass: GlassTokens): Record<Tone, string> {
  return {
    primarySoft: glass.primaryFill,
    secondarySoft: glass.secondaryFill,
    muted: glass.regularFill,
    accentSoft: glass.accentFill,
  };
}

/**
 * Hub destination. Glass card over ambient canvas (spec 010).
 */
export function HubNavCard({
  title,
  description,
  onPress,
  tone = "muted",
  icon,
  accessibilityLabel,
}: Props) {
  const { colors, glass } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const toneTint = toneTintFor(glass);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      onPressIn={() => {
        setPressed(true);
        scale.value = withTiming(0.98, { duration: motion.interactionMs });
      }}
      onPressOut={() => {
        setPressed(false);
        scale.value = withTiming(1, { duration: motion.interactionMs });
      }}
    >
      <Animated.View style={[pressed && styles.pressedOpacity, animatedStyle]}>
        <GlassSurface
          intensity="regular"
          tintColor={toneTint[tone]}
          contentStyle={styles.card}
        >
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <View style={styles.text}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <AppIcon
            name="chevron-right"
            color={colors.foregroundMuted}
            size={20}
          />
        </GlassSurface>
      </Animated.View>
    </Pressable>
  );
}

function makeStyles({ colors, isDark }: ThemeContextValue) {
  return {
    card: {
      minHeight: layout.minTouch + 32,
      paddingVertical: space[4],
      paddingHorizontal: space[4],
      flexDirection: "row",
      alignItems: "center",
      gap: space[3],
    },
    pressedOpacity: {
      opacity: 0.92,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)",
      alignItems: "center",
      justifyContent: "center",
    },
    text: { flex: 1, gap: 4 },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 16,
      color: colors.foreground,
      letterSpacing: typography.letterSpacingTight,
    },
    description: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 18,
      color: colors.foregroundMuted,
    },
  } as const;
}
