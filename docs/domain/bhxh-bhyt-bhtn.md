# Bảo hiểm bắt buộc: BHXH, BHYT, BHTN

**Cập nhật**: 2026-07-31 
**Tầng xác minh**: LTTV 2026 = Tầng 1 (NĐ 293/2025 Đ.3); lương cơ sở 2,53tr từ 01/07/2026 = Tầng 1 (NĐ 161/2026 Đ.3 k2); lương cơ sở 2,34tr đến 30/06/2026 = Tầng 1 (NĐ 73/2024 Đ.3 k2); LTTV 2025 = Tầng 1 (NĐ 74/2024 Đ.3). **Tỷ lệ đóng NLĐ 8% HT-TT = Tầng 1** (Luật BHXH 41/2024 Đ.33 k.1a); **trần căn cứ đóng = 20 lần mức tham chiếu = Tầng 1** (Đ.31 k.1đ); mức tham chiếu = lương cơ sở khi chưa bãi bỏ = Tầng 1 (Đ.7 + Đ.141 k.13). BHYT 1,5% / BHTN 1% NLĐ vẫn theo khung tổng hợp phổ biến (chưa đối chiếu riêng Luật BHYT / Luật Việc làm phần đóng. rủi ro thấp). 
**Liên quan**: Luật BHXH 41/2024/QH15; Luật Việc làm; NĐ lương tối thiểu vùng; NĐ/thông tư BHYT.

> Số liệu trần phụ thuộc “mức tham chiếu / lương cơ sở” và lương tối thiểu vùng. MUST lấy từ ruleset theo ngày.

## 1. Tỷ lệ đóng điển hình (NLĐ HĐLĐ)

Tổng ~32% căn cứ đóng, trong đó NLĐ ~10,5%, NSDLĐ ~21,5% (mức phổ biến từ 01/07/2025 và vẫn áp dụng vào 2026 theo tổng hợp phổ biến):

| Quỹ | NLĐ | NSDLĐ | Ghi chú |
|-----|-----|-------|---------|
| BHXH. Hưu trí & tử tuất | 8% | 14% | |
| BHXH. Ốm đau & thai sản |. | 3% | |
| BHXH. TNLĐ-BNN |. | 0,5% (có thể khác ngành rủi ro cao) | |
| BHYT | 1,5% | 3% | Tổng 4,5% |
| BHTN | 1% | 1% | |
| **Cộng** | **10,5%** | **21,5%** | |

Khi tính **net lương**, chỉ trừ phần **NLĐ (10,5%)** (trừ khi product có chế độ “chi phí doanh nghiệp”).

## 2. Căn cứ và trần

### 2.1. BHXH & BHYT

- Căn cứ: tiền lương tháng đóng BHXH theo quy định (lương + phụ cấp thường xuyên…. đơn giản hóa MVP: user nhập “mức đóng BH”).
- **Trần**: tối đa **20 × mức tham chiếu** (Luật BHXH 2024; mức tham chiếu = lương cơ sở khi chưa bãi bỏ).
 - **01/01-30/06/2026**: lương cơ sở 2.340.000 (NĐ 73/2024) → trần **46.800.000**.
 - **Từ 01/07/2026**: lương cơ sở **2.530.000** (NĐ 161/2026/NĐ-CP) → trần **50.600.000**.
 - **Lưu ý: Trần đổi giữa năm 2026** → ruleset 2026 phải tách 2 giai đoạn cho tham số này (xem rules-versioning).
- **Sàn**: không thấp hơn lương tối thiểu vùng (với công việc giản đơn điều kiện bình thường). chi tiết theo hướng dẫn BHXH.

### 2.2. BHTN

- Trần: **20 × lương tối thiểu vùng** nơi làm việc.
- Ví dụ 2026 vùng I (NĐ 293/2025/NĐ-CP): LTTV = **5.310.000** → trần BHTN = **106.200.000** đ.

### 2.3. Lương tối thiểu vùng từ 01/01/2026 (NĐ 293/2025/NĐ-CP)

| Vùng | Lương tối thiểu tháng |
|------|------------------------|
| I | 5.310.000 |
| II | 4.730.000 |
| III | 4.140.000 |
| IV | 3.700.000 |

