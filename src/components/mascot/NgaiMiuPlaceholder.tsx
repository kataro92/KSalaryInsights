import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/src/theme/tokens';

export type MascotPose = 'wave' | 'confused' | 'point' | 'tip' | 'empty' | 'bow';

type Props = {
  size?: number;
  pose?: MascotPose;
  accessibilityLabel?: string;
};

/**
 * Flat geometric placeholder for "Ngài Miu" (tuxedo cat + round glasses).
 * Poses: wave, point, tip, empty, confused, bow — replace with official SVGs later.
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
      <Ellipse cx="60" cy="88" rx="28" ry="22" fill={stroke} />
      <Ellipse cx="60" cy="90" rx="14" ry="16" fill={colors.white} />
      <Circle cx="60" cy="48" r="28" fill={stroke} />
      <Ellipse cx="60" cy="54" rx="16" ry="14" fill={colors.white} />
      <Path d="M38 32 L30 12 L48 28 Z" fill={stroke} />
      <Path d="M82 32 L90 12 L72 28 Z" fill={stroke} />
      <Circle cx="48" cy="48" r="10" fill="none" stroke={colors.primary} strokeWidth="3" />
      <Circle cx="72" cy="48" r="10" fill="none" stroke={colors.primary} strokeWidth="3" />
      <Path d="M58 48 H62" stroke={colors.primary} strokeWidth="3" />
      <Circle cx="48" cy="48" r="3" fill={stroke} />
      <Circle cx="72" cy="48" r="3" fill={stroke} />
      <Path d="M52 74 L60 70 L68 74 L60 78 Z" fill={colors.accent} />

      {pose === 'wave' ? (
        <Path
          d="M88 70 Q102 58 108 42"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : null}
      {pose === 'point' ? (
        <>
          <Path
            d="M86 78 L108 70"
            fill="none"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Path d="M104 66 L112 70 L104 74 Z" fill={stroke} />
        </>
      ) : null}
      {pose === 'tip' ? (
        <Path
          d="M78 42 Q88 36 92 28"
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : null}
      {pose === 'confused' || pose === 'empty' ? (
        <Rect x="54" y="62" width="12" height="3" rx="1" fill={stroke} opacity={0.35} />
      ) : null}
      {pose === 'empty' ? (
        <Path
          d="M44 58 Q48 62 52 58"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : null}
      {pose === 'bow' ? (
        <Path
          d="M40 100 Q60 112 80 100"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}
