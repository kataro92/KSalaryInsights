import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { ResultHero } from "@/src/components/common/ResultHero";
import type {
  LumpSumBreakdown,
  PensionBreakdown,
} from "@/src/domain/types/retirement";
import { moneyAccessibilityLabel } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  /** null khi chưa acknowledge. Không render số (SC-002). */
  lumpSum: LumpSumBreakdown | null;
  pension: PensionBreakdown | null;
  showAmounts: boolean;
};

/**
 * So sánh trung lập hai kịch bản. Không copy “nên rút” / “nên chờ” (FR-004).
 */
export function RetirementComparisonView({
  lumpSum,
  pension,
  showAmounts,
}: Props) {
  const styles = useThemedStyles(makeStyles);

  if (!showAmounts) {
    return (
      <EmptyErrorState
        title="Chưa mở khóa ước tính"
        body="Xác nhận cảnh báo bên trên để xem khoảng ước tính hai kịch bản."
      />
    );
  }

  if (!lumpSum || !pension) {
    return (
      <EmptyErrorState
        title="Chưa có so sánh"
        body="Điền lương bình quân đã điều chỉnh và thời gian đóng, rồi bấm Tính so sánh."
      />
    );
  }

  return (
    <View
      style={styles.wrap}
      accessibilityLabel="So sánh bảo hiểm xã hội một lần và lương hưu"
    >
      <Text style={styles.banner}>
        Khoảng ước tính. Không phải số chính thức
      </Text>

      <ResultHero
        tone="primary"
        eyebrow="Bảo hiểm xã hội một lần"
        label="Ước nhận"
        amount={lumpSum.amount}
        accessibilityLabel={moneyAccessibilityLabel(
          lumpSum.amount,
          "Bảo hiểm xã hội một lần"
        )}
      />
      <ResultHero
        tone="positive"
        eyebrow="Lương hưu"
        label="Mỗi tháng"
        amount={pension.monthlyAmount}
        accessibilityLabel={moneyAccessibilityLabel(
          pension.monthlyAmount,
          "Lương hưu mỗi tháng"
        )}
      />

      <View style={styles.cols}>
        <ColorBlock tone="primarySoft" style={styles.col}>
          <Text style={styles.colEyebrow}>Chi tiết · một lần</Text>
          <Text style={styles.formula}>{lumpSum.formula}</Text>
          <Text style={styles.meta}>
            Trước 2014: {lumpSum.yearsPre2014Rounded} năm · từ 2014:{" "}
            {lumpSum.yearsFrom2014Rounded} năm
          </Text>
          {lumpSum.explanations.map((e) => (
            <BulletLine key={e} style={styles.explain}>
              {e}
            </BulletLine>
          ))}
        </ColorBlock>

        <ColorBlock tone="secondarySoft" style={styles.col}>
          <Text style={[styles.colEyebrow, styles.colEyebrowSecondary]}>
            Chi tiết · hưu tháng
          </Text>
          <Text style={styles.formula}>{pension.formula}</Text>
          <Text style={styles.meta}>
            {(pension.rate * 100).toFixed(0)}% · {pension.contributionYears} năm
            đóng
          </Text>
          {pension.rateSteps.map((s) => (
            <BulletLine key={s} style={styles.explain}>
              {s}
            </BulletLine>
          ))}
          <Text style={styles.note}>{pension.estimateNote}</Text>
        </ColorBlock>
      </View>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    banner: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 12,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: colors.accent,
    },
    cols: { gap: space[4] },
    col: { flex: 1 },
    colEyebrow: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: colors.primary,
      marginBottom: space[2],
    },
    colEyebrowSecondary: { color: colors.secondary },
    formula: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      color: colors.foreground,
      marginBottom: space[2],
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      color: colors.foreground,
      opacity: 0.7,
      marginBottom: space[2],
    },
    explain: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.85,
      marginBottom: space[1],
    },
    note: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.7,
      marginTop: space[2],
    },
  } as const;
}
