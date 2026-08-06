# Tasks: Tổng hợp quyết toán đa nguồn (F020)

**Input**: Design documents from `/specs/011-tong-hop-qt-da-nguon/` 
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md 
**Tests**: Có - unit fixtures theo SC-002 / US2 (Constitution IV)

**Organization**: Theo user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallelizable
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Confirm ADR 0009 + scope F020 still Planned in `docs/product/scope.md` before coding
- [x] T002 [P] Add domain types file stub plan review only - `src/domain/types/multiSource.ts` paths locked in plan.md (create at implement time)
- [x] T003 [P] Register planned route name `multi-source` in docs only until implement (`app/multi-source.tsx`)

---

## Phase 2: Foundational (blocking)

- [x] T004 Define `MultiSourceKind` / `MultiSourceLine` / `MultiSourceAnnualSummary` in `src/domain/types/multiSource.ts` per `data-model.md`
- [x] T005 Implement orchestrator `src/engine/multiSourceAnnual.ts`: sum totals, exclude flags, reject unknown kinds
- [x] T006 [P] Extend scenario parse/save for `kind: "multi_source"` in `src/store/scenarios.ts` using `contracts/annual-multi-source.schema.json` rules
- [x] T007 [P] Unit tests skeleton `src/__tests__/unit/multiSourceAnnual.test.ts` (salary-only, unknown-kind reject)

**Checkpoint**: Types + orchestrator + storage contract ready

---

## Phase 3: User Story 1 - Bảng năm đa nguồn (P1) MVP

**Goal**: Màn tổng hợp với ≥ salary + rent + casual, totals, empty state, disclaimer 
**Independent test**: Quickstart Scenario A-B

- [x] T008 [US1] Build `MultiSourceTable` + `MultiSourceLineEditor` in `src/components/settlement/`
- [x] T009 [US1] Screen `src/screens/MultiSourceSummaryScreen.tsx` + route `app/multi-source.tsx`
- [x] T010 [US1] Wire taxYear selector, add/remove/exclude lines, compute totals via orchestrator
- [x] T011 [US1] CTA from `src/screens/SettlementScreen.tsx` to multi-source route
- [x] T012 [US1] Empty state links to calculator / other-income / settlement
- [x] T013 [US1] Strong estimate disclaimer + crypto out-of-scope line on summary screen
- [x] T014 [US1] Optional: import amounts from saved settlement/calculator scenarios into lines
- [x] T015 [US1] Unit test: three-line fixture totals = sum of line taxes

---

## Phase 4: User Story 2 - HKD / freelancer trong tổng hợp (P1)

**Goal**: Dòng HKD dưới/trên ngưỡng; GTGT+TNCN tách; không gộp lũy tiến 
**Independent test**: Quickstart Scenario C-D / TC-HKD-01/02

- [x] T016 [US2] Helper to map `HkdBreakdown` → `MultiSourceLine` in `src/engine/multiSourceMappers.ts`
- [x] T017 [P] [US2] Helpers map `RentBreakdown` / casual / securities / esop → `MultiSourceLine` in `src/engine/multiSourceMappers.ts`
- [x] T018 [US2] UI: add HKD line (industry + revenue) calling existing `calculateHkd`
- [x] T019 [US2] Notes for exempt reporting obligation; split vat/pit columns or subtext
- [x] T020 [US2] Unit test SC-002: salary tax T + HKD exempt → totals.estimatedTax === T (±1)

---

## Phase 5: User Story 3 - Không coin (P1)

**Goal**: Không path crypto; disclaimer; parse reject 
**Independent test**: Quickstart Scenario E

- [x] T021 [US3] Ensure UI ChoiceChips / kinds omit crypto in `MultiSourceSummaryScreen.tsx`
- [x] T022 [US3] Scenario parse rejects `kind: "crypto"` in `src/store/scenarios.ts`
- [x] T023 [US3] Assert OtherIncomeDisclaimer + summary disclaimer both mention coin out of scope
- [x] T024 [US3] Unit test: crypto kind throws / returns validation error

---

## Phase 6: Cross-cutting (FR-008 / FR-009 / DualScenario)

- [x] T025 Persist multi_source scenarios (save/load/share) via `ScenarioPanel` / `SaveScenarioModal` patterns
- [x] T026 Update `evaluateFilingWizard` / `FilingWizardScreen` when non-salary sources present → self_file + extended checklist
- [x] T027 DualScenario: when salary+casual exempt, surface both modes or deep-link - no silent single total
- [x] T028 [P] i18n strings VI/EN for multi-source UI in `src/i18n/messages.ts` - FeaturesGuide EN/VI; screen VI primary
- [x] T029 [P] Update `src/copy/features.ts` situation multi-source from “sắp có” → shipped when done
- [x] T030 Mark F020 OK in `docs/product/scope.md` + specs README after QA quickstart pass
- [x] T031 Run `npm run test:unit` + manual quickstart A-F

---

## Dependencies

```text
Phase 1 → Phase 2 → Phase 3 (US1 MVP)
                ↘ Phase 4 (US2) after T005 mapper-ready
                ↘ Phase 5 (US3) can parallel with US1 after T004 enum locked
Phase 6 after US1-US3 core UI
```

## Parallel examples

- After T004: T006 ∥ T007 
- After T005: T016 ∥ T020-T021 
- Polish: T027 ∥ T028 

## MVP scope

**Ship MVP** = Phase 2 + Phase 3 (US1) + Phase 5 (US3 disclaimer/reject). 
US2 (HKD) SHOULD ship cùng MVP nếu mapper sẵn - khuyến nghị cùng release vì ADR 1c.

## Implementation strategy

1. Spec complete 
2. Product owner: implement F020 
3. MVP US1+US3 → US2 → FR-008/009 
4. No crypto features ever without new ADR
