# Feature Specification: App Shell. Splash, Loading, Settings, Layout & UI/UX NFR

**Status**: Implemented

**Input**: User description: "implement the specification for splash screen, loading screen, settings, application layout, … UI/UX, non functional requirement"

**Tham chiếu**: `docs/product/design-system.md`, `docs/product/scope.md`, Constitution V–VI, ADR 0004 (offline)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mở app qua splash tới khung ứng dụng (Priority: P1)

Minh mở KSalaryInsights lần đầu trong ngày. Anh thấy màn splash ngắn (thương hiệu + Ngài Miu), rồi vào khung ứng dụng có điều hướng rõ ràng tới các công cụ tính và Cài đặt. không bị kẹt, không cần mạng.

**Why this priority**: Cửa vào sản phẩm; mọi tính năng 001–008 phụ thuộc khung điều hướng ổn định.

**Independent Test**: Cold start → splash → home/layout; kiểm tra điều hướng tới ít nhất một màn placeholder tính lương và màn Cài đặt.

**Acceptance Scenarios**:

1. **Given** app vừa được mở (cold start), **When** splash kết thúc (tối đa ~2 giây hoặc khi sẵn sàng điều hướng. lấy cái dài hơn nhưng không vượt 3 giây trên thiết bị trung bình), **Then** người dùng thấy khung ứng dụng chính với thương hiệu nhận diện được và lối vào Cài đặt.
2. **Given** đang ở khung chính, **When** chọn mục điều hướng tới công cụ tính lương (hoặc placeholder nếu engine chưa gắn), **Then** nội dung chính đổi đúng màn; thanh/điều hướng vẫn hiện.
3. **Given** không có mạng, **When** mở app, **Then** splash và khung chính vẫn hoạt động bình thường (không hiện lỗi kết nối bắt buộc).

---

### User Story 2 - Loading khi đang xử lý (Priority: P1)

Khi hệ thống đang tải cấu hình cục bộ hoặc xử lý thao tác dài hơn phản hồi tức thì, Minh thấy trạng thái loading rõ ràng (không phải màn trắng) và có thể hiểu app chưa bị treo.

**Why this priority**: Tránh cảm giác “đơ”; chuẩn trải nghiệm cho mọi màn tính toán sau này.

**Independent Test**: Kích hoạt trạng thái loading có kiểm soát → thấy chỉ báo + (tuỳ ngữ cảnh) Ngài Miu pose phù hợp; kết thúc loading → nội dung hiện lại.

**Acceptance Scenarios**:

1. **Given** một thao tác đang chờ (vd. khởi tạo preferences / chuyển màn nặng), **When** thời gian chờ vượt ngưỡng cảm nhận tức thì (~150ms), **Then** hiển thị loading overlay hoặc inline theo ngữ cảnh. không chặn vô hạn không thông báo.
2. **Given** loading đang hiện, **When** thao tác hoàn tất, **Then** loading biến mất trong ≤300ms và nội dung kết quả/màn đích hiện ra.
3. **Given** loading toàn màn, **When** quan sát, **Then** không dùng bóng đổ/Material ripple; motion ngắn snappy theo design system; không animation lặp vô hạn gây xao nhãng.

---

### User Story 3 - Cài đặt ứng dụng (Priority: P2)

Minh mở Cài đặt để chọn vùng LTTV mặc định, năm thuế mặc định, và xem thông tin về quyền riêng tư / disclaimer. thay đổi được lưu cục bộ và áp dụng lần mở sau.

**Why this priority**: Giảm nhập lại tham số lặp; minh bạch privacy (Constitution V).

**Independent Test**: Đổi preference → đóng app (hoặc remount) → mở lại → giá trị còn giữ; không có trường yêu cầu CCCD/MST/sổ BHXH.

**Acceptance Scenarios**:

1. **Given** đang ở Cài đặt, **When** chọn vùng mặc định (I–IV) và năm thuế mặc định (trong các năm có ruleset), **Then** lựa chọn được lưu cục bộ trên thiết bị.
2. **Given** đã lưu preference, **When** mở lại app và vào công cụ tính (hoặc đọc store preference), **Then** vùng/năm mặc định khớp lựa chọn đã lưu.
3. **Given** màn Cài đặt, **When** xem mục Quyền riêng tư / Giới thiệu, **Then** thấy tuyên bố: tính toán cục bộ, không yêu cầu CCCD/MST/sổ BHXH, kết quả chỉ mang tính ước tính. không có form thu thập PII.
4. **Given** Cài đặt, **When** bấm “Đặt lại về mặc định”, **Then** vùng/năm (và các preference trong phạm vi feature này) trở về giá trị mặc định hệ thống và được lưu.

