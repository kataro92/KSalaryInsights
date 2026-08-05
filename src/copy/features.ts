import type { LocaleCode } from "@/src/i18n/types";
import type { AppIconName } from "@/src/components/common/AppIcon";

export type AppFeature = {
  id: string;
  icon: AppIconName;
  title: string;
  benefit: string;
};

type FeaturesCopy = {
  intro: string;
  benefitsTitle: string;
  benefits: string[];
  toolsTitle: string;
  tools: AppFeature[];
};

const vi: FeaturesCopy = {
  intro:
    "KVSalaryTools ước lương Gross–Net, quyết toán TNCN, quyền lợi BHXH và thu nhập khác theo năm thuế bạn chọn. Mỗi bước hiện công thức và căn cứ, không hộp đen.",
  benefitsTitle: "Lợi ích chính",
  benefits: [
    "Thấy rõ từng khoản trừ (BH, GTGC, thuế theo bậc) để dễ đối chiếu bảng lương.",
    "Gắn năm thuế 2025 / 2026 (biểu & GTGC đúng kỳ), giảm rủi ro dùng nhầm mức.",
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
        "Gross ↔ Net theo tháng: bảo hiểm, giảm trừ gia cảnh, biểu lũy tiến. Có thưởng và làm thêm giờ.",
    },
    {
      id: "settlement",
      icon: "file-text",
      title: "Quyết toán năm",
      benefit:
        "Ước thuế cả năm so với đã khấu trừ để biết sớm khả năng hoàn hoặc nộp thêm trước khi kê khai.",
    },
    {
      id: "maternity",
      icon: "baby",
      title: "Thai sản",
      benefit:
        "Ước trợ cấp theo tháng nghỉ và khoản một lần, tách khỏi lương Gross–Net.",
    },
    {
      id: "sick",
      icon: "heart-pulse",
      title: "Ốm đau",
      benefit:
        "Ước trợ cấp ốm theo ngày, có trần theo năm đóng; công thức cắt trần hiện rõ.",
    },
    {
      id: "retirement",
      icon: "landmark",
      title: "Hưu / BHXH một lần",
      benefit:
        "So hai hướng (lương hưu vs rút một lần) để tự cân nhắc. App không khuyên chọn bên nào.",
    },
    {
      id: "severance",
      icon: "briefcase",
      title: "Thôi việc / mất việc",
      benefit:
        "Ước trợ cấp theo Bộ luật Lao động, đã trừ thời gian đóng BHTN và phần đã chi.",
    },
    {
      id: "unemployment",
      icon: "coins",
      title: "Trợ cấp thất nghiệp",
      benefit:
        "Ước 60% lương với trần 5 × lương tối thiểu vùng, kèm điều kiện hưởng.",
    },
    {
      id: "other",
      icon: "circle-dollar",
      title: "Thu nhập khác",
      benefit:
        "Cho thuê, hộ kinh doanh, chứng khoán, ESOP, vãng lai: GTGT và TNCN tách dòng, có ngưỡng miễn.",
    },
  ],
};

const en: FeaturesCopy = {
  intro:
    "KVSalaryTools estimates Gross–Net pay, annual PIT settlement, social-insurance benefits, and other income for the tax year you pick. Every step shows formulas and legal bases, with no black box.",
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
        "Gross ↔ Net by month: insurance, family relief, progressive PIT. Supports bonus and overtime.",
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
        "Estimate monthly leave pay and lump-sum aid, separate from Gross–Net salary.",
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
