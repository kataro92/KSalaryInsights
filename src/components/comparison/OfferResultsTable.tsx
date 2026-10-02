import { Text, View, useWindowDimensions } from "react-native";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import type {
  OfferCompareResult,
  OfferSideResult,
} from "@/src/domain/types/offerCompare";
import { formatVnd } from "@/src/theme/money";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";

export function OfferResultsTable({ result }: { result: OfferCompareResult }) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const compact = Math.min(width, 560) / fontScale < 330;
  const text = {
    color: colors.foreground,
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
  };
  const money = {
    ...text,
    flex: 1,
    minWidth: 0,
    textAlign: "right" as const,
    fontVariant: ["tabular-nums" as const],
  };
  const rows: [
    string,
    (r: Extract<OfferSideResult, { ok: true }>) => number,
  ][] = [
    ["Net", (r) => r.net],
    ["Gross", (r) => r.gross],
    ["Bảo hiểm", (r) => r.insuranceEmployeeTotal],
    ["Thuế", (r) => r.pitTotal],
  ];
  return (
    <ColorBlock tone="muted" accessibilityLabel="Bảng kết quả offer A và B">
      {!compact && (
        <View
          style={{
            flexDirection: "row",
            gap: space[2],
            paddingBottom: space[3],
          }}
        >
          <Text style={{ ...text, width: 60 }}>Khoản</Text>
          <Text style={money}>Offer A</Text>
          <Text style={money}>Offer B</Text>
        </View>
      )}
      {rows.map(([label, value]) => (
        <View
          key={label}
          style={{
            flexDirection: compact ? "column" : "row",
            gap: space[2],
            paddingVertical: space[3],
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text style={{ ...text, ...(compact ? {} : { width: 60 }) }}>
            {label}
          </Text>
          {[result.a, result.b].map((r, i) => (
            <View
              key={i}
              style={
                compact
                  ? { flexDirection: "row", gap: space[2] }
                  : { flex: 1, minWidth: 0 }
              }
            >
              {compact && <Text style={text}>Offer {i === 0 ? "A" : "B"}</Text>}
              <Text
                style={money}
                accessibilityLabel={`${label} offer ${i === 0 ? "A" : "B"}: ${r.ok ? formatVnd(value(r)) : "Không tính được"}`}
              >
                {r.ok ? formatVnd(value(r)) : "Chưa có"}
              </Text>
            </View>
          ))}
        </View>
      ))}
      {[result.a, result.b].map((r, i) =>
        !r.ok ? (
          <Text key={i} style={{ ...text, color: colors.danger }}>
            Offer {i === 0 ? "A" : "B"}: {r.errorMessage}
          </Text>
        ) : null,
      )}
    </ColorBlock>
  );
}
