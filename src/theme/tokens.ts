/**
 * Design-system tokens — single source of truth.
 * @see docs/product/design-system.md
 * @see docs/decisions/0006-pastel-raster-mascot.md
 */
export const colors = {
  /** Soft sky wash — pastel canvas */
  background: '#F7FAFF',
  /** Soft navy ink — primary text */
  foreground: '#243B53',
  /** Muted slate for secondary copy */
  foregroundMuted: '#7B8FA6',

  /** Soft cobalt — CTA / selection (pastel, still AA on white text) */
  primary: '#4F84E0',
  primaryPressed: '#3A6BC4',
  primarySoft: '#E8F1FC',

  /** Soft mint — Net / refund / positive results */
  secondary: '#5AAE9B',
  secondarySoft: '#E6F6F1',

  /** Soft peach — seasonal / mild warning (not cream+terracotta cliché) */
  accent: '#E09B6A',
  accentSoft: '#FFF3EA',

  muted: '#EEF3F9',
  mutedPressed: '#E0E8F2',
  border: '#D8E2EF',
  white: '#FFFFFF',

  /** Errors only — not for tax deductions */
  danger: '#D45B5B',
  dangerSoft: '#FDECEC',

  /** Semantic aliases */
  cta: '#4F84E0',
  resultPositive: '#5AAE9B',
  deduction: '#243B53',
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
