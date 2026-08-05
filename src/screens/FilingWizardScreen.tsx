import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { NgaiMiuTip } from '@/src/components/mascot/NgaiMiuTip';
import type { FilingWizardAnswers } from '@/src/domain/types/settlement';
import { evaluateFilingWizard } from '@/src/engine/filingWizard';
import { colors, layout, radii, space, typography } from '@/src/theme/tokens';

function paramString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

export function FilingWizardScreen() {
  const params = useLocalSearchParams();
  const year = Number(paramString(params.year) || '2025');
  const [answers, setAnswers] = useState<FilingWizardAnswers>({
    hasSingleEmployerFullYear: true,
    hasOtherIncome: false,
    employerOffersAuthorization: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? evaluateFilingWizard(answers, year) : null),
    [submitted, answers, year],
  );

  const toggle = (key: keyof FilingWizardAnswers) => {
    setSubmitted(false);
    setAnswers((a) => ({ ...a, [key]: !a[key] }));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Wizard quyết toán', headerShown: true }} />
      <ToolScreen
      nested
        title="Wizard quyết toán"
        subtitle={`Năm ${year} — trả lời nhanh để chọn ủy quyền hay tự QT.`}
        showBrand={false}
        accessibilityLabel="Wizard quyết toán thuế"
        sticky={<Button label="Xem kết luận" onPress={() => setSubmitted(true)} />}
        aboveTabBar={false}
      >
        <NgaiMiuTip tip="Không thu thập giấy tờ trong app — chỉ gợi ý hướng nộp." />

        <Section title="Điều kiện">
          {(
            [
              ['hasSingleEmployerFullYear', 'Chỉ một NSDLĐ trong cả năm?'],
              ['hasOtherIncome', 'Có thu nhập khác ngoài lương (vãng lai…)?'],
              ['employerOffersAuthorization', 'Công ty hỗ trợ ủy quyền quyết toán?'],
            ] as const
          ).map(([key, label]) => {
            const on = answers[key];
            return (
              <Pressable
                key={key}
                onPress={() => toggle(key)}
                style={[styles.q, on && styles.qOn]}
                accessibilityRole="switch"
                accessibilityState={{ checked: on }}
              >
                <Text style={[styles.qText, on && styles.qTextOn]}>{label}</Text>
                <Text style={[styles.qAns, on && styles.qTextOn]}>{on ? 'Có' : 'Không'}</Text>
              </Pressable>
            );
          })}
        </Section>

        {result ? (
          <ColorBlock tone={result.conclusion === 'authorize' ? 'secondarySoft' : 'primarySoft'}>
            <Text style={styles.conclusion}>
              {result.conclusion === 'authorize'
                ? 'Hướng: ủy quyền qua tổ chức'
                : 'Hướng: tự quyết toán'}
            </Text>
            <Text style={styles.deadline}>Hạn tổ chức: {result.orgDeadlineLabel}</Text>
            <Text style={styles.deadline}>Hạn cá nhân: {result.individualDeadlineLabel}</Text>
            <Text style={styles.checkTitle}>Checklist</Text>
            {result.checklist.map((c) => (
              <Text key={c} style={styles.checkItem}>
                • {c}
              </Text>
            ))}
            {result.notes.map((n) => (
              <Text key={n} style={styles.note}>
                {n}
              </Text>
            ))}
          </ColorBlock>
        ) : null}
      </ToolScreen>
    </>
  );
}

const styles = StyleSheet.create({
  q: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[2],
  },
  qOn: { backgroundColor: colors.primary },
  qText: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
    paddingRight: space[3],
  },
  qAns: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
  },
  qTextOn: { color: colors.white },
  conclusion: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: colors.foreground,
    marginBottom: space[3],
  },
  deadline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    marginBottom: space[1],
  },
  checkTitle: {
    marginTop: space[4],
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  checkItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
  },
  note: {
    marginTop: space[3],
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.foregroundMuted,
  },
});
