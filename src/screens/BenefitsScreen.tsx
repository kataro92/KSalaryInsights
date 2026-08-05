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
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { useTheme } from "@/src/theme/ThemeProvider";
import { space } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

/** Hub quyền lợi. Nhóm theo việc làm / BHXH / thu nhập khác. */
export function BenefitsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <ScreenShell accessibilityLabel="Quyền lợi BHXH và nghỉ việc" decorated>
      <PageHero
        title="Quyền lợi"
        subtitle="Ước tính theo mức thuế · BH hiện hành. Không thay quyết định của BHXH hay cơ quan thuế."
      />

      <SeasonalBanner />

      <NgaiMiuTip tip={miuTips.benefitsHub} />

      <Section title="BHXH" subtitle="Thai sản, ốm đau, hưu hoặc rút một lần.">
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thai sản"
            description="Số tháng nghỉ và trợ cấp một lần"
            tone="secondarySoft"
            icon={<AppIcon name="baby" color={colors.secondary} size={26} />}
            onPress={() => router.push("/maternity")}
          />
          <HubNavCard
            title="Ốm đau"
            description="75% lương ngày · có trần theo năm đóng"
            tone="secondarySoft"
            icon={
              <AppIcon name="heart-pulse" color={colors.secondary} size={26} />
            }
            onPress={() => router.push("/sick-leave")}
          />
          <HubNavCard
            title="Hưu / BHXH một lần"
            description="So sánh hai hướng. đọc cảnh báo trước"
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
            description="Theo Bộ luật Lao động · trừ thời gian đã đóng BHTN"
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
        subtitle="Cho thuê, hộ kinh doanh, chứng khoán, ESOP, vãng lai."
      >
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thu nhập khác"
            description="Ước nhanh hoặc đầy đủ · theo năm thuế"
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
