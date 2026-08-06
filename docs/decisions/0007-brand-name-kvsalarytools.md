# ADR 0007: Consumer brand name lock (KVSalaryTools)

- **Status**: Superseded by [ADR 0010](./0010-rename-to-ksalaryinsights.md)
- **Date**: 2026-08-05
- **Context**: AAA Phase E. Design upgrade plan asked whether to rename the product to a shorter consumer name (“Lương Việt”, “Miu Lương”). Shipping polish needed a stable brand string for splash, store listing, and microcopy.

## Decision

1. **Keep `KVSalaryTools`** as the consumer-facing product name for that release.
2. **Ngài Miu** remains the named assistant / mascot (not the product name).
3. Tagline stays: *Ước tính lương · thuế · bảo hiểm*, guided by Ngài Miu voice in `src/copy/miu.ts`.

## Consequences

- Splash, onboarding, PageHero, and store kit used `brand.name` / `brand.tagline`.
- A later rename required a new ADR and coordinated store listing + asset refresh (see ADR 0010).

## Alternatives rejected

- “Lương Việt” / “Miu Lương” at that time - stronger consumer pull but renames mid-polish and conflicts with existing slug/`scheme`.
