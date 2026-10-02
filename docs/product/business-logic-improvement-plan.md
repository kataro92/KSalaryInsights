# Kế hoạch cải thiện nghiệp vụ tính toán

Ngày lập: 02/10/2026
Trạng thái: Đã triển khai và kiểm thử ngày 02/10/2026
Phạm vi: Engine, ruleset JSON, quyết toán, hộ KD / cho thuê, docs pháp lý. Không gồm đợt cải tiến UI.

## Mục tiêu

Giữ lõi Gross-Net / BH / biểu TNCN đang khớp văn bản, rồi bổ sung các quy định đã có mức cụ thể sau lần rà soát pháp lý 05/08/2026. Ưu tiên số liệu hộ kinh doanh kỳ 2026-2027 và giảm trừ khi quyết toán năm 2026.

Không ship tham số mới khi chưa có Tầng 1 (văn bản gốc). Constitution I.

## Cơ sở đánh giá

Đối chiếu ruleset bundled (`2025`, `2026-h1`, `2026-h2`) và engine với Công báo / vanban.chinhphu.vn. Thời điểm rà soát: 02/10/2026 (nửa sau năm 2026). Sổ `docs/domain/legal-sources.md` cập nhật đến 05/08/2026. Manifest remote (`docs/product/remote/ruleset-manifest.json`) trống, `generatedAt` 2026-08-05.

Kết luận lõi: người làm công, không có khoản giảm trừ đặc thù, chọn đúng năm/tháng 2026 thì Gross → BH NLĐ (có trần) → GTGC → lũy tiến từng phần → Net **khớp luật**. App đúng điểm nhiều tool sai: biểu 5 bậc và GTGC mới áp cả kỳ thuế 2026, không cắt đôi năm theo ngày 01/07.

### Đã khớp văn bản (không làm lại)

| Tham số | App | Văn bản |
|---------|-----|---------|
| Biểu TNCN 2026: 5 bậc 10 / 30 / 60 / 100 triệu, 5-10-20-30-35% | Đúng | Luật 109/2025/QH15 |
| GTGC 2026: 15,5 triệu / 6,2 triệu | Đúng | Luật 109; NQ 110/2025/UBTVQH15 |
| Biểu 7 bậc + GTGC 11 / 4,4 cho kỳ 2025 (kể cả QT năm 2026) | Đúng | Luật TNCN 2007; NQ 954/2020; CV 1296/CT-NVT |
| Lương cơ sở 2,34 triệu (đến 30/06) rồi 2,53 triệu (từ 01/07) | Đúng, tách 2 ruleset | NĐ 73/2024; NĐ 161/2026 |
| Trần BHXH/BHYT 20×: 46,8 triệu rồi 50,6 triệu | Đúng | Luật BHXH 41/2024 Đ.31 |
| LTTV 2026: 5,31 / 4,73 / 4,14 / 3,70 triệu | Đúng | NĐ 293/2025/NĐ-CP |
| NLĐ đóng 8% + 1,5% + 1% | Đúng | Luật BHXH Đ.33; NĐ 374/2025 Đ.4 |
| Vãng lai 2026: khấu trừ 10% từ 5 triệu; miễn QT nếu BQ ≤ 15 triệu, cả kỳ 2026 | Đúng | NĐ 253/2026 Đ.50, Đ.51, Đ.69.1.a |
| Cho thuê / hộ KD: miễn 1 tỷ; GTGT trên toàn bộ, TNCN trên phần vượt | Đúng khung | NĐ 68/2026; NĐ 141/2026; Luật 109 Đ.7 |
| CK 0,1% từ 01/07/2026; thai sản con thứ hai 7 tháng từ 01/07/2026 | Đúng | NĐ 253; Luật Dân số 113/2025 |
| BHTN: 60%, trần 5× LTTV, chờ 10 ngày LV | Đúng | Luật Việc làm 74/2025 Đ.38-39 |

### Lệch / thiếu so với văn bản mới

