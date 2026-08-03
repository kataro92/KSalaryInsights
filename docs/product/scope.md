# Phạm vi sản phẩm (Scope)

**Cập nhật**: 2026-07-31  
**Căn cứ**: [user-needs.md](../research/user-needs.md), [personas.md](../research/personas.md), [competitor-matrix.md](../research/competitor-matrix.md), domain docs.

## Tuyên bố sản phẩm

KVSalaryTools là ứng dụng **React + Expo** giúp người lao động Việt Nam **ước tính** thuế TNCN, bảo hiểm bắt buộc và quyền lợi tài chính liên quan, với **bộ tham số luật theo năm/giai đoạn** có thể cập nhật.

Không thay thế VssID, cơ quan thuế, hay tư vấn chuyên nghiệp.

## Ngoài phạm vi (chung)

- Nộp tờ khai / kết nối API thuế–BHXH chính thức (trừ khi có ADR sau).
- Tư vấn pháp lý cá nhân hóa.
- Tính cho cá nhân không cư trú / DN (CIT) ở giai đoạn đầu.
- Thu thập CCCD, MST, số sổ BHXH bắt buộc.

## MVP (Foundation)

Mục tiêu: P1 Minh hoàn thành job “hiểu net và so sánh luật 2025 vs 2026”.

| ID | Tính năng | Nhu cầu | Domain |
|----|-----------|---------|--------|
| F001 | Tính gross→net + breakdown BH + thuế | N01, N19 | thue-tncn, bhxh-bhyt-bhtn |
| F002 | Tính net→gross (đàm phán offer) | N02 | như trên |
| F003 | Người phụ thuộc & GTGC theo ruleset năm | N03 | thue-tncn |
| F004 | So sánh biểu thuế / GTGC cũ vs mới trên cùng input | N04 | thue-tncn |
| F005 | Chọn vùng LTTV + áp trần BH | N05 | bhxh-bhyt-bhtn |
| F006 | Kiến trúc ruleset versioned (bundled tối thiểu 2025 & 2026) | N17 | rules-versioning |

**Tiêu chí xong MVP**: TC-TNCN-2025-01, TC-TNCN-2026-01, TC-TNCN-2026-02, TC-BH-2026-01/02 pass; UI có breakdown + disclaimer + nguồn.

## V1 (Mở rộng hành trình)

Ưu tiên đầu V1 (theo research bổ sung + [ADR 0003](../decisions/0003-ho-kd-priority.md)): quyết toán đa nguồn + wizard thủ tục; cân nhắc HKD/cho thuê sớm (có thể V1.1).

| ID | Tính năng | Nhu cầu |
|----|-----------|---------|
| F007 | Quyết toán năm (ước nộp thêm/hoàn) | N07 |
| F008 | Nhiều nguồn (lương + vãng lai) | N08 |
| F007b | Wizard ủy quyền vs tự quyết toán + checklist/hạn | (bổ sung research) |
| F009 | Mô phỏng tháng có thưởng Tết | N09 |
| F016′ | Thuế hộ KD / cho thuê (bản đơn giản) — có thể V1.1 | N14, N15 |
| F010 | OT 150/200/300% | N06 |
| F011 | Trợ cấp thôi việc / mất việc (ước) | N10 |
| F012 | Trợ cấp thất nghiệp (ước) | N11 |
| F013 | Thai sản / ốm đau (ước) | N12 |
| F014 | Lưu kịch bản cục bộ + nhắc hạn mùa vụ | N18 |

## V2+ (Thu nhập khác & hưu)

| ID | Tính năng | Nhu cầu |
|----|-----------|---------|
| F015 | BHXH một lần vs hưu (ước + cảnh báo) | N13 |
| F016 | Cho thuê nhà | N14 |
| F017 | Hộ kinh doanh | N15 |
| F018 | Chứng khoán / ESOP | N16 |
| F019 | Remote update ruleset (nếu ADR chấp thuận) | N17 nâng cao |

## Thứ tự spec (Phase 4)

Khớp kế hoạch tài liệu:

1. `001-tinh-luong-gross-net` — F001, F002, F005, F006 (một phần)  
2. `002-nguoi-phu-thuoc-gtgc` — F003  
3. `003-so-sanh-bieu-thue` — F004  
4. `004-quyet-toan-thue` — F007, F008  
5. `005-quyen-loi-nghi-viec` — F011, F012  
6. `006-thai-san-om-dau` — F013  
7. `007-huu-tri-bhxh-mot-lan` — F015  
8. `008-thu-nhap-khac` — F016–F018  

OT (F010) và thưởng Tết (F009) có thể gộp vào mở rộng 001 hoặc spec phụ sau MVP.

## Định nghĩa xong tài liệu (Definition of Ready cho code)

Trước `/speckit-plan` kỹ thuật React/Expo:

- [x] Constitution  
- [x] Research + domain đủ cho MVP  
- [x] Scope + rules-versioning  
- [ ] Spec 001–003 (MVP) đã clarify  
- [ ] Checklist chất lượng requirement cho MVP  
