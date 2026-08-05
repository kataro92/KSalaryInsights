# Implementation Plan: 001-tinh-luong-gross-net

**Branch**: `001-tinh-luong-gross-net` | **Date**: 2026-08-03 | **Spec**: [specs/001-tinh-luong-gross-net/spec.md](./spec.md)

**Input**: Feature specification from `specs/001-tinh-luong-gross-net/spec.md`

## Summary

Tính năng cho phép người lao động nhập Gross hoặc Net, tự động tính toán hai chiều (Gross → Net và Net → Gross), áp dụng chính xác bộ tham số pháp lý theo năm kỳ tính thuế và `as_of_date` (2025, 2026-H1, 2026-H2) với sai số làm tròn ≤ 1 VNĐ, hiển thị chi tiết breakdown từng khoản đóng bảo hiểm và thuế TNCN kèm theo disclaimer và nguồn pháp lý minh bạch.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022  
**Framework**: React Native + Expo (SDK 51+)  
**Primary Dependencies**: React Native, React, Lucide-react-native (icons), Zod (validation)  
**Storage**: AsyncStorage (lưu lịch sử tính cục bộ & preference người dùng)  
**Testing**: Jest (unit & contract testing cho calculation engine), React Native Testing Library  
**Target Platform**: iOS, Android, Web (Expo Cross-Platform)  
**Project Type**: Mobile App / Web Application  
**Performance Goals**: Thời gian tính toán Gross ↔ Net < 10ms; Render UI 60 fps.  
**Constraints**: 
- **Offline 100%**: Zero backend API dependency. Toàn bộ ruleset bundle trực tiếp trong app assets.
- **Privacy First** (Constitution V): Không thu thập, không gửi dữ liệu lương/thuế ra ngoài.
- **Precision**: Làm tròn từng khoản trừ đến đồng (VND integer), không làm tròn float dở dang.

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | PASS | Mọi kết quả hiển thị kèm `legal_sources` của ruleset đang áp dụng. |
| **II. Tách công thức & tham số** | PASS | Engine nhận `Ruleset` object versioned (`2025`, `2026-H1`, `2026-H2`), độc lập công thức. |
| **III. Breakdown giải thích được** | PASS | Object `SalaryBreakdown` trả về đầy đủ các bước: gross, BHXH, BHYT, BHTN, TNTT, Thuế theo từng bậc, Net. |
| **IV. Test case tính tay là sự thật** | PASS | Suite unit test kiểm tra 100% pass các test case `TC-TNCN-2025-01`, `TC-TNCN-2026-01`, `TC-BH-2026-01`, `TC-BH-2026-02`, `TC-BH-2026H2-01`. |
| **V. Quyền riêng tư tối thiểu** | PASS | Không gọi API bên ngoài, không yêu cầu MST/CCCD/Sổ BHXH. |
| **VI. Spec trước, code sau** | PASS | Spec 001 đã clarified và khóa Tầng 1 trước khi lập plan.md. |

## Project Structure

### Documentation & Specs

```text
specs/001-tinh-luong-gross-net/
├── spec.md              # Feature specification
├── plan.md              # File này (Technical implementation plan)
├── checklists/
│   └── requirements.md  # Checklist yêu cầu
└── tasks.md             # Phân rã nhiệm vụ triển khai (Phase 2)
```

### Source Code Architecture (`src/`)

