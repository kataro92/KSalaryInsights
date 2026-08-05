# Store listing kit — KVSalaryTools

## Brand (ADR 0007)

| Field | Value |
|-------|--------|
| Name | KVSalaryTools |
| Subtitle / short | Ước tính lương · thuế · BHXH offline |
| Assistant | Ngài Miu — hướng dẫn breakdown & disclaimer |
| Author | Phạm Huy Đức · kataro92@gmail.com |

## Screenshot set (phone 390×844)

Capture **light mode only**. Prefer device frame off for store upload; keep framed copies for design review.

Save files under [`captures/`](./captures/) using the names below.

| # | File | Screen | Why |
|---|------|--------|-----|
| 01 | `01-splash-onboarding.png` | Splash / onboarding intro (Ngài Miu) | Brand + assistant |
| 02 | `02-calculator-net.png` | Calculator after Tính (Net hero + breakdown) | Core job |
| 03 | `03-settlement-result.png` | Settlement result (hoàn / nộp thêm) | Trust / seasonal |
| 04 | `04-benefits-hub.png` | Benefits hub | Poster menu |
| 05 | `05-retirement.png` | Retirement dual heroes (after disclaimer) | Serious benefit |
| 06 | `06-settings-about.png` | Settings · Về chúng tôi + language / feedback | About + trust |

### Capture procedure (local)

```bash
npx expo start
# Open on device/simulator at ~390×844
# Walk through the 6 screens above; export PNGs into docs/store/captures/
```

Also walk Design QA: [`../product/design-qa-checklist.md`](../product/design-qa-checklist.md).

## Copy snippets

Full bilingual listing: [`listing-copy.md`](./listing-copy.md).

**Short description (vi)**  
Ước tính Gross↔Net, quyết toán thuế và quyền lợi BHXH — offline trên thiết bị.

**Full description opening (vi)**  
KVSalaryTools giúp bạn xem rõ từng khoản trừ lương và thuế theo ruleset năm. Ngài Miu hướng dẫn từng bước; tính toán lưu cục bộ — không yêu cầu CCCD / MST.

## Assets

- App icon / splash: `assets/images/` · Mascot: `assets/mascot/`
- Design QA: [`../product/design-qa-checklist.md`](../product/design-qa-checklist.md)
- Automated token/shadow check: `npm run qa:design`

## Status

| Item | Status |
|------|--------|
| Listing copy (vi/en) | Ready |
| Capture naming + folder | Ready |
| PNG captures (6) | Pending device/session capture |
| Design QA human sign-off | Pending visual review |
