# Design System. KVSalaryTools

**Cập nhật**: 2026-08-05 
**Phạm vi**: Toàn bộ UI React Native / Expo. Mọi spec tính năng tham chiếu tài liệu này.

## 1. Triết lý thiết kế

**Glassmorphism có chủ đích (spec 010) + Flat cho số liệu**:

- **Chrome = kính mờ**: tab bar, sticky CTA, hub cards, tip panels, modal sheets. `GlassSurface` (blur + tint + viền sáng).
- **Nội dung số = đặc**: ResultHero, breakdown, input. nền opaque; không đặt chữ dài trên kính trần.
- **Màu vẫn là cấu trúc**: pastel sky canvas + blob trang trí để kính có gì để khúc xạ.
- **Typography là giao diện**: Plus Jakarta Sans; số tiền tabular ExtraBold trên khối đặc.
- **Phản hồi tương tác**: scale + đổi opacity. không shadow.
- **A11y**: Reduce Transparency → solid fallback.

Chi tiết vật liệu: [`specs/010-glassmorphism-ui/spec.md`](././specs/010-glassmorphism-ui/spec.md).

Phù hợp app thuế: **rõ ràng, đáng tin**. kính chỉ cho chrome; breakdown vẫn minh bạch (Constitution III).

## 2. Design tokens

### 2.1. Màu (một palette, light mode). **v3 Pastel Sky · Soft Cobalt · Soft Mint**

| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `background` | `#F7FAFF` (soft sky) | Nền canvas pastel |
| `foreground` | `#243B53` (soft navy ink) | Chữ, tương phản cao |
| `foregroundMuted` | `#7B8FA6` | Chữ phụ |
| `primary` | `#4F84E0` (soft cobalt) | Hành động chính (nút Tính, CTA) |
| `primaryPressed` | `#3A6BC4` | Pressed CTA |
| `secondary` | `#5AAE9B` (soft mint) | Kết quả net, số dương/hoàn thuế |
| `accent` | `#E09B6A` (soft peach) | Highlight/badge (cảnh báo nhẹ, nhắc hạn) |
| `muted` | `#EEF3F9` | Nền khối phụ |
| `white` | `#FFFFFF` | Khối nội dung nổi trên canvas |
| `border` | `#D8E2EF` | Dùng tiết kiệm |
| `danger` | `#D45B5B` | Lỗi nhập (không dùng cho khoản trừ thuế) |

Quy ước ngữ nghĩa cho domain: tiền **hoàn/net/quyền lợi** dùng `secondary`; **phải nộp thêm/trừ** dùng `foreground` (không dùng đỏ gắt trừ trạng thái lỗi); **nhắc hạn mùa vụ** dùng `accent`.

> ADR: [`docs/decisions/0006-pastel-raster-mascot.md`](./decisions/0006-pastel-raster-mascot.md) (supersedes hard cobalt look from 0005 for surfaces)

### 2.2. Typography

- **Font**: `Plus Jakarta Sans` (humanist sans, fintech-friendly). Expo: `@expo-google-fonts/plus-jakarta-sans`. Hỗ trợ tiếng Việt đầy đủ; fallback hệ thống khi chưa load.
- **Scale tokens** (`typography.scale`): `display` 32 / `title` 28 / `subtitle` 18 / `body` 15 / `label` 13 / `caption` 12 / `moneyLg` 28 / `moneyMd` 18 / `moneySm` 14.
- **Heading**: Bold 700 / ExtraBold 800, letter-spacing `-0.02em`.
- **Body**: Regular 400.
- **Label/Button**: Medium 500 / SemiBold 600; label thường UPPERCASE + tracking rộng.
- **Số tiền** (đặc thù app): tabular nums (`fontVariant: ['tabular-nums']`) để breakdown thẳng cột; số kết quả chính cỡ lớn ExtraBold (`moneyLg`).

### 2.3. Bo góc & viền

- Radius: **6px** (md) hoặc **8px** (lg), nhất quán; pill chỉ dành cho tag.
- Viền: mặc định **0**. dùng khối màu định biên. Khi cần (input focus): viền solid **2px**.

### 2.4. Bóng & hiệu ứng

- **Drop shadow: KHÔNG.** (RN: không `elevation` trang trí, không `shadowColor` trên card nội dung.)
- **Glass blur**: chỉ qua `GlassSurface` / tab `BlurView`. intensity 16–20; tối đa 2–3 lớp blur/màn.
- Gradient: chỉ blob trang trí nền; không trên nút primary.
- Fallback: Reduce Transparency / web → fill đặc `#FFFFFF`.

### 2.5. Glass tokens

