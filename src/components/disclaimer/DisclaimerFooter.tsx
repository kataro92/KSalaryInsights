import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { colors, layout, space, typography } from '@/src/theme/tokens';

type Props = {
  legalSources: string[];
  /** Collapse legal source list by default (AAA: non-blocking). */
  collapseSources?: boolean;
};

export function DisclaimerFooter({ legalSources, collapseSources = false }: Props) {
  const [open, setOpen] = useState(!collapseSources);

  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer và nguồn pháp lý">
      <Text style={styles.title}>Ước tính — không thay thế tư vấn chính thức</Text>
      <Text style={styles.body}>
        Kết quả chỉ mang tính hỗ trợ. Đối chiếu văn bản gốc và tư vấn thuế/kế toán trước khi quyết
        định.
      </Text>
      {legalSources.length > 0 ? (
        <View style={styles.sources}>
          {collapseSources ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => setOpen((v) => !v)}
              style={styles.sourcesToggle}
            >
              <Text style={styles.sourcesTitle}>Nguồn ruleset đang dùng</Text>
              {open ? (
                <ChevronUp color={colors.primary} size={18} strokeWidth={2.2} />
              ) : (
                <ChevronDown color={colors.primary} size={18} strokeWidth={2.2} />
              )}
            </Pressable>
          ) : (
            <Text style={styles.sourcesTitle}>Nguồn ruleset đang dùng</Text>
          )}
          {open
            ? legalSources.map((s) => (
                <Text key={s} style={styles.sourceItem}>
                  • {s}
                </Text>
              ))
            : null}
        </View>
      ) : null}
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.scale.body.fontSize,
    color: colors.foreground,
    marginBottom: space[2],
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.label.fontSize,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.8,
  },
  sources: {
    marginTop: space[4],
    gap: space[1],
  },
  sourcesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouch,
    marginBottom: space[1],
  },
  sourcesTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.caption.fontSize,
    letterSpacing: typography.letterSpacingLabel,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: space[1],
  },
  sourceItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.75,
  },
});
