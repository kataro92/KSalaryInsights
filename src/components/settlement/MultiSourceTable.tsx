import { Pressable, Text, View } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { MultiSourceLine, MultiSourceTotals } from "@/src/domain/types/multiSource";
import { formatVnd } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  lines: MultiSourceLine[];
  totals: MultiSourceTotals;
  onToggleExclude: (id: string) => void;
  onRemove: (id: string) => void;
};

function deltaLabel(totals: MultiSourceTotals): string {
  if (totals.deltaKind === "even") return "Khớp (ước)";
  if (totals.deltaKind === "pay")
    return `Nộp thêm ước ${formatVnd(totals.deltaSigned)}`;
  return `Hoàn ước ${formatVnd(-totals.deltaSigned)}`;
}

export function MultiSourceTable({
  lines,
  totals,
  onToggleExclude,
  onRemove,
}: Props) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.wrap} accessibilityLabel="Bảng tổng hợp đa nguồn">
      {lines.map((line) => (
        <ColorBlock
          key={line.id}
          tone={line.excluded ? "muted" : "default"}
          accessibilityLabel={line.label}
        >
          <View style={styles.rowHead}>
            <Text
              style={[styles.title, line.excluded && styles.excluded]}
              numberOfLines={2}
            >
              {line.label}
            </Text>
            <Text style={styles.kind}>{line.kind}</Text>
          </View>
          <Text style={styles.meta}>
            Thu nhập / DT: {formatVnd(line.revenueOrIncome)}
          </Text>
          {line.estimatedVat > 0 || line.estimatedPit > 0 ? (
            <Text style={styles.meta}>
              GTGT {formatVnd(line.estimatedVat)} · TNCN{" "}
              {formatVnd(line.estimatedPit)}
              {line.estimatedOtherTax > 0
                ? ` · khác ${formatVnd(line.estimatedOtherTax)}`
                : ""}
            </Text>
          ) : null}
          <Text style={styles.tax}>
            Thuế ước: {formatVnd(line.estimatedTaxTotal)}
          </Text>
          <Text style={styles.meta}>
            Đã nộp: {formatVnd(line.withheld)}
          </Text>
          {line.notes.slice(0, 2).map((n, i) => (
            <Text key={i} style={styles.note}>
              {n}
            </Text>
          ))}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                line.excluded ? `Bật lại ${line.label}` : `Ẩn ${line.label}`
              }
              onPress={() => onToggleExclude(line.id)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionLabel}>
                {line.excluded ? "Bật lại" : "Ẩn khỏi tổng"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Xóa ${line.label}`}
              onPress={() => onRemove(line.id)}
              style={styles.actionBtn}
            >
              <Text style={styles.danger}>Xóa</Text>
            </Pressable>
          </View>
        </ColorBlock>
      ))}

      <ColorBlock tone="primarySoft" accessibilityLabel="Tổng ước tính">
        <Text style={styles.totalsTitle}>Tổng (ước tính)</Text>
        <Text style={styles.totalsLine}>
          Thuế ước: {formatVnd(totals.estimatedTax)}
        </Text>
        <Text style={styles.totalsLine}>
          Đã nộp: {formatVnd(totals.withheld)}
        </Text>
        <Text style={styles.totalsDelta}>{deltaLabel(totals)}</Text>
        <Text style={styles.note}>
          Tổng = Σ thuế từng dòng − Σ đã nộp. Không suy ra một tờ khai duy nhất.
        </Text>
      </ColorBlock>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    rowHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: space[2],
      alignItems: "flex-start",
    },
    title: {
      flex: 1,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    excluded: { opacity: 0.5, textDecorationLine: "line-through" },
    kind: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
    },
    meta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      marginTop: space[1],
    },
    tax: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      marginTop: space[1],
    },
    note: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 17,
      color: colors.foregroundMuted,
      marginTop: space[1],
    },
    actions: {
      flexDirection: "row",
      gap: space[4],
      marginTop: space[2],
    },
    actionBtn: { minHeight: 40, justifyContent: "center" },
    actionLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      color: colors.primary,
    },
    danger: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      color: colors.danger,
    },
    totalsTitle: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      marginBottom: space[2],
    },
    totalsLine: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    totalsDelta: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
      marginTop: space[2],
    },
  } satisfies ThemedStyleSheet;
}