Xem `glass` trong `src/theme/tokens.ts` và bảng vật liệu trong spec 010.

## 3. Component

### 3.1. Nút

| Loại | Style | Trạng thái nhấn (mobile. thay cho hover) |
|------|-------|--------------------------------------------|
| Primary | Nền `primary`, chữ trắng, radius md, cao **56–64px** (touch target) | Pressed: nền đậm hơn (Blue 600) + scale 0.97 |
| Secondary | Nền `muted`, chữ đậm | Pressed: Gray 200 + scale 0.97 |
| Outline | Viền solid **4px** màu chủ đạo, nền trong suốt, chữ cùng màu viền | Pressed: fill màu viền, chữ trắng |

Transition 200ms, dùng `Pressable` + Reanimated; không ripple Android mặc định (đè bằng pressed style riêng để nhất quán).

### 3.2. Card. "Color Block" + Glass chrome

- **Solid ColorBlock** (mặc định): nền màu đặc. forms, breakdown. Không shadow. Padding rộng. Radius lg.
- **Glass opt-in** (`ColorBlock glass` / `GlassSurface`): chỉ chrome & hub. không dùng cho form / ResultHero.
- Pressed (card bấm được): scale 0.98 + giảm opacity nhẹ.
- **Card breakdown**: hàng solid; dòng Net = ResultHero mint/cobalt opaque.

### 3.3. Input

- Thường: nền `muted`, không viền, chữ Gray 900, radius md.
- Focus: nền trắng + viền 2px `primary`. Không glow.
- Input số tiền: bàn phím số, tự format ngăn cách hàng nghìn, tabular nums.

### 3.4. Section

- Nền xen kẽ: trắng ↔ Gray 100 ↔ khối màu đậm (Blue/Emerald/Amber). chuyển sắc nét.
- Không kẻ phân cách mảnh; dùng whitespace hoặc khối màu. Ngoại lệ: danh sách FAQ/điều kiện dùng viền 2px giữa các mục.

## 4. Iconography

- **PNG monochrome** trong `assets/icons/`. dùng `AppIcon` + `tintColor`. Không emoji, không icon font/SVG trong nội dung UI.
- Tái tạo bộ icon: `node scripts/generate-ui-icons.mjs`.
- Thường đặt trong hình tròn màu đặc (56–64px) trên hub card.
- Animation: scale 1.08 tab active; đổi cường độ màu.

## 5. Layout & Motion

- Container: full-width mobile, padding ngang 16–24px; màn tablet/web giới hạn `max-w-7xl`.
- Grid cứng, khoảng cách bội số 4. Mật độ trung bình, "functional".
- Motion: "digital, snappy". 200ms cho tương tác, 300ms cho chuyển đổi lớn. Số kết quả có thể count-up ngắn (≤400ms), không animation lê thê.

## 6. Accessibility

- Focus/pressed state tương phản cao (viền solid 2px, không glow).
- Touch target tối thiểu 44×44.
- Số tiền: `moneyAccessibilityLabel` / `numberToVietnameseWords`. screen reader đọc dạng đầy đủ ("hai mươi sáu triệu… đồng").

### 6.1. WCAG AA contrast matrix (palette v2 Ink · Cobalt · Mint)

Ratios approximate relative luminance (WCAG 2.1). **Pass** = ≥4.5:1 normal text, ≥3:1 large/bold UI text & icons.

| Foreground | Background | Role | ≈ ratio | AA |
|------------|------------|------|---------|----|
| `#FFFFFF` | `#1D4ED8` primary | CTA label | ~5.9 | Pass |
| `#FFFFFF` | `#1E3A8A` primaryPressed | CTA pressed | ~9.5 | Pass |
| `#FFFFFF` | `#0F766E` secondary / resultPositive | Net hero | ~5.4 | Pass |
| `#0F172A` | `#FFFFFF` background | Body | ~16.1 | Pass |
| `#0F172A` | `#F1F5F9` muted | Body on muted | ~14.0 | Pass |
| `#0F172A` | `#EFF6FF` primarySoft | Body on soft | ~14.8 | Pass |
| `#0F172A` | `#F0FDFA` secondarySoft | Body on soft | ~15.2 | Pass |
| `#0F172A` | `#FFFBEB` accentSoft | Body on soft | ~15.6 | Pass |
| `#64748B` muted text | `#FFFFFF` | Secondary copy | ~4.6 | Pass |
| `#B45309` accent | `#FFFBEB` accentSoft | Seasonal CTA | ~4.7 | Pass |
| `#B91C1C` danger | `#FEF2F2` dangerSoft | Error title | ~5.9 | Pass |
| `#B91C1C` danger | `#FFFFFF` | Error on white | ~6.5 | Pass |

