import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/common/Button';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { saveOnboardingCompleted } from '@/src/store/onboarding';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Step = {
  title: string;
  body: string;
  pose: 'wave' | 'point' | 'tip';
};

const STEPS: Step[] = [
  {
    title: 'Tính Gross ↔ Net',
    body: 'Ước tính lương offline theo ruleset 2025/2026. Breakdown từng khoản trừ — không che số.',
    pose: 'wave',
  },
  {
    title: 'Quyết toán thuế năm',
    body: 'Đối chiếu đã khấu trừ với nghĩa vụ ước tính. Có wizard gợi ý ủy quyền hay tự QT.',
    pose: 'point',
  },
  {
    title: 'Quyền lợi BHXH',
    body: 'Thai sản, ốm đau, thôi việc, thất nghiệp, hưu / một lần — mỗi máy tính độc lập.',
    pose: 'tip',
  },
];

type Props = {
  onDone: () => void;
};

export function OnboardingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

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
      accessibilityLabel="Giới thiệu KVSalaryTools"
    >
      <View style={styles.decor} pointerEvents="none" />
      <Pressable accessibilityRole="button" accessibilityLabel="Bỏ qua" onPress={() => void finish()} style={styles.skip}>
        <Text style={styles.skipLabel}>Bỏ qua</Text>
      </Pressable>

      <View style={styles.center}>
        <NgaiMiuPlaceholder size={140} pose={step.pose} accessibilityLabel="Ngài Miu chào bạn" />
        <Text style={styles.brand}>KVSalaryTools</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
      </View>

      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.actions}>
        {last ? (
          <Button label="Bắt đầu" onPress={() => void finish()} />
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
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    opacity: 0.07,
    top: -40,
    right: -80,
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
    marginTop: space[4],
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
