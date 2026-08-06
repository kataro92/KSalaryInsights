import type { LocaleCode, TipContent, TipId } from "@/src/i18n/types";

type TipDict = Record<TipId, TipContent>;

const vi: TipDict = {
  "salary.gross": {
    title: "Lương Gross",
    body: "Tổng thu nhập trước khi trừ bảo hiểm bắt buộc và thuế thu nhập cá nhân. Đây là số bạn nhập (hoặc suy ra khi tính từ Net sang Gross).",
    formula:
      "Gross = lương thỏa thuận + thưởng tháng + tiền làm thêm giờ + khoản chịu thuế khác trong tháng",
    detail:
      "Trong app, Gross tháng là điểm xuất phát của luồng tính. Phụ cấp miễn thuế (nếu có) chưa tách riêng ở bản này. Nếu bảng lương có khoản miễn, đối chiếu lại với nhân sự.\n\nVí dụ: lương thỏa thuận 28tr + thưởng 2tr = Gross 30tr trước khi trừ bảo hiểm và thuế.",
    sources: [
      "Luật Thuế thu nhập cá nhân 109/2025/QH15: thu nhập từ tiền lương, tiền công"],
  },
  "salary.bhxh": {
    title: "Bảo hiểm xã hội người lao động (8%)",
    body: "Phần bảo hiểm xã hội bạn đóng mỗi tháng trên mức lương làm căn cứ đóng bảo hiểm xã hội (đã áp trần nếu vượt).",
    formula: "Bảo_hiểm_xã_hội = min(lương_đóng_bảo_hiểm, trần_bảo_hiểm) × 8%",
    detail:
      "Trần bảo hiểm xã hội / y tế = 20 × mức tham chiếu (lương cơ sở khi còn áp dụng). Năm 2026: nửa đầu năm trần khoảng 46,8tr; từ 01/07/2026 trần khoảng 50,6tr. App lấy theo ngày/năm thuế.\n\nTỷ lệ 8% là quỹ hưu trí và tử tuất phía người lao động. Phần doanh nghiệp đóng không trừ khỏi Net của bạn.",
    sources: [
      "Luật Bảo hiểm xã hội 41/2024/QH15 Đ.33 khoản 1a (tỷ lệ 8%)",
      "Luật Bảo hiểm xã hội 41/2024 Đ.31 khoản 1đ (trần 20 lần mức tham chiếu)"],
  },
  "salary.bhyt": {
    title: "Bảo hiểm y tế người lao động (1,5%)",
    body: "Phần bảo hiểm y tế bạn đóng trên cùng nhóm căn cứ với bảo hiểm xã hội (cùng trần đóng).",
    formula: "Bảo_hiểm_y_tế = min(lương_đóng_bảo_hiểm, trần_bảo_hiểm) × 1,5%",
    detail:
      "Căn cứ và trần bảo hiểm y tế thường đi cùng bảo hiểm xã hội. App dùng cùng mức đóng bảo hiểm xã hội đã nhập/suy ra.\n\nPhần doanh nghiệp đóng bảo hiểm y tế không trừ khỏi lương Net.",
    sources: [
      "Khung đóng BHYT phổ biến (NLĐ 1,5%). Tham số theo năm thuế trong app"],
  },
  "salary.bhtn": {
    title: "Bảo hiểm thất nghiệp người lao động (1%)",
    body: "Phần bảo hiểm thất nghiệp bạn đóng. Trần bảo hiểm thất nghiệp khác trần bảo hiểm xã hội. Theo lương tối thiểu vùng × hệ số.",
    formula: "Bảo_hiểm_thất_nghiệp = min(lương_đóng_thất_nghiệp, lương_tối_thiểu_vùng × hệ_số) × 1%",
    detail:
      "Ví dụ 2026 vùng I: lương tối thiểu vùng 5.310.000 × 20 = trần bảo hiểm thất nghiệp 106.200.000 đ. Lương dưới trần thì đóng đúng 1% trên mức đóng.\n\nVùng lương tối thiểu lấy từ Cài đặt (hoặc mặc định bạn chọn).",
    sources: [
      "Luật Việc làm 74/2025: khung đóng bảo hiểm thất nghiệp",
      "NĐ mức lương tối thiểu vùng theo năm (vd. NĐ 293/2025 cho 2026)"],
  },
  "salary.insuranceTotal": {
    title: "Tổng bảo hiểm người lao động",
    body: "Tổng ba khoản bạn đóng trong tháng: bảo hiểm xã hội + bảo hiểm y tế + bảo hiểm thất nghiệp. Đây là số trừ khỏi Gross trước khi tính giảm trừ gia cảnh và thuế.",
    formula:
      "Bảo_hiểm_người_lao_động = bảo_hiểm_xã_hội + bảo_hiểm_y_tế + bảo_hiểm_thất_nghiệp\n(thường khoảng 10,5% căn cứ khi dưới cả hai trần)",
    detail:
      "App chỉ trừ phần người lao động khi ước Net. Phần doanh nghiệp (khoảng 21,5%) không hiện trên dòng này.\n\nVí dụ Gross/căn cứ 30tr dưới trần: bảo hiểm xã hội 2,4tr + bảo hiểm y tế 0,45tr + bảo hiểm thất nghiệp 0,3tr = 3,15tr.",
    sources: ["Tham số năm thuế trong app"],
  },
  "salary.afterInsurance": {
    title: "Thu nhập sau bảo hiểm",
    body: "Gross sau khi đã trừ tổng bảo hiểm người lao động. Bước trung gian trước giảm trừ gia cảnh.",
    formula: "Thu_nhập_sau_bảo_hiểm = Gross − bảo_hiểm_người_lao_động",
    detail:
      "Đây chưa phải thu nhập tính thuế. Tiếp theo app trừ giảm trừ bản thân và người phụ thuộc rồi mới ra thu nhập tính thuế.\n\nVí dụ: Gross 30tr − bảo hiểm 3,15tr = 26,85tr.",
    sources: ["Luật Thuế thu nhập cá nhân: luồng tính tháng Gross sang Net"],
  },
  "salary.personalRelief": {
    title: "Giảm trừ bản thân",
    body: "Khoản giảm trừ cố định cho bản thân theo năm thuế đang chọn. Không phụ thuộc mức lương.",
    formula:
      "Giảm_trừ_bản_thân (tháng) = mức_quy_định_năm_thuế\n• 2025: 11.000.000 đ/tháng\n• 2026: 15.500.000 đ/tháng",
    detail:
      "Quyết toán thu nhập năm 2025 vẫn dùng mức 11tr/tháng dù bạn quyết toán vào 2026. Thu nhập năm 2026 dùng 15,5tr. App gắn theo năm thuế bạn chọn.\n\nGiảm trừ năm (khi quyết toán) = mức tháng × 12, kể cả năm làm không trọn tháng đủ điều kiện.",
    sources: [
      "NQ 954/2020/UBTVQH14 (giảm trừ 11 / 4,4: kỳ 2025)",
      "NQ 110/2025/UBTVQH15; Luật 109/2025 (giảm trừ 15,5 / 6,2: kỳ 2026)",
      "CV 1296/CT-NVT. Quyết toán 2025 dùng luật cũ"],
  },
  "salary.dependentRelief": {
    title: "Giảm trừ người phụ thuộc",
    body: "Giảm trừ thêm cho mỗi người phụ thuộc bạn khai. App nhân mức quy định với số người bạn nhập. Không kiểm tra hồ sơ.",
    formula:
      "Giảm_trừ_người_phụ_thuộc = số_người_phụ_thuộc × mức_người_phụ_thuộc_năm_thuế\n• 2025: 4.400.000 đ/người/tháng\n• 2026: 6.200.000 đ/người/tháng",
    detail:
      "Người phụ thuộc phải đủ điều kiện theo luật (quan hệ, thu nhập, đăng ký…). App chỉ nhân số bạn nhập để ước tính.\n\nVí dụ 2026, 2 người phụ thuộc: 2 × 6,2tr = 12,4tr/tháng.",
    sources: [
      "Luật Thuế thu nhập cá nhân + nghị quyết giảm trừ theo năm thuế",
      "Thông tư / hướng dẫn đăng ký người phụ thuộc"],
  },
  "salary.reliefTotal": {
    title: "Tổng giảm trừ gia cảnh",
    body: "Tổng giảm trừ bản thân và người phụ thuộc trong tháng (hoặc quy đổi năm khi quyết toán).",
    formula: "Giảm_trừ_gia_cảnh = giảm_trừ_bản_thân + giảm_trừ_người_phụ_thuộc",
    detail:
      "Trừ sau bảo hiểm, trước khi ra thu nhập tính thuế. Nếu giảm trừ lớn hơn thu nhập sau bảo hiểm, thu nhập tính thuế = 0 (không âm).\n\nVí dụ 2026, không có người phụ thuộc: giảm trừ = 15,5tr. Có 2 người phụ thuộc: 15,5 + 12,4 = 27,9tr.",
    sources: ["Luật Thuế thu nhập cá nhân + nghị quyết giảm trừ theo năm thuế"],
  },
  "salary.taxable": {
    title: "Thu nhập tính thuế",
    body: "Phần thu nhập còn lại sau bảo hiểm và giảm trừ gia cảnh. Đây là căn cứ áp biểu thuế lũy tiến từng phần.",
    formula: "Thu_nhập_tính_thuế = max(0, thu_nhập_sau_bảo_hiểm − giảm_trừ_gia_cảnh)",
    detail:
      "Nếu thu nhập tính thuế = 0 thì thuế tháng = 0; Net khoảng bằng Gross trừ bảo hiểm người lao động.\n\nVí dụ 2026: sau bảo hiểm 26,85tr − giảm trừ 15,5tr = thu nhập tính thuế 11,35tr, rồi chia vào các bậc biểu thuế.",
    sources: [
      "Luật Thuế thu nhập cá nhân. Thu nhập tính thuế từ tiền lương, tiền công"],
  },
  "salary.pit": {
    title: "Thuế thu nhập cá nhân",
    body: "Thuế thu nhập cá nhân theo biểu lũy tiến từng phần của năm thuế. Chi tiết từng bậc hiện ngay dưới dòng này.",
    formula:
      "Thuế = tổng (phần thu nhập trong từng bậc × thuế suất của bậc đó)\n\n2025: biểu 7 bậc (5% đến 35%)\n2026: biểu 5 bậc (theo Luật 109/2025)",
    detail:
      "“Lũy tiến từng phần”: chỉ phần thu nhập trong mỗi bậc chịu thuế suất của bậc đó. Không áp một thuế suất cho toàn bộ thu nhập tính thuế.\n\nApp chọn biểu theo năm thuế: quyết toán/thu nhập 2025 dùng biểu 7 bậc; 2026 dùng biểu 5 bậc (không tách nửa năm 2026).",
    sources: [
      "Luật Thuế thu nhập cá nhân 2007 (VBHN) Đ.22: biểu 7 bậc (kỳ 2025)",
      "Luật 109/2025/QH15: biểu mới từ kỳ tính thuế 2026"],
  },
  "salary.net": {
    title: "Net (thực nhận ước)",
    body: "Số tiền ước tính bạn nhận sau khi trừ bảo hiểm người lao động và thuế thu nhập cá nhân. Không thay bảng lương / phiếu chi chính thức.",
    formula:
      "Net ≈ Gross − bảo_hiểm_người_lao_động − thuế_thu_nhập_cá_nhân\n(− đoàn phí nếu có. Ngoài phạm vi mặc định)",
    detail:
      "Ước tính offline theo tham số năm thuế trong app. Chưa gồm mọi khoản miễn/khấu trừ đặc thù trên bảng lương doanh nghiệp.\n\nVí dụ Gross 30tr, không có người phụ thuộc, dưới trần bảo hiểm (2026): Net khoảng 26,065,000 đ.",
    sources: ["Tham số năm thuế trong app"],
  },
  "settlement.refund": {
    title: "Có thể được hoàn thuế",
    body: "Thuế cả năm ước tính thấp hơn tổng đã khấu trừ qua các tháng → phần chênh mang dấu hoàn.",
    formula: "Hoàn ≈ max(0, thuế_đã_khấu_trừ − thuế_năm_ước_tính)",
    detail:
      "Đây là số ước tính trong app. Trước khi kê khai quyết toán, đối chiếu chứng từ khấu trừ, giảm trừ đã đăng ký, và thu nhập thực tế.\n\nNăm quyết toán gắn với năm phát sinh thu nhập (ví dụ Quyết toán 2025 dùng mức giảm trừ/biểu thuế 2025).",
    sources: [
      "Hướng dẫn quyết toán thuế thu nhập cá nhân hàng năm (Cục Thuế)",
      "CV 1296/CT-NVT. Kỳ 2025 dùng luật cũ"],
  },
  "settlement.pay": {
    title: "Có thể cần nộp thêm",
    body: "Thuế cả năm ước tính cao hơn số đã khấu trừ → cần nộp thêm phần còn thiếu.",
    formula: "Nộp_thêm ≈ max(0, thuế_năm_ước_tính − thuế_đã_khấu_trừ)",
    detail:
      "Chỉ là ước tính. Số chính thức phụ thuộc tờ khai, chứng từ, và quy định nộp/gia hạn của cơ quan thuế trong kỳ quyết toán.",
    sources: [
      "Hướng dẫn quyết toán thuế thu nhập cá nhân"],
  },
  "settlement.even": {
    title: "Khớp (ước)",
    body: "Thuế năm ước tính bằng (hoặc sát) số đã khấu trừ. Trong phạm vi sai số làm tròn.",
    formula: "Thuế_năm_ước_tính ≈ thuế_đã_khấu_trừ, nên chênh lệch gần 0",
    detail:
      "Vẫn nên đối chiếu bảng lương và chứng từ trước khi nộp tờ khai. Sai số nhỏ có thể đến từ làm tròn từng tháng.",
    sources: ["Hướng dẫn quyết toán thuế thu nhập cá nhân"],
  },
  "other.vat": {
    title: "Thuế giá trị gia tăng (ước)",
    body: "Thuế giá trị gia tăng ước theo tỷ lệ ngành / loại thu nhập. Tách biệt với thuế thu nhập cá nhân.",
    formula:
      "Thuế_giá_trị_gia_tăng ≈ doanh_thu × tỷ_lệ_theo_ngành\n(hoặc theo phương pháp kê khai nếu áp dụng)",
    detail:
      "App ước nhanh theo tham số năm thuế. Hộ kinh doanh / cho thuê có thể có tỷ lệ khác nhau; đối chiếu nghị định hướng dẫn theo ngành nghề.",
    sources: [
      "Luật Thuế giá trị gia tăng 2024 Đ.12",
      "NĐ 68/2026, NĐ 141/2026 (hướng dẫn liên quan)"],
  },
  "other.pit": {
    title: "Thuế thu nhập cá nhân (thu nhập khác)",
    body: "Thuế thu nhập cá nhân trên doanh thu hoặc phần vượt ngưỡng. Không cộng vào Gross lương hợp đồng lao động.",
    formula:
      "Thuế_thu_nhập_cá_nhân ≈ doanh_thu (hoặc phần vượt) × tỷ_lệ_theo_loại_thu_nhập\n(ví dụ: thuê nhà, hộ kinh doanh, chứng khoán)",
    detail:
      "Mỗi loại thu nhập khác có tỷ lệ / ngưỡng riêng trong tham số năm thuế. Không gộp với biểu lũy tiến lương hợp đồng lao động trên màn Tính lương.",
    sources: [
      "Luật 109/2025 Đ.7 (các khoản thu nhập khác)",
      "NĐ 68/141/253/2026"],
  },
  "other.threshold": {
    title: "Ngưỡng miễn",
    body: "Mức doanh thu dưới ngưỡng quy định có thể được miễn thuế theo tỷ lệ. Nhưng vẫn có thể phải kê khai hoặc thông báo.",
    formula:
      "Nếu Doanh_thu_năm ≤ ngưỡng (thường 1 tỷ đ) → có thể miễn thuế tỷ lệ\n(vẫn kiểm tra nghĩa vụ kê khai)",
    detail:
      "Ngưỡng và điều kiện miễn lấy theo nghị định của năm thuế. Miễn thuế ≠ miễn mọi nghĩa vụ hành chính. đọc ghi chú trên từng công cụ.",
    sources: ["NĐ 141/2026; NĐ 68/2026"],
  },
  "ot.pay": {
    title: "Tiền làm thêm giờ",
    body: "Tiền làm thêm theo hệ số ngày thường / nghỉ / lễ hoặc ban đêm. Cộng vào Gross tháng để ước thuế.",
    formula:
      "Tiền_làm_thêm = lương_giờ × giờ × hệ_số\nHệ số ngày: 150% / 200% / 300%\nBan đêm: 200% / 270% / 390% (theo loại ngày)",
    detail:
      "App dùng để ước Gross chịu thuế. Quy tắc chốt ca, nghỉ bù, trần giờ làm thêm thực tế theo nội quy doanh nghiệp và Bộ luật Lao động. Không thay tư vấn luật lao động.",
    sources: [
      "Bộ luật Lao động 2019 Đ.98",
      "NĐ 145/2020 Đ.55-57"],
  },
  "bonus.month": {
    title: "Tháng có thưởng / làm thêm",
    body: "Thưởng và làm thêm giờ thường chịu thuế trong tháng bạn nhận. Bảo hiểm mặc định vẫn theo lương căn cứ (không cộng thưởng/làm thêm).",
    formula:
      "Gross_tháng = lương_căn_cứ + thưởng + làm_thêm + ...\nCăn_cứ_bảo_hiểm (mặc định) = lương_thỏa_thuận (không gồm thưởng/làm thêm)",
    detail:
      "Doanh nghiệp có thể quy định khác về căn cứ đóng bảo hiểm. Nếu bảng lương của bạn cộng thưởng vào căn cứ bảo hiểm, chỉnh mức đóng bảo hiểm cho khớp.\n\nThuế thu nhập cá nhân tính trên Gross tháng đã gồm thưởng/làm thêm.",
    sources: ["Tham số năm thuế trong app"],
  },
  "salary.asOfMonth": {
    title: "Tháng tính lương",
    body: "Tháng dùng để chọn ngày áp dụng mức bảo hiểm trong năm thuế. Năm thuế chọn biểu thuế / giảm trừ; tháng chọn trần bảo hiểm khi mức đổi giữa năm.",
    formula: "Ngày_áp_dụng ≈ ngày 15 của (năm thuế + tháng đã chọn)",
    detail:
      "Vẫn cần chọn tháng ngay cả khi năm thuế là 2025: app dùng tháng để gắn ngày áp dụng, không chỉ để hiển thị.\n\nQuan trọng nhất với 2026: trần bảo hiểm xã hội / y tế đổi từ 01/07/2026. Chọn tháng 1-6 dùng mức nửa đầu năm; tháng 7-12 dùng mức nửa sau. Năm không đổi trần giữa năm (ví dụ 2025) thì tháng ít ảnh hưởng hơn nhưng vẫn giữ để kết quả khớp kỳ lương bạn đang ước.",
    sources: [
      "Luật Bảo hiểm xã hội: trần đóng theo mức tham chiếu tại thời điểm",
      "Tham số năm thuế trong app (đổi mức theo ngày)",
    ],
  },
};