### 2.4. Tham chiếu giai đoạn 2025 (để so sánh / quyết toán cũ)

| Vùng | LTTV (NĐ 74/2024/NĐ-CP, đến 31/12/2025) |
|------|------------------------------------------|
| I | 4.960.000 |
| II | 4.410.000 |
| III | 3.860.000 |
| IV | 3.450.000 |

(Đối chiếu lại khi implement. ghi trong ruleset có nguồn.)

## 3. Công thức MVP

```
base_bhxh_bhyt = min(max(salary_for_insurance, floor_region?), cap_bhxh) # floor tùy mode
bhxh_employee = base_bhxh_bhyt * 0.08
bhyt_employee = base_bhxh_bhyt * 0.015
base_bhtn = min(salary_for_insurance, 20 * min_wage_region)
bhtn_employee = base_bhtn * 0.01
total_employee = bhxh_employee + bhyt_employee + bhtn_employee
```

**Đơn giản hóa MVP**: cho phép user nhập một “mức lương đóng BH” (mặc định = gross), áp trần BHXH/BHYT và trần BHTN riêng.

## 4. Đoàn phí công đoàn (tuỳ chọn)

- Thường **0,5%** mức lương làm căn cứ đóng BHXH, có trần theo quy định công đoàn (các tool hay cap theo 20× lương cơ sở / mức thông báo địa phương).
- MVP: toggle “có đóng đoàn phí” + dùng tham số ruleset; không bật mặc định nếu chưa chắc user là đoàn viên.

## 5. Test case

### TC-BH-2026-01: Dưới trần (nửa đầu 2026)

Input: mức đóng = 30.000.000; vùng I; tháng 03/2026 (lương cơ sở 2.340.000); LTTV I = 5.310.000

- Trần BHXH/BHYT = 46.800.000 → base = 30.000.000 
- BHXH = 2.400.000; BHYT = 450.000; BHTN = 300.000 
- **Tổng NLĐ = 3.150.000**

### TC-BH-2026-02: Trên trần BHXH/BHYT (nửa đầu 2026)

Input: mức đóng = 60.000.000; vùng I; tháng 03/2026

- base_bhxh_bhyt = 46.800.000 
- BHXH = 3.744.000; BHYT = 702.000 
- base_bhtn = min(60e6, 106.2e6) = 60.000.000 → BHTN = 600.000 
- **Tổng NLĐ = 5.046.000**

### TC-BH-2026-03: Biên đúng trần BHXH

Input: mức đóng = 46.800.000, tháng 03/2026 → BHXH+BHYT tính đủ trên 46.8tr; tăng thêm 1 đồng lương không tăng BHXH/BHYT.

### TC-BH-2026H2-01: Trần mới từ 01/07/2026

Input: mức đóng = 60.000.000; vùng I; tháng 08/2026 (lương cơ sở 2.530.000)

- Trần BHXH/BHYT = 50.600.000 → base = 50.600.000 
- BHXH = 4.048.000; BHYT = 759.000 
- BHTN = 60e6 × 1% = 600.000 
- **Tổng NLĐ = 5.407.000** (khác 5.046.000 của nửa đầu năm → chứng minh cần ruleset theo `as_of_date`, không chỉ theo năm)

---

**Ghi chú triển khai**: Tách `insurance_rates.employee`, `insurance_caps`, `regional_minimum_wages` trong ruleset JSON (khớp [ruleset-spec.md](./product/ruleset-spec.md)).

## Liên kết

- [glossary.md](./glossary.md). thuật ngữ BHXH / BHYT / BHTN / lương cơ sở / LTTV
- [thue-tncn.md](./thue-tncn.md). dùng BH_NLĐ trong luồng tính thuế tháng
- [quyen-loi-lao-dong.md](./quyen-loi-lao-dong.md). quyền lợi gắn mức đóng / lương hưu
- [legal-sources.md](./legal-sources.md) · [legal-changelog.md](./legal-changelog.md)
- Specs: [001-tinh-luong-gross-net](././specs/001-tinh-luong-gross-net/spec.md)
