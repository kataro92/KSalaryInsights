# Implementation Plan: 006-thai-san-om-dau

**Branch**: `006-thai-san-om-dau` | **Date**: 2026-08-05 | **Spec**: [specs/006-thai-san-om-dau/spec.md](./spec.md)

**Input**: Feature specification from `specs/006-thai-san-om-dau/spec.md`

## Summary

Thêm hai mode ước tính quyền lợi BHXH **thai sản** và **ốm đau** chạy offline trên engine TypeScript thuần: người dùng nhập bình quân lương đóng BHXH (thai sản) hoặc lương tháng liền kề (ốm đau), ngày sinh dự kiến / thứ tự con / số con (sinh đôi), và số ngày nghỉ — app trả tổng quyền lợi kèm breakdown tách **tiền chế độ hằng tháng** và **trợ cấp một lần** (thai sản), hoặc công thức **75% ÷ 24 ngày** (ốm đau).

**Công thức đã khóa (Tầng 1)**:

- Thai sản: `100% × bình_quân_6_tháng × số_tháng_nghỉ + 2 × reference_salary(tháng_sinh) × số_con`
- Số tháng nghỉ: con đầu **6**; con thứ hai sinh từ **01/07/2026** **7**; sinh đôi trở lên **+1 tháng/con từ con thứ 2** (TC-MAT-03: lần đầu sinh đôi → 6 + 1 = 7 tháng).
- `reference_salary` theo `as_of_date` của tháng sinh: **2.340.000** (trước 01/07/2026 → trợ cấp 1 lần **4.680.000**/con); **2.530.000** (từ 01/07/2026 → **5.060.000**/con) — lấy từ ruleset bundle (NĐ 161/2026), không hard-code trong UI.
- Ốm đau V1: `số_ngày × (75% × lương_tháng_liền_kề / 24)`; vượt trần ngày/năm theo ruleset → cắt và thông báo.

**Phạm vi V1**: chỉ **lao động nữ sinh con** (đầu / thứ hai / sinh đôi). Nhận nuôi, mang thai hộ, **chế độ nghỉ của chồng khi vợ sinh** (Đ.53 k.2c — 10 ngày LV) → **V2**; UI ghi rõ out-of-scope.

**Quan hệ với 001**: Dùng chung `rulesetLoader` và field `reference_salary` đã versioned theo `as_of_date` (2,34tr / 2,53tr). Feature 006 **không** sửa `grossToNet.ts` — bổ sung module engine và màn hình quyền lợi riêng.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Không cần thêm thư viện mới.

**Bổ sung riêng cho 006**:

- **Engine modules**: `maternity.ts` (tháng nghỉ, trợ cấp 1 lần, breakdown); `sickLeave.ts` (mức/ngày 75%/24, cắt trần).
- **Tham số ruleset**: `reference_salary` chọn theo `as_of_date` tháng sinh (mapper 001 đã có 2026-H1 = 2,34tr, 2026-H2 = 2,53tr); thêm (nếu chưa có) `maternity_rate` = 1.0, `sick_leave_rate` = 0.75, `sick_leave_divisor` = 24, `maternity_leave_months` (con đầu / con thứ hai), `second_child_extended_from` = `2026-07-01`, `twin_bonus_from_child` = 2.
- **Input tối thiểu**: bình quân 6 tháng, ngày sinh, thứ tự con (đầu / thứ hai), số con (1 / 2+ cho sinh đôi), tick “đủ 6/12 tháng đóng BHXH”; ốm đau: lương tháng liền kề, số ngày nghỉ, (tùy chọn) năm đóng BHXH cho trần.
- **Precision**: VND integer, làm tròn từng khoản đến đồng (giống 001).
- **FR-003 / Constitution V**: MUST NOT thu thập hồ sơ y tế — chỉ số tiền và ngày do user tự nhập.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Breakdown kèm `legal_sources` (Đ.53/58/59 BHXH 2024; Đ.14/29 Luật Dân số 113/2025; Đ.43/45 ốm đau; NĐ 161/168/2026). |
| **II. Tách công thức & tham số** | PASS | Công thức trong `maternity.ts` / `sickLeave.ts`; `reference_salary`, % hưởng, số tháng nghỉ, mốc 01/07/2026 từ ruleset — không magic number trong component. |
| **III. Breakdown giải thích được** | PASS | Tách `monthly_benefit_total`, `one_time_allowance`, `leave_months` (+ ghi chú “+1 tháng do sinh đôi”), `daily_rate` và `days_paid` (ốm đau). |
| **IV. Test case tính tay là sự thật** | PASS | TC-MAT-01, TC-MAT-02, TC-MAT-03, TC-SICK-01 trong `docs/domain/quyen-loi-lao-dong.md` là acceptance tests bắt buộc. |
| **V. Quyền riêng tư tối thiểu** | PASS | Không hỏi chẩn đoán, không lưu PII y tế; chỉ số ước tính cục bộ. |
| **VI. Spec trước, code sau** | PASS | Spec 006 Draft (clarified) từ 2026-07-31 / 2026-08-01 (Tầng 1 khóa) trước plan này. |

