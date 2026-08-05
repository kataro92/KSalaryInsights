import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, typography } from '@/src/theme/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy màn hình</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Về trang chính</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: space[6],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.foreground,
  },
  link: {
    marginTop: space[4],
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
});
