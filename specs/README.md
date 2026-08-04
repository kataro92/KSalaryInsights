# Specs tính năng

Thứ tự theo [docs/product/scope.md](../docs/product/scope.md):

| # | Thư mục | Giai đoạn | Trạng thái spec |
|---|---------|-----------|-----------------|
| 001 | [tinh-luong-gross-net](./001-tinh-luong-gross-net/spec.md) | MVP | Planned ([plan.md](./001-tinh-luong-gross-net/plan.md), [tasks.md](./001-tinh-luong-gross-net/tasks.md)) |
| 002 | [nguoi-phu-thuoc-gtgc](./002-nguoi-phu-thuoc-gtgc/spec.md) | MVP | Planned ([plan.md](./002-nguoi-phu-thuoc-gtgc/plan.md), [tasks.md](./002-nguoi-phu-thuoc-gtgc/tasks.md)) |
| 003 | [so-sanh-bieu-thue](./003-so-sanh-bieu-thue/spec.md) | MVP | Planned ([plan.md](./003-so-sanh-bieu-thue/plan.md), [tasks.md](./003-so-sanh-bieu-thue/tasks.md)) |
| 004 | [quyet-toan-thue](./004-quyet-toan-thue/spec.md) | V1 | Draft clarified (bổ sung quy tắc vãng lai NĐ 253/2026 + wizard) |
| 005 | [quyen-loi-nghi-viec](./005-quyen-loi-nghi-viec/spec.md) | V1 | Draft clarified — hệ số luật đã khóa |
| 006 | [thai-san-om-dau](./006-thai-san-om-dau/spec.md) | V1 | Draft clarified — số liệu chính đã khóa |
| 007 | [huu-tri-bhxh-mot-lan](./007-huu-tri-bhxh-mot-lan/spec.md) | V2 | Draft clarified — Đ.66 + Đ.70 đã khóa |
| 008 | [thu-nhap-khac](./008-thu-nhap-khac/spec.md) | V2 | Draft clarified — toàn bộ tham số đã khóa (gồm ESOP) |

Active feature (Spec Kit): xem `.specify/feature.json` (mặc định 001).

**UI/UX**: mọi `/speckit-plan` MUST tuân theo [docs/product/design-system.md](../docs/product/design-system.md) (Flat Design + linh vật "Ngài Miu" — mèo tuxedo trung niên đeo kính, phong thái bá tước).

Bước tiếp theo khi sẵn sàng code: cả 3 spec MVP (001–003) đã có `plan.md` + `tasks.md`. Thứ tự triển khai theo phụ thuộc: `/speckit-implement` 001 trước (engine nền tảng — grossToNet/netToGross), sau đó 002 (mở rộng breakdown GTGC) và 003 (orchestration so sánh trên engine 001) có thể chạy song song vì cả hai chỉ phụ thuộc 001, không phụ thuộc lẫn nhau.

