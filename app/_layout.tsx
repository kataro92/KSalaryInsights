import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoadingOverlay } from '@/src/components/loading/LoadingOverlay';
import { OnboardingScreen } from '@/src/components/onboarding/OnboardingScreen';
import { SplashView } from '@/src/components/splash/SplashView';
import { LoadingProvider, useLoading } from '@/src/hooks/useLoading';
import { PreferencesProvider, usePreferences } from '@/src/hooks/usePreferences';
import { I18nProvider } from '@/src/i18n/useI18n';
import { loadOnboardingCompleted, subscribeOnboardingReplay } from '@/src/store/onboarding';
import { hydrateRulesetOverlaysFromCache } from '@/src/engine/rulesetUpdate';
import { colors, motion } from '@/src/theme/tokens';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Session-scoped: skip full branded splash on subsequent mounts in same JS runtime. */
let coldStartSplashConsumed = false;

function RootGate({ children }: { children: ReactNode }) {
  const { ready } = usePreferences();
  const { visible, message } = useLoading();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const showBrandedSplash = !coldStartSplashConsumed;
  const [splashVisible, setSplashVisible] = useState(showBrandedSplash);
  const [onboarding, setOnboarding] = useState<'loading' | 'show' | 'done'>('loading');
  const startedAt = useRef(Date.now());
  const finished = useRef(false);

  useEffect(() => {
    void loadOnboardingCompleted().then((done) => {
      setOnboarding(done ? 'done' : 'show');
    });
    return subscribeOnboardingReplay(() => setOnboarding('show'));
  }, []);

  useEffect(() => {
    void hydrateRulesetOverlaysFromCache().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (finished.current) return;

    const assetsReady = fontsLoaded && ready && onboarding !== 'loading';
    const elapsed = Date.now() - startedAt.current;
    const minBrand = showBrandedSplash ? motion.splashBrandMs : 0;

    const finish = async () => {
      if (finished.current) return;
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
      const t = setTimeout(() => void finish(), Math.min(remainingMin, hardCapLeft));
      return () => clearTimeout(t);
    }

    const cap = setTimeout(() => void finish(), hardCapLeft);
    return () => clearTimeout(cap);
  }, [fontsLoaded, ready, showBrandedSplash, onboarding]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />
      {children}
      <SplashView visible={splashVisible} />
      {!splashVisible && onboarding === 'show' ? (
        <OnboardingScreen onDone={() => setOnboarding('done')} />
      ) : null}
      <LoadingOverlay visible={visible} message={message} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <I18nProvider>
          <LoadingProvider>
            <RootGate>
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="comparison"
                  options={{ headerShown: true, title: 'So sánh 2025 vs 2026' }}
                />
                <Stack.Screen
                  name="filing-wizard"
                  options={{ headerShown: true, title: 'Wizard quyết toán' }}
                />
                <Stack.Screen
                  name="severance"
                  options={{ headerShown: true, title: 'Thôi việc / mất việc' }}
                />
                <Stack.Screen
                  name="unemployment"
                  options={{ headerShown: true, title: 'Trợ cấp thất nghiệp' }}
                />
                <Stack.Screen
                  name="maternity"
                  options={{ headerShown: true, title: 'Thai sản' }}
                />
                <Stack.Screen
                  name="sick-leave"
                  options={{ headerShown: true, title: 'Ốm đau' }}
                />
                <Stack.Screen
                  name="retirement"
                  options={{ headerShown: true, title: 'Hưu / BHXH một lần' }}
                />
                <Stack.Screen
                  name="other-income"
                  options={{ headerShown: true, title: 'Thu nhập khác' }}
                />
              </Stack>
            </RootGate>
          </LoadingProvider>
        </I18nProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
