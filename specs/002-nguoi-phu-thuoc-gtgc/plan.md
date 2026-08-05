# Implementation Plan: 002-nguoi-phu-thuoc-gtgc

**Branch**: `002-nguoi-phu-thuoc-gtgc` | **Date**: 2026-08-04 | **Spec**: [specs/002-nguoi-phu-thuoc-gtgc/spec.md](./spec.md)

**Input**: Feature specification from `specs/002-nguoi-phu-thuoc-gtgc/spec.md`

## Summary

Cho phép người dùng khai báo **số lượng** người phụ thuộc (NPT, 0–20, không thu thập tên/ngày sinh/quan hệ) để engine áp đúng giảm trừ gia cảnh (GTGC = `personal_relief` + NPT × `dependent_relief`) theo ruleset năm đang chọn, và hiển thị GTGC như một dòng riêng, tường minh trong breakdown — thay vì gộp ẩn trong thu nhập tính thuế (TNTT) như hiện tại.

**Quan hệ với 001**: Công thức GTGC (`personal_relief + num_dependents × dependent_relief`) **đã có sẵn** trong engine `grossToNet.ts` theo plan.md của 001 (`SalaryInput.num_dependents`, mặc định 0 nếu 002 chưa triển khai — xem `specs/001-tinh-luong-gross-net/spec.md` FR-004). Feature 002 **không viết lại công thức** — chỉ bổ sung (a) UI nhập/validate NPT và (b) tách dòng GTGC hiển thị riêng trong breakdown để đáp ứng FR-003.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Không cần thêm thư viện mới.

**Bổ sung riêng cho 002**:
- **UI Component**: NPT nhập qua stepper số nguyên (không phải free-text) để loại trừ giá trị âm/thập phân ngay ở tầng input.
- **Validation**: Chặn cứng tại UI (0 ≤ NPT ≤ 20) + kèm thông báo giải thích giới hạn app khi vượt 20 (theo Edge Cases của spec).

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | `personal_relief`/`dependent_relief` lấy từ `ruleset.legal_sources` đã có sẵn từ 001 — không thêm tham số pháp lý mới. |
| **II. Tách công thức & tham số** | PASS | Dùng lại `Ruleset.personal_relief`/`dependent_relief` đã versioned theo năm (001) — 002 chỉ là lớp UI + tách hiển thị, không nhân bản công thức. |
| **III. Breakdown giải thích được** | PASS | FR-003: bổ sung field `relief_breakdown` (personal, dependent, total) vào `SalaryBreakdown` và hiển thị thành dòng "Giảm trừ gia cảnh (GTGC)" riêng trong `SalaryBreakdownCard`. |
| **IV. Test case tính tay là sự thật** | PASS | `TC-TNCN-2026-02` (NPT=2 → GTGC 27.900.000, thuế 0, net 26.850.000) là acceptance test chính (US1); US2 kiểm tra GTGC cập nhật đúng khi đổi ruleset 2025→2026 trong cùng session. |
| **V. Quyền riêng tư tối thiểu** | PASS | FR-004: MUST NOT thu thập tên/ngày sinh/quan hệ NPT — chỉ lưu một số nguyên cục bộ, không PII. |
| **VI. Spec trước, code sau** | PASS | Spec 002 đã Draft (clarified) từ phiên 2026-07-31 (2 câu hỏi đã chốt: chỉ nhập số lượng NPT, không validate pháp lý sâu ở MVP) trước khi lập plan này. |

## Project Structure

Feature này **không tạo cây thư mục mới** — mở rộng trực tiếp trên cấu trúc `src/` đã định nghĩa trong `specs/001-tinh-luong-gross-net/plan.md`. Các file bị ảnh hưởng:

```text
src/
├── domain/types/salary.ts        # Xác nhận SalaryInput.num_dependents (đã có từ 001);
│                                  # thêm relief_breakdown: { personal, dependent, total }
│                                  # vào SalaryBreakdown (MỚI — tách dòng GTGC riêng)
├── engine/grossToNet.ts          # Trả thêm relief_breakdown trong output
│                                  # (KHÔNG đổi công thức tính GTGC đã có từ 001)
├── components/
│   ├── inputs/
│   │   └── DependentCountInput.tsx   # MỚI — stepper NPT 0–20 + tooltip điều kiện luật
│   └── breakdown/
│       └── SalaryBreakdownCard.tsx   # Thêm dòng "Giảm trừ gia cảnh (GTGC)" (dùng relief_breakdown)
├── screens/
│   └── CalculatorScreen.tsx      # Tích hợp DependentCountInput, truyền num_dependents
└── __tests__/unit/
    ├── dependents.test.ts            # MỚI — TC-TNCN-2026-02, NPT=0, NPT âm/>20
    └── dependentsRulesetSwitch.test.ts  # MỚI — US2: đổi ruleset 2025↔2026
```

## Test Plan & Verification Matrix

- **TC-TNCN-2026-02**: Gross 30tr, ruleset 2026, NPT = 2 → GTGC = 27.900.000, thuế = 0, net = 26.850.000.
- **NPT = 0**: chỉ áp `personal_relief` theo ruleset (không cộng `dependent_relief`).
- **Validation**: NPT âm → reject; NPT > 20 → chặn kèm thông báo giới hạn app (không phải lỗi pháp lý).
- **US2 — đổi năm**: NPT = 1, đổi 2025 → 2026 trong cùng session → GTGC bản thân 11tr → 15,5tr và GTGC/NPT 4,4tr → 6,2tr phản ánh đúng trong breakdown (không giữ giá trị cache cũ).
- **Edge case đã biết**: GTGC > thu nhập chịu thuế → thuế = 0 (đã được engine 001 xử lý qua `max(0, TNTT)`; 002 chỉ cần xác nhận qua test, không cần code mới).
