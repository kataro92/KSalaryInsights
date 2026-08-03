# Nhu cầu người dùng — KVSalaryTools

**Ngày**: 2026-07-31  
**Nguồn**: tổng hợp câu hỏi thường gặp công khai (báo chí, cổng pháp lý, cộng đồng, đối thủ), đối chiếu personas.

## 1. Jobs-to-be-done

1. Khi nhận offer / xem phiếu lương, tôi muốn đổi gross⇄net và thấy từng khoản trừ, để quyết định và kiểm tra công ty.
2. Khi luật thuế đổi (2026), tôi muốn so sánh số thuế cũ vs mới với cùng mức lương.
3. Khi cuối năm / đầu năm sau, tôi muốn ước quyết toán (nộp thêm hay hoàn) nếu có thưởng hoặc nhiều nguồn.
4. Khi nghỉ việc, tôi muốn ước trợ cấp thôi việc và điều kiện thất nghiệp trước khi ký biên bản.
5. Khi cân nhắc rút BHXH một lần, tôi muốn thấy ước tính hệ quả so với chờ hưu (có cảnh báo).
6. Khi có thu nhập ngoài lương (freelance, thuê nhà, CK), tôi muốn ước thuế theo đúng loại thu nhập.

## 2. Bảng xếp hạng nhu cầu

Thang 1–5. **Điểm = Tần suất × Mức đau**.

| ID | Nhu cầu | Tần suất | Đau | Điểm | Giai đoạn đề xuất |
|----|---------|----------|-----|------|-------------------|
| N01 | Tính gross → net có breakdown BH + thuế | 5 | 4 | 20 | MVP |
| N02 | Tính net → gross (đàm phán offer) | 4 | 4 | 16 | MVP |
| N03 | Người phụ thuộc / GTGC đúng năm luật | 5 | 4 | 20 | MVP |
| N04 | So sánh biểu thuế 7 bậc vs 5 bậc (2025 vs 2026) | 4 | 5 | 20 | MVP |
| N05 | Chọn vùng lương tối thiểu / trần BH | 4 | 3 | 12 | MVP |
| N06 | Làm thêm giờ 150/200/300% | 3 | 3 | 9 | V1 |
| N07 | Quyết toán năm / ước hoàn thuế | 4 | 5 | 20 | V1 |
| N08 | Nhiều nguồn TN (lương + vãng lai) | 3 | 5 | 15 | V1 |
| N09 | Thưởng Tết — mô phỏng thuế tháng thưởng | 3 | 4 | 12 | V1 |
| N10 | Trợ cấp thôi việc / mất việc | 2 | 5 | 10 | V1 |
| N11 | Trợ cấp thất nghiệp | 2 | 5 | 10 | V1 |
| N12 | Thai sản / ốm đau | 2 | 4 | 8 | V1 |
| N13 | BHXH một lần vs lương hưu (ước) | 2 | 5 | 10 | V2 |
| N14 | Thuế cho thuê nhà | 2 | 3 | 6 | V2 |
| N15 | Thuế hộ kinh doanh | 2 | 3 | 6 | V2 |
| N16 | Thuế chứng khoán / ESOP | 2 | 3 | 6 | V2 |
| N17 | Cập nhật tham số luật không cần đợi store review dài | 3 | 5 | 15 | Kiến trúc từ MVP |
| N18 | Lưu kịch bản cục bộ / chia sẻ kết quả | 3 | 2 | 6 | V1 |
| N19 | Disclaimer + nguồn pháp lý trong UI | 5 | 3 | 15 | MVP (bắt buộc) |

## 3. Nhu cầu theo mùa

Xem thêm [market-analysis.md](./market-analysis.md) mục seasonality.

- **T12–T1**: N09, N01, N04  
- **T2–T4**: N07, N08, N03  
- **Khi nhảy việc**: N02, N10, N11  
- **Khi luật mới công bố**: N04, N17  

## 4. Gap thị trường (nhu cầu chưa được đáp ứng tốt)

| Gap | Hiện trạng | Cơ hội KVSalaryTools |
|-----|------------|----------------------|
| Tin cậy số liệu khi luật vừa đổi | ~1/3 tool web đang lệch/lỗi thời (Vieclam24h, pit snapshot…) | Ruleset + changelog + test case |
| Quyết toán đa nguồn + hoàn thuế | Gần như trống trên mobile; web ít | Ước hoàn/nộp thêm + log nguồn |
| Wizard thủ tục (ủy quyền vs tự QT) | FAQ dài, không tương tác | Quiz + checklist + hạn nộp |
| Hộ KD sau bỏ thuế khoán (2026) | Tool nhắm kế toán chuyên nghiệp | Calculator đơn giản cho người không chuyên |
| Mobile đa nền tảng | iOS có 1–2 app; Android trống | Expo iOS+Android |
| Quyền lợi LĐ dạng calculator | LuatVietnam web rời / bài viết | Module thôi việc/thất nghiệp/thai sản |
| Hành trình dài hạn / mùa vụ | Vào–tính–thoát | Local scenarios + nhắc T3–T4 / Tết |

## 5. Khuyến nghị ưu tiên

### MVP (cửa vào + USP tối thiểu)
- N01, N02, N03, N04, N05, N19  
- N17 (thiết kế ruleset từ đầu, dù remote update có thể làm sau)

### V1
- N07, N08, N09, N06, N10, N11, N12, N18

### V2+
- N13–N16 và làm sâu theo feedback

## 6. Tiêu chí thành công nghiên cứu (Phase 1)

- [x] Có ma trận đối thủ và gap rõ  
- [x] Có personas bao phủ phạm vi “all”  
- [x] Có bảng nhu cầu có điểm số để nuôi `docs/product/scope.md`  

**Bước tiếp**: Phase 2 domain knowledge + Phase 3 chốt scope.
