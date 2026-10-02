# QA Android qua LDPlayer, 02/10/2026

LDPlayer 9, Android 9/API 28, Expo Go 57.0.9. Màn hình thử: 390×844 và 320×844 dp (density 320), font scale 1,0/1,3. Thử sáng/tối và VI/EN. Các tổ hợp được thể hiện trong tên ảnh, không phải mọi màn hình đã thử đủ mọi tổ hợp. Nút bánh răng nổi là công cụ của Expo Go.

- `salary-light.png`, `salary-dark.png`: Gross 30 triệu, tháng 3/2026, vùng I, 0 NPT, BH full; Net 26.215.000.
- `settlement-dark.png`: lương 30 triệu ×10, khấu trừ 16.275.000, hoàn 12.150.000.
- `settings-light.png`, `settings-dark.png`: chủ đề và thứ tự cài đặt.
- `salary-font130-dark.png`, `settings-font130-en-dark.png`, `settings-font130-vi-light.png`: chữ lớn 390 dp, nhãn tab VI/EN.
- `salary-320-font130-light.png`, `benefits-320-font130-light.png`, `offer-320-font130-light.png`: màn hẹp với chữ lớn, sau sửa nhãn tab/bảng offer.
- `salary-input-focused-dark.png`: ô nhập đã focus; không xác nhận bàn phím hiển thị.

Đã sửa nền tab/CTA Android, cuộn kết quả theo safe area, màu status bar Android cũ, nhãn tab nhỏ và số tiền bảng offer bị ngắt giữa chữ số. Một số ảnh 390 dp được chụp trước bước sửa cuối status bar/bảng offer; ảnh 320 dp, `salary-light.png` và `settings-light.png` thể hiện bản sau cùng. Logcat ReactNativeJS:E và AndroidRuntime:E không có lỗi trong phiên QA.

IME Pinyin mặc định báo `mInputShown=true` nhưng cửa sổ InputMethod có chiều cao 0 và không có surface. Cần kiểm tra bàn phím bằng IME/thiết bị khác. Chưa kiểm tra iOS, Android API mới hay APK release.

## Tái hiện trên máy này

Chạy Metro ở thư mục dự án:

```powershell
$env:EXPO_OFFLINE = '1'
npx expo start --go --lan --port 8081
```

Ở terminal khác:

```powershell
& 'C:\LDPlayer\LDPlayer9\adb.exe' connect 127.0.0.1:5555
& 'C:\LDPlayer\LDPlayer9\adb.exe' -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081
& 'C:\LDPlayer\LDPlayer9\adb.exe' -s 127.0.0.1:5555 shell am start -a android.intent.action.VIEW -d 'exp://127.0.0.1:8081' host.exp.exponent
```

Expo Go đã được cài trong LDPlayer. Dùng `--lan`: trên máy này `--localhost` chỉ bind IPv6, không nhận kết nối IPv4 của ADB reverse. `expo start --android` không nhận diện LDPlayer qua cổng AVD; mở bằng intent như trên. Đã khôi phục độ phân giải, density và cỡ chữ hệ thống sau QA.
