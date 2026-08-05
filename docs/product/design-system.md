# Design System — KVSalaryTools

**Cập nhật**: 2026-07-31  
**Nguồn**: [`docs/design_prompt.xml`](../design_prompt.xml) (design system "Flat Design" gốc, viết cho web/Tailwind) — tài liệu này là bản chuyển thể chính thức cho **React Native / Expo**, có bổ sung **linh vật (mascot)**.  
**Phạm vi**: Toàn bộ UI của app. Mọi spec tính năng (001–008) khi sang giai đoạn `/speckit-plan` MUST tham chiếu tài liệu này.

## 1. Triết lý thiết kế

**Flat Design — giản lược có chủ đích**:

- **Không chiều sâu giả**: không drop shadow, không bevel, không gradient tả thực, không texture. Trục Z không tồn tại.
- **Màu là cấu trúc**: khối màu nền phân định khu vực và nhóm nội dung, không dùng đường kẻ hay bóng đổ. Chuyển màu sắc nét, không blur.
- **Typography là giao diện**: cỡ chữ và độ đậm gánh toàn bộ hệ phân cấp.
- **Hình học thuần khiết**: chữ nhật, tròn, vuông; bo góc vừa phải và nhất quán; không blob hữu cơ.
- **Phản hồi tương tác**: đổi màu + scale tức thời — không bao giờ bằng độ sâu bóng.
- **Trang trí chiến lược**: hình học lớn, opacity thấp ở nền — cảm giác poster.

Phù hợp đặc thù sản phẩm: app tính thuế cần **rõ ràng, đáng tin, không màu mè** — flat design với hierarchy mạnh phục vụ đúng nguyên tắc breakdown minh bạch (Constitution III).

## 2. Design tokens

### 2.1. Màu (một palette, light mode) — **v2 Ink · Cobalt · Mint**

| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `background` | `#FFFFFF` | Nền chính |
| `foreground` | `#0F172A` (Ink) | Chữ, tương phản cao |
| `foregroundMuted` | `#64748B` | Chữ phụ |
| `primary` | `#1D4ED8` (Cobalt) | Hành động chính (nút Tính, CTA) |
| `primaryPressed` | `#1E3A8A` | Pressed CTA |
| `secondary` | `#0F766E` (Mint) | Kết quả net, số dương/hoàn thuế |
| `accent` | `#B45309` (Amber) | Highlight/badge (cảnh báo nhẹ, nhắc hạn) |
| `muted` | `#F1F5F9` | Nền khối phụ, input |
| `border` | `#E2E8F0` | Dùng tiết kiệm |
| `danger` | `#B91C1C` | Lỗi nhập (không dùng cho khoản trừ thuế) |

Quy ước ngữ nghĩa cho domain: tiền **hoàn/net/quyền lợi** dùng `secondary`; **phải nộp thêm/trừ** dùng `foreground` (không dùng đỏ gắt trừ trạng thái lỗi); **nhắc hạn mùa vụ** dùng `accent`.

> ADR: [`docs/decisions/0005-palette-v2-ink-cobalt-mint.md`](../decisions/0005-palette-v2-ink-cobalt-mint.md)

### 2.2. Typography

- **Font**: `Outfit` (geometric sans) — Expo: `@expo-google-fonts/outfit`. Fallback hệ thống khi chưa load.
- **Scale tokens** (`typography.scale`): `display` 32 / `title` 28 / `subtitle` 18 / `body` 15 / `label` 13 / `caption` 12 / `moneyLg` 28 / `moneyMd` 18 / `moneySm` 14.
- **Heading**: Bold 700 / ExtraBold 800, letter-spacing `-0.02em`.
- **Body**: Regular 400.
- **Label/Button**: Medium 500 / SemiBold 600; label thường UPPERCASE + tracking rộng.
- **Số tiền** (đặc thù app): tabular nums (`fontVariant: ['tabular-nums']`) để breakdown thẳng cột; số kết quả chính cỡ lớn ExtraBold (`moneyLg`).

### 2.3. Bo góc & viền

- Radius: **6px** (md) hoặc **8px** (lg), nhất quán; pill chỉ dành cho tag.
- Viền: mặc định **0** — dùng khối màu định biên. Khi cần (input focus): viền solid **2px**.

