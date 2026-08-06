# Research: F020 Tổng hợp QT đa nguồn

**Date**: 2026-08-06  
**Spec**: [spec.md](./spec.md)

## R1 - Entry point UI

- **Decision**: Route mới `app/multi-source.tsx` + CTA từ tab Quyết toán và hub Thu nhập khác (“Thêm vào tổng hợp năm”). Không thêm tab bar thứ 5.
- **Rationale**: Tab bar đã dày; QT là ngữ cảnh năm; deep-link được.
- **Alternatives**: Tab mới (phình IA); chỉ embed CollapseSection trong Settlement (khó discover khi user chỉ có HKD).

## R2 - Cách đưa số liệu vào bảng

- **Decision**: **Nhập tay / paste số đã ước** là MVP; **kéo từ kịch bản đã lưu** (F014 calculator/settlement + optional snapshot other-income) là SHOULD cùng release nếu effort thấp, không chặn MVP.
- **Rationale**: Engine other-income hiện không luôn persist kết quả; bắt buộc auto-sync làm phình store. Manual + optional scenario import đủ SC-001.
- **Alternatives**: Live sync mọi calculator (phức tạp, state phân tán); chỉ import JSON (UX kém).

## R3 - Cộng tổng thuế nghĩa là gì?

- **Decision**: `totalEstimatedTax` = Σ thuế ước **theo dòng** (PIT lương + GTGT+TNCN HKD/thuê + PIT CK/ESOP transfer + …). `totalWithheld` = Σ đã nộp user nhập. `delta = totalEstimatedTax − totalWithheld` mang nhãn ước; **không** suy ra hoàn/nộp chính thức một tờ khai.
- **Rationale**: Luật tách sắc thuế / tờ khai; tổng chỉ để người dùng “thấy bức tranh”, disclaimer bắt buộc.
- **Alternatives**: Chỉ liệt kê không tổng (yếu SC); gộp mọi PIT vào biểu lũy tiến (sai luật - FR-005).

## R4 - Vãng lai vs DualScenario

- **Decision**: Nếu dòng lương + dòng vãng lai cùng năm và đủ điều kiện miễn QT vãng lai → bảng MUST hiện **cùng thông tin DualScenario** (hai phương án) hoặc deep-link về QT hiện tại với toggle; không tự ý chọn một phương án im lặng.
- **Rationale**: Giữ TC-QT-2026-02 / Constitution IV.
- **Alternatives**: Bỏ qua miễn (hồi quy); chỉ một số (mất minh bạch).

## R5 - ESOP phần TLTC

- **Decision**: Dòng ESOP tách: (a) thuế chuyển nhượng 0,1% trên bảng đa nguồn; (b) phần TLTC ghi chú “còn quyết toán theo biểu lương - cộng vào dòng lương nếu user muốn”, không auto-merge vào PIT lương trừ khi user bật.
- **Rationale**: Khớp domain ESOP; tránh double-count / sót.
- **Alternatives**: Auto-merge luôn (nguy hiểm nếu user đã tính trong QT lương).

## R6 - Crypto

- **Decision**: Không entity, không engine path, không UI nhập. Disclaimer trên màn tổng hợp + Thu nhập khác (đã có).
- **Rationale**: ADR 0009 / FR-006 / SC-003.
- **Alternatives**: Ước 0,1% (đã từ chối).

## R7 - Wizard F007b

- **Decision**: Nếu bảng có ≥1 nguồn ngoài `salary` (và ngoài vãng lai-only đã xử lý) → `hasOtherIncome`-equivalent = true → kết luận **self_file** + checklist bổ sung theo loại dòng có mặt.
- **Rationale**: FR-009; ủy quyền tổ chức thường không cover HKD/thuê/CK.
- **Alternatives**: Quiz riêng dài (trễ MVP).

## R8 - Test strategy

- **Decision**: Unit test orchestrator với fixture: (1) lương only; (2) lương + HKD exempt; (3) lương + thuê vượt ngưỡng; (4) cấm path crypto (type union không chứa crypto). Hand-calc SC-002.
- **Rationale**: Constitution IV; tái dùng số từ TC-HKD-01 / QT hiện có.
- **Alternatives**: Chỉ manual QA (không đủ).

## Resolved clarifications

| Topic | Resolution |
|-------|------------|
| Tab vs route | Route + CTA |
| Auto vs manual data | Manual MVP; scenario import SHOULD |
| Meaning of totals | Sum of line taxes; estimate label |
| Crypto | Out of scope |
| ESOP TLTC | Note + optional user merge, no silent auto |
