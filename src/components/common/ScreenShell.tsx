import { forwardRef, type ReactNode, type Ref } from "react";
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenEnter } from "@/src/components/common/ScreenEnter";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = ScrollViewProps & {
  children: ReactNode;
  accessibilityLabel?: string;
  /** Soft geometric poster decoration behind content. */
  decorated?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Apply status-bar / notch inset as paddingTop.
   * Set false on stack screens that already show a nav header.
   */
  padTopInset?: boolean;
};

/**
 * Shared screen chrome. Consistent padding, max width, optional décor.
 */
export const ScreenShell = forwardRef(function ScreenShell(
  {
    children,
    accessibilityLabel,
    decorated = false,
    style,
    contentContainerStyle,
    contentStyle,
    padTopInset = true,
    ...rest
  }: Props,
  ref: Ref<ScrollView>
) {
  const insets = useSafeAreaInsets();
  const topPad = padTopInset ? Math.max(insets.top, space[3]) : space[3];
  const styles = useThemedStyles(makeStyles);

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
          <View style={styles.decorLayer} pointerEvents="none">
            <View style={styles.blobPrimary} />
            <View style={styles.blobSecondary} />
            <View style={styles.blobAccent} />
          </View>
        ) : null}
        <ScreenEnter style={styles.enter}>{children}</ScreenEnter>
      </View>
    </ScrollView>
  );
});

function makeStyles({ colors }: ThemeContextValue) {
  return {
    scroll: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingBottom: space[10] + layout.tabBarClearance,
      flexGrow: 1,
    },
    inner: {
      paddingHorizontal: layout.pagePaddingX,
      paddingTop: space[4],
      maxWidth: layout.maxContentWidth,
      width: "100%",
      alignSelf: "center",
      position: "relative",
    },
    decorLayer: {
      ...StyleSheetAbsoluteFill,
      overflow: "hidden",
    },
    enter: {
      gap: space[5],
    },
    blobPrimary: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.primary,
      opacity: 0.14,
      top: -50,
      right: -70,
    },
    blobSecondary: {
      position: "absolute",
      width: 200,
      height: 200,
      borderRadius: 24,
      backgroundColor: colors.secondary,
      opacity: 0.12,
      top: 140,
      left: -70,
      transform: [{ rotate: "18deg" }],
    },
    blobAccent: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.accent,
      opacity: 0.1,
      top: 360,
      right: -30,
    },
  } as const;
}

/** Local absolute-fill without importing StyleSheet just for one helper. */
const StyleSheetAbsoluteFill = {
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
