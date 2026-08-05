import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_STORAGE_KEY = 'kv.onboarding.v1';

export type OnboardingState = {
  completed: boolean;
  completedAt?: string;
};

type Listener = () => void;
const replayListeners = new Set<Listener>();

export function subscribeOnboardingReplay(listener: Listener): () => void {
  replayListeners.add(listener);
  return () => {
    replayListeners.delete(listener);
  };
}

export async function loadOnboardingCompleted(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as OnboardingState;
    return !!parsed.completed;
  } catch {
    return false;
  }
}

export async function saveOnboardingCompleted(): Promise<void> {
  const payload: OnboardingState = {
    completed: true,
    completedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

/** Clear flag and notify RootGate to show onboarding immediately. */
export async function requestOnboardingReplay(): Promise<void> {
  await resetOnboarding();
  replayListeners.forEach((l) => l());
}
