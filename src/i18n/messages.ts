import type { LocaleCode } from "@/src/i18n/types";

/** Flat UI message keys. Missing keys fall back to vi then en. */
export type MessageKey =
  | "tabs.salary"
  | "tabs.settlement"
  | "tabs.benefits"
  | "tabs.settings"
  | "common.calculate"
  | "common.close"
  | "common.copy"
  | "common.copied"
  | "common.sendEmail"
  | "common.sources"
  | "common.info"
  | "common.formula"
  | "common.detail"
  | "settings.title"
  | "settings.subtitle"
  | "settings.about"
  | "settings.features"
  | "settings.featuresHint"
  | "settings.featuresFootnote"
  | "settings.region"
  | "settings.regionHint"
  | "settings.taxYear"
  | "settings.language"
  | "settings.languageHint"
  | "settings.appearance"
  | "settings.appearanceHint"
  | "settings.appearanceLight"
  | "settings.appearanceDark"
  | "settings.appearanceSystem"
  | "settings.ruleset"
  | "settings.rulesetHint"
  | "settings.checkRuleset"
  | "settings.checkingRuleset"
  | "settings.clearRulesetCache"
  | "settings.privacy"
  | "settings.showPrivacy"
  | "settings.hidePrivacy"
  | "settings.privacyBody"
  | "settings.disclaimer"
  | "settings.disclaimerBody"
  | "settings.reset"
  | "settings.resetDefaults"
  | "settings.replayOnboarding"
  | "settings.feedback"
  | "settings.feedbackHint"
  | "settings.author"
  | "settings.authorName"
  | "settings.corruptPrefs"
  | "settings.rulesetMeta"
  | "salary.breakdownTitle"
  | "salary.groupInsurance"
  | "salary.groupRelief"
  | "salary.groupPit"
  | "salary.labelGross"
  | "salary.labelBhxh"
  | "salary.labelBhyt"
  | "salary.labelBhtn"
  | "salary.labelInsuranceTotal"
  | "salary.labelAfterInsurance"
  | "salary.labelPersonalRelief"
  | "salary.labelDependentRelief"
  | "salary.labelReliefTotal"
  | "salary.labelTaxable"
  | "salary.labelPitBracket"
  | "salary.labelPitTotal"
  | "salary.labelNet"
  | "salary.eyebrowNet"
  | "settlement.refundEyebrow"
  | "settlement.payEyebrow"
  | "settlement.refundLabel"
  | "settlement.payLabel"
  | "settlement.evenTitle"
  | "other.detail"
  | "other.totalTax"
  | "other.vat"
  | "other.pit"
  | "about.role"
  | "about.body"
  | "brand.tagline"
  | "brand.guideLine"
  | "onboarding.skip"
  | "onboarding.next"
  | "onboarding.start"
  | "onboarding.privacy"
  | "onboarding.s1.title"
  | "onboarding.s1.body"
  | "onboarding.s2.title"
  | "onboarding.s2.body"
  | "onboarding.s3.title"
  | "onboarding.s3.body"
  | "onboarding.s4.title"
  | "onboarding.s4.body"
  | "calc.title"
  | "calc.subtitle"
  | "calc.withheldWarn"
  | "settlement.title"
  | "settlement.subtitle"
  | "settlement.cta"
  | "settlement.withheldWarn"
  | "annual.heading"
  | "annual.afterInsurance"
  | "annual.casual"
  | "annual.personalRelief"
  | "annual.dependentRelief"
  | "annual.reliefTotal"
  | "annual.taxable"
  | "annual.pitTotal"
  | "annual.withheld"
  | "annual.delta";

type Dict = Record<MessageKey, string>;

