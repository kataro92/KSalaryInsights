# Kế hoạch cải tiến giao diện KSalaryInsights

Ngày lập: 02/10/2026
Trạng thái: Đã triển khai ngày 02/10/2026; đã QA Android qua LDPlayer, thiết bị thật/iOS còn chờ
Phạm vi: Giao diện React Native / Expo trên mobile, web và tablet.

## Mục tiêu

Cải thiện độ dễ đọc, giảm thao tác cuộn và làm rõ ngữ cảnh tính toán. Giữ nhận diện Plus Jakarta Sans, tông xanh–mint và Ngài Miu. Ưu tiên chỉnh component dùng chung để các màn hình nhất quán.

Không thay đổi công thức tính, ruleset hoặc dữ liệu kịch bản đã lưu trong đợt cải tiến UI này. Mọi thay đổi hành vi, như chọn tháng mặc định theo thời gian hiện tại, cần được tách thành hạng mục riêng.

## Cơ sở đánh giá

Đã đọc mã nguồn, design system, ảnh chụp trong repo và chạy `npm run qa:design`. Chưa xác minh giao diện hiện tại trên thiết bị; bản web xem trước bị timeout. Một số ảnh trong repo còn tên thương hiệu cũ, nên chỉ dùng làm tham khảo và đối chiếu với code.

Các tỷ lệ tương phản dưới đây được tính từ màu đặc trong `src/theme/palettes.ts`, chưa bao gồm opacity, blur hoặc màu nền sau compositing:

| Cặp màu | Sáng | Tối |
|---|---:|---:|
| `foregroundMuted` / `background` | 3,18:1 | 7,45:1 |
| `foregroundMuted` / `muted` | 2,98:1 | 6,45:1 |
| `white` / `primary` | 3,68:1 | 2,78:1 |
| `white` / `secondary` | 2,64:1 | 2,07:1 |

`Button`, `ChoiceChip` khi được chọn và `ResultHero` hiện dùng chữ trắng trên màu primary/secondary. Tài liệu tương phản vẫn tham chiếu palette v2 trong khi code đã dùng palette mới. `qa:design` đang báo màu trong `theme/palettes.ts` là ngoài token vì danh sách cho phép chỉ có `theme/tokens.ts`.

## Hạng mục triển khai

### 1. Màu và độ tương phản — ưu tiên cao

- Giữ pastel cho nền và khối phụ; làm đậm màu chữ phụ ở theme sáng.
- Tách token màu chữ trên nền primary và nền kết quả khỏi `white`, cho phép lựa chọn phù hợp theo theme.
- Điều chỉnh màu nút hoặc màu chữ để nhãn nút, chip và kết quả dễ đọc ở cả hai theme.
- Kiểm tra lại chữ lỗi, liên kết, nhãn kết quả có opacity và trạng thái pressed.
- Cập nhật bảng tương phản trong design system theo palette thực tế.

**File chính:** `src/theme/palettes.ts`, `src/components/common/Button.tsx`, `src/components/common/ChoiceChip.tsx`, `src/components/common/ResultHero.tsx`, `docs/product/design-system.md`.

**Nghiệm thu:** Chữ thông thường đạt tối thiểu 4,5:1; chữ lớn đạt 3:1. Kiểm tra cả trạng thái mặc định và tương tác, cùng nền thực tế khi có opacity/blur.

### 2. Sắp xếp lại Cài đặt — ưu tiên cao

- Đưa Giao diện, Ngôn ngữ, Vùng lương và Năm thuế lên ngay sau tiêu đề.
- Đặt cập nhật mức thuế/bảo hiểm sau nhóm tùy chọn cá nhân.
- Chuyển Giới thiệu, Ngài Miu và hướng dẫn tính năng xuống cuối hoặc vào phần thu gọn.
- Giữ các thao tác khôi phục mặc định ở nhóm cuối, tách khỏi thao tác thường dùng.

**File chính:** `app/(tabs)/settings.tsx`, `src/components/settings/FeaturesGuide.tsx`.

**Nghiệm thu:** Người dùng tiếp cận tùy chọn giao diện/ngôn ngữ trước các đoạn giới thiệu dài. Giá trị đã lưu, đổi theme và đổi ngôn ngữ vẫn hoạt động như trước.

