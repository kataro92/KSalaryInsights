import { Pressable, Text, View } from "react-native";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";
import { scenarioRowMeta, type SavedScenario } from "@/src/store/scenarios";

type Props = {
  scenarios: SavedScenario[];
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
  /** Empty-state hint; defaults to calculator copy. */
  emptyHint?: string;
};

/**
 * Local saved scenarios list (F014).
 * Saving uses SaveScenarioModal on the parent screen.
 */
export function ScenarioPanel({
  scenarios,
  onLoad,
  onDelete,
  emptyHint = "Chưa có kịch bản. Sau khi tính, bấm Lưu kịch bản để mở lại sau.",
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.root} accessibilityLabel="Kịch bản đã lưu">
      {scenarios.length === 0 ? (
        <Text style={styles.empty}>{emptyHint}</Text>
      ) : null}

      {scenarios.map((s) => (
        <View key={s.id} style={styles.row}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Tải kịch bản ${s.name}`}
            onPress={() => onLoad(s)}
            style={styles.rowMain}
          >
            <Text style={styles.rowName} numberOfLines={1}>
              {s.name}
            </Text>
            <Text style={styles.rowMeta}>{scenarioRowMeta(s)}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xóa kịch bản ${s.name}`}
            onPress={() => onDelete(s.id)}
            style={styles.deleteBtn}
            hitSlop={8}
          >
            <Text style={styles.deleteLabel}>Xóa</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: { gap: space[3] },
    empty: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.label.fontSize,
      lineHeight: 18,
      color: colors.foregroundMuted,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: space[2],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: space[3],
    },
    rowMain: {
      flex: 1,
      minHeight: layout.minTouch,
      justifyContent: "center",
      gap: 2,
    },
    rowName: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.body.fontSize,
      color: colors.foreground,
    },
    rowMeta: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
      fontVariant: ["tabular-nums"],
    },
    deleteBtn: {
      minHeight: layout.minTouch,
      minWidth: layout.minTouch,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: space[2],
    },
    deleteLabel: {
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.scale.label.fontSize,
      color: colors.danger,
    },
  } satisfies ThemedStyleSheet;
}
