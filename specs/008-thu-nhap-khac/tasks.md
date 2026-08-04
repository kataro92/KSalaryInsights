# Tasks: 008-thu-nhap-khac

**Input**: Design documents from `specs/008-thu-nhap-khac/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành Phase 1–2** (Setup + Foundational engine — `rulesetLoader.ts`, ruleset JSON bundle, types `Ruleset`)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1–US5)

---

## Phase 1: Setup

**Purpose**: Xác nhận ranh giới module thu nhập khác — tách khỏi lương HĐLĐ.

- [ ] T001 [P] Xác nhận `grossToNet.ts` / `SalaryInput` **không** import hoặc cộng thu nhập khác; ghi chú contract trong `src/engine/otherIncome/index.ts` (FR-001).
- [ ] T002 [P] Tạo `src/domain/types/otherIncome.ts` — enum `IncomeType`, input/breakdown types cho 5 calculator (`Rent`, `Hkd`, `Securities`, `Esop`, `CasualWithholding`).

---

## Phase 2: Foundational (Ruleset Extensions)

**Purpose**: Đưa rate/ngưỡng vào ruleset trước khi viết engine — SC-002 cấm hard-code UI.

**⚠️ CRITICAL**: Phase 3–7 phụ thuộc phase này.

- [ ] T003 Mở rộng `ruleset-schema.json` — block `other_income` (rent, hkd + `industry_rates`, securities, esop) và bắt buộc `casual_income` cho ruleset 004/008 theo `docs/product/ruleset-spec.md` §4.
- [ ] T004 [P] Bổ sung `other_income` + `casual_income` vào `src/engine/rulesets/2025.json` (ngưỡng vãng lai 2.000.000; ngưỡng cho thuê/HKD 1 tỷ theo domain).
- [ ] T005 [P] Bổ sung `other_income` + `casual_income` (ngưỡng 5.000.000 **cả kỳ 2026**, NĐ 253 Đ.69.1.a) vào `2026-h1.json` và `2026-h2.json`.
- [ ] T006 Cập nhật type `Ruleset` trong `src/domain/types/` và contract test `src/__tests__/contract/rulesetSchema.test.ts` — validate biểu ngành HKD đủ 5 nhóm.

**Checkpoint**: Ruleset load được `other_income`/`casual_income`; contract test pass — US1 có thể bắt đầu.

---

## Phase 3: User Story 1 - Cho thuê nhà (Priority: P1) 🎯 MVP

**Goal**: Nhập doanh thu thuê năm (hoặc tháng × 12), xem GTGT + TNCN theo ngưỡng 1 tỷ; miễn thuế vẫn nhắc thông báo 01/BĐS.

**Independent Test**: `TC-RENT-01`, `TC-RENT-02`, `TC-RENT-03` pass.

### Tests for User Story 1

- [ ] T007 [P] [US1] Viết unit test `TC-RENT-01` (240tr/năm → thuế 0 + flag `reporting_required`) trong `src/__tests__/unit/otherIncome/rent.test.ts`.
- [ ] T008 [P] [US1] Viết unit test `TC-RENT-02` (1,5 tỷ → GTGT 75tr + TNCN 25tr) và `TC-RENT-03` (đúng 1 tỷ → 0) trong cùng file.

### Implementation for User Story 1

- [ ] T009 [US1] Implement `calculateRent(input, ruleset)` trong `src/engine/otherIncome/rent.ts` — GTGT 5% toàn bộ, TNCN 5% phần vượt ngưỡng từ `ruleset.other_income.rent`.
- [ ] T010 [US1] Tạo `RentCalculator.tsx` + tích hợp vào `OtherIncomeScreen` — input tháng/năm, `OtherIncomeBreakdownCard` tách GTGT/TNCN, nhắc mẫu 01/BĐS khi miễn.

**Checkpoint**: US1 hoạt động độc lập — không cần HKD/CK/ESOP/vãng lai.

---

## Phase 4: User Story 2 - Chứng khoán (Priority: P2)

**Goal**: Nhập giá chuyển nhượng, áp 0,1% từ 01/07/2026 theo `as_of_date`.

**Independent Test**: `TC-SEC-01` pass.

### Tests for User Story 2

- [ ] T011 [P] [US2] Viết unit test `TC-SEC-01` (bán 100tr sau 01/07/2026 → thuế 100.000) trong `src/__tests__/unit/otherIncome/securities.test.ts`.

### Implementation for User Story 2

- [ ] T012 [US2] Implement `calculateSecuritiesTransfer` trong `src/engine/otherIncome/securities.ts` — đọc `transfer_rate` + `effective_from` từ ruleset; từ chối/thông báo nếu `as_of_date` trước hiệu lực.
- [ ] T013 [US2] Tạo `SecuritiesCalculator.tsx` — input giá bán + `as_of_date`, hiển thị breakdown một dòng thuế CN.

**Checkpoint**: US1 + US2 hoạt động độc lập.

---

## Phase 5: User Story 3 - Hộ kinh doanh (Priority: P2)

**Goal**: Chọn nhóm ngành, nhập doanh thu năm; TNCN trên phần vượt 1 tỷ; gợi ý so sánh (DT−CP)×15%.

**Independent Test**: `TC-HKD-01`, `TC-HKD-02` pass.

### Tests for User Story 3

- [ ] T014 [P] [US3] Viết unit test `TC-HKD-01` (800tr → 0 + `reporting_required`) và `TC-HKD-02` (tạp hóa 1,5 tỷ → GTGT 15tr + TNCN 2,5tr) trong `src/__tests__/unit/otherIncome/hkd.test.ts`.

### Implementation for User Story 3

- [ ] T015 [US3] Implement `calculateHkd` trong `src/engine/otherIncome/hkd.ts` — lookup `industry_rates`, GTGT trên toàn bộ DT, TNCN trên `(revenue − threshold)`; optional hint `(revenue − cost) × income_method_rate`.
- [ ] T016 [US3] Tạo `HkdCalculator.tsx` — picker nhóm ngành (5 nhóm ruleset), breakdown tách GTGT/TNCN, gợi ý phương pháp thu nhập khi > ngưỡng.

**Checkpoint**: US1–US3 hoạt động độc lập.

---

## Phase 6: User Story 5 - Thu nhập vãng lai: khấu trừ tại nguồn (Priority: P2)

**Goal**: Nhập số tiền chi trả một lần; áp ngưỡng 5tr (2026 cả năm) hoặc 2tr (≤2025); hiển thị khấu trừ 10% và thực nhận.

**Independent Test**: `TC-CASUAL-01`, `TC-CASUAL-02` (+ biến thể 2025 ngưỡng 2tr) pass. `TC-CASUAL-03` thuộc spec 004.

### Tests for User Story 5

- [ ] T017 [P] [US5] Viết unit test `TC-CASUAL-01` (10tr → khấu trừ 1tr), `TC-CASUAL-02` (4tr tháng 08/2026 → 0), và ngưỡng 2tr năm 2025 (4tr → 400k) trong `src/__tests__/unit/otherIncome/casualWithholding.test.ts`.

### Implementation for User Story 5

- [ ] T018 [US5] Implement `calculateCasualWithholding` trong `src/engine/otherIncome/casualWithholding.ts` — đọc `ruleset.casual_income`; chọn ngưỡng theo `tax_year`/`as_of_date` (5tr cả năm 2026, không tách H1/H2).
- [ ] T019 [US5] Tạo `CasualWithholdingCalculator.tsx` — ghi chú tổng hợp khi quyết toán; link/tham chiếu logic miễn QT (004) không duplicate `TC-CASUAL-03`.

**Checkpoint**: US1–US3 + US5 hoạt động độc lập.

---

## Phase 7: User Story 4 - ESOP (Priority: P3)

**Goal**: Hai dòng thuế — TLTC khấu trừ 10% trên chi phí ghi sổ + 0,1% chuyển nhượng; fallback mệnh giá.

**Independent Test**: `TC-ESOP-01` pass.

### Tests for User Story 4

- [ ] T020 [P] [US4] Viết unit test `TC-ESOP-01` (ghi sổ 100tr, bán 300tr → TLTC 10tr + CN 300k) và fallback mệnh giá (âm → 0) trong `src/__tests__/unit/otherIncome/esop.test.ts`.

### Implementation for User Story 4

- [ ] T021 [US4] Implement `calculateEsop` trong `src/engine/otherIncome/esop.ts` — `book_cost_at_grant` hoặc `shares × par_value − amount_paid`; `withholding` + `transfer_tax` tách dòng.
- [ ] T022 [US4] Tạo `EsopCalculator.tsx` — toggle chi phí ghi sổ vs fallback; ghi chú quyết toán lũy tiến cuối năm trên phần TLTC.

**Checkpoint**: Toàn bộ 5 calculator hoạt động; export facade `src/engine/otherIncome/index.ts`.

---

## Phase 8: Polish & UI Alignment

- [ ] T023 [P] Hoàn thiện `OtherIncomeScreen` — hub điều hướng 5 tab/card; disclaimer `OtherIncomeDisclaimer.tsx`; điểm vào từ navigation chính (không nhúng vào `CalculatorScreen` lương).
- [ ] T024 [P] Kiểm tra breakdown + disclaimer theo Flat Design / `docs/product/design-system.md`; xác nhận SC-002 — grep không có rate/ngưỡng hard-code trong `components/otherIncome/`.
