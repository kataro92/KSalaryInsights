# ADR 0005 — Palette v2 (Ink · Cobalt · Mint)

- **Status**: Accepted (surfaces superseded by [0006](./0006-pastel-raster-mascot.md) pastel refresh; semantic roles remain)  
- **Date**: 2026-08-05  
- **Context**: AAA design upgrade (Slice 1). Stock Tailwind Blue 500 / Emerald 500 made KVSalaryTools visually interchangeable with generic SaaS starters. Flat Design philosophy stays; colors must be ownable.

## Decision

1. **Light mode only** for this upgrade (dark mode deferred).
2. **Palette v2**:
   - Ink foreground `#0F172A`
   - Cobalt primary `#1D4ED8` (CTA / selection) — cooler, more serious than Blue 500
   - Cobalt pressed `#1E3A8A`
   - Mint secondary `#0F766E` (Net / refund / positive) — not Emerald 500
   - Amber accent `#B45309` (seasonal / mild warning) — stronger AA on soft fills
   - Surfaces: white `#FFFFFF`, muted `#F1F5F9`, soft tints for cobalt/mint/amber
3. Keep Flat Design rules: no shadow, no glow, color-as-structure.
4. Semantic aliases in tokens: `cta`, `resultPositive`, `deduction` (foreground), `danger` (errors only).

## Consequences

- All screens using `colors.*` pick up the new look automatically.
- Store assets / mascot accessory colors should follow cobalt/amber tokens.
- Contrast AA matrix updated in `docs/product/design-system.md`.

## Alternatives rejected

- Keep Blue 500 / Emerald 500 and only tweak spacing (insufficient distinctiveness).
- Purple / cream-serif AI-default aesthetics (explicitly banned in design upgrade plan).
- Dark mode first (polish light mode before splitting themes).
