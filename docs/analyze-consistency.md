# Báo cáo nhất quán tài liệu (Analyze thủ công)

**Ngày**: 2026-08-03 (cập nhật lần cuối — vòng bổ sung file pháp lý NĐ 253/2026)  
**Phạm vi**: constitution ↔ research ↔ domain ↔ product ↔ specs 001–008

## Kết quả

| Kiểm tra | Kết quả |
|----------|---------|
| Constitution I–VI phản ánh trong domain/product | OK |
| Nhu cầu N01–N05 map vào specs MVP 001–003 | OK |
| F001–F018 trong scope có spec tương ứng 001–008 | OK |
| Test case domain được dẫn trong success criteria 001–008 | OK |
| Ruleset versioning có ADR + rules-versioning.md (đã bổ sung mô hình ruleset con giữa năm 2026-H1/H2) | OK |
| Spec 005–008: NEEDS CLARIFICATION | **Đã giải quyết hết** — số liệu khóa với nguồn VB trong Clarifications từng spec |
| Tech stack React/Expo đã vào plan | OK — `/speckit-plan` đã chạy cho 001; `plan.md` + `tasks.md` (19 tasks) đã tồn tại trong `specs/001-tinh-luong-gross-net/` |
| Test case tính tay được kiểm lại số học (2025-01, 2026-01, BH-2026-01/02/H2-01, OT-01, UE-01, MAT-01/02, LUMPSUM-01, RENT-01/02, SEC-01) | OK — TC-RENT-01 cũ sai luật 2026, đã thay |

## Số liệu đã khóa trong 3 vòng xác minh (2026-07-31)

| Chủ đề | Kết luận | Nguồn |
|--------|----------|-------|
| Thôi việc / mất việc | ½ tháng/năm; 1 tháng/năm sàn 2 tháng; trừ thời gian BHTN; làm tròn ½/1 năm | Đ.46–47 BLLĐ 2019 |
| Trợ cấp thất nghiệp | 60% BQ 6 tháng, trần 5×LTTV, 3–12 tháng | Đ.38–39 Luật Việc làm 74/2025/QH15 |
| Thai sản | 100% BQ 6 tháng; 6 tháng (con thứ 2 từ 01/07/2026: 7 tháng); trợ cấp 1 lần 2× tham chiếu | Đ.53/58/59 Luật BHXH 2024; NĐ 168/2026; NĐ 161/2026 |
| BHXH một lần | (1,5×T1 + 2×T2) × MBQTL trượt giá; điều kiện tách mốc 01/07/2025 | Đ.70 Luật BHXH 2024; CV 340/BHXH-CSXH |
| Lương cơ sở | 2,34tr → **2,53tr từ 01/07/2026** → trần BHXH/BHYT 46,8 → 50,6tr | NĐ 161/2026/NĐ-CP |
| Hộ KD / cho thuê | Ngưỡng miễn **1 tỷ/năm**; cho thuê >1 tỷ: GTGT 5% toàn bộ + TNCN 5% phần vượt | NQ 198/2025; NĐ 68/2026 + **141/2026**; TT 50/2026 |
| Vãng lai | Ngưỡng khấu trừ 10%: 2tr → **5tr/lần** (01/07/2026); ≤15tr/tháng đã khấu trừ → miễn quyết toán phần đó | NĐ 253/2026 |
| Chứng khoán | 0,1%/lần thống nhất | NĐ 253/2026 |

## Vòng xác minh #4–#5 (2026-07-31, cùng ngày) — đóng toàn bộ nợ vòng trước

| Nợ cũ | Kết luận | Nguồn |
|-------|----------|-------|
| ESOP (2 cách đọc) | **Cách đọc A đúng**: khi bán chịu thuế TLTC (thu nhập = chi phí ghi sổ tại phát hành, fallback mệnh giá; khấu trừ 10% tại lưu ký; quyết toán lũy tiến) + 0,1% chuyển nhượng | Nguyên văn Đ.50 k3a NĐ 253/2026 (chinhphu.vn; khớp KPMG/RSM/HSC) |
| Biểu tỷ lệ ngành hộ KD | **Khóa**: GTGT 1/5/3/2%; TNCN 0,5/2/1,5/1% (cho thuê TS & đại lý 5%); >3 tỷ theo thu nhập 17%/20% | Luật GTGT 2024 Đ.12 k2; Luật 109/2025 Đ.7 k3; NĐ 68/2026 (05/03/2026) |
| Lương hưu Đ.66 | **Khóa**: nữ 45%@15 +2%/năm (max 75%@30); nam ≥20 năm 45%@20 +2%/năm (max 75%@35); nam 15–<20 năm 40%@15 +1%/năm | Đ.66 Luật BHXH 41/2024/QH15 |
| (Kiểm tra chéo bổ sung) Mốc GTGC/biểu 5 bậc | **Xác nhận đúng như domain**: áp từ kỳ tính thuế 2026 (01/01/2026), dù luật hiệu lực chung 01/07/2026; quyết toán 2025 vẫn 11/4,4 + 7 bậc | Khoản 2 Đ.29 Luật 109/2025; CV 1296/CT-NVT |

