import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AppIcon } from "@/src/components/common/AppIcon";
import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  legalSources: string[];
  /** Collapse legal source list by default (AAA: non-blocking). */
  collapseSources?: boolean;
};

export function DisclaimerFooter({
  legalSources,
  collapseSources = false,
}: Props) {
  const [open, setOpen] = useState(!collapseSources);
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer và nguồn pháp lý">
      <Text style={styles.title}>
        Ước tính, không thay thế tư vấn chính thức
      </Text>
      <Text style={styles.body}>
        Kết quả chỉ mang tính hỗ trợ. Đối chiếu văn bản gốc và tư vấn thuế/kế
        toán trước khi quyết định.
      </Text>
      {legalSources.length > 0 ? (
        <View style={styles.sources}>
          {collapseSources ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => setOpen((v) => !v)}
              style={styles.sourcesToggle}
            >
              <Text style={styles.sourcesTitle}>Nguồn tham số đang dùng</Text>
              {open ? (
                <AppIcon name="chevron-up" color={colors.primary} size={18} />
              ) : (
                <AppIcon name="chevron-down" color={colors.primary} size={18} />
              )}
            </Pressable>
          ) : (
            <Text style={styles.sourcesTitle}>Nguồn tham số đang dùng</Text>
          )}
          {open
            ? legalSources.map((s) => (
                <BulletLine key={s} style={styles.sourceItem}>
                  {s}
                </BulletLine>
              ))
            : null}
        </View>
      ) : null}
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      marginBottom: space[2],
    },
    body: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.label.fontSize,
      lineHeight: 20,
      color: colors.foreground,
      opacity: 0.8,
    },
    sources: {
      marginTop: space[4],
      gap: space[1],
    },
    sourcesToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: layout.minTouch,
      marginBottom: space[1],
    },
    sourcesTitle: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.caption.fontSize,
      letterSpacing: typography.letterSpacingLabel,
      textTransform: "uppercase",
      color: colors.primary,
      marginBottom: space[1],
    },
    sourceItem: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.75,
    },
  } as const;
}
