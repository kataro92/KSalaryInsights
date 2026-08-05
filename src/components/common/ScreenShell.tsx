import {
  forwardRef,
  type ReactNode,
  type Ref,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, space } from '@/src/theme/tokens';

type Props = ScrollViewProps & {
  children: ReactNode;
  accessibilityLabel?: string;
  /** Soft geometric poster decoration behind content. */
  decorated?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared screen chrome — consistent padding, max width, optional décor.
 */
export const ScreenShell = forwardRef(function ScreenShell(
  {
    children,
    accessibilityLabel,
    decorated = false,
    style,
    contentContainerStyle,
    contentStyle,
    ...rest
  }: Props,
  ref: Ref<ScrollView>,
) {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, space[3]);

  return (
    <ScrollView
      ref={ref}
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      <View style={[styles.inner, contentStyle, style]}>
        {decorated ? (
          <>
            <View style={styles.blobPrimary} pointerEvents="none" />
            <View style={styles.blobSecondary} pointerEvents="none" />
          </>
        ) : null}
        {children}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingBottom: space[10] + layout.tabBarClearance,
    flexGrow: 1,
  },
  inner: {
    paddingHorizontal: layout.pagePaddingX,
    paddingTop: space[4],
    gap: space[5],
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  blobPrimary: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.07,
    top: -40,
    right: -60,
  },
  blobSecondary: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    opacity: 0.06,
    top: 120,
    left: -50,
    transform: [{ rotate: '18deg' }],
  },
});
