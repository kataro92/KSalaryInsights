import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { loadScenarios } from '@/src/store/scenarios';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  /** Force show (tests). Otherwise auto by calendar month. */
  forceShow?: boolean;
  now?: Date;
};

/**
 * Soft amber seasonal cue — quyết toán T3–T4 (and mild Tết reminder in T12).
 * F014: mentions local saved scenarios when present.
 * Flat Design: solid soft fill, no shadow.
 */
export function SeasonalBanner({ forceShow, now = new Date() }: Props) {
  const router = useRouter();
  const [scenarioCount, setScenarioCount] = useState(0);
  const month = now.getMonth() + 1; // 1–12
  const filingSeason = month >= 3 && month <= 4;
  const tetCue = month === 12;
  const visible = forceShow ?? (filingSeason || tetCue);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { store } = await loadScenarios();
      if (!cancelled) setScenarioCount(store.scenarios.length);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  const scenarioHint =
    scenarioCount > 0
      ? ` Bạn có ${scenarioCount} kịch bản lương đã lưu — mở Tính lương để tải lại.`
      : '';

  const copy = filingSeason
    ? {
        title: 'Mùa quyết toán',
        body: `T3–T4 thường là kỳ QT thuế năm trước. Ước tính trước, đối chiếu bảng lương.${scenarioHint}`,
        cta: scenarioCount > 0 ? 'Mở Tính lương' : 'Mở quyết toán',
        href: (scenarioCount > 0 ? '/' : '/settlement') as '/' | '/settlement',
      }
    : {
        title: 'Cuối năm · thưởng & QT',
        body: `Chuẩn bị số liệu lương/thưởng trước khi sang năm thuế mới.${scenarioHint}`,
        cta: 'Tính lương',
        href: '/' as const,
      };

  return (
    <View style={styles.banner} accessibilityRole="summary" accessibilityLabel={copy.title}>
      <NgaiMiuPlaceholder size={64} pose="docs" accessibilityLabel="Ngài Miu nhắc hạn" />
      <View style={styles.textCol}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.body}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.cta}
          onPress={() => router.push(copy.href)}
          style={styles.cta}
        >
          <Text style={styles.ctaLabel}>{copy.cta} →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.lg,
    padding: space[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  textCol: { flex: 1, gap: space[2] },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.label.fontSize,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.85,
  },
  cta: {
    minHeight: layout.minTouch - 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  ctaLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.body.fontSize,
    color: colors.accent,
  },
});
