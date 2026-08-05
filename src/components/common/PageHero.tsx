import { StyleSheet, Text, View } from 'react-native';

import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  /** Show product brand above the title (hero-level signal). */
  showBrand?: boolean;
};

/**
 * Consistent page intro — brand + title + one supporting line.
 * Brand lives here (not duplicated in the nav header).
 */
export function PageHero({ title, subtitle, showBrand = true }: Props) {
  return (
    <View style={styles.hero} accessibilityRole="header">
      {showBrand ? <Text style={styles.brand}>KVSalaryTools</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: space[2],
    marginBottom: space[1],
    paddingBottom: space[2],
  },
  brand: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 30,
    letterSpacing: typography.letterSpacingTight,
    color: colors.foreground,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.foregroundMuted,
    maxWidth: 420,
  },
});
