# Ma trận đối thủ — KVSalaryTools

**Ngày khảo sát**: 2026-07-31  
**Phạm vi**: công cụ công khai hỗ trợ tính lương/thuế/BHXH cho người lao động Việt Nam.

## Tiêu chí đánh giá

| Tiêu chí | Ý nghĩa |
|----------|---------|
| Nền tảng | Web / PWA / App native / Extension |
| Gross-Net | Tính lương 1 chiều hoặc 2 chiều |
| Luật 2026 | Biểu 5 bậc, GTGC 15,5/6,2 triệu |
| Breakdown | Hiển thị từng bước trừ BH + thuế |
| Quyết toán | Tổng hợp năm, hoàn/nộp thêm |
| Quyền lợi LĐ | Thất nghiệp, thôi việc, thai sản, hưu… |
| Thu nhập khác | Vãng lai, hộ KD, cho thuê, CK, ESOP |
| Versioning luật | Chọn năm / so sánh cũ–mới |
| Mobile-first | Trải nghiệm điện thoại tốt |

Mức: `Có` / `Một phần` / `Không` / `Không rõ`.

## Ma trận tóm tắt

| Đối thủ | Nền tảng | Gross-Net | Luật 2026 | Breakdown | Quyết toán | Quyền lợi LĐ | TN khác | Versioning | Ghi chú |
|---------|----------|-----------|-----------|-----------|------------|--------------|---------|------------|---------|
| thue-2026 (googlesky / thue.1devops.io) | Web/PWA | Có (2 chiều) | Có | Có | Có | Một phần (hưu) | Có (CK, thuê nhà, ESOP, thưởng) | Có (so sánh 7↔5 bậc) | Rộng nhất OSS; FAQ từng ghi sai mức thuế tối đa |
| pit.thangtd.com | Web | Có (1 chiều) | **Không** (snapshot còn 2025) | Có | Không | Không | Không | Không | UX tốt nhưng minh chứng tool cá nhân dễ lỗi thời |
| TopCV | Web lead-gen | Có | Có | Có | Không | Một phần (BHTN) | Không | Một phần (chọn kỳ 2025/2026) | SEO mạnh; proto-versioning gần USP của ta |
| VietnamWorks | Web lead-gen | Có | Có | Một phần | Không | Không | Không | Không | Cập nhật nhanh; có thể đã áp lương cơ sở 2,53tr (cần đối chiếu VB) |
| CareerViet | Web | Có | Có | Một phần | Không | Không | Không | Không | Mạnh content |
| Vieclam24h | Web | Có | **Không** (nội dung còn ~2022–23) | Cơ bản | Không | Không | Không | Không | Kết quả sai luật 2026 |
| LuatVietnam | Web 12+ tool | Có | Có (không đồng đều) | Có + căn cứ PL | Không tổng hợp | Có (BHXH 1 lần, BHTN, thai sản — rời) | Một phần | Một phần | UX nặng QC; từng lệch LTTV vùng I |
| VssID (BHXH VN) | App chính thức | Không | N/A (dữ liệu thật) | Tra cứu | Không | Lịch sử hưởng | Không | N/A | Complement: “đã đóng gì”, không mô phỏng |
| Tính Lương (duypham.app) | **iOS** | Có (2 chiều) | Có | Có | Không rõ | Một phần (hưu, BHXH 1 lần) | Không rõ | Không | App mobile VN đầy đủ nhất hiện tại; **Android trống** |
| Tính Thuế TNCN 2026 (An Banh) | **iOS** | Có | Có + so sánh | Có | Không | Không | Không | Một phần | Nhẹ, privacy; đơn mục đích |
| tax-vision | Web đa quốc gia | Có | Một phần VN | Có | Không | Không | Không | Không | Expat/hobby |
| Extension Chrome cũ | Extension | Có | Không | Một phần | Không | Không | Không | Không | Bỏ hoang |
| Site SEO 2026 (tinhluongnet, vi.money…) | Web | Có | Có | Khá | Hiếm | Hiếm | Hiếm | Không | Mặt trận web đông; mobile còn thưa |

## Chi tiết từng đối thủ

### 1. thue-2026 (googlesky/thue-2026)

