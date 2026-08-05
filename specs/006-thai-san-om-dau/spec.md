# Feature Specification: Thai sản và ốm đau

**Status**: Implemented

**Input**: Ước chế độ thai sản / ốm đau từ bình quân lương đóng BHXH và thời gian nghỉ.

**Tham chiếu**: F013; `quyen-loi-lao-dong.md`

## Locked decisions

- **Đã khóa** — 100% bình quân 6 tháng đóng BHXH (Đ.59 Luật BHXH 2024) × số tháng nghỉ + trợ cấp 1 lần 2× mức tham chiếu tại tháng sinh (Đ.58: 4,68tr trước / 5,06tr từ 01/07/2026 theo NĐ 161/2026).
- **Chốt** — V1 chỉ “lao động nữ sinh con” (con đầu 6 tháng; con thứ hai từ 01/07/2026: 7 tháng; sinh đôi +1 tháng/con từ con thứ 2). Nhận nuôi, mang thai hộ, chồng nghỉ khi vợ sinh → V2.
- V1 mode cơ bản 75% lương tháng liền kề / 24 ngày công; bệnh dài ngày → V2.
- **Đã thêm** TC-SICK-01 vào domain (5 ngày × 375.000 = 1.875.000); US2 có acceptance số học. Trần ngày/năm còn ⚠ Tầng 2 — chờ toàn văn Luật BHXH 2024.
- **Đã thêm** TC-MAT-03 (7 tháng + trợ cấp 1 lần × 2 con = 136.120.000; mức "mỗi con" ⚠ Tầng 2).
- ✅ xác nhận nguyên văn Đ.58 k.4 + Đ.43 Luật BHXH 41/2024 (bản gốc) — TC-MAT-03 và ốm đau hết ⚠.
- ✅ xác nhận nguyên văn Đ.14 k.1a Luật Dân số 113/2025 (`luat113-2025.pdf`); Đ.29 k.1 sửa thẳng Đ.139 BLLĐ; điều kiện "tại thời điểm sinh có một con đẻ còn sống" (NĐ 168 Đ.2); loại trừ Đ.52 k.2 Luật BHXH. Hiệu lực 01/07/2026.
- Phát hiện thêm (V2 — chế độ của chồng): nam nghỉ 10 ngày LV khi vợ sinh đôi **hoặc** con thứ hai (Đ.53 k.2c sửa đổi); ghi vào backlog V2.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ước thai sản (Priority: P1)

Hoa nhập bình quân 6 tháng = 18tr, nghỉ 6 tháng → ước tổng quyền lợi.

**Acceptance Scenarios**:

1. **Given** avg 18.000.000, sinh con đầu tháng 08/2026 (TC-MAT-01), **When** tính, **Then** 18e6 × 6 + 5.060.000 = 113.060.000 với breakdown tách tiền chế độ và trợ cấp 1 lần.
2. **Given** con thứ hai sau 01/07/2026 (TC-MAT-02), **When** tính, **Then** 7 tháng → 131.060.000.
3. **Given** sinh trước 01/07/2026, **When** tính, **Then** trợ cấp 1 lần dùng 4.680.000 (tham chiếu 2,34tr).
4. **Given** thiếu điều kiện đóng 6/12 tháng (user bỏ tick), **When** tính, **Then** cảnh báo có thể không đủ điều kiện.
5. **Given** sinh đôi lần đầu tháng 08/2026, avg 18tr (TC-MAT-03), **When** tính, **Then** 7 tháng + trợ cấp 1 lần 10.120.000 (2 con) = 136.120.000, breakdown ghi rõ "+1 tháng do sinh đôi" và trợ cấp theo số con.

---

### User Story 2 - Ốm đau (Priority: P2)

Nhập lương tháng liền kề và số ngày nghỉ → ước số tiền.

**Acceptance Scenarios**:

1. **Given** lương đóng BHXH tháng liền kề 12.000.000, nghỉ 5 ngày trong hạn (TC-SICK-01), **When** tính, **Then** 375.000/ngày × 5 = 1.875.000 kèm công thức 75%/24 ngày.
2. **Given** số ngày nghỉ vượt trần theo số năm đóng, **When** tính, **Then** cắt tại trần ruleset và thông báo rõ số ngày được tính.

### Edge Cases

- Ngày nghỉ vượt trần luật → cắt theo trần ruleset và thông báo.
- Lao động nam nghỉ khi vợ sinh — hỗ trợ nếu ruleset có; nếu chưa có thì out of scope ghi rõ.

## Requirements *(mandatory)*

- **FR-001**: MUST có mode thai sản và ốm đau.
- **FR-002**: MUST dùng tham số từ ruleset: % hưởng, số tháng nghỉ theo thứ tự con + ngày sinh, mức tham chiếu theo `as_of_date` (2,34tr / 2,53tr).
- **FR-003**: MUST NOT thu thập hồ sơ y tế.
- **FR-004**: Phạm vi V1 = lao động nữ sinh con (đầu/thứ hai/sinh đôi); nhận nuôi, mang thai hộ, chế độ của chồng → V2 (ghi rõ out-of-scope trên UI).
- **FR-005**: MUST hỏi ngày sinh dự kiến / thứ tự con để chọn đúng tháng nghỉ và mức tham chiếu.

## Success Criteria *(mandatory)*

- **SC-001**: TC-MAT-01, TC-MAT-02, TC-MAT-03, TC-SICK-01 pass.
- **SC-002**: Người dùng thấy rõ đây là ước tính, không phải quyết định chi trả BHXH.

## Assumptions

- Bình quân do user nhập (không kết nối VssID).
