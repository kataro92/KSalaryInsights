# Feature Specification: Thu nhập khác

**Status**: Implemented

**Input**: Ước thuế cho thuê nhà, hộ kinh doanh, chứng khoán, (sau) ESOP theo tỷ lệ ruleset.

**Tham chiếu**: F016–F018; `thu-nhap-khac.md`

## Locked decisions

- **Đã khóa** (NĐ 141/2026): ≤1 tỷ/năm miễn GTGT+TNCN (vẫn thông báo mẫu 01/BĐS); >1 tỷ: GTGT 5% toàn bộ + TNCN 5% phần vượt 1 tỷ.
- **Khóa khung**. bỏ khoán từ 01/01/2026 (NQ 198/2025); ngưỡng miễn 1 tỷ; trên ngưỡng theo tỷ lệ ngành NĐ 68/2026 (biểu tỷ lệ nguyên văn cần nhập ruleset trước implement).
- **Đã khóa**. 0,1% giá chuyển nhượng từng lần, thống nhất từ 01/07/2026 (NĐ 253/2026).
- **Chốt tách riêng**. thuê nhà + CK + hộ KD ship trước; ESOP chờ đối chiếu văn bản gốc NĐ 253/2026 (2 cách đọc mâu thuẫn, xem domain).
- **Đã khóa** vào domain: GTGT 1% / 5% / 3% / 2%; TNCN 0,5% / 2% (cho thuê TS & đại lý 5%) / 1,5% / 1% (Luật GTGT 2024 Đ.12 k2; Luật 109/2025 Đ.7 k3; NĐ 68/2026). Nhóm >3 tỷ: phương pháp thu nhập 17%/20%. ~~Note còn lại: xác nhận doanh thu tính thuế TNCN (toàn bộ vs phần vượt)~~ → **đã đóng** ở vòng đối chiếu bản gốc: phần vượt ngưỡng (Đ.7 k3a Luật 109/2025).
- **Đã khóa cơ chế** bằng nguyên văn Đ.50 k3a NĐ 253/2026: khi bán chịu song song thuế TLTC (thu nhập = chi phí ghi sổ tại thời điểm phát hành; khấu trừ 10% tại lưu ký; quyết toán lũy tiến năm) + 0,1% chuyển nhượng. Bỏ feature-gate; User Story 4 chuyển thành calculator hai dòng thuế.
- **Thêm User Story 5**. calculator khấu trừ tại nguồn vãng lai (TC-CASUAL-01/02, ngưỡng 2tr → 5tr theo `as_of_date`). Riêng TC-CASUAL-03 (miễn quyết toán) kiểm chứng ở spec 004 (TC-QT-2026-02). SC hai spec tham chiếu chéo, logic dùng chung ruleset.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cho thuê nhà (Priority: P1)

Chị Mai nhập doanh thu thuê năm (hoặc tháng × 12), xem nghĩa vụ thuế theo ngưỡng 1 tỷ.

**Acceptance Scenarios**:

1. **Given** 20.000.000/tháng = 240tr/năm (TC-RENT-01), **When** tính, **Then** thuế = 0 vì ≤ 1 tỷ, kèm nhắc “vẫn phải thông báo doanh thu (mẫu 01/BĐS, hạn 31/01; riêng 2026 thêm mốc 31/07)”.
2. **Given** doanh thu 1,5 tỷ/năm (TC-RENT-02), **When** tính, **Then** GTGT 75tr + TNCN 25tr = 100tr với breakdown tách hai sắc thuế.
3. **Given** đúng 1 tỷ (TC-RENT-03), **When** tính, **Then** thuế = 0 (từ 1 tỷ trở xuống).

---

### User Story 2 - Chứng khoán (Priority: P2)

1. **Given** giá bán 100.000.000 sau 01/07/2026 (TC-SEC-01), **When** tính, **Then** thuế = 100.000 (0,1%).

---

### User Story 3 - Hộ kinh doanh (Priority: P2)

1. **Given** doanh thu 800tr/năm (TC-HKD-01), **When** tính, **Then** thuế = 0 + nhắc nghĩa vụ kê khai doanh thu.
2. **Given** bán tạp hóa 1,5 tỷ/năm (TC-HKD-02), **When** tính theo doanh thu, **Then** GTGT = 15.000.000 (1% toàn bộ) + TNCN = 2.500.000 (0,5% × phần vượt 1 tỷ) tách hai dòng, kèm gợi ý so sánh với phương pháp (doanh thu − chi phí) × 15%.

