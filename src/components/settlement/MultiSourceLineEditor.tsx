import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/src/components/common/Button";
import { ChipRow } from "@/src/components/common/ChipRow";
import { ChoiceChip } from "@/src/components/common/ChoiceChip";
import { MoneyField } from "@/src/components/common/MoneyField";
import {
  DEFAULT_KIND_LABELS_VI,
  MULTI_SOURCE_KINDS,
  type MultiSourceKind,
  type MultiSourceLine,
} from "@/src/domain/types/multiSource";
import type { HkdIndustryId } from "@/src/domain/types/otherIncome";
import {
  mapCasualLine,
  mapEsopLine,
  mapHkdLine,
  mapRentLine,
  mapSalaryLine,
  mapSecuritiesLine,
} from "@/src/engine/multiSourceMappers";
import {
  optionalNonNegativeMoney,
  requiredNonNegativeMoney,
} from "@/src/theme/fieldValidation";
import { parseMoney } from "@/src/theme/money";
import type { ThemeContextValue } from "@/src/theme/ThemeProvider";
import { space, typography } from "@/src/theme/tokens";
import { useThemedStyles, type ThemedStyleSheet } from "@/src/theme/useThemedStyles";

const HKD_INDUSTRIES: { id: HkdIndustryId; label: string }[] = [
  { id: "services", label: "Dịch vụ" },
  { id: "distribution", label: "Phân phối" },
  { id: "production_transport", label: "Sản xuất / vận tải" },
  { id: "asset_rental_agency", label: "Cho thuê tài sản / đại lý" },
  { id: "other", label: "Khác" },
];

type Props = {
  taxYear: number;
  disabled?: boolean;
  onAdd: (line: MultiSourceLine) => void;
};

/**
 * Add a multi-source line. Crypto kinds are intentionally omitted (FR-006).
 */
export function MultiSourceLineEditor({ taxYear, disabled, onAdd }: Props) {
  const styles = useThemedStyles(makeStyles);
  const [kind, setKind] = useState<MultiSourceKind>("salary");
  const [amountText, setAmountText] = useState("0");
  const [taxText, setTaxText] = useState("0");
  const [withheldText, setWithheldText] = useState("0");
  const [industryId, setIndustryId] = useState<HkdIndustryId>("services");
  const [error, setError] = useState<string | null>(null);

  const amountHint =
    kind === "salary"
      ? "Thu nhập sau bảo hiểm trong năm"
      : kind === "casual"
        ? "Tổng chi trả vãng lai"
        : kind === "securities" || kind === "esop"
          ? "Giá chuyển nhượng / bán"
          : "Doanh thu năm";

  const onSubmit = () => {
    setError(null);
    const amount = parseMoney(amountText) ?? 0;
    const withheld = parseMoney(withheldText) ?? 0;
    try {
      let line: MultiSourceLine;
      if (kind === "salary") {
        const pit = parseMoney(taxText) ?? 0;
        if (amount < 0 || pit < 0) throw new Error("Số không hợp lệ.");
        line = mapSalaryLine({
          taxYear,
          revenueOrIncome: amount,
          estimatedPit: pit,
          withheld,
        });
      } else if (kind === "rent") {
        line = mapRentLine({
          annualRevenue: amount,
          taxYear,
          withheld,
        });
      } else if (kind === "hkd") {
        line = mapHkdLine({
          annualRevenue: amount,
          industryId,
          taxYear,
          withheld,
        });
      } else if (kind === "casual") {
        line = mapCasualLine({
          paymentAmount: amount,
          taxYear,
          withheld: withheld > 0 ? withheld : undefined,
        });
      } else if (kind === "securities") {
        line = mapSecuritiesLine({
          transferPrice: amount,
          taxYear,
          withheld,
        });
      } else {
        line = mapEsopLine({
          salePrice: amount,
          taxYear,
          withheld,
        });
      }
      onAdd(line);
      setAmountText("0");
      setTaxText("0");
      setWithheldText("0");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thêm được dòng.");
    }
  };

  return (
    <View style={styles.wrap} accessibilityLabel="Thêm nguồn thu nhập">
      <Text style={styles.label}>Loại nguồn</Text>
      <ChipRow>
        {MULTI_SOURCE_KINDS.map((k) => (
          <ChoiceChip
            key={k}
            label={DEFAULT_KIND_LABELS_VI[k]}
            selected={kind === k}
            onPress={() => {
              setKind(k);
              setError(null);
            }}
          />
        ))}
      </ChipRow>

      {kind === "hkd" ? (
        <>
          <Text style={styles.label}>Nhóm ngành hộ kinh doanh</Text>
          <ChipRow>
            {HKD_INDUSTRIES.map((ind) => (
              <ChoiceChip
                key={ind.id}
                label={ind.label}
                selected={industryId === ind.id}
                onPress={() => setIndustryId(ind.id)}
              />
            ))}
          </ChipRow>
        </>
      ) : null}

      <Text style={styles.label}>{amountHint}</Text>
      <MoneyField
        accessibilityLabel={amountHint}
        value={amountText}
        error={requiredNonNegativeMoney(amountText)}
        onValueChange={(formatted) => setAmountText(formatted)}
      />

      {kind === "salary" ? (
        <>
          <Text style={styles.label}>Thuế thu nhập cá nhân năm ước tính (từ quyết toán lương)</Text>
          <MoneyField
            accessibilityLabel="Thuế thu nhập cá nhân năm ước tính"
            value={taxText}
            error={optionalNonNegativeMoney(taxText)}
            onValueChange={(formatted) => setTaxText(formatted)}
          />
        </>
      ) : null}

      <Text style={styles.label}>Đã nộp / khấu trừ (tuỳ chọn)</Text>
      <MoneyField
        accessibilityLabel="Thuế đã nộp"
        value={withheldText}
        error={optionalNonNegativeMoney(withheldText)}
        onValueChange={(formatted) => setWithheldText(formatted)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label="Thêm dòng"
        variant="secondary"
        disabled={disabled}
        onPress={onSubmit}
      />
    </View>
  );
}

function makeStyles({ colors }: ThemeContextValue) {
  return {
    wrap: { gap: space[3] },
    label: {
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.scale.caption.fontSize,
      color: colors.foregroundMuted,
    },
    error: {
      fontFamily: typography.fontFamily.medium,
      fontSize: 13,
      color: colors.danger,
    },
  } satisfies ThemedStyleSheet;
}
