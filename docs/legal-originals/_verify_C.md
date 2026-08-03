# Báo cáo xác minh văn bản pháp lý — Phiên C

Ngày xác minh: 31/07/2026. Phương pháp: toàn bộ 7 file là bản scan không có text layer; đã render trang PNG (pdftoppm 150 dpi) và đọc trực tiếp bằng thị giác các trang chứa điều khoản liên quan. Trích dẫn ghi kèm số trang PDF.

---

## 1. `253m-ndcp.signed.pdf` — Nghị định 253/2026/NĐ-CP (ngày 30/6/2026, ký: PTT Nguyễn Văn Thắng)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| ESOP/cổ phiếu thưởng: chưa tính thuế khi nhận, khi chuyển nhượng chịu thuế TLTC | Đ.50 khoản 3 điểm a (tr.36) | "Trường hợp người lao động được thưởng bằng cổ phiếu hoặc mua cổ phiếu với giá ưu đãi theo kế hoạch phát hành cổ phiếu theo chương trình lựa chọn cho người lao động (ESOP) thì chưa phải tính vào thu nhập từ tiền lương, tiền công khi nhận cổ phiếu. Khi nhận được thu nhập từ chuyển nhượng số cổ phiếu này, cá nhân phải nộp thuế thu nhập cá nhân đối với thu nhập từ tiền lương, tiền công; đồng thời, khi chuyển nhượng cá nhân phải thực hiện nộp thuế đối với thu nhập từ chuyển nhượng chứng khoán quy định tại Điều 54 của Nghị định này." | KHỚP |
| Thu nhập chịu thuế = số chi ghi trên sổ sách kế toán tại thời điểm thưởng/phát hành | Đ.50 khoản 3 điểm a (tr.36–37) | "Căn cứ xác định thu nhập chịu thuế của cổ phiếu ESOP quy định tại điểm này là số tiền chi cho người lao động ghi trên sổ sách kế toán của tổ chức trả thu nhập tại thời điểm phát hành cổ phiếu ESOP." (cổ phiếu thưởng: "…tại thời điểm thưởng" — tr.36) | KHỚP |
| Fallback = số CP × mệnh giá − tiền đã trả | Đ.50 khoản 3 điểm a (tr.37) | "Trường hợp không xác định được số tiền chi cho người lao động ghi trên sổ sách kế toán… thì thu nhập chịu thuế được xác định bằng số lượng cổ phiếu thực nhận nhân (x) với mệnh giá trừ (-) đi số tiền người lao động đã bỏ ra để mua cổ phiếu ESOP, nếu phát sinh chênh lệch âm thì cá nhân không phải nộp thuế thu nhập cá nhân từ tiền lương, tiền công đối với cổ phiếu ESOP." | KHỚP (riêng cổ phiếu thưởng fallback = số CP × mệnh giá, không có phần trừ; xem Phát hiện mới) |
| Công ty CK/ngân hàng lưu ký khấu trừ 10% | Đ.50 khoản 3 điểm a (tr.37) | "Công ty chứng khoán, ngân hàng thương mại nơi cá nhân mở tài khoản lưu ký theo dõi riêng số cổ phiếu được thưởng, cổ phiếu ESOP của cá nhân và thực hiện việc khấu trừ thuế và nộp số thuế đã khấu trừ theo tỷ lệ 10% tương ứng với thu nhập chịu thuế đối với cổ phiếu thưởng, cổ phiếu ESOP của cá nhân." | KHỚP |
| Tổng hợp vào TLTC quyết toán năm theo lũy tiến | Đ.50 khoản 3 điểm a (tr.37) | "Cá nhân tổng hợp thu nhập từ cổ phiếu được thưởng, cổ phiếu ESOP vào thu nhập chịu thuế từ tiền lương, tiền công trong năm tính thuế để thực hiện quyết toán thuế thu nhập cá nhân theo quy định." | KHỚP |
| Bán cùng loại tính phần ESOP trước | Đ.50 khoản 3 điểm a (tr.36) | "Trường hợp chuyển nhượng cổ phiếu cùng loại thì phải nộp thuế thu nhập cá nhân từ tiền lương, tiền công cho tới khi hết số cổ phiếu thưởng, cổ phiếu ESOP." | KHỚP |
| Đ.54 — thuế chuyển nhượng CK 0,1% × giá từng lần | Đ.54 khoản 1 (tr.42) | "Thuế thu nhập cá nhân đối với thu nhập từ chuyển nhượng chứng khoán quy định tại khoản 2 Điều 10 của Nghị định này được xác định bằng giá chuyển nhượng nhân (x) với thuế suất 0,1% theo từng lần chuyển nhượng." | KHỚP |
| Ngưỡng khấu trừ vãng lai 5.000.000 đ/lần | Đ.50 khoản 2 (tr.35–36) | "Tổ chức, cá nhân trả tiền lương, tiền công, tiền thù lao, tiền chi khác cho cá nhân cư trú không ký hợp đồng hoặc ký hợp đồng lao động dưới 03 tháng (bao gồm cả trường hợp trả tiền lương, thu nhập khác cho người lao động đã chấm dứt hợp đồng lao động) mà mức chi trả thu nhập từ 05 triệu đồng/lần trở lên thì phải khấu trừ thuế và nộp số thuế đã khấu trừ theo tỷ lệ 10% trên thu nhập trước khi trả thu nhập cho cá nhân." | KHỚP |
| Miễn quyết toán phần vãng lai: bình quân tháng ≤ 15 triệu, đã khấu trừ 10% | Đ.51 khoản 1 điểm b (tr.38) | "Cá nhân có thêm thu nhập ở nơi khác mà phần thu nhập này bình quân tháng trong năm không quá 15 triệu đồng đã được tổ chức, cá nhân chi trả thu nhập thực hiện khấu trừ thuế thu nhập cá nhân theo tỷ lệ 10% trên thu nhập quy định tại khoản 2 Điều 50 của Nghị định này thì không phải quyết toán thuế đối với phần thu nhập này." | KHỚP |

