import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppIcon } from "@/src/components/common/AppIcon";
import { GlassSurface } from "@/src/components/common/GlassSurface";
import { NgaiMiuPlaceholder } from "@/src/components/mascot/NgaiMiuPlaceholder";
import { loadScenarios, scenariosOfKind } from "@/src/store/scenarios";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  /** Force show (tests). Otherwise auto by calendar month. */
  forceShow?: boolean;
  now?: Date;
};

/**
 * Seasonal cue. Glass panel with peach tint (spec 010).
 */
export function SeasonalBanner({ forceShow, now = new Date() }: Props) {
  const router = useRouter();
  const { colors, glass } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [calcCount, setCalcCount] = useState(0);
  const [settlementCount, setSettlementCount] = useState(0);
  const month = now.getMonth() + 1; // 1–12
  const filingSeason = month >= 3 && month <= 4;
  const tetCue = month === 12;
  const visible = forceShow ?? (filingSeason || tetCue);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { store } = await loadScenarios();
      if (cancelled) return;
      setCalcCount(scenariosOfKind(store.scenarios, "calculator").length);
      setSettlementCount(scenariosOfKind(store.scenarios, "settlement").length);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  let scenarioHint = "";
  if (calcCount > 0 && settlementCount > 0) {
    scenarioHint = ` Bạn có ${calcCount} kịch bản lương và ${settlementCount} quyết toán đã lưu.`;
  } else if (calcCount > 0) {
    scenarioHint = ` Bạn có ${calcCount} kịch bản lương đã lưu. Mở Tính lương để tải lại.`;
  } else if (settlementCount > 0) {
    scenarioHint = ` Bạn có ${settlementCount} kịch bản quyết toán đã lưu. Mở Quyết toán để tải lại.`;
  }

  const preferSettlement =
    filingSeason && (settlementCount > 0 || calcCount === 0);

  const copy = filingSeason
    ? {
        title: "Mùa quyết toán",
        body: `Tháng 3–4 thường là kỳ quyết toán thuế năm trước. Ước trước, đối chiếu bảng lương.${scenarioHint}`,
        cta: preferSettlement ? "Mở quyết toán" : "Mở Tính lương",
        href: (preferSettlement ? "/settlement" : "/") as "/" | "/settlement",
      }
    : {
        title: "Cuối năm · thưởng & quyết toán",
        body: `Chuẩn bị số liệu lương/thưởng trước khi sang năm thuế mới.${scenarioHint}`,
        cta: "Tính lương",
        href: "/" as const,
      };

  return (
    <GlassSurface
      intensity="regular"
      tintColor={glass.accentFill}
      contentStyle={styles.banner}
      accessibilityRole="summary"
      accessibilityLabel={copy.title}
    >
      <View style={styles.accentBar} />
      <NgaiMiuPlaceholder
        size={64}
        pose="docs"
        accessibilityLabel="Ngài Miu nhắc hạn"
      />
      <View style={styles.textCol}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.body}>{copy.body}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.cta}
          onPress={() => router.push(copy.href)}
          style={styles.cta}
        >
          <View style={styles.ctaRow}>
            <Text style={styles.ctaLabel}>{copy.cta}</Text>
            <AppIcon name="chevron-right" color={colors.accent} size={16} />
          </View>
        </Pressable>
      </View>
    </GlassSurface>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    banner: {
      padding: space[4],
      paddingLeft: space[3],
      flexDirection: "row",
      alignItems: "center",
      gap: space[3],
    },
    accentBar: {
      width: 4,
      alignSelf: "stretch",
      borderRadius: 2,
      backgroundColor: colors.accent,
    },
    textCol: { flex: 1, gap: space[2] },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    body: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.label.fontSize,
      lineHeight: 18,
      color: colors.foreground,
      opacity: 0.85,
    },
    cta: {
      minHeight: layout.minTouch - 8,
      justifyContent: "center",
      alignSelf: "flex-start",
    },
    ctaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[1],
    },
    ctaLabel: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.body.fontSize,
      color: colors.accent,
    },
  } as const;
}
