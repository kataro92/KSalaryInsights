# Feature Specification: Quyền lợi khi nghỉ việc

**Feature Branch**: `005-quyen-loi-nghi-viec`

**Created**: 2026-07-31

**Status**: Draft (clarified — số liệu luật đã khóa)

**Input**: Ước trợ cấp thôi việc/mất việc và trợ cấp thất nghiệp dựa trên thâm niên, lương căn cứ, quá trình đóng BHTN.

**Tham chiếu**: F011, F012; `quyen-loi-lao-dong.md`

## Clarifications

### Session 2026-07-31 (vòng xác minh #2)

- Q: Hệ số thôi việc/mất việc? → A: **Đã khóa** — thôi việc ½ tháng/năm (Đ.46 BLLĐ 2019); mất việc 1 tháng/năm, sàn 2 tháng (Đ.47). Thời gian tính = tổng thời gian − thời gian đã đóng BHTN − thời gian đã được chi trả; lẻ 1–<6 tháng = ½ năm, ≥6 tháng = 1 năm.
- Q: Trợ cấp thất nghiệp? → A: **Đã khóa** — 60% bình quân 6 tháng đóng BHTN gần nhất, trần **duy nhất** 5× LTTV tháng cuối đóng (bỏ nhánh 5× lương cơ sở khu vực NN); 12–36 tháng đóng → 3 tháng hưởng, +12 tháng → +1, tối đa 12 (Đ.38–39 Luật Việc làm 74/2025/QH15). Chờ việc = **10 ngày làm việc** (không phải 15); thời điểm hưởng = ngày LV thứ 11. Nhóm 12/36 áp mọi HĐ từ đủ 1 tháng (bỏ "mùa vụ").
- Q: Người đóng BHTN đầy đủ thì trợ cấp thôi việc = 0? → A: Đúng luật; UI MUST giải thích thay vì chỉ hiện 0.

### Session 2026-07-31 (đối chiếu bản gốc đợt 2 — `_verify_D`)

- Q: Checklist còn ghi "15 ngày"? → A: **Sửa** thành 10 ngày làm việc + ngày hưởng thứ 11 (Đ.38 k.1.d, Đ.39 k.3).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ước trợ cấp thôi việc (Priority: P1)

Hùng nhập 5 năm làm việc và lương căn cứ 20tr, xem ước trợ cấp thôi việc.

**Acceptance Scenarios**:

1. **Given** tổng 7 năm làm việc trong đó 5 năm đã đóng BHTN, base 20.000.000 (TC-SEVERANCE-01), **When** tính thôi việc, **Then** thời gian tính = 2 năm, kết quả = 20.000.000 kèm công thức và giải thích vì sao trừ thời gian BHTN.
2. **Given** toàn bộ thời gian đều đóng BHTN, **When** tính, **Then** kết quả 0 kèm giải thích “thời gian tính trợ cấp = 0 vì đã tham gia BHTN” (không phải lỗi).
3. **Given** thời gian tính lẻ 1 năm 7 tháng (TC-SEVERANCE-02), **When** tính, **Then** làm tròn thành 2 năm.
4. **Given** chế độ mất việc, thời gian tính 1 năm, base 20tr (TC-JOBLOSS-01), **When** tính, **Then** áp sàn 2 tháng = 40.000.000.

---

### User Story 2 - Ước BHTN (Priority: P2)

1. **Given** đóng BHTN 72 tháng, bình quân 6 tháng cuối 15.000.000, vùng I (TC-UE-01), **When** tính, **Then** 9.000.000/tháng × 6 tháng = 54.000.000 + checklist điều kiện (12/24 tháng hoặc 12/36 nếu HĐ 1–<12 tháng; nộp hồ sơ trong 3 tháng; **10 ngày làm việc** chưa có việc; thời điểm hưởng ngày LV thứ 11).
2. **Given** bình quân 50.000.000 vùng I (TC-UE-02), **When** tính, **Then** áp trần 5 × 5.310.000 = 26.550.000/tháng và ghi rõ “đã chạm trần” (không còn nhánh trần lương cơ sở).
3. **Given** đóng 10 tháng (TC-UE-03), **When** tính, **Then** thông báo không đủ điều kiện kèm lý do.

### Edge Cases

- Nhầm thôi việc vs mất việc → UI tách rõ hai chế độ (mức chênh gấp đôi + sàn 2 tháng).
- Thời gian tính trợ cấp = 0 do đóng BHTN đầy đủ → giải thích, không hiện lỗi.
- Trần BHTN theo LTTV **tại tháng cuối đóng** → cần `as_of_date`, không lấy LTTV hiện tại.

## Requirements *(mandatory)*

- **FR-001**: MUST tách calculator thôi việc và thất nghiệp.
- **FR-002**: MUST lấy hệ số/trần từ ruleset (thôi việc 0,5; mất việc 1,0 sàn 2 tháng; BHTN 60%/5×LTTV/3–12 tháng).
- **FR-003**: MUST hiện điều kiện hưởng dạng checklist (user tự tick — app không xác minh hồ sơ); checklist BHTN MUST gồm: 12/24 tháng (hoặc 12/36 nếu HĐ thời hạn từ đủ 1–<12 tháng); nộp hồ sơ trong 3 tháng; **10 ngày làm việc** chưa thuộc diện có việc; thời điểm hưởng = ngày LV thứ 11.
- **FR-004**: MUST disclaimer không thay BHXH/Sở LĐ.
- **FR-005**: MUST áp quy tắc trừ thời gian BHTN + làm tròn ½/1 năm khi tính thôi việc/mất việc.
- **FR-006**: MUST chọn LTTV trần BHTN theo tháng cuối đóng (`as_of_date`).

## Success Criteria *(mandatory)*

- **SC-001**: TC-SEVERANCE-01/02, TC-JOBLOSS-01, TC-UE-01/02/03 pass.
- **SC-002**: 100% màn hình có disclaimer.

## Assumptions

- User tự biết loại chấm dứt HĐ; app không phân loại pháp lý tự động từ mô tả tự do.
- User tự nhập thời gian đã đóng BHTN (app không đọc VssID).
