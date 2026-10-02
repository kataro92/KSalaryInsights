# Báo cáo triển khai hai kế hoạch, 02/10/2026

## Nghiệp vụ

Đã bổ sung giảm 30% TNCN kinh doanh 2026–2027, tách thuế trước giảm/số giảm/phải nộp và giữ GTGT; HKD trên 3 tỷ yêu cầu chi phí và áp 17%/20%. Tổng doanh thu kinh doanh năm dùng kiểm tra điều kiện giảm; người dùng cần tổng hợp đầy đủ các nguồn của cùng cá nhân.

Giảm trừ y tế/giáo dục 23/24 triệu, BH bổ sung 3 triệu/tháng, từ thiện, tiền ăn từ tháng 7, phụ cấp miễn và khoảng đăng ký NPT đã được nối từ form tới engine và lưu kịch bản. Tổng hợp đa nguồn có chế độ tính lại lương để áp giảm trừ một lần. Trường mới vắng mặt giữ mặc định 0; NPT cũ mặc định 1–12. Ruleset 2025 HKD/cho thuê dùng ngưỡng 100 triệu và thuế trên toàn bộ doanh thu.

Nguồn gốc và hiệu lực được ghi ở [sổ pháp lý](../domain/legal-sources.md); bản gốc bổ sung nằm trong `docs/legal-originals/`. Không dùng tham số dự thảo. Đã sửa assumption/spec quyết toán và người phụ thuộc.

## Giao diện

Đã chỉnh tương phản, màu chữ trên nút/chip/kết quả, thứ tự Cài đặt, tóm tắt tham số Lương, nhóm kết quả và khoản trừ, bảng offer A/B, nhãn tab và bố cục hai cột. Container tính toán 1040px, breakpoint 900px; các màn khác giữ container 560px. Trường có nhãn được dùng làm accessibility label.

## Kiểm thử tự động

| Kiểm tra | Kết quả |
|---|---|
| `npx tsc --noEmit` | Qua |
| `npm run test:unit` | 34 suites, 161 tests qua |
| `npm test` | Tất cả engine assertions qua |
| `npm run qa:design` | Qua |
| `npx expo export --platform web` | Qua |
| JSON Schema: 2025, 2026-h1, 2026-h2 (AJV) | Qua |

Test nghiệp vụ mới ở `src/__tests__/unit/improvementPlan.test.ts`: mặc định 0, trần giảm trừ, mốc tháng 7, tổ hợp giảm trừ, solver đảo ba chế độ BH, 2025/2026/2027, ngưỡng 10/50 tỷ, thiếu chi phí, chống đầu vào sai, validator và dữ liệu lưu cũ/mới. Fixture thuế kinh doanh được cập nhật theo kết quả trước/sau giảm; fixture lương cũ giữ nguyên.

## QA trực quan web

Edge/Playwright, viewport 320×844, 390×844, 1200×844; sáng/tối. Lương và offer ở cả sáu tổ hợp, Cài đặt ở 390px sáng/tối: không có page error hay cuộn ngang. Lương Gross 30 triệu tháng 3/2026 ra Net 26.215.000; ảnh được chụp sau khi tính và cuộn tới kết quả. Đã kiểm tra bằng mắt ảnh màn nhỏ, desktop và Cài đặt. CTA và tab bar nằm dưới vùng kết quả, nhãn tab đọc được.

Đã xác minh trên web: lưu/nạp kịch bản Lương giữ tiền ăn/BH bổ sung; sửa đầu vào xóa kết quả; quyết toán 30 triệu ×12 với y tế/giáo dục vượt trần ra 4.460.000; nhập vào tổng hợp rồi áp giảm trừ vẫn 4.460.000. HKD 4 tỷ cần chi phí: với chi phí 3 tỷ, PIT trước giảm 170 triệu, sau giảm 119 triệu, GTGT 40 triệu. Offer bằng nhau và một bên nhập 0 hiển thị đúng trạng thái. Không có page error.

Số tiền 12 chữ số tại 320px: kết quả cho phép hai dòng để đọc đủ tiền, không cắt bằng dấu ba chấm.

Ảnh và kết quả máy đọc: [thư mục QA](../screenshots/2026-10-02/README.md).

## QA Android LDPlayer 02/10/2026

Đã chạy ứng dụng native qua Expo Go 57.0.9 trên LDPlayer 9, Android 9/API 28. Kiểm tra chiều rộng 390 và 320 dp, sáng/tối, cỡ chữ hệ thống 100%/130%, tiếng Việt và tiếng Anh. Đã thao tác onboarding, tab Lương/Quyết toán/Quyền lợi/Cài đặt, tính Lương, Quyết toán và so sánh offer. Gross 30 triệu ra Net 26.215.000; quyết toán 30 triệu ×10 tháng với thuế khấu trừ 16.275.000 ra hoàn 12.150.000. Offer A Net 28.000.001, B Net 27.826.000, chênh B−A −174.001.

Đã sửa các lỗi phát hiện trên emulator: nền tab/CTA xuyên nội dung do Android BlurView thiếu blur target; cuộn kết quả vào status bar; màu status bar ở giao diện sáng trên Android cũ; nhãn Quyết toán bị cắt ở 320 dp/chữ lớn; số tiền bảng offer xuống dòng giữa chữ số. Android dùng nền đặc, bảng offer chuyển thành từng khoản A/B khi màn hình hẹp hoặc chữ lớn. Tab giới hạn font scale 1,15 dưới 360 dp, 1,25 trên màn rộng hơn. Chạy lại TypeScript, 161 unit tests và design QA sau sửa: qua. Logcat không ghi lỗi ReactNativeJS/AndroidRuntime trong phiên kiểm tra.

Ảnh và hướng dẫn tái hiện ở [QA Android](../screenshots/2026-10-02/android/README.md). Nút bánh răng nổi trong ảnh là công cụ của Expo Go. IME mặc định của LDPlayer báo đã mở nhưng cửa sổ có chiều cao 0, nên chỉ xác nhận focus ô nhập; chưa xác minh bố cục khi bàn phím thực sự hiện. Phiên này không kiểm tra APK release.

## Kiểm tra còn chờ

- iOS và Android thật/Android mới: blur iOS, safe area, bàn phím mở, chữ hệ thống lớn và nhãn tab đa ngôn ngữ; APK release.
- Kiểm tra phát hành đầy đủ với chứng từ giảm trừ thực tế. App không lưu hồ sơ chứng từ.
- Sàn LTTV đóng BH là mục P2+ tùy chọn trong kế hoạch, chưa triển khai.
