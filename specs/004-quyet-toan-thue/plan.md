# Implementation Plan: 004-quyet-toan-thue

**Branch**: `004-quyet-toan-thue` | **Date**: 2026-08-05 | **Spec**: [specs/004-quyet-toan-thue/spec.md](./spec.md)

**Input**: Feature specification from `specs/004-quyet-toan-thue/spec.md`

## Summary

Tính năng **ước tính quyết toán thuế TNCN cuối năm**: người dùng chọn `tax_year` (ruleset năm Y — không theo ngày mở app), nhập thu nhập lương năm (tổng hoặc 12 tháng), số NPT, thuế đã khấu trừ lũy kế, và tùy chọn thu nhập vãng lai (số nhận + thuế 10% đã trừ). Engine tổng hợp **TN chịu thuế năm → GTGC năm → TNTT năm → thuế theo biểu năm → chênh lệch** (ước hoàn / nộp thêm / khớp), kèm breakdown đầy đủ (FR-009) và disclaimer mạnh. Với `tax_year ≥ 2026`, áp quy tắc miễn quyết toán vãng lai NĐ 253/2026 (bình quân ≤ 15tr/tháng + đã khấu trừ 10%) và trình bày **cả hai phương án** khi được miễn nhưng gộp tự nguyện có lợi (TC-QT-2026-02). Bổ sung wizard ủy quyền vs tự quyết toán (FR-008): quiz điều kiện + checklist chứng từ + hạn nộp — thuần logic, không thu thập giấy tờ, không nộp tờ khai thay người dùng (FR-006).

**Quan hệ với 001**: Engine tháng `grossToNet.ts` (001) cung cấp công thức BH + GTGC + thuế tháng. Feature 004 **tổng hợp năm** trên cùng `Ruleset` đã versioned — biểu năm = ngưỡng tháng × 12, GTGC năm = `personal_relief × 12 + NPT × dependent_relief × 12` (đủ 12 tháng kể cả năm làm không trọn). Không import XML tờ khai; MVP nhập tay.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Tuân ADR 0004: engine thuần TypeScript offline, làm tròn `Math.round()` từng bước, zero API.

**Bổ sung riêng cho 004**:
- **Phụ thuộc 001**: `grossToNet.ts`, `pit.ts`, `insurance.ts`, `rulesetLoader.ts` — dùng để suy ra TN chịu thuế/thuế tháng khi nhập theo tháng hoặc property test 12 tháng.
- **Module mới**: `annualSettlement.ts` — aggregation năm, biểu lũy tiến năm, logic vãng lai NĐ 253, so sánh phương án gộp/không gộp.
- **UI**: màn hình quyết toán (form nhập + kết quả), `AnnualBreakdownCard`, wizard FR-008; Flat Design + Ngài Miu pose ④ (mùa quyết toán) theo `docs/product/design-system.md`.
- **Precision**: TC pass ≤ 1 VNĐ; property test lương đều 12 tháng: `|thuế_năm − 12 × thuế_tháng| ≤ 12` VNĐ.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Kết quả + wizard kèm `legal_sources` của ruleset năm Y (2025: CV 1296/CT-NVT; 2026: Luật 109/2025, NĐ 253/2026 Đ.69.1.a). |
| **II. Tách công thức & tham số** | PASS | Biểu năm derive từ `ruleset.pit_brackets`; GTGC từ `personal_relief`/`dependent_relief`; ngưỡng miễn vãng lai 15tr/tháng trong ruleset 2026 — không hard-code rải rác UI. |
| **III. Breakdown giải thích được** | PASS | FR-009: `AnnualSettlementBreakdown` — TN chịu thuế năm → GTGC năm → TNTT năm → thuế từng bậc năm → tổng đã khấu trừ → chênh lệch; dual scenario khi miễn vãng lai. |
| **IV. Test case tính tay là sự thật** | PASS | `TC-QT-2025-01`, `TC-QT-2026-01`, `TC-QT-2026-02` trong `docs/domain/thue-tncn.md` mục 6; property test SC-002. |
| **V. Quyền riêng tư tối thiểu** | PASS | SC-003: không gửi dữ liệu quyết toán lên server; wizard không thu MST/CCCD/chứng từ — chỉ logic hướng dẫn. |
| **VI. Spec trước, code sau** | PASS | Spec 004 đã Draft (clarified) phiên 2026-07-31 (NĐ 253, tolerance ≤1đ, breakdown năm) trước khi lập plan này. |

## Project Structure

Feature này **mở rộng** cấu trúc `src/` từ 001 — không tạo cây thư mục engine mới. Các file chính:

