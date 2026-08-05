# KVSalaryTools

Ứng dụng **React Native + Expo** ước tính lương Gross↔Net, thuế TNCN, bảo hiểm và quyền lợi BHXH — **offline**, minh bạch từng khoản trừ. Trợ lý **Ngài Miu** hướng dẫn trong app.

## Chạy local

```bash
npm install
npm test          # engine smoke
npm run test:unit # unit tests
npx expo start
```

## Tài liệu

| Mục | Link |
|-----|------|
| Phạm vi & trạng thái | [docs/product/scope.md](docs/product/scope.md) |
| Spec tính năng | [specs/](specs/) |
| Nghiệp vụ | [docs/domain/](docs/domain/) |
| Design system | [docs/product/design-system.md](docs/product/design-system.md) |
| Store listing | [docs/store/README.md](docs/store/README.md) |
| Constitution | [.specify/memory/constitution.md](.specify/memory/constitution.md) |

## Đã triển khai

- **Lương**: Gross↔Net, NPT/GTGC, so sánh 2025/2026, thưởng tháng, OT, lưu kịch bản cục bộ
- **Quyết toán**: Ước năm, đa nguồn, wizard nộp, banner mùa vụ
- **Quyền lợi**: Thôi việc, BHTN, thai sản, ốm đau, hưu / BHXH một lần
- **Thu nhập khác**: Cho thuê, HKD, chứng khoán, ESOP, vãng lai
- **Shell**: Onboarding, splash, tabs, settings, preferences AsyncStorage
- **UI**: Pastel Flat Design, mascot PNG, motion, Vietnamese money speech

## Disclaimer

KVSalaryTools **không thay thế** tư vấn pháp lý hay cơ quan chính quyền. Kết quả dựa trên ruleset tại thời điểm cập nhật — đối chiếu với phòng kế toán / cơ quan thuế trước khi quyết định.
