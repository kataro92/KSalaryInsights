import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/common/Button";
import {
  NgaiMiuPlaceholder,
  type MascotPose,
} from "@/src/components/mascot/NgaiMiuPlaceholder";
import { brand } from "@/src/copy/miu";
import { useI18n } from "@/src/i18n/useI18n";
import { saveOnboardingCompleted } from "@/src/store/onboarding";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { layout, space, typography } from "@/src/theme/tokens";
import { useThemedStyles } from "@/src/theme/useThemedStyles";

type Props = {
  onDone: () => void;
};

const STEP_POSES: MascotPose[] = ["wave", "point", "tip", "bow"];

export function OnboardingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const styles = useThemedStyles(makeStyles);
  const [index, setIndex] = useState(0);
  const last = index === STEP_POSES.length - 1;

  const steps = [
    {
      title: t("onboarding.s1.title"),
      body: t("onboarding.s1.body"),
      pose: STEP_POSES[0],
    },
    {
      title: t("onboarding.s2.title"),
      body: t("onboarding.s2.body"),
      pose: STEP_POSES[1],
    },
    {
      title: t("onboarding.s3.title"),
      body: t("onboarding.s3.body"),
      pose: STEP_POSES[2],
    },
    {
      title: t("onboarding.s4.title"),
      body: t("onboarding.s4.body"),
      pose: STEP_POSES[3],
    },
  ];
  const step = steps[index];

  const finish = async () => {
    await saveOnboardingCompleted();
    onDone();
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, space[6]),
          paddingBottom: Math.max(insets.bottom, space[6]),
        },
      ]}
      accessibilityLabel={`Giới thiệu ${brand.name}`}
    >
      <View style={styles.decor} pointerEvents="none" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("onboarding.skip")}
        onPress={() => void finish()}
        style={styles.skip}
      >
        <Text style={styles.skipLabel}>{t("onboarding.skip")}</Text>
      </Pressable>

      <View style={styles.center}>
        <NgaiMiuPlaceholder
          size={152}
          pose={step.pose}
          accessibilityLabel="Ngài Miu hướng dẫn"
        />
        <Text style={styles.brand}>{brand.name}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
      </View>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.actions}>
        {last ? (
          <Button label={t("onboarding.start")} onPress={() => void finish()} />
        ) : (
          <Button
            label={t("onboarding.next")}
            onPress={() => setIndex((i) => i + 1)}
          />
        )}
      </View>

      <Text style={styles.privacy}>{t("onboarding.privacy")}</Text>
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    root: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 30,
      paddingHorizontal: layout.pagePaddingX,
      justifyContent: "space-between",
    },
    decor: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.primary,
      opacity: 0.08,
      top: -40,
      right: -80,
    },
    skip: {
      alignSelf: "flex-end",
      minHeight: layout.minTouch,
      justifyContent: "center",
      paddingHorizontal: space[2],
    },
    skipLabel: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 15,
      color: colors.primary,
    },
    center: {
      alignItems: "center",
      gap: space[3],
      paddingHorizontal: space[2],
    },
    brand: {
      fontFamily: typography.fontFamily.extraBold,
      fontSize: 22,
      color: colors.foreground,
      letterSpacing: -0.3,
    },
    title: {
      fontFamily: typography.fontFamily.bold,
      fontSize: 22,
      color: colors.foreground,
      textAlign: "center",
    },
    body: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 15,
      lineHeight: 22,
      color: colors.foregroundMuted,
      textAlign: "center",
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: space[2],
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    dotOn: {
      backgroundColor: colors.primary,
      width: 20,
    },
    actions: {
      gap: space[2],
    },
    privacy: {
      fontFamily: typography.fontFamily.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.foregroundMuted,
      textAlign: "center",
    },
  } as const;
}