### 3. Hiện rõ tham số tính lương — ưu tiên cao

- Thêm dòng tóm tắt ngay gần form chính: “Tháng 03/2026 · Vùng I · 0 người phụ thuộc · BH toàn bộ Gross”.
- Có thao tác “Chỉnh sửa” mở phần tùy chỉnh hiện có.
- Rút ngắn tiêu đề phần thu gọn, tránh liệt kê quá nhiều tham số trong một nhãn.
- Cập nhật tóm tắt khi thay đổi form hoặc nạp kịch bản.

**File chính:** `src/screens/CalculatorScreen.tsx`, `src/components/common/CollapseSection.tsx`.

**Lưu ý:** Tháng mặc định hiện cố định là `3`. Hạng mục này làm rõ tháng đang được áp dụng; không tự thay đổi mặc định hoặc cách chọn ruleset.

**Nghiệm thu:** Nhìn thấy tháng/năm, vùng, người phụ thuộc và chế độ bảo hiểm khi phần tùy chỉnh đóng. Tóm tắt luôn khớp dữ liệu được dùng để tính.

### 4. Gom kết quả và chi tiết khoản trừ — ưu tiên vừa

- Đặt `ResultHero`, căn cứ bảo hiểm và bảng khoản trừ thành một nhóm liền mạch.
- Chuyển thẻ Ngài Miu xuống sau bảng chi tiết, hoặc dùng hàng gợi ý ngắn có thể mở rộng.
- Giữ Lưu/Chia sẻ gần kết quả; giảm độ nổi bật của các thao tác phụ so với số tiền chính.
- Giữ thao tác tự cuộn tới kết quả sau khi tính; kiểm tra vùng nhìn thấy phía trên sticky CTA.
- Kiểm tra số tiền dài trên màn hẹp, hạn chế thu nhỏ chữ kết quả quá mức.

**File chính:** `src/screens/CalculatorScreen.tsx`, `src/components/common/ResultHero.tsx`, `src/components/mascot/NgaiMiuTip.tsx`, `src/components/breakdown/SalaryBreakdownCard.tsx`.

**Nghiệm thu:** Số thực nhận và các khoản trừ nằm liền nhau. Kết quả không bị CTA/tab bar che; số tiền dài vẫn đọc rõ. Disclaimer và nguồn pháp lý vẫn có thể truy cập.

### 5. Bảng so sánh offer A/B — ưu tiên vừa

- Giữ hai form nhập offer, thêm bảng kết quả chung sau khi tính.
- Dùng các hàng Net, Gross, Bảo hiểm và Thuế; cột A/B căn số tiền nhất quán.
- Làm nổi bật chênh Net bằng số tiền và diễn đạt hướng chênh lệch rõ ràng.
- Trên màn hẹp, ưu tiên bảng kết quả gọn; trên màn rộng, có thể đặt hai form cạnh nhau.
- Giữ nội dung trung lập, không tự đưa ra lời khuyên chọn offer.

**File chính:** `src/screens/OfferCompareScreen.tsx`, `src/components/comparison/OfferColumn.tsx`, `src/components/comparison/OfferDeltaBar.tsx`.

**Nghiệm thu:** So được A/B tại cùng một vị trí, không phải cuộn qua hai khối kết quả riêng. Hướng chênh lệch B so với A rõ ràng; kiểm tra trường hợp bằng nhau và một offer không tính được.

### 6. Tab bar và khả năng đọc — ưu tiên vừa

- Tăng nhãn tab từ 10px lên khoảng 12px, điều chỉnh sau khi kiểm tra thực tế.
- Cho phép phóng chữ có giới hạn hợp lý thay vì tắt hoàn toàn font scaling.
- Làm rõ tab đang chọn bằng màu và dấu hiệu hình dạng/nền nhẹ.
- Kiểm tra đủ chỗ cho nhãn dài trong các ngôn ngữ được hỗ trợ.

**File chính:** `app/(tabs)/_layout.tsx`, `src/components/common/TabBarIcon.tsx`.

