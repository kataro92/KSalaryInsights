# Implementation Plan: 007-huu-tri-bhxh-mot-lan

**Branch**: `007-huu-tri-bhxh-mot-lan` | **Date**: 2026-08-05 | **Spec**: [specs/007-huu-tri-bhxh-mot-lan/spec.md](./spec.md)

**Input**: Feature specification from `specs/007-huu-tri-bhxh-mot-lan/spec.md`

## Summary

Cho phép người dùng **so sánh side-by-side** hai kịch bản ước tính: (1) **BHXH một lần** theo Đ.70 Luật BHXH 2024 — `(1,5 × T1 + 2 × T2) × MBQTL đã trượt giá` — và (2) **lương hưu hàng tháng** (giản lược) theo tỷ lệ Đ.66 — nữ 45%@15 năm +2%/năm (max 75%@30); nam ≥20 năm 45%@20 +2%/năm (max 75%@35); nam 15–<20 năm 40%@15 +1%/năm. MBQTL do người dùng nhập giả định hoặc hỗ trợ qua bảng hệ số trượt giá (CV 340/BHXH-CSXH 2026) trong ruleset; checklist điều kiện rút BHXH một lần tách theo mốc tham gia trước/từ **01/07/2025**. UI **bắt buộc acknowledge disclaimer** trước khi hiện số tiền; cảnh báo quyết định rút không đảo ngược. App **MUST NOT** khuyến nghị “nên rút” hay “nên chờ” (FR-004).

**Quan hệ với 001**: Feature 007 **không sửa** `grossToNet.ts` hay luồng tính lương Gross↔Net. Tái dùng `rulesetLoader`, pattern breakdown/disclaimer từ 001; engine mới tách file `bhxhLumpSum.ts` và `pensionEstimate.ts`.

## Technical Context

Kế thừa nguyên vẹn Technical Context của 001 (xem `specs/001-tinh-luong-gross-net/plan.md`) — không đổi ngôn ngữ, framework, dependency, storage, testing hay target platform. Không cần thêm thư viện mới.

**Bổ sung riêng cho 007**:
- **Engine tách biệt**: `bhxhLumpSum.ts` (Đ.70 — hệ số 1,5/2,0, làm tròn tháng lẻ, <1 năm) và `pensionEstimate.ts` (Đ.66 — tỷ lệ nam/nữ theo nhánh năm đóng) — không gộp một hàm vì product và test case tách rõ hai chế độ.
- **Bảng hệ số trượt giá**: tham số theo `adjustment_table_year` trong ruleset (nguồn CV 340/2026), **tách** khỏi ruleset thuế — user chọn bảng năm hoặc nhập MBQTL đã trượt giá thủ công (FR-006).
- **Điều kiện rút**: checklist tĩnh đọc từ ruleset (`lump_sum_withdrawal` — nhánh trước/từ 01/07/2025); tick-box chỉ nhắc, không ảnh hưởng số tiền.
- **Disclaimer gate**: modal/blocker bắt buộc `acknowledged: true` trong session trước khi render cột số tiền (SC-002); tái dùng pattern `DisclaimerFooter` nhưng thêm bước xác nhận chủ động.
- **Làm tròn**: số nguyên VND, sai số ≤ 1 đồng so với TC domain.

### Công thức khóa (UTF-8, không LaTeX)

**BHXH một lần (Đ.70)**:

```
lump_sum = (1,5 × years_pre_2014 + 2,0 × years_from_2014) × adjusted_avg_salary
```

- Tháng lẻ (Đ.5 k.6): 1–6 tháng = ½ năm; 7–11 tháng = 1 năm.
- Đóng chưa đủ 1 năm: bằng số đã đóng, tối đa 2 tháng MBQTL (Đ.70 k.3c).

**Lương hưu — tỷ lệ (Đ.66)**:

```
rate_female = min(45% + 2% × max(0, years − 15), 75%)
rate_male   = years ≥ 20 ? min(45% + 2% × (years − 20), 75%)
                          : 40% + 1% × (years − 15)      # 15 ≤ years < 20
pension_monthly = rate × adjusted_avg_salary
```

