import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { usePreferences } from '@/src/hooks/usePreferences';
import type { RegionCode } from '@/src/store/preferences';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

const REGIONS: RegionCode[] = ['I', 'II', 'III', 'IV'];
const TAX_YEARS = [2025, 2026, 2027];

export default function SettingsScreen() {
  const {
    preferences,
    recoveredFromCorrupt,
    setDefaultRegion,
    setDefaultTaxYear,
    resetToDefaults,
  } = usePreferences();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Màn hình cài đặt"
    >
      <View style={styles.inner}>
        {recoveredFromCorrupt ? (
          <ColorBlock tone="primarySoft">
            <Text style={styles.softWarn}>
              Không đọc được cài đặt đã lưu — đã dùng mặc định hệ thống. Bạn có thể chọn lại bên
              dưới.
            </Text>
          </ColorBlock>
        ) : null}

        <Section title="Vùng LTTV mặc định" subtitle="Áp dụng khi mở công cụ tính lương.">
          <View style={styles.chipRow}>
            {REGIONS.map((region) => {
              const selected = preferences.defaultRegion === region;
              return (
                <Pressable
                  key={region}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Vùng ${region}`}
                  onPress={() => void setDefaultRegion(region)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    Vùng {region}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Năm thuế mặc định">
          <View style={styles.chipRow}>
            {TAX_YEARS.map((year) => {
              const selected = preferences.defaultTaxYear === year;
              return (
                <Pressable
                  key={year}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Năm thuế ${year}`}
                  onPress={() => void setDefaultTaxYear(year)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {year}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Quyền riêng tư & giới thiệu">
          <Button
            label={privacyOpen ? 'Thu gọn' : 'Xem tuyên bố'}
            variant="secondary"
            onPress={() => setPrivacyOpen((v) => !v)}
          />
          {privacyOpen ? (
            <ColorBlock tone="muted">
              <Text style={styles.privacyTitle}>Quyền riêng tư</Text>
              <Text style={styles.privacyBody}>
                Tính toán và cài đặt được lưu cục bộ trên thiết bị. Ứng dụng không yêu cầu CCCD,
                MST hay số sổ BHXH. Không gửi dữ liệu lương/thuế lên máy chủ trong phạm vi hiện tại.
              </Text>
              <Text style={[styles.privacyTitle, { marginTop: space[4] }]}>Disclaimer</Text>
              <Text style={styles.privacyBody}>
                KVSalaryTools chỉ hỗ trợ ước tính. Kết quả không thay thế tư vấn pháp lý, kế toán
                hay quyết định của cơ quan thuế / BHXH.
              </Text>
            </ColorBlock>
          ) : null}
        </Section>

        <Section title="Đặt lại">
          <Button
            label="Đặt lại về mặc định"
            variant="outline"
            onPress={() => void resetToDefaults()}
          />
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: space[6],
    paddingHorizontal: layout.pagePaddingX,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    gap: space[6],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  chip: {
    minHeight: layout.minTouch,
    minWidth: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.foreground,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  softWarn: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  privacyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: space[2],
  },
  privacyBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
    opacity: 0.85,
  },
});
