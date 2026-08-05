import { Text, TextInput, View } from "react-native";

import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

export type ContributionYearsValue = {
  t1Years: string;
  t1Months: string;
  t2Years: string;
  t2Months: string;
  pensionYears: string;
};

type Props = {
  value: ContributionYearsValue;
  onChange: (next: ContributionYearsValue) => void;
};

export function ContributionYearsInput({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  const patch = (partial: Partial<ContributionYearsValue>) =>
    onChange({ ...value, ...partial });

  return (
    <View style={styles.wrap}>
      <View style={styles.pair}>
        <Field
          styles={styles}
          label="T1 năm (trước 2014)"
          value={value.t1Years}
          onChange={(t) => patch({ t1Years: t.replace(/[^\d]/g, "") })}
        />
        <Field
          styles={styles}
          label="T1 tháng lẻ"
          value={value.t1Months}
          onChange={(t) => patch({ t1Months: t.replace(/[^\d]/g, "") })}
        />
      </View>
      <View style={styles.pair}>
        <Field
          styles={styles}
          label="T2 năm (từ 2014)"
          value={value.t2Years}
          onChange={(t) => patch({ t2Years: t.replace(/[^\d]/g, "") })}
        />
        <Field
          styles={styles}
          label="T2 tháng lẻ"
          value={value.t2Months}
          onChange={(t) => patch({ t2Months: t.replace(/[^\d]/g, "") })}
        />
      </View>
      <Field
        styles={styles}
        label="Tổng năm đóng (lương hưu)"
        value={value.pensionYears}
        onChange={(t) => patch({ pensionYears: t.replace(/[^\d]/g, "") })}
      />
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  styles,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    pair: { flexDirection: "row", gap: space[3] },
    field: { flex: 1, gap: space[1] },
    fieldLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 12,
      color: colors.foreground,
      opacity: 0.7,
    },
    input: {
      minHeight: layout.minTouch,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingHorizontal: space[3],
      fontFamily: typography.fontFamily.medium,
      fontSize: 16,
      color: colors.foreground,
      fontVariant: ["tabular-nums"],
      backgroundColor: colors.white,
    },
  } satisfies ThemedStyleSheet;
}
