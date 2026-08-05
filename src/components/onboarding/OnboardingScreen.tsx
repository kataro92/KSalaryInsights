import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/common/Button';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { brand, onboardingSteps } from '@/src/copy/miu';
import { saveOnboardingCompleted } from '@/src/store/onboarding';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Props = {
  onDone: () => void;
};

export function OnboardingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const step = onboardingSteps[index];
  const last = index === onboardingSteps.length - 1;

  const finish = async () => {
    await saveOnboardingCompleted();
    onDone();
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: Math.max(insets.top, space[6]), paddingBottom: Math.max(insets.bottom, space[6]) },
      ]}
      accessibilityLabel={`Giới thiệu ${brand.name}`}
    >
      <View style={styles.decor} pointerEvents="none" />
      <Pressable accessibilityRole="button" accessibilityLabel="Bỏ qua" onPress={() => void finish()} style={styles.skip}>
        <Text style={styles.skipLabel}>Bỏ qua</Text>
      </Pressable>

      <View style={styles.center}>
        <NgaiMiuPlaceholder size={152} pose={step.pose} accessibilityLabel="Ngài Miu hướng dẫn" />
        <Text style={styles.brand}>{brand.name}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
      </View>

      <View style={styles.dots}>
        {onboardingSteps.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.actions}>
        {last ? (
          <Button label="Bắt đầu cùng Ngài Miu" onPress={() => void finish()} />
        ) : (
          <Button label="Tiếp" onPress={() => setIndex((i) => i + 1)} />
        )}
      </View>

      <Text style={styles.privacy}>
        Tính toán lưu cục bộ trên thiết bị. Không yêu cầu CCCD / MST / sổ BHXH.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    zIndex: 30,
    paddingHorizontal: layout.pagePaddingX,
    justifyContent: 'space-between',
  },
  decor: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    opacity: 0.08,
    top: -48,
    right: -88,
  },
  skip: {
    alignSelf: 'flex-end',
    minHeight: layout.minTouch,
    justifyContent: 'center',
    paddingHorizontal: space[2],
  },
  skipLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foregroundMuted,
  },
  center: {
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[2],
  },
  brand: {
    marginTop: space[3],
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.scale.title.fontSize,
    lineHeight: typography.scale.title.lineHeight,
    letterSpacing: typography.letterSpacingTight,
    color: colors.foreground,
    textAlign: 'center',
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.body.fontSize,
    lineHeight: typography.scale.body.lineHeight,
    color: colors.foregroundMuted,
    textAlign: 'center',
    maxWidth: 360,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mutedPressed,
  },
  dotOn: {
    backgroundColor: colors.primary,
    width: 20,
  },
  actions: {
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  privacy: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    lineHeight: 16,
    color: colors.foregroundMuted,
    textAlign: 'center',
    marginTop: space[3],
  },
});
