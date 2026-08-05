import type { LocaleCode, TipContent, TipId } from '@/src/i18n/types';

type TipDict = Record<TipId, TipContent>;

const vi: TipDict = {
  'salary.gross': {
    title: 'Lương Gross',
    body: 'Tổng thu nhập trước khi trừ bảo hiểm bắt buộc và thuế TNCN. Là căn cứ ước tính trong máy tính lương.',
    sources: ['Luật TNCN 109/2025; docs/domain/thue-tncn.md'],
  },
  'salary.bhxh': {
    title: 'BHXH người lao động (8%)',
    body: 'Người lao động đóng 8% trên mức lương đóng BHXH (sau khi áp trần). Tỷ lệ lấy từ ruleset năm / giai đoạn.',
    sources: ['Luật BHXH 41/2024/QH15 Đ.33 k.1a'],
  },
  'salary.bhyt': {
    title: 'BHYT người lao động (1,5%)',
    body: 'Người lao động đóng 1,5% trên mức lương đóng BH. Trần cùng nhóm với BHXH theo ruleset.',
    sources: ['Khung đóng BHYT phổ biến; tham số trong ruleset bundled'],
  },
  'salary.bhtn': {
    title: 'BHTN người lao động (1%)',
    body: 'Người lao động đóng 1% trên mức lương đóng BHTN (trần theo LTTV vùng × hệ số trong ruleset).',
    sources: ['Luật Việc làm 74/2025; tham số ruleset'],
  },
  'salary.insuranceTotal': {
    title: 'Tổng BH người lao động',
    body: 'Tổng BHXH + BHYT + BHTN phía NLĐ trong tháng. Trừ khỏi Gross trước khi tính GTGC và thuế.',
    sources: ['docs/domain/bhxh-bhyt-bhtn.md'],
  },
  'salary.afterInsurance': {
    title: 'Thu nhập sau BH',
    body: 'Gross − tổng BH NLĐ. Là đầu vào bước giảm trừ gia cảnh.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'salary.personalRelief': {
    title: 'GTGC bản thân',
    body: 'Khoản giảm trừ cố định cho bản thân theo ruleset năm thuế (ví dụ 15,5 triệu/tháng năm 2026).',
    sources: ['Luật 109/2025; NQ liên quan GTGC — tham số ruleset'],
  },
  'salary.dependentRelief': {
    title: 'GTGC người phụ thuộc',
    body: 'Mỗi NPT hợp lệ được giảm trừ theo mức ruleset × số NPT bạn nhập (app không xác minh hồ sơ NPT).',
    sources: ['Luật TNCN; TT hướng dẫn NPT'],
  },
  'salary.reliefTotal': {
    title: 'Tổng giảm trừ gia cảnh',
    body: 'GTGC bản thân + GTGC NPT. Trừ tiếp sau BH để ra thu nhập tính thuế.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'salary.taxable': {
    title: 'Thu nhập tính thuế (TNTT)',
    body: 'Thu nhập sau BH − tổng GTGC (không âm). Là căn cứ áp biểu thuế lũy tiến.',
    sources: ['Luật TNCN — biểu lũy tiến theo ruleset'],
  },
  'salary.pit': {
    title: 'Thuế TNCN',
    body: 'Thuế thu nhập cá nhân theo biểu lũy tiến của ruleset năm. Breakdown từng bậc hiển thị bên dưới.',
    sources: ['Luật 109/2025 (2026); Luật TNCN cũ (2025) — ruleset tương ứng'],
  },
  'salary.net': {
    title: 'Net (thực nhận ước)',
    body: 'Gross − BH NLĐ − thuế TNCN. Đây là ước tính offline, không thay bảng lương chính thức.',
    sources: ['Công thức engine; docs/domain/thue-tncn.md'],
  },
  'settlement.refund': {
    title: 'Ước hoàn thuế',
    body: 'Thuế năm ước < tổng đã khấu trừ → chênh lệch mang dấu hoàn. Đối chiếu chứng từ trước khi nộp.',
    sources: ['Quyết toán TNCN; docs/domain/thue-tncn.md mục quyết toán'],
  },
  'settlement.pay': {
    title: 'Ước nộp thêm',
    body: 'Thuế năm ước > đã khấu trừ → cần nộp thêm phần chênh. Chỉ là ước tính trong app.',
    sources: ['Quyết toán TNCN; NĐ hướng dẫn liên quan'],
  },
  'settlement.even': {
    title: 'Khớp',
    body: 'Thuế năm ước bằng đã khấu trừ (sai số làm tròn). Vẫn nên đối chiếu bảng lương / chứng từ.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'other.vat': {
    title: 'Thuế GTGT (ước)',
    body: 'Sắc thuế giá trị gia tăng theo tỷ lệ ngành / loại thu nhập trong ruleset. Tách khỏi TNCN.',
    sources: ['Luật GTGT 2024 Đ.12; NĐ 68/141/2026'],
  },
  'other.pit': {
    title: 'Thuế TNCN (thu nhập khác)',
    body: 'TNCN theo tỷ lệ trên doanh thu hoặc phần vượt ngưỡng — không gộp vào Gross HĐLĐ.',
    sources: ['Luật 109/2025 Đ.7; NĐ 68/141/253/2026'],
  },
  'other.threshold': {
    title: 'Ngưỡng miễn',
    body: 'Doanh thu ≤ ngưỡng ruleset (thường 1 tỷ/năm) có thể miễn thuế tỷ lệ nhưng vẫn có nghĩa vụ kê khai / thông báo.',
    sources: ['NĐ 141/2026; NĐ 68/2026'],
  },
  'ot.pay': {
    title: 'Tiền OT',
    body: 'Làm thêm giờ theo hệ số ngày (150/200/300%) hoặc ban đêm (200/270/390%). Cộng vào Gross tháng để ước PIT.',
    sources: ['BLLĐ 2019 Đ.98; NĐ 145/2020 Đ.55–57'],
  },
  'bonus.month': {
    title: 'Tháng có thưởng / OT',
    body: 'Thưởng và OT chịu thuế trong tháng nhận. Mức đóng BH mặc định giữ theo lương căn cứ (không cộng thưởng/OT).',
    sources: ['docs/domain/thue-tncn.md; F009/F010'],
  },
};

