import { StyleSheet, Text, View } from 'react-native';

import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { colors, radii, space, typography } from '@/src/theme/tokens';

type Variant = 'empty' | 'error';

type Props = {
  title: string;
  body?: string;
  variant?: Variant;
  accessibilityLabel?: string;
};

/**
 * Empty / validation error beat with Ngài Miu pose ⑤ (confused).
 * Never overlays numeric result rows — use above or instead of results.
 */
export function EmptyErrorState({
  title,
  body,
  variant = 'empty',
  accessibilityLabel,
}: Props) {
  const isError = variant === 'error';
  return (
    <View
      style={[styles.root, isError ? styles.errorBg : styles.emptyBg]}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel ?? `${title}${body ? `. ${body}` : ''}`}
    >
      <NgaiMiuPlaceholder
        size={72}
        pose="confused"
        accessibilityLabel="Ngài Miu"
      />
      <View style={styles.copy}>
        <Text style={[styles.title, isError && styles.errorTitle]}>{title}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
    borderRadius: radii.lg,
  },
  emptyBg: {
    backgroundColor: colors.muted,
  },
  errorBg: {
    backgroundColor: colors.dangerSoft,
  },
  copy: {
    flex: 1,
    gap: space[1],
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
  },
  errorTitle: {
    color: colors.danger,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.label.fontSize,
    lineHeight: 18,
    color: colors.foregroundMuted,
  },
});