## Vòng đối chiếu văn bản gốc (2026-07-31, product owner cung cấp đợt 1)

5 bản gốc nhận vào `docs/legal-originals/`, đối chiếu xong — **toàn bộ tham số MVP đạt Tầng 1, không phát hiện sai lệch**:

| Bản gốc | Kết quả đối chiếu |
|---------|-------------------|
| Luật 109/2025/QH15 (15 trang) | Biểu 5 bậc (Đ.9), GTGC 15,5/6,2 (Đ.10), hộ KD (Đ.7), CK 0,1% (Đ.13 k2), hiệu lực kỳ 2026 (Đ.29 k2) — khớp domain 100% |
| NQ 110/2025/UBTVQH15 | GTGC + mốc 01/01/2026 — khớp |
| NĐ 293/2025/NĐ-CP | LTTV 4 vùng + hiệu lực 01/01/2026 — khớp; có phụ lục địa bàn 34 tỉnh |
| NĐ 161/2026/NĐ-CP | Lương cơ sở 2,53tr từ 01/07/2026 — khớp |
| CV 340/BHXH-CSXH | **Bảng hệ số trượt giá 2026 đầy đủ đã nhập vào domain** (trước đó hoàn toàn thiếu) |

Đối chiếu bản gốc cũng **chốt được**: TNCN hộ KD theo doanh thu tính trên **phần vượt ngưỡng** (Đ.7 k3a) — TC-HKD-02 khóa số cuối; và **phát hiện 2 khoản giảm trừ mới** trong Luật 109 chưa ai mô hình hóa (hưu trí tự nguyện/nhân thọ Đ.8 k2; chi y tế – giáo dục Đ.11 k2, chờ NĐ hướng dẫn mức) — ghi nợ backlog trong `thue-tncn.md`.

## Vòng speckit-analyze (2026-07-31) — phân tích chéo có cấu trúc + remediation

Chạy theo detection pass của `/speckit-analyze` (tại thời điểm đó chưa có plan.md/tasks.md — thay task coverage bằng test-case coverage theo Constitution IV; *cập nhật 2026-08-03: `plan.md`/`tasks.md` cho 001 đã được lập sau vòng này*). Kết quả: **1 CRITICAL, 3 HIGH, 5 MEDIUM, 7 LOW** — đã remediate ngay trong phiên:

| Finding | Mức | Sửa |
|---------|-----|-----|
| C1: Spec 004 không có TC tính tay (vi phạm Constitution IV) | CRITICAL | Thêm **TC-QT-2025-01** (làm 10 tháng → hoàn 4,8tr), **TC-QT-2026-01** (lương + vãng lai 240tr → nộp thêm 1,62tr), **TC-QT-2026-02** (vãng lai được miễn nhưng gộp tự nguyện có lợi → hoàn 3tr) + công thức năm/biểu năm vào `thue-tncn.md` mục 4.1 & 6; acceptance 004 viết lại theo TC |
| C2: 004 thiếu breakdown năm (Constitution III) | HIGH | FR-009 mới |
| C3: TC-CASUAL trong SC 008 nhưng không có US vãng lai | HIGH | US5 mới (khấu trừ tại nguồn, ngưỡng theo `as_of_date`) + FR-006; TC-CASUAL-03 chuyển kiểm chứng sang 004 |
| C4/U4: Ốm đau + sinh đôi không có TC | HIGH | **TC-SICK-01** (5 ngày × 375k = 1.875.000) + **TC-MAT-03** (sinh đôi: 7 tháng + trợ cấp 2 con = 136.120.000) vào domain; acceptance 006 bổ sung |
| I1/I2/U1/T1 (spec 001) | MEDIUM | US3 ghi rõ tháng 03/2026; assumption lương cơ sở 2 giai đoạn; chốt hành vi net không khả thi (không trả gross < LTTV); tham chiếu "F003 (spec 002)" |
| A1/A2 (spec 004) | MEDIUM | Tolerance chốt số (TC ≤ 1 đồng; property 12 tháng ≤ 12 đồng); FR-007 gắn cờ ⚠ điều khoản chuyển tiếp NĐ 253/2026 chưa đối chiếu bản gốc |
| U2/U3/I3/I4 (specs 002/005/008/004/007) | LOW | Wording NPT chặn 20; checklist BHTN thêm biến thể 12/36; note hộ KD đánh dấu đã đóng; status đồng bộ "Draft (clarified)"; 007 thêm SC dẫn TC-LUMPSUM/PENSION |

Không sửa (chấp nhận): D1 (disclaimer lặp 8 specs — cân nhắc cross-cutting requirements khi `/speckit-plan`); post-launch metrics (SC-003 001, SC-002 003) giữ nguyên vì là outcome metric.

