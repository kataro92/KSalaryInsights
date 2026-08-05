import { StyleSheet, Text, View } from 'react-native';

import { NgaiMiuPlaceholder, type MascotPose } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { colors, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  tip: string;
  pose?: MascotPose;
};

/** Tip beside results — small mascot guide, never overlays numeric rows. */
export function NgaiMiuTip({ tip, pose = 'tip' }: Props) {
  return (
    <View style={styles.row} accessibilityLabel={`Gợi ý từ Ngài Miu: ${tip}`}>
      <NgaiMiuPlaceholder size={56} pose={pose} accessibilityLabel="Ngài Miu" />
      <View style={styles.copy}>
        <Text style={styles.name}>Ngài Miu gợi ý</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: colors.primarySoft,
    padding: space[4],
    borderRadius: radii.lg,
  },
  copy: {
    flex: 1,
    gap: space[1],
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  tip: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foreground,
  },
});
