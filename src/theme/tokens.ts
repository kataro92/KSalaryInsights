/**
 * Design-system tokens. Single source of truth.
 * @see docs/product/design-system.md
 * @see specs/010-glassmorphism-ui/spec.md
 * @see docs/decisions/0006-pastel-raster-mascot.md
 */
export {
  darkColors,
  darkGlass,
  lightColors,
  lightGlass,
  type ColorTokens,
  type GlassTokens,
} from "@/src/theme/palettes";

import { lightColors, lightGlass } from "@/src/theme/palettes";

/**
 * Static light palette for module-level StyleSheets / tests.
 * UI that must follow appearance preference should use `useTheme()` instead.
 */
export const colors = lightColors;
export const glass = lightGlass;

export const radii = {
  md: 6,
  lg: 8,
  xl: 12,
  /** Soft glass panels */
  glass: 16,
  pill: 999,
} as const;

/** Spacing scale. Multiples of 4 */
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
    regular: "PlusJakartaSans_400Regular",
    medium: "PlusJakartaSans_500Medium",
    semiBold: "PlusJakartaSans_600SemiBold",
    bold: "PlusJakartaSans_700Bold",
    extraBold: "PlusJakartaSans_800ExtraBold",
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
  /** Extra bottom inset so content clears the translucent tab bar. */
  tabBarClearance: 56,
  stickyBarHeight: 72,
} as const;
