# Research: F021 So sánh hai offer

## R1 — Embed vs route

- **Decision**: Route `offer-compare` + CTA Calculator (và optional Comparison hub).
- **Rationale**: Calculator đã dày (bonus/OT); so offer cần 2 cột.
- **Alternatives**: CollapseSection trong Calculator (chật); tab mới (IA phình).

## R2 — Shared vs per-offer region/NPT

- **Decision**: Shared taxYear/month/region/NPT; per-offer mode/amount/BH only.
- **Rationale**: Pain chính là Gross vs Net / BH khác, không phải 2 vùng khác nhau.
- **Alternatives**: Full independence (phức tạp MVP).

## R3 — Delta semantics

- **Decision**: ΔNet = Net(B) − Net(A); ΔGross = Gross(B) − Gross(A); show both; label “B − A (ước)”.
- **Rationale**: User tự chọn cột nào là “đối thủ”.
- **Alternatives**: Always higher-minus-lower (mất dấu).

## R4 — Partial failure

- **Decision**: Per-column ok | error; totals/delta only if **both** ok; else hide delta + explain.
- **Rationale**: US1.2 infeasible.

## R5 — Dependency F022

- **Decision**: Hard dependency on insurance preset helper; tasks gated.
- **Rationale**: FR-002.

## R6 — Scenario

- **Decision**: kind `offer_compare` stores shared + offerA + offerB presets/amounts/modes; lastDeltaNet optional.

## Resolved

| Topic | Resolution |
|-------|------------|
| Bonus/OT | Out of MVP |
| Advice copy | Forbidden |
| Engine | Reuse only |
