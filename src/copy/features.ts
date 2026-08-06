import type { LocaleCode } from "@/src/i18n/types";
import type { AppIconName } from "@/src/components/common/AppIcon";

export type AppFeature = {
  id: string;
  icon: AppIconName;
  title: string;
  benefit: string;
};

export type AppSituation = {
  id: string;
  title: string;
  body: string;
};

type FeaturesCopy = {
  intro: string;
  situationsTitle: string;
  situations: AppSituation[];
  benefitsTitle: string;
  benefits: string[];
  toolsTitle: string;
  tools: AppFeature[];
};

const vi: FeaturesCopy = {
  intro:
    "KSalaryInsights giúp bạn tự tính thử lương Gross-Net, quyết toán thuế thu nhập cá nhân và quyền lợi bảo hiểm xã hội khi nhận offer, đối chiếu bảng lương, hoặc khi mức thuế, bảo hiểm đổi theo năm. Mọi bước hiện công thức và căn cứ, không hộp đen.",
  situationsTitle: "Khi nào nên dùng",
  situations: [
    {
      id: "offer",
      title: "So sánh offer Gross và Net",
      body: "Nhà tuyển dụng lúc nói Gross, lúc nói Net; mức đóng bảo hiểm có thể theo lương cơ bản, một phần, hoặc toàn bộ lương. Hai offer 28 triệu Net và 32 triệu Gross không so được nếu chưa quy về cùng một mặt. App đổi Gross và Net, chỉnh mức đóng bảo hiểm riêng để bạn thấy thực nhận gần đúng trước khi ký.",
    },
    {
      id: "payslip",
      title: "Bảng lương thấp hơn mức đã nghe",
      body: "Công ty báo mức cao, cuối tháng nhận ít hơn mà không rõ bị trừ vì bảo hiểm, giảm trừ gia cảnh hay thuế bậc nào. Tính lại trên máy, tách từng dòng trừ, rồi đối chiếu phiếu lương và lưu kịch bản để lần chuyển việc sau không bị bất ngờ.",
    },
    {
      id: "rules-change",
      title: "Mức bảo hiểm và thuế đổi hàng năm",
      body: "Trần bảo hiểm, giảm trừ gia cảnh và biểu thuế đổi theo năm (ví dụ 2025 sang 2026). Không cần nghiệp vụ kế toán: chọn năm thuế, nhập số liệu, xem chênh Net / thuế giữa hai kỳ để tự kiểm chứng mức công ty áp dụng.",
    },
    {
      id: "settlement",
      title: "Trước mùa quyết toán",
      body: "Tính thử thuế cả năm so với số đã khấu trừ để biết sớm khả năng hoàn hoặc nộp thêm, rồi xem hướng dẫn nên ủy quyền công ty hay tự nộp.",
    },
    {
      id: "benefits",
      title: "Nghỉ việc, thai sản, thất nghiệp…",
      body: "Khi cần tính thử trợ cấp thôi việc, thất nghiệp, tiền thai sản, tiền nghỉ ốm hoặc so lương hưu với bảo hiểm xã hội một lần. Mỗi công cụ đứng riêng, có điều kiện và trần hiện rõ.",
    },
    {
      id: "side-income",
      title: "Có thu nhập ngoài lương",
      body: "Cho thuê, hộ kinh doanh / freelancer, chứng khoán, ESOP hoặc thu nhập vãng lai: thuế giá trị gia tăng và thuế thu nhập cá nhân được tách dòng, kèm ngưỡng miễn theo năm thuế. App không tính thuế coin / tài sản mã hóa.",
    },
    {
      id: "multi-source",
      title: "Tự quyết toán nhiều nguồn",
      body: "Bảng tổng hợp năm: gộp lương và các thu nhập khác trên máy để thấy tổng thuế, số đã nộp và chênh lệch. App không nộp tờ khai thay bạn và không tính thuế coin.",
    },
  ],
  benefitsTitle: "Lợi ích chính",
  benefits: [
    "Thấy rõ từng khoản trừ như bảo hiểm, giảm trừ gia cảnh và thuế theo bậc để dễ đối chiếu bảng lương.",
    "Gắn năm thuế 2025 / 2026 để dùng đúng biểu thuế và mức giảm trừ, giảm rủi ro dùng nhầm mức.",
    "Dữ liệu và kịch bản lưu trên máy, không bắt buộc tài khoản hay gửi lên máy chủ.",
    "Bấm biểu tượng thông tin để xem công thức, ví dụ và căn cứ pháp lý.",
  ],
  toolsTitle: "Công cụ trong app",
  tools: [
    {
      id: "salary",
      icon: "calculator",
      title: "Tính lương",
      benefit:
        "Tính Gross sang Net hoặc Net sang Gross theo tháng: bảo hiểm, giảm trừ gia cảnh, biểu thuế lũy tiến. Có thưởng và làm thêm giờ.",
    },
    {
      id: "offer-compare",
      icon: "circle-dollar",
      title: "So 2 offer",
      benefit:
        "Hai cột Gross/Net độc lập, cùng năm thuế, vùng và số người phụ thuộc. Hiện chênh Net / Gross ước tính, không khuyên chọn.",
    },
    {
      id: "multi-source",
      icon: "file-text",
      title: "Tổng hợp năm",
      benefit:
        "Gộp lương, cho thuê, hộ kinh doanh, chứng khoán, ESOP và thu nhập vãng lai thành bảng thuế năm ước tính; không coin, không nộp tờ khai.",
    },
    {
      id: "settlement",
      icon: "file-text",
      title: "Quyết toán năm",
      benefit:
        "Tính thử thuế cả năm so với số đã khấu trừ để biết sớm khả năng hoàn hoặc nộp thêm trước khi kê khai.",
    },
    {
      id: "maternity",
      icon: "baby",
      title: "Thai sản",
      benefit:
        "Tính tiền thai sản theo tháng nghỉ và khoản một lần, tách khỏi lương Gross-Net.",
    },
    {
      id: "sick",
      icon: "heart-pulse",
      title: "Nghỉ ốm",
      benefit:
        "Tính tiền nghỉ ốm theo ngày, có giới hạn theo năm đóng; công thức cắt trần hiện rõ.",
    },
    {
      id: "retirement",
      icon: "landmark",
      title: "Lương hưu / nhận một lần",
      benefit:
        "So hai hướng (lương hưu và nhận bảo hiểm xã hội một lần) để tự cân nhắc. App không khuyên chọn bên nào.",
    },
    {
      id: "severance",
      icon: "briefcase",
      title: "Thôi việc / mất việc",
      benefit:
        "Tính tiền trợ cấp theo Bộ luật Lao động, đã trừ thời gian đóng bảo hiểm thất nghiệp và phần đã chi.",
    },
    {
      id: "unemployment",
      icon: "coins",
      title: "Trợ cấp thất nghiệp",
      benefit:
        "Tính khoản trợ cấp theo mức 60% lương bình quân, có trần 5 × lương tối thiểu vùng và điều kiện hưởng.",
    },
    {
      id: "other",
      icon: "circle-dollar",
      title: "Thu nhập khác",
      benefit:
        "Cho thuê, hộ kinh doanh, chứng khoán, ESOP, thu nhập vãng lai: thuế giá trị gia tăng và thuế thu nhập cá nhân tách dòng, có ngưỡng miễn.",
    },
  ],
};

