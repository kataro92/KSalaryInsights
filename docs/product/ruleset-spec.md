# Quy chuẩn & Cấu trúc Ruleset Tham số Luật (Ruleset Specification)

**Cập nhật**: 2026-08-03  
**Tuân thủ**: Nguyên tắc Constitution II (Tách công thức khỏi tham số theo năm) và ADR 0001 (`docs/decisions/0001-ruleset-versioning.md`).

## 1. Giới thiệu

Mọi công thức tính toán thuế TNCN, bảo hiểm (BHXH, BHYT, BHTN) và các khoản trợ cấp trong KVSalaryTools đều không được mã hóa cứng (hardcode) các hằng số tiền tệ hoặc tỷ lệ phần trăm trong code logic. Thay vào đó, toàn bộ tham số pháp lý được đóng gói thành các tệp dữ liệu dạng **Ruleset JSON** theo từng kỳ tính thuế/giai đoạn hiệu lực.

## 2. Định danh và Phạm vi hiệu lực (Versioning & Scope)

Mỗi file ruleset đại diện cho một bộ tham số pháp lý trong khoảng thời gian `effective_from` → `effective_to`.

- **Ruleset `2025`** (`2025.json`):
  - `effective_from`: `"2025-01-01"`
  - `effective_to`: `"2025-12-31"`
  - Đặc điểm: GTGC bản thân 11tr / NPT 4,4tr; Biểu thuế lũy tiến 7 bậc; Lương cơ sở 2,34tr (NĐ 73/2024); LTTV NĐ 74/2024.
- **Ruleset `2026-H1`** (`2026-h1.json`):
  - `effective_from`: `"2026-01-01"`
  - `effective_to`: `"2026-06-30"`
  - Đặc điểm: GTGC bản thân 15,5tr / NPT 6,2tr (NQ 110/2025); Biểu thuế lũy tiến 5 bậc (Luật 109/2025); Lương cơ sở 2,34tr (trần BHXH/BHYT 46,8tr); LTTV NĐ 293/2025.
- **Ruleset `2026-H2`** (`2026-h2.json`):
  - `effective_from`: `"2026-07-01"`
  - `effective_to`: `"2026-12-31"`
  - Đặc điểm: Giữ nguyên GTGC & Biểu 5 bậc 2026; **Lương cơ sở 2,53tr** (NĐ 161/2026 → trần BHXH/BHYT 50,6tr); Ngưỡng vãng lai 5tr (NĐ 253/2026).

## 3. Cấu trúc dữ liệu Ruleset Schema

```json
{
  "$schema": "./ruleset-schema.json",
  "id": "ruleset-2026-h2",
  "version": "1.0.0",
  "name": "Kỳ tính thuế 2026 (Giai đoạn H2 từ 01/07/2026)",
  "tax_year": 2026,
  "effective_from": "2026-07-01",
  "effective_to": "2026-12-31",
  "legal_sources": [
    "Luật 109/2025/QH15",
    "NQ 110/2025/UBTVQH15",
    "NĐ 161/2026/NĐ-CP",
    "NĐ 293/2025/NĐ-CP",
    "NĐ 253/2026/NĐ-CP"
  ],
  "personal_relief": 15500000,
  "dependent_relief": 6200000,
  "reference_salary": 2530000,
  "regional_minimum_wages": {
    "1": 5310000,
    "2": 4730000,
    "3": 4140000,
    "4": 3700000
  },
  "insurance_rates": {
    "employee": {
      "social": 0.08,
      "health": 0.015,
      "unemployment": 0.01
    },
    "employer": {
      "social": 0.17,
      "health": 0.03,
      "unemployment": 0.01,
      "occupational_accident": 0.005
    }
  },
  "insurance_caps": {
    "social_health_multiplier": 20,
    "unemployment_multiplier": 20
  },
  "pit_brackets": [
    { "bracket": 1, "max_taxable_income": 10000000, "rate": 0.05 },
    { "bracket": 2, "max_taxable_income": 30000000, "rate": 0.10 },
    { "bracket": 3, "max_taxable_income": 60000000, "rate": 0.20 },
    { "bracket": 4, "max_taxable_income": 100000000, "rate": 0.30 },
    { "bracket": 5, "max_taxable_income": null, "rate": 0.35 }
  ],
  "casual_income": {
    "withholding_threshold": 5000000,
    "withholding_rate": 0.10,
    "exemption_settlement_monthly_avg": 15000000
  }
}
```

## 4. Trường tùy chọn `casual_income`

`casual_income` **không** nằm trong `required` của schema vì MVP (specs 001–003) chỉ cần lương/công + BH + GTGC. Khi thiếu:

| Trường | Fallback engine | Ghi chú |
|--------|-----------------|--------|
| `withholding_threshold` | 2_000_000 (trước kỳ 2026) / 5_000_000 (kỳ 2026, NĐ 253 Đ.69.1.a) | Spec 004/008 |
| `withholding_rate` | 0.10 | Khấu trừ tại nguồn |
| `exemption_settlement_monthly_avg` | 15_000_000 | Miễn quyết toán phần vãng lai đã khấu trừ |

Ruleset dùng cho quyết toán / thu nhập khác (004, 008) MUST khai đủ `casual_income` — không dựa fallback khi ship.

## 5. Tự động lựa chọn Ruleset trong Engine

Calculation engine sử dụng hàm `getRuleset(taxYear: number, asOfDate?: string)`:
1. Nếu `asOfDate` được truyền (ví dụ `"2026-08-15"`): Engine lọc các ruleset thỏa mãn `tax_year === taxYear` và `effective_from <= asOfDate <= effective_to`.
2. Nếu chỉ có `taxYear`: Mặc định trả về ruleset có hiệu lực mới nhất trong năm đó (ví dụ năm 2026 trả về `2026-h2.json`).
