import { useState } from "react";
import { View } from "react-native";

import { SickLeaveBreakdownCard } from "@/src/components/breakdown/SickLeaveBreakdownCard";
import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { ResultHero } from "@/src/components/common/ResultHero";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import {
  SickLeaveInputs,
  type SickLeaveInputsValue,
} from "@/src/components/inputs/SickLeaveInputs";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import { TAX_YEAR_OPTIONS } from "@/src/domain/constants/salary";
import type { SickLeaveBreakdown } from "@/src/domain/types/benefits";
import { calculateSickLeave } from "@/src/engine/sickLeave";
import { usePreferences } from "@/src/hooks/usePreferences";
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import { successHaptic } from "@/src/theme/haptics";
import { parseMoney } from "@/src/theme/money";

export function SickLeaveCalculatorScreen() {
  const { preferences } = usePreferences();
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } = useScrollToAnchor();
  const taxYear = (TAX_YEAR_OPTIONS as readonly number[]).includes(
    preferences.defaultTaxYear
  )
    ? preferences.defaultTaxYear
    : 2026;

  const [inputs, setInputs] = useState<SickLeaveInputsValue>({
    salaryText: "12.000.000",
    daysText: "5",
    yearsText: "5",
    hazard: "normal",
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SickLeaveBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const salary = parseMoney(inputs.salaryText);
    const days = Number(inputs.daysText);
    const years = Number(inputs.yearsText || "0");
    if (salary == null || salary <= 0) {
      setError("Nhập lương tháng liền kề hợp lệ.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(days) || days < 0) {
      setError("Số ngày nghỉ không hợp lệ.");
      setResult(null);
      return;
    }
    try {
      const next = calculateSickLeave({
        salaryLastMonth: salary,
        daysRequested: days,
        contributionYears: Number.isFinite(years) ? years : 0,
        hazard: inputs.hazard,
        taxYear,
      });
      setResult(next);
      void successHaptic();
      scrollToAnchor();
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Không tính được.");
    }
  };

  return (
    <ToolScreen
      nested
      title="Ốm đau"
      subtitle="Tính tiền nghỉ ốm hưởng bảo hiểm xã hội. Mức thường là 75% lương ngày và có giới hạn số ngày."
      accessibilityLabel="Máy tính ốm đau"
      scrollRef={scrollRef}
      onScroll={onScroll}
      sticky={<Button label="Tính tiền nghỉ ốm" onPress={onCalculate} />}
    >
      <SickLeaveInputs
        value={inputs}
        onChange={(v) => {
          setInputs(v);
          setResult(null);
        }}
      />
      {error ? (
        <EmptyErrorState
          variant="error"
          title={emptyCopy.calculateError.title}
          body={error}
        />
      ) : null}
      {result ? (
        <View ref={anchorRef} collapsable={false}>
          <ResultHero
            eyebrow="Tiền nghỉ ốm ước tính"
            label="Trợ cấp"
            amount={result.amount}
          />
          <NgaiMiuTip tip={miuTips.sickLeave} />
          <SickLeaveBreakdownCard result={result} hideTotal />
          <DisclaimerFooter
            legalSources={result.legalSources}
            collapseSources
          />
        </View>
      ) : !error ? (
        <EmptyErrorState
          title={emptyCopy.sickLeave.title}
          body={emptyCopy.sickLeave.body}
        />
      ) : null}
    </ToolScreen>
  );
}