---

### User Story 4 - Layout & UI/UX nhất quán Flat Design + Ngài Miu (Priority: P2)

Trên điện thoại và tablet/web hẹp–rộng, khung app dùng token màu/typography/spacing của design system; Ngài Miu chỉ xuất hiện đúng ngữ cảnh (splash, empty/loading nhẹ, disclaimer). không che số liệu kết quả.

**Why this priority**: Nhận diện thương hiệu và tin cậy; ràng buộc mọi màn sau này.

**Independent Test**: Soát visual checklist design-system trên splash, home, settings, loading; resize/orientation không làm mất điều hướng chính.

**Acceptance Scenarios**:

1. **Given** bất kỳ màn thuộc feature này, **When** soi màu chữ/nền chính, **Then** dùng palette token (background/foreground/primary/secondary/accent/muted). không shadow/elevation.
2. **Given** splash hoặc empty/loading nhẹ, **When** hiện mascot, **Then** dùng pose phù hợp (chào / ngơ ngác) theo design-system; không animation vô hạn.
3. **Given** viewport hẹp (điện thoại) và rộng hơn (tablet/web), **When** dùng app, **Then** nội dung có padding ngang hợp lý; điều hướng chính vẫn Reachable bằng một tay trên điện thoại (mục chính không bị cắt).

---

### Edge Cases

- Splash bị bỏ qua nếu app resume từ nền (warm start) trong cùng phiên. không bắt xem splash lại mỗi lần chuyển tab.
- Preference lưu lỗi (storage đầy/hỏng): giữ mặc định hệ thống, báo nhẹ trong Cài đặt, không crash.
- Người dùng đổi orientation giữa splash/loading: không mất trạng thái điều hướng đích.
- Font chưa kịp load: fallback hệ thống, vẫn đọc được chữ tiếng Việt.
- Không có mạng khi mở Cài đặt / Giới thiệu: vẫn xem được nội dung tĩnh đã bundle.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hiển thị màn splash khi cold start, gồm nhận diện thương hiệu KSalaryInsights và Ngài Miu (pose chào), rồi chuyển vào khung ứng dụng chính.
- **FR-002**: Splash MUST hoàn tất và nhường chỗ cho khung chính trong thời gian hợp lý (mục tiêu ≤3 giây cold start tới UI tương tác trên thiết bị trung bình); warm start MUST NOT bắt buộc xem lại splash đầy đủ.
- **FR-003**: Hệ thống MUST cung cấp khung layout ứng dụng với vùng nội dung chính và điều hướng tới: (a) công cụ tính lương / home, (b) Cài đặt; có thể mở rộng thêm mục sau mà không phá layout.
- **FR-004**: Hệ thống MUST hiển thị trạng thái loading (toàn màn hoặc theo vùng) khi thao tác kéo dài hơn phản hồi tức thì; loading MUST kết thúc khi thao tác xong hoặc lỗi được báo.
- **FR-005**: Hệ thống MUST cung cấp màn Cài đặt cho phép đặt: vùng LTTV mặc định (I–IV), năm thuế mặc định (các năm có ruleset), và xem mục Quyền riêng tư / Giới thiệu / Disclaimer ước tính.
- **FR-006**: Preference Cài đặt MUST được lưu cục bộ trên thiết bị và khôi phục ở lần mở sau.
- **FR-007**: Hệ thống MUST cho phép đặt lại preference về mặc định từ Cài đặt.
- **FR-008**: Hệ thống MUST NOT yêu cầu hoặc thu thập CCCD, MST, số sổ BHXH, hay thông tin ngân hàng ở bất kỳ màn thuộc feature này.
- **FR-009**: Toàn bộ UI thuộc feature này MUST tuân `docs/product/design-system.md` (Flat Design, token, motion snappy, không shadow).
- **FR-010**: Ngài Miu MUST chỉ xuất hiện theo bảng usage design-system (splash/onboarding, empty/loading nhẹ, disclaimer). MUST NOT che hoặc chen giữa các dòng số liệu kết quả tính toán.
- **FR-011**: Ngôn ngữ giao diện mặc định MUST là tiếng Việt.
- **FR-012**: Khung ứng dụng và Cài đặt MUST hoạt động offline với nội dung đã bundle (không phụ thuộc API mạng để vào app).

