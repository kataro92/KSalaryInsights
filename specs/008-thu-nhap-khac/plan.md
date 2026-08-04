# Implementation Plan: 008-thu-nhap-khac

**Branch**: `008-thu-nhap-khac` | **Date**: 2026-08-05 | **Spec**: [specs/008-thu-nhap-khac/spec.md](./spec.md)

**Input**: Feature specification from `specs/008-thu-nhap-khac/spec.md`

## Summary

Bổ sung module **ước thuế thu nhập khác** (ngoài lương HĐLĐ): cho thuê BĐS, hộ kinh doanh (HKD), chuyển nhượng chứng khoán, ESOP, và khấu trừ tại nguồn thu nhập vãng lai — mỗi loại là **calculator độc lập** với engine riêng, đọc rate/ngưỡng từ ruleset theo `tax_year` và `as_of_date`. Kết quả trả breakdown tách rõ GTGT vs TNCN (hoặc TLTC vs thuế chuyển nhượng với ESOP), kèm nhắc nghĩa vụ kê khai/thông báo khi miễn thuế (FR-005). **Không** cộng mặc định vào `grossToNet` / `SalaryInput` (FR-001).

**Quan hệ với 001**: Kế thừa `rulesetLoader.ts`, làm tròn VNĐ integer, offline bundle — **không** mở rộng `grossToNet.ts`. Module quyết toán (004) sẽ gộp thu nhập khác khi người dùng chủ động; 008 chỉ cung cấp calculator + engine thuần.

**Quan hệ với 004**: `TC-CASUAL-03` (miễn quyết toán vãng lai bình quân ≤ 15tr/tháng) kiểm chứng tại spec 004 (`TC-QT-2026-02`); 008 ship calculator khấu trừ tại nguồn (`TC-CASUAL-01/02`) dùng chung block `casual_income` trong ruleset.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Tuân ADR 0001/0004: engine thuần TypeScript offline, `Math.round()` từng bước, zero API.

**Bổ sung riêng cho 008**:
- **Phụ thuộc 001**: `rulesetLoader.ts`, `Ruleset` type, pattern test unit Jest — không thêm thư viện mới.
- **Module engine mới** (`src/engine/otherIncome/`): một file calculator mỗi loại thu nhập — `rent.ts`, `hkd.ts`, `securities.ts`, `esop.ts`, `casualWithholding.ts` — facade `index.ts` export API thống nhất.
- **Ruleset mở rộng**: block `other_income` (cho thuê, HKD, CK, ESOP) + `casual_income` (đã có trong `ruleset-spec.md` §4) — rate/ngưỡng **MUST** khai đủ trong JSON ruleset khi ship; engine không hard-code trong UI (FR-002, SC-002).
- **Chọn ruleset**: `getRuleset(taxYear, asOfDate)` — CK/ESOP/vãng lai ngưỡng 5tr áp theo `as_of_date` (hiệu lực 01/07/2026); ngưỡng vãng lai kỳ 2026 = **5.000.000 cả năm** (NĐ 253 Đ.69.1.a, không tách H1/H2); ruleset ≤2025 dùng ngưỡng 2.000.000.
- **HKD**: biểu tỷ lệ ngành (GTGT 1/5/3/2%; TNCN 0,5/2/1,5/1%, cho thuê TS & đại lý TNCN 5%) lưu trong ruleset; TNCN tính trên **phần doanh thu vượt ngưỡng 1 tỷ** (Đ.7 k3a Luật 109/2025); GTGT tính trên toàn bộ doanh thu khi vượt ngưỡng.
- **UI**: hub/màn hình "Thu nhập khác" với tab hoặc danh sách calculator; mỗi màn có input riêng + breakdown card tách dòng thuế; Flat Design + disclaimer theo `docs/product/design-system.md`.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Mỗi calculator kèm `legal_sources` từ ruleset đang áp (NĐ 141/2026, NĐ 68/2026, NĐ 253/2026, Luật GTGT 2024 Đ.12, Luật 109/2025 Đ.7). |
| **II. Tách công thức & tham số** | PASS | Rate/ngưỡng (1 tỷ, 5%/5% cho thuê, biểu ngành HKD, 0,1% CK, 10% ESOP TLTC, ngưỡng vãng lai) trong ruleset JSON — engine chỉ áp công thức. |
| **III. Breakdown giải thích được** | PASS | `OtherIncomeBreakdown` tách GTGT/TNCN hoặc TLTC khấu trừ + thuế chuyển nhượng; miễn thuế vẫn hiển thị nghĩa vụ thông báo/kê khai (FR-005). |
| **IV. Test case tính tay là sự thật** | PASS | SC-001: TC-RENT-01/02/03, TC-HKD-01/02, TC-SEC-01, TC-ESOP-01, TC-CASUAL-01/02 pass; TC-CASUAL-03 thuộc 004. |
| **V. Quyền riêng tư tối thiểu** | PASS | Không thu MST/CCCD; chỉ nhập số tiền cục bộ, không gửi server. |
| **VI. Spec trước, code sau** | PASS | Spec 008 Draft (clarified) phiên 2026-07-31 — toàn bộ tham số đã khóa, gồm ESOP — trước khi lập plan này. |