---

### User Story 4 - ESOP (Priority: P3: cơ chế đã khóa)

1. **Given** ESOP chi phí ghi sổ 100tr, bán 300tr sau 01/07/2026 (TC-ESOP-01), **When** tính, **Then** hai dòng: khấu trừ TLTC 10tr (ghi chú “quyết toán lũy tiến cuối năm trên 100tr gộp vào TLTC”) + thuế chuyển nhượng 300k.
2. **Given** không biết chi phí ghi sổ, **When** chọn fallback, **Then** dùng số CP × mệnh giá − tiền đã trả (âm → 0) và ghi rõ đây là cách xác định thay thế theo NĐ 253/2026.

---

### User Story 5 - Thu nhập vãng lai: khấu trừ tại nguồn (Priority: P2)

Tùng nhận thù lao dịch vụ lẻ, muốn biết bên chi trả khấu trừ bao nhiêu và mình còn nghĩa vụ gì.

**Acceptance Scenarios**:

1. **Given** chi trả 10.000.000 (≥ ngưỡng. TC-CASUAL-01), **When** tính, **Then** khấu trừ 10% = 1.000.000, thực nhận 9.000.000, kèm ghi chú phần này tổng hợp khi quyết toán (nếu thuộc diện).
2. **Given** chi trả 4.000.000 tháng 08/2026 (< ngưỡng 5tr mới. TC-CASUAL-02), **When** tính, **Then** không khấu trừ tại nguồn + cảnh báo vẫn là thu nhập chịu thuế khi quyết toán.
3. **Given** cùng 4.000.000 nhưng năm thuế 2025 (ngưỡng cũ 2tr), **When** tính, **Then** khấu trừ 400.000: chứng minh ngưỡng chọn theo ruleset năm (kỳ 2026 = 5tr cả năm theo Đ.69.1.a).

### Edge Cases

- Rate/ngưỡng đổi tại 01/07/2026 (vãng lai, CK) → chọn theo `as_of_date`, không theo năm.
- User nhầm lẫn giữa GTGT và TNCN → nhãn tách rõ hai sắc thuế.
- Cho thuê + hộ KD cùng lúc: ngưỡng tính trên tổng doanh thu hoạt động tương ứng. ghi chú giới hạn ước tính.

## Requirements *(mandatory)*

- **FR-001**: MUST tách từng loại thu nhập, không cộng nhầm vào gross HĐLĐ.
- **FR-002**: MUST đọc rate/ngưỡng từ ruleset theo `income_type` + `as_of_date`.
- **FR-003**: Ruleset hộ KD MUST chứa biểu tỷ lệ ngành đã khóa trong domain (GTGT 1/5/3/2%; TNCN 0,5/2/1,5/1%, cho thuê TS & đại lý 5%); TNCN theo tỷ lệ tính trên **phần doanh thu vượt ngưỡng** (đã chốt theo Đ.7 k3a Luật 109/2025 bản gốc. hết note xác minh).
- **FR-004**: Calculator ESOP MUST hiển thị hai dòng nghĩa vụ (TLTC khấu trừ 10% + 0,1% chuyển nhượng) và ghi chú phần TLTC còn quyết toán lại cuối năm; hỗ trợ fallback mệnh giá.
- **FR-005**: Màn hình miễn thuế (≤ ngưỡng) MUST hiển thị nghĩa vụ kê khai/thông báo còn lại, không chỉ “0 đồng”.
- **FR-006**: Calculator vãng lai MUST áp ngưỡng khấu trừ tại nguồn **5.000.000 đ/lần cho cả kỳ tính thuế 2026** (NĐ 253 Đ.69.1.a. không tách H1/H2) và ghi chú nghĩa vụ quyết toán/điều kiện miễn (chi tiết miễn quyết toán thuộc spec 004). Ruleset ≤2025 dùng ngưỡng 2.000.000.

## Success Criteria *(mandatory)*

- **SC-001**: TC-CASUAL-01/02, TC-RENT-01/02/03, TC-HKD-01/02, TC-SEC-01, TC-ESOP-01 pass (TC-CASUAL-03 kiểm chứng tại spec 004 / TC-QT-2026-02).
- **SC-002**: Không hard-code rate/ngưỡng trong UI component.

## Assumptions

- Cá nhân cư trú; phương pháp kê khai đơn giản hóa.
