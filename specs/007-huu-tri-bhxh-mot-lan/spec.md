# Feature Specification: Hưu trí và BHXH một lần (ước)

**Status**: Implemented

**Input**: So sánh ước lương hưu hàng tháng vs rút BHXH một lần; cảnh báo mạnh.

**Tham chiếu**: F015; Luật BHXH 2024; `quyen-loi-lao-dong.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - So sánh hai kịch bản (Priority: P1)

Ông Tuấn nhập số năm đóng và mức bình quân giả định, xem hai cột ước tính.

**Acceptance Scenarios**:

1. **Given** T1 = 4 năm (trước 2014), T2 = 10 năm, MBQTL đã trượt giá 12.000.000 (TC-LUMPSUM-01), **When** tính, **Then** BHXH một lần = (1,5×4 + 2×10) × 12e6 = 312.000.000 với breakdown hai giai đoạn.
2. **Given** user tham gia BHXH lần đầu 08/2025, **When** xem điều kiện, **Then** checklist chỉ hiện các trường hợp đặc biệt (không có diện “nghỉ việc 12 tháng”).
3. **Given** nữ, 25 năm đóng, MBQTL giả định 10.000.000 (TC-PENSION-01), **When** tính, **Then** tỷ lệ 65% → lương hưu ước 6.500.000/tháng, hiển thị cách ra tỷ lệ.
4. **Given** nam, 17 năm đóng, MBQTL 10.000.000 (TC-PENSION-02), **When** tính, **Then** tỷ lệ 42% → 4.200.000/tháng (nhánh nam 15-<20 năm dùng 40%+1%/năm).
5. **Given** đủ input tối thiểu, **When** tính, **Then** hiện ước một lần + ước hưu/tháng + checklist điều kiện + cảnh báo không đảo ngược.
6. **Given** user chưa đọc cảnh báo, **When** lần đầu vào màn, **Then** bắt buộc acknowledge disclaimer trước khi xem số.

### Edge Cases

- Công thức hưu phức tạp → kết quả ghi “khoảng ước tính”, không phải số chính thức.
- Điều kiện rút thay đổi theo luật. ruleset phải version.

## Requirements *(mandatory)*

- **FR-001**: MUST so sánh side-by-side hai kịch bản.
- **FR-002**: MUST bắt buộc hiện và xác nhận disclaimer.
- **FR-003**: MUST lấy điều kiện/hệ số từ ruleset gắn Luật BHXH 2024:
 - BHXH một lần (Đ.70, **đã khóa**): (1,5 × năm trước 2014 + 2 × năm từ 2014) × MBQTL đã nhân hệ số trượt giá (CV 340/BHXH-CSXH cho 2026); lẻ 1-6 tháng = ½ năm, 7-11 = 1 năm; <1 năm = số đã đóng, tối đa 2 tháng.
 - Điều kiện rút tách theo mốc tham gia trước/từ **01/07/2025** (checklist khác nhau).
- **FR-004**: MUST NOT khuyến nghị “nên rút” hay “nên chờ”.
- **FR-005**: Lương hưu = **giản lược có ghi chú giới hạn** (đã chốt): user nhập giới tính + số năm đóng + MBQTL giả định → ước tính. Tỷ lệ **đã khóa** theo Đ.66 Luật BHXH 2024: nữ 45%@15 năm +2%/năm (max 75%@30); nam ≥20 năm: 45%@20 +2%/năm (max 75%@35); nam 15-<20 năm: 40%@15 +1%/năm. Giới hạn ghi rõ: MBQTL thật phụ thuộc lịch sử đóng + trượt giá, app không tính thay.
- **FR-006**: MUST cho nhập hệ số trượt giá thủ công hoặc chọn bảng năm từ ruleset.

## Success Criteria *(mandatory)*

- **SC-001**: TC-LUMPSUM-01, TC-PENSION-01, TC-PENSION-02 pass (sai số ≤ 1 đồng).
- **SC-002**: 100% phiên tính có acknowledgement disclaimer được ghi nhận trong session.
- **SC-003**: Không có copy UI mang tính khuyến nghị đầu tư/rút.

## Assumptions

- Không kết nối dữ liệu thật từ VssID ở V2 đầu.
