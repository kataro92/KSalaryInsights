# ADR 0010: Rename product to KSalaryInsights

- **Status**: Accepted
- **Date**: 2026-08-06
- **Supersedes**: [ADR 0007](./0007-brand-name-kvsalarytools.md)
- **Context**: The workspace and product identity settled on **KSalaryInsights**. The previous consumer string `KVSalaryTools` (and package/slug/bundle id `kvsalarytools`) no longer matched the repo or intended store listing.

## Decision

1. **Consumer-facing name**: `KSalaryInsights` (`src/copy/miu.ts` → `brand.name`).
2. **Package / Expo slug / URL scheme**: `ksalaryinsights`.
3. **iOS bundle id**: `com.kataro92.ksalaryinsights` (new id; not an App Store continuity rename of the old id).
4. **Ngài Miu** remains the assistant / mascot; tagline unchanged.
5. Schema `$id` hosts and native Xcode target/product names follow the same rename.

## Consequences

- Splash, onboarding, PageHero, settings feedback subject, share text, README, specs, and constitution use `KSalaryInsights`.
- iOS project folders/schemes/Pods target renamed; `pod install` required after checkout.
- Existing installs under `com.kataro92.kvsalarytools` are a different app identity if both were ever shipped.

## Alternatives rejected

- Keep display name `KVSalaryTools` while only renaming the repo folder — brand mismatch.
- Keep old bundle id for continuity — no prior App Store listing under that id in this project phase.