const en: TipDict = {
  'salary.gross': {
    title: 'Gross salary',
    body: 'Total income before mandatory insurance and PIT. Base input for the salary calculator.',
    sources: ['PIT Law 109/2025; docs/domain/thue-tncn.md'],
  },
  'salary.bhxh': {
    title: 'Employee social insurance (8%)',
    body: 'Employee pays 8% of the SI contribution base (after the cap). Rates come from the selected ruleset.',
    sources: ['Social Insurance Law 41/2024 Art. 33.1a'],
  },
  'salary.bhyt': {
    title: 'Employee health insurance (1.5%)',
    body: 'Employee pays 1.5% of the contribution base. Cap follows the ruleset with SI.',
    sources: ['Health insurance framework; bundled ruleset'],
  },
  'salary.bhtn': {
    title: 'Employee unemployment insurance (1%)',
    body: 'Employee pays 1% of the UI base (regional minimum wage × multiplier in the ruleset).',
    sources: ['Employment Law 74/2025; ruleset params'],
  },
  'salary.insuranceTotal': {
    title: 'Total employee insurance',
    body: 'SI + HI + UI for the employee this month. Deducted from Gross before family relief and PIT.',
    sources: ['docs/domain/bhxh-bhyt-bhtn.md'],
  },
  'salary.afterInsurance': {
    title: 'Income after insurance',
    body: 'Gross − employee insurance. Input to family-circumstance relief.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'salary.personalRelief': {
    title: 'Personal relief',
    body: 'Fixed personal deduction from the tax-year ruleset (e.g. 15.5M VND/month in 2026).',
    sources: ['Law 109/2025; ruleset parameters'],
  },
  'salary.dependentRelief': {
    title: 'Dependent relief',
    body: 'Per eligible dependent × ruleset amount × count you enter (the app does not verify dependents).',
    sources: ['PIT Law; dependent guidance circulars'],
  },
  'salary.reliefTotal': {
    title: 'Total family relief',
    body: 'Personal + dependent relief. Subtracted after insurance to get taxable income.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'salary.taxable': {
    title: 'Taxable income',
    body: 'Income after insurance − total relief (floored at 0). Base for progressive PIT brackets.',
    sources: ['PIT Law — progressive schedule in ruleset'],
  },
  'salary.pit': {
    title: 'Personal income tax',
    body: 'PIT by the progressive schedule of the selected ruleset. Bracket detail is shown below.',
    sources: ['Law 109/2025 (2026); prior PIT law (2025)'],
  },
  'salary.net': {
    title: 'Net (estimated take-home)',
    body: 'Gross − employee insurance − PIT. Offline estimate only — not an official payslip.',
    sources: ['Engine formula; docs/domain/thue-tncn.md'],
  },
  'settlement.refund': {
    title: 'Estimated refund',
    body: 'Annual tax estimate < withheld → refund delta. Cross-check documents before filing.',
    sources: ['Annual PIT settlement guidance'],
  },
  'settlement.pay': {
    title: 'Estimated extra payment',
    body: 'Annual tax estimate > withheld → pay the difference. In-app estimate only.',
    sources: ['Annual PIT settlement guidance'],
  },
  'settlement.even': {
    title: 'Balanced',
    body: 'Annual estimate matches withheld (within rounding). Still verify against payslips.',
    sources: ['docs/domain/thue-tncn.md'],
  },
  'other.vat': {
    title: 'VAT (estimate)',
    body: 'Value-added tax by industry/income type rates in the ruleset. Separate from PIT.',
    sources: ['VAT Law 2024 Art. 12; Decrees 68/141/2026'],
  },
  'other.pit': {
    title: 'PIT (other income)',
    body: 'PIT on revenue or excess over the threshold — not added to employment Gross.',
    sources: ['Law 109/2025 Art. 7; Decrees 68/141/253/2026'],
  },
  'other.threshold': {
    title: 'Exemption threshold',
    body: 'Revenue ≤ ruleset threshold (often 1B VND/year) may be rate-exempt but reporting can still apply.',
    sources: ['Decree 141/2026; Decree 68/2026'],
  },
  'ot.pay': {
    title: 'Overtime pay',
    body: 'OT by day type (150/200/300%) or night (200/270/390%). Added to monthly Gross for PIT estimate.',
    sources: ['Labor Code 2019 Art. 98; Decree 145/2020'],
  },
  'bonus.month': {
    title: 'Bonus / OT month',
    body: 'Bonus and OT are taxed in the receipt month. Insurance base stays on contractual pay by default.',
    sources: ['docs/domain/thue-tncn.md; F009/F010'],
  },
};

