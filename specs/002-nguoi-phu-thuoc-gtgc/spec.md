# Feature Specification: Người phụ thuộc & giảm trừ gia cảnh

**Status**: Implemented

**Input**: Cho phép khai báo số người phụ thuộc và áp GTGC đúng ruleset năm khi tính thuế.

**Tham chiếu**: `docs/domain/thue-tncn.md`, F003

## Locked decisions

- MVP chỉ nhập **số lượng** NPT (0–20); không lưu PII.
- Không validate pháp lý sâu ở MVP; có tooltip “điều kiện NPT theo luật, mỗi NPT chỉ giảm trừ một lần”.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thêm người phụ thuộc (Priority: P1)

Minh chọn 2 NPT khi tính lương 2026, thấy thuế về 0 theo TC-TNCN-2026-02.

**Why this priority**: GTGC ảnh hưởng mạnh tới thuế thực tế.

**Independent Test**: TC-TNCN-2026-02.

**Acceptance Scenarios**:

1. **Given** gross 30tr, ruleset 2026, **When** NPT = 2, **Then** GTGC = 27.900.000, thuế = 0, net = 26.850.000.
2. **Given** NPT = 0, **When** tính, **Then** chỉ GTGC bản thân theo ruleset.

---

### User Story 2 - Đổi năm luật đổi mức GTGC (Priority: P2)

**Acceptance Scenarios**:

1. **Given** NPT = 1, **When** đổi 2025→2026, **Then** GTGC bản thân 11tr→15,5tr và NPT 4,4tr→6,2tr được phản ánh trong breakdown.

### Edge Cases

- NPT < 0 → reject; NPT tối đa 20 — nhập quá 20 bị chặn kèm giải thích giới hạn app.
- GTGC > thu nhập chịu thuế → thuế 0.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MUST cho nhập số nguyên NPT ≥ 0.
- **FR-002**: MUST tính GTGC = personal_relief + NPT × dependent_relief từ ruleset.
- **FR-003**: MUST hiện dòng GTGC trong breakdown.
- **FR-004**: MUST NOT thu thập tên/ngày sinh/quan hệ NPT ở MVP.

### Key Entities

- **DependentCount**: số nguyên.
- **ReliefApplication**: personal + dependents theo ruleset.

## Success Criteria *(mandatory)*

- **SC-001**: TC-TNCN-2026-02 pass.
- **SC-002**: Đổi ruleset cập nhật đúng mức GTGC trên UI trong cùng session.

## Assumptions

- Một người nộp thuế; không chia sẻ NPT giữa nhiều NNT trong app.
