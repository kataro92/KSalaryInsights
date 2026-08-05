import { Text, View } from "react-native";

import { BulletLine } from "@/src/components/common/BulletLine";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { NgaiMiuPlaceholder } from "@/src/components/mascot/NgaiMiuPlaceholder";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = { legalSources: string[] };

export function SettlementDisclaimer({ legalSources }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock tone="muted" accessibilityLabel="Disclaimer quyết toán">
      <View style={styles.row}>
        <NgaiMiuPlaceholder
          size={56}
          pose="docs"
          accessibilityLabel="Ngài Miu nhắc nhở"
        />
        <View style={styles.textCol}>
          <Text style={styles.title}>Ước tính, không nộp tờ khai thay bạn</Text>
          <Text style={styles.body}>
            Kết quả chỉ giúp đối chiếu. Không thay eTax, cơ quan thuế hay tư vấn
            chuyên nghiệp. App không gửi dữ liệu quyết toán lên máy chủ.
          </Text>
        </View>
      </View>
      {legalSources.length > 0 ? (
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>Nguồn tham số</Text>
          {legalSources.map((s) => (
            <BulletLine key={s} style={styles.sourceItem}>
              {s}
            </BulletLine>
          ))}
        </View>
      ) : null}
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    row: { flexDirection: "row", gap: space[3], alignItems: "center" },
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
      textTransform: "uppercase",
      color: colors.primary,
      marginBottom: space[1],
    },
    sourceItem: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      color: colors.foreground,
      opacity: 0.75,
    },
  } as const;
}
