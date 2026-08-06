import { useState } from "react";
import { View } from "react-native";

import { PaternityLeaveBreakdownCard } from "@/src/components/breakdown/PaternityLeaveBreakdownCard";
import { Button } from "@/src/components/common/Button";
import { EmptyErrorState } from "@/src/components/common/EmptyErrorState";
import { ResultHero } from "@/src/components/common/ResultHero";
import { ToolScreen } from "@/src/components/common/ToolScreen";
import { DisclaimerFooter } from "@/src/components/disclaimer/DisclaimerFooter";
import {
  PaternityLeaveInputs,
  type PaternityLeaveInputsValue,
} from "@/src/components/inputs/PaternityLeaveInputs";
import { NgaiMiuTip } from "@/src/components/mascot/NgaiMiuTip";
import { emptyCopy, miuTips } from "@/src/copy/miu";
import type { PaternityLeaveBreakdown } from "@/src/domain/types/benefits";
import { calculatePaternityLeave } from "@/src/engine/paternityLeave";
import { useScrollToAnchor } from "@/src/hooks/useScrollToAnchor";
import { successHaptic } from "@/src/theme/haptics";
import { parseMoney } from "@/src/theme/money";

export function PaternityLeaveCalculatorScreen() {
  const { scrollRef, anchorRef, onScroll, scrollToAnchor } = useScrollToAnchor();
  const [inputs, setInputs] = useState<PaternityLeaveInputsValue>({
    avgText: "18.000.000",
    birthDate: "2026-08-15",
    childOrder: "first",
    numChildren: 1,
    surgeryOrPreterm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaternityLeaveBreakdown | null>(null);

  const onCalculate = () => {
    setError(null);
    const avg = parseMoney(inputs.avgText);
    if (avg == null || avg <= 0) {
      setError("Nhập bình quân lương hợp lệ.");
      setResult(null);
      return;
    }
    try {
      const next = calculatePaternityLeave({
        avgSalary6m: avg,
        birthDate: inputs.birthDate,
        childOrder: inputs.childOrder,
        numChildren: inputs.numChildren,
        surgeryOrPreterm: inputs.surgeryOrPreterm,
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
      title="Nghỉ của chồng"
      subtitle="Ước số ngày làm việc và tiền chế độ khi vợ sinh (Điều 53)."
      accessibilityLabel="Máy tính nghỉ của chồng khi vợ sinh"
      scrollRef={scrollRef}
      onScroll={onScroll}
      sticky={<Button label="Tính nghỉ của chồng" onPress={onCalculate} />}
    >
      <PaternityLeaveInputs
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
            eyebrow="Tiền chế độ ước tính"
            label="Tổng"
            amount={result.amount}
          />
          <NgaiMiuTip tip={miuTips.paternityLeave} />
          <PaternityLeaveBreakdownCard result={result} hideTotal />
          <DisclaimerFooter
            legalSources={result.legalSources}
            collapseSources
          />
        </View>
      ) : !error ? (
        <EmptyErrorState
          title={emptyCopy.paternityLeave.title}
          body={emptyCopy.paternityLeave.body}
        />
      ) : null}
    </ToolScreen>
  );
}