### Điều khoản hiệu lực & chuyển tiếp (trích NGUYÊN VĂN ĐẦY ĐỦ, tr.56–57)

**Điều 69. Hiệu lực thi hành**

> 1. Nghị định này có hiệu lực thi hành từ ngày 01 tháng 7 năm 2026. Việc xác định thời gian áp dụng trong một số trường hợp cụ thể như sau:
>
> a) Các quy định liên quan đến thu nhập từ kinh doanh, từ tiền lương, tiền công của cá nhân cư trú áp dụng từ kỳ tính thuế năm 2026;
>
> b) Quy định về tiền ăn giữa ca, tiền ăn trưa quy định tại điểm g khoản 2 Điều 8 của Nghị định này áp dụng từ ngày 01 tháng 7 năm 2026.
>
> 2. Nghị định này thay thế Nghị định số 65/2013/NĐ-CP ngày 27 tháng 6 năm 2013 của Chính phủ quy định chi tiết một số điều của Luật Thuế thu nhập cá nhân và Luật sửa đổi, bổ sung một số điều của Luật Thuế thu nhập cá nhân.
>
> 3. Nghị định này bãi bỏ các quy định tại:
>
> a) Điều 3 Nghị định số 91/2014/NĐ-CP ngày 01 tháng 10 năm 2014 của Chính phủ sửa đổi, bổ sung một số điều tại các Nghị định quy định về thuế;
>
> b) Điều 2 Nghị định số 12/2015/NĐ-CP ngày 12 tháng 02 năm 2015 của Chính phủ quy định chi tiết thi hành Luật sửa đổi, bổ sung một số điều tại các Luật về thuế và sửa đổi, bổ sung một số điều của các Nghị định về thuế.
>
> 4. Trường hợp các văn bản quy phạm pháp luật quy định viện dẫn tại Nghị định này được sửa đổi, bổ sung hoặc thay thế thì thực hiện theo văn bản được sửa đổi, bổ sung hoặc thay thế đó.

