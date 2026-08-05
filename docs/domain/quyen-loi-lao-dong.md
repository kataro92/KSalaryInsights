# Quyền lợi người lao động (ước tính)

**Cập nhật**: 2026-08-01 (đối chiếu bản gốc đợt 3 — Luật Dân số 113/2025)  
**Tầng xác minh**: ✅ **Tầng 1 toàn bộ** — BLLĐ 2019; Luật Việc làm 74/2025; Luật BHXH 41/2024; Luật Dân số 113/2025 (`luat113-2025.pdf` — số "7 tháng" = Đ.14 k.1a + Đ.29 k.1 sửa Đ.139 BLLĐ); NĐ 158/161/168; CV 340/4860.  
**Phạm vi**: Calculator ước tính có disclaimer — không thay quyết định cơ quan BHXH / Tòa án / thanh tra LĐ.

Nguồn khung: Bộ luật Lao động 45/2019/QH14; Luật Việc làm 74/2025/QH15 (hiệu lực 01/01/2026); Luật BHXH 41/2024/QH15; NĐ 161/2026/NĐ-CP (lương cơ sở 2,53tr từ 01/07/2026).

## 1. Làm thêm giờ (OT)

Hệ số tối thiểu (Điều 98 BLLĐ 2019):

| Thời điểm | Hệ số tối thiểu trên đơn giá giờ bình thường |
|-----------|-----------------------------------------------|
| Ngày thường | 150% |
| Ngày nghỉ hằng tuần | 200% |
| Ngày lễ, Tết, ngày nghỉ có hưởng lương | 300% (chưa kể lương ngày lễ nếu hưởng lương ngày) |
| Làm đêm | +30% ; OT ban đêm cộng thêm 20% đơn giá ban ngày của loại ngày tương ứng |

**Công thức đơn giản** (MVP chỉ 3 hệ số ngày; đêm ghi nợ V1.1):

```
ot_pay = hourly_rate * hours * multiplier
hourly_rate = monthly_salary / (work_days_per_month * hours_per_day)   # mặc định 26 × 8, cấu hình được
```

### TC-OT-01

Lương tháng 20.000.000; 26 ngày × 8h; OT 10 giờ ngày thường  
hourly = 20e6 / 208 ≈ 96.153,85 → ot = 96.153,85 × 10 × 1,5 ≈ **1.442.308**

## 2. Trợ cấp thôi việc / mất việc (ĐÃ KHÓA — Điều 46, 47 BLLĐ 2019)

### 2.1. Trợ cấp thôi việc (Điều 46)

- **Điều kiện**: làm việc thường xuyên từ đủ **12 tháng** trở lên; HĐLĐ chấm dứt theo khoản 1, 2, 3, 4, 6, 7, 9, 10 Điều 34; **loại trừ**: đủ điều kiện hưởng lương hưu, hoặc tự ý bỏ việc ≥5 ngày liên tục không lý do (điểm e khoản 1 Điều 36).
- **Mức**: mỗi năm làm việc = **½ tháng tiền lương**.
- **Thời gian tính** = tổng thời gian làm việc thực tế **trừ** thời gian đã tham gia BHTN và thời gian đã được chi trả trợ cấp thôi việc/mất việc trước đó.
- **Làm tròn**: lẻ từ đủ 1 đến dưới 6 tháng → ½ năm; từ đủ 6 tháng → 1 năm.
- **Tiền lương căn cứ**: bình quân 6 tháng liền kề theo HĐLĐ trước khi thôi việc.

```
severance = 0.5 * years_counted * avg_salary_6m
years_counted = round_rule(total_service - bhtn_time - previously_paid_time)
```

### 2.2. Trợ cấp mất việc làm (Điều 47)

- **Điều kiện**: đủ 12 tháng; mất việc theo khoản 11 Điều 34 (thay đổi cơ cấu, công nghệ, lý do kinh tế, chia tách/sáp nhập…).
- **Mức**: mỗi năm làm việc = **1 tháng tiền lương**, **tối thiểu 2 tháng**.
- Thời gian tính và lương căn cứ: như thôi việc.

