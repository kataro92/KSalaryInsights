/**
 * Design-system tokens — single source of truth.
 * @see docs/product/design-system.md
 * @see docs/decisions/0005-palette-v2-ink-cobalt-mint.md
 */
export const colors = {
  background: '#FFFFFF',
  /** Deep ink — primary text */
  foreground: '#0F172A',
  /** Soft ink for secondary copy */
  foregroundMuted: '#64748B',

  /** Cobalt — CTA / selection */
  primary: '#1D4ED8',
  primaryPressed: '#1E3A8A',
  primarySoft: '#EFF6FF',

  /** Mint — Net / refund / positive results */
  secondary: '#0F766E',
  secondarySoft: '#F0FDFA',

  /** Amber — seasonal / mild warning (not errors) */
  accent: '#B45309',
  accentSoft: '#FFFBEB',

  muted: '#F1F5F9',
  mutedPressed: '#E2E8F0',
  border: '#E2E8F0',
  white: '#FFFFFF',

  /** Errors only — not for tax deductions */
  danger: '#B91C1C',
  dangerSoft: '#FEF2F2',

  /** Semantic aliases */
  cta: '#1D4ED8',
  resultPositive: '#0F766E',
  deduction: '#0F172A',
} as const;

export const radii = {
  md: 6,
  lg: 8,
  xl: 12,
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
  12: 48,
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
  letterSpacingLabel: 0.8,
  scale: {
    display: { fontSize: 32, lineHeight: 38 },
    title: { fontSize: 28, lineHeight: 34 },
    subtitle: { fontSize: 18, lineHeight: 26 },
    body: { fontSize: 15, lineHeight: 22 },
    label: { fontSize: 13, lineHeight: 18 },
    caption: { fontSize: 12, lineHeight: 16 },
    moneyLg: { fontSize: 28, lineHeight: 34 },
    moneyMd: { fontSize: 18, lineHeight: 24 },
    moneySm: { fontSize: 14, lineHeight: 20 },
  },
} as const;

export const motion = {
  interactionMs: 200,
  transitionMs: 300,
  countUpMs: 380,
  loadingDelayMs: 150,
  splashMaxMs: 3000,
  splashBrandMs: 2000,
} as const;

export const layout = {
  pagePaddingX: 16,
  maxContentWidth: 560,
  minTouch: 44,
  /** Extra bottom inset so content clears the tab bar on mobile. */
  tabBarClearance: 24,
  stickyBarHeight: 72,
} as const;
