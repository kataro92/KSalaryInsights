import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  legalSources: string[];
};

export function DisclaimerFooter({ legalSources }: Props) {
  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer và nguồn pháp lý">
      <Text style={styles.title}>Ước tính — không thay thế tư vấn chính thức</Text>
      <Text style={styles.body}>
        Kết quả chỉ mang tính hỗ trợ. Đối chiếu văn bản gốc và tư vấn thuế/kế toán trước khi quyết
        định.
      </Text>
      {legalSources.length > 0 ? (
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>Nguồn ruleset đang dùng</Text>
          {legalSources.map((s) => (
            <Text key={s} style={styles.sourceItem}>
              • {s}
            </Text>
          ))}
        </View>
      ) : null}
    </ColorBlock>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.8,
  },
  sources: {
    marginTop: space[4],
    gap: space[1],
  },
  sourcesTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: space[1],
  },
  sourceItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.foreground,
    opacity: 0.75,
  },
});
