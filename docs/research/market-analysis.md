# Phân tích thị trường — KVSalaryTools

**Ngày**: 2026-07-31  
**Bối cảnh pháp lý nóng**: Luật thuế TNCN 109/2025/QH15 (kỳ tính thuế 2026: biểu 5 bậc, GTGC mới); Luật BHXH 41/2024/QH15; lương tối thiểu vùng theo NĐ 293/2025/NĐ-CP từ 01/01/2026.

## 1. Phân khúc

| Phân khúc | Nhu cầu chính | Mức cạnh tranh |
|-----------|---------------|----------------|
| NLĐ HĐLĐ 1 nguồn TN | Gross⇄net, phụ thuộc, OT | Cao (nhiều widget) |
| NLĐ nhiều nguồn / quyết toán | Tổng hợp năm, hoàn thuế | Trung bình — tool ít, bài viết nhiều |
| Freelance / vãng lai | Thuế 10%, kê khai | Trung bình–thấp |
| Sắp nghỉ việc | Trợ cấp thôi việc, thất nghiệp | Thấp (chủ yếu bài hướng dẫn) |
| Gần hưu / BHXH 1 lần | So sánh rút vs chờ hưu | Thấp–trung bình |
| Hộ KD / cho thuê / CK | Thuế khoán, 5%/2% CK… | Một phần (thue-2026 có một số) |

## 2. Mức bão hòa

- **Tính gross-net đơn giản**: bão hòa trên web tuyển dụng.
- **So sánh luật cũ–mới 2026**: đang là “sóng” nội dung; thue-2026 và job board cập nhật nhanh.
- **Bộ công cụ toàn diện + mobile + versioning**: còn trống.

## 3. Nhu cầu theo mùa (seasonality)

| Thời điểm | Nhu cầu đỉnh | Gợi ý tính năng |
|-----------|--------------|-----------------|
| T12–T1 | Thưởng Tết, tối ưu thời điểm trả thưởng, so sánh offer năm mới | Mô phỏng thưởng, so sánh gross-net |
| T2–T4 | Quyết toán thuế TNCN, hoàn thuế, 2 nguồn TN | Quyết toán, checklist hồ sơ |
| T5–T8 | Ổn định; thai sản/ốm đau/nghỉ việc rải rác | Quyền lợi LĐ |
| T9–T11 | Review lương, nhảy việc | So sánh offer, chi phí BH khi đổi việc |
| Khi luật đổi (thường công bố cuối năm) | “Công thức mới năm sau?” | Ruleset mới + so sánh cũ/mới |

## 4. Động lực 2026

1. Thay đổi lớn biểu thuế + GTGC → người dùng chủ động tìm tool cập nhật.
2. Luật BHXH 2024 thay đổi một số điều kiện hưởng/rút → nhu cầu giải thích quyền lợi tăng.
3. Lương tối thiểu vùng tăng → trần BHTN và mức đóng tối thiểu đổi → calculator lỗi thời nhanh.

## 5. Cơ hội định vị

> **“Máy tính quyền lợi người lao động Việt Nam có thể cập nhật theo luật từng năm”** — không chỉ gross-net.

Trụ cột:
1. Chính xác có nguồn + breakdown + test case.
2. Ruleset versioned (năm/giai đoạn hiệu lực).
3. Mobile-first (React/Expo).
4. Mở rộng có kiểm soát từ lương → quyết toán → quyền lợi → thu nhập khác.

## 6. Rủi ro thị trường

| Rủi ro | Giảm thiểu |
|--------|------------|
| Đối thủ OSS (thue-2026) phủ nhiều calculator | Khác biệt bằng mobile, quyền lợi BHXH sâu, kiến trúc cập nhật luật |
| Job board có reach lớn | Không cạnh tranh SEO “tính gross net” đơn thuần; cạnh tranh độ sâu & tin cậy |
| Luật phức tạp / edge case | Domain docs + disclaimer; không cam kết thay thế tư vấn |
| Tham số sai sau khi luật đổi | Quy trình legal-changelog → domain → analyze specs |

## 7. Kết luận

Thị trường đủ lớn và đang “nóng” vì luật 2026, nhưng **điểm vào bằng gross-net thuần sẽ khó**. KVSalaryTools nên dùng gross-net làm cửa vào (MVP), rồi chiếm khoảng trống **quyết toán – quyền lợi – versioning luật – mobile**.
