# Design Upgrade Plan — AAA Product Ready

**Status**: Slice 1–2 shipped · Slice 3 (motion + a11y + empty states) in progress  
**Date**: 2026-08-05  
**Baseline**: Post mobile polish (PR #2) — functional MVP with Flat Design tokens  
**Goal**: Elevate KVSalaryTools from “competent utility” to **AAA consumer-finance product** without abandoning Flat Design / Constitution principles.

---

## 1. Verdict (current state)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Design system clarity | B+ | Strong written Flat Design doc; tokens exist |
| Visual distinctiveness | C | Tailwind-default blue/emerald; reads generic fintech |
| Brand presence | C+ | Brand text present; mascot is a placeholder SVG |
| Component consistency | C | Tab screens polished; deep screens still ad-hoc |
| Motion / craft | D | Reanimated installed, **unused**; no snappy feedback |
| Information architecture | C | Long form walls; result buried after scroll |
| Accessibility | C | Touch targets OK; no AA audit, no spoken money |
| Product moments | D | No onboarding, empty states, seasonality, save flows |

**Bottom line**: Engine + legal backbone are stronger than the UI. AAA is blocked by **identity, craft, consistency, and product moments** — not missing calculators.

---

## 2. Design principles to protect

Keep (from constitution + design system):

1. Flat Design — no shadows, no glow, color-as-structure  
2. Breakdown-first trust — numbers must stay scannable  
3. Disclaimer honesty — Ngài Miu explains, never softens law  
4. Offline-first / privacy-minimal UX  

Raise the bar:

5. **Poster, not form** — every primary screen needs one dominant visual beat  
6. **One job per viewport** — progressive disclosure over “show every field”  
7. **Motion = trust** — 2–3 intentional motions per journey (press, reveal result, tab)  
8. **Ownable palette** — stop looking like default Tailwind Blue 500  

---

## 3. Gap analysis (evidence-based)

### 3.1 Identity & theme
- Palette is stock (`#3B82F6` / `#10B981` / `#F59E0B`) — interchangeable with any SaaS starter  
- Product name “KVSalaryTools” reads internal/tooling, not consumer brand  
- Ngài Miu: only 2 poses (`wave`, `confused`); geometric placeholder, not finished asset set (6 poses specified)  
- Splash is static; no brand motion beat  

### 3.2 Token / system incomplete
- No type scale tokens (`display`, `title`, `body`, `caption`, `money`) — sizes hardcoded per screen  
- Section alternating color blocks (design system §3.4) **not implemented** — everything sits on white  
- Button uses Pressable scale but **not Reanimated** (design system §3.1)  
- `maxContentWidth: 560` vs design system `max-w-7xl` inconsistency for tablet/web  

### 3.3 Screen inconsistency (critical)
Polished: Calculator, Settlement, Benefits, Settings (`PageHero` + `ScreenShell`)  
Still raw `ScrollView` / local styles: Maternity, Sick leave, Severance, Unemployment, Retirement, Filing wizard, Comparison  

### 3.4 UX architecture
- Calculator is a **field wall** (mode → amount → region → year → month → NPT → BH → CTA → result)  
- Primary result (Net) only appears after long scroll — AAA finance apps reverse this (preview / sticky result)  
- No sticky CTA; secondary outline button competes with primary  
- No empty / first-run / error empty states with mascot pose ⑤  
- No seasonal “nhắc hạn” banner (T3–T4 quyết toán) despite design system  

### 3.5 Craft gaps
- Zero Reanimated usage despite dependency  
- No count-up on Net (≤400ms allowed)  
- No shared loading / success microcopy patterns across calculators  
- Breakdown rows dense; tip callouts compete with numbers  
- Tab bar still fights safe-area on web emulation  

### 3.6 Accessibility
- No automated contrast audit (Amber on soft yellow is risky)  
- Money not exposed as full Vietnamese speech for VoiceOver/TalkBack  
- Focus rings on web inconsistent  
- Dynamic type / font scaling untested  

---

## 4. Target experience (AAA definition for this product)

A user opening the app on phone should feel:

1. **Instant brand** — splash → 3-step onboarding once → land on calculator with clear job  
2. **Fast path to Net** — defaults from Settings; one CTA; Net card pins or scrolls into view with motion  
3. **Transparent trust** — expand breakdown; Ngài Miu tip explains *one* line; legal sources collapse by default  
4. **Hub clarity** — Benefits feels like a curated poster menu, not a list dump  
5. **Deep calculators feel same product** — every sub-screen uses same shell, chips, money input, result card  
6. **Seasonal awareness** — soft amber banner in filing season, never spammy  

Success metrics (qualitative + engineering):

- Visual QA: side-by-side with Money Lover / VinCSS-style fintech — **recognizably own brand**  
- Consistency: 100% screens on `ScreenShell` + shared money/result primitives  
- A11y: WCAG AA on all token pairs; spoken money strings  
- Motion: ≥3 intentional motions on primary journey; no infinite loops  
- Performance: JS interactions <16ms feel; no layout thrash on calculate  

---

## 5. Upgrade workstreams (phased)

### Phase A — Foundation (theme & tokens) — highest leverage
**Outcome**: Ownable visual system; one source of truth.

1. **Brand lock**  
   - Decide consumer-facing name (keep KVSalaryTools vs short name e.g. “Lương Việt” / “Miu Lương”) → ADR  
   - Lock Ngài Miu name in ADR; commission/finish **6 SVG poses**  

2. **Palette v2 (still Flat)** — shift off generic Tailwind without going purple/cream AI-cliché  
   Proposed direction: **ink + cobalt + mint**  
   - `foreground` deeper ink  
   - `primary` cooler cobalt (not Blue 500 stock)  
   - `secondary` mint for Net/refund only  
   - `surface` / `surfaceMuted` for alternating sections  
   - Keep single light mode for MVP; dark mode later  

3. **Token expansion**  
   - `typography.scale`: display / title / subtitle / body / label / caption / moneyLg / moneyMd  
   - `colors.danger` (errors only), `colors.warning` (accent alias)  
   - Semantic aliases: `resultPositive`, `deduction`, `cta`  
   - Document contrast pairs + AA matrix in design-system.md  

4. **Primitive kit**  
   - `MoneyField`, `SegmentedControl`, `StickyActionBar`, `ResultHero`, `CollapseSources`  
   - Reanimated pressables (`Button`, `HubNavCard`, chips)  

### Phase B — Signature product moments
**Outcome**: Feels finished, not assembled.

1. **Onboarding (3 screens)** — Ngài Miu pose ①; Gross↔Net / Quyết toán / Quyền lợi; privacy line  
2. **Calculator IA redesign**  
   - Collapse advanced (custom BH, month detail) behind “Tùy chỉnh”  
   - Sticky primary CTA  
   - On success: auto-scroll + Net `ResultHero` with ≤400ms count-up  
   - Comparison as tertiary text link, not competing outline CTA  
3. **Breakdown UX**  
   - Group headers (BH / GTGC / Thuế)  
   - Inline “?” opens Ngài Miu tip for one row (poses ②③)  
   - Sources accordion closed by default  
4. **Benefits hub** — stronger section color blocks; mascot tip once; card rhythm unified  
5. **Seasonal banner** component (amber soft) for T3–T4 / Tết  

### Phase C — Consistency sweep (all calculators)
**Outcome**: Every route feels like the same app.

Migrate to `ScreenShell` + `PageHero` + shared primitives:

- Maternity, Sick leave, Severance, Unemployment, Retirement  
- Other income (already partial)  
- Comparison, Filing wizard  

Shared patterns: validate → calculate → `ResultHero` → breakdown → disclaimer  

### Phase D — Motion, a11y, polish
1. Screen enter fade (300ms), tab icon scale, result reveal  
2. Haptics on calculate success (native)  
3. Accessibility pass: contrast, labels, Vietnamese money announcement helper  
4. Empty / error states with pose ⑤  
5. Visual regression snapshots (Detox/Maestro or Storybook+web) for 390×844  

### Phase E — Brand finish (ship bar)
1. App icon, splash, store screenshots aligned to palette v2  
2. Mascot asset pack in repo (`assets/mascot/*.svg`) replacing placeholder  
3. Microcopy pass (tone: Ngài Miu voice guide)  
4. Design QA checklist signed off against design-system.md §1–8  

---

## 6. Recommended execution order

```text
A1 tokens + palette ADR
 → A2 primitives (MoneyField, ResultHero, StickyActionBar, animated Button)
 → B2 Calculator IA (hero moment)
 → C consistency sweep (deep screens)
 → B1 onboarding + B5 seasonal
 → D motion + a11y
 → E brand assets + store kit
```

Do **not** start with dark mode, charts, or social features — they dilute AAA focus.

---

## 7. Explicit non-goals (for this upgrade)

- Material/iOS shadow redesign (violates Flat Design)  
- Purple gradient / cream-serif AI aesthetic  
- Dark mode before light mode is excellent  
- Server accounts / cloud sync (Constitution V)  
- Replacing engine accuracy work with visual-only PRs  

---

## 8. Acceptance checklist (AAA gate)

- [ ] Palette + typography recognizable without reading the logo  
- [x] All user-facing screens use shared shell/primitives  
- [x] Net/result is the emotional peak of each calculator  
- [x] Ngài Miu: ≥4 poses shipped; tips never overlay number rows  
- [x] Primary journey has 2–3 intentional motions  
- [x] WCAG AA matrix documented and green  
- [ ] Mobile 390×844 visual QA passed on all tabs + 3 deep screens  
- [x] Disclaimer + legal sources remain prominent but non-blocking  

---

## 9. Suggested next implementation slice

**Slice 1 (shippable):** Phase A tokens/palette + MoneyField/ResultHero/StickyActionBar + Calculator IA redesign.  
This alone moves perceived quality from “utility” → “product.”

Then open Spec Kit feature `010-aaa-design-system` if formal spec tracking is required.
