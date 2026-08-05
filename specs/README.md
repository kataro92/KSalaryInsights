# Specs tính năng

Thứ tự theo [docs/product/scope.md](../docs/product/scope.md). **Ánh xạ F-ID**: mã thư mục `00N` gộp một hoặc nhiều F-ID trong scope (không 1:1) — xem bảng ánh xạ trong `scope.md`.

| # | Thư mục | F-ID | Giai đoạn | Trạng thái spec |
|---|---------|------|-----------|-----------------|
| 001 | [tinh-luong-gross-net](./001-tinh-luong-gross-net/spec.md) | F001, F002, F005, F006′ | MVP | Implemented ([plan.md](./001-tinh-luong-gross-net/plan.md), [tasks.md](./001-tinh-luong-gross-net/tasks.md)) |
| 002 | [nguoi-phu-thuoc-gtgc](./002-nguoi-phu-thuoc-gtgc/spec.md) | F003 | MVP | Implemented ([plan.md](./002-nguoi-phu-thuoc-gtgc/plan.md), [tasks.md](./002-nguoi-phu-thuoc-gtgc/tasks.md)) |
| 003 | [so-sanh-bieu-thue](./003-so-sanh-bieu-thue/spec.md) | F004 | MVP | Implemented ([plan.md](./003-so-sanh-bieu-thue/plan.md), [tasks.md](./003-so-sanh-bieu-thue/tasks.md)) |
| 004 | [quyet-toan-thue](./004-quyet-toan-thue/spec.md) | F007, F008, F007b | V1 | Implemented ([plan.md](./004-quyet-toan-thue/plan.md), [tasks.md](./004-quyet-toan-thue/tasks.md)) |
| 005 | [quyen-loi-nghi-viec](./005-quyen-loi-nghi-viec/spec.md) | F011, F012 | V1 | Planned ([plan.md](./005-quyen-loi-nghi-viec/plan.md), [tasks.md](./005-quyen-loi-nghi-viec/tasks.md)) |
| 006 | [thai-san-om-dau](./006-thai-san-om-dau/spec.md) | F013 | V1 | Planned ([plan.md](./006-thai-san-om-dau/plan.md), [tasks.md](./006-thai-san-om-dau/tasks.md)) |
| 007 | [huu-tri-bhxh-mot-lan](./007-huu-tri-bhxh-mot-lan/spec.md) | F015 | V2 | Planned ([plan.md](./007-huu-tri-bhxh-mot-lan/plan.md), [tasks.md](./007-huu-tri-bhxh-mot-lan/tasks.md)) |
| 008 | [thu-nhap-khac](./008-thu-nhap-khac/spec.md) | F016–F018 | V2 | Planned ([plan.md](./008-thu-nhap-khac/plan.md), [tasks.md](./008-thu-nhap-khac/tasks.md)) |
| 009 | [app-shell-ux](./009-app-shell-ux/spec.md) | App shell (splash, loading, settings, layout, UI/UX NFR) | Foundation | Implemented ([plan.md](./009-app-shell-ux/plan.md), [tasks.md](./009-app-shell-ux/tasks.md)) |

Active feature (Spec Kit): xem `.specify/feature.json` (hiện tại `009-app-shell-ux`).

**UI/UX**: mọi `/speckit-plan` MUST tuân theo [docs/product/design-system.md](../docs/product/design-system.md) (Flat Design + linh vật "Ngài Miu" — mèo tuxedo trung niên đeo kính, phong thái bá tước).

**Trạng thái tài liệu (2026-08-05)**: cả 8 spec đã có `spec.md` (clarified) + `plan.md` + `tasks.md` + checklist. Sẵn sàng `/speckit-implement` theo thứ tự phụ thuộc: **001 → (002 ∥ 003) → 004+**.

