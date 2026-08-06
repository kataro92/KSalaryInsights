# Quickstart: F022 Preset mức đóng BH

## A — Full regress (US1.1 / SC-002)

1. Calculator: Gross 30.000.000, vùng I, 2026 tháng 3, 0 NPT, preset **Full**.
2. **Expect**: khớp TC-TNCN-2026-01 (net 26.065.000 nếu cùng as-of H1).

## B — Percent 70% (US1.2 / SC-001)

1. Cùng input, preset **70%**.
2. **Expect**: căn cứ BH hiển thị 21.000.000; BH NLĐ = 10,5%×21tr (dưới trần) = 2.205.000; thuế/net khác full; sai số ±1 vs hand-calc.

## C — Absolute

1. Preset tuyệt đối 15.000.000.
2. **Expect**: BH trên 15tr (sau trần nếu có); meta hiện căn cứ 15tr.

## D — Net→Gross percent (US2)

1. Lấy net từ B; preset 70%; mode Net→Gross.
2. **Expect**: gross giải → grossToNet với BH=70%×gross cho net khớp ±1.

## E — Validation

1. Percent 0 hoặc 101 → không tính, báo lỗi.
2. Absolute 0 → lỗi.

## Unit

```bash
npm run test:unit -- insuranceBase
```
