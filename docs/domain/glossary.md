# Từ điển thuật ngữ (Glossary)

Thuật ngữ dùng thống nhất trong domain docs, spec và UI.

| Thuật ngữ | Định nghĩa ngắn |
|-----------|-----------------|
| Gross | Tổng thu nhập trước khi trừ bảo hiểm bắt buộc và thuế TNCN (thường = lương thỏa thuận + phụ cấp chịu thuế) |
| Net | Thực nhận sau BH bắt buộc (phần NLĐ) và thuế TNCN |
| Thu nhập chịu thuế | Tổng thu nhập từ tiền lương, tiền công (Gross) sau khi trừ các khoản phụ cấp/trợ cấp được **miễn thuế** theo quy định. **không trừ bảo hiểm** (BH là khoản giảm trừ ở bước tiếp theo để tính TNTT) |
| Thu nhập tính thuế (TNTT) | Thu nhập chịu thuế trừ đi các **khoản giảm trừ**: BH bắt buộc phần NLĐ đóng + GTGC + đóng góp từ thiện/nhân đạo + hưu trí t[.] |
| Giảm trừ gia cảnh (GTGC) | Khoản trừ cho bản thân và người phụ thuộc trước khi tính thuế |
| Biểu lũy tiến từng phần | Mỗi phần TNTT chịu thuế suất của bậc tương ứng, cộng dồn |
| BHXH | Bảo hiểm xã hội |
| BHYT | Bảo hiểm y tế |
| BHTN | Bảo hiểm thất nghiệp |
| Mức tham chiếu / lương cơ sở | Căn cứ tính trần đóng BHXH/BHYT (20 lần). theo lộ trình pháp lý hiện hành thường gắn mức lương cơ sở |
| Lương tối thiểu vùng | Căn cứ mức lương đóng tối thiểu và trần BHTN (20 lần) |
| Ruleset | Bộ tham số luật có hiệu lực trong một khoảng thời gian |
| Kỳ tính thuế | Năm dương lịch đối với TNCN từ tiền lương, tiền công |
| Cá nhân cư trú | Đối tượng áp dụng biểu lũy tiến và GTGC theo luật TNCN |
| Quyết toán thuế | Xác định số thuế cả năm so với đã khấu trừ. nộp thêm hoặc hoàn |
| Thu nhập vãng lai | Thu nhập không ký HĐLĐ / không trừ thuế theo biểu lũy tiến tại nguồn theo cơ chế lương. thường khấu trừ tỷ lệ (vd. 10%) |
| ESOP | Cổ phiếu/quyền chọn thưởng cho người lao động |
| Breakdown | Bảng giải thích từng bước tính |
| Hộ kinh doanh (HKD) | Cá nhân kinh doanh tự khai tự nộp (từ 2026 bỏ thuế khoán) |
| Trượt giá / Hệ số điều chỉnh BHXH | Hệ số nhân tiền lương đã đóng BHXH các năm trước về mặt bằng hiện tại để tính bình quân lương hưu / BHXH 1 l[.] |
| Tầng xác minh (Verification Tier) | Tầng 1 = văn bản gốc PDF có text layer; Tầng 2 = nguồn thứ cấp (web, tổng hợp). chỉ Tầng 1 đủ điều kiện ship |

**Quy ước số trong tài liệu**: dùng dấu chấm phân tách hàng nghìn kiểu Việt (1.000.000) hoặc viết `1_000_000`; trong JSON/ruleset dùng số nguyên không dấu.
