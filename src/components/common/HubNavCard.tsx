import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Tone = 'primarySoft' | 'secondarySoft' | 'muted' | 'accentSoft';

type Props = {
  title: string;
  description: string;
  onPress: () => void;
  tone?: Tone;
  icon?: ReactNode;
  accessibilityLabel?: string;
};

const toneBg: Record<Tone, string> = {
  primarySoft: colors.primarySoft,
  secondarySoft: colors.secondarySoft,
  muted: colors.muted,
  accentSoft: '#FFFBEB',
};

/**
 * Hub destination — Color Block pressable (Flat Design: no shadow, scale on press).
 */
export function HubNavCard({
  title,
  description,
  onPress,
  tone = 'muted',
  icon,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: toneBg[tone] },
        pressed && styles.pressed,
      ]}
    >
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <ChevronRight color={colors.foregroundMuted} size={20} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: layout.minTouch + 28,
    borderRadius: radii.lg,
    padding: space[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: space[1] },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 17,
    color: colors.foreground,
    letterSpacing: typography.letterSpacingTight,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.72,
  },
});
