import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = { legalSources: string[] };

export function SettlementDisclaimer({ legalSources }: Props) {
  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer quyết toán">
      <View style={styles.row}>
        <NgaiMiuPlaceholder size={48} pose="confused" accessibilityLabel="Ngài Miu" />
        <View style={styles.textCol}>
          <Text style={styles.title}>Ước tính mạnh — không nộp tờ khai thay bạn</Text>
          <Text style={styles.body}>
            Kết quả chỉ hỗ trợ đối chiếu. Không thay thế eTax, cơ quan thuế hay tư vấn chuyên
            nghiệp. App không gửi dữ liệu quyết toán lên máy chủ.
          </Text>
        </View>
      </View>
      {legalSources.length > 0 ? (
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>Nguồn ruleset</Text>
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
  row: { flexDirection: 'row', gap: space[3], alignItems: 'center' },
  textCol: { flex: 1, gap: space[2] },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.8,
  },
  sources: { marginTop: space[4], gap: 2 },
  sourcesTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: space[1],
  },
  sourceItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.foreground,
    opacity: 0.75,
  },
});