**Điều 70. Điều khoản chuyển tiếp**

> 1. Thời hạn đăng ký người phụ thuộc và thời hạn nộp hồ sơ chứng minh người phụ thuộc của kỳ tính thuế năm 2025 trở về trước thực hiện theo quy định tại các văn bản quy phạm pháp luật về thuế thu nhập cá nhân trước ngày Nghị định này có hiệu lực thi hành.
>
> 2. Các trường hợp đã kê khai, nộp thuế đối với thu nhập từ tiền lương, tiền công cho kỳ tính thuế năm 2026 trong thời gian kể từ ngày 01 tháng 01 năm 2026 đến trước ngày Nghị định này có hiệu lực thi hành theo quy định tại các văn bản quy phạm pháp luật về thuế thu nhập cá nhân áp dụng trước thời điểm Nghị định này có hiệu lực thi hành thì không phải nộp lại hồ sơ khai thuế tháng, quý mà thực hiện điều chỉnh vào hồ sơ khai quyết toán thuế năm 2026.

**Kết luận cho câu hỏi mở spec 004 FR-007:** Nghị định có hiệu lực 01/7/2026, nhưng theo Đ.69 khoản 1 điểm a, các quy định về thu nhập từ tiền lương, tiền công của cá nhân cư trú (bao gồm ngưỡng khấu trừ vãng lai 5 triệu đ/lần tại Đ.50.2 và quy tắc miễn quyết toán 15 triệu đ/tháng tại Đ.51.1.b) **áp dụng cho CẢ KỲ TÍNH THUẾ NĂM 2026** (từ 01/01/2026), không chỉ thu nhập phát sinh từ 01/7/2026. Đ.70.2 xử lý giai đoạn giao thời: phần đã kê khai/khấu trừ từ 01/01/2026 đến trước 01/7/2026 theo quy định cũ thì không phải nộp lại hồ sơ tháng/quý, mà điều chỉnh vào hồ sơ quyết toán năm 2026. Ngoại lệ duy nhất nêu rõ tại điểm b khoản 1 Đ.69: quy định tiền ăn giữa ca/ăn trưa chỉ áp dụng từ 01/7/2026.

---

## 2. `87-btc.signed.pdf` — Thông tư 87/2026/TT-BTC (ngày 30/6/2026, ký: Thứ trưởng Cao Anh Tuấn)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Phạm vi: hướng dẫn khấu trừ TNCN liên quan NĐ 253 | Đ.1 (tr.1) | "Thông tư này quy định về: 1. Mức thu nhập làm căn cứ xác định người phụ thuộc… 2. Hồ sơ xác định người phụ thuộc được giảm trừ gia cảnh theo quy định tại khoản 6 Điều 47 của Nghị định số 253/2026/NĐ-CP. 3. Thuế thu nhập cá nhân đối với thu nhập từ chuyển nhượng chứng khoán phái sinh quy định tại khoản 5 Điều 54 của Nghị định số 253/2026/NĐ-CP." | LỆCH so với kỳ vọng: phạm vi hẹp — chỉ người phụ thuộc + chứng khoán phái sinh, KHÔNG hướng dẫn khấu trừ vãng lai/ESOP |
| Quy định khấu trừ vãng lai/ESOP; chi tiết làm rõ ngưỡng 5tr hoặc miễn quyết toán 15tr | Toàn văn (6 trang) | Không có điều khoản nào về khấu trừ 10% vãng lai, ngưỡng 5 triệu, miễn quyết toán 15 triệu hay ESOP. | KHÔNG TÌM THẤY |
| (Nội dung thực tế đáng ghi nhận) Ngưỡng thu nhập người phụ thuộc | Đ.3 khoản 1 (tr.2) | "Mức thu nhập bình quân tháng trong năm từ tất cả các nguồn thu nhập của người phụ thuộc… không vượt quá 03 triệu đồng." | — |
| (Nội dung thực tế) CK phái sinh 0,1% | Đ.5 khoản 1–2 (tr.4) | "Thuế thu nhập cá nhân đối với thu nhập từ chuyển nhượng chứng khoán phái sinh được xác định bằng giá chuyển nhượng nhân (x) với thuế suất 0,1% theo từng lần chuyển nhượng." Giá chuyển nhượng HĐ tương lai = "giá thanh toán… nhân (x) với hệ số nhân hợp đồng nhân (x) với số lượng hợp đồng nhân (x) với tỷ lệ ký quỹ ban đầu chia (:) cho 2". | — |
| (Nội dung thực tế) Hiệu lực | Đ.6 khoản 1–2 (tr.5) | "Thông tư này có hiệu lực thi hành từ ngày 01 tháng 7 năm 2026. Các nội dung liên quan đến thu nhập từ kinh doanh, từ tiền lương, tiền công của cá nhân cư trú áp dụng từ kỳ tính thuế năm 2026." Thay thế TT 111/2013/TT-BTC; bãi bỏ nhiều phần các TT 119/2014, 151/2014, 92/2015, 25/2018, 79/2022. | — (củng cố kết luận chuyển tiếp NĐ 253) |