MBQTL thật phụ thuộc lịch sử đóng + trượt giá — app chỉ ước từ MBQTL giả định user nhập; UI ghi “khoảng ước tính”.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Kết quả kèm `legal_sources` (Luật BHXH 41/2024 Đ.66/Đ.70; CV 340/BHXH-CSXH). Disclaimer mạnh + cảnh báo không đảo ngược. |
| **II. Tách công thức & tham số** | PASS | Hệ số 1,5/2,0, tỷ lệ Đ.66, bảng trượt giá, checklist điều kiện rút nằm trong ruleset — engine chỉ đọc tham số. |
| **III. Breakdown giải thích được** | PASS | Output gồm `breakdown` hai giai đoạn T1/T2 (lump sum), `rate_steps` (cách ra tỷ lệ hưu), ghi chú MBQTL giả định. |
| **IV. Test case tính tay là sự thật** | PASS | SC-001: TC-LUMPSUM-01, TC-PENSION-01, TC-PENSION-02 pass sai số ≤ 1 đồng. |
| **V. Quyền riêng tư tối thiểu** | PASS | Chỉ nhập số năm, giới tính, MBQTL giả định, mốc tham gia — không VssID/sổ BHXH; offline 100%. |
| **VI. Spec trước, code sau** | PASS | Spec 007 Draft (clarified) từ phiên 2026-07-31 (Đ.70 + Đ.66 đã khóa) trước khi lập plan này. |

**FR-004 (ngoài Constitution)**: UI và copy **MUST NOT** chứa ngôn ngữ khuyến nghị “nên rút” / “nên chờ” / so sánh đầu tư — chỉ hiển thị hai con số song song + cảnh báo trung lập.

## Project Structure

Feature này **không tạo cây thư mục mới** — mở rộng trực tiếp trên cấu trúc `src/` đã định nghĩa trong `specs/001-tinh-luong-gross-net/plan.md`. Các file bị ảnh hưởng:

```text
src/
├── domain/types/
│   └── retirement.ts                    # MỚI — LumpSumInput/Breakdown, PensionInput/Breakdown,
│                                          # EligibilityChecklistItem, DisclaimerAckState
├── engine/
│   ├── rulesets/
│   │   ├── 2026-h2.json                   # Thêm lump_sum_withdrawal + pension_rates + adjustment_table_year
│   │   └── inflation-adjustment-2026.json # MỚI (hoặc nhúng trong ruleset) — bảng CV 340
│   ├── bhxhLumpSum.ts                     # MỚI — calcLumpSum(); làm tròn tháng lẻ; breakdown T1/T2
│   ├── pensionEstimate.ts                 # MỚI — calcPensionRate(), calcPensionMonthly(); nhánh nam/nữ
│   ├── rulesetLoader.ts                   # (001) — tái sử dụng
│   └── index.ts                           # Export API hưu trí / BHXH một lần
├── components/
│   ├── inputs/
│   │   ├── ContributionYearsInput.tsx     # MỚI — T1/T2, tháng lẻ, mốc tham gia 01/07/2025
│   │   └── AdjustedSalaryInput.tsx        # MỚI — MBQTL thủ công hoặc chọn bảng trượt giá ruleset
│   ├── comparison/
│   │   └── RetirementComparisonView.tsx   # MỚI — 2 cột: BHXH một lần | Lương hưu/tháng (side-by-side)
│   ├── checklist/
│   │   └── LumpSumEligibilityChecklist.tsx  # MỚI — điều kiện rút theo nhánh trước/từ 01/07/2025
│   └── disclaimer/
│       └── LumpSumDisclaimerGate.tsx      # MỚI — bắt buộc acknowledge trước khi hiện số (FR-002)
├── screens/
│   └── RetirementComparisonScreen.tsx     # MỚI — US1: input → gate → so sánh + checklist
└── __tests__/unit/
    ├── bhxhLumpSum.test.ts                # MỚI — TC-LUMPSUM-01, edge <1 năm, làm tròn tháng lẻ
    └── pensionEstimate.test.ts            # MỚI — TC-PENSION-01, TC-PENSION-02, max 75%
```