const en: TipDict = {
  "salary.gross": {
    title: "Gross salary",
    body: "Total income before mandatory employee insurance and PIT. This is what you enter (or what is solved for in Net → Gross mode).",
    formula:
      "Gross = contractual pay + monthly bonus + overtime + other taxable items in the month",
    detail:
      "Gross is the starting point of the monthly flow. Tax-exempt allowances are not split out in this build. Reconcile with HR if your payslip has exempt lines.\n\nExample: 28M contractual + 2M bonus → 30M Gross before insurance and tax.",
    sources: [
      "PIT Law 109/2025: employment income"],
  },
  "salary.bhxh": {
    title: "Employee social insurance (8%)",
    body: "Your monthly SI contribution on the SI contribution base (after the statutory cap).",
    formula: "SI_employee = min(SI_base, SI_cap) × 8%",
    detail:
      "SI/HI cap = 20 × reference wage (basic salary while applicable). In 2026: ~46.8M in H1; ~50.6M from 1 Jul 2026: the app uses the selected tax year / as-of rules.\n\nThe 8% is the employee pension & survivorship share. Employer contributions are not deducted from your Net.",
    sources: [
      "Social Insurance Law 41/2024 Art. 33.1a (8%)",
      "Art. 31.1đ (20× reference cap)"],
  },
  "salary.bhyt": {
    title: "Employee health insurance (1.5%)",
    body: "Your HI contribution on the same contribution base family as SI (same cap).",
    formula: "HI_employee = min(SI_base, SI_cap) × 1.5%",
    detail:
      "HI base and cap usually follow SI. Employer HI is not deducted from Net.",
    sources: [
      "Common HI framework (employee 1.5%). Rates in app ruleset"],
  },
  "salary.bhtn": {
    title: "Employee unemployment insurance (1%)",
    body: "Your UI contribution. The UI cap differs from the SI cap. Regional minimum wage × multiplier.",
    formula: "UI_employee = min(UI_base, regional_min × multiplier) × 1%",
    detail:
      "Example 2026 Region I: min wage 5,310,000 × 20 → UI cap 106,200,000 VND.\n\nRegion comes from Settings (or your default).",
    sources: [
      "Employment Law 74/2025: UI contributions",
      "Regional minimum-wage decrees (e.g. Decree 293/2025 for 2026)"],
  },
  "salary.insuranceTotal": {
    title: "Total employee insurance",
    body: "SI + HI + UI for you this month. Deducted from Gross before family relief and PIT.",
    formula:
      "Employee_insurance = SI + HI + UI\n(often ≈ 10.5% of base when under both caps)",
    detail:
      "Only the employee share is deducted for Net. Employer share (~21.5%) is not on this line.\n\nExample base 30M under caps: 2.4M + 0.45M + 0.3M = 3.15M.",
    sources: ["Tham số năm thuế trong app"],
  },
  "salary.afterInsurance": {
    title: "Income after insurance",
    body: "Gross minus employee insurance. Intermediate step before family-circumstance relief.",
    formula: "After_insurance = Gross − Employee_insurance",
    detail:
      "Not yet taxable income. Next the app subtracts personal + dependent relief.\n\nExample: 30M − 3.15M = 26.85M.",
    sources: ["PIT Law. Employment taxable income flow"],
  },
  "salary.personalRelief": {
    title: "Personal relief",
    body: "Fixed personal deduction for the selected tax year. Independent of salary level.",
    formula:
      "Personal_relief (month) =\n• 2025: 11,000,000 VND\n• 2026: 15,500,000 VND",
    detail:
      "Filing for income year 2025 still uses 11M/month even if you file in 2026. Income year 2026 uses 15.5M. The app follows the tax year you pick.\n\nAnnual relief = monthly × 12 when settling the year.",
    sources: [
      "Resolution 954/2020 (11 / 4.4: 2025)",
      "Resolution 110/2025; Law 109/2025 (15.5 / 6.2: 2026)",
      "Official letter 1296/CT-NVT. 2025 settlement uses prior law"],
  },
  "salary.dependentRelief": {
    title: "Dependent relief",
    body: "Extra relief per dependent you declare. The app multiplies the statutory amount by the count you enter. It does not verify paperwork.",
    formula:
      "Dependent_relief = count × amount_per_dependent\n• 2025: 4,400,000 VND\n• 2026: 6,200,000 VND",
    detail:
      "Eligibility (relationship, income, registration) is your responsibility.\n\nExample 2026, 2 dependents: 2 × 6.2M = 12.4M/month.",
    sources: [
      "PIT Law + relief resolutions by tax year",
      "Dependent registration guidance"],
  },
  "salary.reliefTotal": {
    title: "Total family relief",
    body: "Personal + dependent relief for the month (or annualized when settling).",
    formula: "Total_relief = Personal + Dependent",
    detail:
      "Subtracted after insurance. If relief exceeds income after insurance, taxable income is 0 (never negative).",
    sources: ["Luật Thuế TNCN + nghị quyết GTGC theo năm thuế"],
  },
  "salary.taxable": {
    title: "Taxable income",
    body: "Amount left after insurance and relief. The base for progressive PIT brackets.",
    formula: "Taxable = max(0, After_insurance − Total_relief)",
    detail:
      "Taxable = 0 → PIT = 0; Net ≈ Gross − employee insurance.\n\nExample 2026: 26.85M − 15.5M = 11.35M taxable.",
    sources: [
      "PIT Law. Employment taxable income"],
  },
  "salary.pit": {
    title: "Personal income tax",
    body: "PIT by the progressive schedule of the selected tax year. Bracket lines appear under this row.",
    formula:
      "PIT = Σ (slice_in_bracket_i × rate_i)\n\n2025: 7 brackets (5%→35%)\n2026: 5 brackets (Law 109/2025)",
    detail:
      "Marginal (slice) progressive tax: only the part of income in each bracket gets that bracket’s rate.\n\nThe app picks the schedule by tax year. No mid-2026 split.",
    sources: [
      "Prior PIT Law Art. 22: 7 brackets (2025)",
      "Law 109/2025: new schedule from tax year 2026"],
  },
  "salary.net": {
    title: "Net (estimated take-home)",
    body: "Estimated cash after employee insurance and PIT. Not an official payslip.",
    formula:
      "Net ≈ Gross − Employee_insurance − PIT\n(− union dues if any. Out of default scope)",
    detail:
      "Offline estimate from in-app rules. Employer-specific exemptions may differ.\n\nExample 30M Gross, 0 dependents, under SI cap (2026): Net ≈ 26,065,000 VND.",
    sources: ["Engine formula (Gross − insurance − PIT)", "TC-TNCN-2026-01"],
  },
  "settlement.refund": {
    title: "Estimated refund",
    body: "Annual tax estimate below total withheld → refund delta.",
    formula: "Refund ≈ max(0, Withheld − Annual_tax_estimate)",
    detail:
      "In-app estimate only. Before filing, reconcile withholding certificates, registered relief, and actual income.\n\nSettlement year follows the income year (e.g. 2025 income → 2025 brackets/relief).",
    sources: [
      "Annual PIT settlement guidance",
      "Official letter 1296/CT-NVT"],
  },
  "settlement.pay": {
    title: "Estimated extra payment",
    body: "Annual tax estimate above withheld → pay the shortfall.",
    formula: "Extra_due ≈ max(0, Annual_tax_estimate − Withheld)",
    detail:
      "Estimate only. Official amounts depend on the return, documents, and filing-period rules.",
    sources: ["Annual PIT settlement guidance"],
  },
  "settlement.even": {
    title: "Balanced (estimate)",
    body: "Annual estimate matches withheld within rounding.",
    formula: "Annual_tax_estimate ≈ Withheld → delta ≈ 0",
    detail:
      "Still verify payslips before filing. Small gaps can come from monthly rounding.",
    sources: ["Hướng dẫn quyết toán TNCN"],
  },
  "other.vat": {
    title: "VAT (estimate)",
    body: "Value-added tax by industry/income-type rate. Separate from PIT.",
    formula: "VAT ≈ Revenue × industry_VAT_rate",
    detail:
      "Quick estimate from the tax-year ruleset. Rentals / household businesses may use different rates. Check the decree for your activity.",
    sources: [
      "VAT Law 2024 Art. 12",
      "Decrees 68/141/2026"],
  },
  "other.pit": {
    title: "PIT (other income)",
    body: "PIT on revenue or the excess over a threshold. Not added to employment Gross.",
    formula:
      "PIT ≈ Revenue_or_excess × PIT_rate\n(rate by type: rent, business, securities…)",
    detail:
      "Each other-income type has its own rate/threshold in the ruleset. Not merged with the employment progressive schedule.",
    sources: [
      "Law 109/2025 Art. 7",
      "Decrees 68/141/253/2026"],
  },
  "other.threshold": {
    title: "Exemption threshold",
    body: "Revenue at or below the threshold may be rate-exempt. Reporting duties can still apply.",
    formula:
      "If annual_revenue ≤ threshold (often 1B VND) → possible rate exemption\n(still check filing duties)",
    detail:
      "Thresholds follow the decree for the tax year. Tax exemption ≠ exemption from all admin duties.",
    sources: [
      "Decree 141/2026; Decree 68/2026"],
  },
  "ot.pay": {
    title: "Overtime pay",
    body: "OT by day type or night multipliers. Added to monthly Gross for the PIT estimate.",
    formula:
      "OT = hourly_rate × hours × multiplier\nDay: 150% / 200% / 300%\nNight: 200% / 270% / 390%",
    detail:
      "Used to estimate taxable Gross. Real OT caps and compensatory leave follow your employer rules and the Labor Code.",
    sources: [
      "Labor Code 2019 Art. 98",
      "Decree 145/2020 Arts. 55-57"],
  },
  "bonus.month": {
    title: "Bonus / OT month",
    body: "Bonus and OT are usually taxed in the receipt month. Insurance base stays on contractual pay by default.",
    formula:
      "Gross_month = base_pay + bonus + OT + …\nSI_base (default) = contractual pay (excludes bonus/OT)",
    detail:
      "Some employers include bonus in the SI base. Adjust the contribution base if your payslip differs.\n\nPIT is computed on Gross including bonus/OT.",
    sources: ["PIT Law (bonus/OT month)", "Social Insurance Law (contribution base)"],
  },
  "salary.asOfMonth": {
    title: "Payroll month",
    body: "The month sets the as-of date for insurance caps within the tax year. Tax year picks brackets/relief; month picks the SI cap when it changes mid-year.",
    formula: "As_of ≈ the 15th of (tax year + selected month)",
    detail:
      "You still pick a month for 2025: the app uses it for the as-of date, not just display.\n\nMost important in 2026: the SI/HI cap changes on 1 Jul 2026. Months 1-6 use H1 caps; 7-12 use H2. For years without a mid-year cap change (e.g. 2025), month matters less but keeps the estimate aligned with the pay period you mean.",
    sources: [
      "Social Insurance Law: contribution caps at the applicable time",
      "In-app tax-year ruleset (date-based parameters)",
    ],
  },
};

