import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/**
 * Expand/collapse block for advanced fields or legal sources.
 */
export function CollapseSection({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <Text style={styles.title}>{title}</Text>
        {open ? (
          <ChevronUp color={colors.foregroundMuted} size={20} strokeWidth={2.2} />
        ) : (
          <ChevronDown color={colors.foregroundMuted} size={20} strokeWidth={2.2} />
        )}
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  header: {
    minHeight: layout.minTouch + 8,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
  },
  pressed: {
    opacity: 0.88,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
  },
  body: {
    paddingHorizontal: space[4],
    paddingBottom: space[4],
    gap: space[4],
  },
});
