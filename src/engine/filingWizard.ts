import type {
  FilingConclusion,
  FilingWizardAnswers,
  FilingWizardResult,
} from "@/src/domain/types/settlement";

export function evaluateFilingWizard(
  answers: FilingWizardAnswers,
  settlementYear: number
): FilingWizardResult {
  const canAuthorize =
    answers.hasSingleEmployerFullYear &&
    !answers.hasOtherIncome &&
    answers.employerOffersAuthorization;

  const conclusion: FilingConclusion = canAuthorize ? "authorize" : "self_file";

  const checklist =
    conclusion === "authorize"
      ? [
          "Xác nhận với kế toán công ty về ủy quyền quyết toán",
          "Cung cấp thông tin NPT (nếu có) theo mẫu công ty yêu cầu",
          "Giữ bản sao chứng từ thu nhập / bảng lương để đối chiếu",
          "Theo dõi thông báo kết quả ủy quyền từ NSDLĐ",
        ]
      : [
          "Tổng hợp chứng từ thu nhập từ mọi nguồn trong năm",
          "Chuẩn bị thông tin MST / đăng nhập eTax (không nhập vào app này)",
          "Đối chiếu thuế đã khấu trừ trên chứng từ với ước tính app",
          "Nộp tờ khai quyết toán đúng hạn trên cổng thuế",
        ];

  return {
    conclusion,
    checklist,
    orgDeadlineLabel: `31/03/${
      settlementYear + 1
    } (tổ chức/ủy quyền. Hướng dẫn từng năm)`,
    individualDeadlineLabel: `Đầu tháng 5/${
      settlementYear + 1
    } (cá nhân tự quyết toán. Theo hướng dẫn năm)`,
    notes: [
      "App chỉ hướng dẫn, không nộp tờ khai thay bạn.",
      "Luôn đối chiếu văn bản / cổng thuế chính thức trước khi nộp.",
    ],
  };
}
