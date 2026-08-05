# Tasks: 009-app-shell-ux

**Input**: Design documents from `specs/009-app-shell-ux/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`)

**Prerequisites**: `spec.md` (checklist PASS), `plan.md` (approved)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Nhiệm vụ có thể chạy song song (khác file, không phụ thuộc)
- **[Story]**: Thuộc User Story nào (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Khởi tạo Expo app và cấu trúc thư mục shell.

- [x] T001 Khởi tạo dự án Expo (TypeScript, Expo Router) tại root repo với `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`.
- [x] T002 [P] Tạo cấu trúc `app/`, `src/theme/`, `src/components/`, `src/store/`, `src/hooks/`, `src/__tests__/` theo `plan.md`.
- [x] T003 [P] Cấu hình `.gitignore` cho Node/Expo (`node_modules/`, `.expo/`, `dist/`, `.env*`) nếu còn thiếu.
- [x] T004 Cài dependencies: `expo-router`, `expo-splash-screen`, `@expo-google-fonts/outfit`, `expo-font`, `lucide-react-native`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-svg`, `react-native-screens`, Jest + RNTL.

---

## Phase 2: Foundational (Theme, Preferences, Providers)

**Purpose**: Token + preference store — chặn mọi user story UI.

- [x] T005 Implement design tokens trong `src/theme/tokens.ts` (màu, radius, spacing, typography) khớp `docs/product/design-system.md`.
- [x] T006 [P] Implement types + load/save/reset/validate `AppPreferences` trong `src/store/preferences.ts` theo `contracts/preferences-schema.json`.
- [x] T007 [P] Viết unit test preference (default, persist roundtrip, corrupt → default) trong `src/__tests__/unit/preferences.test.ts`.
- [x] T008 Implement `usePreferences` hook + `PreferencesProvider` trong `src/hooks/usePreferences.tsx`.
- [x] T009 [P] Tạo primitive UI `Button`, `ColorBlock`, `Section` trong `src/components/common/` (no shadow, touch ≥44).

**Checkpoint**: Tokens + preferences sẵn sàng.

---

## Phase 3: User Story 1 - Splash + Application Layout (Priority: P1) 🎯 MVP

**Goal**: Cold start splash → tabs Home + Settings; warm start bỏ splash đầy đủ; offline OK.

**Independent Test**: Mở app → splash → tab Tính lương + tab Cài đặt điều hướng được.

- [x] T010 [US1] Implement `SplashView` (brand + Ngài Miu chào) trong `src/components/splash/SplashView.tsx`.
- [x] T011 [P] [US1] Implement `NgaiMiuPlaceholder` SVG flat trong `src/components/mascot/NgaiMiuPlaceholder.tsx`.
- [x] T012 [US1] Root `app/_layout.tsx`: load font Outfit, hydrate preferences, gate splash (`expo-splash-screen`), hard cap 3s.
- [x] T013 [US1] Tabs layout `app/(tabs)/_layout.tsx` + `app/(tabs)/index.tsx` (Home placeholder gắn preference) + `app/index.tsx` redirect.
- [x] T014 [US1] Đảm bảo warm start không ép SplashView đầy đủ (flag phiên trong root layout).

**Checkpoint**: US1 demo được độc lập.

---

## Phase 4: User Story 2 - Loading Screen (Priority: P1)

**Goal**: Loading overlay/inline với delay 150ms; kết thúc ≤300ms cảm nhận; không animation mascot vô hạn.

**Independent Test**: Trigger loading có kiểm soát trên Home → thấy overlay → ẩn khi xong.

- [x] T015 [US2] Implement `LoadingOverlay` + `InlineLoading` trong `src/components/loading/`.
- [x] T016 [US2] Implement `LoadingProvider` / `useLoading` (delay 150ms) và demo nút “Thử loading” trên Home placeholder.
- [x] T017 [P] [US2] Smoke test `LoadingOverlay` trong `src/__tests__/component/LoadingOverlay.test.tsx`.

**Checkpoint**: US2 độc lập.

---

## Phase 5: User Story 3 - Settings (Priority: P2)

**Goal**: Đổi vùng/năm, privacy copy, reset defaults; persist AsyncStorage.

**Independent Test**: Đổi preference → remount → giá trị giữ; không field PII.

- [x] T018 [US3] Implement màn `app/(tabs)/settings.tsx` (chọn vùng, năm thuế, đặt lại, mục Quyền riêng tư / Giới thiệu / Disclaimer).
- [x] T019 [US3] Wire Settings tới `usePreferences`; xác nhận không có input CCCD/MST/sổ BHXH.

**Checkpoint**: US3 độc lập.

---

## Phase 6: User Story 4 - UI/UX Consistency & NFR Polish (Priority: P2)

**Goal**: Checklist design-system + a11y labels tiếng Việt + layout responsive padding.

- [x] T020 [P] [US4] Gắn `accessibilityLabel` / roles tiếng Việt cho tab, nút chính, splash, loading.
- [x] T021 [US4] Rà soát no `shadow*`/`elevation`; max-width nội dung trên web/tablet trong layout.
- [x] T022 [P] [US4] Cập nhật `specs/README.md` thêm hàng 009; đảm bảo `npm test` pass.

---

## Phase 7: Polish

- [x] T023 Chạy theo `quickstart.md` (smoke thủ công checklist trong notes) và sửa lỗi blocker.
- [x] T024 Đánh dấu toàn bộ task `[X]` khi hoàn tất.

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → US4 → Polish
- Trong Phase 2: T005 trước T008; T006 trước T007/T008
- US2/US3 có thể song song sau US1 nếu staffing cho phép; mặc định tuần tự

## Implementation Strategy

1. Setup Expo + tokens + preferences (MVP foundation)
2. Splash + tabs (US1) — demo được
3. Loading (US2) + Settings (US3)
4. A11y / design polish (US4)
