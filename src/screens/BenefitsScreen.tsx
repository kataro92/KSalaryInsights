import {
  Baby,
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  HeartPulse,
  Landmark,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HubNavCard } from '@/src/components/common/HubNavCard';
import { PageHero } from '@/src/components/common/PageHero';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { SeasonalBanner } from '@/src/components/common/SeasonalBanner';
import { Section } from '@/src/components/common/Section';
import { OutOfScopeNote } from '@/src/components/disclaimer/OutOfScopeNote';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { miuTips } from '@/src/copy/miu';
import { colors, space } from '@/src/theme/tokens';

/** Hub quyền lợi — nhóm theo việc làm / BHXH / thu nhập khác. */
export function BenefitsScreen() {
  const router = useRouter();

  return (
    <ScreenShell accessibilityLabel="Quyền lợi BHXH và nghỉ việc" decorated>
      <PageHero
        title="Quyền lợi"
        subtitle="Ước tính offline theo ruleset — không thay quyết định BHXH hay tờ khai thuế."
      />

      <SeasonalBanner />

      <NgaiMiuTip tip={miuTips.benefitsHub} />

      <Section title="BHXH hàng ngày" subtitle="Thai sản, ốm đau, hưu / một lần.">
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thai sản"
            description="Tháng nghỉ, trợ cấp 1 lần theo mức tham chiếu"
            tone="secondarySoft"
            icon={<Baby color={colors.secondary} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/maternity')}
          />
          <HubNavCard
            title="Ốm đau"
            description="75% ÷ 24 ngày · trần năm theo năm đóng"
            tone="secondarySoft"
            icon={<HeartPulse color={colors.secondary} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/sick-leave')}
          />
          <HubNavCard
            title="Hưu / BHXH một lần"
            description="So sánh hai kịch bản · bắt buộc đọc cảnh báo"
            tone="accentSoft"
            icon={<Landmark color={colors.accent} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/retirement')}
          />
        </View>
      </Section>

      <Section title="Nghỉ việc" subtitle="BLLĐ thôi việc / mất việc và BHTN.">
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thôi việc / mất việc"
            description="Đ.46–47 · trừ thời gian BHTN đã đóng"
            tone="primarySoft"
            icon={<BriefcaseBusiness color={colors.primary} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/severance')}
          />
          <HubNavCard
            title="Trợ cấp thất nghiệp"
            description="60% · trần 5×LTTV · số tháng hưởng"
            tone="primarySoft"
            icon={<Coins color={colors.primary} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/unemployment')}
          />
        </View>
      </Section>

      <Section title="Ngoài lương" subtitle="Cho thuê, HKD, CK, ESOP, vãng lai.">
        <View style={styles.cardStack}>
          <HubNavCard
            title="Thu nhập khác"
            description="Năm calculator tách biệt · tỷ lệ từ ruleset"
            tone="muted"
            icon={<CircleDollarSign color={colors.foreground} size={26} strokeWidth={2.2} />}
            onPress={() => router.push('/other-income')}
          />
        </View>
      </Section>

      <OutOfScopeNote />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cardStack: {
    gap: space[3],
  },
});
