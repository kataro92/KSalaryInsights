# Feature Specification: Tính lương Gross–Net

**Status**: Implemented

**Input**: Người dùng nhập lương gross hoặc net, chọn năm luật và vùng, xem thực nhận/cần trả kèm breakdown BHXH/BHYT/BHTN và thuế TNCN theo ruleset.

**Tham chiếu**: `docs/domain/thue-tncn.md`, `docs/domain/bhxh-bhyt-bhtn.md`, `docs/product/rules-versioning.md`, scope F001/F002/F005/F006

## Locked decisions

- Mặc định mức đóng BH = gross; cho phép sửa riêng.
- Đoàn phí: tắt mặc định; toggle tùy chọn.
- Làm tròn đến đồng (số nguyên VND) ở mỗi khoản BH và thuế cuối; ghi rõ trong breakdown.
- Tìm kiếm nhị phân / lặp trên gross đến khi net khớp trong sai số ≤ 1 đồng.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gross sang Net có breakdown (Priority: P1)

Minh nhập gross, chọn năm 2026 và vùng I, xem net và từng khoản trừ.

**Why this priority**: Job cốt lõi; cửa vào sản phẩm.

**Independent Test**: Nhập TC-TNCN-2026-01 / TC-BH-2026-01 → khớp số trong domain docs.

**Acceptance Scenarios**:

1. **Given** ruleset 2026-H1 (tháng 01–06/2026), **When** nhập gross 30.000.000, 0 NPT, vùng I, mức BH = gross, **Then** BH NLĐ = 3.150.000, thuế = 635.000, net = 26.065.000 và breakdown hiển thị đủ các dòng.
2. **Given** cùng input với ruleset 2025, **When** tính, **Then** khớp TC-TNCN-2025-01 (thuế 1.627.500, net 25.222.500).
3. **Given** mức BH 60.000.000 vùng I, **When** đổi tháng tính từ 03/2026 sang 08/2026, **Then** tổng BH NLĐ đổi từ 5.046.000 sang 5.407.000 (trần 46,8tr → 50,6tr theo NĐ 161/2026: TC-BH-2026H2-01).
4. **Given** bất kỳ kết quả nào, **When** xem màn hình, **Then** có disclaimer ước tính + liệt kê nguồn pháp lý của ruleset đang dùng.

---

### User Story 2 - Net sang Gross (Priority: P2)

Minh biết thực nhận mong muốn, tìm gross tương ứng để đàm phán offer.

**Why this priority**: Nhu cầu N02 cao khi nhảy việc.

**Independent Test**: Chọn net mục tiêu từ kết quả US1, chạy net→gross → gross quay lại ±1 đồng.

**Acceptance Scenarios**:

1. **Given** ruleset 2026, 0 NPT, vùng I, **When** nhập net = 26.065.000, **Then** gross đề xuất ≈ 30.000.000 (sai số ≤ 1 đồng sau khi tính lại).
2. **Given** net nhập vào nhỏ hơn net tối thiểu khả thi (net tính từ gross = lương tối thiểu vùng đang chọn), **When** tính, **Then** hệ thống thông báo "không khả thi với vùng/tham số hiện tại" kèm net tối thiểu tham khảo. KHÔNG trả về gross dưới lương tối thiểu vùng.

---

### User Story 3 - Trần bảo hiểm (Priority: P3)

Khoa nhập mức đóng trên trần BHXH để kiểm tra không bị trừ vượt trần.

**Why this priority**: Edge case lương cao; độ tin cậy.

**Independent Test**: TC-BH-2026-02.

**Acceptance Scenarios**:

1. **Given** mức BH 60.000.000, vùng I, ruleset 2026, tháng tính 03/2026 (trần H1 = 46,8tr), **When** tính, **Then** BH NLĐ = 5.046.000 theo domain (tháng ≥ 07/2026 xem TC-BH-2026H2-01).

### Edge Cases

- Gross ≤ 0 hoặc không phải số → báo lỗi nhập, không tính.
- TNTT ≤ 0 → thuế = 0, vẫn hiện breakdown.
- Đổi vùng làm thay đổi trần BHTN.
- Không có mạng: vẫn tính được với ruleset bundle.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST cho phép nhập gross hoặc net (chế độ chuyển đổi).
- **FR-002**: Hệ thống MUST chọn ruleset theo năm kỳ tính thuế do người dùng chọn (mặc định năm hiện tại nếu có ruleset); tham số bảo hiểm (trần theo lương cơ sở/mức tham chiếu) MUST chọn theo **tháng tính** (`as_of_date`) vì có thể đổi giữa năm (2026: 01/07 đổi trần).
- **FR-003**: Hệ thống MUST tính BH NLĐ (8%+1,5%+1%) với trần BHXH/BHYT và trần BHTN theo vùng.
- **FR-004**: Hệ thống MUST tính thuế TNCN theo biểu lũy tiến của ruleset (sau GTGC. mặc định 0 NPT ở feature này nếu chưa có F003 (spec 002); khi F003 có sẵn thì dùng số NPT).
- **FR-005**: Hệ thống MUST hiển thị breakdown từng bước và net/gross kết quả.
- **FR-006**: Hệ thống MUST hiển thị disclaimer và `legal_sources` của ruleset.
- **FR-007**: Hệ thống MUST NOT yêu cầu CCCD/MST/sổ BHXH.
- **FR-008**: Hệ thống MUST hỗ trợ chọn vùng I–IV.
- **FR-009**: Hệ thống MUST cho phép chỉnh mức lương đóng BH độc lập với gross.
- **FR-010**: Kết quả MUST khớp các test case domain được liệt kê trong Success Criteria (sai số ≤ 1 đồng).

### Key Entities

- **Ruleset**: tham số luật theo giai đoạn.
- **SalaryInput**: gross/net, vùng, mức BH, năm thuế, số NPT (0 nếu chưa có module phụ thuộc).
- **SalaryBreakdown**: các dòng BH, GTGC, TNTT, thuế theo bậc, net.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% test case TC-TNCN-2025-01, TC-TNCN-2026-01, TC-BH-2026-01, TC-BH-2026-02, TC-BH-2026H2-01 pass.
- **SC-002**: Net→gross→net khép kín với sai số ≤ 1 đồng trên ít nhất 10 mức lương mẫu (10–80 triệu).
- **SC-003**: Người dùng mới hoàn thành tính gross→net lần đầu trong ≤ 1 phút (đo UX sau).
- **SC-004**: Mọi màn kết quả có disclaimer + nguồn pháp lý nhìn thấy không cần cuộn quá 1 màn hình điện thoại thông dụng.

## Assumptions

- Cá nhân cư trú, 1 nguồn lương HĐLĐ.
- Chưa gồm OT, thưởng, phúc lợi miễn thuế chi tiết.
- Lương cơ sở/mức tham chiếu lấy từ ruleset theo `as_of_date`: 2.340.000 (đến 30/06/2026) / 2.530.000 (từ 01/07/2026: NĐ 161/2026).
- F003 (spec 002) sẽ bổ sung NPT; trước đó NPT = 0.
