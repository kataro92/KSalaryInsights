# Design QA checklist — KVSalaryTools

Use before store submission. Cross-check [`design-system.md`](./design-system.md) §1–8 and [`design-upgrade-plan.md`](./design-upgrade-plan.md) §8.

## Visual / brand

- [ ] Brand `KVSalaryTools` is hero-level on splash + first onboarding step (ADR 0007)
- [ ] Ngài Miu appears on splash, onboarding, About, tips — never overlays money rows
- [ ] Palette tokens only (no one-off hex in screens except documented exceptions)
- [ ] Flat Design: no shadows, no glow, color-as-structure

## Consistency

- [ ] Every calculator: empty → validate error → ResultHero peak → tip → breakdown → disclaimer
- [ ] Sticky CTA on primary calculate journeys
- [ ] Hub cards use `HubNavCard` (Reanimated press)

## Motion

- [ ] Button / chip / hub press scale
- [ ] Tab icon scale on focus
- [ ] Screen enter fade (~300ms)
- [ ] ResultHero count-up ≤400ms
- [ ] No infinite looping animations

## Accessibility

- [ ] Touch targets ≥44×44
- [ ] Money peaks use `moneyAccessibilityLabel` (Vietnamese speech)
- [ ] WCAG AA matrix pairs still green after token changes (`design-system.md` §6.1)

## Trust / legal

- [ ] Disclaimer + legal sources present; sources collapsed by default on long screens
- [ ] Retirement lump-sum gate blocks amounts until ack
- [ ] Ngài Miu copy never advises “nên rút” / softens statute

## Mobile visual QA (390×844)

- [ ] Tabs: Lương, Quyết toán, Quyền lợi, Cài đặt
- [ ] Deep: Thai sản, Hưu, Thu nhập khác (one mode)
- [ ] Capture set under [`../store/README.md`](../store/README.md)
