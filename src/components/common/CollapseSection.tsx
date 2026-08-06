import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/src/components/common/AppIcon';
import type { ThemeContextValue } from '@/src/theme/ThemeProvider';
import { useTheme } from '@/src/theme/ThemeProvider';
import { layout, radii, space, typography } from '@/src/theme/tokens';
import { useThemedStyles } from '@/src/theme/useThemedStyles';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state (overrides internal state when set). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Expand/collapse block for advanced fields or legal sources.
 */
export function CollapseSection({
  title,
  children,
  defaultOpen = false,
  open: openControlled,
  onOpenChange,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [openInternal, setOpenInternal] = useState(defaultOpen);
  const controlled = openControlled !== undefined;
  const open = controlled ? openControlled : openInternal;

  const setOpen = (next: boolean) => {
    if (!controlled) setOpenInternal(next);
    onOpenChange?.(next);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {open ? (
          <AppIcon name="chevron-up" color={colors.foregroundMuted} size={20} />
        ) : (
          <AppIcon name="chevron-down" color={colors.foregroundMuted} size={20} />
        )}
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
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
      flexShrink: 1,
      minWidth: 0,
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.body.fontSize,
      lineHeight: typography.scale.body.lineHeight,
      color: colors.foreground,
      paddingRight: 2,
    },
    body: {
      paddingHorizontal: space[4],
      paddingBottom: space[4],
      gap: space[4],
    },
  } as const;
}