```
job_loss = max(1.0 * years_counted * avg_salary_6m, 2 * avg_salary_6m)
```

### Edge cases quan trọng (product phải nêu rõ)

- NLĐ đóng BHTN đầy đủ suốt thời gian làm việc → thời gian tính trợ cấp thường **= 0** (đã trừ thời gian BHTN) → kết quả 0 là ĐÚNG luật, UI phải giải thích (thời gian trước 2009 hoặc giai đoạn không đóng BHTN mới được tính).
- UI tách rõ 2 chế độ (thôi việc vs mất việc) vì mức khác nhau gấp đôi.

### TC-SEVERANCE-01 (đã khóa)

Tổng thời gian làm việc 7 năm, trong đó 2 năm đầu không thuộc diện đóng BHTN; lương bình quân 6 tháng = 20.000.000.  
Thời gian tính = 7 − 5 = 2 năm → thôi việc = 0,5 × 2 × 20e6 = **20.000.000**.

### TC-SEVERANCE-02 — làm tròn

Thời gian tính = 1 năm 7 tháng → 2 năm (lẻ ≥6 tháng) → 0,5 × 2 × 20e6 = 20.000.000.

### TC-JOBLOSS-01 — sàn 2 tháng

Thời gian tính = 1 năm; lương 20e6 → 1 × 1 × 20e6 = 20e6 < 2 tháng → **40.000.000** (sàn).

## 3. Trợ cấp thất nghiệp (ĐÃ KHÓA — Điều 38, 39 Luật Việc làm 74/2025/QH15, từ 01/01/2026) ✅ Tầng 1

- **Điều kiện chính** (Đ.38 k.1):
  - Chấm dứt HĐLĐ hợp pháp (loại trừ đơn phương trái luật / nghỉ hưu).
  - Đóng BHTN đủ **12 tháng trong 24 tháng** trước khi chấm dứt; riêng HĐLĐ có thời hạn **từ đủ 1 tháng đến dưới 12 tháng**: đủ **12 tháng trong 36 tháng** (luật 2025 bỏ khái niệm "mùa vụ").
  - Nộp đủ hồ sơ trong **03 tháng** kể từ ngày chấm dứt.
  - Trong **10 ngày làm việc** kể từ ngày nộp đủ hồ sơ mà chưa thuộc trường hợp có việc làm / nghĩa vụ QS-CA / học >12 tháng /… (Đ.38 k.1.d) — **không còn là 15 ngày** như Luật 2013.
- **Mức hằng tháng** (Đ.39 k.1) = **60% × bình quân tiền lương tháng đóng BHTN của 6 tháng gần nhất**, **trần duy nhất = 5 × lương tối thiểu vùng** tại tháng cuối đóng (luật 2025 **bỏ** nhánh trần 5× lương cơ sở cho khu vực Nhà nước).
- **Số tháng hưởng** (Đ.39 k.2): đóng đủ 12–36 tháng → **3 tháng**; sau đó cứ đủ thêm 12 tháng → **+1 tháng**; **tối đa 12 tháng**.
- **Thời điểm hưởng** (Đ.39 k.3): **ngày làm việc thứ 11** kể từ ngày nộp đủ hồ sơ (luật 2013: ngày thứ 16).
- Thời gian đóng trước 2026 được **cộng dồn** theo Đ.35; không có điều khoản bảo lưu riêng.

```
monthly_benefit = min(0.60 * avg_salary_bhtn_6m, 5 * min_wage_region)
months = clamp(3 + floor(max(0, months_paid - 36) / 12), 3, 12)   # nếu months_paid >= 12
```

### TC-UE-01 (đã khóa)

Đóng BHTN 72 tháng; bình quân 6 tháng cuối 15.000.000; vùng I 2026 (LTTV 5.310.000 → trần 26.550.000).  
Mức/tháng = 60% × 15e6 = 9.000.000 (< trần) → tháng hưởng = 3 + (72−36)/12 = **6 tháng** → tổng **54.000.000**.

