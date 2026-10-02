import { View, Text } from "react-native";
import { TextField } from "@/src/components/common/TextField";
import type { AnnualSettlementInput } from "@/src/domain/types/settlement";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";

export type DependentPeriod = NonNullable<
  AnnualSettlementInput["dependentPeriods"]
>[number];

export function DependentPeriodsInput({
  value,
  onChange,
}: {
  value: DependentPeriod[];
  onChange: (value: DependentPeriod[]) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space[3] }}>
      {value.map((p, i) => (
        <View key={i} style={{ gap: space[2] }}>
          <Text
            style={{
              color: colors.foreground,
              fontFamily: typography.fontFamily.medium,
            }}
          >
            Người phụ thuộc {i + 1}
          </Text>
          <View style={{ flexDirection: "row", gap: space[2] }}>
            {(["startMonth", "endMonth"] as const).map((key) => (
              <View key={key} style={{ flex: 1 }}>
                <TextField
                  label={key === "startMonth" ? "Từ tháng" : "Đến tháng"}
                  accessibilityLabel={`Người phụ thuộc ${i + 1}, ${key === "startMonth" ? "từ" : "đến"} tháng`}
                  keyboardType="number-pad"
                  value={String(p[key])}
                  error={
                    p[key] < 1 || p[key] > 12 || p.endMonth < p.startMonth
                      ? "Tháng 1–12, kết thúc sau bắt đầu."
                      : undefined
                  }
                  onChangeText={(text) =>
                    onChange(
                      value.map((v, j) =>
                        j === i
                          ? { ...v, [key]: Number(text.replace(/\D/g, "")) }
                          : v,
                      ),
                    )
                  }
                />
              </View>
            ))}
          </View>
        </View>
      ))}
      <Text
        style={{
          color: colors.foregroundMuted,
          fontFamily: typography.fontFamily.regular,
          fontSize: 12,
        }}
      >
        Chỉ nhập tháng đủ điều kiện đã đăng ký. TT 87/2026: thu nhập người phụ
        thuộc không quá 3 triệu/tháng. Không cần nhập tên hoặc hồ sơ.
      </Text>
    </View>
  );
}
