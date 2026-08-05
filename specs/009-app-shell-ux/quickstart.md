# Quickstart: 009-app-shell-ux

## Prerequisites

- Node.js 20+
- npm or yarn
- Expo Go hoặc simulator iOS/Android (tuỳ chọn)

## Setup

```bash
cd /Users/mysterym1/Documents/KSalaryInsights
npm install
npx expo start
```

## Verify shell flows

1. **Cold start**: Kill app → mở lại → thấy splash (KVSalaryTools + Ngài Miu) → vào tab **Tính lương**.
2. **Settings**: Tab **Cài đặt** → đổi Vùng / Năm thuế → quay lại → mở lại app → giá trị còn.
3. **Reset**: Cài đặt → **Đặt lại về mặc định** → vùng I + năm mặc định hệ thống.
4. **Offline**: Bật chế độ máy bay → lặp bước 1–3 (không lỗi mạng bắt buộc).
5. **Privacy**: Xác nhận không có ô nhập CCCD/MST/sổ BHXH.

## Tests

```bash
npm test
```

Kỳ vọng: unit `preferences` pass; smoke loading component pass.
