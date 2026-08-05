import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

type Props = {
  value: number;
  onChange: (month: number) => void;
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Mobile-friendly month grid — 4 columns, large touch targets.
 * Avoids a cramped single-row chip strip on narrow screens.
 */
export function MonthPicker({ value, onChange }: Props) {
  return (
    <View style={styles.grid} accessibilityLabel="Chọn tháng tính lương">
      {MONTHS.map((m) => {
        const selected = value === m;
        return (
          <Pressable
            key={m}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Tháng ${m}`}
            onPress={() => onChange(m)}
            style={({ pressed }) => [
              styles.cell,
              selected && styles.cellSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{m}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  cell: {
    // 4 columns with gap: ~ (100% - 3*gap) / 4
    width: '23%',
    flexGrow: 1,
    maxWidth: '24%',
    minHeight: layout.minTouch + 4,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.foreground,
    fontVariant: ['tabular-nums'],
  },
  labelSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
  },
});
