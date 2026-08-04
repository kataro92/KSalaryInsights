# Implementation Plan: 005-quyen-loi-nghi-viec

**Branch**: `005-quyen-loi-nghi-viec` | **Date**: 2026-08-05 | **Spec**: [specs/005-quyen-loi-nghi-viec/spec.md](./spec.md)

**Input**: Feature specification from `specs/005-quyen-loi-nghi-viec/spec.md`

## Summary

Cho phép người dùng **ước tính quyền lợi khi nghỉ việc** qua hai calculator độc lập: (1) trợ cấp **thôi việc / mất việc** (Đ.46–47 BLLĐ 2019) và (2) trợ cấp **thất nghiệp BHTN** (Đ.38–39 Luật Việc làm 74/2025). Engine áp hệ số/trần từ ruleset (thôi việc 0,5 tháng/năm; mất việc 1,0 tháng/năm, sàn 2 tháng; BHTN 60% bình quân 6 tháng, trần 5×LTTV, 3–12 tháng hưởng), trừ thời gian đã đóng BHTN và làm tròn ½/1 năm; UI tách rõ hai chế độ thôi việc vs mất việc, hiển thị breakdown công thức + giải thích khi kết quả = 0 (đóng BHTN đầy đủ), checklist điều kiện hưởng BHTN (user tự tick — app không xác minh hồ sơ), và disclaimer không thay quyết định BHXH/Sở LĐ.

**Quan hệ với 001**: Feature 005 **không sửa** `grossToNet.ts` hay luồng tính lương Gross↔Net. Tái sử dụng `rulesetLoader.getRuleset()` và `regional_minimum_wages` từ ruleset để tra LTTV trần BHTN theo `as_of_date` tháng cuối đóng — không lấy LTTV hiện tại khi user nhập ngày trong quá khứ.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Không cần thêm thư viện mới.

**Bổ sung riêng cho 005**:
- **Engine tách biệt**: `severance.ts` (thôi việc + mất việc — cùng công thức thời gian tính, khác hệ số/sàn) và `unemploymentBenefit.ts` (BHTN) — FR-001 cấm gộp một calculator.
- **Ruleset mở rộng**: thêm block `severance_pay` và `unemployment_benefit` vào JSON ruleset + schema; hệ số MUST lấy từ ruleset, không hardcode trong engine (Constitution II).
- **LTTV theo tháng cuối đóng**: input `last_contribution_date` (ISO date) → `getRuleset(taxYear, last_contribution_date)` → `regional_minimum_wages[region]` cho trần 5×LTTV (FR-006).
- **Checklist UI**: component tick-box chỉ mang tính nhắc điều kiện (12/24 hoặc 12/36; nộp hồ sơ 3 tháng; 10 ngày làm việc chưa có việc; ngày hưởng LV thứ 11) — không ảnh hưởng số tiền tính toán.
- **Làm tròn thời gian**: lẻ 1–<6 tháng → ½ năm; ≥6 tháng → 1 năm (Đ.46–47); dùng số nguyên VND, làm tròn từng khoản đến đồng.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Mỗi kết quả kèm `legal_sources` ruleset + điều khoản (Đ.46/47 BLLĐ; Đ.38–39 Luật Việc làm 74/2025). Disclaimer FR-004 trên mọi màn hình calculator. |
| **II. Tách công thức & tham số** | PASS | Hệ số 0,5 / 1,0 / sàn 2 tháng / 60% / 5×LTTV / 3–12 tháng / 10 ngày chờ việc nằm trong `severance_pay` & `unemployment_benefit` của ruleset — engine chỉ đọc tham số. |
| **III. Breakdown giải thích được** | PASS | Output gồm `years_counted`, công thức từng bước, `explanation[]` (ví dụ trừ BHTN, chạm trần, không đủ điều kiện); kết quả 0 MUST có giải thích thay vì im lặng. |
| **IV. Test case tính tay là sự thật** | PASS | SC-001: TC-SEVERANCE-01/02, TC-JOBLOSS-01, TC-UE-01/02/03 pass với sai số 0 đồng. |
| **V. Quyền riêng tư tối thiểu** | PASS | Chỉ nhập số tháng/năm, lương bình quân, vùng, ngày — không MST/CCCD/VssID; offline 100%. |
| **VI. Spec trước, code sau** | PASS | Spec 005 Draft (clarified) từ phiên 2026-07-31 (hệ số luật đã khóa; 10 ngày LV; trần duy nhất 5×LTTV) trước khi lập plan này. |

## Project Structure

Feature này **không tạo cây thư mục mới** — mở rộng trực tiếp trên cấu trúc `src/` đã định nghĩa trong `specs/001-tinh-luong-gross-net/plan.md`. Các file bị ảnh hưởng:

```text
src/
├── domain/types/
│   └── benefits.ts                    # MỚI — SeveranceInput/Breakdown, JobLossInput/Breakdown,
│                                        # UnemploymentInput/Breakdown, EligibilityChecklistItem
├── engine/
│   ├── rulesets/
│   │   ├── 2025.json                  # Thêm severance_pay + unemployment_benefit (tham số luật cũ nếu khác)
│   │   ├── 2026-h1.json               # Thêm block tham số (Luật Việc làm 74/2025 từ 01/01/2026)
│   │   └── 2026-h2.json
│   ├── severance.ts                   # MỚI — calcSeverancePay(), calcJobLossPay(), roundServiceYears()
│   ├── unemploymentBenefit.ts         # MỚI — calcUnemploymentBenefit(); tra LTTV qua rulesetLoader
│   ├── rulesetLoader.ts               # (001) — tái sử dụng getRuleset(taxYear, asOfDate)
│   └── index.ts                       # Export API calculator quyền lợi
├── components/
│   ├── inputs/
│   │   ├── SeveranceModeToggle.tsx    # MỚI — chọn thôi việc vs mất việc (tách rõ UI)
│   │   └── ServiceTimeInput.tsx       # MỚI — tổng thời gian, thời gian BHTN, đã chi trả trước
│   ├── breakdown/
│   │   └── BenefitBreakdownCard.tsx   # MỚI — công thức + explanation + kết quả (Flat Design)
│   ├── checklist/
│   │   └── EligibilityChecklist.tsx   # MỚI — tick-box điều kiện BHTN (FR-003)
│   └── disclaimer/
│       └── DisclaimerFooter.tsx       # (001) — tái sử dụng trên màn hình quyền lợi
├── screens/
│   ├── SeveranceCalculatorScreen.tsx  # MỚI — US1: thôi việc / mất việc
│   └── UnemploymentCalculatorScreen.tsx  # MỚI — US2: BHTN + checklist
└── __tests__/unit/
    ├── severance.test.ts              # MỚI — TC-SEVERANCE-01/02, TC-JOBLOSS-01, BHTN đầy đủ → 0
    └── unemploymentBenefit.test.ts    # MỚI — TC-UE-01/02/03, LTTV theo as_of_date
```

**Structure Decision**: Hai engine file tách biệt (`severance.ts` vs `unemploymentBenefit.ts`) thay vì một module gộp — đáp ứng FR-001 và tránh nhầm lẫn product (mức thôi việc vs mất việc chênh gấp đôi + sàn 2 tháng). Hàm làm tròn thời gian dùng chung trong `severance.ts` (private helper), không export sang BHTN.

### Ruleset fields (bổ sung schema)

```json
"severance_pay": {
  "resignation_months_per_year": 0.5,
  "job_loss_months_per_year": 1.0,
  "job_loss_min_months": 2
},
"unemployment_benefit": {
  "monthly_rate": 0.60,
  "cap_lttv_multiplier": 5,
  "benefit_months_base": 3,
  "benefit_months_per_12_paid": 1,
  "benefit_months_max": 12,
  "min_paid_months": 12,
  "waiting_work_days": 10,
  "benefit_start_work_day": 11,
  "filing_deadline_months": 3,
  "lookback_months_standard": 24,
  "lookback_months_short_contract": 36
}
```

## Test Plan & Verification Matrix

### Trợ cấp thôi việc / mất việc (US1)

- **TC-SEVERANCE-01**: Tổng 7 năm, 5 năm đóng BHTN, lương bình quân 6 tháng 20.000.000 → thời gian tính = 2 năm → thôi việc = 0,5 × 2 × 20.000.000 = **20.000.000**; breakdown ghi rõ trừ 5 năm BHTN.
- **TC-SEVERANCE-02**: Thời gian tính 1 năm 7 tháng, lương 20.000.000 → làm tròn 2 năm → thôi việc = 0,5 × 2 × 20.000.000 = **20.000.000**.
- **TC-JOBLOSS-01**: Chế độ mất việc, thời gian tính 1 năm, lương 20.000.000 → 1 × 1 × 20e6 < sàn 2 tháng → **40.000.000**.
- **Edge — BHTN đầy đủ**: Tổng thời gian = thời gian BHTN → kết quả **0** + explanation “thời gian tính trợ cấp = 0 vì đã tham gia BHTN” (không phải lỗi).
- **Edge — tách chế độ**: Toggle thôi việc ↔ mất việc cùng input → mất việc ≥ thôi việc (hệ số gấp đôi) và mất việc áp sàn 2 tháng khi thời gian tính thấp.

### Trợ cấp thất nghiệp (US2)

- **TC-UE-01**: Đóng 72 tháng, bình quân 6 tháng 15.000.000, vùng I (LTTV 5.310.000) → 9.000.000/tháng × 6 tháng = **54.000.000**; checklist hiển thị đủ mục (10 ngày LV, ngày thứ 11).
- **TC-UE-02**: Bình quân 50.000.000, vùng I → trần 5 × 5.310.000 = **26.550.000/tháng** + ghi “đã chạm trần” (không nhánh 5× lương cơ sở).
- **TC-UE-03**: Đóng 10 tháng → **không đủ điều kiện** + lý do (thiếu 12 tháng).
- **Edge — LTTV theo `as_of_date`**: Cùng vùng I, `last_contribution_date` rơi vào H1 vs H2 ruleset → trần BHTN khác nếu LTTV thay đổi (xác nhận qua test mock date, không dùng LTTV “hiện tại”).

### UI & compliance

- **SC-002**: 100% màn hình `SeveranceCalculatorScreen` và `UnemploymentCalculatorScreen` có `DisclaimerFooter`.
- **Design system**: Card breakdown, input số tiền tabular nums, màu `secondary` cho số quyền lợi — theo `docs/product/design-system.md`.
