import type { ReactNode, Ref } from "react";
import { Text, View, type ScrollView } from "react-native";

import { PageHero } from "@/src/components/common/PageHero";
import { ScreenShell } from "@/src/components/common/ScreenShell";
import { StickyActionBar } from "@/src/components/common/StickyActionBar";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  title: string;
  subtitle?: string;
  showBrand?: boolean;
  /** Stack screens already have a header. Skip PageHero to avoid duplicate titles. */
  nested?: boolean;
  accessibilityLabel?: string;
  decorated?: boolean;
  children: ReactNode;
  /** Primary actions pinned above the tab/stack chrome. */
  sticky?: ReactNode;
  /** When opened from stack (no tab bar), reduce sticky bottom inset. */
  aboveTabBar?: boolean;
  scrollRef?: Ref<ScrollView>;
};

/**
 * Standard calculator chrome. PageHero + ScreenShell + optional StickyActionBar.
 */
export function ToolScreen({
  title,
  subtitle,
  showBrand = true,
  nested = false,
  accessibilityLabel,
  decorated = true,
  children,
  sticky,
  aboveTabBar = false,
  scrollRef,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.root}>
      <ScreenShell
        ref={scrollRef}
        accessibilityLabel={accessibilityLabel ?? title}
        decorated={decorated}
        contentContainerStyle={sticky ? styles.scrollWithSticky : undefined}
      >
        {nested ? (
          subtitle ? (
            <Text style={styles.nestedSubtitle}>{subtitle}</Text>
          ) : null
        ) : (
          <PageHero title={title} subtitle={subtitle} showBrand={showBrand} />
        )}
        {children}
      </ScreenShell>
      {sticky ? (
        <StickyActionBar aboveTabBar={aboveTabBar}>{sticky}</StickyActionBar>
      ) : null}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: { flex: 1, backgroundColor: colors.background },
    scrollWithSticky: {
      paddingBottom: space[12] + layout.stickyBarHeight + layout.tabBarClearance,
    },
    nestedSubtitle: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.body.fontSize,
      lineHeight: typography.scale.body.lineHeight,
      color: colors.foregroundMuted,
      marginBottom: space[1],
    },
  } as const;
}
