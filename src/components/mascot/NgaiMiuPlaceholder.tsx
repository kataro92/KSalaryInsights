import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type MascotPose =
  | 'wave'
  | 'confused'
  | 'point'
  | 'tip'
  | 'empty'
  | 'bow'
  | 'docs'
  | 'icon'
  | 'splash';

type Props = {
  size?: number;
  pose?: MascotPose;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Cartoon raster assets for "Ngài Miu" (tuxedo cat + round glasses).
 * Prefer PNG/WebP illustrations over geometric SVG — warmer assistant presence.
 */
const POSE_SOURCES: Record<MascotPose, number> = {
  wave: require('../../../assets/mascot/miu-wave.png'),
  tip: require('../../../assets/mascot/miu-tip.png'),
  point: require('../../../assets/mascot/miu-point.png'),
  confused: require('../../../assets/mascot/miu-confused.png'),
  empty: require('../../../assets/mascot/miu-confused.png'),
  bow: require('../../../assets/mascot/miu-bow.png'),
  docs: require('../../../assets/mascot/miu-docs.png'),
  icon: require('../../../assets/mascot/miu-icon.png'),
  splash: require('../../../assets/mascot/miu-splash.png'),
};

export function NgaiMiuPlaceholder({
  size = 120,
  pose = 'wave',
  accessibilityLabel = 'Ngài Miu',
  style,
}: Props) {
  return (
    <View
      style={[{ width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={POSE_SOURCES[pose]}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
