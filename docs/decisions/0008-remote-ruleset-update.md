# ADR 0008: Cập nhật ruleset từ xa (F019) với bundle fallback

- **Status**: Accepted 
- **Date**: 2026-08-05 
- **Context**: ADR 0001 tách tham số khỏi công thức; ADR 0004 giữ engine offline. Sau ship V1, luật đổi giữa kỳ phát hành app. cần cập nhật tham số mà không chờ store review, vẫn **không** gửi dữ liệu lương lên server (Constitution V).

## Decision

1. **Bundle luôn là nguồn dự phòng**: App ship kèm ruleset 2025/2026 (và lạm phát). Remote **không** được phép xóa bundle; chỉ **ghi đè cùng `id` khi `version` mới hơn** hoặc **thêm `id` mới**.
2. **Manifest HTTPS + checksum**: Endpoint công khai (JSON) liệt kê ruleset/inflation với `url` + `sha256`. App tải manifest → tải từng file → so khớp SHA-256 → validate cấu trúc tối thiểu → ghi AsyncStorage. Không dùng chữ ký PGP ở V1.1 (TLS + checksum đủ; có thể nâng cấp ADR sau).
3. **Không gửi dữ liệu lương/thuế**: Chỉ GET manifest và file ruleset. Không kèm PII / kịch bản / preferences.
4. **Chủ động + khi mở app (best-effort)**: Nút **Cập nhật ruleset** trong Cài đặt; hydrate cache khi cold start. Lỗi mạng / checksum → giữ cache cũ hoặc bundle; UI báo rõ.
5. **Engine vẫn sync**: Overlay nạp vào registry in-memory; `getRuleset` / `listRulesets` đọc merged view. không bắt buộc async ở mọi phép tính.

## Consequences

- Cần host manifest + JSON ruleset (repo `docs/product/remote/` hoặc CDN). 
- Test unit mock `fetch`; regression bundle không phụ thuộc mạng. 
- Privacy copy MUST nói rõ: chỉ tải tham số luật, không tải dữ liệu cá nhân. 
- Ruleset remote chưa có test case tính tay trong app build vẫn được dùng. product MUST cập nhật domain docs / TC trước khi publish manifest (Constitution I/IV ở phía phát hành).

## Alternatives rejected

- **Chỉ phát hành app mới khi luật đổi**: Chậm store; đã đủ cho MVP, không đủ F019. 
- **Tính trên server / API lương**: Vi phạm ADR 0004 + Constitution V. 
- **Remote-only, không bundle**: Rủi ro lần mở đầu / offline (ADR 0001 đã từ chối). 
- **Chữ ký số bắt buộc ngay**: Phức tạp vận hành; checksum + HTTPS đủ giai đoạn đầu.