---

## 3. `68-ndcp.signed.pdf` — Nghị định 68/2026/NĐ-CP (ngày 05/3/2026, ký: PTT Hồ Đức Phớc; Đ.19: hiệu lực kể từ ngày ký)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Biểu GTGT: phân phối HH 1%, dịch vụ 5%, vận tải/DV gắn HH 3%, khác 2% | Đ.3 khoản 2 (tr.2) — chỉ dẫn chiếu | "…áp dụng phương pháp tính trực tiếp theo doanh thu thuế bằng tỷ lệ % nhân (x) doanh thu. Tỷ lệ % và doanh thu tính thuế thực hiện theo quy định của Luật Thuế giá trị gia tăng số 48/2024/QH15 và các văn bản hướng dẫn thi hành." | KHỚP về giá trị nhưng qua DẪN CHIẾU — biểu 1%/5%/3%/2% không ghi trong NĐ 68 mà nằm tại Đ.12.2.b Luật GTGT 2024 (xem mục 7) |
| Biểu TNCN: 0,5% / 2% (cho thuê TS & đại lý 5%) / 1,5% / 1% | Đ.4 khoản 2 (tr.2) — chỉ dẫn chiếu | "Cá nhân kinh doanh có doanh thu năm trên mức doanh thu quy định tại khoản 1 Điều này thực hiện nộp thuế theo quy định tại Điều 7 Luật Thuế thu nhập cá nhân số 109/2025/QH15." | KHỚP về giá trị nhưng qua DẪN CHIẾU — biểu chi tiết ngành nghề nằm ở Phụ lục NĐ 253/2026/NĐ-CP (tr.59–61): nhóm 1 phân phối HH 0,5%; nhóm 2 dịch vụ 2% (riêng cho thuê tài sản, đại lý xổ số/bảo hiểm/bán hàng đa cấp 5%); nhóm 3 sản xuất, vận tải, DV gắn HH 1,5%; nhóm 4 nội dung số 5%; nhóm 5 khác 1% |
| Phương pháp thu nhập: (DT − CP) × 15% (hộ 1–3 tỷ chọn), 17% (3–50 tỷ), 20% (>50 tỷ) | Đ.4 khoản 5 điểm a, b, d (tr.3) | "b) Phương pháp tính thuế thu nhập cá nhân theo thu nhập tính thuế nhân (x) thuế suất áp dụng đối với cá nhân kinh doanh có doanh thu năm trên 03 tỷ đồng và trường hợp cá nhân kinh doanh có doanh thu năm trên 500 triệu đồng đến 03 tỷ đồng lựa chọn phương pháp này. Thu nhập tính thuế được xác định bằng doanh thu của hàng hóa, dịch vụ bán ra trừ (-) chi phí liên quan… Thuế suất thuế thu nhập cá nhân áp dụng theo quy định tại khoản 2 Điều 7 Luật Thuế thu nhập cá nhân số 109/2025/QH15." Điểm d: ổn định phương pháp 02 năm liên tục. | KHỚP cơ chế (DT − CP) × thuế suất và quyền lựa chọn của hộ nhỏ (ngưỡng gốc 500tr–3 tỷ, thành 1–3 tỷ sau NĐ 141); các mức 15%/17%/20% KHÔNG ghi trong NĐ 68 — dẫn chiếu khoản 2 Đ.7 Luật 109/2025/QH15 |
| Cách xác định doanh thu từng ngành (kỳ vọng Đ.4) | Thực tế: Đ.5 "Doanh thu để xác định thuế thu nhập cá nhân" (tr.3–5) | "2. Doanh thu đối với một số trường hợp được quy định cụ thể như sau: a) Đối với hoạt động gia công hàng hóa là tiền thu về… đ) Đối với hoạt động cho thuê tài sản là số tiền bên thuê trả từng kỳ theo hợp đồng thuê… g) Đối với hoạt động vận tải là toàn bộ doanh thu vận chuyển hành khách, hàng hóa, hành lý…; h) Đối với hoạt động xây dựng, lắp đặt là giá trị công trình…" | KHỚP nội dung, LỆCH số điều: nằm tại Đ.5 (Đ.4 là điều về thuế TNCN nói chung) |
| Lịch khai báo; riêng 2026: mốc 31/07/2026 và 31/01/2027 | Đ.8 khoản 1a, khoản 3 (tr.6–7); Đ.9 khoản 1 (tr.11); Đ.18 khoản 1 (tr.18) | Đ.8.1.a: hộ ≤ ngưỡng "thông báo doanh thu thực tế phát sinh trong năm với cơ quan thuế chậm nhất là ngày 31 tháng 01 của năm dương lịch tiếp theo". Đ.8.3.d: cho thuê BĐS khai 2 lần/năm "lần thứ nhất chậm nhất là ngày 31 tháng 7 của năm tính thuế và lần thứ hai chậm nhất là ngày 31 tháng 01 của năm dương lịch tiếp theo"; khai 1 lần: chậm nhất 31/01 năm tiếp theo. Đ.9.1: hộ mới ra kinh doanh 6 tháng đầu năm thông báo chậm nhất 31/7, 6 tháng cuối năm chậm nhất 31/01 năm sau. Đ.18.1 (chuyển tiếp riêng 2026): "hồ sơ khai thuế tháng 1, tháng 2, tháng 3 năm 2026 gửi cho cơ quan thuế quản lý trực tiếp chậm nhất là ngày 20 tháng 4 năm 2026". | KHỚP một phần: các mốc 31/7 và 31/01 là quy tắc chung hằng năm (với năm 2026 tương ứng 31/07/2026 và 31/01/2027); mốc riêng-2026 duy nhất trong NĐ 68 là 20/4/2026 (Đ.18.1). Mốc "31/07/2026" ghi đích danh nằm ở TT 50/2026/TT-BTC Đ.4.2 (xem mục 6) |
| Ngưỡng miễn gốc 500 triệu | Đ.3 khoản 1, Đ.4 khoản 1 (tr.2) | "Hộ kinh doanh, cá nhân kinh doanh có hoạt động sản xuất, kinh doanh có mức doanh thu năm từ 500 triệu đồng trở xuống thuộc đối tượng không chịu thuế giá trị gia tăng." / "…có mức doanh thu năm từ 500 triệu đồng trở xuống không phải nộp thuế thu nhập cá nhân." | KHỚP (sau đó NĐ 141 nâng thành 01 tỷ đồng) |

