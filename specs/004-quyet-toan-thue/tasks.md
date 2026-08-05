# Tasks: 004-quyet-toan-thue

**Input**: Design documents from `specs/004-quyet-toan-thue/` (`spec.md`, `plan.md`)

**Prerequisites**: `spec.md` (clarified), `plan.md` (approved), **001 hoàn thành** (engine `grossToNet.ts`, `pit.ts`, `insurance.ts`, `rulesetLoader.ts`, types `SalaryInput`/`SalaryBreakdown`)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Đánh dấu thuộc User Story nào (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Khai báo contract dữ liệu quyết toán năm trước khi viết engine.

- [x] T001 [P] Define `AnnualSettlementInput`, `CasualIncomeInput`, `AnnualSettlementBreakdown`, `SettlementScenario`, `SettlementDelta` trong `src/domain/types/settlement.ts` (tax_year, num_dependents, monthly_gross[12] hoặc total, withheld_tax, casual optional).

---

## Phase 2: Foundational (Annual Engine Infrastructure)

**Purpose**: Engine thuần offline tổng hợp năm — US1/US2 phụ thuộc phase này.

**⚠️ CRITICAL**: Phase 3 (US1) không bắt đầu trước khi T002–T004 xong.

- [x] T002 Mở rộng `src/engine/pit.ts` (hoặc helper trong `annualSettlement.ts`) — `calculateAnnualPIT(TNTT, ruleset)`: biểu năm = ngưỡng tháng × 12, làm tròn từng bậc.
- [x] T003 Implement `src/engine/casualExemption.ts` — kiểm tra miễn QT vãng lai NĐ 253 (`tax_year ≥ 2026`, bình quân ≤ 15.000.000, đã khấu trừ 10%) → trả `exempt | mandatory_merge`.
- [x] T004 Implement `src/engine/annualSettlement.ts` — GTGC năm (×12), aggregation TN chịu thuế năm từ lương, chênh lệch hoàn/nộp/khớp; export qua `src/engine/index.ts`.

**Checkpoint**: Engine trả `AnnualSettlementBreakdown` cho input lương-only — sẵn sàng gắn TC-QT-2025-01.

---

## Phase 3: User Story 1 - Ước hoàn/nộp thêm 1 nguồn (Priority: P1) 🎯 MVP

**Goal**: Nhập thu nhập năm + thuế đã khấu trừ + NPT, xem chênh lệch và breakdown năm đầy đủ.

**Independent Test**: `TC-QT-2025-01` pass với sai số ≤ 1 VNĐ.

### Tests for User Story 1

- [x] T005 [P] [US1] Viết unit test `TC-QT-2025-01` (10 tháng × 30tr, đã khấu trừ 16.275.000 → thuế năm 11.475.000, hoàn 4.800.000) trong `src/__tests__/unit/annualSettlement2025.test.ts`.
- [x] T006 [P] [US1] Viết unit test trường hợp nộp thêm (thuế năm > đã khấu trừ) và withheld = 0 kèm cảnh báo trong `src/__tests__/unit/annualSettlement2025.test.ts`.

### Implementation for User Story 1

- [x] T007 [US1] Tạo `AnnualBreakdownCard` — TN chịu thuế năm → GTGC năm → TNTT năm → thuế từng bậc → đã khấu trừ → chênh (Flat Design, tabular nums) trong `src/components/breakdown/AnnualBreakdownCard.tsx`.
- [x] T008 [US1] Tạo `SettlementResultCard` + `SettlementDisclaimer` (disclaimer mạnh, màu secondary cho hoàn) trong `src/components/settlement/SettlementResultCard.tsx` và `src/components/disclaimer/SettlementDisclaimer.tsx`.
- [x] T009 [US1] Tích hợp `SettlementScreen` — chọn tax_year, NPT, nhập thu nhập (tổng/trung bình hoặc `MonthlyIncomeGrid`), thuế đã khấu trừ, gọi engine → hiển thị kết quả trong `src/screens/SettlementScreen.tsx`.

**Checkpoint**: US1 hoạt động độc lập — quyết toán 1 nguồn lương, không vãng lai.

---

## Phase 4: User Story 2 - Thêm nguồn vãng lai (Priority: P2)

**Goal**: Nhập vãng lai; engine phân biệt bắt buộc gộp vs miễn; hiển thị dual scenario khi miễn.

**Independent Test**: `TC-QT-2026-01` và `TC-QT-2026-02` pass với sai số ≤ 1 VNĐ.

### Tests for User Story 2

- [x] T010 [P] [US2] Viết unit test `TC-QT-2026-01` (lương + vãng lai bắt buộc gộp → nộp thêm 1.620.000) trong `src/__tests__/unit/annualSettlement2026.test.ts`.
- [x] T011 [P] [US2] Viết unit test `TC-QT-2026-02` (miễn + dual scenario: chênh 0 vs hoàn 3.000.000) và `casualExemption` ngưỡng 15tr trong `src/__tests__/unit/annualSettlement2026.test.ts` + `src/__tests__/unit/casualExemption.test.ts`.

### Implementation for User Story 2

- [x] T012 [US2] Mở rộng `annualSettlement.ts` — gộp vãng lai, tính `SettlementScenario[]` (mandatory / exempt_no_merge / voluntary_merge) khi FR-007 áp dụng.
- [x] T013 [US2] Tạo `CasualIncomeInput` + `DualScenarioCard` (so sánh không gộp vs gộp tự nguyện, nêu rõ gộp có lợi) và tích hợp vào `SettlementScreen` trong `src/components/inputs/CasualIncomeInput.tsx`, `src/components/settlement/DualScenarioCard.tsx`, `src/screens/SettlementScreen.tsx`.

**Checkpoint**: US1 + US2 cùng hoạt động — đủ 3 TC quyết toán pass.

---

## Phase 5: User Story 3 - Wizard ủy quyền vs tự quyết toán (Priority: P3)

**Goal**: FR-008 — quiz điều kiện → kết luận ủy quyền/tự QT + checklist chứng từ + hạn nộp; không thu thập giấy tờ.

**Independent Test**: Fixture câu trả lời deterministic → kết luận và checklist khớp spec.

### Tests for User Story 3

- [x] T014 [P] [US3] Viết unit test logic wizard (điều kiện ủy quyền, hạn tổ chức 31/03, cá nhân ~đầu tháng 5) trong `src/__tests__/unit/filingWizard.test.ts`.

### Implementation for User Story 3

- [x] T015 [US3] Implement `FilingWizard` + `FilingWizardScreen` — câu hỏi tuần tự, kết luận, checklist, hạn; Ngài Miu pose ④ trong `src/components/wizard/FilingWizard.tsx`, `src/screens/FilingWizardScreen.tsx`.

**Checkpoint**: Wizard tách biệt khỏi engine số — có thể mở từ SettlementScreen.

---

## Phase 6: Polish & Verification

- [x] T016 [P] Viết property test SC-002 — lương đều 12 tháng: `|thuế_năm − 12 × thuế_tháng| ≤ 12` VNĐ trong `src/__tests__/unit/annualProperty.test.ts`.
- [x] T017 Kiểm tra toàn bộ màn quyết toán + wizard theo Flat Design và usage Ngài Miu (`docs/product/design-system.md` — không che dòng số kết quả).
- [x] T018 [P] Xác minh SC-003 offline — không network call trong luồng `SettlementScreen`/`FilingWizardScreen` (grep hoặc test tĩnh).
