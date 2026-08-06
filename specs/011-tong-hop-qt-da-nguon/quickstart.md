# Quickstart validation: F020 Tổng hợp QT đa nguồn

**Mục đích**: Kiểm chứng spec/plan sau khi implement (không chạy ở phase spec-only).

## Prerequisites

- App Expo chạy local; ruleset 2025/2026 bundled.
- Đã có engine QT lương + HKD/thuê (F007, F016-F017).

## Scenario A - Empty state (US1)

1. Mở route Tổng hợp năm (CTA từ Quyết toán).
2. **Expect**: empty state + link tới Tính lương / Thu nhập khác / QT; disclaimer không coin.

## Scenario B - Lương + cho thuê + vãng lai (US1)

1. Thêm dòng `salary` với thuế ước / đã khấu trừ từ QT mẫu (vd. TC gần TC-QT-2025-01 hoặc số đã biết).
2. Thêm dòng `rent` doanh thu 240tr/năm → thuế 0 + note thông báo.
3. Thêm dòng `casual` với gross/withheld tùy chọn.
4. **Expect**: ≥3 dòng; tổng thuế = Σ dòng; nhãn “ước”; không gộp thuê vào biểu lương.

## Scenario C - HKD dưới / trên ngưỡng (US2)

1. Chỉ dòng `hkd` dịch vụ, DT 800tr → thuế 0 + note kê khai (TC-HKD-01).
2. Đổi DT 1,5 tỷ phân phối → GTGT + TNCN tách (TC-HKD-02 số domain).
3. **Expect**: không đưa vào PIT lũy tiến; totals khớp Σ.

## Scenario D - Lương + HKD exempt (SC-002)

1. Fixture: lương năm có `annualTax = T`; HKD exempt thuế 0.
2. **Expect**: `totals.estimatedTax === T` (sai số ≤ 1 đồng trên phần lương).

## Scenario E - Không crypto (US3 / SC-003)

1. Kiểm tra UI: không có chip/kind coin.
2. Parse scenario JSON có `"kind":"crypto"` → **reject**.
3. Disclaimer visible trên màn tổng hợp.

## Scenario F - Wizard (FR-009)

1. Bảng có dòng `hkd` hoặc `rent` → mở wizard → kết luận tự quyết toán + checklist mở rộng.

## Unit commands (sau khi có code)

```bash
npm run test:unit -- multiSourceAnnual
```

## Pass criteria

- US1-US3 acceptance trong spec.md đều tái hiện được.
- SC-001…SC-003 thỏa.
- Không regress DualScenario TC-QT-2026-02 khi lương+vãng lai miễn.
