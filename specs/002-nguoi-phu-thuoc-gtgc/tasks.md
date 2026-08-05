# Tasks: 002-nguoi-phu-thuoc-gtgc

**Input**: Design documents from `specs/002-nguoi-phu-thuoc-gtgc/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational engine — `grossToNet.ts`, `SalaryInput`/`SalaryBreakdown` types)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1, US2)

---

## Phase 1: Setup

**Purpose**: Xác nhận contract đầu vào đã có từ 001, chuẩn bị field mới cho breakdown.

- [x] T001 [P] Xác nhận `SalaryInput.num_dependents` đã tồn tại trong `src/domain/types/salary.ts` (kế thừa từ 001); nếu type hiện tại chưa ràng buộc phạm vi, ghi chú `0 ≤ num_dependents ≤ 20` trong docstring.

---

## Phase 2: Foundational (Breakdown Data Contract)

**Purpose**: Tách GTGC thành field riêng trong output engine trước khi UI có thể hiển thị dòng riêng.

**⚠️ CRITICAL**: Phase 3 (US1) phụ thuộc phase này.

- [x] T002 Thêm `relief_breakdown: { personal: number; dependent: number; total: number }` vào `SalaryBreakdown` trong `src/domain/types/salary.ts`.
- [x] T003 Cập nhật `src/engine/grossToNet.ts` để trả `relief_breakdown` theo T002 — **không đổi** công thức GTGC đã có từ 001, chỉ tách giá trị trung gian ra output thay vì gộp ẩn trong bước tính TNTT.

**Checkpoint**: `SalaryBreakdown` có đủ dữ liệu để UI hiển thị dòng GTGC riêng — US1 có thể bắt đầu.

---

## Phase 3: User Story 1 - Thêm người phụ thuộc (Priority: P1) 🎯 MVP

**Goal**: Người dùng nhập số NPT (0–20) và thấy GTGC + thuế cập nhật đúng, hiển thị thành dòng riêng trong breakdown.

**Independent Test**: `TC-TNCN-2026-02` pass với sai số 0 đồng.

### Tests for User Story 1

- [x] T004 [P] [US1] Viết unit test `TC-TNCN-2026-02` (Gross 30tr, ruleset 2026, NPT=2 → GTGC 27.900.000, thuế 0, net 26.850.000) trong `src/__tests__/unit/dependents.test.ts`.
- [x] T005 [P] [US1] Viết unit test NPT=0 → GTGC chỉ gồm `personal_relief` theo ruleset trong `src/__tests__/unit/dependents.test.ts`.
- [x] T006 [P] [US1] Viết unit test validate: NPT âm bị reject; NPT > 20 bị chặn kèm thông báo giới hạn app trong `src/__tests__/unit/dependentsValidation.test.ts`.

### Implementation for User Story 1

- [x] T007 [US1] Tạo component `DependentCountInput` — stepper nhập số nguyên NPT (0–20) kèm tooltip "điều kiện NPT theo luật, mỗi NPT chỉ giảm trừ một lần" trong `src/components/inputs/DependentCountInput.tsx`.
- [x] T008 [US1] Tích hợp `DependentCountInput` vào `CalculatorScreen`, truyền `num_dependents` vào `SalaryInput` trong `src/screens/CalculatorScreen.tsx`.
- [x] T009 [US1] Thêm dòng "Giảm trừ gia cảnh (GTGC)" riêng biệt (dùng `relief_breakdown` từ Phase 2) vào `SalaryBreakdownCard` trong `src/components/breakdown/SalaryBreakdownCard.tsx`.

**Checkpoint**: US1 hoạt động độc lập — nhập NPT, xem GTGC + thuế đúng.

---

## Phase 4: User Story 2 - Đổi năm luật đổi mức GTGC (Priority: P2)

**Goal**: Khi đổi ruleset 2025 ↔ 2026 trong cùng session, GTGC hiển thị cập nhật đúng, không giữ giá trị cache cũ.

**Independent Test**: NPT=1, đổi 2025→2026 → GTGC bản thân 11tr→15,5tr và GTGC/NPT 4,4tr→6,2tr phản ánh đúng trong breakdown.

### Tests for User Story 2

- [x] T010 [P] [US2] Viết test đổi ruleset 2025→2026 với NPT=1, kiểm `relief_breakdown` cập nhật đúng (không cache giá trị cũ) trong `src/__tests__/integration/dependentsRulesetSwitch.test.ts`.

### Implementation for User Story 2

- [x] T011 [US2] Đảm bảo `CalculatorScreen` re-tính toàn bộ `SalaryBreakdown` (bao gồm `relief_breakdown`) mỗi khi `tax_year`/`as_of_date` đổi — kiểm tra state không giữ breakdown của ruleset trước trong `src/screens/CalculatorScreen.tsx`.

**Checkpoint**: US1 và US2 cùng hoạt động độc lập.

---

## Phase 5: Polish & UI Alignment

- [x] T012 [P] Kiểm tra `DependentCountInput` + dòng GTGC theo Flat Design trong `docs/product/design-system.md` (kể cả tooltip "Ngài Miu" nếu áp dụng theo hệ thống mascot).
