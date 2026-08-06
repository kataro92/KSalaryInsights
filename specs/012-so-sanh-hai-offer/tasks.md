# Tasks: So sánh hai offer (F021)

**Input**: `specs/012-so-sanh-hai-offer/`  
**Prerequisites**: **F022** T004–T005 (helpers) + picker component  
**Tests**: Yes (SC-002)

## Phase 1: Setup

- [x] T001 Confirm F022 helpers available (`src/engine/insuranceBase.ts`)
- [x] T002 [P] Confirm routes/docs for `offer-compare`

## Phase 2: Foundational

- [x] T003 Add `src/domain/types/offerCompare.ts` per data-model
- [x] T004 Implement `compareOffers` in `src/engine/offerCompare.ts` (call grossToNet / netToGrossWithPreset)
- [x] T005 [P] Unit tests `src/__tests__/unit/offerCompare.test.ts` (ΔNet, infeasible hides delta, ±1 vs single call)
- [x] T006 Extend `src/store/scenarios.ts` for kind `offer_compare`

**Checkpoint**: Engine compare ready

## Phase 3: US1 — Net vs Gross columns (P1) 🎯 MVP

- [x] T007 [US1] `OfferColumn` UI in `src/components/comparison/OfferColumn.tsx` (mode, amount, F022 picker)
- [x] T008 [US1] `OfferDeltaBar` in `src/components/comparison/OfferDeltaBar.tsx`
- [x] T009 [US1] Screen `src/screens/OfferCompareScreen.tsx` + `app/offer-compare.tsx`
- [x] T010 [US1] Shared taxYear/month/region/NPT controls
- [x] T011 [US1] CTA from `CalculatorScreen.tsx` (“So 2 offer”)
- [x] T012 [US1] Disclaimer + forbid advice copy
- [x] T013 [US1] Quickstart A + C

## Phase 4: US2 — BH khác nhau (P1)

- [x] T014 [US2] Ensure each column uses independent InsuranceBasePreset
- [x] T015 [US2] Show per-column insurance base label
- [x] T016 [US2] Quickstart B unit/manual

## Phase 5: Polish

- [x] T017 Save/load/share offer_compare scenarios
- [x] T018 [P] i18n VI/EN in `src/i18n/messages.ts` — screen copy inline VI; FeaturesGuide EN
- [x] T019 [P] features/README CTA copy when shipped
- [x] T020 Mark F021 ✅ in `docs/product/scope.md`; `npm run test:unit`

## Dependencies

```text
F022 helpers → Phase 2 → US1 → US2 → Polish
US1 ∥ US2 after T004 (US2 mostly UI verification)
```

## MVP

Phase 2 + Phase 3. US2 trivial if F022 picker already on columns — include in MVP.

## Parallel

- After T003: T004 then T005∥T006
- After T004: T007∥T008
