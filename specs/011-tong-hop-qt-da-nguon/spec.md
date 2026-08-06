# Feature Specification: Tổng hợp quyết toán đa nguồn (ước)

**Status**: Shipped  
**F-ID**: F020  
**Input**: Quyết định sản phẩm ADR 0009 (hướng 1c). Gộp các ước thu nhập đã có trong năm thành một bảng thuế năm — vẫn offline, không nộp tờ khai.

**Tham chiếu**: F007/F008 (QT lương ± vãng lai), F016–F018 (thu nhập khác), `docs/domain/thu-nhap-khac.md`, ADR 0009.

## Locked decisions

- **Không** tính tài sản mã hóa / coin (ngoài phạm vi; disclaimer ở Thu nhập khác **và** màn tổng hợp).
- Tổng hợp là **ước tham khảo**: user nhập hoặc kéo từ kịch bản / kết quả đã tính trên máy; không đồng bộ eTax.
- Mỗi nguồn giữ **cơ chế thuế riêng** (lũy tiến lương vs tỷ lệ HKD/cho thuê vs 0,1% CK). Không gộp mọi thứ vào một biểu lũy tiến trừ khi luật bắt buộc (vd. ESOP phần TLTC → lương).
- Kết quả năm = **bảng dòng theo nguồn** + **tổng thuế ước / đã nộp / chênh** (nơi áp dụng được). Disclaimer mạnh: không thay tờ khai 02/QTT-TNCN hay 02/CNKD.
- Wizard ủy quyền hiện tại (F007b) vẫn gắn **lương HĐLĐ**; khi có HKD/cho thuê/CK, kết luận mặc định nghiêng **tự quyết toán** + checklist mở rộng.
- **Entry UI** (research R1): route `multi-source` + CTA từ Quyết toán / Thu nhập khác — **không** thêm tab bar.
- **Totals** (R3): `Σ thuế dòng − Σ đã nộp`; nhãn ước; không suy ra một tờ khai duy nhất.
- **ESOP TLTC** (R5): không auto-merge vào dòng lương; ghi chú + user chủ động nếu muốn.
- **Data MVP** (R2): nhập tay bắt buộc; import từ scenario F014 là SHOULD.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem bảng năm đa nguồn (Priority: P1)

Minh có lương HĐLĐ + cho thuê + vài lần vãng lai. Muốn một màn thấy từng dòng thuế ước và tổng.

**Acceptance Scenarios**:

1. **Given** đã có ước lương năm (F007) và bật thêm dòng cho thuê + vãng lai, **When** mở Tổng hợp năm, **Then** thấy ≥3 dòng nguồn với thuế ước / đã nộp (nếu nhập) và tổng chênh có nhãn “ước”.
2. **Given** chưa nhập nguồn nào, **Then** empty state hướng tới Tính lương / Thu nhập khác / QT hiện tại.

### User Story 2 - Freelancer / HKD trong tổng hợp (Priority: P1)

Lan chỉ kinh doanh dịch vụ (HKD), muốn thấy thuế tỷ lệ năm cạnh ngưỡng miễn.

1. **Given** doanh thu HKD ≤ ngưỡng miễn năm đang chọn, **When** thêm vào tổng hợp, **Then** dòng HKD thuế = 0 kèm nhắc “vẫn có thể phải kê khai/thông báo doanh thu”.
2. **Given** HKD vượt ngưỡng, **Then** dòng GTGT + TNCN tách (không gộp vào biểu lũy tiến lương).

### User Story 3 - Không coin (Priority: P1)

1. **Given** màn Thu nhập khác hoặc Tổng hợp năm, **Then** có câu rõ: không ước thuế tài sản mã hóa / coin (ngoài phạm vi).

### Edge Cases

- Chỉ lương + vãng lai miễn QT → giữ hành vi DualScenario (F008), tổng hợp phản ánh cùng logic.
- User bỏ một nguồn giữa chừng → tổng cập nhật; không crash.
- Năm thuế khác nhau giữa nguồn → bắt buộc cùng `tax_year` trên màn tổng hợp.

## Requirements *(mandatory)*

- **FR-001**: MUST cho chọn `tax_year` chung cho bảng tổng hợp.
- **FR-002**: MUST hỗ trợ thêm/bớt dòng nguồn: lương (từ QT hiện có), vãng lai, HKD, cho thuê, chứng khoán, ESOP (ước).
- **FR-003**: MUST hiện mỗi dòng: loại, doanh thu/thu nhập tóm tắt, thuế ước, thuế đã nộp (optional), ghi chú miễn/ngưỡng.
- **FR-004**: MUST hiện tổng thuế ước và tổng đã nộp + chênh mang nhãn ước tính.
- **FR-005**: MUST NOT gộp HKD/cho thuê/CK vào biểu lũy tiến lương.
- **FR-006**: MUST NOT tính crypto / tài sản mã hóa.
- **FR-007**: MUST NOT nộp tờ khai hoặc thu thập MST/CCCD.
- **FR-008**: SHOULD cho lưu bảng tổng hợp như kịch bản local (mở rộng F014).
- **FR-009**: SHOULD cập nhật wizard F007b: nếu có nguồn ngoài lương → nghiêng tự QT + checklist chứng từ theo loại đã bật.

## Success Criteria *(mandatory)*

- **SC-001**: User hoàn thành bảng ≥2 nguồn trong ≤ 3 phút với số liệu sẵn.
- **SC-002**: Fixture lương + HKD dưới ngưỡng: tổng thuế = thuế lương (HKD 0) sai số ≤ 1 đồng trên phần lương.
- **SC-003**: Không có UI/engine path tính thuế coin.

## Assumptions

- Engine từng loại (HKD, thuê, CK…) tái sử dụng; F020 chủ yếu **orchestration + UI**.
- Không thay mẫu 02/CNKD-TNCN-QTT; chỉ checklist hướng dẫn nếu làm P2 sau.
- So sánh 2 offer Gross/Net (P0) và preset mức BH là backlog song song, không chặn F020.
