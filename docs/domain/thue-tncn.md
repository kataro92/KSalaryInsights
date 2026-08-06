# Thuế thu nhập cá nhân (TNCN). tiền lương, tiền công

**Trạng thái**: **Tầng 1**. đối chiếu văn bản gốc đợt 1+2: Luật 109/2025 + NQ 110/2025 (biểu 5 bậc, GTGC 15,5/6,2); **Luật TNCN 2007 VBHN 15** (biểu 7 bậc Đ.22); **NQ 954/2020** (GTGC 11/4,4); **CV 1296/CT-NVT** (quyết toán 2025 dùng luật cũ). 
**Cập nhật**: 2026-07-31 
**Phạm vi**: Cá nhân cư trú, thu nhập từ tiền lương tiền công. Thu nhập khác xem [thu-nhap-khac.md](./thu-nhap-khac.md).

> Disclaimer: Tài liệu hỗ trợ thiết kế sản phẩm, không thay thế tư vấn thuế chính thức. Luôn đối chiếu văn bản gốc khi luật đổi.

## 1. Khái niệm

Luồng tính thuế tháng (khấu trừ tại nguồn điển hình). **đúng thuật ngữ pháp lý** (Luật TNCN Đ.7-11; khớp [glossary.md](./glossary.md)):

```
Gross
 − Phụ cấp / trợ cấp được miễn thuế (nếu có)
 = Thu nhập chịu thuế
 − Khoản giảm trừ: BH bắt buộc phần NLĐ (BHXH + BHYT + BHTN, có trần)
 + GTGC bản thân + GTGC người phụ thuộc
 (+ từ thiện / nhân thọ / … nếu có)
 = Thu nhập tính thuế (TNTT)
 → Áp dụng biểu lũy tiến từng phần
 = Thuế TNCN tháng
Net ≈ Gross − BH_NLĐ − Thuế TNCN (− đoàn phí nếu có)
```

> **Chú thích MVP / test case**: Khi không có phụ cấp miễn thuế, các TC bên dưới gọi tắt cột "TN chịu thuế" = Gross − BH_NLĐ (tức thu nhập chịu thuế sau khi đã trừ BH. bước trung gian trước GTGC). Đây là **nhãn bảng tính đơn giản hóa** để khớp số học; khi implement breakdown UI MUST tách đúng: chịu thuế (sau miễn) → giảm trừ BH + GTGC → TNTT.

## 2. Tham số theo giai đoạn

### 2.1. Kỳ tính thuế 2025 (và quyết toán 2025 thực hiện năm 2026)

| Tham số | Giá trị | Nguồn |
|---------|---------|-------|
| GTGC bản thân | 11.000.000 đ/tháng (132.000.000 đ/năm) | NQ 954/2020/UBTVQH14 |
| GTGC mỗi NPT | 4.400.000 đ/tháng | NQ 954/2020/UBTVQH14 |
| Biểu thuế | 7 bậc | Luật TNCN 2007 (sửa đổi) |

**Biểu 7 bậc (tháng)**:

| Bậc | TNTT/tháng | Thuế suất |
|-----|------------|-----------|
| 1 | Đến 5.000.000 | 5% |
| 2 | Trên 5 → 10 triệu | 10% |
| 3 | Trên 10 → 18 triệu | 15% |
| 4 | Trên 18 → 32 triệu | 20% |
| 5 | Trên 32 → 52 triệu | 25% |
| 6 | Trên 52 → 80 triệu | 30% |
| 7 | Trên 80 triệu | 35% |

### 2.2. Kỳ tính thuế 2026 trở đi

| Tham số | Giá trị | Nguồn |
|---------|---------|-------|
| GTGC bản thân | 15.500.000 đ/tháng (186.000.000 đ/năm) | NQ 110/2025/UBTVQH15; Luật 109/2025/QH15 |
| GTGC mỗi NPT | 6.200.000 đ/tháng | như trên |
| Biểu thuế | 5 bậc | Luật 109/2025/QH15 |
| Hiệu lực lương/công | Áp dụng từ kỳ tính thuế năm 2026 (từ 01/01/2026) | Luật 109/2025/QH15 |
| Hiệu lực luật chung | Nhiều quy định khác từ 01/07/2026 | Luật 109/2025/QH15 |

**Biểu 5 bậc (tháng)**:

| Bậc | TNTT/tháng | Thuế suất |
|-----|------------|-----------|
| 1 | Đến 10.000.000 | 5% |
| 2 | Trên 10 → 30 triệu | 10% |
| 3 | Trên 30 → 60 triệu | 20% |
| 4 | Trên 60 → 100 triệu | 30% |
| 5 | Trên 100 triệu | 35% |

## 3. Công thức lũy tiến từng phần

Với các ngưỡng `b0=0 < b1 < b2 < .` và thuế suất `r1, r2, .`:

```
tax = 0
remaining = TNTT
for i in bậc:
 width = bi − b(i-1) # hoặc +∞ ở bậc cuối
 slice = min(remaining, width)
 if slice <= 0: break
 tax += slice * ri
 remaining -= slice
```