### TC-UE-02 — chạm trần

Bình quân 50.000.000, vùng I → 60% = 30e6 > trần 26.550.000 → hưởng **26.550.000/tháng**.

### TC-UE-03 — không đủ điều kiện

Đóng 10 tháng → không đủ 12 tháng → **không đủ điều kiện**, hiển thị lý do.

## 4. Thai sản / ốm đau (ĐÃ KHÓA khung — Luật BHXH 2024)

### 4.1. Thai sản (Điều 53, 58, 59) ✅ Tầng 1

- **Thời gian nghỉ sinh** (Đ.139 k.1 BLLĐ 2019, bản sửa đổi theo Đ.29 k.1 Luật Dân số 113/2025, hiệu lực 01/07/2026): 6 tháng; **sinh con thứ hai: 7 tháng**; trước sinh tối đa 2 tháng; sinh đôi trở lên +1 tháng/con từ con thứ 2. Điều kiện hưởng 7 tháng: "tại thời điểm sinh có một con đẻ còn sống" (NĐ 168/2026 Đ.2). Nam khi vợ **sinh đôi hoặc sinh con thứ hai**: nghỉ **10 ngày làm việc**; sinh ba trở lên +3 ngày LV/con từ con thứ ba (Đ.53 k.2c Luật BHXH, bản sửa theo Đ.29 k.2 Luật Dân số).
- **Điều kiện điển hình**: đóng BHXH đủ 6 tháng trong 12 tháng trước sinh. Loại trừ: trường hợp Đ.52 k.2 Luật BHXH (thai ≥22 tuần chết lưu/đình chỉ) không hưởng chế độ 7 tháng (NĐ 168 Đ.2 k.2).
- **Mức/tháng** = **100% bình quân tiền lương đóng BHXH 6 tháng gần nhất** trước nghỉ (Đ.59).
- **Trợ cấp một lần khi sinh** = **2 × mức tham chiếu** tại tháng sinh, **cho mỗi con** (Đ.58 k.4 — nguyên văn có chữ "cho mỗi con"): trước 01/07/2026 = 2 × 2,34tr = **4.680.000**/con; từ 01/07/2026 = 2 × 2,53tr = **5.060.000**/con (NĐ 161/2026).
- **Dưỡng sức sau sinh**: 30% mức tham chiếu/ngày (Đ.60 k.3).

```
maternity_total = 1.00 * avg_salary_6m * leave_months + 2 * reference_wage(month_of_birth) * num_children
```

### TC-MAT-01 (đã khóa)

Bình quân 6 tháng = 18.000.000; sinh con đầu tháng 08/2026 (nghỉ 6 tháng; tham chiếu 2,53tr):  
Tiền chế độ = 18e6 × 6 = 108.000.000; trợ cấp 1 lần = 5.060.000 → **113.060.000** (chưa gồm dưỡng sức).

### TC-MAT-02 — con thứ hai sau 01/07/2026

Cùng bình quân; nghỉ 7 tháng → 18e6 × 7 + 5.060.000 = **131.060.000**. (✅ số "7 tháng" đối chiếu nguyên văn Đ.14 k.1a + Đ.29 k.1 Luật Dân số 113/2025.)

### TC-MAT-03 — sinh đôi lần đầu, tháng 08/2026

Cùng bình quân 18tr; nghỉ = 6 + 1 (con thứ 2 của lần sinh đôi) = **7 tháng**; trợ cấp 1 lần = 5.060.000 × 2 con = 10.120.000 (Đ.58 k.4 ✅).  
Tổng = 18e6 × 7 + 10.120.000 = **136.120.000**.

### 4.2. Ốm đau (ĐÃ KHÓA — Đ.43, Đ.45 Luật BHXH 41/2024) ✅ Tầng 1

