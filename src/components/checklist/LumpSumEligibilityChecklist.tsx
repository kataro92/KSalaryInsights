import { StyleSheet, Text, View } from 'react-native';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import type { EligibilityChecklistItem } from '@/src/domain/types/retirement';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  items: EligibilityChecklistItem[];
  beforeCutoff: boolean;
  cutoffLabel?: string;
};

export function LumpSumEligibilityChecklist({
  items,
  beforeCutoff,
  cutoffLabel = '01/07/2025',
}: Props) {
  return (
    <ColorBlock tone="muted" accessibilityLabel="Checklist điều kiện rút BHXH một lần">
      <Text style={styles.title}>Điều kiện rút (tham khảo)</Text>
      <Text style={styles.meta}>
        {beforeCutoff
          ? `Tham gia trước ${cutoffLabel} — có diện nghỉ việc 12 tháng (nếu đủ điều kiện khác).`
          : `Tham gia từ ${cutoffLabel} — chỉ các trường hợp đặc biệt (không có diện nghỉ việc 12 tháng).`}
      </Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
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
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
    opacity: 0.75,
    marginBottom: space[3],
  },
  row: {
    flexDirection: 'row',
    gap: space[2],
    marginBottom: space[2],
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
  },
});
