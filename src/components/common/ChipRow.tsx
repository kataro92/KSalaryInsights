import { StyleSheet, View, type ViewProps } from "react-native";
import type { ReactNode } from "react";

import { space } from "@/src/theme/tokens";

type Props = ViewProps & {
  children: ReactNode;
  /** Stretch children evenly; still wraps on narrow widths. */
  equal?: boolean;
};

/**
 * Wraps ChoiceChips with consistent gap; optional equal-width stretch for mobile.
 */
export function ChipRow({ children, equal = false, style, ...rest }: Props) {
  return (
    <View style={[styles.row, equal && styles.equal, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[2],
  },
  equal: {
    // Keep wrap so 3–4 labeled chips fit on ~320pt; children use flex + minWidth.
  },
});