**Phát hiện mới ghi nợ**: điều khoản chuyển tiếp NĐ 253/2026 (miễn quyết toán vãng lai áp cả kỳ 2026 hay chỉ từ 01/07/2026) — thêm vào lý do cần toàn văn NĐ 253 (đã nằm trong Ưu tiên 3); trần ngày ốm đau/năm và mức trợ cấp "mỗi con" Đ.58 vẫn ⚠ Tầng 2 — thuộc gói Luật BHXH 41/2024 (Ưu tiên 2).

## Vòng đối chiếu văn bản gốc đợt 2 (2026-07-31) — đủ 17 văn bản mới

Báo cáo chi tiết: `docs/legal-originals/_verify_A.md` (BHXH/thai sản), `_verify_B.md` (thuế 2025), `_verify_C.md` (thu nhập khác), `_verify_D.md` (lương nền + BHTN).

| Kết quả | Chi tiết |
|---------|----------|
| Khớp toàn bộ kỳ vọng | Gói B (Luật TNCN 2007, NQ 954, CV 1296); hầu hết A/C/D |
| **Chốt câu hỏi mở FR-007** | NĐ 253 Đ.69.1.a: ngưỡng 5tr + miễn QT 15tr áp **cả kỳ tính thuế 2026** |
| Lệch đã sửa vào domain/spec | BHTN chờ việc **10 ngày LV** (không 15); thời điểm hưởng ngày LV thứ 11; trần BHTN chỉ 5×LTTV; tháng lẻ = Đ.5 k6; TT 87 phạm vi hẹp; NĐ 141 chỉ đổi ngưỡng; TT 50 mốc 31/07 = mẫu 01/BK-STK |
| Xác nhận "cho mỗi con" | Đ.58 k.4 Luật BHXH — ✅; trần ốm đau 30/40/60 (40/50/70 nặng nhọc) — ✅ |
| **Còn thiếu 1 văn bản** | **Luật Dân số 113/2025/QH15** Đ.14 (con số "7 tháng" nghỉ thai sản con thứ hai) — NĐ 168 chỉ điều kiện |

## Vòng đối chiếu đợt 3 (2026-08-01) — Luật Dân số 113/2025

`luat113-2025.pdf` (text layer, đọc toàn văn): Đ.14 k.1a xác nhận **7 tháng** cho lao động nữ sinh con thứ hai + nam 10 ngày LV; Đ.29 k.1 **sửa thẳng Đ.139 k.1 BLLĐ** (6/7 tháng, trước sinh ≤2 tháng, sinh đôi +1 tháng/con); Đ.29 k.2 sửa Đ.53 k.2c Luật BHXH (nam 10 ngày LV khi vợ sinh đôi **hoặc** con thứ hai, sinh ba +3 ngày/con); Đ.30: hiệu lực 01/07/2026 (điểm c–d k.1 Đ.14 hỗ trợ tài chính: 01/01/2027). TC-MAT-02 hết ⚠ — **toàn bộ tham số specs 001–008 đạt Tầng 1**.

## Vòng bổ sung file pháp lý (2026-08-03) — `253-2026-ND-CP.pdf`

Xác minh file `253-2026-ND-CP.pdf` (`docs/legal-originals/253-2026-ND-CP.pdf` — bản gốc Nghị định 253/2026/NĐ-CP):
- Đã đồng bộ `253-2026-ND-CP.pdf` cùng bản ký điện tử `253m-ndcp.signed.pdf`.
- Đã đăng ký và dẫn chiếu chính thức trong `docs/domain/legal-sources.md`, `docs/domain/legal-changelog.md`, `docs/domain/thu-nhap-khac.md`, `docs/domain/thue-tncn.md` và `specs/004-quyet-toan-thue/spec.md`.
- Toàn bộ các điều khoản cốt lõi của NĐ 253 (Đ.50 k2 vãng lai $\ge$ 5tr, Đ.50 k3a ESOP, Đ.51 k1b miễn quyết toán $\le$ 15tr, Đ.54 CK 0,1%, Đ.69.1.a áp cả kỳ 2026, Đ.70.2 xử lý giao thời 2026) đã đạt **Tầng 1** hoàn toàn.

## Nợ còn lại

1. Mức trần giảm trừ y tế/giáo dục (Đ.11 k2 Luật 109/2025) chờ nghị định hướng dẫn.
2. JSON Schema ruleset chính thức — **đã hoàn thành**: `docs/product/ruleset-schema.json` được lập trong `/speckit-plan` 001.

## Khuyến nghị phiên sau

1. `/speckit-plan` cho `001-tinh-luong-gross-net` — **đã hoàn thành** (`plan.md` + `tasks.md`, 19 tasks). Bước tiếp theo: `/speckit-implement` cho 001, và lập `plan.md`/`tasks.md` cho 002/003 (MVP, hiện còn thiếu — xem `1st_doc_review_report.md` lỗi #7).
2. Khi luật mới: cập nhật `legal-changelog.md` → domain → analyze lại.

