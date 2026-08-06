# Feature Specification: So sánh hai offer Gross / Net

**Status**: Planned  
**F-ID**: F021  
**Input**: Pain “28tr Net vs 32tr Gross”; ADR 0009 backlog P0.

**Tham chiếu**: F001/F002, F022 (preset BH), `specs/001-tinh-luong-gross-net/spec.md`, ADR 0009

## Locked decisions

- Hai cột Offer A / Offer B trên **route riêng** `offer-compare` + CTA từ Calculator (“So 2 offer”).
- Shared context: `taxYear`, `month` (as-of), `region`, `numDependents` - một lần cho cả hai; mỗi offer chỉ khác mode / amount / BH preset.
- Mỗi offer: mode Gross→Net hoặc Net→Gross; amount; BH via **F022 preset** (full / percent / absolute).
- Kết quả: Gross ước, Net ước, BH NLĐ, thuế TNCN từng offer; **ΔNet** và **ΔGross** (signed); không copy “nên chọn”.
- Tái dùng `grossToNet` / `netToGross`; không engine song song.
- Bonus/OT **tắt** trên màn so offer (MVP); user so lương căn bản.
- Scenario kind `offer_compare` (SHOULD, FR-004).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - So 28tr Net vs 32tr Gross (Priority: P1)

**Independent Test**: Hand-calc từng bên bằng Calculator hiện tại → khớp ±1 đồng.

**Acceptance Scenarios**:

1. **Given** shared 2026 / vùng I / 0 NPT / BH full; A = Net 28.000.000; B = Gross 32.000.000, **When** tính, **Then** hiện Gross+Net+BH+thuế mỗi bên, ΔNet = Net(B)−Net(A), không câu khuyên chọn.
2. **Given** một bên infeasible (net quá thấp), **When** tính, **Then** cột đó báo lỗi / minFeasibleNet; cột kia vẫn hiện nếu ok.

### User Story 2 - BH khác nhau (Priority: P1)

1. **Given** cùng Gross 30.000.000; A = BH full; B = BH 70%, **When** tính, **Then** BH(A) > BH(B) (dưới trần), Net(B) > Net(A), căn cứ BH hiện rõ mỗi cột.

### Edge Cases

- Đổi shared taxYear/month → clear/recompute cả hai.
- Percent BH ngoài 1-100 → validate.
- Absolute BH > trần → vẫn áp trần như Calculator.

## Requirements *(mandatory)*

- **FR-001**: MUST hỗ trợ 2 offer độc lập với mode Gross/Net riêng.
- **FR-002**: MUST dùng preset BH F022 (full / % / absolute) trên mỗi offer.
- **FR-003**: MUST NOT tư vấn “nên nhận offer nào” ngoài số liệu.
- **FR-004**: SHOULD lưu cặp offer như scenario local.
- **FR-005**: MUST hiện ΔNet (và ΔGross khi hữu ích) với nhãn ước tính + disclaimer.
- **FR-006**: MUST NOT gồm thưởng/OT trên màn này ở MVP.

## Success Criteria *(mandatory)*

- **SC-001**: User hoàn thành so sánh trong ≤ 2 phút.
- **SC-002**: Sai số ≤ 1 đồng vs gọi `grossToNet`/`netToGross` riêng từng offer.
- **SC-003**: Không regress Calculator khi không mở màn so sánh.

## Assumptions

- F022 helper ship trước hoặc cùng PR (shared module).
- Không gồm phúc lợi phi tiền mặt (stock, thưởng năm) ở bản đầu.