## Project Structure

Feature này **mở rộng** cấu trúc `src/` từ 001 — thêm thư mục engine `otherIncome/` và types/UI riêng; **không** sửa luồng `CalculatorScreen` lương gross/net.

```text
src/
├── domain/types/
│   └── otherIncome.ts              # MỚI — RentInput/Breakdown, HkdInput/Breakdown,
│                                   # SecuritiesInput/Breakdown, EsopInput/Breakdown,
│                                   # CasualWithholdingInput/Breakdown; income_type enum
├── engine/
│   ├── rulesets/
│   │   ├── 2025.json               # BỔ SUNG other_income + casual_income (ngưỡng 2tr)
│   │   ├── 2026-h1.json            # BỔ SUNG other_income; casual_income ngưỡng 5tr (cả năm 2026)
│   │   └── 2026-h2.json            # BỔ SUNG other_income; casual_income ngưỡng 5tr
│   ├── rulesetLoader.ts            # Xác nhận resolve theo tax_year + as_of_date
│   └── otherIncome/                # MỚI — calculators tách biệt, không import grossToNet
│       ├── rent.ts                 # TC-RENT-01/02/03
│       ├── hkd.ts                  # TC-HKD-01/02; industry_rates từ ruleset
│       ├── securities.ts           # TC-SEC-01; effective từ 01/07/2026
│       ├── esop.ts                 # TC-ESOP-01; TLTC 10% + 0,1% CN; fallback mệnh giá
│       ├── casualWithholding.ts    # TC-CASUAL-01/02; dùng ruleset.casual_income
│       └── index.ts                # Facade export calculateRent, calculateHkd, ...
├── components/
│   ├── otherIncome/
│   │   ├── RentCalculator.tsx
│   │   ├── HkdCalculator.tsx       # chọn nhóm ngành + gợi ý PP (DT−CP)×15%
│   │   ├── SecuritiesCalculator.tsx
│   │   ├── EsopCalculator.tsx      # toggle chi phí ghi sổ vs fallback mệnh giá
│   │   ├── CasualWithholdingCalculator.tsx
│   │   └── OtherIncomeBreakdownCard.tsx  # render GTGT/TNCN/TLTC tách dòng
│   └── disclaimer/
│       └── OtherIncomeDisclaimer.tsx     # nhắc ước tính, không thay tờ khai
├── screens/
│   └── OtherIncomeScreen.tsx       # MỚI — hub điều hướng 5 calculator
└── __tests__/unit/otherIncome/
    ├── rent.test.ts                # TC-RENT-01/02/03
    ├── hkd.test.ts                 # TC-HKD-01/02
    ├── securities.test.ts          # TC-SEC-01
    ├── esop.test.ts                # TC-ESOP-01 + fallback mệnh giá
    └── casualWithholding.test.ts   # TC-CASUAL-01/02 (+ ngưỡng 2tr năm 2025)
```

### Ruleset schema (mở rộng — ví dụ)

