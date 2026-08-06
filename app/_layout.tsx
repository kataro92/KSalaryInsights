import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoadingOverlay } from "@/src/components/loading/LoadingOverlay";
import { OnboardingScreen } from "@/src/components/onboarding/OnboardingScreen";
import { SplashView } from "@/src/components/splash/SplashView";
import { LoadingProvider, useLoading } from "@/src/hooks/useLoading";
import {
  PreferencesProvider,
  usePreferences,
} from "@/src/hooks/usePreferences";
import { I18nProvider } from "@/src/i18n/useI18n";
import {
  loadOnboardingCompleted,
  subscribeOnboardingReplay,
} from "@/src/store/onboarding";
import { hydrateRulesetOverlaysFromCache } from "@/src/engine/rulesetUpdate";
import { ThemeProvider, useTheme } from "@/src/theme/ThemeProvider";
import { FontsReadyContext } from "@/src/theme/FontsReady";
import { motion, typography } from "@/src/theme/tokens";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Session-scoped: skip full branded splash on subsequent mounts in same JS runtime. */
let coldStartSplashConsumed = false;

function RootGate({ children }: { children: ReactNode }) {
  const { ready } = usePreferences();
  const { visible, message } = useLoading();
  const { colors, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const showBrandedSplash = !coldStartSplashConsumed;
  const [splashVisible, setSplashVisible] = useState(showBrandedSplash);
  const [onboarding, setOnboarding] = useState<"loading" | "show" | "done">(
    "loading"
  );
  const startedAt = useRef(Date.now());
  const finished = useRef(false);

  useEffect(() => {
    void loadOnboardingCompleted().then((done) => {
      setOnboarding(done ? "done" : "show");
    });
    return subscribeOnboardingReplay(() => setOnboarding("show"));
  }, []);

  useEffect(() => {
    void hydrateRulesetOverlaysFromCache().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (finished.current) return;

    // Never dismiss into UI that painted with system fallback fonts.
    const assetsReady = fontsLoaded && ready && onboarding !== "loading";
    const elapsed = Date.now() - startedAt.current;
    const minBrand = showBrandedSplash ? motion.splashBrandMs : 0;

    const finish = async () => {
      if (finished.current || !fontsLoaded) return;
      finished.current = true;
      coldStartSplashConsumed = true;
      setSplashVisible(false);
      await SplashScreen.hideAsync().catch(() => undefined);
    };

    if (!showBrandedSplash && assetsReady) {
      void finish();
      return;
    }

    const remainingMin = Math.max(0, minBrand - elapsed);
    const hardCapLeft = Math.max(0, motion.splashMaxMs - elapsed);

    if (assetsReady) {
      const t = setTimeout(
        () => void finish(),
        Math.min(remainingMin, hardCapLeft)
      );
      return () => clearTimeout(t);
    }

    // Cap only applies once fonts are in; keep splash until then.
    if (!fontsLoaded) return;

    const cap = setTimeout(() => void finish(), hardCapLeft);
    return () => clearTimeout(cap);
  }, [fontsLoaded, ready, showBrandedSplash, onboarding]);

  return (
    <FontsReadyContext.Provider value={fontsLoaded}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        {/* Mount tabs only after ExtraBold is available so tab 1 matches other tabs. */}
        {fontsLoaded ? (
          <View key="app-fonts-ready" style={{ flex: 1 }}>
            {children}
          </View>
        ) : (
          <View style={{ flex: 1, backgroundColor: colors.background }} />
        )}
        <SplashView visible={splashVisible || !fontsLoaded} />
        {fontsLoaded && !splashVisible && onboarding === "show" ? (
          <OnboardingScreen onDone={() => setOnboarding("done")} />
        ) : null}
        <LoadingOverlay visible={visible} message={message} />
      </View>
    </FontsReadyContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <ThemeProvider>
          <I18nProvider>
            <LoadingProvider>
              <RootGate>
                <ThemedStack />
              </RootGate>
            </LoadingProvider>
          </I18nProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function ThemedStack() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.scale.subtitle.fontSize,
          color: colors.foreground,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="comparison"
        options={{ headerShown: true, title: "So sánh 2025 vs 2026" }}
      />
      <Stack.Screen
        name="filing-wizard"
        options={{ headerShown: true, title: "Hướng dẫn quyết toán" }}
      />
      <Stack.Screen
        name="severance"
        options={{ headerShown: true, title: "Thôi việc / mất việc" }}
      />
      <Stack.Screen
        name="unemployment"
        options={{ headerShown: true, title: "Trợ cấp thất nghiệp" }}
      />
      <Stack.Screen
        name="maternity"
        options={{ headerShown: true, title: "Thai sản" }}
      />
      <Stack.Screen
        name="sick-leave"
        options={{ headerShown: true, title: "Nghỉ ốm" }}
      />
      <Stack.Screen
        name="retirement"
        options={{ headerShown: true, title: "Lương hưu / nhận một lần" }}
      />
      <Stack.Screen
        name="other-income"
        options={{ headerShown: true, title: "Thu nhập khác" }}
      />
    </Stack>
  );
}
