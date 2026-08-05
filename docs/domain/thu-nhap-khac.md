# Thu nhập khác (ngoài tiền lương HĐLĐ)

**Cập nhật**: 2026-08-05  
**Tầng xác minh**: ✅ **Tầng 1** — Luật 109/2025; Luật GTGT 2024 Đ.12.2; NQ 198/2025 Đ.10.6; NĐ 68/2026 (bản công báo); NĐ 141/2026; NĐ 253/2026 (Đ.50/51/54/69/70); TT 50/2026[...]
**Nguồn khung**: NQ 198/2025/QH15 (bỏ thuế khoán); NĐ 68/2026/NĐ-CP + NĐ 141/2026/NĐ-CP (hộ KD, cho thuê — ngưỡng 1 tỷ); NĐ 253/2026/NĐ-CP (vãng lai, chứng khoán, ESOP); [...]

## 1. Thu nhập vãng lai / không HĐLĐ hoặc HĐ < 3 tháng (ĐÃ KHÓA — NĐ 253/2026) ✅ Tầng 1

- Khấu trừ tại nguồn **10%** với mỗi lần chi trả **từ 5.000.000 đ trở lên** (Đ.50 k.2).
- **Miễn quyết toán phần vãng lai** nếu: thu nhập vãng lai bình quân tháng trong năm **≤ 15.000.000 đ** và đã khấu trừ 10% tại nguồn (Đ.51 k.1b).
- **Hiệu lực / chuyển tiếp (Đ.69.1.a — đã chốt)**: nghị định hiệu lực 01/07/2026, nhưng quy định về thu nhập KD / TLTC của cá nhân cư trú (gồm ngưỡng 5tr[...]
- Nếu tổng thu nhập cả năm dưới ngưỡng chịu thuế: có thể làm cam kết để tạm không khấu trừ — điều kiện chỉ có thu nhập một nơi và đã đăng ký[...]

```
tax_withholding = gross_payment >= casual_threshold ? gross_payment * 0.10 : 0
# casual_threshold kỳ 2026 = 5.000.000 (áp cả năm theo Đ.69.1.a); ruleset ≤2025 = 2.000.000
```

### TC-CASUAL-01 (đã khóa)

Chi trả 10.000.000 (≥ ngưỡng) → khấu trừ 1.000.000; thực nhận 9.000.000.

### TC-CASUAL-02 — dưới ngưỡng mới

Chi trả 4.000.000 trong kỳ 2026 (< 5tr) → **không khấu trừ** tại nguồn; vẫn thuộc thu nhập chịu thuế khi quyết toán nếu thuộc diện.

### TC-CASUAL-03 — miễn quyết toán phần vãng lai

Vãng lai cả năm 120.000.000 (bình quân 10tr/tháng ≤ 15tr), đã khấu trừ 10% đủ → phần này **không bắt buộc quyết toán lại**.

## 2. Cho thuê bất động sản (ĐÃ KHÓA — NĐ 68 + 141 + TT 50) ✅ Tầng 1

- **Doanh thu ≤ 1 tỷ đ/năm**: **miễn thuế GTGT + TNCN** (NĐ 141 Đ.1 nâng ngưỡng từ 500tr trong NĐ 68), nhưng **vẫn phải thông báo doanh thu + số tài khoản/ví**.
  - Mẫu **01/BĐS** (TT 50): hạn theo NĐ 68 Đ.8 — chậm nhất **31/01** năm sau; cho thuê khai 2 lần/năm: **31/07** năm tính thuế và **31/01** năm sau.
  - Mốc **31/07/2026** đích danh trong TT 50 Đ.4.2 dành cho mẫu **01/BK-STK** (thông báo số TK / khai bù quý I/2026) — không phải hạn mẫu 01/BĐS.
- **Doanh thu > 1 tỷ đ/năm**:
  - Thuế GTGT = **5% × toàn bộ doanh thu** (Luật GTGT Đ.12.2)
  - Thuế TNCN = **5% × (doanh thu − ngưỡng 1 tỷ)** (mẫu 01/BĐS: `[13] = ([10] − [11]) × 5%`)
  - Cơ chế 5%/5% **không nằm trong NĐ 141** (chỉ đổi cụm từ ngưỡng); xác nhận qua NĐ 68 + Luật GTGT + mẫu TT 50.

```
if revenue_year <= 1_000_000_000:
    vat = 0; pit = 0   # vẫn nhắc nghĩa vụ thông báo
else:
    vat = revenue_year * 0.05
    pit = (revenue_year - 1_000_000_000) * 0.05
```

### TC-RENT-01 (SỬA theo luật 2026 — thay test case cũ)

Cho thuê 20.000.000/tháng → 240.000.000/năm ≤ 1 tỷ → **thuế = 0**; UI nhắc "vẫn phải thông báo doanh thu (01/BĐS)".

### TC-RENT-02 — vượt ngưỡng

Doanh thu 1.500.000.000/năm:  
GTGT = 1,5 tỷ × 5% = 75.000.000; TNCN = 0,5 tỷ × 5% = 25.000.000 → tổng **100.000.000**.

### TC-RENT-03 — biên đúng 1 tỷ

Doanh thu 1.000.000.000 → thuế = 0 (từ 1 tỷ trở xuống là miễn).

## 3. Hộ kinh doanh (ĐÃ KHÓA khung — NQ 198/2025; NĐ 68/2026 + 141/2026)

- **Bỏ thuế khoán từ 01/01/2026** — tự khai, tự nộp.
- **Ngưỡng miễn GTGT + TNCN: 1 tỷ đ/năm** (NĐ 141/2026 nâng từ 500tr trong NĐ 68/2026, áp từ 01/01/2026). Dưới ngưỡng vẫn **kê khai/thông báo doanh thu** (NĐ 68 Đ.8: [...]
- Biểu tỷ lệ ngành: NĐ 68 **dẫn chiếu** Luật GTGT Đ.12.2 (GTGT) và Luật 109 Đ.7 / Phụ lục NĐ 253 (TNCN) — không ghi số % trong chính NĐ 68. Doanh thu từng ngành: [...]
- **Trên 1 tỷ đến 3 tỷ** — chọn một trong hai:
  - **Theo doanh thu**: GTGT + TNCN theo biểu tỷ lệ ngành (bảng dưới); hoặc
  - **Theo thu nhập tính thuế**: (doanh thu − chi phí) × 15%.
- **Trên 3 tỷ**: theo thu nhập tính thuế, 17% (3–50 tỷ) hoặc 20% (>50 tỷ); sổ sách + hóa đơn đầy đủ.

### Biểu tỷ lệ ngành (ĐÃ KHÓA — Luật GTGT 2024 Đ.12 k2; Luật TNCN 109/2025 Đ.7 k3; NĐ 68/2026 Đ.3–4)

| Nhóm ngành | GTGT | TNCN |
|------------|------|------|
| Phân phối, cung cấp hàng hóa | 1% | 0,5% |
| Dịch vụ, xây dựng không bao thầu NVL | 5% | 2% |
| — riêng cho thuê tài sản, đại lý bảo hiểm/xổ số/bán hàng đa cấp | 5% | 5% |
| Sản xuất, vận tải, dịch vụ gắn hàng hóa, xây dựng bao thầu NVL | 3% | 1,5% |
| Hoạt động kinh doanh khác | 2% | 1% |

**ĐÃ CHỐT theo bản gốc — điểm a khoản 3 Điều 7 Luật 109/2025**: doanh thu tính thuế TNCN theo tỷ lệ = **phần doanh thu VƯỢT ngưỡng** miễn thuế (không phải[...]

```
if revenue_year <= threshold: tax = 0                     # vẫn thông báo doanh thu
elif revenue_year <= 3e9:
    vat = revenue_year * vat_rate                          # toàn bộ doanh thu
    pit = (revenue_year - threshold) * pit_rate            # phần vượt — Đ.7 k3a Luật 109/2025
    # hoặc chọn: pit = (revenue - cost) * 0.15              # Đ.7 k2b
else: pit = (revenue - cost) * (revenue_year <= 50e9 ? 0.17 : 0.20)
# threshold: 500tr theo Luật, đã điều chỉnh 1 tỷ theo NĐ 141/2026 (cơ chế Đ.7 k1 giao CP trình UBTVQH điều chỉnh)
```

### TC-HKD-01 — dưới ngưỡng

Doanh thu 800.000.000/năm ≤ 1 tỷ → **thuế = 0**; UI nhắc nghĩa vụ kê khai doanh thu.

### TC-HKD-02 — bán tạp hóa 1,5 tỷ (theo doanh thu) — ĐÃ KHÓA SỐ

Nhóm phân phối hàng hóa, ngưỡng 1 tỷ:  
GTGT = 1,5 tỷ × 1% = **15.000.000**  
TNCN = (1,5 tỷ − 1 tỷ) × 0,5% = **2.500.000** (phần vượt — Đ.7 k3a Luật 109/2025 bản gốc)  
→ tổng 17.500.000, breakdown tách hai dòng + gợi ý so sánh phương pháp (doanh thu − chi phí) × 15%.

## 4. Chứng khoán (ĐÃ KHÓA — NĐ 253/2026, từ 01/07/2026)

- Thuế TNCN chuyển nhượng chứng khoán: **0,1% × giá chuyển nhượng từng lần** (thống nhất, không còn phương án 20% trên lãi).

```
tax = sell_value * 0.001
```

### TC-SEC-01 (đã khóa)

Bán 100.000.000 → thuế **100.000**.

## 5. ESOP / cổ phiếu thưởng (ĐÃ KHÓA — điểm a khoản 3 Điều 50 NĐ 253/2026, từ 01/07/2026)

Mâu thuẫn nguồn đã giải quyết bằng nguyên văn nghị định (đăng trên xaydungchinhsach.chinhphu.vn; khớp phân tích KPMG, RSM, HSC) — **cách đọc A đúng**, khi chuyển nhượng chứng khoán từ ESOP vẫn tính 0,1% theo Đ.54.

1. **Thuế TNCN từ tiền lương, tiền công** trên thu nhập chịu thuế của phần cổ phiếu thưởng/ESOP:
   - Thu nhập chịu thuế = số tiền chi cho NLĐ ghi trên **sổ sách kế toán** của tổ chức trả thu nhập tại thời điểm thưởng/phát hành.
   - Fallback nếu không xác định được: số cổ phiếu × **mệnh giá** − số tiền NLĐ đã bỏ ra mua (ESOP); chênh lệch âm → không phát sinh thuế. (Cổ phiếu [...]
   - Công ty chứng khoán / ngân hàng lưu ký **khấu trừ 10%** tại nguồn; cá nhân **tổng hợp vào thu nhập TLTC để quyết toán năm** (biểu lũy tiến).
   - Bán cổ phiếu cùng loại: tính nghĩa vụ TLTC **cho tới khi hết số cổ phiếu thưởng/ESOP** (bán ra được coi là bán phần ESOP trước).
2. **Thuế chuyển nhượng chứng khoán**: 0,1% × giá chuyển nhượng (Điều 54 NĐ 253/2026).

```
# tại thời điểm bán
tlcc_taxable = book_cost_at_grant  # fallback: shares × par_value − amount_paid (floor 0)
withholding  = tlcc_taxable * 0.10          # khấu trừ tại lưu ký; quyết toán lũy tiến cuối năm
transfer_tax = sell_value * 0.001
```

### TC-ESOP-01 (đã khóa cơ chế)

Nhận 10.000 CP ESOP giá ưu đãi 0đ, chi phí ghi sổ 100.000.000; sau 01/07/2026 bán toàn bộ giá 300.000.000:  
Khấu trừ TLTC = 100e6 × 10% = 10.000.000 (quyết toán năm theo lũy tiến trên 100e6 gộp vào TLTC);  
thuế chuyển nhượng = 300e6 × 0,1% = 300.000.  
Breakdown MUST tách rõ hai dòng và ghi chú phần TLTC còn quyết toán lại cuối năm.

## 6. Nguyên tắc product

- Mỗi loại thu nhập = ruleset riêng (`income_type`, tham số, `effective_from`).
- Ngưỡng vãng lai 5tr và miễn QT 15tr áp **cả kỳ tính thuế 2026** (NĐ 253 Đ.69.1.a) — không tách H1/H2 cho hai tham số này. CK/ESOP vẫn gắn thời điểm chuyển nh[...]
- TT 87/2026 chỉ quy định NPT (thu nhập ≤3tr/tháng) + CK phái sinh 0,1% — **không** hướng dẫn vãng lai/ESOP.
- Không gộp mặc định vào gross lương HĐLĐ; module quyết toán mới gộp khi user chủ động.

## 7. Trạng thái khóa

| Mục | Trạng thái | Nguồn |
|-----|-----------|-------|
| Vãng lai 10%, ngưỡng 5tr, miễn QT ≤15tr/tháng | **Khóa** | NĐ 253/2026 |
| Cho thuê: ngưỡng 1 tỷ, 5%/5% phần vượt | **Khóa** | NĐ 141/2026; TT 50/2026 |
| Hộ KD: ngưỡng 1 tỷ, biểu tỷ lệ ngành, TNCN trên **phần vượt ngưỡng**, lịch khai | **Khóa — Tầng 1** cho cơ chế (Đ.7 Luật 109/2025 bản gốc) | Luật 109/2025 Đ.7 k3a |
| Chứng khoán 0,1%/lần | **Khóa — Tầng 1** (Đ.13 k2 Luật 109/2025 bản gốc) | Luật 109/2025 Đ.13 k2; NĐ 253/2026 (Đ.54) |
| ESOP: TLTC (10% khấu trừ, quyết toán) + 0,1% khi bán | **Khóa** cơ chế | NĐ 253/2026 (Đ.50 k3a) |
