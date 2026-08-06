# Spec tính năng

**Cập nhật**: 2026-08-06

- F001–F022: **đã triển khai** trên `master` (gồm F020 tổng hợp QT đa nguồn, F021 so 2 offer, F022 preset BH).
- Crypto ngoài phạm vi (ADR 0009).

Phạm vi: [docs/product/scope.md](../docs/product/scope.md).  
UI: [docs/product/design-system.md](../docs/product/design-system.md).

| # | Thư mục | F-ID | Spec | Plan/Tasks |
|---|---------|------|------|------------|
| 001–010 | (shipped) | F001–F019 | xem thư mục | Shipped |
| 011 | tong-hop-qt-da-nguon | F020 | [spec](./011-tong-hop-qt-da-nguon/spec.md) | ✅ Shipped · [plan](./011-tong-hop-qt-da-nguon/plan.md) · [tasks](./011-tong-hop-qt-da-nguon/tasks.md) |
| 012 | so-sanh-hai-offer | F021 | [spec](./012-so-sanh-hai-offer/spec.md) | ✅ Shipped · [plan](./012-so-sanh-hai-offer/plan.md) · [tasks](./012-so-sanh-hai-offer/tasks.md) |
| 013 | preset-muc-dong-bh | F022 | [spec](./013-preset-muc-dong-bh/spec.md) | ✅ Shipped · [plan](./013-preset-muc-dong-bh/plan.md) · [tasks](./013-preset-muc-dong-bh/tasks.md) |

**Contracts**

- 009: [preferences-schema.json](./009-app-shell-ux/contracts/preferences-schema.json)
- 011: [annual-multi-source.schema.json](./011-tong-hop-qt-da-nguon/contracts/annual-multi-source.schema.json)
- 012: [offer-compare.schema.json](./012-so-sanh-hai-offer/contracts/offer-compare.schema.json)
- 013: [insurance-base-preset.schema.json](./013-preset-muc-dong-bh/contracts/insurance-base-preset.schema.json)
