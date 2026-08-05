import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, space } from '@/src/theme/tokens';

type Props = {
  children: ReactNode;
  /** Extra offset when a tab bar is also present (default true for tab screens). */
  aboveTabBar?: boolean;
};

/**
 * Bottom-pinned action region for primary CTA — Flat Design muted strip, no shadow.
 */
export function StickyActionBar({ children, aboveTabBar = true }: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad =
    Math.max(insets.bottom, 8) + (aboveTabBar ? layout.tabBarClearance : space[2]);

  return (
    <View style={[styles.bar, { paddingBottom: bottomPad }]} pointerEvents="box-none">
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopWidth: 2,
    borderTopColor: colors.muted,
    paddingTop: space[3],
    paddingHorizontal: layout.pagePaddingX,
    zIndex: 10,
  },
  inner: {
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: space[2],
  },
});