/** Non-EN locales: full tip set; statute titles kept, body localized. */
function localizeFromEn(
  bodyMap: Partial<Record<TipId, { title: string; body: string }>>,
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
  'salary.gross': { title: '税前工资 Gross', body: '扣除强制保险与个税前的总收入，是工资计算器的基础输入。' },
  'salary.bhxh': { title: '职工社保（8%）', body: '职工按社保缴费基数（封顶后）缴纳 8%。费率取自所选规则集。' },
  'salary.bhyt': { title: '职工医保（1.5%）', body: '职工按缴费基数缴纳 1.5%。封顶与社保规则集一致。' },
  'salary.bhtn': { title: '职工失业险（1%）', body: '职工按失业险基数缴纳 1%（地区最低工资 × 规则集系数）。' },
  'salary.insuranceTotal': { title: '职工保险合计', body: '本月社保+医保+失业险。从 Gross 中扣除后再计算减免与个税。' },
  'salary.afterInsurance': { title: '扣保险后收入', body: 'Gross − 职工保险合计。作为家庭减免的输入。' },
  'salary.personalRelief': { title: '本人减免', body: '按税务年度规则集的固定本人扣除额（如 2026 年每月 1550 万越盾）。' },
  'salary.dependentRelief': { title: '抚养减免', body: '每位合格抚养人 × 规则集额度 × 您输入的人数（应用不核实材料）。' },
  'salary.reliefTotal': { title: '家庭减免合计', body: '本人减免 + 抚养减免。扣保险后继续扣除以得到应税所得。' },
  'salary.taxable': { title: '应税所得', body: '扣保险后收入 − 减免合计（不小于 0）。用于累进税率。' },
  'salary.pit': { title: '个人所得税', body: '按所选规则集累进税率计算。下方显示各档明细。' },
  'salary.net': { title: '实发净额（估算）', body: 'Gross − 职工保险 − 个税。仅离线估算，不能替代正式工资单。' },
  'settlement.refund': { title: '预计退税', body: '年税估算 < 已预扣 → 退税差额。申报前请核对凭证。' },
  'settlement.pay': { title: '预计补税', body: '年税估算 > 已预扣 → 需补缴差额。仅为应用内估算。' },
  'settlement.even': { title: '相符', body: '年税估算与已预扣一致（含四舍五入）。仍建议核对工资单。' },
  'other.vat': { title: '增值税（估算）', body: '按规则集中行业/收入类型税率估算，与个税分开。' },
  'other.pit': { title: '其他收入个税', body: '按收入或超门槛部分计税 — 不并入劳动合同 Gross。' },
  'other.threshold': { title: '免税门槛', body: '收入 ≤ 规则集门槛（常为每年 10 亿越盾）可能免比率税，但仍可能需申报。' },
  'ot.pay': { title: '加班费', body: '按日类型（150/200/300%）或夜班（200/270/390%）。计入当月 Gross 估算个税。' },
  'bonus.month': { title: '奖金/加班月', body: '奖金与加班在收到月纳税。保险基数默认仍按合同工资。' },
});

