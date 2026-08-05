# Tasks: 006-thai-san-om-dau

**Input**: Design documents from `specs/006-thai-san-om-dau/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational — `rulesetLoader.ts`, ruleset JSON với `reference_salary` theo `as_of_date`)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1, US2)

---

## Phase 1: Setup

**Purpose**: Xác nhận ruleset và loader sẵn sàng cho `reference_salary` theo tháng sinh.

- [x] T001 [P] Xác nhận ruleset bundle có `reference_salary` 2.340.000 (2026-H1 / trước 01/07/2026) và 2.530.000 (2026-H2 / từ 01/07/2026); `rulesetLoader` map đúng `as_of_date` tháng sinh → ruleset tương ứng.

---

## Phase 2: Foundational (Types & Leave-Month Resolver)

**Purpose**: Định nghĩa contract dữ liệu và logic số tháng nghỉ trước khi UI / full calculator.

**⚠️ CRITICAL**: Phase 3 (US1) phụ thuộc phase này.

- [x] T002 Thêm `MaternityInput`, `MaternityBreakdown`, `SickLeaveInput`, `SickLeaveBreakdown` trong `src/domain/types/benefits.ts` (VND integer, `leave_months`, `one_time_allowance`, `monthly_benefit_total`, `eligibility_warning?`).
- [x] T003 Implement `resolveMaternityLeaveMonths()` trong `src/engine/maternity.ts`: con đầu 6; con thứ hai từ 01/07/2026 → 7; sinh đôi +1 tháng/con từ con thứ 2; unit test nội bộ hoặc test riêng cho matrix 6/7/twin.
- [x] T004 Bổ sung tham số ruleset (nếu chưa có): `maternity_rate`, `sick_leave_rate`, `sick_leave_divisor`, `second_child_extended_from`, trần ngày ốm theo năm đóng — trong JSON ruleset + schema; không hard-code trong component.

**Checkpoint**: Có thể gọi `resolveMaternityLeaveMonths` và đọc `reference_salary` theo tháng sinh — US1 có thể bắt đầu.

---

## Phase 3: User Story 1 - Ước thai sản (Priority: P1) 🎯 MVP

**Goal**: Nhập bình quân 6 tháng + ngày sinh / thứ tự con / sinh đôi → tổng quyền lợi với breakdown tách tiền chế độ và trợ cấp 1 lần.

**Independent Test**: TC-MAT-01 pass với sai số 0 đồng.

### Tests for User Story 1

- [x] T005 [P] [US1] Viết unit test **TC-MAT-01** (avg 18tr, con đầu 08/2026 → 113.060.000) trong `src/__tests__/unit/maternity.test.ts`.
- [x] T006 [P] [US1] Viết unit test **TC-MAT-02** (con thứ hai sau 01/07/2026 → 131.060.000) và **TC-MAT-03** (sinh đôi lần đầu 08/2026 → 136.120.000, breakdown “+1 tháng do sinh đôi”) trong `src/__tests__/unit/maternity.test.ts`.
- [x] T007 [P] [US1] Viết unit test sinh trước 01/07/2026 → trợ cấp 1 lần 4.680.000/con; tick bỏ “6/12 tháng đóng” → `eligibility_warning` trong `src/__tests__/unit/maternity.test.ts`.

### Implementation for User Story 1

- [x] T008 [US1] Hoàn thiện `calculateMaternity()` trong `src/engine/maternity.ts`: `100% × avg × leave_months + 2 × reference_salary × num_children`; export qua `src/engine/index.ts`.
- [x] T009 [US1] Tạo `MaternityInputs` (bình quân, ngày sinh, con đầu/thứ hai, số con sinh đôi, tick 6/12) trong `src/components/inputs/MaternityInputs.tsx`.
- [x] T010 [US1] Tạo `MaternityBreakdownCard` hiển thị tiền chế độ / trợ cấp 1 lần / tổng + disclaimer trong `src/components/breakdown/MaternityBreakdownCard.tsx`; tích hợp tab Thai sản vào `src/screens/BenefitsScreen.tsx`.

**Checkpoint**: US1 hoạt động độc lập — TC-MAT-01/02/03 pass.

---

## Phase 4: User Story 2 - Ốm đau (Priority: P2)

**Goal**: Nhập lương tháng liền kề và số ngày nghỉ → ước tiền 75%/24; vượt trần thì cắt và thông báo.

**Independent Test**: TC-SICK-01 pass với sai số 0 đồng.

### Tests for User Story 2

- [x] T011 [P] [US2] Viết unit test **TC-SICK-01** (lương 12tr, 5 ngày → 1.875.000, công thức 75%/24) trong `src/__tests__/unit/sickLeave.test.ts`.
- [x] T012 [P] [US2] Viết unit test ngày nghỉ vượt trần ruleset → `days_paid` bị cắt + thông báo trong `src/__tests__/unit/sickLeave.test.ts`.

### Implementation for User Story 2

- [x] T013 [US2] Implement `calculateSickLeave()` trong `src/engine/sickLeave.ts` (75% × lương / 24 × ngày, clamp trần); export qua `src/engine/index.ts`.
- [x] T014 [US2] Tạo `SickLeaveInputs` + `SickLeaveBreakdownCard`; tích hợp tab Ốm đau vào `src/screens/BenefitsScreen.tsx`.

**Checkpoint**: US1 và US2 cùng hoạt động độc lập — TC-SICK-01 pass.

---

## Phase 5: Polish & UI Alignment

- [x] T015 [P] Thêm ghi chú out-of-scope V2 (chồng nghỉ khi vợ sinh, nhận nuôi, mang thai hộ) và disclaimer “ước tính, không phải quyết định BHXH” trên `BenefitsScreen` / `OutOfScopeNote`.
- [x] T016 [P] Kiểm tra input + breakdown theo Flat Design trong `docs/product/design-system.md` (disclaimer, legal sources, mascot tooltip nếu áp dụng).
