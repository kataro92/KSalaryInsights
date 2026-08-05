# ADR 0001: Tách ruleset tham số luật theo giai đoạn hiệu lực

- **Status**: Accepted 
- **Date**: 2026-07-31 
- **Context**: Luật VN đổi tham số hằng năm; cần so sánh cũ/mới và quyết toán giao thời.

## Decision

Mọi phép tính thuế/BH/quyền lợi nhận **ruleset versioned** (`effective_from`/`effective_to`, nguồn pháp lý). Công thức nằm trong code/domain logic; tham số nằm trong dữ liệu ruleset. MVP bundle ruleset 2025 + 2026.

## Consequences

- Thêm việc bảo trì file dữ liệu và test theo ruleset. 
- UI phải cho chọn năm kỳ tính thuế. 
- Cho phép USP “cập nhật luật” và so sánh song song. 
- Tránh hard-code số magic trong component.

## Alternatives rejected

- Hard-code một bộ số “mới nhất”: không hỗ trợ quyết toán năm trước / so sánh. 
- Chỉ remote config không bundle: rủi ro offline và lần mở app đầu.
