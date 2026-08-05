# Research: 009-app-shell-ux

**Date**: 2026-08-05

## Decisions

### R1 — Expo Router + Tabs cho application layout

- **Decision**: Dùng Expo Router file-based routing với nhóm `(tabs)`: Home (placeholder calculator) + Settings.
- **Rationale**: Khớp stack Expo đã chọn trong plan 001; tabs là pattern một tay trên mobile; dễ mở rộng tab sau (quyết toán, quyền lợi).
- **Alternatives rejected**: React Navigation manually without Expo Router (thêm boilerplate); Drawer-only (kém discoverability cho 2 mục chính).

### R2 — Splash: `expo-splash-screen` + custom SplashView

- **Decision**: Giữ native splash tới khi font Outfit + preferences hydrate xong, rồi hiện `SplashView` branded (tối đa ~2s hoặc đến khi ready, hard cap 3s), sau đó `hideAsync` và vào tabs. Warm start (app đã mount): bỏ qua SplashView đầy đủ.
- **Rationale**: Đáp ứng FR-001/002 và NFR-001; tránh flash trắng.
- **Alternatives rejected**: Chỉ native splash không có Ngài Miu (yếu brand); splash bắt buộc mỗi resume (phiền).

### R3 — Preferences qua AsyncStorage schema versioned

- **Decision**: JSON `{ schemaVersion: 1, defaultRegion: 'I'|'II'|'III'|'IV', defaultTaxYear: number }` tại key `kv.preferences.v1`. Reset = ghi lại defaults. Corrupt/missing → defaults + optional soft error trên Settings.
- **Rationale**: FR-005–007, NFR-004/005; sẵn sàng cho CalculatorScreen (001) đọc cùng store.
- **Alternatives rejected**: SecureStore (quá mức cho non-secret); remote sync (vi phạm offline/privacy scope).

### R4 — Loading pattern

- **Decision**: `LoadingOverlay` (full-screen, mascot pose ngơ ngác tùy chọn) + `InlineLoading` cho vùng nhỏ. Hook/`LoadingProvider` với delay 150ms trước khi hiện để tránh flicker.
- **Rationale**: US2 / NFR-001; design-system cấm animation vô hạn — dùng ActivityIndicator / Reanimated pulse ngắn hoặc indeterminate đơn giản không loop mascot.
- **Alternatives rejected**: Luôn hiện spinner ngay (flicker); skeleton phức tạp (YAGNI cho shell).

### R5 — Theme tokens & typography

- **Decision**: `src/theme/tokens.ts` map 1:1 `docs/product/design-system.md`; load Outfit via `@expo-google-fonts/outfit`; StyleSheet only (không NativeWind trong MVP shell để giảm phụ thuộc — có thể thêm sau nếu 001 chọn).
- **Rationale**: NFR-006; một nguồn token; Flat Design (no shadow props).
- **Alternatives rejected**: Hard-code màu trong từng screen; dark mode (out of scope).

### R6 — Mascot placeholder

- **Decision**: Component SVG phẳng tối giản (hình học) trong `NgaiMiuPlaceholder` — đủ nhận diện tuxedo + kính; thay asset chính thức sau khi có bộ pose.
- **Rationale**: Design-system §8; Assumptions trong spec cho phép placeholder đạt style guide.
- **Alternatives rejected**: Ảnh PNG tả thực/gradient; emoji only.

## Open items (non-blocking)

- Bộ asset pose ①–⑥ chính thức — theo dõi design-system §9; không chặn shell.
- Gắn thật CalculatorScreen từ 001 vào tab Home khi 001 implement.
