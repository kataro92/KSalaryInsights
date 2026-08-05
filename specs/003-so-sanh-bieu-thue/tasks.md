# Tasks: 003-so-sanh-bieu-thue

**Input**: Design documents from `specs/003-so-sanh-bieu-thue/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational engine — `grossToNet.ts`, ruleset 2025 & 2026 JSON, `SalaryBreakdownCard`)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1)

---

## Phase 1: Setup

**Purpose**: Định nghĩa contract dữ liệu cho kết quả so sánh.

- [x] T001 [P] Định nghĩa type `ComparisonResult { year1: SalaryBreakdown; year2: SalaryBreakdown; delta: { tax: number; net: number } }` trong `src/domain/types/comparison.ts`.

---

## Phase 2: Foundational (Comparison Engine — Orchestration Only)

**Purpose**: Lớp facade gọi lại engine 001 hai lần, không viết công thức mới.

**⚠️ CRITICAL**: Phase 3 (US1) phụ thuộc phase này.

- [x] T002 Implement `compareRulesets(input: SalaryInput): ComparisonResult` gọi `grossToNet` (đã có từ 001) với ruleset 2025 và ruleset 2026, tính `delta.tax = year2.tax - year1.tax`, `delta.net = year2.net - year1.net` trong `src/engine/compareRulesets.ts`.
- [x] T003 [P] Xử lý edge case thiếu ruleset bundle (2025 hoặc 2026 không load được từ `rulesetLoader`, 001) → `compareRulesets` trả lỗi có kiểm soát thay vì throw không rõ nguyên nhân trong `src/engine/compareRulesets.ts`.

**Checkpoint**: `compareRulesets` sẵn sàng — US1 có thể bắt đầu xây UI.

---

## Phase 3: User Story 1 - Xem tiết kiệm thuế 2026 (Priority: P1) 🎯 MVP

**Goal**: Người dùng nhập gross, xem thuế 2025 vs 2026 và số tiền chênh lệch.

**Independent Test**: Chênh thuế = 992.500 (input TC 30tr / 0 NPT / vùng I).

### Tests for User Story 1

- [x] T004 [P] [US1] Viết unit test `compareRulesets` với input TC 30tr/0NPT/vùng I → thuế 1.627.500 (2025) vs 635.000 (2026), delta 992.500 trong `src/__tests__/unit/compareRulesets.test.ts`.
- [x] T005 [P] [US1] Viết unit test thiếu ruleset bundle → trả lỗi có kiểm soát (không crash) trong `src/__tests__/unit/compareRulesets.test.ts`.

### Implementation for User Story 1

- [x] T006 [US1] Tạo component `ComparisonView` — 2 cột/tab breakdown 2025 vs 2026 (tái sử dụng `SalaryBreakdownCard` từ 001 cho mỗi cột) + dòng delta thuế/net, nhãn năm ≥16sp với đối lập màu nhẹ (SC-002) trong `src/components/comparison/ComparisonView.tsx`.
- [x] T007 [US1] Tạo `ComparisonScreen` nhận `SalaryInput` hiện tại, gọi `compareRulesets`, render `ComparisonView`; hiển thị thông báo "không so sánh được" khi gặp lỗi từ T003 trong `src/screens/ComparisonScreen.tsx`.
- [x] T008 [US1] Thêm điểm điều hướng ("So sánh 2025 vs 2026") từ `CalculatorScreen` sang `ComparisonScreen`, truyền kèm `SalaryInput` hiện tại trong `src/screens/CalculatorScreen.tsx`.

**Checkpoint**: US1 hoạt động độc lập — nhập gross một lần, xem so sánh 2025 vs 2026 đầy đủ.

---

## Phase 4: Polish & UI Alignment

- [x] T009 [P] Kiểm tra hiển thị trung thực khi thuế năm mới cao hơn (edge case hiếm — không ẩn/làm tròn số âm) trong `ComparisonView.tsx`.
- [x] T010 QA đối chiếu heuristic SC-002 (người dùng phân biệt năm nào đang áp dụng trong ≤5 giây) theo Flat Design trong `docs/product/design-system.md`.
