# Data Model: F020 Tổng hợp QT đa nguồn

## Entities

### MultiSourceAnnualSummary

Bảng tổng hợp một năm thuế trên thiết bị.

| Field | Type | Rules |
|-------|------|-------|
| id | string | uuid local |
| taxYear | number | MUST ∈ ruleset years (2025/2026/…) |
| region | RegionCode | optional; dùng khi có dòng salary |
| lines | MultiSourceLine[] | ≥0; empty → empty state |
| createdAt / updatedAt | ISO string | local |
| name | string | optional display name for scenario |

### MultiSourceLine

Một dòng nguồn.

| Field | Type | Rules |
|-------|------|-------|
| id | string | uuid |
| kind | MultiSourceKind | xem enum |
| label | string | user hoặc default theo kind |
| revenueOrIncome | number | ≥0; nghĩa tùy kind (gross năm / DT / giá bán…) |
| estimatedVat | number | ≥0; 0 nếu N/A |
| estimatedPit | number | ≥0 |
| estimatedOtherTax | number | ≥0; dự phòng (thường 0) |
| estimatedTaxTotal | number | = vat+pit+other (denormalized) |
| withheld | number | ≥0; user nhập; mặc định 0 |
| notes | string[] | miễn ngưỡng, reporting, DualScenario hint… |
| legalSources | string[] | copy từ engine khi tính |
| sourceRef | optional | `{ scenarioId?: string; calculator?: string }` |
| excluded | boolean | soft-delete / ẩn khỏi tổng |

`estimatedTaxTotal` MUST NOT được tự ý tính rate trong orchestrator khi đã có breakdown từ engine — orchestrator gọi engine rồi gán.

### MultiSourceKind (enum)

```text
salary | casual | hkd | rent | securities | esop
```

**MUST NOT** include `crypto` | `digital_asset` | `coin`.

### MultiSourceTotals (derived)

| Field | Formula |
|-------|---------|
| estimatedTax | Σ line.estimatedTaxTotal where !excluded |
| withheld | Σ line.withheld where !excluded |
| deltaSigned | estimatedTax − withheld |
| deltaKind | refund \| pay \| even (cùng convention SettlementDelta) |

### FilingWizardImpact (derived input)

| Field | Rule |
|-------|------|
| hasNonSalarySources | true nếu có line kind ∈ {hkd, rent, securities, esop} hoặc casual bắt buộc gộp |
| forceSelfFile | hasNonSalarySources === true |

## Relationships

```text
MultiSourceAnnualSummary 1──* MultiSourceLine
MultiSourceLine ──optional──> SavedScenario (sourceRef.scenarioId)
salary/casual lines MAY mirror AnnualSettlementResult scenarios (DualScenario)
```

## Validation

- Tất cả line cùng `taxYear` với summary (FR-001).
- Không cho tạo kind ngoài enum (FR-006).
- `revenueOrIncome`, thuế, withheld: finite, non-negative integers VND (làm tròn theo engine hiện có).
- Max lines: 20 (UX; không phải luật).

## State transitions

```text
empty → editing (add line)
editing → computed (run orchestrator / refresh totals)
computed → saved (F014 scenario kind multi_source)
line: active ↔ excluded
```

## Persistence (scenarios)

Mở rộng `SavedScenario`:

```text
kind: "multi_source"
inputs: MultiSourceAnnualSummary (serializable)
lastDelta?: number
```

Parse MUST reject unknown kinds / crypto fields.
