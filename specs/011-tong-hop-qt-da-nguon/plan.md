# Implementation Plan: Tổng hợp quyết toán đa nguồn (F020)

**Branch**: `master` (spec-only; implement branch sau) | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-tong-hop-qt-da-nguon/spec.md`  
**ADR**: [0009](../../docs/decisions/0009-product-direction-multisource-qt-no-crypto.md)

## Summary

F020 thêm **bảng ước thuế năm đa nguồn** trên thiết bị: orchestration kết quả từ engine lương (F007/F008) và thu nhập khác (F016-F018), không viết lại công thức từng loại, không crypto, không nộp tờ khai. UI gắn tab Quyết toán (mở rộng) hoặc route con; lưu kịch bản local (F014).

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19 / React Native, Expo SDK ~57  

**Primary Dependencies**: Expo Router, AsyncStorage (scenarios), engine hiện có (`annualSettlement`, `otherIncome/*`), i18n tips  

**Storage**: Local only - mở rộng `src/store/scenarios.ts` (kind mới hoặc payload tổng hợp); không server  

**Testing**: Jest unit (`src/__tests__/unit/`) - fixture tổng hợp + regression DualScenario; không E2E bắt buộc ở phase spec  

**Target Platform**: iOS / Android / web (Expo); offline-first  

**Project Type**: Mobile app (Expo Router `app/` + `src/`) 

**Performance Goals**: Tổng hợp ≤ 6 nguồn, tính < 100ms trên thiết bị tầm trung; UI scroll mượt  

**Constraints**: Constitution I-V; MUST NOT crypto path; MUST NOT gộp HKD/thuê/CK vào PIT lũy tiến lương; breakdown từng dòng nguồn; privacy - không MST/CCCD  

**Scale/Scope**: 1 màn tổng hợp + engine orchestrator + 1 loại scenario; wizard F007b chỉnh nhẹ  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Legal cites | Pass | Tái dùng `legalSources` từ từng engine; không thêm tham số luật mới trừ ghi chú miễn/ngưỡng đã khóa domain |
| II. Formula ≠ params | Pass | Orchestrator không hard-code rate; gọi ruleset qua engine sẵn có |
| III. Breakdown | Pass | Mỗi dòng nguồn + tổng; nhãn “ước” |
| IV. Hand-calc TC | Pass | SC-002 + fixture lương+HKD; DualScenario giữ TC-QT-2026-02 |
| V. Privacy | Pass | Không MST/CCCD; local scenarios |
| VI. Spec before code | Pass | Plan/tasks trước implement |

**Post-design re-check**: Pass - contracts chỉ TypeScript domain types + UI contract; không API mạng.

## Project Structure

### Documentation (this feature)

```text
specs/011-tong-hop-qt-da-nguon/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── annual-multi-source.schema.json
└── tasks.md
```

### Source Code (planned - implement later)

```text
src/
├── domain/types/multiSource.ts          # entities tổng hợp
├── engine/multiSourceAnnual.ts          # orchestrator (sum lines, no rate math)
├── store/scenarios.ts                   # extend kind / payload
├── screens/MultiSourceSummaryScreen.tsx # or Settlement section
├── components/settlement/
│   ├── MultiSourceTable.tsx
│   └── MultiSourceLineEditor.tsx
└── __tests__/unit/multiSourceAnnual.test.ts

app/
└── multi-source.tsx                     # route (hoặc embed settlement)
```

**Structure Decision**: Single Expo app. Orchestrator trong `src/engine/`; UI dưới Quyết toán / route `multi-source`. Không package mới.

## Complexity Tracking

> Không có violation constitution cần giải trình.
