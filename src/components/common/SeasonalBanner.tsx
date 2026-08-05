import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  /** Force show (tests). Otherwise auto by calendar month. */
  forceShow?: boolean;
  now?: Date;
};

/**
 * Soft amber seasonal cue — quyết toán T3–T4 (and mild Tết reminder in T12).
 * Flat Design: solid soft fill, no shadow.
 */
export function SeasonalBanner({ forceShow, now = new Date() }: Props) {
  const router = useRouter();
  const month = now.getMonth() + 1; // 1–12
  const filingSeason = month >= 3 && month <= 4;
  const tetCue = month === 12;
  const visible = forceShow ?? (filingSeason || tetCue);
  if (!visible) return null;

  const copy = filingSeason
    ? {
        title: 'Mùa quyết toán',
        body: 'T3–T4 thường là kỳ QT thuế năm trước. Ước tính trước, đối chiếu bảng lương.',
        cta: 'Mở quyết toán',
        href: '/settlement' as const,
      }
    : {
        title: 'Cuối năm · thưởng & QT',
        body: 'Chuẩn bị số liệu lương/thưởng trước khi sang năm thuế mới.',
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
