import { StyleSheet, Text, View } from 'react-native';

import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { brand } from '@/src/copy/miu';
import { useI18n } from '@/src/i18n/useI18n';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Props = {
  visible: boolean;
};

export function SplashView({ visible }: Props) {
  const { t } = useI18n();
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
        size={200}
        pose="splash"
        accessibilityLabel="Ngài Miu chào bạn"
      />
      <Text style={styles.brand}>{brand.name}</Text>
      <Text style={styles.guide}>{t('brand.guideLine')}</Text>
      <Text style={styles.tagline}>{t('brand.tagline')}</Text>
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
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    opacity: 0.1,
    top: 64,
    right: -72,
  },
  decorSquare: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: colors.secondary,
    opacity: 0.1,
    bottom: 88,
    left: -48,
    transform: [{ rotate: '18deg' }],
  },
  brand: {
    marginTop: space[5],
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
