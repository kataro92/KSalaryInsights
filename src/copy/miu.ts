/**
 * Ngài Miu voice — short, precise, first-person "tôi", never softens law.
 * @see docs/product/design-system.md §8.2
 */

export const brand = {
  name: 'KVSalaryTools',
  tagline: 'Ước tính lương · thuế · bảo hiểm',
  guideLine: 'Ngài Miu sẵn sàng hướng dẫn bạn',
} as const;

export const miuTips = {
  calculatorResult:
    'Tôi tách từng khoản trừ để bạn thấy rõ — số liệu không bị che.',
  bonusMonth:
    'Thưởng/OT chịu thuế trong tháng nhận — BH mặc định vẫn theo lương căn cứ, không cộng thưởng.',
  overtime:
    'OT 150/200/300% theo BLLĐ Đ.98 — tôi cộng vào Gross tháng; đêm chưa mô phỏng.',
  benefitsHub:
    'Chọn một mục bên dưới. Mỗi máy tính độc lập — không cộng vào lương Gross↔Net.',
  settlement:
    'Đối chiếu với bảng lương / chứng từ khấu trừ trước khi nộp — đây chỉ là ước tính.',
  filingWizard:
    'Không thu thập giấy tờ trong app — tôi chỉ gợi ý hướng nộp để bạn tự chuẩn bị.',
  maternity:
    'Tách chế độ tháng và trợ cấp một lần bên dưới — không cộng vào Gross↔Net.',
  sickLeave:
    'Trần năm theo năm đóng — nếu bị cắt, công thức ghi rõ bên dưới.',
  severance:
    'Đã trừ thời gian BHTN / đã chi trả trong công thức — xem breakdown bên dưới.',
  unemployment:
    'Trần 5×LTTV theo vùng — checklist điều kiện nằm dưới breakdown.',
  retirement:
    'Hai kịch bản chỉ để đối chiếu — tôi không khuyên rút hay giữ. Đọc checklist điều kiện bên dưới.',
  comparison:
    'Gross giữ nguyên — tôi chỉ đối chiếu Net và thuế giữa hai năm ruleset.',
  rent: 'GTGT và TNCN tách dòng bên dưới — ngưỡng miễn theo ruleset năm.',
  hkd: 'GTGT + TNCN theo nhóm ngành — nếu miễn tỷ lệ, vẫn cần kê khai doanh thu.',
  securities:
    'Tỷ lệ theo ngày giao dịch — đọc chú thích nếu ruleset ghi hiệu lực hạn chế.',
  esop: 'TLTC khấu trừ và thuế chuyển nhượng tách dòng — đọc ghi chú quyết toán nếu có.',
  casual:
    'Thực nhận nằm trong breakdown — miễn QT chỉ áp khi đủ điều kiện ở Quyết toán.',
} as const;

export const emptyCopy = {
  calculator: {
    title: 'Chưa có kết quả',
    body: 'Nhập Gross hoặc Net, rồi bấm Tính — tôi sẽ hiện Net và breakdown.',
  },
  settlement: {
    title: 'Chưa có ước quyết toán',
    body: 'Điền lương tháng, số tháng và thuế đã khấu trừ, rồi bấm Ước quyết toán.',
  },
  maternity: {
    title: 'Chưa có ước thai sản',
    body: 'Điền bình quân lương và thông tin sinh, rồi bấm Tính thai sản.',
  },
  sickLeave: {
    title: 'Chưa có ước ốm đau',
    body: 'Nhập lương liền kề và số ngày nghỉ, rồi bấm Tính ốm đau.',
  },
  severance: {
    title: 'Chưa có ước trợ cấp',
    body: 'Chọn loại thôi việc / mất việc, điền thời gian và lương, rồi bấm Tính trợ cấp.',
  },
  unemployment: {
    title: 'Chưa có ước BHTN',
    body: 'Nhập tháng đóng và lương bình quân, rồi bấm Tính BHTN.',
  },
  filing: {
    title: 'Chưa có kết luận',
    body: 'Trả lời các câu hỏi, rồi bấm Xem kết luận — tôi gợi ý hướng nộp.',
  },
  calculateError: {
    title: 'Chưa tính được',
  },
} as const;

export const aboutCopy = {
  name: 'Ngài Miu',
  role: 'Trợ lý hướng dẫn trong app',
  body:
    'KVSalaryTools giúp ước tính lương Gross↔Net, quyết toán thuế và quyền lợi BHXH — offline, minh bạch từng khoản trừ. Tôi chỉ đường; kết quả không thay thế tư vấn pháp lý.',
} as const;

export const onboardingSteps = [
  {
    title: 'Xin chào, tôi là Ngài Miu',
    body: 'Trợ lý của bạn trong KVSalaryTools — tôi sẽ chỉ đường qua từng bước tính lương, thuế và quyền lợi BHXH.',
    pose: 'wave' as const,
  },
  {
    title: 'Tính Gross ↔ Net',
    body: 'Ước tính lương offline theo ruleset 2025/2026. Breakdown từng khoản trừ — không che số.',
    pose: 'point' as const,
  },
  {
    title: 'Quyết toán thuế năm',
    body: 'Đối chiếu đã khấu trừ với nghĩa vụ ước tính. Có wizard gợi ý ủy quyền hay tự QT.',
    pose: 'tip' as const,
  },
  {
    title: 'Quyền lợi BHXH',
    body: 'Thai sản, ốm đau, thôi việc, thất nghiệp, hưu / một lần — mỗi máy tính độc lập.',
    pose: 'bow' as const,
  },
] as const;
