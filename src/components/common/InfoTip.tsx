import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { AppIcon } from "@/src/components/common/AppIcon";
import { BulletLine } from "@/src/components/common/BulletLine";
import { GlassSurface } from "@/src/components/common/GlassSurface";
import { useI18n } from "@/src/i18n/useI18n";
import type { TipId } from "@/src/i18n/types";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  tipId: TipId;
  /** Icon color. Default muted ink. */
  color?: string;
  size?: number;
};

/**
 * Info control. Rich sheet: summary, formula, detail, legal sources.
 */
export function InfoTip({ tipId, color, size = 16 }: Props) {
  const { t, tip } = useI18n();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [open, setOpen] = useState(false);
  const content = tip(tipId);
  const iconColor = color ?? colors.foregroundMuted;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t("common.info")}: ${content.title}`}
        hitSlop={10}
        onPress={() => setOpen(true)}
        style={styles.hit}
      >
        <AppIcon
          name="info"
          color={iconColor}
          size={size}
          accessibilityLabel={t("common.info")}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.sheetWrap}
          >
            <GlassSurface intensity="thick" contentStyle={styles.sheet}>
              <Text style={styles.title}>{content.title}</Text>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.body}>{content.body}</Text>

                {content.formula ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeading}>
                      {t("common.formula")}
                    </Text>
                    <View style={styles.formulaBox}>
                      <Text style={styles.formula}>{content.formula}</Text>
                    </View>
                  </View>
                ) : null}

                {content.detail ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeading}>
                      {t("common.detail")}
                    </Text>
                    <Text style={styles.detail}>{content.detail}</Text>
                  </View>
                ) : null}

                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>
                    {t("common.sources")}
                  </Text>
                  {content.sources.map((s) => (
                    <BulletLine key={s} style={styles.source}>
                      {s}
                    </BulletLine>
                  ))}
                </View>
              </ScrollView>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("common.close")}
                onPress={() => setOpen(false)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeLabel}>{t("common.close")}</Text>
              </Pressable>
            </GlassSurface>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    hit: {
      minWidth: layout.minTouch / 2,
      minHeight: layout.minTouch / 2,
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(36, 59, 83, 0.45)",
      justifyContent: "center",
      paddingHorizontal: space[4],
      paddingVertical: space[8],
    },
    sheetWrap: {
      maxHeight: "88%",
    },
    sheet: {
      padding: space[5],
      maxHeight: "100%",
    },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.subtitle.fontSize,
      lineHeight: typography.scale.subtitle.lineHeight,
      color: colors.foreground,
      marginBottom: space[3],
      paddingRight: 2,
    },
    scroll: {
      maxHeight: 420,
    },
    scrollContent: {
      paddingBottom: space[2],
      gap: space[1],
    },
    body: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 15,
      lineHeight: 22,
      color: colors.foreground,
      marginBottom: space[3],
    },
    section: {
      marginBottom: space[4],
    },
    sectionHeading: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 12,
      letterSpacing: 0.7,
      textTransform: "uppercase",
      color: colors.foregroundMuted,
      marginBottom: space[2],
    },
    formulaBox: {
      backgroundColor: colors.muted,
      borderRadius: radii.md,
      paddingVertical: space[3],
      paddingHorizontal: space[3],
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    formula: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      lineHeight: 20,
      color: colors.foreground,
    },
    detail: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      lineHeight: 21,
      color: colors.foreground,
    },
    source: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.foregroundMuted,
      marginBottom: space[1],
    },
    closeBtn: {
      marginTop: space[3],
      minHeight: layout.minTouch,
      borderRadius: radii.md,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    closeLabel: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 15,
      color: colors.white,
    },
  } as const;
}