const hi = localizeFromEn({
  'salary.gross': { title: 'सकल वेतन (Gross)', body: 'अनिवार्य बीमा और PIT काटने से पहले की कुल आय। वेतन कैलकुलेटर का आधार।' },
  'salary.bhxh': { title: 'कर्मचारी सामाजिक बीमा (8%)', body: 'कर्मचारी SI आधार (सीमा के बाद) पर 8% देता है। दरें चयनित नियम-सेट से आती हैं।' },
  'salary.bhyt': { title: 'कर्मचारी स्वास्थ्य बीमा (1.5%)', body: 'कर्मचारी योगदान आधार पर 1.5% देता है। सीमा SI नियम-सेट के साथ।' },
  'salary.bhtn': { title: 'बेरोजगारी बीमा (1%)', body: 'कर्मचारी UI आधार पर 1% देता है (क्षेत्रीय न्यूनतम × गुणांक)।' },
  'salary.insuranceTotal': { title: 'कुल कर्मचारी बीमा', body: 'इस माह SI+HI+UI। परिवार राहत और PIT से पहले Gross से काटा जाता है।' },
  'salary.afterInsurance': { title: 'बीमा के बाद आय', body: 'Gross − कर्मचारी बीमा। पारिवारिक राहत का इनपुट।' },
  'salary.personalRelief': { title: 'व्यक्तिगत राहत', body: 'कर-वर्ष नियम-सेट से निश्चित व्यक्तिगत कटौती।' },
  'salary.dependentRelief': { title: 'आश्रित राहत', body: 'प्रत्येक पात्र आश्रित × नियम राशि × आपकी संख्या (ऐप सत्यापित नहीं करता)।' },
  'salary.reliefTotal': { title: 'कुल पारिवारिक राहत', body: 'व्यक्तिगत + आश्रित राहत। करयोग्य आय के लिए बीमा के बाद काटी जाती है।' },
  'salary.taxable': { title: 'करयोग्य आय', body: 'बीमा के बाद − कुल राहत (≥0)। प्रोग्रेसिव PIT का आधार।' },
  'salary.pit': { title: 'व्यक्तिगत आयकर', body: 'चयनित नियम-सेट की प्रोग्रेसिव अनुसूची के अनुसार।' },
  'salary.net': { title: 'नेट (अनुमानित)', body: 'Gross − कर्मचारी बीमा − PIT। केवल ऑफ़लाइन अनुमान।' },
  'settlement.refund': { title: 'अनुमानित रिफंड', body: 'वार्षिक कर < कटी हुई राशि → रिफंड। दाखिल करने से पहले जाँचें।' },
  'settlement.pay': { title: 'अतिरिक्त भुगतान', body: 'वार्षिक कर > कटी हुई राशि → अंतर चुकाना होगा।' },
  'settlement.even': { title: 'संतुलित', body: 'अनुमान कटी हुई राशि से मेल खाता है। फिर भी पेरोल जाँचें।' },
  'other.vat': { title: 'VAT (अनुमान)', body: 'नियम-सेट की दरों से वैट। PIT से अलग।' },
  'other.pit': { title: 'अन्य आय PIT', body: 'राजस्व या सीमा से अधिक पर कर — रोजगार Gross में नहीं जोड़ा जाता।' },
  'other.threshold': { title: 'छूट सीमा', body: 'आय ≤ सीमा पर दर छूट हो सकती है, रिपोर्टिंग फिर भी लागू हो सकती है।' },
  'ot.pay': { title: 'ओवरटाइम', body: 'दिन प्रकार या रात्रि गुणांक। मासिक Gross में PIT अनुमान के लिए जोड़ा जाता है।' },
  'bonus.month': { title: 'बोनस / OT माह', body: 'प्राप्ति माह में कर। बीमा आधार डिफ़ॉल्ट अनुबंध वेतन पर रहता है।' },
});

