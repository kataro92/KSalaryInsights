import { StyleSheet, Text, View } from 'react-native';

import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { brand } from '@/src/copy/miu';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Props = {
  visible: boolean;
};

export function SplashView({ visible }: Props) {
  if (!visible) return null;

  return (
    <View
      style={styles.root}
      accessibilityRole="summary"
      accessibilityLabel={`Màn hình chào ${brand.name}`}
    >
      <View style={styles.decorCircle} />
      <View style={styles.decorSquare} />
      <NgaiMiuPlaceholder
        size={140}
        pose="wave"
        accessibilityLabel="Ngài Miu chào bạn"
      />
      <Text style={styles.brand}>{brand.name}</Text>
      <Text style={styles.guide}>{brand.guideLine}</Text>
      <Text style={styles.tagline}>{brand.tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.pagePaddingX,
    zIndex: 20,
  },
  decorCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.08,
    top: 80,
    right: -60,
  },
  decorSquare: {
    position: 'absolute',
    width: 160,
    height: 160,
    backgroundColor: colors.secondary,
    opacity: 0.08,
    bottom: 100,
    left: -40,
    transform: [{ rotate: '18deg' }],
  },
  brand: {
    marginTop: space[6],
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 32,
    color: colors.foreground,
    letterSpacing: typography.letterSpacingTight,
  },
  guide: {
    marginTop: space[2],
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  tagline: {
    marginTop: space[1],
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foregroundMuted,
  },
});
