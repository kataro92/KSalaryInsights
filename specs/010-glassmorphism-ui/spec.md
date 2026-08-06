# Spec 010: Glassmorphism UI Upgrade

**Status**: Complete (5 review rounds done) 
**Date**: 2026-08-05 
**App**: KSalaryInsights (React Native / Expo) 
**Supersedes (partially)**: Flat-only rules in `docs/product/design-system.md` §1, §2.4, §3.2 for chrome surfaces. Flat Color Blocks remain for dense forms and numeric results.

---

## 0. Round log

| Round | Review finding | Spec change | Implement focus |
|-------|----------------|-------------|-----------------|
| R1 | Flat pastel canvas; solid muted tab bar; no depth; crash on tab icons (stale Lucide) | Introduce Glass material + tokens + usage map | Tokens, `GlassSurface`, ambient canvas, PNG tab icons |
| R2 | Hub cards + tips still solid ColorBlocks. glass needs tinted frost over blobs | Map HubNavCard / NgaiMiuTip → glass.regular; ColorBlock stays solid by default | HubNavCard, NgaiMiuTip, stronger ScreenShell blobs |
| R3 | Tab bar & sticky CTA opaque. miss frosted chrome reading | Tab / sticky → glass.thin; absolute tab bar over content | Tab `BlurView` + StickyActionBar glass; clearance bump |
| R4 | SeasonalBanner / InfoTip still flat; forms must stay solid | Banner + modal → glass; ResultHero never glass | SeasonalBanner, InfoTip thick sheet; ColorBlock `glass` opt-in |
| R5 | CollapseSection missing token import (crash); long tips need thick fill; a11y fallback | Document Reduce Transparency; sync design-system.md | Fix CollapseSection; QA screenshots; acceptance check |

---

## 1. Research summary (best practices)

Sources: NN/g Glassmorphism, Axess Lab, Clay (2026), Orizon (2026), Fluent Acrylic, Apple materials.

### 1.1 What glassmorphism is

- **Translucent fill** (opacity ~15–40%) + **background blur** (frost) + optional **light edge stroke** and soft highlight.
- Creates hierarchy: background = context, glass = chrome/overlay, solid = content that must stay legible.

### 1.2 Best practices we adopt

1. **Use sparingly**. max 2–3 blurred layers per screen. Prefer glass for chrome (tab bar, sticky CTA, modals, hub cards), not full-page skins.
2. **Never put long body text on raw glass**. forms, salary breakdowns, money heroes stay **solid** (high opacity / opaque). Tip sheets use `glass.thick` (≥72% fill).
3. **Tint + blur**. blur alone is not enough; always add a white/sky tint scrim so contrast is stable.
4. **Blur budget**. intensity 12–20 (Expo BlurView). Avoid stacking many BlurViews.
5. **Edge definition**. 1px light border `rgba(255,255,255,0.45–0.65)` so glass reads on soft pastel backgrounds.
6. **Solid fallback**. when blur unsupported, reduce transparency preference is on, or web: use high-opacity solid (`#FFFFFF` / `#F7FAFF`).
7. **Controlled backdrop**. glass sits over soft gradient blobs (sky/mint), not busy photos.
8. **Finance trust**. glass = modern chrome; numbers stay solid mint/cobalt posters (Constitution: transparent math, not decorative blur).

### 1.3 Anti-patterns (do not)

- Glass over every card and input.
- Low blur + low opacity over saturated content.
- Relying on blur for WCAG contrast.
- Nested BlurViews more than 2 deep.
- Purple neon glass clichés / dark-mode glow defaults.

---

## 2. Material system

### 2.1 Materials

