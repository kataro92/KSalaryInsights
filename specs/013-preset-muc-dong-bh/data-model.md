# Data Model: F022 Insurance base preset

## InsuranceBaseMode

```text
"full" | "percent" | "absolute"
```

## InsuranceBasePreset

| Field | Type | Rules |
|-------|------|-------|
| mode | InsuranceBaseMode | required |
| percent | number? | required if percent; integer 1–100 |
| absoluteAmount | number? | required if absolute; integer > 0 |

## ResolvedInsuranceParams (derived)

| Field | Type | Meaning |
|-------|------|---------|
| insuranceTracksGross | boolean | true for full; for percent wrapper may still track via per-step salary |
| insuranceSalary | number \| undefined | absolute amount, or undefined when full |
| insurancePercent | number \| undefined | 1–100 when percent |
| resolvedBaseForDisplay | number \| null | after calc: base used |
| labelVi | string | e.g. "Full gross", "70% × gross", "Tuyệt đối 15.000.000" |

## resolveForGrossToNet(gross, preset) → { insuranceSalary?: number }

- full → undefined (engine default = gross)
- percent → round(gross * percent/100)
- absolute → absoluteAmount

## resolve / runNetToGross(net, preset, …)

- full → netToGross({ insuranceTracksGross: true })
- absolute → netToGross({ insuranceTracksGross: false, insuranceSalary })
- percent → wrapper binary or loop using grossToNet with salary = pct*gross each step (research R3-b)

## Validation

- percent ∈ [1,100]
- absoluteAmount > 0 finite int
- mode discriminant complete

## Migration (scenarios calculator)

```text
if customBh === false → { mode: "full" }
if customBh === true → { mode: "absolute", absoluteAmount: bhAmount }
```