const vi: Dict = {
  "tabs.salary": "Lương",
  "tabs.settlement": "Quyết toán",
  "tabs.benefits": "Quyền lợi",
  "tabs.settings": "Cài đặt",
  "common.calculate": "Tính",
  "common.close": "Đóng",
  "common.copy": "Sao chép email",
  "common.copied": "Đã sao chép email",
  "common.sendEmail": "Gửi email góp ý",
  "common.sources": "Căn cứ pháp lý",
  "common.info": "Giải thích",
  "common.formula": "Công thức",
  "common.detail": "Giải thích thêm",
  "settings.title": "Cài đặt",
  "settings.subtitle":
    "Vùng lương tối thiểu, ngôn ngữ, giao diện và năm thuế (lưu trên thiết bị).",
  "settings.about": "Về chúng tôi",
  "settings.features": "Tính năng & công cụ",
  "settings.featuresHint":
    "Tình huống dùng app, lợi ích, và từng công cụ ước lương · thuế · BH.",
  "settings.featuresFootnote":
    "Mọi kết quả chỉ là ước tính tham khảo, không thay bảng lương, tờ khai hay quyết định của cơ quan thuế / BHXH.",
  "settings.region": "Vùng lương tối thiểu",
  "settings.regionHint": "Dùng làm mặc định khi tính lương.",
  "settings.taxYear": "Năm thuế",
  "settings.language": "Ngôn ngữ",
  "settings.languageHint": "Áp dụng cho giao diện và phần giải thích.",
  "settings.appearance": "Giao diện",
  "settings.appearanceHint": "Sáng, tối, hoặc theo cài đặt hệ thống.",
  "settings.appearanceLight": "Sáng",
  "settings.appearanceDark": "Tối",
  "settings.appearanceSystem": "Hệ thống",
  "settings.ruleset": "Cập nhật mức thuế · BH",
  "settings.rulesetHint":
    "Tải mức thuế và bảo hiểm mới qua mạng. Không gửi dữ liệu lương của bạn. Khi offline, app dùng bản đã cài sẵn.",
  "settings.checkRuleset": "Kiểm tra cập nhật",
  "settings.checkingRuleset": "Đang kiểm tra…",
  "settings.clearRulesetCache": "Xóa bản cập nhật đã tải",
  "settings.privacy": "Quyền riêng tư",
  "settings.showPrivacy": "Xem chi tiết",
  "settings.hidePrivacy": "Thu gọn",
  "settings.privacyBody":
    "Mọi tính toán và kịch bản chỉ lưu trên máy bạn. Không cần CCCD, MST hay sổ BHXH. Không gửi lương hay thuế lên máy chủ. Mục cập nhật chỉ tải mức thuế · BH công khai.",
  "settings.disclaimer": "Lưu ý",
  "settings.disclaimerBody":
    "KSalaryInsights chỉ ước tính. Kết quả không thay thế tư vấn pháp lý, kế toán hay quyết định của cơ quan thuế / BHXH.",
  "settings.reset": "Đặt lại",
  "settings.resetDefaults": "Về mặc định",
  "settings.replayOnboarding": "Xem lại hướng dẫn",
  "settings.feedback": "Góp ý",
  "settings.feedbackHint":
    "Báo lỗi hoặc đề xuất tính năng (mở app thư trên máy bạn).",
  "settings.author": "Tác giả",
  "settings.authorName": "Phạm Huy Đức",
  "settings.corruptPrefs":
    "Không đọc được cài đặt đã lưu. Đã dùng mặc định; bạn có thể chỉnh lại bên dưới.",
  "settings.rulesetMeta": "{count} bộ mức tính · Kiểm tra lần cuối: {when}",
  "salary.breakdownTitle": "Chi tiết tính lương",
  "salary.groupInsurance": "Bảo hiểm",
  "salary.groupRelief": "Giảm trừ gia cảnh",
  "salary.groupPit": "Thuế TNCN",
  "salary.labelGross": "Gross",
  "salary.labelBhxh": "BHXH (8%)",
  "salary.labelBhyt": "BHYT (1,5%)",
  "salary.labelBhtn": "BHTN (1%)",
  "salary.labelInsuranceTotal": "Tổng BH người lao động",
  "salary.labelAfterInsurance": "Thu nhập sau BH",
  "salary.labelPersonalRelief": "GTGC bản thân",
  "salary.labelDependentRelief": "GTGC người phụ thuộc",
  "salary.labelReliefTotal": "Tổng giảm trừ gia cảnh",
  "salary.labelTaxable": "Thu nhập tính thuế",
  "salary.labelPitBracket": "Thuế bậc {n} ({pct}%)",
  "salary.labelPitTotal": "Tổng thuế TNCN",
  "salary.labelNet": "Net",
  "salary.eyebrowNet": "Thực nhận",
  "settlement.refundEyebrow": "Ước hoàn",
  "settlement.payEyebrow": "Ước nộp thêm",
  "settlement.refundLabel": "Hoàn",
  "settlement.payLabel": "Nộp thêm",
  "settlement.evenTitle": "Khớp, không chênh lệch",
  "other.detail": "Chi tiết · {title}",
  "other.totalTax": "Tổng thuế ước tính",
  "other.vat": "GTGT",
  "other.pit": "TNCN",
  "about.role": "Trợ lý trong app",
  "about.body":
    "KSalaryInsights giúp bạn so offer Gross-Net, đối chiếu bảng lương và kiểm chứng mức BH · thuế theo năm ngay trên máy bạn. Từng khoản trừ hiện rõ. Ngài Miu hướng dẫn; kết quả không thay thế tư vấn pháp lý.",
  "brand.tagline": "Ước tính lương · thuế · bảo hiểm",
  "brand.guideLine": "Ngài Miu sẵn sàng hướng dẫn bạn",
  "onboarding.skip": "Bỏ qua",
  "onboarding.next": "Tiếp",
  "onboarding.start": "Bắt đầu",
  "onboarding.privacy":
    "Tính toán lưu trên máy bạn. Không cần CCCD, MST hay sổ BHXH.",
  "onboarding.s1.title": "Xin chào, tôi là Ngài Miu",
  "onboarding.s1.body":
    "Tôi giúp bạn ước lương, thuế và BHXH khi nhận offer, đối chiếu bảng lương, hoặc khi mức đổi theo năm.",
  "onboarding.s2.title": "Từ Gross sang Net",
  "onboarding.s2.body":
    "Quy offer về cùng một mặt, chỉnh mức đóng BH, xem thực nhận trước khi ký. Mỗi khoản trừ hiện riêng.",
  "onboarding.s3.title": "Quyết toán thuế năm",
  "onboarding.s3.body":
    "So thuế ước tính với số đã khấu trừ. Có hướng dẫn nên ủy quyền hay tự quyết toán.",
  "onboarding.s4.title": "Quyền lợi BHXH",
  "onboarding.s4.body":
    "Thai sản, ốm đau, thôi việc, thất nghiệp, hưu hoặc một lần: mỗi công cụ đứng riêng.",
  "calc.title": "Tính lương",
  "calc.subtitle": "Gross-Net · thưởng · làm thêm giờ · biểu thuế 2025 / 2026",
  "calc.withheldWarn":
    "Bạn chưa nhập thuế đã khấu trừ (đang tính = 0). Kết quả có thể lệch.",
  "settlement.title": "Quyết toán",
  "settlement.subtitle":
    "Ước hoàn thuế hoặc nộp thêm. đối chiếu bảng lương trước khi nộp tờ khai.",
  "settlement.cta": "Ước quyết toán",
  "settlement.withheldWarn":
    "Bạn chưa nhập thuế đã khấu trừ (đang tính = 0). Kết quả có thể lệch.",
  "annual.heading": "Chi tiết cả năm",
  "annual.afterInsurance": "Thu nhập sau BH (năm)",
  "annual.casual": "Trong đó vãng lai",
  "annual.personalRelief": "GTGC bản thân ×12",
  "annual.dependentRelief": "GTGC người phụ thuộc ×12",
  "annual.reliefTotal": "Tổng GTGC năm",
  "annual.taxable": "Thu nhập tính thuế (năm)",
  "annual.pitTotal": "Thuế TNCN năm",
  "annual.withheld": "Đã khấu trừ",
  "annual.delta": "Chênh lệch",
};