## Project Structure

Feature này **không tạo cây thư mục mới** — mở rộng trực tiếp trên cấu trúc `src/` đã định nghĩa trong `specs/001-tinh-luong-gross-net/plan.md`. Các file bị ảnh hưởng:

```text
src/
├── domain/types/
│   └── benefits.ts               # MỚI — MaternityInput, MaternityBreakdown,
│                                  # SickLeaveInput, SickLeaveBreakdown
├── engine/
│   ├── maternity.ts              # MỚI — resolve leave_months (6/7/twin),
│                                  # monthly + one-time allowance, eligibility hint
│   ├── sickLeave.ts              # MỚI — 75%/24, clamp days to annual cap ruleset
│   ├── rulesetLoader.ts          # Dùng lại — map birth month → ruleset → reference_salary
│   └── index.ts                  # Export calculateMaternity, calculateSickLeave
├── components/
│   ├── inputs/
│   │   ├── MaternityInputs.tsx   # MỚI — avg 6m, birth date, child order, twins, 6/12 tick
│   │   └── SickLeaveInputs.tsx   # MỚI — salary last month, days off
│   ├── breakdown/
│   │   ├── MaternityBreakdownCard.tsx  # MỚI — tách tiền chế độ / trợ cấp 1 lần
│   │   └── SickLeaveBreakdownCard.tsx  # MỚI — công thức 75%/24, ngày được tính
│   └── disclaimer/
│       └── OutOfScopeNote.tsx    # MỚI (hoặc inline) — V2: chồng nghỉ, nhận nuôi, mang thai hộ
├── screens/
│   └── BenefitsScreen.tsx        # MỚI — tab/mode Thai sản | Ốm đau + disclaimer ước tính
└── __tests__/unit/
    ├── maternity.test.ts         # MỚI — TC-MAT-01/02/03, pre-07/2026 allowance, eligibility
    └── sickLeave.test.ts         # MỚI — TC-SICK-01, cap clamp
```

**Structure Decision**: Hai engine file tách biệt (không gộp vào `grossToNet.ts`) vì domain input/output khác salary calculator; vẫn dùng chung ruleset loader và precision helpers từ 001.

## Test Plan & Verification Matrix

### Thai sản (US1)

| ID | Input | Kỳ vọng |
|----|-------|---------|
| **TC-MAT-01** | Bình quân 18.000.000; con đầu; sinh 08/2026 (6 tháng; ref 2,53tr) | Tiền chế độ 108.000.000 + trợ cấp 5.060.000 = **113.060.000** |
| **TC-MAT-02** | Cùng bình quân; con thứ hai sau 01/07/2026 (7 tháng) | 18e6 × 7 + 5.060.000 = **131.060.000** |
| **TC-MAT-03** | Sinh đôi lần đầu 08/2026; bình quân 18tr | 7 tháng (6 + 1 twin) + trợ cấp 10.120.000 (2 con) = **136.120.000**; breakdown có “+1 tháng do sinh đôi” |
| **Pre-07/2026 ref** | Sinh trước 01/07/2026 | Trợ cấp 1 lần dùng ref 2,34tr → **4.680.000**/con |
| **Eligibility** | User bỏ tick “đủ 6/12 tháng đóng” | Cảnh báo có thể không đủ điều kiện (không chặn tính) |

### Ốm đau (US2)

| ID | Input | Kỳ vọng |
|----|-------|---------|
| **TC-SICK-01** | Lương tháng liền kề 12.000.000; 5 ngày | 375.000/ngày × 5 = **1.875.000** (hiển thị công thức 75%/24) |
| **Cap** | Ngày nghỉ vượt trần ruleset theo năm đóng | Cắt tại trần; thông báo số ngày thực tế được tính |

### UI / phạm vi V1

- Disclaimer: kết quả là **ước tính**, không thay quyết định chi trả BHXH (SC-002).
- Ghi chú out-of-scope: chế độ **chồng nghỉ khi vợ sinh**, nhận nuôi, mang thai hộ → V2 (không ẩn).
