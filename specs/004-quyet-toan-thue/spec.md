# Feature Specification: Quyết toán thuế (ước tính)

**Status**: Implemented

**Input**: Tổng hợp thu nhập cả năm (lương ± vãng lai), GTGC năm, thuế đã khấu trừ, ước nộp thêm hoặc hoàn.

**Tham chiếu**: F007, F008, N07, N08; `thue-tncn.md` mục 4 (công thức năm) + TC-QT-2025-01, TC-QT-2026-01/02

## Locked decisions

- Quyết toán năm Y dùng **ruleset năm Y** (không dùng năm mở app).
- MVP ước tính: nhập tổng thu nhập/tháng trung bình × 12 hoặc nhập theo tháng đơn giản (12 ô); không import XML tờ khai.
- Vãng lai: cộng thu nhập và thuế đã khấu trừ 10% do user nhập.
- **Quy tắc mới NĐ 253/2026 (từ 01/07/2026)**: vãng lai bình quân tháng ≤ 15.000.000 đ và đã khấu trừ 10% tại nguồn → **không bắt buộc quyết toán phần đó**; ngưỡng khấu trừ tại nguồn 5tr/lần (trước đó 2tr). Wizard MUST kiểm tra điều kiện này trước khi khuyên gộp vãng lai vào quyết toán.
- Bổ sung wizard “ủy quyền vs tự quyết toán” (F007b): quiz điều kiện + checklist chứng từ + hạn nộp (tổ chức 31/03; cá nhân ~đầu tháng 5 theo hướng dẫn từng năm).
- Tolerance: TC pass ≤ 1 đồng; property test 12 tháng ≤ 12 đồng.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ước hoàn/nộp thêm 1 nguồn (Priority: P1)

Lan nhập thu nhập năm và thuế đã khấu trừ, xem chênh lệch.

**Independent Test**: TC-QT-2025-01.

**Acceptance Scenarios**:

1. **Given** năm 2025, gross 30tr/tháng làm 10 tháng, đã khấu trừ 16.275.000 (TC-QT-2025-01), **When** quyết toán, **Then** thuế năm = 11.475.000 và hiện "ước hoàn 4.800.000", kèm breakdown năm (TN chịu thuế → GTGC 12 tháng → TNTT → thuế theo bậc năm → đã khấu trừ → chênh).
2. **Given** thuế phải nộp > đã khấu trừ, **Then** hiện "ước nộp thêm = chênh" cùng cấu trúc breakdown.

---

### User Story 2 - Thêm nguồn vãng lai (Priority: P2)

1. **Given** lương 30tr × 12 + vãng lai 240tr (bình quân 20tr/tháng > 15tr, đã trừ 24tr. TC-QT-2026-01), **When** quyết toán 2026, **Then** bắt buộc gộp, thuế năm = 33.240.000, "ước nộp thêm 1.620.000".
2. **Given** lương 20tr × 12 + vãng lai 60tr (bình quân 5tr/tháng ≤ 15tr, đã trừ 10%. TC-QT-2026-02), **When** quyết toán 2026, **Then** hệ thống báo phần vãng lai **được miễn** và trình bày **cả hai phương án**: không gộp (chênh 0) vs gộp tự nguyện (ước hoàn 3.000.000). nêu rõ gộp có lợi.

### Edge Cases

- Chưa nhập thuế đã khấu trừ → yêu cầu nhập hoặc mặc định 0 kèm cảnh báo.
- Năm 2025 vs 2026 khác biểu/GTGC.

## Requirements *(mandatory)*

- **FR-001**: MUST chọn tax_year → ruleset tương ứng.
- **FR-002**: MUST cho nhập thu nhập năm (hoặc 12 tháng) và số NPT.
- **FR-003**: MUST cho nhập thuế đã khấu trừ lũy kế.
- **FR-004**: MUST hỗ trợ ít nhất một dòng thu nhập vãng lai (số nhận + thuế đã trừ).
- **FR-005**: MUST hiện kết quả ước (nộp thêm/hoàn/khớp) + disclaimer mạnh.
- **FR-006**: MUST NOT nộp tờ khai thay người dùng.
- **FR-007**: MUST áp quy tắc miễn quyết toán vãng lai ≤15tr/tháng (đã khấu trừ 10%) khi tax_year ≥ 2026 theo ruleset. thông báo phần nào bắt buộc/không bắt buộc gộp, và khi được miễn MUST trình bày cả phương án gộp tự nguyện kèm chênh lệch (TC-QT-2026-02). **Đã chốt** theo NĐ 253/2026 Đ.69.1.a: ngưỡng 5tr + miễn QT 15tr áp **cả kỳ tính thuế năm 2026** (không chỉ từ 01/07); phần đã khấu trừ H1/2026 theo quy định cũ điều chỉnh khi quyết toán năm (Đ.70.2).
- **FR-008**: Wizard ủy quyền vs tự quyết toán: kết luận + checklist hồ sơ + hạn. thuần logic câu hỏi, không thu thập giấy tờ.
- **FR-009**: MUST hiển thị breakdown năm đầy đủ (tổng TN chịu thuế → GTGC năm → TNTT năm → thuế từng bậc biểu năm → tổng đã khấu trừ → chênh lệch). Constitution III áp cho cả phép tính năm.

## Success Criteria *(mandatory)*

- **SC-001**: TC-QT-2025-01, TC-QT-2026-01, TC-QT-2026-02 pass (sai số ≤ 1 đồng).
- **SC-002**: Với fixture lương đều 12 tháng (= TC tháng × 12, không thưởng), thuế năm = 12 × thuế tháng với sai số ≤ 12 đồng (1 đồng làm tròn/tháng).
- **SC-003**: Không có đường nào gửi dữ liệu quyết toán lên server ở V1.

## Assumptions

- Không xử lý giảm trừ từ thiện/hưu trí tự nguyện ở bản đầu.
- Không tính cá nhân không cư trú.
