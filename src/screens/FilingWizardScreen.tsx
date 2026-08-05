import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { BulletLine } from "@/src/components/common/BulletLine";
import { Button } from "@/src/components/common/Button";
import { ColorBlock } from "@/src/components/common/ColorBlock";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { Section } from "@/src/components/common/Section";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import type { FilingWizardAnswers } from "@/src/domain/types/settlement";
import { evaluateFilingWizard } from "@/src/engine/filingWizard";
import { successHaptic } from "@/src/theme/haptics";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, radii, space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

function paramString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export function FilingWizardScreen() {
  const params = useLocalSearchParams();
  const year = Number(paramString(params.year) || "2025");
  const styles = useThemedStyles(makeStyles);
  const [answers, setAnswers] = useState<FilingWizardAnswers>({
    hasSingleEmployerFullYear: true,
    hasOtherIncome: false,
    employerOffersAuthorization: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? evaluateFilingWizard(answers, year) : null),
    [submitted, answers, year]
  );

  const toggle = (key: keyof FilingWizardAnswers) => {
    setSubmitted(false);
    setAnswers((a) => ({ ...a, [key]: !a[key] }));
  };

  const onSubmit = () => {
    setSubmitted(true);
    void successHaptic();
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Wizard quyết toán", headerShown: true }}
      />
      <ToolScreen
        nested
        title="Hướng dẫn quyết toán"
        subtitle={`Năm ${year}. Trả lời ngắn để chọn ủy quyền hoặc tự quyết toán.`}
        showBrand={false}
        accessibilityLabel="Wizard quyết toán thuế"
        sticky={<Button label="Xem kết luận" onPress={onSubmit} />}
        aboveTabBar={false}
      >
        <NgaiMiuTip pose="tip" tip={miuTips.filingWizard} />

        <Section title="Điều kiện">
          {(
            [
              ["hasSingleEmployerFullYear", "Chỉ một NSDLĐ trong cả năm?"],
              ["hasOtherIncome", "Có thu nhập khác ngoài lương (vãng lai…)?"],
              [
                "employerOffersAuthorization",
                "Công ty hỗ trợ ủy quyền quyết toán?",
              ],
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
                <Text style={[styles.qText, on && styles.qTextOn]}>
                  {label}
                </Text>
                <Text style={[styles.qAns, on && styles.qTextOn]}>
                  {on ? "Có" : "Không"}
                </Text>
              </Pressable>
            );
          })}
        </Section>

        {result ? (
          <ColorBlock
            tone={
              result.conclusion === "authorize"
                ? "secondarySoft"
                : "primarySoft"
            }
          >
            <Text style={styles.conclusion}>
              {result.conclusion === "authorize"
                ? "Hướng: ủy quyền qua tổ chức"
                : "Hướng: tự quyết toán"}
            </Text>
            <Text style={styles.deadline}>
              Hạn tổ chức: {result.orgDeadlineLabel}
            </Text>
            <Text style={styles.deadline}>
              Hạn cá nhân: {result.individualDeadlineLabel}
            </Text>
            <Text style={styles.checkTitle}>Checklist</Text>
            {result.checklist.map((c) => (
              <BulletLine key={c} style={styles.checkItem}>
                {c}
              </BulletLine>
            ))}
            {result.notes.map((n) => (
              <Text key={n} style={styles.note}>
                {n}
              </Text>
            ))}
          </ColorBlock>
        ) : (
          <EmptyErrorState
            title={emptyCopy.filing.title}
            body={emptyCopy.filing.body}
          />
        )}
      </ToolScreen>
    </>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    q: {
      minHeight: layout.minTouch,
      paddingHorizontal: space[4],
      borderRadius: radii.md,
      backgroundColor: colors.muted,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
  } satisfies ThemedStyleSheet;
}