const en: Dict = {
  "tabs.salary": "Salary",
  "tabs.settlement": "Settlement",
  "tabs.benefits": "Benefits",
  "tabs.settings": "Settings",
  "common.calculate": "Calculate",
  "common.close": "Close",
  "common.copy": "Copy email",
  "common.copied": "Email copied",
  "common.sendEmail": "Email feedback",
  "common.sources": "References",
  "common.info": "Info",
  "common.formula": "Formula",
  "common.detail": "More detail",
  "settings.title": "Settings",
  "settings.subtitle":
    "Region, language, appearance and default tax year (stored on device).",
  "settings.about": "About",
  "settings.features": "Features & tools",
  "settings.featuresHint":
    "When to use the app, key benefits, and each pay · tax · insurance tool.",
  "settings.featuresFootnote":
    "All results are offline estimates, not a payslip, tax return, or official SI/tax decision.",
  "settings.region": "Default wage region",
  "settings.regionHint": "Applied when opening the salary calculator.",
  "settings.taxYear": "Default tax year",
  "settings.language": "Language",
  "settings.languageHint":
    "Default is Vietnamese. UI and info tips follow the selected language.",
  "settings.appearance": "Appearance",
  "settings.appearanceHint": "Light, dark, or match the system setting.",
  "settings.appearanceLight": "Light",
  "settings.appearanceDark": "Dark",
  "settings.appearanceSystem": "System",
  "settings.ruleset": "Update ruleset (F019)",
  "settings.rulesetHint":
    "Downloads public law parameters over HTTPS and never sends salary data. Offline uses the bundled set.",
  "settings.checkRuleset": "Check for ruleset updates",
  "settings.checkingRuleset": "Checking…",
  "settings.clearRulesetCache": "Clear remote ruleset cache",
  "settings.privacy": "Privacy & disclaimer",
  "settings.showPrivacy": "Show statement",
  "settings.hidePrivacy": "Collapse",
  "settings.privacyBody":
    "Calculations, scenarios and settings stay on device. No national ID / tax ID / SI book required. Salary data is not uploaded. Ruleset updates only fetch public parameter files.",
  "settings.disclaimer": "Disclaimer",
  "settings.disclaimerBody":
    "KSalaryInsights is an estimate tool only. Results do not replace legal, accounting or authority decisions.",
  "settings.reset": "Reset",
  "settings.resetDefaults": "Reset to defaults",
  "settings.replayOnboarding": "Replay guide with Ngài Miu",
  "settings.feedback": "Feedback",
  "settings.feedbackHint":
    "Suggest features, report bugs or share feedback. Opens your mail app.",
  "settings.author": "Author",
  "settings.authorName": "Phạm Huy Đức",
  "settings.corruptPrefs":
    "Could not read saved settings. System defaults applied; you can change them below.",
  "settings.rulesetMeta": "{count} rulesets · Last check: {when}",
  "salary.breakdownTitle": "Salary breakdown",
  "salary.groupInsurance": "Insurance",
  "salary.groupRelief": "Family relief",
  "salary.groupPit": "Personal income tax",
  "salary.labelGross": "Gross",
  "salary.labelBhxh": "SI (8%)",
  "salary.labelBhyt": "HI (1.5%)",
  "salary.labelBhtn": "UI (1%)",
  "salary.labelInsuranceTotal": "Total employee insurance",
  "salary.labelAfterInsurance": "Income after insurance",
  "salary.labelPersonalRelief": "Personal relief",
  "salary.labelDependentRelief": "Dependent relief",
  "salary.labelReliefTotal": "Total family relief",
  "salary.labelTaxable": "Taxable income",
  "salary.labelPitBracket": "Bracket {n} ({pct}%)",
  "salary.labelPitTotal": "Total PIT",
  "salary.labelNet": "Net",
  "salary.eyebrowNet": "Take-home",
  "settlement.refundEyebrow": "Est. Refund",
  "settlement.payEyebrow": "Est. Extra due",
  "settlement.refundLabel": "Refund",
  "settlement.payLabel": "Extra due",
  "settlement.evenTitle": "Balanced, no difference",
  "other.detail": "Detail · {title}",
  "other.totalTax": "Estimated tax total",
  "other.vat": "VAT",
  "other.pit": "PIT",
  "about.role": "In-app guide assistant",
  "about.body":
    "KSalaryInsights helps you compare Gross-Net offers, check payslips, and verify tax · SI rates by year offline on your device. Deductions stay transparent. Ngài Miu guides; results are not legal advice.",
  "brand.tagline": "Estimate pay · tax · insurance",
  "brand.guideLine": "Ngài Miu is ready to guide you",
  "onboarding.skip": "Skip",
  "onboarding.next": "Next",
  "onboarding.start": "Start with Ngài Miu",
  "onboarding.privacy":
    "Calculations stay on device. No national ID / tax ID / SI book required.",
  "onboarding.s1.title": "Hello, I am Ngài Miu",
  "onboarding.s1.body":
    "I help you estimate pay, tax and SI when comparing offers, checking a payslip, or when rates change by year.",
  "onboarding.s2.title": "Gross ↔ Net",
  "onboarding.s2.body":
    "Put offers on the same footing, set the SI base, see take-home before you sign. Each deduction stays visible.",
  "onboarding.s3.title": "Annual tax settlement",
  "onboarding.s3.body":
    "Compare withheld tax with estimated liability. Includes a filing wizard.",
  "onboarding.s4.title": "SI benefits",
  "onboarding.s4.body":
    "Maternity, sick leave, severance, unemployment, pension / lump sum: each tool is independent.",
  "calc.title": "Salary calculator",
  "calc.subtitle":
    "Gross ↔ Net offline · Tet bonus · OT · 2025 / 2026 tax schedules",
  "calc.withheldWarn":
    "You did not enter withheld tax (using 0); results may be off.",
  "settlement.title": "Settlement",
  "settlement.subtitle":
    "Estimate annual PIT settlement. Cross-check your payslip before filing.",
  "settlement.cta": "Estimate settlement",
  "settlement.withheldWarn":
    "You did not enter withheld tax (using 0); results may be off.",
  "annual.heading": "Annual breakdown",
  "annual.afterInsurance": "Income after SI (year)",
  "annual.casual": "Of which casual",
  "annual.personalRelief": "Personal relief ×12",
  "annual.dependentRelief": "Dependent relief ×12",
  "annual.reliefTotal": "Total family relief (year)",
  "annual.taxable": "Taxable income (year)",
  "annual.pitTotal": "Annual PIT",
  "annual.withheld": "Withheld",
  "annual.delta": "Difference",
};