1. **NQ 43/2026/QH16** (24/08/2026): giảm 30% thuế TNCN phải nộp 2026-2027 cho thu nhập kinh doanh nếu doanh thu năm ≤ 10 tỷ. `calculateHkd` / `calculateRent` chưa nhân 0,7. GTGT không giảm.
2. **NĐ 253 Đ.49**: y tế ≤ 23 triệu/năm, giáo dục ≤ 24 triệu/năm khi tự quyết toán. Engine Gross-Net và quyết toán năm chưa có ô. Docs `thue-tncn.md` vẫn ghi "chờ nghị định".
3. **NĐ 253 Đ.46**: hưu trí bổ sung / tự nguyện / nhân thọ trần 3 triệu/tháng (gồm cả phần công ty đóng). Spec 004 chủ ý bỏ.
4. **NĐ 253 Đ.8**: ăn giữa ca miễn thuế 1,2 triệu/tháng. Gross là một số; gộp tiền ăn vào lương sẽ ước thuế cao hơn thực tế.
5. **Hộ KD trên 3 tỷ**: domain ghi phương pháp thu nhập 17% (3-50 tỷ) hoặc 20% (>50 tỷ). Engine vẫn tỷ lệ trên doanh thu và chỉ gợi ý 15%.
6. Quyết toán: GTGC NPT luôn × 12 tháng; không trừ từ thiện / BH nhân thọ / y tế / giáo dục; không tách phụ cấp miễn thuế.

## Hạng mục triển khai

### 1. NQ 43/2026 trên hộ KD (và cho thuê nếu xác nhận thu nhập KD) — P0

- Lưu PDF NQ 43/2026/QH16 (và NĐ hướng dẫn nếu đã ban hành) vào `docs/legal-originals/`. Ghi sổ `legal-sources.md` Tầng 1 trước khi ship số.
- Ruleset 2026: tham số giảm 30% TNCN kinh doanh khi doanh thu năm ≤ 10 tỷ, kỳ 2026-2027. Không giảm GTGT.
- `calculateHkd`: sau khi ra PIT theo tỷ lệ (hoặc theo thu nhập), nhân (1 − 0,30) nếu đủ điều kiện. Breakdown tách "thuế trước giảm" / "số được giảm" / "phải nộp".
- `calculateRent`: chỉ áp nếu đối chiếu Tầng 1 xác nhận cho thuê BĐS cá nhân thuộc "thu nhập từ kinh doanh" của NQ 43. Nếu không thuộc, ghi rõ ngoài phạm vi trên UI và domain.
- Copy / tips / disclaimer: ước tính theo NQ 43; không thay tờ khai. Nếu DT thực tế vượt 10 tỷ, luật yêu cầu nộp bổ sung phần đã giảm.
- Test: hộ phân phối 1,5 tỷ (TC-HKD-02): TNCN trước giảm 2.500.000 → sau giảm 1.750.000; GTGT 15.000.000 giữ nguyên. DT ≤ 1 tỷ: thuế 0, không đụng giảm 30%. DT > 10 tỷ: không giảm.

**File chính:** `src/engine/otherIncome/hkd.ts`, `src/engine/otherIncome/rent.ts`, `src/engine/rulesets/2026-h1.json`, `src/engine/rulesets/2026-h2.json`, `src/engine/rulesetValidate.ts`, `docs/domain/thu-nhap-khac.md`, `docs/domain/legal-changelog.md`, `docs/domain/legal-sources.md`.

**Nghiệm thu:** Số PIT hộ KD 2026-2027 khớp NQ 43 khi DT ≤ 10 tỷ. Kỳ 2025 không áp. VAT không đổi.

### 2. Giảm trừ y tế / giáo dục khi quyết toán 2026 — P0

- Tham số ruleset 2026: trần y tế 23 triệu/năm, giáo dục 24 triệu/năm (NĐ 253 Đ.49). Không gắn vào ruleset 2025.
- Quyết toán năm và tổng hợp đa nguồn: ô nhập chi y tế / giáo dục (clamp theo trần). Trừ vào TN chịu thuế trước khi áp biểu năm.
- UI: ghi điều kiện hóa đơn, bảng kê y tế, chi tự chịu, chỉ khi tự quyết toán. Không thu thập file chứng từ.
- Cập nhật `thue-tncn.md`: xóa "chờ nghị định"; ghi mức trần + hiệu lực 01/07/2026 và cách trừ khi QT năm.
- Test: TNTT năm giảm đúng số đã clamp; vượt trần không trừ quá mức; tax_year 2025 bỏ qua ô này.

**File chính:** `src/engine/annualSettlement.ts`, `src/engine/multiSourceAnnual.ts`, `src/engine/pit.ts` (nếu tách relief), `src/screens/SettlementScreen.tsx`, `src/domain/types/settlement.ts`, ruleset 2026, `docs/domain/thue-tncn.md`, `specs/004-quyet-toan-thue/spec.md`.

