# Tasks: 007-huu-tri-bhxh-mot-lan

**Input**: Design documents from `specs/007-huu-tri-bhxh-mot-lan/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational — `rulesetLoader.ts`, pattern breakdown/disclaimer components, Flat Design cơ bản)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1)

---

## Phase 1: Setup

**Purpose**: Xác nhận hạ tầng ruleset và contract bảng trượt giá sẵn sàng cho calculator hưu trí / BHXH một lần.

- [x] T001 [P] Xác nhận `rulesetLoader.getRuleset()` hoạt động; thiết kế field `inflation_adjustment` với `adjustment_table_year` tách khỏi ruleset thuế (theo `docs/domain/quyen-loi-lao-dong.md` §5.1) — ghi chú contract trong `src/engine/rulesetLoader.ts`.

---

## Phase 2: Foundational (Types + Ruleset + Engine)

**Purpose**: Định nghĩa data contract, tham số Đ.66/Đ.70/CV 340 và engine thuần trước khi UI so sánh.

**⚠️ CRITICAL**: Phase 3 (US1) phụ thuộc phase này.

- [x] T002 [P] Thêm types `LumpSumInput`, `LumpSumBreakdown`, `PensionInput`, `PensionBreakdown`, `EligibilityChecklistItem`, `DisclaimerAckState` trong `src/domain/types/retirement.ts`.
- [x] T003 [P] Bổ sung block `lump_sum_withdrawal`, `pension_rates`, `inflation_adjustment` (bảng CV 340/2026 đầy đủ) vào ruleset JSON và cập nhật `docs/product/ruleset-schema.json` theo plan.md.
- [x] T004 Triển khai `calcLumpSum()` — công thức Đ.70 `(1,5×T1 + 2×T2)×MBQTL`, làm tròn tháng lẻ, edge <1 năm — đọc hệ số từ `Ruleset.lump_sum_withdrawal` trong `src/engine/bhxhLumpSum.ts`.
- [x] T005 Triển khai `calcPensionRate()`, `calcPensionMonthly()` — tỷ lệ Đ.66 ba nhánh nam/nữ — đọc từ `Ruleset.pension_rates` trong `src/engine/pensionEstimate.ts`; export API qua `src/engine/index.ts`.

**Checkpoint**: Engine trả breakdown T1/T2 và rate_steps; TC domain có thể viết test độc lập.

---

## Phase 3: User Story 1 — So sánh hai kịch bản (Priority: P1) 🎯 MVP

**Goal**: Người dùng nhập số năm đóng, giới tính, MBQTL giả định (hoặc chọn bảng trượt giá), acknowledge disclaimer, xem hai cột ước BHXH một lần vs lương hưu/tháng kèm checklist điều kiện rút.

**Independent Test**: TC-LUMPSUM-01, TC-PENSION-01, TC-PENSION-02 pass sai số ≤ 1 đồng; chưa acknowledge → không hiện số.

### Tests for User Story 1

- [x] T006 [P] [US1] Viết unit test `TC-LUMPSUM-01` (T1=4, T2=10, MBQTL=12.000.000 → 312.000.000) + edge tháng lẻ và <1 năm trong `src/__tests__/unit/bhxhLumpSum.test.ts`.
- [x] T007 [P] [US1] Viết unit test `TC-PENSION-01` (nữ 25 năm → 6.500.000/tháng) và `TC-PENSION-02` (nam 17 năm → 4.200.000/tháng) trong `src/__tests__/unit/pensionEstimate.test.ts`.

### Implementation for User Story 1

- [x] T008 [US1] Tạo `LumpSumDisclaimerGate` — modal/blocker bắt buộc acknowledge (cảnh báo không đảo ngược, xác nhận với BHXH/VssID) trước khi render số tiền; ghi `disclaimer_acknowledged` trong session state trong `src/components/disclaimer/LumpSumDisclaimerGate.tsx`.
- [x] T009 [US1] Tạo `ContributionYearsInput`, `AdjustedSalaryInput` (MBQTL thủ công hoặc chọn `inflation_adjustment` từ ruleset) và `LumpSumEligibilityChecklist` (nhánh trước/từ 01/07/2025 theo `first_participation_date`) trong `src/components/inputs/` và `src/components/checklist/`.
- [x] T010 [US1] Tạo `RetirementComparisonView` — hai cột side-by-side (BHXH một lần | Lương hưu/tháng) + breakdown + nhãn “khoảng ước tính”; **không** copy khuyến nghị rút/chờ trong `src/components/comparison/RetirementComparisonView.tsx`.
- [x] T011 [US1] Tích hợp màn `RetirementComparisonScreen`: luồng input → disclaimer gate → gọi `bhxhLumpSum` + `pensionEstimate` → hiển thị so sánh + checklist trong `src/screens/RetirementComparisonScreen.tsx`.

**Checkpoint**: US1 hoạt động độc lập — disclaimer gate, so sánh đúng TC, checklist đúng nhánh tham gia.

---

## Phase 4: Polish & UI Alignment

- [x] T012 [P] Viết test component: chưa `acknowledged` → `RetirementComparisonView` không render số tiền; sau acknowledge → render đủ hai cột — trong `src/__tests__/unit/retirementDisclaimerGate.test.ts`.
- [x] T013 [P] Audit copy SC-003 (không “nên rút”/“nên chờ”); kiểm tra UI theo Flat Design (`RetirementComparisonView`, cảnh báo, tabular nums) trong `docs/product/design-system.md`.
