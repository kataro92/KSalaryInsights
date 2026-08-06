# Feature Specification: Preset mức đóng bảo hiểm

**Status**: Planned  
**F-ID**: F022  
**Input**: Pain “đóng BH theo lương cơ bản / một phần / full”; ADR 0009 backlog P0.

**Tham chiếu**: F001, F005, F021, Calculator `customBh`, `netToGross` insuranceTracksGross

## Locked decisions

- Thay / bổ sung toggle “Mức đóng BH riêng” bằng preset rõ nghĩa trên Calculator **và** API dùng chung cho F021:
  1. **full** — căn cứ = gross (gross→net) hoặc tracks candidate gross (net→gross, `insuranceTracksGross=true`)
  2. **percent** — user nhập % (1–100) × base pay
  3. **absolute** — nhập mức đóng tuyệt đối (`insuranceSalary` cố định; net→gross: `insuranceTracksGross=false`)
- **Percent + Net→Gross (MVP)**: % áp trên **gross đang giải** mỗi bước binary search (tracks × rate) — ghi chú UI.
- Hiển thị **căn cứ BH đã dùng** trên meta / breakdown (FR-002).
- Trần BH theo vùng/năm giữ nguyên (F005).
- Không lưu CCCD; chỉ mode + % / số tiền.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chọn full vs % trên Calculator (Priority: P1)

**Independent Test**: Hand-calc Gross 30tr full vs 70% (căn cứ 21tr, dưới trần vùng I 2026-H1).

**Acceptance Scenarios**:

1. **Given** Gross 30.000.000, preset full, 0 NPT, vùng I, 2026-H1, **When** tính, **Then** khớp TC-TNCN-2026-01 / hành vi hiện tại (BH trên 30tr).
2. **Given** cùng Gross, preset 70%, **When** tính, **Then** căn cứ BH = 21.000.000; BH NLĐ và Net khác full; trần vẫn áp nếu vượt.

### User Story 2 - Net→Gross với BH % (Priority: P2)

1. **Given** Net mục tiêu từ kết quả US1 full, preset full, **When** net→gross, **Then** gross ≈ 30tr (±1).
2. **Given** Net mục tiêu + preset 70% (tracks × rate), **When** giải, **Then** grossToNet(gross) với BH = 70%×gross khớp net mục tiêu (±1).

### Edge Cases

- % < 1 hoặc > 100 → lỗi validate.
- Absolute MUST > 0.
- Đổi preset → clear kết quả đang hiện.

## Requirements *(mandatory)*

- **FR-001**: MUST có 3 preset trên Calculator.
- **FR-002**: MUST hiện căn cứ BH đã dùng trong UI kết quả.
- **FR-003**: MUST giữ trần BH theo vùng/năm (F005).
- **FR-004**: MUST export helper resolve `insuranceSalary` / `insuranceTracksGross` dùng được F021.
- **FR-005**: MUST NOT regress khi preset = full (SC-002).

## Success Criteria *(mandatory)*

- **SC-001**: Fixture Gross 30tr full vs 70% khớp hand-calc (±1 đồng).
- **SC-002**: Suite grossToNet / netToGross hiện có pass với preset full.
- **SC-003**: Helper unit-tested độc lập UI.

## Assumptions

- Có thể gói cùng PR với F021; F022 foundational trước UI so offer.
- “Lương cơ bản” = % × gross thỏa thuận; không mô hình phụ cấp phức tạp ở MVP.
