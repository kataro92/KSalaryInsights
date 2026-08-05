import { useEffect, useState, type ReactNode } from 'react';
import {
 AccessibilityInfo,
 Platform,
 StyleSheet,
 View,
 type StyleProp,
 type ViewProps,
 type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/src/theme/ThemeProvider';
import { radii } from '@/src/theme/tokens';
import type { GlassTokens } from '@/src/theme/palettes';

export type GlassIntensity = 'thin' | 'regular' | 'thick';

type Props = ViewProps & {
 children?: ReactNode;
 intensity?: GlassIntensity;
 /** Optional tinted fill override (e.g. Seasonal peach). */
 tintColor?: string;
 style?: StyleProp<ViewStyle>;
 contentStyle?: StyleProp<ViewStyle>;
 /** Force solid fallback (tests / known-janky surfaces). */
 forceSolid?: boolean;
};

function fillFor(glass: GlassTokens): Record<GlassIntensity, string> {
 return {
 thin: glass.thinFill,
 regular: glass.regularFill,
 thick: glass.thickFill,
 };
}

function blurFor(glass: GlassTokens): Record<GlassIntensity, number> {
 return {
 thin: glass.blurThin,
 regular: glass.blurRegular,
 thick: glass.blurThick,
 };
}

/**
 * Frosted glass chrome. Blur + tint + light edge.
 * Falls back to solid white when Reduce Transparency is on, or forceSolid.
 * @see specs/010-glassmorphism-ui/spec.md
 */
export function GlassSurface({
 children,
 intensity = 'regular',
 tintColor,
 style,
 contentStyle,
 forceSolid = false, ...rest
}: Props) {
 const { glass, isDark } = useTheme();
 const [reduceTransparency, setReduceTransparency] = useState(false);

 useEffect(() => {
 let alive = true;
 void AccessibilityInfo.isReduceTransparencyEnabled?.().then((v) => {
 if (alive) setReduceTransparency(Boolean(v));
 });
 const sub = AccessibilityInfo.addEventListener?.(
 'reduceTransparencyChanged',
 (v: boolean) => setReduceTransparency(Boolean(v)),
 );
 return () => {
 alive = false;
 // RN typings differ across versions
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 (sub as any)?.remove?.();
 };
 }, []);

 const useSolid = forceSolid || reduceTransparency || Platform.OS === 'web';
 const FILL = fillFor(glass);
 const BLUR = blurFor(glass);
 const fill = tintColor ?? FILL[intensity];
 const radius = radii.glass;

 if (useSolid) {
 return (
 <View
 style={[
 styles.base,
 {
 backgroundColor: glass.fallback,
 borderColor: glass.borderStrong,
 borderRadius: radius,
 },
 style,
 ]}
 { ...rest}
 >
 <View style={[styles.content, contentStyle]}>{children}</View>
 </View>
 );
 }

 return (
 <View
 style={[styles.base, { borderRadius: radius, borderColor: glass.border }, style]}
 { ...rest}
 >
 <BlurView
 intensity={BLUR[intensity]}
 tint={isDark ? 'dark' : 'light'}
 style={StyleSheet.absoluteFill}
 />
 <View
 pointerEvents="none"
 style={[StyleSheet.absoluteFill, { backgroundColor: fill, borderRadius: radius }]}
 />
 <View style={[styles.content, contentStyle]}>{children}</View>
 </View>
 );
}

const styles = StyleSheet.create({
 base: {
 overflow: 'hidden',
 borderWidth: StyleSheet.hairlineWidth * 2,
 },
 content: {
 position: 'relative',
 },
});