/** Non-EN locales: localized title/body; formula/detail inherit from EN. */
function localizeFromEn(
  bodyMap: Partial<Record<TipId, { title: string; body: string }>>
): TipDict {
  const out = { ...en };
  for (const id of Object.keys(bodyMap) as TipId[]) {
    const patch = bodyMap[id];
    if (!patch) continue;
    out[id] = { ...en[id], title: patch.title, body: patch.body };
  }
  return out;
}

const zh = localizeFromEn({
  "salary.gross": {
    title: "税前工资 Gross",
    body: "扣除强制保险与个税前的总收入，是工资计算器的基础输入。",
  },
  "salary.bhxh": {
    title: "职工社保（8%）",
    body: "职工按社保缴费基数（封顶后）缴纳 8%。费率取自所选税务年度参数。",
  },
  "salary.bhyt": {
    title: "职工医保（1.5%）",
    body: "职工按缴费基数缴纳 1.5%。封顶与社保一致。",
  },
  "salary.bhtn": {
    title: "职工失业险（1%）",
    body: "职工按失业险基数缴纳 1%（地区最低工资 × 系数）。",
  },
  "salary.insuranceTotal": {
    title: "职工保险合计",
    body: "本月社保+医保+失业险。从 Gross 中扣除后再计算减免与个税。",
  },
  "salary.afterInsurance": {
    title: "扣保险后收入",
    body: "Gross − 职工保险合计。作为家庭减免的输入。",
  },
  "salary.personalRelief": {
    title: "本人减免",
    body: "按税务年度的固定本人扣除额（如 2026 年每月 1550 万越盾）。",
  },
  "salary.dependentRelief": {
    title: "抚养减免",
    body: "每位合格抚养人 × 法定额度 × 您输入的人数（应用不核实材料）。",
  },
  "salary.reliefTotal": {
    title: "家庭减免合计",
    body: "本人减免 + 抚养减免。扣保险后继续扣除以得到应税所得。",
  },
  "salary.taxable": {
    title: "应税所得",
    body: "扣保险后收入 − 减免合计（不小于 0）。用于累进税率。",
  },
  "salary.pit": {
    title: "个人所得税",
    body: "按所选税务年度累进税率计算。下方显示各档明细。",
  },
  "salary.net": {
    title: "实发净额（估算）",
    body: "Gross − 职工保险 − 个税。仅离线估算，不能替代正式工资单。",
  },
  "settlement.refund": {
    title: "预计退税",
    body: "年税估算 < 已预扣 → 退税差额。申报前请核对凭证。",
  },
  "settlement.pay": {
    title: "预计补税",
    body: "年税估算 > 已预扣 → 需补缴差额。仅为应用内估算。",
  },
  "settlement.even": {
    title: "相符",
    body: "年税估算与已预扣一致（含四舍五入）。仍建议核对工资单。",
  },
  "other.vat": {
    title: "增值税（估算）",
    body: "按行业/收入类型税率估算，与个税分开。",
  },
  "other.pit": {
    title: "其他收入个税",
    body: "按收入或超门槛部分计税. 不并入劳动合同 Gross。",
  },
  "other.threshold": {
    title: "免税门槛",
    body: "收入 ≤ 门槛（常为每年 10 亿越盾）可能免比率税，但仍可能需申报。",
  },
  "ot.pay": {
    title: "加班费",
    body: "按日类型（150/200/300%）或夜班（200/270/390%）。计入当月 Gross 估算个税。",
  },
  "bonus.month": {
    title: "奖金/加班月",
    body: "奖金与加班在收到月纳税。保险基数默认仍按合同工资。",
  },
  "salary.asOfMonth": {
    title: "计薪月份",
    body: "用于在税年内选择保险上限的适用日。税年决定税率/减免，月份决定年中变更的社保上限。",
  },
});

