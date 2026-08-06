# ADR 0002: Phạm vi MVP tập trung gross-net + so sánh luật 2025/2026

- **Status**: Accepted 
- **Date**: 2026-07-31 
- **Context**: Thị trường gross-net bão hòa; luật 2026 tạo sóng nhu cầu; quyền lợi/TN khác phức tạp hơn.

## Decision

MVP = F001-F006 (gross⇄net, phụ thuộc, so sánh biểu thuế, vùng/trần BH, ruleset). Quyết toán và quyền lợi để V1; thu nhập khác & hưu để V2+.

## Consequences

- Ra mắt nhanh với USP so sánh luật + breakdown + nguồn. 
- Tránh đụng độ feature-breadth với thue-2026 ngay ngày 1. 
- Roadmap rõ trong `scope.md`.

## Alternatives rejected

- **MVP rộng hơn, gồm cả quyết toán (F007/008) và quyền lợi nghỉ việc**: bị từ chối vì tăng độ phức tạp nghiệp vụ trước khi engine lõi (gross⇄net, ruleset) ổn định. rủi ro trễ ngày ra mắt trong lúc làn sóng luật 2026 đang là cửa sổ cơ hội.
- **MVP hẹp hơn, bỏ so sánh biểu thuế 2025/2026**: bị từ chối vì so sánh luật cũ/mới chính là USP tận dụng trực tiếp làn sóng luật 2026: bỏ đi sẽ làm MVP không khác biệt so với các công cụ gross-net đã bão hòa trên thị trường.
- **Gộp luôn thu nhập khác/hộ kinh doanh vào MVP**: bị từ chối vì đây là nhóm nghiệp vụ phức tạp hơn (nhiều luồng: hộ KD, cho thuê, ESOP, chứng khoán.). xử lý riêng theo ADR 0003 thay vì phình scope MVP.