```text
src/
├── domain/types/
│   └── settlement.ts              # MỚI — AnnualSettlementInput, CasualIncomeInput,
│                                   # AnnualSettlementBreakdown, SettlementScenario, WizardResult
├── engine/
│   ├── annualSettlement.ts        # MỚI — tổng hợp năm, biểu năm, chênh lệch, dual scenario vãng lai
│   ├── casualExemption.ts         # MỚI — kiểm tra miễn QT NĐ 253 (bình quân ≤15tr, đã trừ 10%)
│   ├── grossToNet.ts              # DÙNG LẠI — suy thuế/BH tháng cho property test & nhập 12 tháng
│   ├── pit.ts                     # MỚI hoặc mở rộng — `calculateAnnualPIT(TNTT, ruleset)` biểu năm
│   └── index.ts                   # Export `calculateAnnualSettlement(...)`
├── components/
│   ├── breakdown/
│   │   └── AnnualBreakdownCard.tsx    # MỚI — breakdown năm (Constitution III)
│   ├── inputs/
│   │   ├── MonthlyIncomeGrid.tsx      # MỚI — 12 ô tháng hoặc toggle tổng/trung bình
│   │   └── CasualIncomeInput.tsx      # MỚI — thu nhập vãng lai + thuế đã trừ
│   ├── settlement/
│   │   ├── SettlementResultCard.tsx # MỚI — hoàn/nộp thêm/khớp + màu secondary/foreground
│   │   └── DualScenarioCard.tsx     # MỚI — so sánh không gộp vs gộp tự nguyện (TC-QT-2026-02)
│   ├── wizard/
│   │   └── FilingWizard.tsx           # MỚI — FR-008 quiz + checklist + hạn nộp
│   └── disclaimer/
│       └── SettlementDisclaimer.tsx   # MỚI — disclaimer mạnh + Ngài Miu pose ③④
├── screens/
│   ├── SettlementScreen.tsx           # MỚI — form + kết quả quyết toán (US1, US2)
│   └── FilingWizardScreen.tsx         # MỚI — wizard ủy quyền vs tự QT (US3)
└── __tests__/unit/
    ├── annualSettlement2025.test.ts   # MỚI — TC-QT-2025-01
    ├── annualSettlement2026.test.ts   # MỚI — TC-QT-2026-01, TC-QT-2026-02
    ├── casualExemption.test.ts        # MỚI — ngưỡng 15tr/tháng, tax_year ≥ 2026
    └── annualProperty.test.ts         # MỚI — SC-002: 12 tháng ≤ 12 VNĐ
```

## Calculation Logic & Precision Strategy

### 1. Chọn ruleset

- `tax_year` → ruleset tương ứng (FR-001): 2025 = biểu 7 bậc + GTGC 11/4,4; 2026 = biểu 5 bậc + GTGC 15,5/6,2 — **cả kỳ năm 2026**, không chia H1/H2 cho quyết toán lương (xem `thue-tncn.md` mục 4).

### 2. TN chịu thuế năm (lương)

- **Nhập tổng / trung bình × số tháng làm**: user cung cấp gross/tháng và số tháng có lương (TC-QT-2025-01: 10 tháng).
- **Nhập 12 tháng**: Σ (gross tháng i − BH NLĐ tháng i) — gọi `grossToNet` từng tháng (cùng vùng, ruleset năm Y; tháng 0 = bỏ qua).
- TN chịu thuế năm lương = tổng các tháng có thu nhập.

### 3. GTGC năm

```
GTGC năm = personal_relief × 12 + num_dependents × dependent_relief × 12
```

Luôn × 12 dù làm không trọn năm (TC-QT-2025-01).

### 4. Thu nhập vãng lai (NĐ 253/2026)

- Input: `casual_gross` (số nhận/năm), `casual_withheld` (thuế 10% đã trừ).
- Bình quân tháng = `casual_gross / 12`.
- Nếu `tax_year ≥ 2026` và bình quân ≤ 15.000.000 và `casual_withheld > 0` (đã khấu trừ 10%) → **miễn bắt buộc gộp** (FR-007).
- Engine tính **hai scenario** khi miễn:
  - **Không gộp**: TN năm = lương only; đã khấu trừ = lương only → chênh (TC-QT-2026-02 phương án 1: chênh 0).
  - **Gộp tự nguyện**: cộng `casual_gross` vào TN năm; đã khấu trừ += `casual_withheld` → chênh (phương án 2: hoàn 3.000.000).
- Nếu bình quân > 15tr/tháng → **bắt buộc gộp** (TC-QT-2026-01).

### 5. Thuế năm & chênh lệch

```
TNTT năm = max(0, TN chịu thuế năm − GTGC năm)
Thuế năm = lũy tiến trên biểu NĂM (ngưỡng bậc i = ngưỡng tháng i × 12)
Chênh lệch = Thuế năm − tổng thuế đã khấu trừ
  > 0 → ước nộp thêm
  < 0 → ước hoàn
  = 0 → khớp
```

Làm tròn từng bậc thuế năm bằng `Math.round()` (ADR 0004). Mục tiêu TC: sai số ≤ 1 VNĐ.

### 6. Edge cases MVP

- Chưa nhập thuế đã khấu trừ → yêu cầu nhập hoặc mặc định 0 kèm cảnh báo (spec Edge Cases).
- Không xử lý giảm trừ từ thiện/hưu trí; không tính cá nhân không cư trú (spec Assumptions).

## Test Plan & Verification Matrix

- **TC-QT-2025-01** (US1): Năm 2025, gross 30tr × 10 tháng, 0 NPT, đã khấu trừ 16.275.000 → thuế năm 11.475.000, **ước hoàn 4.800.000**, breakdown khớp từng bậc (sai số ≤ 1 VNĐ).
- **TC-QT-2026-01** (US2): Lương 30tr × 12 (khấu trừ 7.620.000) + vãng lai 240tr (đã trừ 24tr), bắt buộc gộp → thuế năm 33.240.000, **ước nộp thêm 1.620.000**.
- **TC-QT-2026-02** (US2): Lương 20tr × 12 + vãng lai 60tr (bình quân 5tr ≤ 15tr) → báo miễn; hiển thị phương án không gộp (chênh 0) vs gộp tự nguyện (**ước hoàn 3.000.000**).
- **SC-002 — property test**: Fixture lương đều 12 tháng (= TC tháng × 12, không thưởng) → `|thuế_năm − 12 × thuế_tháng| ≤ 12` VNĐ.
- **FR-008 — wizard**: Quiz điều kiện ủy quyền vs tự QT trả kết luận deterministic; checklist + hạn (tổ chức 31/03; cá nhân ~đầu tháng 5) — unit test logic, không snapshot UI.
- **Offline (SC-003)**: grep/static — không fetch/network trong luồng quyết toán.
