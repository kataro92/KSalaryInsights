import {
  Baby,
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  HeartPulse,
  Landmark,
} from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HubNavCard } from '@/src/components/common/HubNavCard';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { Section } from '@/src/components/common/Section';
import { OutOfScopeNote } from '@/src/components/disclaimer/OutOfScopeNote';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import { colors, space, typography } from '@/src/theme/tokens';

/** Hub quyền lợi — nhóm theo việc làm / BHXH / thu nhập khác. */
export function BenefitsScreen() {
  const router = useRouter();

  return (
    <ScreenShell accessibilityLabel="Quyền lợi BHXH và nghỉ việc" decorated>
      <View style={styles.hero}>
        <Text style={styles.brand}>KVSalaryTools</Text>
        <Text style={styles.heroTitle}>Quyền lợi</Text>
        <Text style={styles.heroBody}>
          Ước tính offline theo ruleset — không thay quyết định BHXH hay tờ khai thuế.
        </Text>
      </View>

      <NgaiMiuTip tip="Chọn một mục bên dưới. Mỗi máy tính độc lập — không cộng vào lương Gross↔Net." />

      <Section title="BHXH hàng ngày" subtitle="Thai sản, ốm đau, hưu / một lần.">
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
      </Section>

      <Section title="Nghỉ việc" subtitle="BLLĐ thôi việc / mất việc và BHTN.">
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
      </Section>

      <Section title="Ngoài lương" subtitle="Cho thuê, HKD, CK, ESOP, vãng lai.">
        <HubNavCard
          title="Thu nhập khác"
          description="Năm calculator tách biệt · tỷ lệ từ ruleset"
          tone="muted"
          icon={<CircleDollarSign color={colors.foreground} size={26} strokeWidth={2.2} />}
          onPress={() => router.push('/other-income')}
        />
      </Section>

      <OutOfScopeNote />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: { gap: space[2], marginBottom: space[1] },
  brand: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 32,
    letterSpacing: typography.letterSpacingTight,
    color: colors.foreground,
  },
  heroBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.foreground,
    opacity: 0.75,
    maxWidth: 420,
  },
});
