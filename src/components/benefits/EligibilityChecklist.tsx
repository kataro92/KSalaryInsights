import { Text, View } from "react-native";

import { ColorBlock } from "@/src/components/common/ColorBlock";
import type { EligibilityChecklistItem } from "@/src/domain/types/benefits";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  items: EligibilityChecklistItem[];
};

export function EligibilityChecklist({ items }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <ColorBlock
      tone="muted"
      accessibilityLabel="Checklist điều kiện hưởng bảo hiểm thất nghiệp"
    >
      <Text style={styles.title}>Điều kiện cần nhớ</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </ColorBlock>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 14,
      color: colors.foreground,
      marginBottom: space[3],
    },
    row: {
      flexDirection: "row",
      gap: space[2],
      marginBottom: space[2],
      alignItems: "flex-start",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.secondary,
      marginTop: 6,
    },
    label: {
      flex: 1,
      fontFamily: typography.fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.foreground,
    },
  } as const;
}
