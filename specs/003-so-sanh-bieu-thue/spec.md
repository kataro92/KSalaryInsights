# Feature Specification: So sánh biểu thuế cũ và mới

**Status**: Implemented

**Input**: Với cùng input lương, chạy song song ruleset 2025 và 2026, hiện chênh lệch thuế và net.

**Tham chiếu**: F004, TC-TNCN-2025-01 vs TC-TNCN-2026-01

## Locked decisions

- MVP cố định cặp **2025 vs 2026**; V1 mới mở chọn cặp ruleset.
- Có. mỗi ruleset dùng LTTV/trần của năm đó; nếu mức BH dưới cả hai trần thì BH giống nhau.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem tiết kiệm thuế 2026 (Priority: P1)

Minh nhập gross 30tr, xem thuế 2025 vs 2026 và số tiền chênh.

**Independent Test**: Chênh thuế = 992.500 theo domain.

**Acceptance Scenarios**:

1. **Given** input TC 30tr / 0 NPT / vùng I, **When** mở so sánh, **Then** hiện thuế 1.627.500 vs 635.000 và “ít hơn 992.500”.
2. **Given** kết quả, **When** xem, **Then** hai cột breakdown hoặc tab năm rõ ràng, không gộp nhầm ruleset.

### Edge Cases

- Thiếu một trong hai ruleset bundle → thông báo không so sánh được.
- Thuế năm mới cao hơn (hiếm) → vẫn hiện số âm/“cao hơn” trung thực.

## Requirements *(mandatory)*

- **FR-001**: MUST chạy cùng SalaryInput trên hai ruleset.
- **FR-002**: MUST hiển thị thuế, net, và delta.
- **FR-003**: MUST ghi nhãn năm/kỳ rõ ràng.
- **FR-004**: MUST dùng chung logic tính của F001 (không nhân bản công thức lệch).

## Success Criteria *(mandatory)*

- **SC-001**: Delta khớp |tax_2025 − tax_2026| trên bộ test mẫu domain.
- **SC-002**: Người dùng hiểu năm nào đang áp dụng sau ≤ 5 giây nhìn màn hình (đánh giá heuristic: nhãn năm ≥ 16sp, đối lập màu nhẹ).

## Assumptions

- Chỉ cá nhân cư trú, lương HĐLĐ.