---

## 4. `141-ndcp.signed.pdf` — Nghị định 141/2026/NĐ-CP (ngày 29/4/2026, ký: PTT Nguyễn Văn Thắng)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Nâng ngưỡng miễn GTGT+TNCN hộ KD & cho thuê lên 1 tỷ đ/năm | Đ.1 khoản 1 (tr.1) | "Sửa đổi cụm từ '500 triệu đồng' thành '01 tỷ đồng' tại Điều 3, Điều 4, khoản 1 Điều 8, Điều 9, Điều 10, khoản 3 Điều 11, khoản 1 và khoản 2 Điều 12, khoản 4 Điều 17, khoản 3 Điều 18 Nghị định số 68/2026/NĐ-CP." | KHỚP (bao trùm cả cho thuê BĐS vì Đ.4 NĐ 68 gồm khoản 4 về cho thuê) |
| Áp dụng từ 01/01/2026 | Đ.3 (tr.3) | "Nghị định này có hiệu lực thi hành từ ngày 01 tháng 01 năm 2026." | KHỚP |
| Cho thuê >1 tỷ: GTGT 5% toàn bộ + TNCN 5% phần vượt 1 tỷ | Không có trong NĐ 141 | NĐ 141 chỉ thay cụm từ ngưỡng; cơ chế thuế suất thể hiện qua văn bản khác: NĐ 68 Đ.4.3 (mức trừ 500tr→1 tỷ trước khi tính TNCN) + Luật GTGT Đ.12.2.b2 (dịch vụ 5%, tính trên toàn bộ doanh thu chịu thuế) + Phụ lục NĐ 253 (cho thuê tài sản TNCN 5%) + mẫu 01/BĐS TT 50: "[12] Tổng số thuế GTGT phải nộp [12] = [10] x5%; [13] Tổng số thuế TNCN phát sinh trong kỳ [13] = ([10] − [11]) x 5%" ([11] = doanh thu tính thuế TNCN được trừ). | KHÔNG TÌM THẤY trong chính NĐ 141 — cơ chế 5%/5% đúng nhưng nằm ở các văn bản dẫn chiếu, được xác nhận qua công thức mẫu 01/BĐS của TT 50 |
| (Chuyển tiếp đáng ghi nhận) | Đ.4 khoản 1 (tr.3) | "Trường hợp hộ kinh doanh, cá nhân kinh doanh tự xác định mức doanh thu năm… từ 01 tỷ đồng trở xuống mà đã kê khai nộp thuế thu nhập cá nhân, thuế giá trị gia tăng theo quy định tại Nghị định số 68/2026/NĐ-CP thì được xử lý tiền thuế đã nộp theo quy định tại Điều 12 Nghị định số 68/2026/NĐ-CP." | — |

