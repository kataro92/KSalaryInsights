import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { GlassSurface } from "@/src/components/common/GlassSurface";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

type Props = {
  visible: boolean;
  saveName: string;
  onSaveNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder?: string;
  title?: string;
};

/** Confirm dialog for naming + saving a scenario (no scroll-to-top). */
export function SaveScenarioModal({
  visible,
  saveName,
  onSaveNameChange,
  onConfirm,
  onCancel,
  placeholder = "VD: Lương chính T3",
  title = "Lưu kịch bản",
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.sheetWrap}
          accessibilityViewIsModal
        >
          <GlassSurface intensity="thick" contentStyle={styles.sheet}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.label}>Tên kịch bản</Text>
            <TextInput
              accessibilityLabel="Tên kịch bản"
              value={saveName}
              onChangeText={onSaveNameChange}
              placeholder={placeholder}
              placeholderTextColor={colors.foregroundMuted}
              style={styles.nameInput}
              maxLength={80}
              autoFocus
            />
            <View style={styles.actions}>
              <View style={styles.btn}>
                <Button label="Hủy" variant="outline" onPress={onCancel} />
              </View>
              <View style={styles.btn}>
                <Button label="Lưu" onPress={onConfirm} />
              </View>
            </View>
          </GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(36, 59, 83, 0.45)",
      justifyContent: "center",
      paddingHorizontal: space[4],
    },
    sheetWrap: {
      width: "100%",
    },
    sheet: {
      padding: space[5],
      gap: space[3],
    },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 18,
      color: colors.foreground,
    },
    label: {
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
      backgroundColor: colors.muted,
    },
    actions: {
      flexDirection: "row",
      gap: space[2],
      marginTop: space[1],
    },
    btn: { flex: 1 },
  } satisfies ThemedStyleSheet;
}