const zh: Dict = {
  ...en,
  "tabs.salary": "工资",
  "tabs.settlement": "汇算",
  "tabs.benefits": "权益",
  "tabs.settings": "设置",
  "common.calculate": "计算",
  "common.close": "关闭",
  "common.copy": "复制邮箱",
  "common.copied": "已复制邮箱",
  "common.sendEmail": "发送反馈邮件",
  "common.sources": "参考来源",
  "common.info": "说明",
  "common.formula": "计算公式",
  "common.detail": "补充说明",
  "settings.title": "设置",
  "settings.subtitle": "工资地区、语言与默认税年. 保存在本机。",
  "settings.about": "关于",
  "settings.region": "默认工资地区",
  "settings.taxYear": "默认税年",
  "settings.language": "语言",
  "settings.feedback": "意见反馈",
  "settings.author": "作者",
  "salary.breakdownTitle": "工资明细",
  "salary.groupInsurance": "保险",
  "salary.groupRelief": "家庭减免",
  "salary.groupPit": "个人所得税",
  "salary.labelNet": "净额",
  "salary.eyebrowNet": "实发",
  "settlement.refundEyebrow": "预计退税",
  "settlement.payEyebrow": "预计补税",
  "about.role": "应用内向导",
};

const hi: Dict = {
  ...en,
  "tabs.salary": "वेतन",
  "tabs.settlement": "निपटान",
  "tabs.benefits": "लाभ",
  "tabs.settings": "सेटिंग्स",
  "common.calculate": "गणना",
  "common.close": "बंद",
  "common.copy": "ईमेल कॉपी",
  "common.copied": "ईमेल कॉपी हो गया",
  "common.sendEmail": "प्रतिक्रिया ईमेल",
  "common.sources": "संदर्भ",
  "common.info": "जानकारी",
  "common.formula": "सूत्र",
  "common.detail": "अतिरिक्त विवरण",
  "settings.title": "सेटिंग्स",
  "settings.language": "भाषा",
  "settings.feedback": "प्रतिक्रिया",
  "settings.author": "लेखक",
  "salary.breakdownTitle": "वेतन विवरण",
  "salary.labelNet": "नेट",
  "salary.eyebrowNet": "हाथ में",
};