### Non-Functional Requirements

- **NFR-001 Performance**: Cold start tới UI tương tác ≤3 giây trên thiết bị trung bình; chuyển tab/màn trong khung ≤300ms cảm nhận được; loading indicator xuất hiện nếu chờ >~150ms.
- **NFR-002 Offline**: 100% luồng splash → layout → settings không cần mạng (khớp ADR 0004 / Constitution V về tính toán cục bộ).
- **NFR-003 Accessibility**: Touch target tối thiểu 44×44; tương phản chữ/nền đạt WCAG AA với cặp màu token chính; trạng thái pressed/focus rõ (viền solid, không glow); nhãn điều hướng và Cài đặt đọc được bởi trình đọc màn hình (accessibilityLabel tiếng Việt).
- **NFR-004 Privacy**: Không gửi preference hay dữ liệu người dùng lên máy chủ trong phạm vi feature này; lưu trữ chỉ cục bộ.
- **NFR-005 Reliability**: Lỗi đọc/ghi preference không làm crash app; fallback về mặc định.
- **NFR-006 Consistency**: Spacing bội số 4; radius 6–8px; motion tương tác ~200ms, chuyển màn ~300ms; font Outfit với fallback hệ thống.
- **NFR-007 Responsiveness**: Layout dùng được trên điện thoại portrait; trên viewport rộng hơn, nội dung không kéo full-bleed vô hạn. giới hạn bề rộng đọc được (theo design-system max container).

### Key Entities

- **AppPreferences**: vùng LTTV mặc định, năm thuế mặc định, cờ đã xem splash phiên hiện tại (nếu cần), phiên bản schema preference.
- **NavigationDestination**: định danh màn đích trong khung (home/calculator, settings, …).
- **UiThemeTokens**: bộ token màu/typography/spacing dùng chung (ánh xạ design-system). một nguồn sự thật cho UI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trên checklist thủ công cold start, 100% lần thử cho thấy splash rồi khung chính trong ≤3 giây (thiết bị trung bình / simulator tương đương).
- **SC-002**: 100% preference (vùng, năm thuế) giữ được sau khi đóng và mở lại app trong kiểm thử thủ công hoặc integration.
- **SC-003**: 0 trường nhập PII (CCCD/MST/sổ BHXH) trên splash, layout, loading, settings.
- **SC-004**: Checklist design-system (no shadow, token màu, touch ≥44, mascot đúng ngữ cảnh) pass trên 4 màn: splash, home/layout, loading, settings.
- **SC-005**: Luồng splash → home → settings → đổi preference hoàn tất offline (chế độ máy bay) trong kiểm thử thủ công.
- **SC-006**: Người dùng mới hoàn thành “mở app và tìm được Cài đặt” trong ≤30 giây không hướng dẫn thêm.

## Assumptions

- Feature này là **nền tảng UI shell** cho MVP; màn tính lương chi tiết thuộc spec 001: ở đây chỉ cần điểm gắn (route/placeholder) ổn định.
- Năm thuế mặc định hệ thống = năm hiện tại nếu có ruleset; không thì năm ruleset mới nhất đã bundle.
- Vùng mặc định hệ thống = Vùng I (có thể đổi trong Cài đặt).
- Không gồm: đăng nhập tài khoản, đồng bộ đám mây, theme tối, đa ngôn ngữ (Anh/…), remote config ruleset (F019), onboarding wizard nhiều bước đầy đủ (chỉ splash ngắn + mascot chào).
- Asset Ngài Miu v1 có thể là placeholder vector phẳng đạt style guide nếu bộ pose cuối chưa sẵn; MUST không dùng ảnh tả thực/gradient.
- “Thiết bị trung bình” cho SC/NFR: điện thoại tầm trung 2–3 năm tuổi hoặc simulator tương đương khi đo cold start.
