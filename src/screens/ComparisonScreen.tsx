import { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

import { EmptyErrorState } from '@/src/components/common/EmptyErrorState';
import { ToolScreen } from '@/src/components/common/ToolScreen';
import { ComparisonView } from '@/src/components/comparison/ComparisonView';
import { DisclaimerFooter } from '@/src/components/disclaimer/DisclaimerFooter';
import type { RegionCode } from '@/src/domain/types/salary';
import { compareRulesets } from '@/src/engine/compareRulesets';

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
          <EmptyErrorState
            variant="error"
            title="Không so sánh được"
            body={outcome.message}
          />
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