const en: FeaturesCopy = {
  intro:
    "KSalaryInsights helps you estimate Gross-Net pay, annual PIT settlement, and SI benefits when comparing offers, checking a payslip, or when tax and insurance rates change by year. Every step shows formulas and legal bases, with no black box.",
  situationsTitle: "When to use it",
  situations: [
    {
      id: "offer",
      title: "Compare Gross vs Net offers",
      body: "Recruiters quote Gross one day and Net the next; insurance may be on base pay, partial pay, or full salary. A 28M Net offer and a 32M Gross offer are not comparable until you convert them. Switch Gross ↔ Net and set a custom SI base to see take-home before you sign.",
    },
    {
      id: "payslip",
      title: "Payslip lower than expected",
      body: "You heard a high figure, then received much less without knowing what was deducted. Recalculate on your device, see each insurance, relief, and tax line, match the payslip, then save the scenario so the next job change is clearer.",
    },
    {
      id: "rules-change",
      title: "Rates change every year",
      body: "SI caps, family relief, and PIT brackets change by tax year (e.g. 2025 → 2026). No accounting background needed: pick the year, enter your numbers, and compare Net / tax across periods to sanity-check what your employer applied.",
    },
    {
      id: "settlement",
      title: "Before annual filing",
      body: "Estimate annual tax vs withholding to see a likely refund or top-up early, then use the wizard for authorize-vs-self-file guidance.",
    },
    {
      id: "benefits",
      title: "Leave, job loss, maternity…",
      body: "Estimate severance, unemployment, maternity, sick leave, or compare pension vs lump-sum SI. Each tool stands alone with conditions and caps shown.",
    },
    {
      id: "side-income",
      title: "Income beyond salary",
      body: "Rent, household / sole-trader business (freelancer), securities, ESOP, or casual pay: estimate VAT / PIT on separate lines, with exemption thresholds for the tax year. Crypto / digital-asset tax is out of scope.",
    },
    {
      id: "multi-source",
      title: "Self-file with several sources",
      body: "Annual summary: combine salary and other on-device estimates to see tax / withheld / delta. Still does not file for you. Crypto tax is out of scope.",
    },
  ],
  benefitsTitle: "Key benefits",
  benefits: [
    "See each deduction clearly (insurance, family relief, bracket tax) to match a payslip easily.",
    "Tax years 2025 / 2026 use the correct brackets and relief for that income year.",
    "Data and scenarios stay on your device, with no account required and nothing uploaded by default.",
    "Tap the info icon for formula, examples, and statute references.",
  ],
  toolsTitle: "Tools in the app",
  tools: [
    {
      id: "salary",
      icon: "calculator",
      title: "Salary calculator",
      benefit:
        "Gross ↔ Net by month: insurance base (full / % contract / fixed), family relief, progressive PIT. Supports bonus and overtime.",
    },
    {
      id: "offer-compare",
      icon: "circle-dollar",
      title: "Compare 2 offers",
      benefit:
        "Two independent Gross/Net columns with shared tax year · region · dependents; shows estimated ΔNet / ΔGross. No advice on which to pick.",
    },
    {
      id: "multi-source",
      icon: "file-text",
      title: "Annual multi-source",
      benefit:
        "Combine salary + HKD/rent/securities/ESOP/casual into one estimated annual tax table; no crypto, no filing.",
    },
    {
      id: "settlement",
      icon: "file-text",
      title: "Annual settlement",
      benefit:
        "Compare estimated annual tax with withholding to see refund or extra due before filing.",
    },
    {
      id: "maternity",
      icon: "baby",
      title: "Maternity",
      benefit:
        "Estimate monthly leave pay and lump-sum aid, separate from Gross-Net salary.",
    },
    {
      id: "sick",
      icon: "heart-pulse",
      title: "Sick leave",
      benefit:
        "Estimate daily sick pay with year-of-contribution caps; cutoffs shown in the formula.",
    },
    {
      id: "retirement",
      icon: "landmark",
      title: "Pension / lump-sum SI",
      benefit:
        "Compare pension vs one-time withdrawal paths. The app does not recommend either option.",
    },
    {
      id: "severance",
      icon: "briefcase",
      title: "Severance / job loss",
      benefit:
        "Estimate Labor Code severance, netting UI contribution periods and amounts already paid.",
    },
    {
      id: "unemployment",
      icon: "coins",
      title: "Unemployment benefit",
      benefit:
        "Estimate 60% of pay capped at 5 × regional minimum wage, with eligibility notes.",
    },
    {
      id: "other",
      icon: "circle-dollar",
      title: "Other income",
      benefit:
        "Rent, household business, securities, ESOP, casual: VAT and PIT on separate lines, with thresholds.",
    },
  ],
};

const COPY: Record<LocaleCode, FeaturesCopy> = {
  vi,
  en,
  zh: en,
  hi: en,
  es: en,
  fr: en,
  ja: en,
};

export function getFeaturesCopy(locale: LocaleCode): FeaturesCopy {
  return COPY[locale] ?? COPY.vi;
}