## 4. Quyết toán

- Quyết toán kỳ năm Y thường nộp đầu năm Y+1.
- **Quan trọng**: Quyết toán thu nhập năm 2025 vẫn dùng GTGC 11/4,4 + biểu 7 bậc, dù thực hiện vào năm 2026: **đã xác minh** theo Công văn 1296/CT-NVT (Cục Thuế).
- Thu nhập năm 2026 dùng GTGC mới + biểu 5 bậc. **đã xác minh** căn cứ khoản 2 Điều 29 Luật 109/2025/QH15 (quy định lương/công cá nhân cư trú áp từ kỳ tính thuế 2026, dù luật hiệu lực chung 01/07/2026). Đây là điểm nhiều tool đối thủ sai. không chia biểu thuế giữa hai nửa năm 2026.
- Hệ thống MUST chọn ruleset theo **kỳ tính thuế / năm phát sinh thu nhập**, không theo ngày mở app.

### 4.1. Công thức năm

```
TN chịu thuế năm = Σ (gross tháng − BH NLĐ tháng, các tháng có lương) + thu nhập vãng lai gộp (nếu quyết toán)
GTGC năm = personal_relief × 12 + NPT × dependent_relief × 12 # đủ 12 tháng kể cả năm làm không trọn
TNTT năm = TN chịu thuế năm − GTGC năm − giảm trừ khác (từ thiện…. ngoài phạm vi bản đầu)
Thuế năm = lũy tiến từng phần trên biểu NĂM (ngưỡng = ngưỡng tháng × 12, cùng thuế suất)
Chênh lệch = Thuế năm − tổng thuế đã khấu trừ (>0 nộp thêm; <0 ước hoàn)
```

**Biểu năm** = ngưỡng tháng × 12: 7 bậc 2025 → 60/120/216/384/624/960 triệu; 5 bậc 2026 → 120/360/720/1.200 triệu.

- Vãng lai từ kỳ tính thuế 2026 (NĐ 253/2026 Đ.69.1.a): bình quân ≤ 15tr/tháng + đã khấu trừ 10% → **không bắt buộc** quyết toán phần đó, nhưng **được tự nguyện gộp** nếu có lợi (thường có lợi khi TNTT năm nằm ở bậc 5%. xem TC-QT-2026-02). Áp **cả kỳ 2026**, không chỉ thu nhập từ 01/07.

## 5. Edge cases (phiên bản đầu)

- TNTT ≤ 0 → thuế = 0.
- Người phụ thuộc: mỗi NPT chỉ giảm trừ một lần cho một NNT (Đ.10 k3 Luật 109/2025: nguyên văn xác nhận).
- **Giảm trừ mới trong Luật 109/2025 (phát hiện khi đối chiếu bản gốc, chưa mô hình hóa)**:
 - Đ.8 k2: được trừ cả bảo hiểm trách nhiệm nghề nghiệp bắt buộc, **hưu trí bổ sung/hưu trí tự nguyện, bảo hiểm nhân thọ** (không vượt mức Chính phủ quy định).
 - Đ.11 k2: **chi y tế, giáo dục - đào tạo** của người nộp thuế và người phụ thuộc được giảm trừ theo mức Chính phủ quy định. hoàn toàn mới so với luật cũ, chờ nghị định hướng dẫn mức trần → ghi nợ backlog (ảnh hưởng spec 002 khi có NĐ).
 - Đ.11 k1: giảm trừ từ thiện, nhân đạo (như luật cũ).
- Cá nhân không cư trú: ngoài phạm vi MVP (thuế suất khác).

## 6. Test case tính tay

### TC-TNCN-2025-01: Gross 30tr, 0 NPT, vùng I, dưới trần BH

**Ruleset**: 2025 
**Input**: Gross = 30.000.000; NPT = 0; giả sử căn cứ BH = 30.000.000 (dưới trần).

| Bước | Tính | Kết quả |
|------|------|---------|
| BHXH 8% | 30e6 × 0,08 | 2.400.000 |
| BHYT 1,5% | 30e6 × 0,015 | 450.000 |
| BHTN 1% | 30e6 × 0,01 | 300.000 |
| Tổng BH NLĐ | | 3.150.000 |
| TN chịu thuế | 30e6 − 3.150.000 | 26.850.000 |
| GTGC | 11.000.000 | 11.000.000 |
| TNTT | 26.850.000 − 11.000.000 | 15.850.000 |
| Thuế bậc 1 | 5e6 × 5% | 250.000 |
| Thuế bậc 2 | 5e6 × 10% | 500.000 |
| Thuế bậc 3 | 5.850.000 × 15% | 877.500 |
| **Thuế** | | **1.627.500** |
| **Net** | 30e6 − 3.150.000 − 1.627.500 | **25.222.500** |

### TC-TNCN-2026-01: Cùng gross 30tr, 0 NPT, luật 2026

**Input**: như trên, ruleset 2026 (GTGC 15,5tr; biểu 5 bậc).

