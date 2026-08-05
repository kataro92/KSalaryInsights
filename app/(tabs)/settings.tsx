import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/common/Button';
import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { PageHero } from '@/src/components/common/PageHero';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { Section } from '@/src/components/common/Section';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { aboutCopy, brand } from '@/src/copy/miu';
import { usePreferences } from '@/src/hooks/usePreferences';
import type { RegionCode } from '@/src/store/preferences';
import { requestOnboardingReplay } from '@/src/store/onboarding';
import { colors, radii, space, typography } from '@/src/theme/tokens';

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
    <ScreenShell accessibilityLabel="Màn hình cài đặt" decorated>
      <PageHero
        title="Cài đặt"
        subtitle="Vùng LTTV và năm thuế mặc định — lưu cục bộ trên thiết bị."
      />

      {recoveredFromCorrupt ? (
        <ColorBlock tone="primarySoft">
          <Text style={styles.softWarn}>
            Không đọc được cài đặt đã lưu — đã dùng mặc định hệ thống. Bạn có thể chọn lại bên dưới.
          </Text>
        </ColorBlock>
      ) : null}

      <Section title="Về chúng tôi">
        <View style={styles.about} accessibilityLabel={`Giới thiệu ${aboutCopy.name} và ${brand.name}`}>
          <NgaiMiuPlaceholder size={88} pose="bow" accessibilityLabel="Ngài Miu" />
          <View style={styles.aboutCopy}>
            <Text style={styles.aboutName}>{aboutCopy.name}</Text>
            <Text style={styles.aboutRole}>{aboutCopy.role}</Text>
            <Text style={styles.aboutBody}>{aboutCopy.body}</Text>
          </View>
        </View>
      </Section>

      <Section title="Vùng LTTV mặc định" subtitle="Áp dụng khi mở công cụ tính lương.">
        <ChipRow equal>
          {REGIONS.map((region) => (
            <ChoiceChip
              key={region}
              flex
              label={`Vùng ${region}`}
              selected={preferences.defaultRegion === region}
              onPress={() => void setDefaultRegion(region)}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title="Năm thuế mặc định">
        <ChipRow equal>
          {TAX_YEARS.map((year) => (
            <ChoiceChip
              key={year}
              flex
              label={String(year)}
              selected={preferences.defaultTaxYear === year}
              onPress={() => void setDefaultTaxYear(year)}
            />
          ))}
        </ChipRow>
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
              Tính toán và cài đặt được lưu cục bộ trên thiết bị. Ứng dụng không yêu cầu CCCD, MST
              hay số sổ BHXH. Không gửi dữ liệu lương/thuế lên máy chủ trong phạm vi hiện tại.
            </Text>
            <Text style={[styles.privacyTitle, { marginTop: space[4] }]}>Disclaimer</Text>
            <Text style={styles.privacyBody}>
              {brand.name} chỉ hỗ trợ ước tính. Kết quả không thay thế tư vấn pháp lý, kế toán hay
              quyết định của cơ quan thuế / BHXH.
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
        <Button
          label="Xem lại hướng dẫn với Ngài Miu"
          variant="secondary"
          onPress={() => void requestOnboardingReplay()}
        />
      </Section>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  softWarn: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  about: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[4],
    backgroundColor: colors.secondarySoft,
    padding: space[4],
    borderRadius: radii.lg,
  },
  aboutCopy: {
    flex: 1,
    gap: space[1],
  },
  aboutName: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.foreground,
  },
  aboutRole: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: space[1],
  },
  aboutBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foregroundMuted,
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