---

## 5. `198_nq.pdf` — Nghị quyết 198/2025/QH15

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Bỏ thuế khoán hộ kinh doanh từ 01/01/2026, kỳ vọng khoản 6 | Đ.10 khoản 6 (tr.7) | "6. Hộ kinh doanh, cá nhân kinh doanh không áp dụng phương pháp khoán thuế từ ngày 01 tháng 01 năm 2026. Hộ kinh doanh, cá nhân kinh doanh nộp thuế theo pháp luật về quản lý thuế." | KHỚP — đúng Đ.10 khoản 6 |
| (Liền kề đáng ghi nhận) | Đ.10 khoản 7 (tr.7) | "7. Chấm dứt việc thu, nộp lệ phí môn bài từ ngày 01 tháng 01 năm 2026." | — |

---

## 6. `50-btc.signed.pdf` — Thông tư 50/2026/TT-BTC (ngày 13/5/2026, ký: Thứ trưởng Cao Anh Tuấn; sửa đổi TT 18/2026/TT-BTC)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Mẫu 01/BĐS thông báo doanh thu cho thuê BĐS | Đ.3 (tr.2) + mẫu tại tr.16–17 | Đ.3: "Thay thế Mẫu số 01/TKN-CNKD, Mẫu số 01/CNKD, Mẫu số 01/BĐS, Mẫu số 02/BK-KTBĐS theo danh mục mẫu biểu ban hành kèm theo Thông tư số 18/2026/TT-BTC bằng… ban hành kèm theo Thông tư này." Tiêu đề mẫu 01/BĐS: "THÔNG BÁO DOANH THU/TỜ KHAI THUẾ ĐỐI VỚI HOẠT ĐỘNG CHO THUÊ BẤT ĐỘNG SẢN (Áp dụng đối với cá nhân có hoạt động cho thuê bất động sản trừ hoạt động kinh doanh lưu trú trực tiếp khai thuế với cơ quan thuế)"; kỳ tính thuế: 6 tháng đầu năm / 6 tháng cuối năm / năm. | KHỚP |
| Hạn trước 31/01 hằng năm | Không ghi trong TT 50 | Thời hạn nộp nằm ở NĐ 68 Đ.8.1.a (thông báo doanh thu chậm nhất 31/01 năm tiếp theo) và Đ.8.3.d (cho thuê BĐS: 31/7 và/hoặc 31/01 năm tiếp theo). TT 50 chỉ ban hành mẫu. | KHÔNG TÌM THẤY trong TT 50 — quy định hạn nằm tại NĐ 68 |
| Riêng 2026 có mốc 31/07/2026 | Đ.4 khoản 2 (tr.2) | "Hộ kinh doanh, cá nhân kinh doanh đang hoạt động có doanh thu năm từ 01 tỷ đồng trở xuống, chưa nộp hồ sơ khai thuế quý I năm 2026 hoặc chưa gửi Thông báo số tài khoản/số hiệu ví điện tử theo quy định tại Thông tư số 18/2026/TT-BTC thì gửi Thông báo số tài khoản/số hiệu ví điện tử theo Mẫu số 01/BK-STK ban hành kèm theo Thông tư số 18/2026/TT-BTC chậm nhất là ngày 31 tháng 7 năm 2026." | KHỚP một phần: mốc 31/07/2026 CÓ trong TT 50 nhưng áp dụng cho thông báo số tài khoản/ví điện tử (mẫu 01/BK-STK), KHÔNG phải cho thông báo doanh thu mẫu 01/BĐS |
| (Hiệu lực) | Đ.4 khoản 1 (tr.2) | "Thông tư này có hiệu lực thi hành kể từ ngày ký ban hành." | — |