const es = localizeFromEn({
  'salary.gross': { title: 'Salario bruto', body: 'Ingreso total antes de seguros obligatorios e IRPF. Base del calculador.' },
  'salary.bhxh': { title: 'Seguro social del trabajador (8%)', body: 'El trabajador aporta el 8% sobre la base (tras el tope). Tasas del ruleset.' },
  'salary.bhyt': { title: 'Seguro de salud (1,5%)', body: 'Aporta el 1,5% sobre la base. Tope según ruleset.' },
  'salary.bhtn': { title: 'Desempleo (1%)', body: 'Aporta el 1% sobre la base de desempleo (salario mínimo regional × coeficiente).' },
  'salary.insuranceTotal': { title: 'Total seguros del trabajador', body: 'SS+salud+desempleo del mes. Se resta del bruto antes del IRPF.' },
  'salary.afterInsurance': { title: 'Ingreso tras seguros', body: 'Bruto − seguros. Entrada a las reducciones familiares.' },
  'salary.personalRelief': { title: 'Reducción personal', body: 'Deducción fija personal según ruleset del año fiscal.' },
  'salary.dependentRelief': { title: 'Reducción por dependientes', body: 'Por cada dependiente × importe del ruleset × cantidad indicada.' },
  'salary.reliefTotal': { title: 'Total reducciones', body: 'Personal + dependientes. Tras seguros para obtener la base imponible.' },
  'salary.taxable': { title: 'Base imponible', body: 'Tras seguros − reducciones (≥0). Base del IRPF progresivo.' },
  'salary.pit': { title: 'IRPF', body: 'Impuesto según el tramo progresivo del ruleset seleccionado.' },
  'salary.net': { title: 'Neto (estimado)', body: 'Bruto − seguros − IRPF. Solo estimación offline.' },
  'settlement.refund': { title: 'Devolución estimada', body: 'Impuesto anual < retenido → devolución. Verifique documentos.' },
  'settlement.pay': { title: 'Pago adicional estimado', body: 'Impuesto anual > retenido → pagar la diferencia.' },
  'settlement.even': { title: 'Cuadrado', body: 'La estimación coincide con lo retenido (redondeo).' },
  'other.vat': { title: 'IVA (estimado)', body: 'IVA según tasas del ruleset. Separado del IRPF.' },
  'other.pit': { title: 'IRPF (otros ingresos)', body: 'Sobre ingresos o exceso del umbral — no se suma al bruto laboral.' },
  'other.threshold': { title: 'Umbral de exención', body: 'Ingresos ≤ umbral pueden eximir tasas, pero la declaración puede seguir.' },
  'ot.pay': { title: 'Horas extra', body: 'Según tipo de día o noche. Se suma al bruto mensual para el IRPF.' },
  'bonus.month': { title: 'Mes con bonus / extras', body: 'Bonus y extras se gravan en el mes de cobro. La base de seguro suele ser el salario contractual.' },
});

