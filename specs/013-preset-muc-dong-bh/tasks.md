# Tasks: Preset mức đóng BH (F022)

**Input**: `specs/013-preset-muc-dong-bh/` 
**Tests**: Yes (SC-001…003) 
**Depends**: None (foundational for F021)

## Phase 1: Setup

- [x] T001 Confirm F022 Planned in `docs/product/scope.md` before coding
- [x] T002 [P] Lock file paths per `plan.md`

## Phase 2: Foundational

- [x] T003 Add types in `src/domain/types/insuranceBase.ts` per data-model
- [x] T004 Implement `resolveForGrossToNet` + validators in `src/engine/insuranceBase.ts`
- [x] T005 Implement `netToGrossWithPreset` wrapper (percent path) in `src/engine/insuranceBase.ts`
- [x] T006 [P] Unit tests `src/__tests__/unit/insuranceBase.test.ts` (full/percent/absolute/validate)
- [x] T007 Migrate calculator scenario inputs: map legacy `customBh` → preset in `src/store/scenarios.ts`

**Checkpoint**: Helper ready for Calculator + F021

## Phase 3: US1 - Calculator Gross presets (P1) MVP

- [x] T008 [US1] Build `InsuranceBasePresetPicker` in `src/components/inputs/InsuranceBasePresetPicker.tsx`
- [x] T009 [US1] Replace customBh toggle in `src/screens/CalculatorScreen.tsx` with picker
- [x] T010 [US1] Wire gross→net path through `resolveForGrossToNet`
- [x] T011 [US1] Show resolved BH base in result meta / breakdown
- [x] T012 [US1] Manual/unit: quickstart A-B-C

## Phase 4: US2 - Net→Gross presets (P2)

- [x] T013 [US2] Wire Calculator net→gross through `netToGrossWithPreset`
- [x] T014 [US2] UI note for percent-on-solved-gross
- [x] T015 [US2] Tests quickstart D; round-trip full ±1

## Phase 5: Polish

- [x] T016 [P] i18n labels VI/EN for presets in `src/i18n/messages.ts` - picker uses inline VI labels (consistent with Calculator chips); EN via FeaturesGuide
- [x] T017 Export picker+types for F021; document in plan cross-link
- [x] T018 Mark F022 shipped in scope after QA; run `npm run test:unit`

## Dependencies

```text
T003-T007 → T008-T012 (US1) → T013-T015 (US2) → T016-T018
F021 MUST NOT start UI until T004-T005 done (or same PR after helpers)
```

## MVP

Phase 2 + Phase 3 (US1). US2 SHOULD cùng release.
