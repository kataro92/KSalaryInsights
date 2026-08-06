import type {
  FilingConclusion,
  FilingWizardAnswers,
  FilingWizardResult,
} from "@/src/domain/types/settlement";

export type FilingWizardOptions = {
  /** From F020 when HKD/rent/CK/ESOP (or mandatory casual) present. */
  forceSelfFile?: boolean;
};

export function evaluateFilingWizard(
  answers: FilingWizardAnswers,
  settlementYear: number,
  options?: FilingWizardOptions
): FilingWizardResult {
  const canAuthorize =
    !options?.forceSelfFile &&
    answers.hasSingleEmployerFullYear &&
    !answers.hasOtherIncome &&
    answers.employerOffersAuthorization;

  const conclusion: FilingConclusion = canAuthorize ? "authorize" : "self_file";

  const baseSelf = [
    "Tổng hợp chứng từ thu nhập từ mọi nguồn trong năm",
    "Chuẩn bị thông tin MST / đăng nhập eTax (không nhập vào app này)",
    "Đối chiếu thuế đã khấu trừ trên chứng từ với ước tính app",
    "Nộp tờ khai quyết toán đúng hạn trên cổng thuế",
  ];

  const extendedNonSalary = [
    "Giữ chứng từ HKD / cho thuê / CK / ESOP theo từng nguồn đã ước trên máy",
    "Không gộp thuế tỷ lệ HKD·thuê·CK vào biểu lũy tiến lương trừ khi luật bắt buộc",
    "Đối chiếu bảng Tổng hợp năm (F020) với từng dòng nguồn trước khi kê khai",
  ];

  const checklist =
    conclusion === "authorize"
      ? [
          "Xác nhận với kế toán công ty về ủy quyền quyết toán",
          "Cung cấp thông tin NPT (nếu có) theo mẫu công ty yêu cầu",
          "Giữ bản sao chứng từ thu nhập / bảng lương để đối chiếu",
          "Theo dõi thông báo kết quả ủy quyền từ NSDLĐ",
        ]
      : options?.forceSelfFile || answers.hasOtherIncome
        ? [...baseSelf, ...extendedNonSalary]
        : baseSelf;

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
      ...(options?.forceSelfFile
        ? [
            "Có nguồn ngoài lương HĐLĐ trên Tổng hợp năm → mặc định tự quyết toán.",
          ]
        : []),
    ],
  };
}