**Nghiệm thu:** TC quyết toán hiện có (TC-QT-2026-01/02) không regress khi chi = 0. Có chi: thuế năm giảm đúng, disclaimer còn.

### 3. BH nhân thọ / hưu trí và tiền ăn giữa ca — P1

- Ô đóng hưu trí bổ sung / tự nguyện / nhân thọ: trần 3 triệu/tháng (NĐ 253 Đ.46), gồm cả phần NSDLĐ. Áp kỳ 2026 khi tính tháng và khi QT năm (× số tháng có đóng, tối đa 12).
- Tùy chọn: số tiền ăn giữa ca trong Gross; phần ≤ 1,2 triệu/tháng không chịu thuế (NĐ 253 Đ.8). Mặc định 0 để không đổi TC Gross-Net hiện tại.
- Spec 004 hiện loại trừ các khoản này: sửa assumption khi implement.
- Test: trần 3 triệu; TC-TNCN-2026-01 không đổi nếu ô trống.

**File chính:** `src/engine/grossToNet.ts`, `src/engine/annualSettlement.ts`, `src/screens/CalculatorScreen.tsx`, `src/screens/SettlementScreen.tsx`, ruleset 2026, `docs/domain/thue-tncn.md`.

**Nghiệm thu:** Lương "sạch" ra số cũ. Có BH nhân thọ / tiền ăn: TNTT và thuế giảm đúng trần.

### 4. Hộ KD trên 3 tỷ: phương pháp thu nhập 17% / 20% — P1

- Khi DT > 3 tỷ: không dùng tỷ lệ trên doanh thu làm kết quả chính. Bắt buộc (DT − chi phí) × 17% nếu DT ≤ 50 tỷ, × 20% nếu DT > 50 tỷ. Thiếu chi phí: cảnh báo, không bịa số.
- Gợi ý 15% chỉ còn với nhánh 1-3 tỷ (so sánh với tỷ lệ doanh thu).
- Kết hợp hạng mục 1: sau khi ra PIT theo đúng phương pháp, mới xét giảm 30% NQ 43 nếu DT ≤ 10 tỷ.

**File chính:** `src/engine/otherIncome/hkd.ts`, `src/engine/rulesets/*.json` (`income_method_rate` tách 15 / 17 / 20), `docs/domain/thu-nhap-khac.md`.

**Nghiệm thu:** Fixture DT 4 tỷ + chi phí ra PIT theo 17%, không theo 0,5%/2%/… trên phần vượt. Domain và code cùng một công thức.

### 5. NPT theo tháng đăng ký và phụ cấp miễn thuế — P2

- Quyết toán: mỗi NPT có tháng bắt đầu (và tháng kết thúc nếu có). GTGC NPT = `dependent_relief × số tháng hợp lệ`, không mặc định × 12. Nhắc TT 87/2026: thu nhập NPT ≤ 3 triệu/tháng (không thu thập hồ sơ).
- Calculator: dòng "phụ cấp / trợ cấp miễn thuế" trừ khỏi Gross trước khi ra thu nhập chịu thuế. Mặc định 0.

**File chính:** `src/engine/annualSettlement.ts`, `src/engine/grossToNet.ts`, `src/screens/SettlementScreen.tsx`, `src/screens/CalculatorScreen.tsx`, `specs/002-nguoi-phu-thuoc-gtgc/spec.md`.

**Nghiệm thu:** 1 NPT đăng ký từ tháng 7: GTGC NPT năm = 6,2 triệu × 6. TC cũ (giả định đủ 12 tháng) vẫn pass khi tháng = 1-12.

### 6. Dọn docs pháp lý và ruleset 2025 — P2

- Thêm NQ 43/2026, NĐ 374/2025 (BHTN 1%) vào `legal-sources.md` / `legal-changelog.md`. NĐ 374 chỉ cần citation; tỷ lệ đóng không đổi.
- Sửa `thue-tncn.md` mục giảm trừ mới: không còn "chờ NĐ".
- Ruleset 2025: tách `other_income` cho thuê / HKD khỏi ngưỡng 1 tỷ (cơ chế 2026). Kỳ 2025 đã qua hạn QT; làm nếu còn cho phép tính lại năm cũ.
- Ghi NĐ 168 (con đẻ còn sống) trên UI thai sản con thứ hai; không bắt buộc encode hồ sơ.
- Tùy chọn P2+: sàn LTTV khi đóng BH (hiện chỉ trần).

