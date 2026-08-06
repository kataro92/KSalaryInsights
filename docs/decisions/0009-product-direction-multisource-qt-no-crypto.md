# ADR 0009: Hướng sản phẩm — QT đa nguồn (1c) · crypto ngoài phạm vi (2a)

- **Status**: Accepted  
- **Date**: 2026-08-06  
- **Context**: Nghiên cứu nhu cầu (NLĐ, freelancer/HKD, coin). Chủ sản phẩm chọn: cân bằng NLĐ + **tổng hợp quyết toán đa nguồn**; tài sản mã hóa / coin **không** làm công cụ tính, chỉ ghi ngoài phạm vi.

## Decision

1. **Trọng tâm 6–12 tháng**: giữ USP lương Gross↔Net + QT lương; mở rộng **F020 — tổng hợp thuế năm đa nguồn** (lương + vãng lai + HKD + cho thuê + CK/ESOP đã ước) thành một bảng ước trên máy. Không nộp tờ khai.
2. **Crypto / tài sản mã hóa (TT 32/2026, thí điểm VASP)**: **ngoài phạm vi tính toán**. UI MUST có một dòng disclaimer rõ. Không ước 0,1%, không nhật ký trade, không import sàn ngoại.
3. Freelancer / hộ KD: tiếp tục qua module HKD hiện có; F020 chỉ **gộp kết quả ước** người dùng đã nhập/tính, không thay wizard kê khai 02/CNKD hay hóa đơn điện tử.

## Consequences

- Roadmap: F020 là hạng mục V1.1 chính; P0 so-offer / preset BH vẫn khuyến nghị song song nhưng không chặn F020.
- Giảm rủi ro pháp lý / hỗ trợ khi VASP chưa ổn định; tránh hiểu nhầm “mọi trade Binance = 0,1%”.
- Scope.md và listing copy phải phản ánh: có HKD/thu nhập khác + tổng hợp năm; **không** có thuế coin.

## Alternatives rejected

- **Chỉ siết NLĐ (1a)**: bỏ qua nhu cầu tự QT đa nguồn đã xác nhận.  
- **Ước nhanh crypto 0,1% (2b) / công cụ coin đầy đủ (2c)**: bị từ chối vì quy định thí điểm + phạm vi VASP hẹp; ưu tiên disclaimer.