```json
{
  "other_income": {
    "rent": {
      "exemption_threshold": 1000000000,
      "vat_rate": 0.05,
      "pit_rate_on_excess": 0.05
    },
    "hkd": {
      "exemption_threshold": 1000000000,
      "income_method_threshold": 3000000000,
      "industry_rates": [
        { "id": "distribution", "label": "Phân phối, cung cấp hàng hóa", "vat_rate": 0.01, "pit_rate": 0.005 },
        { "id": "services", "label": "Dịch vụ, xây dựng không bao thầu NVL", "vat_rate": 0.05, "pit_rate": 0.02 },
        { "id": "asset_rental_agency", "label": "Cho thuê TS, đại lý BH/xổ số/đa cấp", "vat_rate": 0.05, "pit_rate": 0.05 },
        { "id": "production_transport", "label": "Sản xuất, vận tải, XD bao thầu NVL", "vat_rate": 0.03, "pit_rate": 0.015 },
        { "id": "other", "label": "Hoạt động kinh doanh khác", "vat_rate": 0.02, "pit_rate": 0.01 }
      ],
      "income_method_rate": 0.15
    },
    "securities": {
      "transfer_rate": 0.001,
      "effective_from": "2026-07-01"
    },
    "esop": {
      "tlcc_withholding_rate": 0.10,
      "transfer_rate": 0.001,
      "effective_from": "2026-07-01"
    }
  },
  "casual_income": {
    "withholding_threshold": 5000000,
    "withholding_rate": 0.10,
    "exemption_settlement_monthly_avg": 15000000
  }
}
```

**Structure Decision**: Mỗi `income_type` = engine file + UI component riêng; shared chỉ ở types, breakdown card, và ruleset — tránh monolith calculator gộp logic.

## Test Plan & Verification Matrix

| ID | Input | Kỳ vọng |
|----|-------|---------|
| **TC-RENT-01** | 20.000.000/tháng → 240tr/năm, ruleset 2026 | Thuế = 0; UI nhắc thông báo doanh thu (mẫu 01/BĐS, hạn 31/01; 2026 thêm mốc kê khai) |
| **TC-RENT-02** | Doanh thu 1,5 tỷ/năm | GTGT 75.000.000 + TNCN 25.000.000 = 100.000.000; breakdown tách hai sắc thuế |
| **TC-RENT-03** | Doanh thu đúng 1.000.000.000 | Thuế = 0 (biên ≤ ngưỡng) |
| **TC-HKD-01** | Doanh thu 800tr/năm | Thuế = 0 + nhắc nghĩa vụ kê khai doanh thu |
| **TC-HKD-02** | Bán tạp hóa 1,5 tỷ/năm, nhóm phân phối | GTGT 15.000.000 (1% × toàn bộ) + TNCN 2.500.000 (0,5% × phần vượt 1 tỷ); gợi ý so sánh (DT−CP)×15% |
| **TC-SEC-01** | Bán 100.000.000 sau 01/07/2026 | Thuế = 100.000 (0,1%) |
| **TC-ESOP-01** | CP ghi sổ 100tr, bán 300tr sau 01/07/2026 | TLTC khấu trừ 10.000.000 + thuế CN 300.000; ghi chú quyết toán lũy tiến cuối năm |
| **TC-CASUAL-01** | Chi trả 10.000.000 (≥ ngưỡng) | Khấu trừ 1.000.000; thực nhận 9.000.000 |
| **TC-CASUAL-02** | Chi trả 4.000.000, tháng 08/2026 (< 5tr) | Không khấu trừ; cảnh báo vẫn chịu thuế khi quyết toán |
| **TC-CASUAL-02b** | Cùng 4.000.000, `tax_year` 2025 (ngưỡng 2tr) | Khấu trừ 400.000 — chứng minh chọn ngưỡng theo ruleset năm |
| **TC-CASUAL-03** | — | Kiểm chứng tại spec 004 / `casualExemption.ts` — không duplicate test ở 008 |

**Edge cases bổ sung**:
- Cho thuê + HKD cùng lúc: mỗi calculator độc lập; UI ghi chú ngưỡng tính trên tổng doanh thu **từng hoạt động** — không auto-gộp.
- `as_of_date` trước 01/07/2026 với CK: engine từ chối hoặc hiển thị thông báo chưa hiệu lực tỷ lệ thống nhất 0,1% (theo ruleset `effective_from`).
- ESOP fallback: `shares × par_value − amount_paid`, âm → 0; UI ghi rõ phương pháp thay thế NĐ 253/2026.
- Sai số làm tròn ≤ 1 VNĐ mỗi dòng breakdown (kế thừa 001).
