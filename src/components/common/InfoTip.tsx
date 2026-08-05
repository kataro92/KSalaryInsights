import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Info } from 'lucide-react-native';

import { useI18n } from '@/src/i18n/useI18n';
import type { TipId } from '@/src/i18n/types';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  tipId: TipId;
  /** Icon color — default muted ink. */
  color?: string;
  size?: number;
};

/**
 * Small info control next to calculated lines — opens explanation + legal refs.
 */
export function InfoTip({ tipId, color = colors.foregroundMuted, size = 16 }: Props) {
  const { t, tip } = useI18n();
  const [open, setOpen] = useState(false);
  const content = tip(tipId);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('common.info')}: ${content.title}`}
        hitSlop={10}
        onPress={() => setOpen(true)}
        style={styles.hit}
      >
        <Info color={color} size={size} strokeWidth={2.2} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{content.title}</Text>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.body}>{content.body}</Text>
              <Text style={styles.sourcesHeading}>{t('common.sources')}</Text>
              {content.sources.map((s) => (
                <Text key={s} style={styles.source}>
                  • {s}
                </Text>
              ))}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={() => setOpen(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeLabel}>{t('common.close')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  hit: {
    minWidth: layout.minTouch / 2,
    minHeight: layout.minTouch / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(36, 59, 83, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: space[5],
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: space[5],
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: colors.border,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.foreground,
    marginBottom: space[3],
  },
  scroll: { maxHeight: 320 },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.foreground,
    marginBottom: space[4],
  },
  sourcesHeading: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.foregroundMuted,
    marginBottom: space[2],
  },
  source: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foregroundMuted,
    marginBottom: space[1],
  },
  closeBtn: {
    marginTop: space[4],
    minHeight: layout.minTouch,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.white,
  },
});
