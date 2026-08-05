import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassSurface } from "@/src/components/common/GlassSurface";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  children: ReactNode;
  /** Extra offset when a tab bar is also present (default true for tab screens). */
  aboveTabBar?: boolean;
};

/**
 * Bottom-pinned action region. Glass thin strip over content (spec 010).
 */
export function StickyActionBar({ children, aboveTabBar = true }: Props) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const bottomPad =
    Math.max(insets.bottom, 8) +
    (aboveTabBar ? layout.tabBarClearance : space[2]);

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <GlassSurface
        intensity="thin"
        style={styles.glass}
        contentStyle={[styles.bar, { paddingBottom: bottomPad }]}
      >
        <View style={styles.inner}>{children}</View>
      </GlassSurface>
    </View>
  );
}

function makeStyles({ glass }: ThemeContextValue) {
  return {
    wrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    },
    glass: {
      borderRadius: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderTopWidth: StyleSheet.hairlineWidth * 2,
      borderColor: glass.border,
    },
    bar: {
      paddingTop: space[3],
      paddingHorizontal: layout.pagePaddingX,
    },
    inner: {
      maxWidth: layout.maxContentWidth,
      width: "100%",
      alignSelf: "center",
      gap: space[2],
    },
  } as const;
}
