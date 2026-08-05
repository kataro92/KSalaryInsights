# ADR 0004: Bộ công cụ tính toán Offline độc lập (Pure Offline Calculation Engine & Precision Strategy)

- **Status**: Accepted 
- **Date**: 2026-08-03 
- **Context**: Ứng dụng KVSalaryTools hỗ trợ người lao động tính thuế, bảo hiểm và lương Gross ↔ Net với yêu cầu bảo mật quyền riêng tư tuyệt đối (Constitution V), hoạt động không cần mạng và đảm bảo độ chính xác ≤ 1 VNĐ.

## Decision

1. **Pure Offline Engine**: Toàn bộ logic tính toán được thiết kế thành một thư viện thuần TypeScript (`src/engine/`), không phụ thuộc vào React, UI components, trình duyệt hay bất kỳ API/máy chủ backend nào.
2. **Quy tắc làm tròn số nguyên**: Mọi khoản trích đóng bảo hiểm (BHXH, BHYT, BHTN) và thuế TNCN được làm tròn đến hàng đơn vị (đồng VNĐ) ở ngay từng bước trung gian bằng `Math.round()`. Tránh việc giữ số thực (float) dở dang gây lệch tổng số cuối cùng.
3. **Net → Gross bằng Binary Search**: Thay vì duy trì các công thức quy đổi ngược phức tạp và dễ sai sót khi biểu thuế/trần bảo hiểm thay đổi, engine sử dụng thuật toán Tìm kiếm Nhị phân (Binary Search) để tìm giá trị Gross tương ứng từ Net mong muốn với tiêu chí hội tụ ≤ 1 VNĐ.
4. **Test Driven by Hand Cases** (Constitution IV): 100% logic engine phải vượt qua bộ kiểm thử Jest khớp từng số tiền lẻ với các test case tính tay trong `docs/domain/`.

## Consequences

- Đảm bảo quyền riêng tư tuyệt đối cho người dùng (zero data leakage).
- Tốc độ tính toán siêu nhanh (< 5ms cho cả Gross → Net lẫn Net → Gross).
- Engine có thể dùng lại dễ dàng trên nhiều nền tảng (React Native app, Web app, CLI tool).
- Cần viết suite test bao phủ đầy đủ các edge cases (mức lương chạm trần, lương nhỏ hơn lương tối thiểu vùng.).

## Alternatives rejected

- **Tính toán trên Server API**: Bị từ chối vì vi phạm Constitution V (riêng tư) và làm gián đoạn trải nghiệm người dùng khi mạng chập chờn.
- **Dùng công thức Net → Gross cứng**: Bị từ chối vì biểu thuế 5 bậc mới (2026) và trần bảo hiểm biến động theo tháng (`as_of_date`) sẽ làm các công thức ngược bị lỗi thời nhanh chóng.
