# Rules versioning — tham số luật theo giai đoạn

**Cập nhật**: 2026-08-03  
**ADR liên quan**: [0001-ruleset-versioning.md](../decisions/0001-ruleset-versioning.md)

## Vấn đề

Công thức (cách tính) ít đổi; **tham số** (GTGC, bậc thuế, LTTV, trần BH, tỷ lệ…) đổi theo năm hoặc theo ngày hiệu lực. Quyết toán giao thời dễ sai nếu ch[...]

## Nguyên tắc

1. **Tách công thức khỏi tham số** (Constitution II).  
2. Mỗi bộ tham số = một **ruleset** có `id`, `effective_from`, `effective_to` (nullable = còn hiệu lực), `legal_sources[]`.  
3. Phép tính nhận `ruleset_id` hoặc `as_of_date` / `tax_year` — **không** đọc hard-code trong UI.  
4. Test case gắn `ruleset_id`.  
5. Changelog luật → ruleset mới; ruleset cũ giữ để so sánh và quyết toán năm trước.

## Mô hình dữ liệu (logic)

```json
{
  "$schema": "./ruleset-schema.json",
  "id": "ruleset-2026-h1",
  "version": "1.0.0",
  "name": "Kỳ tính thuế 2026 (Giai đoạn H1 đến 30/06/2026)",
  "tax_year": 2026,
  "effective_from": "2026-01-01",
  "effective_to": "2026-06-30",
  "legal_sources": [
    "Luật 109/2025/QH15",
    "NQ 110/2025/UBTVQH15",
    "NĐ 293/2025/NĐ-CP"
  ],
  "personal_relief": 15500000,
  "dependent_relief": 6200000,
  "reference_salary": 2340000,
  "regional_minimum_wages": {
    "1": 5310000,
    "2": 4730000,
    "3": 4140000,
    "4": 3700000
  },
  "insurance_rates": {
    "employee": { "social": 0.08, "health": 0.015, "unemployment": 0.01 },
    "employer": { "social": 0.17, "health": 0.03, "unemployment": 0.01, "occupational_accident": 0.005 }
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
    "withholding_threshold": 2000000,
    "withholding_rate": 0.10,
    "exemption_settlement_monthly_avg": null
  }
}
```

(Schema chi tiết: xem [ruleset-spec.md](./ruleset-spec.md) và [ruleset-schema.json](./ruleset-schema.json).)

## Cách chọn ruleset

| Ngữ cảnh UI | Khóa chọn |
|-------------|-----------|
| Tính lương tháng đang làm | `tax_year` user chọn (mặc định năm hiện tại) + `as_of_date` (tháng phát sinh) |
| So sánh cũ/mới | Chạy 2 ruleset song song trên cùng input |
| Quyết toán năm Y | Ruleset của năm Y (không phải năm mở app) |
| Quyền lợi BH phát sinh ngày D | `as_of_date = D` |

> [!WARNING]
> Khi tính lương khấu trừ hàng tháng, **bắt buộc** phải truyền `asOfDate` để tránh lấy nhầm tham số H2 áp cho H1 (ví dụ: trần BHXH đổi tại 01/07/2026).

**Thuật toán**: chọn ruleset có `effective_from <= date` và (`effective_to` null hoặc `date <= effective_to`); nếu nhiều khớp, ưu tiên `tax_year` đúng hoặc ruleset cụ thể [...]

## Phân phối cập nhật

### MVP
- Bundle tối thiểu 2 ruleset: **2025** và **2026** trong app.
- Phát hành app mới khi luật đổi (chấp nhận được giai đoạn đầu).

### Sau MVP (F019)
- Bundled fallback + **remote manifest** (JSON signed hoặc HTTPS + checksum).
- App kiểm tra manifest khi mở (wifi); tải ruleset mới; vẫn chạy offline với bản đã cache.
- Không gửi dữ liệu lương lên server chỉ để lấy ruleset.

## Giao thời — ví dụ bắt buộc trong QA

| Tình huống | Ruleset đúng |
|------------|--------------|
| User mở app 03/2026, quyết toán TN 2025 | 2025 (7 bậc, GTGC 11/4.4) |
| Tính lương tháng 02/2026 | 2026-H1 (5 bậc, GTGC 15.5/6.2; lương cơ sở 2,34tr → trần BHXH 46,8tr) |
| Tính lương tháng 08/2026 | 2026-H2 (thuế như H1; lương cơ sở **2,53tr** → trần BHXH **50,6tr** — NĐ 161/2026) |
| So sánh "nếu lương này năm 2025 vs 2026" | Chạy cả hai |
| Vãng lai chi trả 06/2026 vs 08/2026 | Ngưỡng khấu trừ 2tr vs **5tr** (NĐ 253/2026) |

### Ruleset đổi GIỮA năm (bài học vòng xác minh #2)

Năm 2026 có ít nhất 3 tham số đổi tại **01/07/2026** (lương cơ sở/trần BHXH, ngưỡng vãng lai, cơ chế CK/ESOP) trong khi biểu thuế + GTGC áp từ 01/01/2026. Hệ quả:

- `tax_year` không đủ làm khóa duy nhất — tham số bảo hiểm và thu nhập khác MUST chọn theo `as_of_date` (tháng phát sinh).
- Một năm có thể gồm nhiều ruleset con (2026-H1, 2026-H2) chung `tax_year: 2026`; quyết toán năm dùng biểu thuế theo `tax_year`, còn khấu trừ tháng dùng ruleset con theo[...]
- Test bắt buộc: TC-BH-2026-02 (tháng 3) vs TC-BH-2026H2-01 (tháng 8) cho ra tổng BH khác nhau trên cùng input.

## Kiểm thử

- Mỗi ruleset có fixture test case từ domain docs.  
- Regression: thêm ruleset mới **không** làm fail test ruleset cũ.  
- Snapshot `legal_sources` không rỗng.

## Việc chưa làm trong tài liệu này

- Chữ ký số / CDN cụ thể (kỹ thuật — để plan React/Expo).  
- i18n keys.
