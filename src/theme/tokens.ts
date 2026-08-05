/**
 * Design-system tokens — single source of truth.
 * @see docs/product/design-system.md
 */
export const colors = {
  background: '#FFFFFF',
  foreground: '#111827',
  primary: '#3B82F6',
  primaryPressed: '#2563EB',
  secondary: '#10B981',
  accent: '#F59E0B',
  muted: '#F3F4F6',
  mutedPressed: '#E5E7EB',
  border: '#E5E7EB',
  primarySoft: '#EFF6FF',
  secondarySoft: '#ECFDF5',
  /** Inactive chrome (tabs, hints) — softer than foreground. */
  foregroundMuted: '#6B7280',
  white: '#FFFFFF',
} as const;

export const radii = {
  md: 6,
  lg: 8,
} as const;

/** Spacing scale — multiples of 4 */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const typography = {
  fontFamily: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semiBold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    extraBold: 'Outfit_800ExtraBold',
  },
  letterSpacingTight: -0.32,
} as const;

export const motion = {
  interactionMs: 200,
  transitionMs: 300,
  loadingDelayMs: 150,
  splashMaxMs: 3000,
  splashBrandMs: 2000,
} as const;

export const layout = {
  pagePaddingX: 20,
  maxContentWidth: 720,
  minTouch: 44,
} as const;
