import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { ComparisonView } from '@/src/components/comparison/ComparisonView';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import type { RegionCode } from '@/src/domain/types/salary';
import { compareRulesets } from '@/src/engine/compareRulesets';
import { colors, layout, space, typography } from '@/src/theme/tokens';

function paramString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

export function ComparisonScreen() {
  const params = useLocalSearchParams();
  const gross = Number(paramString(params.gross));
  const region = (paramString(params.region) || 'I') as RegionCode;
  const numDependents = Number(paramString(params.numDependents) || '0');
  const month = Number(paramString(params.month) || '3');
  const insuranceRaw = paramString(params.insuranceSalary);
  const insuranceSalary = insuranceRaw ? Number(insuranceRaw) : undefined;

  const outcome = useMemo(
    () =>
      compareRulesets({
        gross,
        region,
        numDependents: Number.isFinite(numDependents) ? numDependents : 0,
        month: Number.isFinite(month) ? month : 3,
        insuranceSalary:
          insuranceSalary != null && Number.isFinite(insuranceSalary)
            ? insuranceSalary
            : undefined,
      }),
    [gross, region, numDependents, month, insuranceSalary],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'So sánh 2025 vs 2026', headerShown: true }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        accessibilityLabel="Màn hình so sánh biểu thuế"
      >
        <View style={styles.inner}>
          {!outcome.ok ? (
            <ColorBlock tone="primarySoft">
              <Text style={styles.error}>{outcome.message}</Text>
              <Text style={styles.hint}>Không so sánh được với tham số hiện tại.</Text>
            </ColorBlock>
          ) : (
            <>
              <ComparisonView result={outcome.result} />
              <DisclaimerFooter
                legalSources={[
                  ...new Set([
                    ...outcome.result.year1.legalSources,
                    ...outcome.result.year2.legalSources,
                  ]),
                ]}
              />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: space[6],
    paddingHorizontal: layout.pagePaddingX,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    gap: space[5],
  },
  error: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
  },
  hint: {
    marginTop: space[2],
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foreground,
    opacity: 0.7,
  },
});