| Material | Fill | Blur | Border | Use |
|----------|------|------|--------|-----|
| `glass.thin` | `rgba(255,255,255,0.42)` | 16 | `rgba(255,255,255,0.55)` 1px | Tab bar, sticky bar, light chrome |
| `glass.regular` | `rgba(255,255,255,0.55)` | 18 | `rgba(255,255,255,0.62)` 1px | Hub cards, seasonal banner, tip panels |
| `glass.thick` | `rgba(255,255,255,0.72)` | 20 | `rgba(255,255,255,0.7)` 1px | Modals / sheets |
| `solid.canvas` | `#F7FAFF` |. |. | Screen background |
| `solid.surface` | `#FFFFFF` |. |. | Forms, inputs, breakdown rows |
| `solid.result` | mint/cobalt opaque |. |. | ResultHero amounts |

### 2.2 Tokens (code)

```ts
glass: {
 thinFill: 'rgba(255,255,255,0.42)',
 regularFill: 'rgba(255,255,255,0.55)',
 thickFill: 'rgba(255,255,255,0.72)',
 border: 'rgba(255,255,255,0.58)',
 fallback: '#FFFFFF',
 blurThin: 16,
 blurRegular: 18,
 blurThick: 20,
}
```

Radius for glass surfaces: `radii.glass` (16).

### 2.3 Ambient canvas

Keep pastel sky background. Strengthen decorative blobs (primary/secondary/accent at 0.10–0.14 opacity) so frost has something to refract. Still abstract geometry. no photography.

---

## 3. Component mapping

| Component | Material | Notes |
|-----------|----------|-------|
| `ScreenShell` | canvas + blobs | Richer ambient only |
| `GlassSurface` (new) | thin/regular/thick | Shared primitive; Reduce Transparency → solid |
| `ColorBlock` | solid by default; optional `glass` | Forms stay solid |
| `HubNavCard` | glass.regular | Interactive glass |
| `SeasonalBanner` | glass.regular | Soft peach tint allowed under glass |
| `NgaiMiuTip` | glass.regular | Short tip copy only |
| Tab bar | glass.thin | Absolute/translucent over content |
| `StickyActionBar` | glass.thin | Same |
| `InfoTip` modal sheet | glass.thick | Long tip copy on thick fill |
| `ResultHero` | solid.result | Never glass |
| `MoneyField` / inputs | solid.surface | Never glass |
| `Button` primary | solid primary | Never glass |
| Breakdown cards | solid soft tints | Never glass |
| `EmptyErrorState` | solid muted/dangerSoft | Never glass (body copy) |

---

## 4. Accessibility

- Meet WCAG AA for text on glass: prefer **SemiBold+** for labels on glass; body on glass max ~3 short lines (or use thick).
- Respect iOS **Reduce Transparency** (`AccessibilityInfo.isReduceTransparencyEnabled`) → force solid fallback.
- `prefers-reduced-motion`: keep existing short motion; no blur animation pulses.
- Touch targets unchanged (44+).
- Money figures remain on solid heroes with white text.

---

## 5. Performance

- One BlurView per chrome region (tab, sticky, card). no blur inside scroll item lists if >6 items visible; hub cards OK (≤6).
- Prefer `experimentalBlurMethod` defaults on Android; fall back to solid if janky.
- Do not animate blur intensity.
- Web: force solid (no BlurView) for predictability.

---

## 6. Acceptance criteria

- [x] Spec exists and tokens live in `src/theme/tokens.ts`
- [x] Glass chrome on hub / tabs / sticky / tips / seasonal / InfoTip
- [x] Forms and Net hero remain solid and readable
- [x] Reduce Transparency → solid surfaces (`GlassSurface`)
- [x] No regression: calculate flow loads after CollapseSection import fix
- [x] Design QA: no purple glow, no emoji icons, Plus Jakarta Sans retained
- [x] `docs/product/design-system.md` synced to glass + flat hybrid

---

## 7. Implementation order (5 rounds). done

1. Foundation: tokens + `GlassSurface` + canvas + icon crash path 
2. Surfaces: HubNavCard, ColorBlock glass opt-in, tip row 
3. Navigation: tab bar + StickyActionBar 
4. Overlays: InfoTip modal, SeasonalBanner 
5. Polish: a11y reduce transparency, CollapseSection fix, design-system sync, QA 
