# KVSalaryTools

Ứng dụng hỗ trợ người lao động Việt Nam tính thuế TNCN, bảo hiểm và quyền lợi tài chính.

## Tech stack mục tiêu
- React + Expo

## Tài liệu
- Nguyên tắc dự án: [.specify/memory/constitution.md](.specify/memory/constitution.md)
- Nghiên cứu: [docs/research/](docs/research/)
- Nghiệp vụ: [docs/domain/](docs/domain/)
- Sản phẩm: [docs/product/](docs/product/)
- Spec tính năng: [specs/](specs/)

## Spec-Driven Development
Dự án dùng [GitHub Spec Kit](https://github.com/github/spec-kit). Trong Cursor: `/speckit-constitution`, `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`.

## Đã triển khai (MVP)
- Shell UX (splash, tabs, settings, loading)
- Tính lương Gross↔Net, NPT/GTGC, so sánh biểu thuế 2025/2026
- Quyết toán thuế năm + wizard nộp
- Quyền lợi nghỉ việc: thôi việc / mất việc / BHTN
- Thai sản & ốm đau (TC-MAT-01/02/03, TC-SICK-01)
- Hưu / BHXH một lần (TC-LUMPSUM-01, TC-PENSION-01/02 + disclaimer gate)
- Thu nhập khác: cho thuê / HKD / CK / ESOP / vãng lai — `npm test` = engine smoke

## Chạy local
```bash
npm test
npx expo start
```

## ⚠️ Disclaimer pháp lý

KVSalaryTools là công cụ **hỗ trợ ước tính** thuế TNCN, bảo hiểm xã hội và các quyền lợi tài chính cho người lao động Việt Nam. 
**Ứng dụng này KHÔNG thay thế** cho tư vấn pháp lý chính thức, dịch vụ kế toán hay các cơ quan chính quyền.

Kết quả tính toán dựa trên luật hiện hành tại thời điểm cập nhật. Quý vị nên:
- Kiểm chứng kết quả với phòng kế toán/tư vấn thuế trước khi nộp
- Cập nhật thông tin luật định kỳ
- Không dùng ứng dụng này thay thế quyết định chính thức từ cơ quan thuế

Bản quyền © 2026. Không bảo hành kết quả tính toán.
