# Rules versioning — tham số luật theo giai đoạn

**Cập nhật**: 2026-07-31  
**ADR liên quan**: [0001-ruleset-versioning.md](../decisions/0001-ruleset-versioning.md)

## Vấn đề

Công thức (cách tính) ít đổi; **tham số** (GTGC, bậc thuế, LTTV, trần BH, tỷ lệ…) đổi theo năm hoặc theo ngày hiệu lực. Quyết toán giao thời dễ sai nếu chọn ruleset theo “ngày hôm nay”.

## Nguyên tắc

1. **Tách công thức khỏi tham số** (Constitution II).  
2. Mỗi bộ tham số = một **ruleset** có `id`, `effective_from`, `effective_to` (nullable = còn hiệu lực), `legal_sources[]`.  
3. Phép tính nhận `ruleset_id` hoặc `as_of_date` / `tax_year` — **không** đọc hard-code trong UI.  
4. Test case gắn `ruleset_id`.  
5. Changelog luật → ruleset mới; ruleset cũ giữ để so sánh và quyết toán năm trước.

## Mô hình dữ liệu (logic)

```json
{
  "id": "vn-pit-insurance-2026-h1",
  "tax_year": 2026,
  "effective_from": "2026-01-01",
  "effective_to": "2026-06-30",
  "legal_sources": [
    {"ref": "Luật 109/2025/QH15", "note": "Biểu 5 bậc, kỳ TN 2026"},
    {"ref": "NQ 110/2025/UBTVQH15", "note": "GTGC 15.5 / 6.2"},
    {"ref": "NĐ 293/2025/NĐ-CP", "note": "LTTV 2026"}
  ],
  "personal_relief": 15500000,
  "dependent_relief": 6200000,
  "tax_brackets_monthly": [
    {"up_to": 10000000, "rate": 0.05},
    {"up_to": 30000000, "rate": 0.10},
    {"up_to": 60000000, "rate": 0.20},
    {"up_to": 100000000, "rate": 0.30},
    {"up_to": null, "rate": 0.35}
  ],
  "insurance": {
    "employee": {"bhxh": 0.08, "bhyt": 0.015, "bhtn": 0.01},
    "employer": {"bhxh_pension": 0.14, "bhxh_sick_maternity": 0.03, "bhxh_ohs": 0.005, "bhyt": 0.03, "bhtn": 0.01},
    "reference_wage": 2340000,
    "bhxh_cap_multiplier": 20,
    "region_min_wages": {
      "I": 5310000,
      "II": 4730000,
      "III": 4140000,
      "IV": 3700000
    },
    "bhtn_cap_multiplier": 20
  }
}
```

(Schema chi tiết khóa khi `/speckit-plan`; đây là hợp đồng nghiệp vụ.)

## Cách chọn ruleset

| Ngữ cảnh UI | Khóa chọn |
|-------------|-----------|
| Tính lương tháng đang làm | `tax_year` user chọn (mặc định năm hiện tại) |
| So sánh cũ/mới | Chạy 2 ruleset song song trên cùng input |
| Quyết toán năm Y | Ruleset của năm Y (không phải năm mở app) |
| Quyền lợi BH phát sinh ngày D | `as_of_date = D` |

**Thuật toán**: chọn ruleset có `effective_from <= date` và (`effective_to` null hoặc `date <= effective_to`); nếu nhiều khớp, ưu tiên `tax_year` đúng hoặc ruleset cụ thể hơn (ADR bổ sung nếu cần).

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
| So sánh “nếu lương này năm 2025 vs 2026” | Chạy cả hai |
| Vãng lai chi trả 06/2026 vs 08/2026 | Ngưỡng khấu trừ 2tr vs **5tr** (NĐ 253/2026) |

### Ruleset đổi GIỮA năm (bài học vòng xác minh #2)

Năm 2026 có ít nhất 3 tham số đổi tại **01/07/2026** (lương cơ sở/trần BHXH, ngưỡng vãng lai, cơ chế CK/ESOP) trong khi biểu thuế + GTGC áp từ 01/01/2026. Hệ quả thiết kế:

- `tax_year` không đủ làm khóa duy nhất — tham số bảo hiểm và thu nhập khác MUST chọn theo `as_of_date` (tháng phát sinh).
- Một năm có thể gồm nhiều ruleset con (2026-H1, 2026-H2) chung `tax_year: 2026`; quyết toán năm dùng biểu thuế theo `tax_year`, còn khấu trừ tháng dùng ruleset con theo tháng.
- Test bắt buộc: TC-BH-2026-02 (tháng 3) vs TC-BH-2026H2-01 (tháng 8) cho ra tổng BH khác nhau trên cùng input.

## Kiểm thử

- Mỗi ruleset có fixture test case từ domain docs.  
- Regression: thêm ruleset mới **không** làm fail test ruleset cũ.  
- Snapshot `legal_sources` không rỗng.

## Việc chưa làm trong tài liệu này

- Chữ ký số / CDN cụ thể (kỹ thuật — để plan React/Expo).  
- Schema JSON Schema chính thức.  
- i18n keys.