const es: Dict = {
  ...en,
  "tabs.salary": "Salario",
  "tabs.settlement": "Liquidación",
  "tabs.benefits": "Beneficios",
  "tabs.settings": "Ajustes",
  "common.calculate": "Calcular",
  "common.close": "Cerrar",
  "common.copy": "Copiar email",
  "common.copied": "Email copiado",
  "common.sendEmail": "Enviar opinión",
  "common.sources": "Referencias",
  "common.info": "Info",
  "common.formula": "Fórmula",
  "common.detail": "Más detalle",
  "settings.title": "Ajustes",
  "settings.language": "Idioma",
  "settings.feedback": "Comentarios",
  "settings.author": "Autor",
  "salary.breakdownTitle": "Desglose salarial",
  "salary.labelNet": "Neto",
  "salary.eyebrowNet": "Neto a percibir",
  "settlement.refundEyebrow": "Devolución est.",
  "settlement.payEyebrow": "Pago extra est.",
};

const fr: Dict = {
  ...en,
  "tabs.salary": "Salaire",
  "tabs.settlement": "Régularisation",
  "tabs.benefits": "Droits",
  "tabs.settings": "Réglages",
  "common.calculate": "Calculer",
  "common.close": "Fermer",
  "common.copy": "Copier l’e-mail",
  "common.copied": "E-mail copié",
  "common.sendEmail": "Envoyer un avis",
  "common.sources": "Références",
  "common.info": "Info",
  "common.formula": "Formule",
  "common.detail": "Détail",
  "settings.title": "Réglages",
  "settings.language": "Langue",
  "settings.feedback": "Avis",
  "settings.author": "Auteur",
  "salary.breakdownTitle": "Détail du salaire",
  "salary.labelNet": "Net",
  "salary.eyebrowNet": "Net à payer",
  "settlement.refundEyebrow": "Remboursement est.",
  "settlement.payEyebrow": "Complément est.",
};

