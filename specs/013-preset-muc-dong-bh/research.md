# Research: F022 Preset mức đóng BH

## R1 - Replace vs complement customBh

- **Decision**: Replace toggle+field bằng picker 3 mode; migrate `customBh=false` → `full`, `customBh=true` → `absolute` khi load scenario cũ.
- **Rationale**: UX rõ “full / % / số”; tránh hai control chồng.
- **Alternatives**: Giữ toggle + thêm % (phức tạp).

## R2 - Percent base for Net→Gross

- **Decision**: MVP: `insuranceSalary = round(percent/100 * candidateGross)` mỗi bước search (`insuranceTracksGross` semantics mở rộng). UI note: “% trên gross tìm được”.
- **Rationale**: Không cần ô “lương HĐ” thứ hai; khớp pain “đóng một phần lương”.
- **Alternatives**: % trên net (sai); bắt nhập contract pay riêng (ma sát).

## R3 - Does netToGross need API change?

- **Decision**: Prefer helper outside: for percent mode, either (a) extend netToGross với `insurancePercent?: number` hoặc (b) wrap binary search trong helper gọi grossToNet với salary = pct*gross. **Chọn (a)** nếu diff nhỏ; **(b)** nếu muốn zero-change netToGross.
- **Locked for plan**: Implement **(b) wrapper** `netToGrossWithPreset` in `insuranceBase.ts` để không đụng binary search core trừ khi cần - giảm regress.
- **Alternatives**: Fork engine (từ chối).

## R4 - Display

- **Decision**: Sau tính, hiện dòng meta “Căn cứ BH: X ₫ (full|70%|tuyệt đối)”.
- **Rationale**: FR-002.

## Resolved

| Topic | Resolution |
|-------|------------|
| Legacy scenarios | Map customBh → full/absolute |
| Percent net→gross | % × candidate gross via wrapper |
| F021 dependency | Export resolve + picker |
