# ADR 0003: Giữ MVP gọn; hộ KD / wizard quyết toán vào V1 (có thể nâng ưu tiên)

- **Status**: Accepted (tạm thời; review lại trước khi ship V1)
- **Date**: 2026-07-31
- **Context**: Research nhu cầu xếp hộ KD sau bỏ thuế khoán và wizard “ủy quyền vs tự quyết toán” rất cao (điểm ngang quyết toán đa nguồn). ADR 0002 đã chốt MVP = gross-net + so sánh luật + ruleset.

## Decision

- **Không mở rộng MVP** ngay (tránh phình scope trước khi engine lương/ruleset ổn định).
- Đưa **F007/F008 + wizard thủ tục quyết toán** và **module hộ KD/cho thuê** lên đầu backlog V1 (có thể song song sau khi 001-003 pass).
- Nếu cửa sổ thị trường hộ KD 2026 cần tận dụng sớm: tách epic `009-ho-kinh-doanh` và cân nhắc release V1.1 trước quyền lợi nghỉ việc.

## Consequences

- MVP vẫn ship được với USP versioning + breakdown + mobile.
- Rủi ro: đối thủ/content chiếm search hộ KD trước. giảm thiểu bằng content + calculator HKD sớm trong V1.
- ~~Cần xác minh văn bản NĐ hộ KD / cho thuê / ESOP~~ **Đã đóng 2026-07-31**: NQ 198/2025 + NĐ 68/2026 + NĐ 141/2026 (ngưỡng 1 tỷ, biểu tỷ lệ ngành) và NĐ 253/2026 Đ.50 k3a (ESOP). chi tiết trong `thu-nhap-khac.md` và `legal-changelog.md`.

## Alternatives rejected

- **Đưa hộ kinh doanh (F007/F008 + module hộ KD/cho thuê) vào ngay MVP**: bị từ chối vì phình scope MVP trước khi engine lương/ruleset (ADR 0001) ổn định. mâu thuẫn trực tiếp với ADR 0002 (MVP = F001-F006).
- **Giữ nguyên lộ trình gốc, để hộ kinh doanh tận V2+**: bị từ chối vì research (`user-needs.md`, `personas.md`) cho thấy nhu cầu N14/N15 (cho thuê, hộ KD) rất cao. điểm ngang quyết toán đa nguồn. và việc bỏ thuế khoán 2026 tạo cửa sổ thị trường có hạn; để tận V2 có nguy cơ mất lợi thế thời điểm.
- **Gộp chung hộ kinh doanh vào epic quyết toán (F007/008) thay vì tách riêng**: bị từ chối vì phạm vi nghiệp vụ khác biệt đáng kể (ngưỡng doanh thu, biểu tỷ lệ ngành, cho thuê vs lương). nếu cần release sớm thì tách epic riêng `009-ho-kinh-doanh` sẽ rõ ràng và dễ ưu tiên độc lập hơn.
