# Design QA checklist. KSalaryInsights

Use before store submission. Cross-check [`design-system.md`](./design-system.md) §1-8.

**Automated (CI/local):** `npm run qa:design`. fails on shadow/elevation or off-token hex under `src/` (except `theme/tokens.ts` / `theme/palettes.ts`).

## Visual / brand

- [x] Brand `KSalaryInsights` is hero-level on splash + first onboarding step (ADR 0007). code path
- [x] Ngài Miu appears on splash, onboarding, About, tips. never overlays money rows. code path
- [x] Palette tokens only. run `npm run qa:design`; human spot-check screenshots
- [x] Flat Design: no shadows, no glow. run `npm run qa:design`; human spot-check

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
- [x] WCAG AA matrix pairs still green after token changes (`design-system.md` §6.1). visual

## Trust / legal

- [x] Disclaimer + legal sources present; InfoTip sources on key lines
- [x] Retirement lump-sum gate blocks amounts until ack
- [x] Ngài Miu copy never advises “nên rút” / softens statute

## Mobile visual QA (390×844)

- [x] Tabs: Lương, Quyết toán, Quyền lợi, Cài đặt trên LDPlayer; ảnh ở `docs/screenshots/2026-10-02/android/`. Thiết bị thật/iOS còn chờ.
- [ ] Deep: Thai sản, Hưu, Thu nhập khác (one mode)
- [ ] Capture set under [`store/README.md`](../store/README.md) / [`store/captures/`](../store/captures/)

**Sign-off:** Đã QA web và LDPlayer; chưa sign-off phát hành store, thiết bị thật/iOS và bàn phím còn chờ.

## QA web 02/10/2026

- [x] Lương/offer: 320, 390, 1200px; sáng/tối; không cuộn ngang/page error.
- [x] Cài đặt 390px sáng/tối; Quyết toán/Quyền lợi 390px sáng.
- [x] Lưu/nạp khoản mới, sửa xóa kết quả, giảm trừ đa nguồn một lần, HKD thiếu chi phí và offer bằng nhau/một bên lỗi.
- [ ] Thiết bị thật: blur, safe area, chữ lớn và bàn phím.

## QA Android LDPlayer 02/10/2026

- [x] LDPlayer Android 9: Lương/Quyết toán/Quyền lợi/Cài đặt/offer; 320/390 dp, sáng/tối, chữ 100%/130%, VI/EN. Đã sửa nền tab/CTA, cuộn kết quả, status bar, nhãn tab và bảng offer màn hẹp. [Ảnh Android](../screenshots/2026-10-02/android/README.md).
- [ ] Bàn phím Android: IME LDPlayer có chiều cao 0; cần kiểm tra trên IME/thiết bị khác.

[Báo cáo](./improvement-implementation-report.md).
