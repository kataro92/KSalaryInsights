# Implementation Plan: Preset mức đóng BH (F022)

**Branch**: `master` (spec-only) | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: `/specs/013-preset-muc-dong-bh/spec.md` · ADR 0009

## Summary

Chuẩn hóa 3 preset căn cứ BH (`full` / `percent` / `absolute`) thành helper dùng chung Calculator + F021; thay toggle `customBh` mơ hồ; giữ trần F005; regress = 0 khi full.

## Technical Context

**Language/Version**: TypeScript / React Native / Expo ~57  
**Primary Dependencies**: `grossToNet`, `netToGross`, ruleset caps  
**Storage**: Preferences optional default preset (SHOULD); scenario inputs carry preset  
**Testing**: Jest unit helper + existing salary tests  
**Target Platform**: Expo iOS/Android/web  
**Project Type**: Mobile app  
**Performance Goals**: Negligible (pure function) 
**Constraints**: Constitution I-V; no PII; ±1 VND  
**Scale/Scope**: 1 helper module + Calculator UI + shared types

## Constitution Check

| Principle | Status |
|-----------|--------|
| I Legal | Pass - no new rates; only base selection |
| II Formula≠params | Pass - helper resolves base, engine unchanged |
| III Breakdown | Pass - show resolved insurance base |
| IV Hand-calc TC | Pass - SC-001 30tr vs 70% |
| V Privacy | Pass |
| VI Spec→code | Pass |

## Project Structure

```text
specs/013-preset-muc-dong-bh/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/insurance-base-preset.schema.json
└── tasks.md

src/
├── domain/types/insuranceBase.ts
├── engine/insuranceBase.ts          # resolveInsuranceParams()
├── components/inputs/InsuranceBasePresetPicker.tsx
├── screens/CalculatorScreen.tsx     # wire picker
└── __tests__/unit/insuranceBase.test.ts
```

**Structure Decision**: Shared domain+engine helper; UI picker reusable by F021.

## Complexity Tracking

None.