const hi = localizeFromEn({
  "salary.gross": {
    title: "सकल वेतन (Gross)",
    body: "अनिवार्य बीमा और PIT काटने से पहले की कुल आय। वेतन कैलकुलेटर का आधार।",
  },
  "salary.bhxh": {
    title: "कर्मचारी सामाजिक बीमा (8%)",
    body: "कर्मचारी SI आधार (सीमा के बाद) पर 8% देता है।",
  },
  "salary.bhyt": {
    title: "कर्मचारी स्वास्थ्य बीमा (1.5%)",
    body: "कर्मचारी योगदान आधार पर 1.5% देता है।",
  },
  "salary.bhtn": {
    title: "बेरोजगारी बीमा (1%)",
    body: "कर्मचारी UI आधार पर 1% देता है (क्षेत्रीय न्यूनतम × गुणांक)।",
  },
  "salary.insuranceTotal": {
    title: "कुल कर्मचारी बीमा",
    body: "इस माह SI+HI+UI। परिवार राहत और PIT से पहले Gross से काटा जाता है।",
  },
  "salary.afterInsurance": {
    title: "बीमा के बाद आय",
    body: "Gross − कर्मचारी बीमा। पारिवारिक राहत का इनपुट।",
  },
  "salary.personalRelief": {
    title: "व्यक्तिगत राहत",
    body: "कर-वर्ष की निश्चित व्यक्तिगत कटौती।",
  },
  "salary.dependentRelief": {
    title: "आश्रित राहत",
    body: "प्रत्येक पात्र आश्रित × वैधानिक राशि × आपकी संख्या (ऐप सत्यापित नहीं करता)।",
  },
  "salary.reliefTotal": {
    title: "कुल पारिवारिक राहत",
    body: "व्यक्तिगत + आश्रित राहत। करयोग्य आय के लिए बीमा के बाद काटी जाती है।",
  },
  "salary.taxable": {
    title: "करयोग्य आय",
    body: "बीमा के बाद − कुल राहत (≥0)। प्रोग्रेसिव PIT का आधार।",
  },
  "salary.pit": {
    title: "व्यक्तिगत आयकर",
    body: "चयनित कर-वर्ष की प्रोग्रेसिव अनुसूची के अनुसार।",
  },
  "salary.net": {
    title: "नेट (अनुमानित)",
    body: "Gross − कर्मचारी बीमा − PIT। केवल ऑफ़लाइन अनुमान।",
  },
  "settlement.refund": {
    title: "अनुमानित रिफंड",
    body: "वार्षिक कर < कटी हुई राशि → रिफंड। दाखिल करने से पहले जाँचें।",
  },
  "settlement.pay": {
    title: "अतिरिक्त भुगतान",
    body: "वार्षिक कर > कटी हुई राशि → अंतर चुकाना होगा।",
  },
  "settlement.even": {
    title: "संतुलित",
    body: "अनुमान कटी हुई राशि से मेल खाता है। फिर भी पेरोल जाँचें।",
  },
  "other.vat": { title: "VAT (अनुमान)", body: "नियम दरों से वैट। PIT से अलग।" },
  "other.pit": {
    title: "अन्य आय PIT",
    body: "राजस्व या सीमा से अधिक पर कर. रोजगार Gross में नहीं जोड़ा जाता।",
  },
  "other.threshold": {
    title: "छूट सीमा",
    body: "आय ≤ सीमा पर दर छूट हो सकती है, रिपोर्टिंग फिर भी लागू हो सकती है।",
  },
  "ot.pay": {
    title: "ओवरटाइम",
    body: "दिन प्रकार या रात्रि गुणांक। मासिक Gross में PIT अनुमान के लिए जोड़ा जाता है।",
  },
  "bonus.month": {
    title: "बोनस / OT माह",
    body: "प्राप्ति माह में कर। बीमा आधार डिफ़ॉल्ट अनुबंध वेतन पर रहता है।",
  },
  "salary.asOfMonth": {
    title: "वेतन माह",
    body: "कर वर्ष में बीमा सीमा की लागू तिथि चुनने के लिए। कर वर्ष ब्रैकेट/राहत चुनता है; माह मध्य-वर्ष सीमा बदलाव पर लागू होता है।",
  },
});

