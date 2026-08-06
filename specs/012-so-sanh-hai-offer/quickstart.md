# Quickstart: F021 So sánh hai offer

**Prereq**: F022 presets hoạt động trên Calculator.

## A — Net 28tr vs Gross 32tr (US1)

1. Mở So 2 offer từ Calculator.
2. Shared: 2026, tháng 3, vùng I, 0 NPT.
3. A: Net→Gross, 28.000.000, BH full. B: Gross→Net, 32.000.000, BH full.
4. **Expect**: cả hai ok; ΔNet hiện; số từng cột = Calculator đơn ±1; không copy “nên chọn”.

## B — BH 100% vs 70% (US2)

1. A & B: Gross→Net 30.000.000; A full; B 70%.
2. **Expect**: BH(A)>BH(B); Net(B)>Net(A); căn cứ 30tr vs 21tr.

## C — Infeasible side

1. A: Net 1.000.000 (quá thấp). B: Gross 30tr ok.
2. **Expect**: A lỗi + minFeasibleNet; B ok; **không** hiện ΔNet.

## D — Scenario save (FR-004)

1. Lưu cặp → reload → cùng input/result.

## Unit

```bash
npm run test:unit -- offerCompare
```