- **Mô tả**: Bộ 20+ công cụ thuế TNCN VN; so sánh luật cũ (7 bậc) và mới 2026 (5 bậc).
- **Tính năng nổi bật**: GROSS⇄NET, OT, quyết toán, thưởng Tết, ESOP, thuế CK, cho thuê nhà, dự tính lương hưu, so sánh offer.
- **Điểm mạnh**: Phạm vi rộng; cập nhật Luật 109/2025/QH15; PWA; chia sẻ URL/QR.
- **Điểm yếu**: Chủ yếu web; quyền lợi LĐ sâu chưa đủ; FAQ từng ghi sai (“thuế suất cao nhất giảm xuống 30%” — thực tế vẫn 35%); chưa có ruleset remote versioned.
- **Gap vs KVSalaryTools**: Mobile (đặc biệt Android), quyền lợi BHXH/BHTN sâu, kiến trúc tham số luật + QA nội dung.

### 2. pit.thangtd.com

- **Mô tả**: Gross→net; test suite tốt; option đoàn phí, phụ cấp ăn trưa, custom mức đóng BH.
- **Điểm mạnh**: UX sạch; engineering hygiene.
- **Điểm yếu (snapshot 07/2026)**: Vẫn quy định 2025 (GTGC 11tr, 7 bậc) — minh chứng rủi ro không bảo trì.
- **Bài học**: Test case + CI (Constitution IV); ruleset versioned để không “kẹt năm cũ”.

### 3. Job boards

- **TopCV**: Cho chọn kỳ quy định (2025 vs 2026) — gần USP versioning nhất nhóm này; có tool BHTN rời.
- **VietnamWorks**: Cập nhật luật nhanh; funnel tuyển dụng.
- **CareerViet**: Content giải thích tốt, tool cơ bản.
- **Vieclam24h**: Nội dung còn quy định ~2022–2023 → kết quả sai năm 2026.
- **Gap chung**: Snapshot tháng; không quyết toán đa nguồn; không offline app.

### 4. LuatVietnam

- **Điểm mạnh**: Một trong ít nơi có calculator BHXH 1 lần / BHTN / thai sản kèm căn cứ pháp lý.
- **Điểm yếu**: Tool rời, QC nhiều; chất lượng cập nhật không đồng đều (đã thấy lệch LTTV vùng I).

### 5. VssID

- Trả lời “đã đóng gì / đã hưởng gì” (dữ liệu thật), **không** mô phỏng “sẽ nhận bao nhiêu / nên quyết định gì”.
- Định vị KVSalaryTools: lớp ước tính phía trên số liệu user đọc từ VssID (không thay thế).

### 6. App iOS mới (cuối 2025–2026)

- **Tính Lương (duypham.app)**: Gần định vị nhất — so sánh offer, hưu, BHXH 1 lần, PDF; **iOS-only**.
- **Tính Thuế TNCN 2026 (An Banh)**: Nhẹ, so sánh cũ/mới, privacy; đơn mục đích.
- **Cơ hội**: Expo (iOS+Android), đặc biệt Android còn trống.

### 7. Extension / site SEO

- Extension cũ bỏ hoang; làn sóng site SEO 2026 đông đúc → **không cạnh tranh SEO “gross net” thuần**.

## Khoảng trống thị trường (tổng hợp)

1. **Gross-net web bão hòa**; ~một phần tool đang cho số **sai luật** (Vieclam24h, pit snapshot) — độ tin cậy + versioning là khác biệt.
2. **Mobile đa nền tảng** (nhất là Android) còn thưa; iOS đã có 1–2 app.
3. **Versioning luật nhiều mốc** (không chỉ 2 radio) + test/changelog — USP kỹ thuật.
4. **Quyết toán đa nguồn + wizard thủ tục** gần như trống trên mobile.
5. **Quyền lợi LĐ** có trên LuatVietnam (web rời) / thiếu trên app tính lương.
6. **Hộ KD sau bỏ thuế khoán** hầu như chưa có tool cho người không chuyên (xem research nhu cầu).
7. **Hành trình mùa vụ** (Tết → quyết toán T3–T4 → nghỉ việc) + nhắc hạn: web SEO không làm tốt bằng app.

## Hệ quả cho KVSalaryTools

| Ưu tiên định vị | Lý do |
|-----------------|-------|
| Breakdown + nguồn pháp lý + QA số liệu | Nhiều tool đang sai luật; niềm tin là moat |
| Ruleset theo năm/mốc | USP dài hạn; TopCV mới có 2 mốc thô |
| Expo iOS+Android (Android trống) | iOS đã có đối thủ gần; Android còn cơ hội |
| Quyết toán đa nguồn + wizard thủ tục (V1) | Gap lớn; retention mùa T3–T4 |
| Hộ KD / cho thuê sớm V1–V1.1 | Cửa sổ 2026; ADR 0003 |
| Quyền lợi LĐ sau MVP | LuatVietnam chạm web; app còn trống |