- Mức: **75%** tiền lương làm căn cứ đóng BHXH của **tháng gần nhất trước tháng nghỉ** (Đ.45 k.1a + k.2).
- Mức/ngày = mức tháng / **24** (Đ.45 k.5); nghỉ dưới nửa ngày = ½ ngày; từ nửa ngày đến dưới 1 ngày = 1 ngày.
- **Trần ngày/năm** (tính theo ngày làm việc, không kể lễ/tết/nghỉ tuần — Đ.43 k.1):
  - Điều kiện bình thường: **30 / 40 / 60** ngày (<15 / 15–<30 / ≥30 năm đóng).
  - Nặng nhọc, độc hại hoặc vùng đặc biệt khó khăn: **40 / 50 / 70** ngày.
- V1 mode cơ bản: ngày nghỉ × (75% × lương tháng / 24). Bệnh dài ngày → V2.

```
sick_pay = days * (0.75 * salary_last_month / 24)
```

### TC-SICK-01 — nghỉ ốm 5 ngày

Lương đóng BHXH tháng liền kề = 12.000.000; nghỉ 5 ngày trong hạn:  
Mức/ngày = 12e6 × 75% / 24 = 375.000 → tổng = **1.875.000**.

## 5. Lương hưu & BHXH một lần

### 5.1. BHXH một lần (ĐÃ KHÓA — Điều 70 Luật BHXH 2024) ✅ Tầng 1

- **Mức hưởng** = `(1,5 × T1 + 2 × T2) × MBQTL`
  - T1 = số năm đóng **trước 2014**; T2 = số năm đóng **từ 2014**; tháng lẻ của T1 chuyển sang T2.
  - **Tháng lẻ** (Đ.5 k.6 — nguyên tắc chung, không nằm trong Đ.70): 1–6 tháng = ½ năm; 7–11 tháng = 1 năm.
  - MBQTL = bình quân tiền lương đóng **đã nhân hệ số trượt giá** (bảng dưới; công thức hệ số = NĐ 158/2025 Đ.16 k.1a).
  - Đóng chưa đủ 1 năm: bằng số đã đóng, tối đa 2 tháng MBQTL (Đ.70 k.3c).
- **Điều kiện rút** tách theo mốc tham gia trước/từ **01/07/2025** (Đ.70 k.1): diện "sau 12 tháng không thuộc đối tượng" chỉ cho người có thời gian đóng trước ngày Luật có hiệu lực; người bắt đầu từ 01/07/2025 chỉ còn các diện đặc biệt (đủ tuổi hưu chưa đủ 15 năm, định cư NN, bệnh hiểm nghèo, suy giảm ≥81%…).

#### Bảng hệ số điều chỉnh tiền lương đã đóng BHXH — năm 2026 (✅ Tầng 1)

Nguồn: **CV 340/BHXH-CSXH ngày 03/02/2026**; căn cứ NĐ 158/2025/NĐ-CP Đ.16 k1a, NĐ 159/2025/NĐ-CP Đ.10 k2. Áp cho BHXH bắt buộc (cột thu nhập tự nguyện giống từ 2008).

| Năm | Hệ số | Năm | Hệ số | Năm | Hệ số | Năm | Hệ số |
|-----|------|-----|------|-----|------|-----|------|
| Trước 1995 | 5,81 | 2003 | 3,81 | 2011 | 1,65 | 2019 | 1,20 |
| 1995 | 4,91 | 2004 | 3,54 | 2012 | 1,51 | 2020 | 1,16 |
| 1996 | 4,65 | 2005 | 3,27 | 2013 | 1,42 | 2021 | 1,14 |
| 1997 | 4,50 | 2006 | 3,05 | 2014 | 1,36 | 2022 | 1,11 |
| 1998 | 4,18 | 2007 | 2,81 | 2015 | 1,36 | 2023 | 1,07 |
| 1999 | 4,01 | 2008 | 2,29 | 2016 | 1,32 | 2024 | 1,03 |
| 2000 | 4,07 | 2009 | 2,14 | 2017 | 1,28 | 2025 | 1,00 |
| 2001 | 4,09 | 2010 | 1,96 | 2018 | 1,23 | 2026 | 1,00 |
| 2002 | 3,94 | | | | | | |