| Bước | Kết quả |
|------|---------|
| BH NLĐ (cùng giả định) | 3.150.000 |
| TN chịu thuế | 26.850.000 |
| GTGC | 15.500.000 |
| TNTT | 11.350.000 |
| Thuế bậc 1: 10e6 × 5% | 500.000 |
| Thuế bậc 2: 1.350.000 × 10% | 135.000 |
| **Thuế** | **635.000** |
| **Net** | **26.065.000** |

So với 2025: thuế giảm 1.627.500 − 635.000 = **992.500**; net tăng tương ứng.

### TC-TNCN-2026-02: Gross 30tr, 2 NPT

GTGC = 15.500.000 + 2 × 6.200.000 = 27.900.000 
TNTT = 26.850.000 − 27.900.000 < 0 → **thuế = 0** 
Net = 30.000.000 − 3.150.000 = **26.850.000**

### TC-TNCN-EDGE-01: TNTT = 0 biên

Gross đủ nhỏ sau BH + GTGC → thuế 0; net = gross − BH.

### TC-QT-2025-01: quyết toán năm 2025, làm 10 tháng → ước hoàn

**Ruleset**: 2025 (biểu 7 bậc năm; GTGC năm 132tr).
**Input**: gross 30tr/tháng, làm 10 tháng (2 tháng không lương); BH = gross; 0 NPT; đã khấu trừ 1.627.500 × 10 = 16.275.000 (theo TC-TNCN-2025-01).

| Bước | Tính | Kết quả |
|------|------|---------|
| TN chịu thuế năm | (30e6 − 3.150.000) × 10 | 268.500.000 |
| GTGC năm | 11e6 × 12 (đủ 12 tháng dù làm 10) | 132.000.000 |
| TNTT năm | | 136.500.000 |
| Thuế bậc 1 | 60e6 × 5% | 3.000.000 |
| Thuế bậc 2 | 60e6 × 10% | 6.000.000 |
| Thuế bậc 3 | 16.500.000 × 15% | 2.475.000 |
| **Thuế năm** | | **11.475.000** |
| Đã khấu trừ | | 16.275.000 |
| **Ước hoàn** | 16.275.000 − 11.475.000 | **4.800.000** |

### TC-QT-2026-01: lương + vãng lai vượt ngưỡng miễn → nộp thêm

**Ruleset**: 2026 (biểu 5 bậc năm; GTGC năm 186tr).
**Input**: gross 30tr × 12 (khấu trừ 635.000 × 12 = 7.620.000 theo TC-TNCN-2026-01); vãng lai 240tr/năm (bình quân 20tr/tháng > 15tr → **không được miễn**, bắt buộc gộp), đã khấu trừ 10% = 24.000.000.

| Bước | Tính | Kết quả |
|------|------|---------|
| TN chịu thuế lương | 26.850.000 × 12 | 322.200.000 |
| + Vãng lai | | 240.000.000 |
| TN chịu thuế năm | | 562.200.000 |
| GTGC năm | | 186.000.000 |
| TNTT năm | | 376.200.000 |
| Thuế bậc 1 | 120e6 × 5% | 6.000.000 |
| Thuế bậc 2 | 240e6 × 10% | 24.000.000 |
| Thuế bậc 3 | 16.200.000 × 20% | 3.240.000 |
| **Thuế năm** | | **33.240.000** |
| Đã khấu trừ | 7.620.000 + 24.000.000 | 31.620.000 |
| **Ước nộp thêm** | | **1.620.000** |

### TC-QT-2026-02: vãng lai được miễn nhưng gộp tự nguyện CÓ LỢI

**Input**: gross 20tr × 12; BH = gross (BH NLĐ 2.100.000/tháng); 0 NPT; vãng lai 60tr/năm (bình quân 5tr/tháng ≤ 15tr, đã khấu trừ 10% = 6.000.000 → **được miễn quyết toán phần này**).

Khấu trừ lương hằng tháng: TNTT tháng = 20e6 − 2,1e6 − 15,5e6 = 2.400.000 → thuế 120.000/tháng → năm 1.440.000.

- **Phương án 1: không gộp** (mặc định luật cho phép): thuế năm phần lương = (214,8e6 − 186e6) × 5% = 1.440.000 = đã khấu trừ → **chênh 0**.
- **Phương án 2: gộp tự nguyện**: TN chịu thuế năm = 214,8e6 + 60e6 = 274,8e6 → TNTT = 88,8e6 (trọn bậc 5%) → thuế năm = 4.440.000; đã khấu trừ 1.440.000 + 6.000.000 = 7.440.000 → **ước hoàn 3.000.000**.

→ App MUST trình bày cả hai phương án khi phần vãng lai đủ điều kiện miễn: gộp có lợi khi thuế suất biên năm (5%) thấp hơn mức khấu trừ 10%. (Kiểm chứng chéo cho FR-007 spec 004 và TC-CASUAL-03.)

---

**Liên kết**: [bhxh-bhyt-bhtn.md](./bhxh-bhyt-bhtn.md), [legal-changelog.md](./legal-changelog.md)
