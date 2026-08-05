# Tasks: 001-tinh-luong-gross-net

**Input**: Design documents from `specs/001-tinh-luong-gross-net/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Khởi tạo cấu trúc engine và các kiểu dữ liệu dùng chung.

- [x] T001 Khởi tạo cấu trúc các thư mục `src/domain/`, `src/engine/`, `src/components/`, `src/screens/` theo `plan.md`.
- [x] T002 Define TypeScript contracts cho `SalaryInput`, `SalaryBreakdown`, `InsuranceBreakdown`, `PITBreakdown`, `Ruleset` trong `src/domain/types/salary.ts`.
- [x] T003 [P] Tạo các file JSON ruleset `src/engine/rulesets/2025.json`, `2026-h1.json`, `2026-h2.json` tuân theo `docs/product/ruleset-schema.json`.

---

## Phase 2: Foundational (Calculation Engine Infrastructure)

**Purpose**: Core calculation engine độc lập (chưa cần UI).

- [x] T004 Implement `rulesetLoader.ts` trong `src/engine/rulesetLoader.ts` chọn ruleset theo `tax_year` và `as_of_date`.
- [x] T005 [P] Implement `insurance.ts` tính đóng BHXH (8%), BHYT (1,5%), BHTN (1%) áp trần lương cơ sở và trần BHTN vùng trong `src/engine/insurance.ts`.
- [x] T006 [P] Implement `pit.ts` tính thuế TNCN lũy tiến theo biểu 7 bậc (2025) và 5 bậc (2026) trong `src/engine/pit.ts`.

---

## Phase 3: User Story 1 - Gross sang Net có breakdown (Priority: P1) 🎯 MVP

**Goal**: Cho phép người dùng nhập Gross, chọn năm và vùng, nhận kết quả Net và breakdown từng khoản chi tiết.

**Independent Test**: Unit test `TC-TNCN-2025-01` và `TC-TNCN-2026-01` pass với sai số 0 đồng.

### Tests for User Story 1
- [x] T007 [P] [US1] Viết unit test cho Gross → Net 2025 (`TC-TNCN-2025-01`) trong `src/__tests__/unit/grossToNet2025.test.ts`.
- [x] T008 [P] [US1] Viết unit test cho Gross → Net 2026 (`TC-TNCN-2026-01`) trong `src/__tests__/unit/grossToNet2026.test.ts`.

### Implementation for User Story 1
- [x] T009 [US1] Implement `grossToNet.ts` lắp ráp tính toán bảo hiểm + TNTT + thuế TNCN → trả về `SalaryBreakdown` trong `src/engine/grossToNet.ts`.
- [x] T010 [P] [US1] Tạo component `SalaryBreakdownCard` hiển thị bảng chi tiết Gross, BHXH, BHYT, BHTN, TNTT, Thuế từng bậc, Net trong `src/components/breakdown/SalaryBreakdownCard.tsx`.
- [x] T011 [P] [US1] Tạo component `DisclaimerFooter` hiển thị nguồn pháp lý và disclaimer ước tính trong `src/components/disclaimer/DisclaimerFooter.tsx`.
- [x] T012 [US1] Tích hợp màn hình `CalculatorScreen` cho phép nhập Gross, chọn vùng (I–IV), năm thuế, công tắc chỉnh mức đóng BH riêng trong `src/screens/CalculatorScreen.tsx`.

---

## Phase 4: User Story 2 - Net sang Gross (Priority: P2)

**Goal**: Cho phép người dùng nhập Net mong muốn, tìm ra số tiền Gross tương ứng.

**Independent Test**: Roundtrip test: Net nhập → Gross đề xuất → GrossToNet → Net khớp sai số ≤ 1 đồng.

### Tests for User Story 2
- [x] T013 [P] [US2] Viết unit test cho Net → Gross và test khép kín Net → Gross → Net trong `src/__tests__/unit/netToGross.test.ts`.

### Implementation for User Story 2
- [x] T014 [US2] Implement `netToGross.ts` bằng thuật toán Binary Search trên `grossToNet` trong `src/engine/netToGross.ts`.
- [x] T015 [US2] Thêm nút chuyển đổi chế độ "Gross → Net" / "Net → Gross" và xử lý validate không khả thi (Net < Net tối thiểu vùng) trong `src/screens/CalculatorScreen.tsx`.

---

## Phase 5: User Story 3 - Trần bảo hiểm & Đổi lương cơ sở giữa năm (Priority: P3)

**Goal**: Xử lý các edge case lương cao đóng bảo hiểm đụng trần và sự thay đổi trần giữa năm 2026 (01/07/2026 NĐ 161/2026).

**Independent Test**: `TC-BH-2026-02` (tháng 3/2026) và `TC-BH-2026H2-01` (tháng 8/2026) pass 100%.

### Tests for User Story 3
- [x] T016 [P] [US3] Viết unit test kiểm thử trần bảo hiểm H1 (46,8tr) vs H2 (50,6tr) trong `src/__tests__/unit/insuranceCaps.test.ts`.

### Implementation for User Story 3
- [x] T017 [US3] Bổ sung selector chọn "Tháng tính lương" trong `CalculatorScreen` để tự động chọn đúng ruleset H1/H2 năm 2026.

---

## Phase 6: Polish & UI Alignment (Flat Design + Ngài Miu)

- [x] T018 [P] Thiết kế component linh vật `Ngài Miu` hiển thị lời khuyên / giải thích cơ cấu trừ lương trong `src/components/mascot/NgaiMiuTip.tsx`.
- [x] T019 Kiểm tra giao diện theo thiết kế Flat Design trong `docs/product/design-system.md`.
