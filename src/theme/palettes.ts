/**
 * Color & glass palettes for light / dark appearance.
 * @see docs/product/design-system.md
 * @see specs/010-glassmorphism-ui/spec.md
 */

export type ColorTokens = {
  background: string;
  foreground: string;
  foregroundMuted: string;
  onPrimary: string;
  onSecondary: string;
  onResult: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  secondary: string;
  secondaryForeground: string;
  secondarySoft: string;
  accent: string;
  accentSoft: string;
  muted: string;
  mutedPressed: string;
  border: string;
  white: string;
  danger: string;
  dangerSoft: string;
  cta: string;
  resultPositive: string;
  deduction: string;
};

export type GlassTokens = {
  thinFill: string;
  regularFill: string;
  thickFill: string;
  accentFill: string;
  secondaryFill: string;
  primaryFill: string;
  border: string;
  borderStrong: string;
  fallback: string;
  fallbackMuted: string;
  blurThin: number;
  blurRegular: number;
  blurThick: number;
};

/** Light: pastel sky · soft cobalt · soft mint */
export const lightColors: ColorTokens = {
  background: "#F7FAFF",
  foreground: "#243B53",
  foregroundMuted: "#52667F",
  onPrimary: "#FFFFFF",
  onSecondary: "#102E29",
  onResult: "#102E29",
  primary: "#3465B4",
  primaryPressed: "#295493",
  primarySoft: "#E8F1FC",
  secondary: "#5AAE9B",
  secondaryForeground: "#246354",
  secondarySoft: "#E6F6F1",
  accent: "#995B2C",
  accentSoft: "#FFF3EA",
  muted: "#EEF3F9",
  mutedPressed: "#E0E8F2",
  border: "#D8E2EF",
  white: "#FFFFFF",
  danger: "#B33939",
  dangerSoft: "#FDECEC",
  cta: "#3465B4",
  resultPositive: "#5AAE9B",
  deduction: "#243B53",
};

/** Dark: deep navy canvas · brighter cobalt/mint for AA on dark */
export const darkColors: ColorTokens = {
  background: "#0F1724",
  foreground: "#E8EEF7",
  foregroundMuted: "#9AA8BC",
  onPrimary: "#0F1724",
  onSecondary: "#0F1724",
  onResult: "#0F1724",
  primary: "#6B9BEF",
  primaryPressed: "#6192E5",
  primarySoft: "#1A2A44",
  secondary: "#6BC4B0",
  secondaryForeground: "#6BC4B0",
  secondarySoft: "#16352F",
  accent: "#E5A97A",
  accentSoft: "#3A2A1E",
  muted: "#1A2436",
  mutedPressed: "#243247",
  border: "#2A3A52",
  white: "#FFFFFF",
  danger: "#E57373",
  dangerSoft: "#3A1F1F",
  cta: "#6B9BEF",
  resultPositive: "#6BC4B0",
  deduction: "#E8EEF7",
};

export const lightGlass: GlassTokens = {
  thinFill: "rgba(255,255,255,0.42)",
  regularFill: "rgba(255,255,255,0.55)",
  thickFill: "rgba(255,255,255,0.72)",
  accentFill: "rgba(255,243,234,0.55)",
  secondaryFill: "rgba(230,246,241,0.55)",
  primaryFill: "rgba(232,241,252,0.55)",
  border: "rgba(255,255,255,0.58)",
  borderStrong: "rgba(255,255,255,0.72)",
  fallback: "#FFFFFF",
  fallbackMuted: "#F7FAFF",
  blurThin: 16,
  blurRegular: 18,
  blurThick: 20,
};

export const darkGlass: GlassTokens = {
  thinFill: "rgba(26,36,54,0.72)",
  regularFill: "rgba(26,36,54,0.82)",
  thickFill: "rgba(26,36,54,0.92)",
  accentFill: "rgba(58,42,30,0.75)",
  secondaryFill: "rgba(22,53,47,0.75)",
  primaryFill: "rgba(26,42,68,0.75)",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.18)",
  fallback: "#1A2436",
  fallbackMuted: "#0F1724",
  blurThin: 18,
  blurRegular: 20,
  blurThick: 22,
};