const es = localizeFromEn({
  "salary.gross": {
    title: "Salario bruto",
    body: "Ingreso total antes de seguros obligatorios e IRPF. Base del calculador.",
  },
  "salary.bhxh": {
    title: "Seguro social del trabajador (8%)",
    body: "El trabajador aporta el 8% sobre la base (tras el tope).",
  },
  "salary.bhyt": {
    title: "Seguro de salud (1,5%)",
    body: "Aporta el 1,5% sobre la base. Tope según el año fiscal.",
  },
  "salary.bhtn": {
    title: "Desempleo (1%)",
    body: "Aporta el 1% sobre la base de desempleo (salario mínimo regional × coeficiente).",
  },
  "salary.insuranceTotal": {
    title: "Total seguros del trabajador",
    body: "SS+salud+desempleo del mes. Se resta del bruto antes del IRPF.",
  },
  "salary.afterInsurance": {
    title: "Ingreso tras seguros",
    body: "Bruto − seguros. Entrada a las reducciones familiares.",
  },
  "salary.personalRelief": {
    title: "Reducción personal",
    body: "Deducción fija personal según el año fiscal.",
  },
  "salary.dependentRelief": {
    title: "Reducción por dependientes",
    body: "Por cada dependiente × importe legal × cantidad indicada.",
  },
  "salary.reliefTotal": {
    title: "Total reducciones",
    body: "Personal + dependientes. Tras seguros para obtener la base imponible.",
  },
  "salary.taxable": {
    title: "Base imponible",
    body: "Tras seguros − reducciones (≥0). Base del IRPF progresivo.",
  },
  "salary.pit": {
    title: "IRPF",
    body: "Impuesto según el tramo progresivo del año fiscal seleccionado.",
  },
  "salary.net": {
    title: "Neto (estimado)",
    body: "Bruto − seguros − IRPF. Solo estimación offline.",
  },
  "settlement.refund": {
    title: "Devolución estimada",
    body: "Impuesto anual < retenido → devolución. Verifique documentos.",
  },
  "settlement.pay": {
    title: "Pago adicional estimado",
    body: "Impuesto anual > retenido → pagar la diferencia.",
  },
  "settlement.even": {
    title: "Cuadrado",
    body: "La estimación coincide con lo retenido (redondeo).",
  },
  "other.vat": {
    title: "IVA (estimado)",
    body: "IVA según tasas del tipo de ingreso. Separado del IRPF.",
  },
  "other.pit": {
    title: "IRPF (otros ingresos)",
    body: "Sobre ingresos o exceso del umbral. No se suma al bruto laboral.",
  },
  "other.threshold": {
    title: "Umbral de exención",
    body: "Ingresos ≤ umbral pueden eximir tasas, pero la declaración puede seguir.",
  },
  "ot.pay": {
    title: "Horas extra",
    body: "Según tipo de día o noche. Se suma al bruto mensual para el IRPF.",
  },
  "bonus.month": {
    title: "Mes con bonus / extras",
    body: "Bonus y extras se gravan en el mes de cobro. La base de seguro suele ser el salario contractual.",
  },
  "salary.asOfMonth": {
    title: "Mes de nómina",
    body: "Define la fecha de aplicación de topes de seguro en el año fiscal. El año elige tramos/reducciones; el mes el tope si cambia a mitad de año.",
  },
});

