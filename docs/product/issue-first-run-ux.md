# Issue: First-run UX so people catch on and keep using the app

**Status**: Open (product issue; GitHub Issues could not be filed from the agent environment)  
**Type**: Enhancement / UX  
**Suggested GitHub title**: `UX: first-run aha + situation IA so users catch on and keep using`  
**Goal**: A new user knows what the app does, how to use it, and why it helps, in a natural way. They get value in the first session and come back when pay, law, or life events change.

Paste this file as the GitHub issue body if you file it at [kataro92/KSalaryInsights](https://github.com/kataro92/KSalaryInsights/issues). Do not restyle the design system. Do not change the calculation engine.

---

## User intent

People should:

1. Know **what this app is for** without reading Settings.
2. Know **how to use it** without a feature catalog.
3. Feel the **benefit** next to a real number, not in a brochure.
4. Catch on in the first session.
5. Keep using it over months (offer, payslip, year change, filing season, leave).

## Context

KSalaryInsights already has a strong engine, breakdown, mascot (Ngài Miu), 4-step onboarding, situation copy, and a glass + solid-number design system.

The gap is **information architecture and first-run meaning**. Situation and benefit copy already lives in `src/copy/features.ts`, but users meet it in **Cài đặt → Tính năng & công cụ**. First open is splash → four feature slides → a dense calculator with `30.000.000` prefilled and **no result until Tính**. Flagship jobs such as **So 2 offer** are text links after the disclaimer.

A new user can finish onboarding and still not know: this is for my offer or my payslip, and I just tap **Tính**.

Related files:

- `src/components/onboarding/OnboardingScreen.tsx`
- `src/i18n/messages.ts` (`onboarding.*`, `calc.subtitle`)
- `src/copy/miu.ts`, `src/copy/features.ts`
- `src/screens/CalculatorScreen.tsx`
- `src/components/common/PageHero.tsx`
- `src/components/settings/FeaturesGuide.tsx`
- `src/components/common/SeasonalBanner.tsx`
- `docs/product/design-system.md`
- `specs/009-app-shell-ux/spec.md`

## Out of scope

- Replacing the visual system (tokens, Plus Jakarta Sans, glass chrome, solid money, no shadow, no emoji).
- Installing [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) as a default Cursor skill. It is a visual catalog (palettes, landing-page patterns, font pairings). Useful only as a locked a11y/checklist pass. It will fight this product if used to generate a new look.
- Engine / formula / ruleset changes.
- Account, cloud sync, or collecting CCCD / MST / sổ BHXH.
- Gamification, streaks, or badge loops.

---

## Workstream 1. First 30 seconds: one job, one aha

Onboarding currently **describes** four product areas. People remember a number they just made, not a feature list.

- [ ] Collapse first-run to one purpose line, for example: *Xem thực nhận từ lương Gross, ngay trên máy bạn.*
- [ ] Optional one question: *Bạn đang so offer, hay đối chiếu bảng lương?* Skip is fine.
- [ ] Land on **Lương** with amount + **Tính** in reach.
- [ ] Auto-run the sample Gross (`30.000.000`) so **Net + breakdown** appear before the user types.
- [ ] One Miu sentence after that number: *Đây là thực nhận ước tính. Sửa số của bạn, bấm Tính lại.*
- [ ] Keep privacy as a caption, not a fourth slide: calculations stay on device, no CCCD / MST / sổ BHXH.
- [ ] Keep Skip. The first result is the tutorial.

Acceptance:

- Cold start first session: user sees a Net hero without hunting through Settings.
- Privacy line still visible.
- Replay from Cài đặt still works.

## Workstream 2. Speak in situations, not in tools

Tabs **Lương · Quyết toán · Quyền lợi · Cài đặt** can stay. They are accurate but accountant-shaped. New users think in jobs.

- [ ] On home, surface four situation chips (copy already in `src/copy/features.ts`), then the calculator:
  - So offer
  - Xem thực nhận
  - Quyết toán năm
  - Quyền lợi (thai sản, thôi việc…)
- [ ] Rewrite calculator subtitle from a tool list (`Gross-Net · thưởng · làm thêm giờ · biểu thuế 2025 / 2026`) to an outcome: *Nhập Gross, xem tiền về tay. Tách BH, giảm trừ, thuế.*
- [ ] Pair the empty state with a sample result, not only a gray box.
- [ ] On Quyền lợi hub, add one line *Chọn việc đang xảy ra* and keep existing groups.

| They have | They should land on |
|-----------|---------------------|
| Offer 28tr Net vs 32tr Gross | So 2 offer, from home |
| Payslip smaller than expected | Gross → Net + breakdown |
| March–April | Quyết toán (seasonal banner already hints) |
| Maternity / quit / side income | Quyền lợi by life event |

## Workstream 3. Progressive disclosure on the calculator

`CalculatorScreen` is a full studio: mode, year, bonus, OT, region, month, dependents, BH preset, scenarios, 2025 vs 2026, So 2 offer.

Default path:

**Amount → Tính → Net hero → 3 groups (BH / GTGC / thuế) → Chỉnh thêm**

- [ ] Hide behind **Chỉnh thêm** (or equivalent): thưởng / OT, BH preset details, 2025 vs 2026, extra region/month fields.
- [ ] Keep a one-line BH default: *Đóng BH theo Gross. Đổi nếu công ty đóng theo lương cơ bản.*
- [ ] Hide empty **Kịch bản đã lưu** on first visit (show when count > 0).
- [ ] Promote **So 2 offer** to a first-class card near the top or beside the result. Do not leave it as a text link after the disclaimer.

## Workstream 4. Benefits next to the result

Do not add a marketing page. Attach meaning to the number.

- [ ] After Net, one Miu sentence from the breakdown already computed, for example: *Từ 30tr Gross, về tay khoảng 26,2tr. BH …, thuế phần còn lại.*
- [ ] On So 2 offer: *Offer B thực nhận cao hơn khoảng X. App không khuyên chọn.*
- [ ] On quyết toán: *Ước hoàn / nộp thêm so với đã khấu trừ. Đối chiếu phiếu lương trước khi nộp.*
- [ ] One Miu card per screen. Do not stack tips that compete with the number.
- [ ] After first visit, drop repeating `KSalaryInsights` on every `PageHero`. Lead with the job (`Tính lương`, `Thực nhận`). Keep the English name as brand, not as the headline people must decode.

Reuse existing voice in `aboutCopy` and `miuTips`. Repeat it once, next to the figure.

## Workstream 5. Love over time: return for a reason

Retention is calendar + saved numbers, not chrome.

Hooks already in the product: local scenarios, seasonal banner (Tết / tháng 3–4), ruleset update in Settings, 2025 vs 2026 comparison.

- [ ] After first successful calc, prompt once: *Lưu kịch bản ‘Offer A’ để so lần sau.*
- [ ] Returning home: last Net + *Tính lại với năm 2026* when rules differ from the last run.
- [ ] Seasonal banner names **their** scenario (partially started in `SeasonalBanner`).
- [ ] Light “what’s new this year” when caps/brackets differ from the last saved run (`comparison` already exists).

Do not add streaks or points. Trust is the loop: I come back when the law or my job changes, and my old numbers are still here, private.

## Workstream 6. Visual tune (not restyle)

Keep tokens, mascot rules, no emoji, no em dash, WCAG AA, 44px targets.

- [ ] First paint should be result-shaped after sample Tính / auto-sample (Net above the fold).
- [ ] Tab labels: prefer 11–12px (today 10px) and shorter words if they clip.
- [ ] Optional later: ui-ux-pro-max **only** as an a11y pass with tokens locked.

---

## Suggested implementation order

1. First-run aha (auto-sample Net, one onboarding beat).
2. Home situation chips + So 2 offer as a first-class entry.
3. Collapse power features behind **Chỉnh thêm**.
4. Returning home: last scenario + seasonal / year-change cue.
5. Visual tune and optional a11y pass.

Engine, legal sources, and design tokens stay as they are. New copy goes through `src/copy/` + `src/i18n/messages.ts` (vi first). Spec Kit before code if this becomes F023 / spec `014`.

## Success criteria

- A person who has never used the app can state what it does after the first screen (estimate take-home / compare offers / check a payslip).
- They can produce a Net (or offer delta) without opening Cài đặt or reading a feature list.
- So 2 offer is findable from home without scrolling past the disclaimer.
- Returning in filing season or after a ruleset year change, they see their last numbers and a reason to recalculate.
- No new visual language. No PII fields.

## Notes on ui-ux-pro-max-skill

Helpful as a **visual/a11y checklist**. Not helpful as the driver of this issue. Installing it unconstrained will tend to replace pastel sky + solid money + Ngài Miu with a generic fintech landing look, which hurts trust for a legal-estimate app.