---

## 7. `luat-gtgt-2024.pdf` — Luật Thuế GTGT 2024 (48/2024/QH15; bản in trang web, 15 trang)

| Tham số kỳ vọng | Điều khoản thực tế | Trích nguyên văn ngắn | Kết luận |
|---|---|---|---|
| Đ.12 khoản 2 — biểu tỷ lệ % GTGT trên doanh thu | Đ.12 khoản 2 điểm b (tr.9) | "b) Tỷ lệ % để tính thuế giá trị gia tăng được quy định như sau: b1) Phân phối, cung cấp hàng hóa: 1%; b2) Dịch vụ, xây dựng không bao thầu nguyên vật liệu: 5%; b3) Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, xây dựng có bao thầu nguyên vật liệu: 3%; b4) Hoạt động kinh doanh khác: 2%." | KHỚP — đúng cả 4 nhóm và thuế suất |
| (Liền kề đáng ghi nhận) đối tượng áp dụng | Đ.12 khoản 2 điểm a (tr.9) | "a2) Hộ, cá nhân sản xuất, kinh doanh, trừ trường hợp quy định tại khoản 3 Điều này;" — khoản 3: hộ không thực hiện đầy đủ chế độ kế toán, hóa đơn, chứng từ thì nộp theo phương pháp khoán thuế theo Luật Quản lý thuế. | — |

---

## Phát hiện mới

