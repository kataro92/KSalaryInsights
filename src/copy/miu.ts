/**
 * Ngài Miu voice. Short, precise, first-person "tôi", never softens law.
 * @see docs/product/design-system.md §8.2
 */

export const brand = {
  name: "KSalaryInsights",
  tagline: "Ước tính lương · thuế · bảo hiểm",
  guideLine: "Ngài Miu sẵn sàng hướng dẫn bạn",
} as const;

export const miuTips = {
  calculatorResult: "Tôi tách từng khoản trừ để bạn thấy rõ, không ẩn số.",
  bonusMonth:
    "Thưởng và làm thêm giờ chịu thuế trong tháng nhận. Bảo hiểm vẫn theo lương căn cứ, không cộng thưởng.",
  overtime:
    "Làm thêm ngày: 150/200/300%. Ban đêm tối thiểu 200/270/390% (Đ.98, NĐ 145). Tôi cộng vào Gross tháng.",
  benefitsHub:
    "Chọn một mục bên dưới. Mỗi công cụ tính riêng, không gộp vào lương Gross-Net.",
  settlement:
    "Đối chiếu bảng lương và chứng từ khấu trừ trước khi nộp. Đây chỉ là ước tính.",
  filingWizard:
    "App không thu giấy tờ. Tôi chỉ gợi ý hướng nộp để bạn tự chuẩn bị.",
  maternity:
    "Chế độ theo tháng và trợ cấp một lần hiện riêng bên dưới, không gộp vào Gross-Net.",
  sickLeave:
    "Có trần ngày theo năm đóng. Nếu bị cắt, công thức ghi rõ bên dưới.",
  severance:
    "Đã trừ thời gian đóng BHTN và phần đã chi trả. Xem chi tiết bên dưới.",
  unemployment:
    "Trần trợ cấp = 5 × lương tối thiểu vùng. Điều kiện hưởng nằm dưới phần chi tiết.",
  retirement:
    "Hai kịch bản chỉ để so sánh; tôi không khuyên rút hay giữ. Đọc điều kiện bên dưới.",
  comparison: "Gross giữ nguyên. Tôi chỉ so Net và thuế giữa hai năm.",
  rent: "GTGT và TNCN hiện riêng. Ngưỡng miễn theo năm thuế đang chọn.",
  rentSimple:
    "Tôi nhân tiền thuê tháng ×12 rồi áp ngưỡng 1 tỷ. Nếu miễn thuế, vẫn nhắc mẫu 01/BĐS.",
  hkd: "GTGT + TNCN theo nhóm ngành. Miễn tỷ lệ vẫn cần kê khai doanh thu.",
  hkdSimple:
    "Ước nhanh: doanh thu tháng ×12 theo nhóm ngành phổ biến. Bật Đầy đủ nếu cần chi phí hoặc ngành khác.",
  securities:
    "Tỷ lệ theo ngày giao dịch. Đọc chú thích nếu mức đang áp dụng có hiệu lực hạn chế.",
  esop: "Thuế từ thu nhập chịu thuế và thuế chuyển nhượng hiện riêng. Đọc ghi chú quyết toán nếu có.",
  casual:
    "Thực nhận nằm trong chi tiết. Miễn quyết toán chỉ áp khi đủ điều kiện ở mục Quyết toán.",
  scenarios:
    "Kịch bản lưu trên máy bạn, không gửi lên máy chủ. Tải lại khi cần so sánh hoặc quyết toán.",
} as const;

export const emptyCopy = {
  calculator: {
    title: "Chưa có kết quả",
    body: "Nhập Gross hoặc Net, rồi bấm Tính.",
  },
  settlement: {
    title: "Chưa có ước quyết toán",
    body: "Nhập lương tháng, số tháng và thuế đã khấu trừ, rồi bấm Ước quyết toán.",
  },
  maternity: {
    title: "Chưa có ước thai sản",
    body: "Nhập lương bình quân và thông tin sinh, rồi bấm Tính.",
  },
  sickLeave: {
    title: "Chưa có ước ốm đau",
    body: "Nhập lương liền kề và số ngày nghỉ, rồi bấm Tính.",
  },
  severance: {
    title: "Chưa có ước trợ cấp",
    body: "Chọn thôi việc hoặc mất việc, nhập thời gian và lương, rồi bấm Tính.",
  },
  unemployment: {
    title: "Chưa có ước BHTN",
    body: "Nhập số tháng đóng và lương bình quân, rồi bấm Tính.",
  },
  filing: {
    title: "Chưa có kết luận",
    body: "Trả lời các câu hỏi, rồi bấm Xem kết luận.",
  },
  calculateError: {
    title: "Chưa tính được",
  },
} as const;

export const aboutCopy = {
  name: "Ngài Miu",
  role: "Trợ lý trong app",
  body: "KSalaryInsights giúp bạn so offer Gross-Net, đối chiếu bảng lương và kiểm chứng mức BH · thuế theo năm ngay trên máy bạn. Từng khoản trừ hiện rõ. Tôi hướng dẫn; kết quả không thay thế tư vấn pháp lý.",
  author: "Phạm Huy Đức",
  email: "kataro92@gmail.com",
} as const;

export const onboardingSteps = [
  {
    title: "Xin chào, tôi là Ngài Miu",
    body: "Tôi giúp bạn ước lương, thuế và BHXH khi nhận offer, đối chiếu bảng lương, hoặc khi mức đổi theo năm.",
    pose: "wave" as const,
  },
  {
    title: "Từ Gross sang Net",
    body: "Quy offer về cùng một mặt, chỉnh mức đóng BH, xem thực nhận trước khi ký. Mỗi khoản trừ hiện riêng.",
    pose: "point" as const,
  },
  {
    title: "Quyết toán thuế năm",
    body: "So thuế ước tính với số đã khấu trừ. Có hướng dẫn nên ủy quyền hay tự quyết toán.",
    pose: "tip" as const,
  },
  {
    title: "Quyền lợi BHXH",
    body: "Thai sản, ốm đau, thôi việc, thất nghiệp, hưu hoặc một lần: mỗi công cụ đứng riêng.",
    pose: "bow" as const,
  },
] as const;
