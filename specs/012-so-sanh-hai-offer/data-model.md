# Data Model: F021 Offer compare

## OfferSideInput

| Field | Type | Rules |
|-------|------|-------|
| mode | `"gross-to-net" \| "net-to-gross"` | required |
| amount | number | > 0 int VND |
| insurance | InsuranceBasePreset | F022 |

## OfferCompareShared

| Field | Type |
|-------|------|
| taxYear | number |
| month | 1-12 |
| region | RegionCode |
| numDependents | 0-20 |

## OfferSideResult

| Field | Type |
|-------|------|
| ok | boolean |
| gross | number? |
| net | number? |
| insuranceEmployeeTotal | number? |
| pitTotal | number? |
| insuranceBaseUsed | number? |
| errorMessage | string? |
| minFeasibleNet | number? |
| legalSources | string[] |

## OfferCompareResult

| Field | Type |
|-------|------|
| shared | OfferCompareShared |
| a / b | OfferSideResult |
| deltaNet | number? | only if both ok |
| deltaGross | number? | only if both ok |

## Persistence

```text
SavedScenario.kind = "offer_compare"
inputs: { shared, offerA, offerB, name? }
lastDeltaNet?: number
```

## Invariants

- asOfDate = from taxYear+month (same helper as Calculator)
- No crypto / bonus / OT fields
