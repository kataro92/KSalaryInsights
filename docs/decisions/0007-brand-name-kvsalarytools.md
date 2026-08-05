# ADR 0007: Consumer brand name lock

- **Status**: Accepted 
- **Date**: 2026-08-05 
- **Context**: AAA Phase E. Design upgrade plan asked whether to rename KVSalaryTools to a shorter consumer name (“Lương Việt”, “Miu Lương”). Shipping polish needs a stable brand string for splash, store listing, and microcopy.

## Decision

1. **Keep `KVSalaryTools`** as the consumer-facing product name for this release.
2. **Ngài Miu** remains the named assistant / mascot (not the product name).
3. Tagline stays: *Ước tính lương · thuế · bảo hiểm*. guided by Ngài Miu voice in `src/copy/miu.ts`.

## Consequences

- Splash, onboarding, PageHero, and store kit use `brand.name` / `brand.tagline`.
- A future rename requires a new ADR and coordinated store listing + asset refresh.

## Alternatives rejected

- “Lương Việt” / “Miu Lương” now. stronger consumer pull but renames mid-polish and conflicts with existing slug/`scheme`.
