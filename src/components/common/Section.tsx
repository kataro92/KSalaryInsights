import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { colors, space, typography } from '@/src/theme/tokens';

type Props = ViewProps & {
  title: string;
  subtitle?: string;
};

export function Section({ title, subtitle, children, style, ...rest }: Props) {
  return (
    <View style={[styles.section, style]} {...rest}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space[3],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.foreground,
    letterSpacing: typography.letterSpacingTight,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
    opacity: 0.72,
  },
  body: {
    gap: space[3],
  },
});
