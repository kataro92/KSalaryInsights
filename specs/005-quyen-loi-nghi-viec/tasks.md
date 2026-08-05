# Tasks: 005-quyen-loi-nghi-viec

**Input**: Design documents from `specs/005-quyen-loi-nghi-viec/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational — `rulesetLoader.ts`, `regional_minimum_wages` trong ruleset JSON, Flat Design components cơ bản)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1, US2)

---

## Phase 1: Setup

**Purpose**: Xác nhận hạ tầng ruleset/LTTV từ 001 sẵn sàng cho calculator quyền lợi.

- [x] T001 [P] Xác nhận `rulesetLoader.getRuleset(taxYear, asOfDate)` và `regional_minimum_wages` hoạt động với date cụ thể (ví dụ `"2026-03-15"` → `2026-h1`, `"2026-08-15"` → `2026-h2`) trong `src/engine/rulesetLoader.ts` — ghi chú contract cho FR-006.

---

## Phase 2: Foundational (Types + Ruleset Fields)

**Purpose**: Định nghĩa data contract và tham số pháp lý trước khi viết công thức.

**⚠️ CRITICAL**: Phase 3–4 phụ thuộc phase này.

- [x] T002 [P] Thêm types `SeveranceInput`, `SeveranceBreakdown`, `JobLossBreakdown`, `UnemploymentInput`, `UnemploymentBreakdown`, `EligibilityChecklistItem` trong `src/domain/types/benefits.ts`.
- [x] T003 [P] Bổ sung block `severance_pay` và `unemployment_benefit` vào `2025.json`, `2026-h1.json`, `2026-h2.json` và cập nhật `docs/product/ruleset-schema.json` theo plan.md (hệ số 0,5 / 1,0 / sàn 2; BHTN 60% / 5×LTTV / 3–12 tháng / 10 ngày LV).
- [x] T004 Cập nhật type `Ruleset` trong `src/domain/types/ruleset.ts` (hoặc file type ruleset hiện có) để bao gồm `severance_pay` và `unemployment_benefit`; export qua `src/engine/index.ts`.

**Checkpoint**: Ruleset load được tham số mới; types sẵn sàng cho engine.

---

## Phase 3: User Story 1 — Trợ cấp thôi việc / mất việc (Priority: P1) 🎯 MVP

**Goal**: Người dùng nhập thời gian làm việc, thời gian BHTN, lương căn cứ; chọn thôi việc hoặc mất việc; xem ước trợ cấp kèm công thức và giải thích.

**Independent Test**: TC-SEVERANCE-01, TC-SEVERANCE-02, TC-JOBLOSS-01 pass với sai số 0 đồng.

### Tests for User Story 1

- [x] T005 [P] [US1] Viết unit test `TC-SEVERANCE-01` và `TC-SEVERANCE-02` trong `src/__tests__/unit/severance.test.ts`.
- [x] T006 [P] [US1] Viết unit test `TC-JOBLOSS-01` và case BHTN đầy đủ → kết quả 0 + explanation trong `src/__tests__/unit/severance.test.ts`.

### Implementation for User Story 1

- [x] T007 [US1] Triển khai `calcSeverancePay()`, `calcJobLossPay()`, `roundServiceYears()` đọc tham số từ `Ruleset.severance_pay` trong `src/engine/severance.ts`.
- [x] T008 [US1] Tạo `SeveranceModeToggle`, `ServiceTimeInput`, `BenefitBreakdownCard` và màn `SeveranceCalculatorScreen` (tách rõ thôi việc vs mất việc) trong `src/screens/SeveranceCalculatorScreen.tsx` + components tương ứng.

**Checkpoint**: US1 hoạt động độc lập — tính thôi việc/mất việc đúng TC, giải thích khi kết quả 0.

---

## Phase 4: User Story 2 — Trợ cấp thất nghiệp BHTN (Priority: P2)

**Goal**: Người dùng nhập tháng đóng BHTN, bình quân 6 tháng, vùng, ngày tháng cuối đóng; xem mức/tháng, số tháng hưởng, tổng ước tính và checklist điều kiện.

**Independent Test**: TC-UE-01, TC-UE-02, TC-UE-03 pass; trần LTTV theo `last_contribution_date`.

### Tests for User Story 2

- [x] T009 [P] [US2] Viết unit test `TC-UE-01`, `TC-UE-02`, `TC-UE-03` trong `src/__tests__/unit/unemploymentBenefit.test.ts`.
- [x] T010 [P] [US2] Viết test LTTV trần theo `as_of_date` tháng cuối đóng (H1 vs H2 cùng vùng) trong `src/__tests__/unit/unemploymentBenefit.test.ts`.

### Implementation for User Story 2

- [x] T011 [US2] Triển khai `calcUnemploymentBenefit()` — 60%, trần 5×LTTV qua `getRuleset(..., last_contribution_date)`, số tháng hưởng 3 + floor((paid−36)/12), max 12 — trong `src/engine/unemploymentBenefit.ts`.
- [x] T012 [US2] Tạo `EligibilityChecklist` (12/24 hoặc 12/36; nộp 3 tháng; **10 ngày làm việc**; ngày LV thứ 11) và màn `UnemploymentCalculatorScreen` trong `src/screens/UnemploymentCalculatorScreen.tsx`.

**Checkpoint**: US1 và US2 cùng hoạt động độc lập; hai calculator không gộp logic.

---

## Phase 5: Polish & UI Alignment

- [x] T013 [P] Gắn `DisclaimerFooter` lên cả hai màn hình calculator; export API quyền lợi qua `src/engine/index.ts`.
- [x] T014 [P] Kiểm tra UI theo Flat Design (`BenefitBreakdownCard`, checklist, số tiền tabular nums, màu `secondary` cho quyền lợi) trong `docs/product/design-system.md`.
