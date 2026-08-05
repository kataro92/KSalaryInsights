import { StyleSheet, Text, View } from 'react-native';

import { AnnualBreakdownCard } from '@/src/components/breakdown/AnnualBreakdownCard';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { SettlementResultCard } from '@/src/components/settlement/SettlementResultCard';
import type { SettlementScenario } from '@/src/domain/types/settlement';
import { colors, space, typography } from '@/src/theme/tokens';

type Props = {
  scenarios: SettlementScenario[];
};

export function DualScenarioCard({ scenarios }: Props) {
  if (scenarios.length < 2) return null;
  return (
    <View style={styles.wrap} accessibilityLabel="Hai phương án gộp vãng lai">
      <ColorBlock tone="primarySoft">
        <Text style={styles.banner}>
          Phần vãng lai đủ điều kiện miễn — xem cả hai phương án. Gộp tự nguyện thường có lợi khi
          thuế suất biên năm thấp hơn 10% đã khấu trừ.
        </Text>
      </ColorBlock>
      {scenarios.map((s) => (
        <View key={s.id} style={styles.block}>
          <Text style={styles.label}>
            {s.label}
            {s.recommended ? ' · gợi ý' : ''}
          </Text>
          <SettlementResultCard
            delta={s.breakdown.delta}
            withheldMissingWarning={s.breakdown.withheldMissingWarning}
          />
          <AnnualBreakdownCard breakdown={s.breakdown} title={`Chi tiết — ${s.label}`} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[5] },
  banner: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
  block: { gap: space[3] },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.foreground,
  },
});