### 2.4. Bóng & hiệu ứng

- **Shadow: KHÔNG — tuyệt đối.** (RN: không `elevation`, không `shadowColor`.)
- Gradient: chỉ dùng làm trang trí nền theo hướng (`muted → transparent`); không bao giờ trên nút/card; không gradient rực rỡ.
- Blur: không.
- Trang trí nền: hình tròn/vuông xoay lớn, opacity thấp, đặt tuyệt đối.

## 3. Component

### 3.1. Nút

| Loại | Style | Trạng thái nhấn (mobile — thay cho hover) |
|------|-------|--------------------------------------------|
| Primary | Nền `primary`, chữ trắng, radius md, cao **56–64px** (touch target) | Pressed: nền đậm hơn (Blue 600) + scale 0.97 |
| Secondary | Nền `muted`, chữ đậm | Pressed: Gray 200 + scale 0.97 |
| Outline | Viền solid **4px** màu chủ đạo, nền trong suốt, chữ cùng màu viền | Pressed: fill màu viền, chữ trắng |

Transition 200ms, dùng `Pressable` + Reanimated; không ripple Android mặc định (đè bằng pressed style riêng để nhất quán).

### 3.2. Card — "Color Block"

- Nền màu đặc: trắng trên trang xám, hoặc tint nhạt (`blue-50`, `green-50`) cho feature. Không shadow, không viền. Padding rộng (24–32px). Radius lg.
- Pressed (card bấm được): scale 1.02 → dùng scale 0.98 khi nhấn trên mobile + tăng đậm màu nền.
- **Card breakdown** (đặc thù): mỗi bước tính (gross → BH → TNTT → thuế → net) là một hàng trong card khối màu; dòng kết quả cuối dùng khối `primary` hoặc `secondary` chữ trắng.

### 3.3. Input

- Thường: nền `muted`, không viền, chữ Gray 900, radius md.
- Focus: nền trắng + viền 2px `primary`. Không glow.
- Input số tiền: bàn phím số, tự format ngăn cách hàng nghìn, tabular nums.

### 3.4. Section

- Nền xen kẽ: trắng ↔ Gray 100 ↔ khối màu đậm (Blue/Emerald/Amber) — chuyển sắc nét.
- Không kẻ phân cách mảnh; dùng whitespace hoặc khối màu. Ngoại lệ: danh sách FAQ/điều kiện dùng viền 2px giữa các mục.

## 4. Iconography

- Thư viện: `lucide-react-native` (tương đương `lucide-react` bản gốc).
- Stroke 2–2.5px. Thường đặt trong hình tròn màu đặc (56–64px).
- Animation: scale 1.1 trong card khi active; đổi cường độ màu.

## 5. Layout & Motion

- Container: full-width mobile, padding ngang 16–24px; màn tablet/web giới hạn `max-w-7xl`.
- Grid cứng, khoảng cách bội số 4. Mật độ trung bình, "functional".
- Motion: "digital, snappy" — 200ms cho tương tác, 300ms cho chuyển đổi lớn. Số kết quả có thể count-up ngắn (≤400ms), không animation lê thê.

## 6. Accessibility

- Focus/pressed state tương phản cao (viền solid 2px, không glow).
- Touch target tối thiểu 44×44.
- Số tiền: `moneyAccessibilityLabel` / `numberToVietnameseWords` — screen reader đọc dạng đầy đủ ("hai mươi sáu triệu… đồng").

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

**Do not** put muted `#64748B` on soft tint fills for critical labels — keep critical labels on `foreground` / white on solid fills.

## 7. "The Bold Factor" — chống generic

- Tránh: card nổi kiểu Material, layout Bootstrap, pastel tràn lan.
- Nhấn: nhìn như **poster phẳng** — khối màu đậm cho hero/kết quả, số liệu đa màu accent, hình học trang trí lớn, typography đậm tương phản mạnh, viền dày cho outline.

## 8. Linh vật (Mascot) — "Ngài Miu" 🐈‍⬛

### 8.1. Nhân dạng