const fr = localizeFromEn({
  "salary.gross": {
    title: "Salaire brut",
    body: "Revenu total avant cotisations obligatoires et IR. Base du calculateur.",
  },
  "salary.bhxh": {
    title: "Assurance sociale (8%)",
    body: "Le salarié verse 8% de l’assiette (après plafond).",
  },
  "salary.bhyt": {
    title: "Assurance maladie (1,5%)",
    body: "1,5% de l’assiette. Plafond selon l’année fiscale.",
  },
  "salary.bhtn": {
    title: "Chômage (1%)",
    body: "1% de l’assiette chômage (SMIC régional × coefficient).",
  },
  "salary.insuranceTotal": {
    title: "Total cotisations salarié",
    body: "AS+AM+chômage du mois. Déduit du brut avant l’IR.",
  },
  "salary.afterInsurance": {
    title: "Revenu après cotisations",
    body: "Brut − cotisations. Entrée des abattements familiaux.",
  },
  "salary.personalRelief": {
    title: "Abattement personnel",
    body: "Déduction fixe selon l’année fiscale.",
  },
  "salary.dependentRelief": {
    title: "Abattement personnes à charge",
    body: "Par personne × montant légal × nombre saisi.",
  },
  "salary.reliefTotal": {
    title: "Total abattements",
    body: "Personnel + à charge. Après cotisations pour le revenu imposable.",
  },
  "salary.taxable": {
    title: "Revenu imposable",
    body: "Après cotisations − abattements (≥0). Base du barème progressif.",
  },
  "salary.pit": {
    title: "Impôt sur le revenu",
    body: "Selon le barème progressif de l’année fiscale sélectionnée.",
  },
  "salary.net": {
    title: "Net (estimé)",
    body: "Brut − cotisations − IR. Estimation hors ligne uniquement.",
  },
  "settlement.refund": {
    title: "Remboursement estimé",
    body: "Impôt annuel < retenu → remboursement. Vérifiez les pièces.",
  },
  "settlement.pay": {
    title: "Complément estimé",
    body: "Impôt annuel > retenu → payer la différence.",
  },
  "settlement.even": {
    title: "Équilibré",
    body: "L’estimation correspond au retenu (arrondis).",
  },
  "other.vat": {
    title: "TVA (estimée)",
    body: "TVA selon les taux du type de revenu. Séparée de l’IR.",
  },
  "other.pit": {
    title: "IR (autres revenus)",
    body: "Sur le chiffre d’affaires ou l’excédent. Non ajouté au brut salarial.",
  },
  "other.threshold": {
    title: "Seuil d’exonération",
    body: "Revenus ≤ seuil peuvent être exonérés de taux, déclaration parfois requise.",
  },
  "ot.pay": {
    title: "Heures supplémentaires",
    body: "Selon le type de jour ou de nuit. Ajoutées au brut mensuel pour l’IR.",
  },
  "bonus.month": {
    title: "Mois avec prime / HS",
    body: "Primes et HS imposées le mois de versement. Assiette d’assurance = salaire contractuel par défaut.",
  },
  "salary.asOfMonth": {
    title: "Mois de paie",
    body: "Fixe la date d’application des plafonds d’assurance dans l’année fiscale. L’année choisit barème/abattements ; le mois le plafond en cas de changement en cours d’année.",
  },
});

