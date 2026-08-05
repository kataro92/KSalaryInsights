# ADR 0006 — Pastel surfaces + raster Ngài Miu

- **Status**: Accepted  
- **Date**: 2026-08-05  
- **Context**: Geometric SVG mascot and hard cobalt/white chrome read as generic “AI slop.” Users want Ngài Miu as a visible cartoon assistant (icon, splash, about, tips) and a softer pastel product look.

## Decision

1. **Mascot assets are raster** (PNG + WebP) in `assets/mascot/`, not SVG. Poses: wave, tip, point, confused/empty, bow, docs, icon, splash.
2. **App icon / splash / favicon** use generated cartoon portraits (`assets/images/*`), pastel sky background `#F7FAFF`.
3. **Palette v3 (pastel)**: soft sky canvas, soft cobalt CTA, soft mint results, soft peach accent — Flat Design rules stay (no shadow, no glow). Avoid banned cream+terracotta+serif and purple defaults.
4. **Lucide / functional chrome icons** may remain SVG (tabs, chevrons, hub glyphs). Decorative character art must not be SVG.
5. Ngài Miu copy frames him as a **guide/assistant** (onboarding intro, tips labeled “Ngài Miu gợi ý”, About Us).

## Consequences

- Bundle size grows with PNG poses; WebP siblings kept for future/platform optimization.
- `NgaiMiuPlaceholder` loads `Image` sources; `react-native-svg` is no longer required for the mascot.
- Design-system §8 style notes update from flat vector to cute cartoon cel-shaded raster.

## Alternatives rejected

- Keep SVG placeholder and only recolor (still feels geometric/slop).
- Replace all Lucide icons with PNGs (unnecessary; chrome icons are functional, not brand).
- Cream / terracotta / serif “warm editorial” pastel (explicitly banned).