**Structure Decision**: Hai engine file (`bhxhLumpSum.ts` vs `pensionEstimate.ts`) + một `RetirementComparisonView` orchestration — tương tự pattern `compareRulesets.ts` (003) nhưng hai công thức pháp lý khác nhau thay vì cùng `grossToNet`. Bảng trượt giá versioned theo `adjustment_table_year`, không hardcode trong engine.

### Ruleset fields (bổ sung schema)

```json
"lump_sum_withdrawal": {
  "pre_2014_coefficient": 1.5,
  "from_2014_coefficient": 2.0,
  "participation_cutoff": "2025-07-01",
  "conditions_before_cutoff": [
    "12 tháng không tiếp tục đóng và chưa đủ 20 năm",
    "Các trường hợp đặc biệt theo Đ.70 k.1"
  ],
  "conditions_from_cutoff": [
    "Đủ tuổi hưu thiếu 15 năm đóng",
    "Định cư nước ngoài",
    "Bệnh hiểm nghèo / suy giảm LĐ ≥81% / khuyết tật đặc biệt nặng"
  ]
},
"pension_rates": {
  "female_base_years": 15,
  "female_base_rate": 0.45,
  "female_increment_per_year": 0.02,
  "female_max_rate": 0.75,
  "female_max_years": 30,
  "male_long_base_years": 20,
  "male_long_base_rate": 0.45,
  "male_long_increment_per_year": 0.02,
  "male_long_max_rate": 0.75,
  "male_long_max_years": 35,
  "male_short_base_years": 15,
  "male_short_base_rate": 0.40,
  "male_short_increment_per_year": 0.01,
  "male_short_max_years": 19
},
"inflation_adjustment": {
  "table_year": 2026,
  "legal_source": "CV 340/BHXH-CSXH ngày 03/02/2026",
  "coefficients_by_year": { "1995": 4.91, "2014": 1.36, "2025": 1.00, "2026": 1.00 }
}
```

(Bảng đầy đủ theo `docs/domain/quyen-loi-lao-dong.md` §5.1 — không liệt kê hết ở plan.)

## Test Plan & Verification Matrix

### BHXH một lần

- **TC-LUMPSUM-01**: T1 = 4 năm, T2 = 10 năm, MBQTL (đã trượt giá) = 12.000.000 → `(1,5×4 + 2×10) × 12e6` = **312.000.000**; breakdown hiển thị hai giai đoạn T1/T2.
- **Edge — tháng lẻ**: 4 năm 8 tháng → làm tròn 5 năm (7–11 tháng = 1 năm).
- **Edge — <1 năm**: đóng 8 tháng, MBQTL 10.000.000 → tối đa 2 tháng = **20.000.000** (Đ.70 k.3c).
- **Edge — tham gia từ 08/2025**: checklist **không** hiện diện “nghỉ việc 12 tháng”; chỉ các trường hợp đặc biệt.

### Lương hưu (ước tỷ lệ Đ.66)

- **TC-PENSION-01**: Nữ, 25 năm, MBQTL 10.000.000 → tỷ lệ 45% + 10×2% = **65%** → **6.500.000/tháng**; hiển thị cách ra tỷ lệ.
- **TC-PENSION-02**: Nam, 17 năm, MBQTL 10.000.000 → tỷ lệ 40% + 2×1% = **42%** → **4.200.000/tháng** (nhánh 15–<20 năm).
- **Edge — trần 75%**: nữ 30+ năm / nam 35+ năm → rate cap **75%**.

### UI, disclaimer & compliance

- **SC-002**: 100% phiên tính có `disclaimer_acknowledged` ghi nhận trong session trước khi render số tiền — test component gate (chưa acknowledge → không hiện cột số; sau acknowledge → hiện).
- **SC-003**: Audit copy — không có chuỗi khuyến nghị rút/chờ/đầu tư; so sánh side-by-side trung lập.
- **MBQTL giả định**: mọi kết quả hưu gắn nhãn “khoảng ước tính”; ghi chú app không tính MBQTL thật từ lịch sử đóng.
- **Design system**: `RetirementComparisonView` — hai cột rõ nhãn, số tabular nums, cảnh báo đỏ/cam cho “không đảo ngược” theo `docs/product/design-system.md`.