1. **Câu trả lời cho FR-007 (spec 004):** NĐ 253 Đ.69.1.a quy định rõ các quy định về thu nhập từ tiền lương, tiền công của cá nhân cư trú **áp dụng từ kỳ tính thuế năm 2026** (cả năm), chỉ riêng tiền ăn giữa ca/ăn trưa mới áp từ 01/7/2026 (Đ.69.1.b). TT 87 Đ.6.1 lặp lại nguyên tắc này. Đ.70.2 NĐ 253: phần đã khấu trừ/kê khai từ 01/01/2026 theo quy định cũ không phải nộp lại hồ sơ tháng/quý, điều chỉnh khi quyết toán năm 2026.
2. **Khấu trừ vãng lai dưới 5 triệu theo yêu cầu:** NĐ 253 Đ.50.2 (tr.36): "Trường hợp mức chi trả thu nhập dưới 05 triệu đồng/lần thì tổ chức, cá nhân trả thu nhập được khấu trừ thuế theo tỷ lệ 10% khi cá nhân có yêu cầu." — quy định mới, chưa có trong tham số kỳ vọng. Cơ chế cam kết không khấu trừ (ước tính chưa đến mức chịu thuế) vẫn được giữ (tr.36).
3. **Fallback cổ phiếu thưởng khác ESOP:** với cổ phiếu thưởng, fallback = số CP × mệnh giá và "nếu giá chuyển nhượng cổ phiếu thấp hơn mệnh giá thì tính thuế… theo giá thị trường tại thời điểm chuyển nhượng" (tr.36–37); phần trừ tiền đã bỏ ra chỉ áp dụng cho ESOP.
4. **Biểu tỷ lệ TNCN ngành nghề nằm ở Phụ lục NĐ 253** (tr.59–61), không phải NĐ 68: nhóm 1 (0,5%), nhóm 2 dịch vụ (2%; riêng cho thuê tài sản, đại lý xổ số/bảo hiểm/bán hàng đa cấp 5%), nhóm 3 (1,5%), nhóm 4 — sản phẩm/dịch vụ nội dung thông tin số giải trí, game, phim số, ảnh số, nhạc số, quảng cáo số (5%), nhóm 5 khác (1%). NĐ 68 chỉ dẫn chiếu Đ.7 Luật 109/2025; các mức 15%/17%/20% của phương pháp thu nhập cũng không ghi trong NĐ 68 (nằm ở khoản 2 Đ.7 Luật 109/2025 — file luật này không thuộc phạm vi 7 file được giao).
5. **NĐ 68 hiệu lực từ ngày ký 05/3/2026 (Đ.19)** nhưng NĐ 141 hiệu lực hồi tố từ 01/01/2026 và có Đ.4 chuyển tiếp: hộ ≤1 tỷ đã nộp thuế theo NĐ 68 được bù trừ/hoàn theo Đ.12 NĐ 68; hợp đồng cho thuê BĐS phát sinh trước 01/01/2026 còn hạn >6 tháng được điều chỉnh mức doanh thu không chịu thuế (NĐ 68 Đ.18.3).
6. **TT 87 thay thế TT 111/2013/TT-BTC** — văn bản hướng dẫn TNCN chủ lực suốt 13 năm — và ấn định ngưỡng thu nhập người phụ thuộc 3 triệu đ/tháng (tăng từ 1 triệu).
7. **NQ 198 Đ.10.7:** chấm dứt thu lệ phí môn bài từ 01/01/2026 (cùng khoản 6 bỏ thuế khoán) — nên phản ánh trong logic phí/lệ phí của hộ KD nếu có.
8. **Mốc 31/07/2026 trong TT 50** là hạn nộp bù hồ sơ khai thuế quý I/2026 hoặc thông báo số tài khoản/ví điện tử (mẫu 01/BK-STK) cho hộ ≤1 tỷ — không phải hạn thông báo doanh thu 01/BĐS; hạn 01/BĐS theo NĐ 68 Đ.8.3.d là 31/7 (lần 1 nếu khai 2 lần/năm) và 31/01 năm tiếp theo.