```text
src/
├── domain/              # Business Domain & Data Contracts
│   ├── types/           # Core TypeScript types (SalaryInput, SalaryBreakdown, Ruleset)
│   └── constants/       # App constants & default options (Vùng I-IV, Năm thuế)
├── engine/              # Pure Offline Calculation Engine (Decoupled, 100% testable)
│   ├── rulesets/        # Data rulesets JSON (2025.json, 2026-h1.json, 2026-h2.json)
│   ├── rulesetLoader.ts # Loader tự động chọn ruleset theo tax_year & as_of_date
│   ├── insurance.ts     # Công thức tính BHXH, BHYT, BHTN theo trần & vùng
│   ├── pit.ts           # Công thức tính Thuế TNCN lũy tiến 7 bậc (2025) vs 5 bậc (2026)
│   ├── grossToNet.ts    # Logic Gross -> Net
│   ├── netToGross.ts    # Logic Net -> Gross (Binary Search / Interval Iteration)
│   └── index.ts         # Facade export calculation API
├── components/          # Reusable UI Components (Flat Design & Ngài Miu System)
│   ├── common/          # Card, Button, Input, Toggle, Badge
│   ├── breakdown/       # Render SalaryBreakdown detail list & progress bars
│   ├── disclaimer/      # Disclaimer & Legal Sources modal / footer
│   └── mascot/          # Mascot "Ngài Miu" (tuxedo cat) tips & responses
├── screens/             # App Screens
│   ├── CalculatorScreen.tsx # Screen chính tính Gross <-> Net
│   └── RulesetDetailScreen.tsx # Screen xem chi tiết tham số luật
├── store/               # State management (React Context / Zustand lightweight)
│   └── useCalculatorStore.ts
└── __tests__/           # Suite kiểm thử tự động
    ├── contract/        # Test schema integrity of rulesets
    ├── unit/            # Engine unit tests (TC-TNCN-*, TC-BH-*)
    └── integration/     # Roundtrip Net -> Gross -> Net test suite
```

## Calculation Logic & Precision Strategy

### 1. Gross → Net
1. **Bảo hiểm NLĐ**:
   - Lương đóng BH = `input.custom_insurance_salary ?? input.gross`
   - Trần BHXH/BHYT = 20 × `ruleset.reference_salary` (2,34tr cho H1/2026 → 46,8tr; 2,53tr cho H2/2026 → 50,6tr)
   - Trần BHTN = 20 × `ruleset.regional_minimum_wages[region]`
   - BHXH = round(min(Lương đóng BH, Trần BHXH/BHYT) × 8%)
   - BHYT = round(min(Lương đóng BH, Trần BHXH/BHYT) × 1.5%)
   - BHTN = round(min(Lương đóng BH, Trần BHTN) × 1%)
   - Tổng BH = BHXH + BHYT + BHTN
2. **TNTT** (giả định không có phụ cấp miễn thuế — xem chú thích thuật ngữ trong `docs/domain/thue-tncn.md`):
   - TN chịu thuế (nhãn TC) = gross − Tổng BH
   - Tổng giảm trừ = `ruleset.personal_relief` + (`num_dependents` × `ruleset.dependent_relief`)
   - TNTT = max(0, TN chịu thuế − Tổng giảm trừ)
3. **Thuế TNCN**:
   - Áp dụng biểu thuế lũy tiến tương ứng của `ruleset.pit_brackets` (7 bậc đối với 2025; 5 bậc đối với 2026).
   - Thuế = Σ round(phần thu nhập bậc i × thuế suất bậc i)
4. **Net**:
   - Net = gross − Tổng BH − Thuế

### 2. Net → Gross
- Sử dụng thuật toán Tìm kiếm Nhị phân (Binary Search) trên khoảng gross ∈ [Net, Net × 2] đến khi `calculateGrossToNet(grossCandidate).net` trùng khớp với target Net với sai số ≤ 1 VNĐ.
- Không dùng công thức quy đổi ngược cồng kềnh giúp dễ bảo trì khi luật thay đổi.

## Test Plan & Verification Matrix

- **Unit Tests**:
  - `TC-TNCN-2025-01`: Gross 30tr, 2025, Vùng I → Net 25.222.500 VNĐ.
  - `TC-TNCN-2026-01`: Gross 30tr, 2026, Vùng I → Net 26.065.000 VNĐ.
  - `TC-BH-2026-01`: Gross 30tr, Vùng I, Tháng 03/2026 → BH 3.150.000 VNĐ.
  - `TC-BH-2026-02`: Gross 60tr, Vùng I, Tháng 03/2026 → BH 5.046.000 VNĐ (dưới trần 46,8tr).
  - `TC-BH-2026H2-01`: Gross 60tr, Vùng I, Tháng 08/2026 → BH 5.407.000 VNĐ (trần mới 50,6tr theo NĐ 161/2026).
- **Roundtrip Tests**:
  - Kiểm tra Net → Gross → Net trên 50 mức lương ngẫu nhiên từ 5 triệu đến 200 triệu VNĐ, đảm bảo tái tạo Net ban đầu với sai số 0 đồng.
