import { Text, View } from "react-native";

import { AppIcon } from "@/src/components/common/AppIcon";
import { BulletLine } from "@/src/components/common/BulletLine";
import { GlassSurface } from "@/src/components/common/GlassSurface";
import { getFeaturesCopy } from "@/src/copy/features";
import { useI18n } from "@/src/i18n/useI18n";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

/**
 * Settings guide. What the app does, why it helps, and which tools exist.
 */
export function FeaturesGuide() {
  const { locale, t } = useI18n();
  const { colors, glass } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const copy = getFeaturesCopy(locale);

  return (
    <View style={styles.root} accessibilityRole="summary">
      <Text style={styles.intro}>{copy.intro}</Text>

      <Text style={styles.groupTitle}>{copy.benefitsTitle}</Text>
      <View style={styles.benefits}>
        {copy.benefits.map((line) => (
          <BulletLine key={line} style={styles.benefitLine}>
            {line}
          </BulletLine>
        ))}
      </View>

      <Text style={styles.groupTitle}>{copy.toolsTitle}</Text>
      <View style={styles.tools}>
        {copy.tools.map((tool) => (
          <GlassSurface
            key={tool.id}
            intensity="regular"
            tintColor={glass.primaryFill}
            contentStyle={styles.toolRow}
            accessibilityLabel={`${tool.title}. ${tool.benefit}`}
          >
            <View style={styles.iconWrap}>
              <AppIcon name={tool.icon} color={colors.primary} size={22} />
            </View>
            <View style={styles.toolCopy}>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolBenefit}>{tool.benefit}</Text>
            </View>
          </GlassSurface>
        ))}
      </View>

      <Text style={styles.footnote}>{t("settings.featuresFootnote")}</Text>
    </View>
  );
}

function makeStyles({ colors, isDark }: ThemeContextValue) {
  return {
    root: {
      gap: space[3],
    },
    intro: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 15,
      lineHeight: 22,
      color: colors.foreground,
    },
    groupTitle: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 12,
      letterSpacing: 0.7,
      textTransform: "uppercase",
      color: colors.foregroundMuted,
      marginTop: space[2],
    },
    benefits: {
      gap: space[2],
      backgroundColor: colors.muted,
      borderRadius: radii.lg,
      padding: space[4],
    },
    benefitLine: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 14,
      lineHeight: 20,
      color: colors.foreground,
    },
    tools: {
      gap: space[2],
    },
    toolRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: space[3],
      paddingVertical: space[3],
      paddingHorizontal: space[3],
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)",
      alignItems: "center",
      justifyContent: "center",
    },
    toolCopy: {
      flex: 1,
      gap: 4,
    },
    toolTitle: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 15,
      color: colors.foreground,
    },
    toolBenefit: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 19,
      color: colors.foregroundMuted,
    },
    footnote: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 17,
      color: colors.foregroundMuted,
      marginTop: space[1],
    },
  } as const;
}
