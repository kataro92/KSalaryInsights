# Implementation Plan: 003-so-sanh-bieu-thue

**Branch**: `003-so-sanh-bieu-thue` | **Date**: 2026-08-04 | **Spec**: [specs/003-so-sanh-bieu-thue/spec.md](./spec.md)

**Input**: Feature specification from `specs/003-so-sanh-bieu-thue/spec.md`

## Summary

Với cùng một `SalaryInput`, chạy song song ruleset 2025 và ruleset 2026 (cặp cố định ở MVP theo Clarifications — chọn cặp tùy ý để dành cho V1), hiển thị breakdown hai năm cạnh nhau kèm chênh lệch (delta) thuế và net, để người dùng thấy rõ tác động của luật thuế mới.

**Quan hệ với 001**: Feature 003 **không viết công thức tính mới** — theo FR-004, bắt buộc dùng chung `grossToNet` đã có từ 001 (gọi hai lần với hai `Ruleset` khác nhau). Đây thuần túy là lớp orchestration + hiển thị so sánh trên engine đã tồn tại.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, storage, testing hay target platform. Không cần thêm thư viện chart/visualization — so sánh hiển thị dạng 2 cột/tab bằng component có sẵn (`SalaryBreakdownCard` tái sử dụng cho mỗi cột).

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Mỗi cột breakdown hiển thị `legal_sources` riêng của ruleset năm tương ứng (2025 hoặc 2026) — không trộn nguồn giữa hai năm. |
| **II. Tách công thức & tham số** | PASS | FR-004: bắt buộc gọi lại `grossToNet` (001) với `Ruleset` khác nhau — cấm nhân bản/viết lại công thức tính rẽ nhánh theo năm. |
| **III. Breakdown giải thích được** | PASS | Hai cột/tab breakdown đầy đủ (không chỉ hiện số cuối) + dòng delta thuế/net tường minh (FR-002). |
| **IV. Test case tính tay là sự thật** | PASS | SC-001 dùng trực tiếp `TC-TNCN-2025-01` (thuế 1.627.500) vs `TC-TNCN-2026-01` (thuế 635.000) đã có từ domain — delta kỳ vọng 992.500. |
| **V. Quyền riêng tư tối thiểu** | PASS | Không thêm input mới — tái dùng `SalaryInput` hiện có của 001. |
| **VI. Spec trước, code sau** | PASS | Spec 003 Draft (clarified) từ phiên 2026-07-31 (2 câu hỏi đã chốt: cặp cố định 2025 vs 2026 ở MVP; BH tính lại theo LTTV/trần từng năm) trước khi lập plan này. |

## Project Structure

Mở rộng trực tiếp trên cấu trúc `src/` đã định nghĩa trong `specs/001-tinh-luong-gross-net/plan.md`. Các file mới/bị ảnh hưởng:

```text
src/
├── domain/types/
│   └── comparison.ts             # MỚI — type ComparisonResult { year1, year2, delta }
├── engine/
│   └── compareRulesets.ts        # MỚI — facade gọi grossToNet() 2 lần (2025, 2026),
│                                  # KHÔNG viết lại công thức, trả ComparisonResult
├── components/comparison/
│   └── ComparisonView.tsx        # MỚI — 2 cột/tab breakdown + dòng delta,
│                                  # tái sử dụng SalaryBreakdownCard (001) cho mỗi cột
├── screens/
│   ├── ComparisonScreen.tsx      # MỚI — nhận SalaryInput hiện tại, gọi compareRulesets
│   └── CalculatorScreen.tsx      # Thêm điểm điều hướng sang ComparisonScreen
└── __tests__/unit/
    └── compareRulesets.test.ts   # MỚI — SC-001, edge case thiếu ruleset bundle
```

**Structure Decision**: Không tạo engine tính toán mới — `compareRulesets.ts` là lớp mỏng orchestration trên `grossToNet.ts` (001), giữ đúng nguyên tắc II (một nguồn công thức duy nhất).

## Test Plan & Verification Matrix

- **SC-001**: Input TC 30tr / 0 NPT / vùng I → thuế 2025 = 1.627.500, thuế 2026 = 635.000, delta = 992.500 (khớp `TC-TNCN-2025-01` / `TC-TNCN-2026-01` trong domain).
- **SC-002 (heuristic, không phải unit test)**: Nhãn năm ≥ 16sp, đối lập màu nhẹ giữa hai cột — người dùng phân biệt được năm nào đang áp dụng trong ≤ 5 giây; xác nhận qua UI review, không phải test tự động.
- **Edge — thiếu ruleset bundle**: nếu một trong hai ruleset (2025/2026) không load được → `compareRulesets` trả lỗi có kiểm soát, `ComparisonScreen` hiển thị thông báo "không so sánh được" thay vì crash.
- **Edge — thuế năm mới cao hơn**: trường hợp hiếm nhưng `compareRulesets` MUST vẫn trả delta âm/số thực, UI hiển thị trung thực ("cao hơn") — không được ẩn hoặc làm tròn về 0.