**File chính:** `docs/domain/*`, `src/engine/rulesets/2025.json`, `src/screens/MaternityCalculatorScreen.tsx`.

**Nghiệm thu:** Sổ pháp lý phản ánh văn bản sau 05/08/2026. Ruleset 2025 không áp ngưỡng 1 tỷ cho thuê / HKD nếu vẫn expose tax_year 2025 trên module đó.

## Thứ tự thực hiện

1. Thu thập PDF Tầng 1: NQ 43/2026; NĐ hướng dẫn NQ 43 (nếu có); xác nhận nguyên văn Đ.46 / Đ.49 / Đ.8 NĐ 253 (file đã kê trong sổ). Cho thuê có thuộc NQ 43 hay không.
2. Hạng mục 1 (NQ 43 hộ KD) + test + changelog.
3. Hạng mục 2 (y tế / giáo dục trên quyết toán) + cập nhật spec 004 / domain TNCN.
4. Hạng mục 3 (BH nhân thọ, ăn giữa ca) trên Calculator + QT.
5. Hạng mục 4 (HKD > 3 tỷ) gắn với cùng ruleset `other_income.hkd`.
6. Hạng mục 5-6 khi P0/P1 đã xanh.

Theo yêu cầu triển khai cả hai kế hoạch, phần giao diện được làm cùng đợt; kiểm thử nghiệp vụ và QA giao diện được ghi riêng trong báo cáo.

## Kiểm tra và nghiệm thu chung

- `npm run test:unit` / `npm test`: TC Gross-Net 2025/2026, TC-QT, TC-HKD, TC-RENT không regress khi ô mới = 0.
- Mọi tham số mới có `legal_sources` Tầng 1 trước khi merge.
- Kỳ 2025 không nhận giảm 30%, trần y tế/giáo dục, trần BH nhân thọ 3 triệu, hay miễn ăn 1,2 triệu (trừ khi đối chiếu riêng luật cũ).
- Disclaimer: ước tính offline, không thay VssID / cơ quan thuế.
- Copy: không em dash, không emoji.

## Checklist tiến độ

- [x] PDF Tầng 1 NQ 43 (+ NĐ hướng dẫn nếu có); chốt cho thuê có/không thuộc giảm 30%.
- [x] Hộ KD: giảm 30% TNCN khi DT ≤ 10 tỷ, kỳ 2026-2027.
- [x] Quyết toán 2026: giảm trừ y tế / giáo dục theo trần Đ.49.
- [x] Ô BH nhân thọ / hưu trí (trần 3 triệu/tháng) và tiền ăn giữa ca (1,2 triệu).
- [x] HKD > 3 tỷ: phương pháp thu nhập 17% / 20%.
- [x] NPT theo tháng đăng ký; dòng phụ cấp miễn thuế.
- [x] Cập nhật legal-sources, legal-changelog, thue-tncn, thu-nhap-khac, spec 004.
- [x] Unit test mới + regress TC cũ.

## Quyết định sau đối chiếu văn bản gốc

- Cho thuê bất động sản thuộc thu nhập kinh doanh: Luật 109 Đ.7 k4 và NĐ 68 Đ.4 k4. Áp giảm 30% theo NQ 43 cho cá nhân cư trú đủ điều kiện. Nghị định hướng dẫn được tìm thấy ở trạng thái dự thảo ngày rà soát, không lấy tham số từ dự thảo.
- Tiền ăn bằng tiền: mức miễn 1,2 triệu chỉ từ 01/07/2026 theo NĐ 253 Đ.69 k1b; quyết toán tối đa 6 tháng năm 2026. Giảm trừ theo Đ.46/49 áp cho kỳ tính thuế 2026 theo Đ.69 k1a.
- 2027 được hỗ trợ riêng cho HKD/cho thuê, không suy ra quy định lương/BH năm 2027.
- 2025: ngưỡng 100 triệu; khi vượt ngưỡng, thuế tính trên toàn bộ doanh thu theo VBHN 24/VBHN-BTC.
- Sàn bảo hiểm LTTV là hạng mục P2+ tùy chọn, chưa thay đổi trong đợt này.

Xem [báo cáo kiểm thử](./improvement-implementation-report.md).
