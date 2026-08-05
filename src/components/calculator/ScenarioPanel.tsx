import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';
import { formatVnd } from '@/src/theme/money';
import type { SavedScenario } from '@/src/store/scenarios';

type Props = {
  scenarios: SavedScenario[];
  /** When true, show name field + confirm save. */
  saving: boolean;
  saveName: string;
  onSaveNameChange: (name: string) => void;
  onConfirmSave: () => void;
  onCancelSave: () => void;
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
};

/**
 * Local calculator scenarios — list + inline save name (F014).
 * Not a card chrome: flat rows on canvas.
 */
export function ScenarioPanel({
  scenarios,
  saving,
  saveName,
  onSaveNameChange,
  onConfirmSave,
  onCancelSave,
  onLoad,
  onDelete,
}: Props) {
  return (
    <View style={styles.root} accessibilityLabel="Kịch bản đã lưu">
      {saving ? (
        <View style={styles.saveBox}>
          <Text style={styles.saveLabel}>Tên kịch bản</Text>
          <TextInput
            accessibilityLabel="Tên kịch bản"
            value={saveName}
            onChangeText={onSaveNameChange}
            placeholder="VD: Lương chính T3"
            placeholderTextColor={colors.foregroundMuted}
            style={styles.nameInput}
            maxLength={80}
          />
          <View style={styles.saveActions}>
            <View style={styles.saveBtn}>
              <Button label="Hủy" variant="outline" onPress={onCancelSave} />
            </View>
            <View style={styles.saveBtn}>
              <Button label="Lưu" onPress={onConfirmSave} />
            </View>
          </View>
        </View>
      ) : null}

      {scenarios.length === 0 && !saving ? (
        <Text style={styles.empty}>
          Chưa có kịch bản. Sau khi tính, bấm Lưu kịch bản để mở lại sau.
        </Text>
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
            <Text style={styles.rowMeta}>
              {s.inputs.mode === 'gross-to-net' ? 'Gross' : 'Net'}{' '}
              {formatVnd(s.inputs.amount)}
              {s.lastNet != null ? ` · Net ${formatVnd(s.lastNet)}` : ''}
            </Text>
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

const styles = StyleSheet.create({
  root: { gap: space[3] },
  empty: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.label.fontSize,
    lineHeight: 18,
    color: colors.foregroundMuted,
  },
  saveBox: { gap: space[2] },
  saveLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.scale.caption.fontSize,
    color: colors.foregroundMuted,
  },
  nameInput: {
    minHeight: layout.minTouch,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: space[3],
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.white,
  },
  saveActions: {
    flexDirection: 'row',
    gap: space[2],
  },
  saveBtn: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: space[3],
  },
  rowMain: {
    flex: 1,
    minHeight: layout.minTouch,
    justifyContent: 'center',
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
    fontVariant: ['tabular-nums'],
  },
  deleteBtn: {
    minHeight: layout.minTouch,
    minWidth: layout.minTouch,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[2],
  },
  deleteLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.scale.label.fontSize,
    color: colors.danger,
  },
});