| Thuộc tính | Đặc tả |
|-----------|--------|
| Loài | Mèo tuxedo **đen–trắng** (lông đen, ức + mõm + bàn chân trắng — như mặc sẵn áo đuôi tôm) |
| Tuổi | **Trung niên** — dáng đậm người một chút, điềm đạm, không phải mèo con dễ thương kiểu trẻ em |
| Kính | **Đeo kính** gọng tròn, đơn giản (không monocle) — biểu tượng "người xem sổ sách" |
| Khí chất | **Bá tước (Earl)** — quý tộc kiểu cũ: chỉn chu, lịch lãm, đáng tin; phụ kiện tối giản: nơ cổ (bow tie) hoặc cà vạt nhỏ. Không đội mũ, không gậy — tránh rườm rà |
| Tên làm việc | **"Ngài Miu"** (danh xưng: Bá tước Miu) — có thể đổi khi làm branding chính thức |

### 8.2. Tính cách & giọng nói (voice)

- Chuyên gia thuế đáng tin nhưng **không lên lớp**: giải thích ngắn, chính xác, thỉnh thoảng dí dỏm kiểu khô (dry humor) — không bao giờ đùa trên kết quả tính.
- Xưng hô: "tôi" — gọi người dùng là "bạn". Câu ngắn. Luôn dẫn nguồn khi nói về luật (đúng Constitution I).
- Ngài Miu là **người dẫn chuyện của breakdown và disclaimer** — không phải sticker trang trí.

### 8.3. Style hình ảnh (bắt buộc khớp design system)

- **Flat vector, hình học**: dựng từ hình tròn/oval/chữ nhật bo góc; **không** gradient, **không** đổ bóng, **không** outline mảnh kiểu hand-drawn; nét đồng bộ stroke icon (2–2.5px) nếu có nét.
- Palette: chỉ dùng token — đen `#111827` (không đen thuần), trắng `#FFFFFF`, kính + phụ kiện được dùng `primary`/`accent`; má hồng nhẹ dùng tint có sẵn.
- Tỷ lệ: đầu to vừa phải (khoảng 1:1,5 so với thân) — nghiêm túc hơn chibi, thân thiện hơn tả thực.
- Bộ pose tối thiểu (asset set v1): ① chào/vẫy (onboarding), ② chỉ tay vào bảng số (giải thích breakdown), ③ đẩy gọng kính (tips/lưu ý), ④ ôm hồ sơ (mùa quyết toán/nhắc hạn), ⑤ ngơ ngác nhẹ (empty state / lỗi nhập), ⑥ cúi chào (hoàn tất).

### 8.4. Vị trí xuất hiện (usage)

| Ngữ cảnh | Dùng | Pose |
|----------|------|------|
| Onboarding / lần đầu mở app | Có — giới thiệu 3 bước | ① |
| Tooltip "vì sao bị trừ khoản này" trong breakdown | Có — icon nhỏ mở giải thích | ② ③ |
| Disclaimer & nguồn pháp lý | Có — Ngài Miu là người phát ngôn disclaimer | ③ |
| Empty state (chưa có kịch bản lưu) | Có | ⑤ |
| Nhắc hạn mùa vụ (quyết toán T3–T4, thưởng Tết T12) | Có — notification + banner | ④ |
| **Màn hình kết quả / con số** | **Không che, không chen giữa các dòng số** — tối đa 1 icon nhỏ ở tooltip |
| Màn hình cảnh báo nghiêm trọng (BHXH một lần) | Không dùng nét dí dỏm; chỉ pose nghiêm ③ |

### 8.5. Điều cấm

- Không animation lặp vô hạn gây xao nhãng; motion của mascot theo chuẩn mục 5 (ngắn, snappy).
- Không dùng mascot để làm mềm thông tin pháp lý sai lệch hoặc thay thế trích dẫn nguồn.
- Không đổi màu lông theo theme/mùa (giữ nhận diện đen–trắng).

## 9. Việc tiếp theo (khi vào `/speckit-plan`)

1. Chốt tên chính thức cho mascot (ADR nhỏ nếu đổi "Ngài Miu").
2. Sinh bộ asset ⑥ pose (SVG flat, tối ưu cho `react-native-svg`).
3. Map token vào theme code (NativeWind/StyleSheet constants) — một nguồn token duy nhất.
4. Kiểm tra contrast AA cho các cặp màu chữ/nền thực tế.