**Do not** put muted `#64748B` on soft tint fills for critical labels. keep critical labels on `foreground` / white on solid fills.

## 7. "The Bold Factor". chống generic

- Tránh: card nổi kiểu Material, layout Bootstrap, pastel tràn lan.
- Nhấn: nhìn như **poster phẳng**. khối màu đậm cho hero/kết quả, số liệu đa màu accent, hình học trang trí lớn, typography đậm tương phản mạnh, viền dày cho outline.

## 8. Linh vật (Mascot). "Ngài Miu"

### 8.1. Nhân dạng

| Thuộc tính | Đặc tả |
|-----------|--------|
| Loài | Mèo tuxedo **đen–trắng** (lông đen, ức + mõm + bàn chân trắng. như mặc sẵn áo đuôi tôm) |
| Tuổi | **Trung niên**. dáng đậm người một chút, điềm đạm, không phải mèo con dễ thương kiểu trẻ em |
| Kính | **Đeo kính** gọng tròn, đơn giản (không monocle). biểu tượng "người xem sổ sách" |
| Khí chất | **Bá tước (Earl)**. quý tộc kiểu cũ: chỉn chu, lịch lãm, đáng tin; phụ kiện tối giản: nơ cổ (bow tie) hoặc cà vạt nhỏ. Không đội mũ, không gậy. tránh rườm rà |
| Tên làm việc | **"Ngài Miu"** (danh xưng: Bá tước Miu). có thể đổi khi làm branding chính thức |

### 8.2. Tính cách & giọng nói (voice)

- Chuyên gia thuế đáng tin nhưng **không lên lớp**: giải thích ngắn, chính xác, thỉnh thoảng dí dỏm kiểu khô (dry humor). không bao giờ đùa trên kết quả tính.
- Xưng hô: "tôi". gọi người dùng là "bạn". Câu ngắn. Luôn dẫn nguồn khi nói về luật (đúng Constitution I).
- Ngài Miu là **người dẫn chuyện của breakdown và disclaimer**. không phải sticker trang trí.

### 8.3. Style hình ảnh (bắt buộc khớp design system)

- **Raster cartoon (PNG/WebP)**. cute cel-shaded illustration, not geometric SVG. Avoid “flat SVG mascot” look that reads as generic AI chrome.
- Giữ nhận diện: mèo tuxedo, kính gọng tròn xanh soft-cobalt, nơ amber/peach; nền pose có thể pastel sky/mint.
- Chrome UI (tab, chevron, hub glyph) dùng **PNG monochrome** trong `assets/icons/` qua `AppIcon`. không emoji, không Lucide SVG. Chạy `node scripts/generate-ui-icons.mjs` để tái tạo bộ icon.
- Bộ pose (`assets/mascot/`): wave, tip, point, confused/empty, bow, docs, icon, splash.
- Xuất hiện bắt buộc: app icon, splash, onboarding, About Us (Cài đặt), tip rows, seasonal reminder.

### 8.4. Vị trí xuất hiện (usage)

| Ngữ cảnh | Dùng | Pose |
|----------|------|------|
| Onboarding / lần đầu mở app | Có. giới thiệu 3 bước | ① |
| Tooltip "vì sao bị trừ khoản này" trong breakdown | Có. icon nhỏ mở giải thích | ② ③ |
| Disclaimer & nguồn pháp lý | Có. Ngài Miu là người phát ngôn disclaimer | ③ |
| Empty state (chưa có kịch bản lưu) | Có | ⑤ |
| Nhắc hạn mùa vụ (quyết toán T3–T4, thưởng Tết T12) | Có. notification + banner | ④ |
| **Màn hình kết quả / con số** | **Không che, không chen giữa các dòng số**. tối đa 1 icon nhỏ ở tooltip |
| Màn hình cảnh báo nghiêm trọng (BHXH một lần) | Không dùng nét dí dỏm; chỉ pose nghiêm ③ |

### 8.5. Điều cấm

- Không animation lặp vô hạn gây xao nhãng; motion của mascot theo chuẩn mục 5 (ngắn, snappy).
- Không dùng mascot để làm mềm thông tin pháp lý sai lệch hoặc thay thế trích dẫn nguồn.
- Không đổi màu lông theo theme/mùa (giữ nhận diện đen–trắng).

## 9. Ship checklist

Trước submit store: [design-qa-checklist.md](./design-qa-checklist.md) + [store/README.md](./store/README.md).

Token code: `src/theme/tokens.ts` · Copy voice: `src/copy/miu.ts` · Assets: `assets/mascot/`, `assets/images/`.