**Nghiệm thu:** Nhãn không bị cắt ở màn nhỏ và cỡ chữ lớn. Tab được chọn dễ nhận biết; các vùng chạm vẫn đạt tối thiểu 44×44.

### 7. Bố cục web/tablet — ưu tiên thấp

- Giữ bố cục một cột trên điện thoại.
- Thêm biến thể container rộng cho các màn tính toán, thay vì tăng `maxContentWidth` toàn ứng dụng.
- Khi đủ chiều rộng, đặt form và kết quả thành hai cột; offer A/B đặt cạnh nhau.
- Giữ sticky CTA, tab bar và nội dung căn chỉnh theo container tương ứng.

**File chính:** `src/theme/tokens.ts`, `src/components/common/ScreenShell.tsx`, `src/components/common/ToolScreen.tsx`, các màn tính lương/so sánh offer.

**Nghiệm thu:** Không cuộn ngang ở mobile; màn rộng tận dụng không gian mà vẫn giữ dòng chữ dễ đọc. Thứ tự đọc và thao tác bàn phím hợp lý.

## Thứ tự thực hiện

1. Sửa cấu hình `qa:design` để nhận diện `theme/palettes.ts`; giữ kiểm tra màu ngoài token ở component.
2. Chỉnh token tương phản, các component dùng màu trên nền đặc và tài liệu thiết kế.
3. Sắp xếp Cài đặt; thêm tóm tắt tham số tính lương.
4. Gom nhóm kết quả, tinh chỉnh tab bar và bảng offer A/B.
5. Thêm bố cục web/tablet sau khi các màn mobile đã ổn định.
6. Chụp lại ảnh hiện tại và cập nhật checklist QA.

## Kiểm tra và nghiệm thu chung

- Chạy `npm run qa:design` sau khi sửa cấu hình kiểm tra.
- Chạy kiểm tra TypeScript theo cấu hình dự án; chạy kiểm thử phù hợp nếu có thay đổi logic trạng thái hoặc dữ liệu.
- Đối chiếu cùng đầu vào trước/sau để bảo đảm số tiền và ruleset không đổi.
- Kiểm tra màn hẹp 320px, mobile 390×844 và một viewport tablet/web rộng.
- Kiểm tra sáng/tối, chữ hệ thống lớn, bàn phím mở, số tiền dài và nhãn đa ngôn ngữ.
- Kiểm tra các trạng thái chưa tính, lỗi nhập, có kết quả, nạp kịch bản và sửa đầu vào sau khi tính.
- Kiểm tra Lương, Quyết toán, Quyền lợi, Cài đặt và So 2 offer; spot-check các công cụ khác dùng component chung.
- Kiểm tra trên thiết bị iOS/Android trước khi kết luận về blur, safe area, bàn phím và tab bar.

## Checklist tiến độ

- [x] Sửa cấu hình design QA.
- [x] Cải thiện tương phản và cập nhật design system.
- [x] Sắp xếp lại Cài đặt.
- [x] Hiện tóm tắt tham số tính lương.
- [x] Gom kết quả và bảng khoản trừ.
- [x] Thêm bảng kết quả offer A/B.
- [x] Tinh chỉnh tab bar và font scaling.
- [x] Bổ sung bố cục web/tablet.
- [x] Kiểm tra trực quan web, chụp lại ảnh và cập nhật checklist.
- [x] QA LDPlayer Android 9: 320/390 dp, sáng/tối, chữ 100%/130%, VI/EN; sửa lỗi native phát hiện khi kiểm tra.
- [ ] Kiểm tra iOS/Android: blur, safe area, chữ hệ thống lớn và bàn phím thật.

## Kết quả triển khai

Xem [báo cáo kiểm thử](./improvement-implementation-report.md) và [ảnh QA](../screenshots/2026-10-02/README.md). Container rộng 1040px, hai cột từ 900px; tab bar 12px, font scale tối đa 1,25 (1,15 dưới 360 dp). Bảng offer xử lý hai bên tại cùng một vị trí, chuyển thành từng khoản A/B khi màn hẹp hoặc chữ lớn. Các ô mới lưu được trong kịch bản.
