# Implementation Plan: 009-app-shell-ux

**Branch**: `009-app-shell-ux` | **Date**: 2026-08-05 | **Spec**: [specs/009-app-shell-ux/spec.md](./spec.md)

**Input**: Feature specification from `specs/009-app-shell-ux/spec.md`

## Summary

Khởi tạo khung ứng dụng Expo (React Native) cho KVSalaryTools: splash cold-start với thương hiệu + Ngài Miu, layout điều hướng (Home/Calculator placeholder + Settings), loading overlay/inline theo design system Flat Design, và preference cục bộ (vùng LTTV, năm thuế) — kèm NFR offline, WCAG AA, privacy, performance cold start ≤3s.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022  
**Framework**: React Native + Expo (SDK 52+) với Expo Router  
**Primary Dependencies**: `expo-router`, `expo-splash-screen`, `@expo-google-fonts/outfit`, `lucide-react-native`, `@react-native-async-storage/async-storage`, `react-native-reanimated` (motion snappy), `react-native-safe-area-context`, `react-native-svg` (mascot placeholder)  
**Storage**: AsyncStorage — key `kv.preferences.v1`  
**Testing**: Jest + React Native Testing Library (unit preference store; component smoke)  
**Target Platform**: iOS, Android, Web (Expo)  
**Project Type**: Mobile / cross-platform app (repo root single project)  
**Performance Goals**: Cold start → interactive ≤3s; tab/screen transition ≤300ms; show loading if wait >150ms  
**Constraints**: Offline 100% cho shell; no shadow/elevation; no PII fields; tiếng Việt UI; YAGNI — không auth, không dark mode, không i18n đa ngôn ngữ  
**Scale/Scope**: 4 bề mặt UI (splash, root layout/tabs, loading, settings) + theme tokens + preferences

## Constitution Check

| Điều khoản Constitution | Đạt | Ghi chú kỹ thuật |
|-------------------------|:---:|------------------|
| **I. Trích dẫn pháp lý** | N/A→PASS | Shell không tính thuế; màn Giới thiệu/Disclaimer ghi rõ kết quả sau này chỉ là ước tính. |
| **II. Tách công thức & tham số** | PASS | Preference chỉ lưu lựa chọn người dùng; không nhúng tham số luật. |
| **III. Breakdown** | N/A | Không hiển thị kết quả tính trong feature này. |
| **IV. Test case tính tay** | N/A | Không có TC domain; có unit test preference + smoke UI. |
| **V. Quyền riêng tư tối thiểu** | PASS | AsyncStorage cục bộ; không API; không field PII. |
| **VI. Spec trước, code sau** | PASS | Spec 009 + checklist PASS trước plan/implement. |

## Project Structure

### Documentation (this feature)

```text
specs/009-app-shell-ux/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── preferences-schema.json
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
app/                         # Expo Router file-based routes
├── _layout.tsx              # Root: fonts, splash gate, providers
├── index.tsx                # Redirect into (tabs)
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator: Home + Settings
│   ├── index.tsx            # Home / calculator placeholder
│   └── settings.tsx         # Settings screen
src/
├── theme/
│   └── tokens.ts            # Design-system tokens (single source)
├── components/
│   ├── common/              # Button, ColorBlock, Section
│   ├── loading/             # LoadingOverlay, InlineLoading
│   ├── mascot/              # NgaiMiuPlaceholder (SVG flat)
│   └── splash/              # SplashView
├── store/
│   └── preferences.ts       # load/save/reset AppPreferences
├── hooks/
│   └── usePreferences.ts
└── __tests__/
    ├── unit/preferences.test.ts
    └── component/LoadingOverlay.test.tsx
assets/                      # App icon / splash config assets (optional)
```

**Structure Decision**: Single Expo app at repo root (`app/` + `src/`), khớp hướng cấu trúc trong plan 001 nhưng tách rõ shell UI trước khi gắn engine.

## Complexity Tracking

> Không có vi phạm Constitution cần giải trình.
