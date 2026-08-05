import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NgaiMiuPlaceholder, type MascotPose } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  tip: string;
  pose?: MascotPose;
};

/** Tip beside results — small mascot, never overlays numeric rows. */
export function NgaiMiuTip({ tip, pose = 'tip' }: Props) {
  return (
    <View style={styles.row} accessibilityLabel={`Gợi ý từ Ngài Miu: ${tip}`}>
      <NgaiMiuPlaceholder size={48} pose={pose} accessibilityLabel="Ngài Miu" />
      <Text style={styles.tip}>{tip}</Text>
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
    borderRadius: 8,
  },
  tip: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foreground,
  },
});