Ruleset: bảng này là tham số **theo năm công bố** (mỗi đầu năm BHXH VN ra công văn mới) — thiết kế `adjustment_table_year` riêng, không gắn vào ruleset thuế.
- **Điều kiện**:
  - Tham gia **trước 01/07/2025**: được rút sau 12 tháng không tiếp tục đóng và chưa đủ 20 năm; hoặc các trường hợp đặc biệt.
  - Tham gia **từ 01/07/2025**: chỉ trường hợp đặc biệt (đủ tuổi hưu thiếu năm đóng, định cư nước ngoài, bệnh hiểm nghèo, suy giảm LĐ ≥81%, khuyết tật đặc biệt nặng).

```
lump_sum = (1.5 * years_pre_2014 + 2.0 * years_from_2014) * adjusted_avg_salary
```

### TC-LUMPSUM-01 (đã khóa công thức; hệ số trượt giá nhập tay/ruleset)

T1 = 4 năm; T2 = 10 năm; MBQTL (đã trượt giá) = 12.000.000  
= (1,5×4 + 2×10) × 12e6 = 26 × 12e6 = **312.000.000**.

### 5.2. Lương hưu (ĐÃ KHÓA tỷ lệ — Điều 66 Luật BHXH 2024, từ 01/07/2025)

- Đủ điều kiện từ **15 năm** đóng + đủ tuổi nghỉ hưu.
- **Tỷ lệ hưởng** (trên mức bình quân tiền lương làm căn cứ đóng, Điều 72):
  - **Nữ**: 45% cho 15 năm đầu; **+2%/năm** tiếp theo; tối đa **75%** (đạt tại 30 năm).
  - **Nam ≥ 20 năm**: 45% cho 20 năm đầu; **+2%/năm** tiếp theo; tối đa **75%** (đạt tại 35 năm).
  - **Nam 15 – dưới 20 năm**: 40% cho 15 năm đầu; **+1%/năm** tiếp theo (19 năm = 44%).

```
rate_female = min(0.45 + 0.02 * max(0, years - 15), 0.75)
rate_male   = years >= 20 ? min(0.45 + 0.02 * (years - 20), 0.75)
                          : 0.40 + 0.01 * (years - 15)      # 15 <= years < 20
pension_monthly = rate * avg_salary_adjusted
```

- MBQTL tính theo giai đoạn tham gia + hệ số trượt giá → phức tạp; V2 cho nhập MBQTL giả định và hiện **khoảng ước tính**.

### TC-PENSION-01 (đã khóa tỷ lệ)

Nữ, 25 năm đóng, MBQTL giả định 10.000.000:  
rate = 45% + 10×2% = 65% → lương hưu ước **6.500.000/tháng**.

### TC-PENSION-02 — nam 15–<20 năm

Nam, 17 năm, MBQTL 10.000.000: rate = 40% + 2×1% = 42% → **4.200.000/tháng**.

**Product rule**: luôn cảnh báo “quyết định rút không thể đảo ngược; xác nhận với cơ quan BHXH / VssID”.

## 6. Trạng thái khóa số liệu

| Mục | Trạng thái | Nguồn |
|-----|-----------|-------|
| OT | Khóa (3 hệ số ngày) | Đ.98 BLLĐ 2019 |
| Thôi việc / mất việc | **Khóa** | Đ.46–47 BLLĐ 2019 |
| Thất nghiệp | **Khóa** | Đ.38–39 Luật Việc làm 2025 |
| Thai sản | **Khóa** (khung chính) | Đ.53/58/59 Luật BHXH 2024; NĐ 161/2026; NĐ 168/2026 |
| Ốm đau | Khung (75%) — chi tiết V2 | Luật BHXH 2024 |
| BHXH một lần | **Khóa** công thức | Đ.70 Luật BHXH 2024 |
| Lương hưu | **Khóa** tỷ lệ nam/nữ (MBQTL vẫn là ước tính người dùng nhập) | Đ.66 Luật BHXH 2024 |
