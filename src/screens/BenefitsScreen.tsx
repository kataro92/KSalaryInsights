import { View } from "react-native";
import { useRouter } from "expo-router";

import { AppIcon } from "@/src/components/common/AppIcon";
import { HubNavCard } from "@/src/components/common/HubNavCard";
import { PageHero } from "@/src/components/common/PageHero";
import { ScreenShell } from "@/src/components/common/ScreenShell";
import { SeasonalBanner } from "@/src/components/common/SeasonalBanner";
import { Section } from "@/src/components/common/Section";
import { OutOfScopeNote } from "@/src/components/disclaimer/OutOfScopeNote";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { miuTips } from "@/src/copy/miu";
import { useI18n } from "@/src/i18n/useI18n";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

/** Hub quyền lợi. Nhóm theo việc làm / bảo hiểm xã hội / thu nhập khác. */
export function BenefitsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <ScreenShell accessibilityLabel={t("benefits.title")} decorated>
      <PageHero
        showBrand
        title={t("benefits.title")}
        subtitle={t("benefits.subtitle")}
      />

      <SeasonalBanner />

      <NgaiMiuTip tip={miuTips.benefitsHub} />

      <Section
        title="Bảo hiểm xã hội"
        subtitle="Thai sản, nghỉ ốm, lương hưu hoặc nhận một lần."
      >
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thai sản"
            description="Tiền thai sản theo tháng nghỉ và khoản một lần"
            tone="secondarySoft"
            icon={<AppIcon name="baby" color={colors.secondary} size={26} />}
            onPress={() => router.push("/maternity")}
          />
          <HubNavCard
            title="Nghỉ của chồng"
            description="Số ngày làm việc và tiền chế độ khi vợ sinh"
            tone="secondarySoft"
            icon={<AppIcon name="baby" color={colors.secondary} size={26} />}
            onPress={() => router.push("/paternity-leave")}
          />
          <HubNavCard
            title="Nghỉ ốm"
            description="Tiền nghỉ ốm hưởng bảo hiểm xã hội"
            tone="secondarySoft"
            icon={
              <AppIcon name="heart-pulse" color={colors.secondary} size={26} />
            }
            onPress={() => router.push("/sick-leave")}
          />
          <HubNavCard
            title="Lương hưu / nhận một lần"
            description="So sánh lương hưu với khoản bảo hiểm xã hội một lần"
            tone="accentSoft"
            icon={<AppIcon name="landmark" color={colors.accent} size={26} />}
            onPress={() => router.push("/retirement")}
          />
        </View>
      </Section>

      <Section
        title="Nghỉ việc"
        subtitle="Trợ cấp thôi việc, mất việc và thất nghiệp."
      >
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thôi việc / mất việc"
            description="Tiền trợ cấp khi nghỉ việc, đã trừ thời gian đóng thất nghiệp"
            tone="primarySoft"
            icon={<AppIcon name="briefcase" color={colors.primary} size={26} />}
            onPress={() => router.push("/severance")}
          />
          <HubNavCard
            title="Trợ cấp thất nghiệp"
            description="60% lương · trần 5 × lương tối thiểu vùng"
            tone="primarySoft"
            icon={<AppIcon name="coins" color={colors.primary} size={26} />}
            onPress={() => router.push("/unemployment")}
          />
        </View>
      </Section>

      <Section
        title="Ngoài lương"
        subtitle="Cho thuê, hộ kinh doanh / freelancer, chứng khoán, ESOP, thu nhập vãng lai. Không tính thuế coin."
      >
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thu nhập khác"
            description="Tính nhanh hoặc nhập đầy đủ theo năm thuế"
            tone="muted"
            icon={
              <AppIcon
                name="circle-dollar"
                color={colors.foreground}
                size={26}
              />
            }
            onPress={() => router.push("/other-income")}
          />
        </View>
      </Section>

      <OutOfScopeNote />
    </ScreenShell>
  );
}

function makeStyles(_theme: ThemeContextValue) {
  return {
    cardStack: {
      gap: space[3],
    },
  } satisfies ThemedStyleSheet;
}
