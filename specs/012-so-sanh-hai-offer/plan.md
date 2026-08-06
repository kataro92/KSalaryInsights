# Implementation Plan: So sánh hai offer (F021)

**Branch**: `master` (spec-only) | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: `/specs/012-so-sanh-hai-offer/spec.md` · depends **F022** helpers · ADR 0009

## Summary

Màn so sánh 2 offer (Gross/Net độc lập) với context thuế/vùng/NPT chung; BH qua F022; ΔNet/ΔGross; tái dùng engine lương; không tư vấn chọn; không bonus/OT.

## Technical Context

**Language/Version**: TypeScript / RN / Expo ~57  
**Primary Dependencies**: F022 `insuranceBase`, `grossToNet`, `netToGross`, scenarios  
**Storage**: Local scenario `offer_compare`  
**Testing**: Jest compareOffers ±1 vs single-sided engine  
**Target Platform**: Expo  
**Project Type**: Mobile app  
**Performance Goals**: 2× salary calc < 50ms  
**Constraints**: Constitution; no “should take” copy; F022 required  
**Scale/Scope**: 1 route + compare engine + CTA từ Calculator

## Constitution Check

| Principle | Status |
|-----------|--------|
| I–II | Pass — reuse engines |
| III | Pass — per-offer BH/tax/net + delta |
| IV | Pass — SC-002 |
| V | Pass — no PII |
| VI | Pass — after F022 plan |

## Project Structure

```text
specs/012-so-sanh-hai-offer/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/offer-compare.schema.json
└── tasks.md

src/
├── domain/types/offerCompare.ts
├── engine/offerCompare.ts
├── screens/OfferCompareScreen.tsx
├── components/comparison/OfferColumn.tsx
├── components/comparison/OfferDeltaBar.tsx
└── __tests__/unit/offerCompare.test.ts

app/offer-compare.tsx
```

**Structure Decision**: Dedicated route; shared F022 picker; not dual Calculator instances.

## Complexity Tracking

None. Depends on F022 shipping helper first (same PR OK).
