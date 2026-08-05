# Phạm vi sản phẩm

**Cập nhật**: 2026-08-05 
**Tham chiếu**: [domain docs](./domain/), [specs](././specs/README.md)

## Tuyên bố sản phẩm

KVSalaryTools là ứng dụng **React Native + Expo** giúp người lao động Việt Nam **ước tính** thuế TNCN, bảo hiểm bắt buộc và quyền lợi tài chính liên quan, với **ruleset theo năm/giai đoạn** (2025 & 2026 bundled).

Không thay thế VssID, cơ quan thuế, hay tư vấn chuyên nghiệp.

## Ngoài phạm vi

- Nộp tờ khai / API thuế–BHXH chính thức (trừ khi có ADR mới).
- Tư vấn pháp lý cá nhân hóa.
- Cá nhân không cư trú / thuế doanh nghiệp (CIT).
- Thu thập CCCD, MST, số sổ BHXH bắt buộc.

## Trạng thái tính năng

| ID | Tính năng | Trạng thái |
|----|-----------|------------|
| F001 | Gross→Net + breakdown BH + thuế | ✅ Shipped |
| F002 | Net→Gross | ✅ Shipped |
| F003 | Người phụ thuộc & GTGC | ✅ Shipped |
| F004 | So sánh biểu thuế 2025 vs 2026 | ✅ Shipped |
| F005 | Vùng LTTV + trần BH | ✅ Shipped |
| F006 | Ruleset versioned (2025 & 2026) | ✅ Shipped |
| F007 | Quyết toán năm | ✅ Shipped |
| F008 | Nhiều nguồn (lương + vãng lai) | ✅ Shipped |
| F007b | Wizard ủy quyền vs tự quyết toán | ✅ Shipped |
| F009 | Tháng có thưởng / tháng 13 | ✅ Shipped |
| F010 | OT 150/200/300% | ✅ Shipped |
| F011 | Trợ cấp thôi việc / mất việc | ✅ Shipped |
| F012 | Trợ cấp thất nghiệp | ✅ Shipped |
| F013 | Thai sản / ốm đau | ✅ Shipped |
| F014 | Lưu kịch bản cục bộ + nhắc mùa vụ | ✅ Shipped (Calculator + Quyết toán) |
| F015 | BHXH một lần vs hưu | ✅ Shipped |
| F016 | Cho thuê nhà | ✅ Shipped |
| F017 | Hộ kinh doanh | ✅ Shipped |
| F018 | Chứng khoán / ESOP | ✅ Shipped |
| F016′ | HKD / cho thuê bản đơn giản (ADR 0003) | ✅ Shipped. chế độ «Ước nhanh» (tháng ×12) tách khỏi «Đầy đủ» |
| F019 | Remote update ruleset | ✅ Shipped (ADR 0008: manifest HTTPS + SHA-256, Settings) |

## Backlog (V1.1+)

| Hạng mục | Ghi chú |
|----------|---------|
| OT đêm | ✅ Shipped. toggle trên Calculator (Đ.98 / NĐ 145: 200/270/390%) |
| F014 mở rộng | ✅ Shipped. Quyết toán lưu/tải/chia sẻ; banner mùa vụ phân loại kind |
| Store capture | Docs + listing copy sẵn; **6 PNG** chờ capture thiết bị → [`docs/store/`](./store/) |
| Design QA sign-off | Checklist + `npm run qa:design`; phần visual còn chờ device |
| Info tips trên số liệu | ✅ Shipped. icon info + modal nguồn pháp lý |
| Đa ngôn ngữ (7 locale) | ✅ Shipped. mặc định vi; Cài đặt |
| Góp ý tác giả | ✅ Shipped. Phạm Huy Đức · kataro92@gmail.com |

## Ánh xạ spec ↔ F-ID

| Spec | F-ID | Spec file |
|------|------|-----------|
| `001-tinh-luong-gross-net` | F001, F002, F005, F006, F009, F010 | [spec.md](././specs/001-tinh-luong-gross-net/spec.md) |
| `002-nguoi-phu-thuoc-gtgc` | F003 | [spec.md](././specs/002-nguoi-phu-thuoc-gtgc/spec.md) |
| `003-so-sanh-bieu-thue` | F004 | [spec.md](././specs/003-so-sanh-bieu-thue/spec.md) |
| `004-quyet-toan-thue` | F007, F008, F007b | [spec.md](././specs/004-quyet-toan-thue/spec.md) |
| `005-quyen-loi-nghi-viec` | F011, F012 | [spec.md](././specs/005-quyen-loi-nghi-viec/spec.md) |
| `006-thai-san-om-dau` | F013 | [spec.md](././specs/006-thai-san-om-dau/spec.md) |
| `007-huu-tri-bhxh-mot-lan` | F015 | [spec.md](././specs/007-huu-tri-bhxh-mot-lan/spec.md) |
| `008-thu-nhap-khac` | F016–F018 | [spec.md](././specs/008-thu-nhap-khac/spec.md) |
| `009-app-shell-ux` | Shell, settings, onboarding | [spec.md](././specs/009-app-shell-ux/spec.md) |
