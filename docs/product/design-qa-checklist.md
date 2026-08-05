# Design QA checklist. KVSalaryTools

Use before store submission. Cross-check [`design-system.md`](./design-system.md) §1–8.

**Automated (CI/local):** `npm run qa:design`. fails on shadow/elevation or off-token hex under `src/` (except `theme/tokens.ts`).

## Visual / brand

- [x] Brand `KVSalaryTools` is hero-level on splash + first onboarding step (ADR 0007). code path
- [x] Ngài Miu appears on splash, onboarding, About, tips. never overlays money rows. code path
- [ ] Palette tokens only. run `npm run qa:design`; human spot-check screenshots
- [ ] Flat Design: no shadows, no glow. run `npm run qa:design`; human spot-check

## Consistency

- [x] Salary / settlement calculators: empty → validate → ResultHero → tip → breakdown → disclaimer (+ InfoTip)
- [x] Sticky CTA on Calculator + Settlement + simple other-income
- [x] Hub cards use `HubNavCard` (Reanimated press)

## Motion

- [ ] Button / chip / hub press scale. device QA
- [ ] Tab icon scale on focus. device QA
- [ ] Screen enter fade (~300ms). device QA
- [ ] ResultHero count-up ≤400ms. device QA
- [x] No infinite looping animations. code review

## Accessibility

- [x] Touch targets ≥44×44 on primary controls (`layout.minTouch`)
- [x] Money peaks use `moneyAccessibilityLabel`
- [ ] WCAG AA matrix pairs still green after token changes (`design-system.md` §6.1). visual

## Trust / legal

- [x] Disclaimer + legal sources present; InfoTip sources on key lines
- [x] Retirement lump-sum gate blocks amounts until ack
- [x] Ngài Miu copy never advises “nên rút” / softens statute

## Mobile visual QA (390×844)

- [ ] Tabs: Lương, Quyết toán, Quyền lợi, Cài đặt
- [ ] Deep: Thai sản, Hưu, Thu nhập khác (one mode)
- [ ] Capture set under [`./store/README.md`](./store/README.md) / [`./store/captures/`](./store/captures/)

**Sign-off:** _pending device capture session_
