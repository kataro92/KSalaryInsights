import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Light success haptic after a successful calculate.
 * No-ops on web / when the native module is unavailable.
 */
export async function successHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Expo Go / simulator without haptics — ignore
  }
}
