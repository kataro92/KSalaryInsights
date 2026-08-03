<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: I — bổ sung phân tầng xác minh nguồn (văn bản gốc vs thứ cấp) và nghĩa vụ yêu cầu product owner cung cấp văn bản không tự tìm được
- Added sections: không (mở rộng nguyên tắc I)
- Added docs: docs/domain/legal-sources.md (sổ đăng ký văn bản pháp lý + trạng thái xác minh)
- Follow-up TODOs: thu thập văn bản gốc theo danh sách trong legal-sources.md trước khi ship tính năng tương ứng
-->
# KVSalaryTools Constitution

## Core Principles

### I. Trích dẫn pháp lý bắt buộc — phân tầng xác minh
Mọi công thức tính thuế, bảo hiểm hoặc quyền lợi lao động MUST gắn với văn bản pháp lý nguồn (Luật, Nghị định, Thông tư) và ngày hiệu lực. Không được đưa số liệu “theo kinh nghiệm” mà không có nguồn. Khi luật thay đổi, MUST cập nhật `docs/domain/legal-changelog.md` trước khi sửa công thức hoặc tham số.

Nguồn xác minh chia hai tầng, ghi trong `docs/domain/legal-sources.md`:

- **Tầng 1 — Văn bản gốc** (toàn văn Luật/NĐ/TT/CV từ cổng chính thức hoặc bản product owner cung cấp): điều kiện BẮT BUỘC trước khi **ship** bất kỳ công thức/tham số nào ra người dùng.
- **Tầng 2 — Nguồn thứ cấp** (thuvienphapluat, báo chí, hãng tư vấn): chỉ đủ cho giai đoạn **spec/draft**; tham số ở tầng này MUST đánh dấu `⚠ thứ cấp` trong domain docs.

Khi không tự tìm được văn bản gốc, MUST **yêu cầu product owner cung cấp** (liệt kê trong `legal-sources.md`, mục "Cần cung cấp") — KHÔNG được nâng tầng xác minh dựa trên nhiều nguồn thứ cấp trùng nhau.

**Rationale**: Đây là ứng dụng tài chính — sai một tham số là mất niềm tin vĩnh viễn. Nguồn thứ cấp ở Việt Nam thường chép lại nhau nên "nhiều nguồn khớp nhau" không tương đương văn bản gốc.

### II. Tách công thức khỏi tham số theo năm
Logic tính toán (công thức) MUST tách khỏi bộ tham số theo giai đoạn hiệu lực (ruleset versioned: `effective_from`, `effective_to`, nguồn pháp lý). Tham số năm mới MUST có thể cập nhật mà không viết lại công thức. Mọi quy tắc nghiệp vụ trong `docs/domain/` MUST ghi rõ năm/giai đoạn áp dụng.

**Rationale**: Cho phép cập nhật luật hằng năm, hỗ trợ so sánh luật cũ/mới, và quyết toán giao thời (ví dụ thu nhập 2025 quyết toán năm 2026).

### III. Kết quả phải giải thích được (breakdown)
Mọi phép tính trả về cho người dùng MUST kèm breakdown từng bước: gross → bảo hiểm → thu nhập chịu thuế → thuế theo bậc → net (hoặc tương đương theo nghiệp vụ). Không chỉ hiện số cuối cùng. Breakdown MUST khớp với công thức đã tài liệu hóa trong domain docs.

**Rationale**: Người lao động cần hiểu vì sao bị trừ; breakdown cũng là nền tảng cho acceptance test và kiểm chứng pháp lý.

### IV. Test case tính tay là nguồn sự thật
Mỗi quy tắc nghiệp vụ trong domain docs MUST có ít nhất một bộ test case tính tay (input → output kỳ vọng, kèm nguồn). Spec tính năng MUST lấy acceptance criteria từ các test case này. Thay đổi công thức/tham số MUST cập nhật hoặc bổ sung test case tương ứng trước khi coi là xong.

**Rationale**: Đảm bảo độ chính xác có thể kiểm chứng; giảm hồi quy khi luật đổi.

