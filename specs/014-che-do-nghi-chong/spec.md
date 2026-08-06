# Feature Specification: Chế độ nghỉ của chồng khi vợ sinh (Đ.53)

**Status**: Implemented

**Input**: Ước số ngày nghỉ làm việc và tiền chế độ thai sản cho lao động nam khi vợ sinh con.

**Tham chiếu**: F013 backlog V2 từ spec 006; `quyen-loi-lao-dong.md` Đ.53/59; Luật Dân số 113/2025 Đ.29 k.2.

## Locked decisions

- **Số ngày** (Đ.53 k.2 Luật BHXH 41/2024):
  - Sinh thường (1 con): **5** ngày làm việc.
  - Phẫu thuật hoặc sinh dưới 32 tuần (1 con): **7** ngày làm việc.
  - Sinh đôi: **10** ngày; sinh ba trở lên: +**3** ngày/con từ con thứ 3.
  - Sinh đôi phải phẫu thuật: **14** ngày; sinh ba+ phẫu thuật: +**3** ngày/con từ con thứ 3.
- **Sửa từ 01/07/2026** (Luật Dân số): vợ sinh **con thứ hai** hoặc sinh đôi → nam nghỉ **10** ngày LV (áp khi ngày sinh ≥ 01/07/2026; nếu đã thuộc nhánh sinh đôi/phẫu thuật nhiều con thì lấy số ngày lớn hơn theo bảng trên).
- **Mức tiền** (Đ.59 k.1–2): `ngày × (100% × bình quân 6 tháng đóng BHXH / 24)`.
- **Phạm vi**: chỉ tiền ngày nghỉ của chồng. Trợ cấp một lần khi vợ không đủ điều kiện (Đ.58), nhận nuôi, mang thai hộ → vẫn V2 / ngoài scope màn này.
- **Checklist**: nhắc nghỉ trong **60 ngày** kể từ ngày vợ sinh (Đ.53 k.3); không bắt user nhập lịch nghỉ cụ thể ở MVP.

## User Scenarios & Testing

### User Story 1 - Ước nghỉ của chồng (P1)

Nam nhập bình quân 6 tháng, ngày sinh của vợ, số con, thứ tự con, có/không phẫu thuật hoặc sinh non → xem số ngày và tiền ước tính.

**Acceptance Scenarios**:

1. **Given** avg 18.000.000, vợ sinh thường 1 con đầu, **When** tính, **Then** 5 ngày × (18e6/24) = **3.750.000**.
2. **Given** avg 10.000.000, vợ sinh phải phẫu thuật 1 con, **When** tính, **Then** 7 × (10e6/24) = **2.916.667**.
3. **Given** vợ sinh đôi (không phẫu thuật), **When** tính, **Then** 10 ngày.
4. **Given** vợ sinh ba phải phẫu thuật, **When** tính, **Then** 14 + 3 = **17** ngày.
5. **Given** vợ sinh con thứ hai (1 con) ngày ≥ 01/07/2026, **When** tính, **Then** **10** ngày (sửa Luật Dân số).
6. **Given** cùng case trước 01/07/2026 và sinh thường, **When** tính, **Then** **5** ngày.

### Edge Cases

- Số con < 1 → lỗi nhập liệu.
- Bình quân ≤ 0 → lỗi nhập liệu.
- Ngày sinh không YYYY-MM-DD → lỗi.
- Sinh đôi + con thứ hai: dùng bảng sinh đôi (10 / 14…), không cộng chồng quy tắc.

## Requirements

- **FR-001**: MUST có màn / lối vào từ hub quyền lợi cho chế độ nghỉ của chồng.
- **FR-002**: MUST resolve số ngày từ ruleset + ngày sinh + số con + thứ tự con + cờ phẫu thuật/sinh non.
- **FR-003**: MUST tính tiền = ngày × rate × avg / divisor (rate=1, divisor=24 mặc định ruleset).
- **FR-004**: MUST hiện disclaimer + `legal_sources`; MUST NOT thu hồ sơ y tế.
- **FR-005**: MUST cập nhật ghi chú «Chưa hỗ trợ V2» để bỏ mục chế độ chồng (giữ nhận nuôi / mang thai hộ).

## Success Criteria

- **SC-001**: TC-PAT-01…TC-PAT-05 (acceptance trên) pass trong unit test.
- **SC-002**: Người dùng thấy rõ đây là ước tính ngày nghỉ + tiền, không phải quyết định chi trả BHXH.

## Assumptions

- Bình quân do user nhập (không VssID).
- Cờ «phẫu thuật hoặc sinh dưới 32 tuần» gộp một toggle (MVP).
- Không ước trợ cấp một lần cho chồng khi vợ thiếu điều kiện.