const ja = localizeFromEn({
  "salary.gross": {
    title: "総支給（Gross）",
    body: "強制保険・所得税控除前の総収入。給与計算機の基準入力です。",
  },
  "salary.bhxh": {
    title: "社会保険（従業員 8%）",
    body: "従業員が社会保険の算定基礎（上限後）の 8% を負担。",
  },
  "salary.bhyt": {
    title: "医療保険（1.5%）",
    body: "算定基礎の 1.5%。上限は社保に準じます。",
  },
  "salary.bhtn": {
    title: "失業保険（1%）",
    body: "失業保険基礎の 1%（地域最低賃金×係数）。",
  },
  "salary.insuranceTotal": {
    title: "従業員保険合計",
    body: "当月の社保+医療+失業。所得税前に Gross から控除。",
  },
  "salary.afterInsurance": {
    title: "保険控除後所得",
    body: "Gross − 従業員保険。家族控除の入力。",
  },
  "salary.personalRelief": {
    title: "本人控除",
    body: "税年度の固定本人控除額。",
  },
  "salary.dependentRelief": {
    title: "扶養控除",
    body: "扶養1人あたり × 法定額 × 入力人数（アプリは審査しません）。",
  },
  "salary.reliefTotal": {
    title: "控除合計",
    body: "本人+扶養。課税所得を出すため保険の後に控除。",
  },
  "salary.taxable": {
    title: "課税所得",
    body: "保険後 − 控除合計（0以上）。累進税率の基礎。",
  },
  "salary.pit": {
    title: "所得税",
    body: "選択税年度の累進表で計算。下に各段階を表示。",
  },
  "salary.net": {
    title: "手取り（概算）",
    body: "Gross − 従業員保険 − 所得税。オフライン概算のみ。",
  },
  "settlement.refund": {
    title: "還付見込み",
    body: "年税概算 < 源泉徴収 → 還付差額。申告前に書類を確認。",
  },
  "settlement.pay": {
    title: "追加納付見込み",
    body: "年税概算 > 源泉徴収 → 差額を納付。",
  },
  "settlement.even": {
    title: "一致",
    body: "概算が源泉と一致（端数含む）。給与明細も確認してください。",
  },
  "other.vat": {
    title: "付加価値税（概算）",
    body: "業種・所得区分税率。所得税とは別。",
  },
  "other.pit": {
    title: "その他所得の所得税",
    body: "収入または閾値超過分. 雇用 Gross には加算しません。",
  },
  "other.threshold": {
    title: "免税閾値",
    body: "収入 ≤ 閾値で税率免除の場合でも申告義務が残ることがあります。",
  },
  "ot.pay": {
    title: "残業代",
    body: "日区分または深夜割増。月次 Gross に加算して所得税を概算。",
  },
  "bonus.month": {
    title: "賞与・残業月",
    body: "受取月に課税。保険基礎は原則契約賃金のまま。",
  },
  "salary.asOfMonth": {
    title: "給与月",
    body: "税年内の保険上限の適用日を決めます。税年は税率・控除、月は年途中の上限変更に使います。",
  },
});

export const TIPS: Record<LocaleCode, TipDict> = {
  vi,
  en,
  zh,
  hi,
  es,
  fr,
  ja,
};

export function getTip(locale: LocaleCode, id: TipId): TipContent {
  return TIPS[locale][id] ?? TIPS.vi[id] ?? TIPS.en[id];
}