### V. Quyền riêng tư tối thiểu
Ứng dụng MUST NOT yêu cầu hoặc lưu trữ dữ liệu cá nhân nhạy cảm không cần thiết để tính toán (CMND/CCCD, MST, số sổ BHXH, thông tin ngân hàng). Dữ liệu nhập tính toán SHOULD ưu tiên lưu cục bộ trên thiết bị. Không gửi dữ liệu lương/thuế lên máy chủ trừ khi người dùng chủ động đồng ý và có mục đích rõ ràng.

**Rationale**: Công cụ hỗ trợ tính toán, không phải hệ thống hồ sơ thuế/BHXH chính thức.

### VI. Spec trước, code sau; đơn giản hóa có chủ đích
Tính năng mới MUST đi qua chu trình Spec Kit (`specify` → `clarify` khi cần → `plan` → `tasks` → `implement`) với tài liệu nghiệp vụ ổn định trước khi lập kế hoạch kỹ thuật. Tech stack mục tiêu: React + Expo. Ưu tiên giải pháp đơn giản (YAGNI); không mở rộng phạm vi ngoài `docs/product/scope.md` đã chốt mà không có quyết định (ADR) mới.

**Rationale**: Dự án phát triển nhiều phiên; tài liệu là bộ nhớ chung. Spec-driven giảm lệch nghiệp vụ khi triển khai.

## Ràng buộc sản phẩm & pháp lý

- Đối tượng: người lao động Việt Nam và các nhóm thu nhập liên quan (làm công ăn lương, freelance/vãng lai, hộ kinh doanh, cho thuê, chứng khoán) theo `docs/product/scope.md`.
- Ứng dụng là công cụ hỗ trợ ước tính, KHÔNG thay thế tư vấn pháp lý/kế toán chính thức. UI và tài liệu MUST ghi disclaimer phù hợp.
- Khi có giai đoạn giao thời giữa hai bộ luật, hệ thống MUST cho phép chọn hoặc tự xác định ruleset theo kỳ tính thuế / ngày phát sinh thu nhập — hành vi cụ thể ghi trong `docs/product/rules-versioning.md`.

## Ngôn ngữ & tài liệu

- Tiếng Việt là ngôn ngữ chính của tài liệu nghiệp vụ, spec, và giao diện người dùng.
- Thuật ngữ pháp lý giữ nguyên (giảm trừ gia cảnh, BHXH, BHYT, BHTN, quyết toán…).
- Cấu trúc tài liệu chuẩn: `docs/research/`, `docs/domain/`, `docs/product/`, `docs/decisions/`, `specs/`.
- Mỗi quyết định nghiệp vụ lớn MUST ghi ADR trong `docs/decisions/`.

## Quy trình Spec-Driven

1. Cập nhật hoặc tham chiếu domain docs trước khi viết/sửa spec tính năng.
2. Spec lấy acceptance từ test case tính tay; dùng `/speckit-clarify` khi còn mơ hồ.
3. `/speckit-plan` (kỹ thuật React/Expo) chỉ chạy khi nghiệp vụ đã ổn định.
4. Sau thay đổi luật: `legal-changelog` → domain docs → `/speckit-analyze` để tìm spec bị ảnh hưởng.
5. Constitution này supersede mọi thực hành mâu thuẫn trong repo.

## Governance

- Constitution có hiệu lực cao hơn convention không thành văn và ghi chú tạm thời.
- Sửa đổi nguyên tắc: cập nhật file này, tăng phiên bản (MAJOR = đổi/xóa nguyên tắc; MINOR = thêm nguyên tắc/mở rộng; PATCH = làm rõ wording), ghi Sync Impact Report, cập nhật `Last Amended`.
- Mọi PR/phiên làm việc liên quan nghiệp vụ MUST kiểm tra tuân thủ các nguyên tắc I–IV (nguồn pháp lý, versioning tham số, breakdown, test case).
- Review định kỳ khi có thay đổi luật lớn (thường cuối năm) hoặc trước khi mở rộng scope đáng kể.

**Version**: 1.1.0 | **Ratified**: 2026-07-31 | **Last Amended**: 2026-07-31
