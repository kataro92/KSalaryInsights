import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Button } from '@/src/components/common/Button';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { Section } from '@/src/components/common/Section';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          <View style={styles.hero}>
            <NgaiMiuPlaceholder size={72} pose="wave" accessibilityLabel="Ngài Miu mùa quyết toán" />
            <Text style={styles.heroText}>
              Trả lời nhanh để biết nên ủy quyền qua công ty hay tự quyết toán — không thu thập giấy
              tờ trong app.
            </Text>
          </View>

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

          <Button label="Xem kết luận" onPress={() => setSubmitted(true)} />

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
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingVertical: space[6],
    paddingHorizontal: layout.pagePaddingX,
    alignItems: 'center',
  },
  inner: { width: '100%', maxWidth: layout.maxContentWidth, gap: space[5] },
  hero: { flexDirection: 'row', gap: space[4], alignItems: 'center' },
  heroText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
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
    color: colors.foreground,
    opacity: 0.7,
  },
});
