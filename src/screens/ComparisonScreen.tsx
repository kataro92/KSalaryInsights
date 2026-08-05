import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ColorBlock } from '@/src/components/common/ColorBlock';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { ComparisonView } from '@/src/components/comparison/ComparisonView';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import type { RegionCode } from '@/src/domain/types/salary';
import { compareRulesets } from '@/src/engine/compareRulesets';
import { colors, space, typography } from '@/src/theme/tokens';

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
      <ToolScreen
      nested
        title="So sánh biểu thuế"
        subtitle="Gross giữ nguyên — đối chiếu Net / thuế giữa 2025 và 2026."
        showBrand={false}
        accessibilityLabel="Màn hình so sánh biểu thuế"
        aboveTabBar={false}
      >
        {!outcome.ok ? (
          <ColorBlock tone="primarySoft">
            <Text style={styles.error}>{outcome.message}</Text>
            <Text style={styles.hint}>Không so sánh được với tham số hiện tại.</Text>
          </ColorBlock>
        ) : (
          <>
            <ComparisonView result={outcome.result} />
            <DisclaimerFooter
              collapseSources
              legalSources={[
                ...new Set([
                  ...outcome.result.year1.legalSources,
                  ...outcome.result.year2.legalSources,
                ]),
              ]}
            />
          </>
        )}
      </ToolScreen>
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
  },
  hint: {
    marginTop: space[2],
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.foregroundMuted,
  },
});