const ja: Dict = {
  ...en,
  "tabs.salary": "給与",
  "tabs.settlement": "確定申告",
  "tabs.benefits": "給付",
  "tabs.settings": "設定",
  "common.calculate": "計算",
  "common.close": "閉じる",
  "common.copy": "メールをコピー",
  "common.copied": "コピーしました",
  "common.sendEmail": "フィードバックを送る",
  "common.sources": "根拠",
  "common.info": "説明",
  "common.formula": "計算式",
  "common.detail": "補足",
  "settings.title": "設定",
  "settings.language": "言語",
  "settings.feedback": "ご意見",
  "settings.author": "作者",
  "salary.breakdownTitle": "給与内訳",
  "salary.labelNet": "手取り",
  "salary.eyebrowNet": "実受取",
  "settlement.refundEyebrow": "還付見込み",
  "settlement.payEyebrow": "追加見込み",
};

export const MESSAGES: Record<LocaleCode, Dict> = {
  vi,
  en,
  zh,
  hi,
  es,
  fr,
  ja,
};

export function translate(
  locale: LocaleCode,
  key: MessageKey,
  vars?: Record<string, string | number>
): string {
  const raw =
    MESSAGES[locale][key] ?? MESSAGES.vi[key] ?? MESSAGES.en[key] ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    raw
  );
}