const fr = localizeFromEn({
  'salary.gross': { title: 'Salaire brut', body: 'Revenu total avant cotisations obligatoires et IR. Base du calculateur.' },
  'salary.bhxh': { title: 'Assurance sociale (8%)', body: 'Le salarié verse 8% de l’assiette (après plafond). Taux issus du ruleset.' },
  'salary.bhyt': { title: 'Assurance maladie (1,5%)', body: '1,5% de l’assiette. Plafond selon le ruleset.' },
  'salary.bhtn': { title: 'Chômage (1%)', body: '1% de l’assiette chômage (SMIC régional × coefficient).' },
  'salary.insuranceTotal': { title: 'Total cotisations salarié', body: 'AS+AM+chômage du mois. Déduit du brut avant l’IR.' },
  'salary.afterInsurance': { title: 'Revenu après cotisations', body: 'Brut − cotisations. Entrée des abattements familiaux.' },
  'salary.personalRelief': { title: 'Abattement personnel', body: 'Déduction fixe selon le ruleset de l’année fiscale.' },
  'salary.dependentRelief': { title: 'Abattement personnes à charge', body: 'Par personne × montant ruleset × nombre saisi.' },
  'salary.reliefTotal': { title: 'Total abattements', body: 'Personnel + à charge. Après cotisations pour le revenu imposable.' },
  'salary.taxable': { title: 'Revenu imposable', body: 'Après cotisations − abattements (≥0). Base du barème progressif.' },
  'salary.pit': { title: 'Impôt sur le revenu', body: 'Selon le barème progressif du ruleset sélectionné.' },
  'salary.net': { title: 'Net (estimé)', body: 'Brut − cotisations − IR. Estimation hors ligne uniquement.' },
  'settlement.refund': { title: 'Remboursement estimé', body: 'Impôt annuel < retenu → remboursement. Vérifiez les pièces.' },
  'settlement.pay': { title: 'Complément estimé', body: 'Impôt annuel > retenu → payer la différence.' },
  'settlement.even': { title: 'Équilibré', body: 'L’estimation correspond au retenu (arrondis).' },
  'other.vat': { title: 'TVA (estimée)', body: 'TVA selon les taux du ruleset. Séparée de l’IR.' },
  'other.pit': { title: 'IR (autres revenus)', body: 'Sur le chiffre d’affaires ou l’excédent — non ajouté au brut salarial.' },
  'other.threshold': { title: 'Seuil d’exonération', body: 'Revenus ≤ seuil peuvent être exonérés de taux, déclaration parfois requise.' },
  'ot.pay': { title: 'Heures supplémentaires', body: 'Selon le type de jour ou de nuit. Ajoutées au brut mensuel pour l’IR.' },
  'bonus.month': { title: 'Mois avec prime / HS', body: 'Primes et HS imposées le mois de versement. Assiette d’assurance = salaire contractuel par défaut.' },
});

const ja = localizeFromEn({
  'salary.gross': { title: '総支給（Gross）', body: '強制保険・所得税控除前の総収入。給与計算機の基準入力です。' },
  'salary.bhxh': { title: '社会保険（従業員 8%）', body: '従業員が社会保険の算定基礎（上限後）の 8% を負担。料率はルールセットから。' },
  'salary.bhyt': { title: '医療保険（1.5%）', body: '算定基礎の 1.5%。上限はルールセットに従います。' },
  'salary.bhtn': { title: '失業保険（1%）', body: '失業保険基礎の 1%（地域最低賃金×係数）。' },
  'salary.insuranceTotal': { title: '従業員保険合計', body: '当月の社保+医療+失業。所得税前に Gross から控除。' },
  'salary.afterInsurance': { title: '保険控除後所得', body: 'Gross − 従業員保険。家族控除の入力。' },
  'salary.personalRelief': { title: '本人控除', body: '税年度ルールセットの固定本人控除額。' },
  'salary.dependentRelief': { title: '扶養控除', body: '扶養1人あたり × ルール額 × 入力人数（アプリは審査しません）。' },
  'salary.reliefTotal': { title: '控除合計', body: '本人+扶養。課税所得を出すため保険の後に控除。' },
  'salary.taxable': { title: '課税所得', body: '保険後 − 控除合計（0以上）。累進税率の基礎。' },
  'salary.pit': { title: '所得税', body: '選択ルールセットの累進表で計算。下に各段階を表示。' },
  'salary.net': { title: '手取り（概算）', body: 'Gross − 従業員保険 − 所得税。オフライン概算のみ。' },
  'settlement.refund': { title: '還付見込み', body: '年税概算 < 源泉徴収 → 還付差額。申告前に書類を確認。' },
  'settlement.pay': { title: '追加納付見込み', body: '年税概算 > 源泉徴収 → 差額を納付。' },
  'settlement.even': { title: '一致', body: '概算が源泉と一致（端数含む）。給与明細も確認してください。' },
  'other.vat': { title: '付加価値税（概算）', body: 'ルールセットの業種・所得区分税率。所得税とは別。' },
  'other.pit': { title: 'その他所得の所得税', body: '収入または閾値超過分 — 雇用 Gross には加算しません。' },
  'other.threshold': { title: '免税閾値', body: '収入 ≤ 閾値で税率免除の場合でも申告義務が残ることがあります。' },
  'ot.pay': { title: '残業代', body: '日区分または深夜割増。月次 Gross に加算して所得税を概算。' },
  'bonus.month': { title: '賞与・残業月', body: '受取月に課税。保険基礎は原則契約賃金のまま。' },
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
