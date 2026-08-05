import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/src/theme/tokens';

export type MascotPose = 'wave' | 'confused';

type Props = {
  size?: number;
  pose?: MascotPose;
  accessibilityLabel?: string;
};

/**
 * Flat geometric placeholder for "Ngài Miu" (tuxedo cat + round glasses).
 * Replace with official pose assets when available.
 */
export function NgaiMiuPlaceholder({
  size = 120,
  pose = 'wave',
  accessibilityLabel = 'Ngài Miu',
}: Props) {
  const stroke = colors.foreground;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Body tuxedo */}
      <Ellipse cx="60" cy="88" rx="28" ry="22" fill={stroke} />
      <Ellipse cx="60" cy="90" rx="14" ry="16" fill={colors.white} />
      {/* Head */}
      <Circle cx="60" cy="48" r="28" fill={stroke} />
      <Ellipse cx="60" cy="54" rx="16" ry="14" fill={colors.white} />
      {/* Ears */}
      <Path d="M38 32 L30 12 L48 28 Z" fill={stroke} />
      <Path d="M82 32 L90 12 L72 28 Z" fill={stroke} />
      {/* Glasses */}
      <Circle cx="48" cy="48" r="10" fill="none" stroke={colors.primary} strokeWidth="3" />
      <Circle cx="72" cy="48" r="10" fill="none" stroke={colors.primary} strokeWidth="3" />
      <Path d="M58 48 H62" stroke={colors.primary} strokeWidth="3" />
      {/* Eyes */}
      <Circle cx="48" cy="48" r="3" fill={stroke} />
      <Circle cx="72" cy="48" r="3" fill={stroke} />
      {/* Bow tie */}
      <Path d="M52 74 L60 70 L68 74 L60 78 Z" fill={colors.accent} />
      {/* Pose accent */}
      {pose === 'wave' ? (
        <Path
          d="M88 70 Q102 58 108 42"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <Rect x="54" y="62" width="12" height="3" rx="1" fill={stroke} opacity={0.35} />
      )}
    </Svg>
  );
}
