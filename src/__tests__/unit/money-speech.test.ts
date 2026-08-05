import {
  moneyAccessibilityLabel,
  numberToVietnameseWords,
} from '@/src/theme/money';

describe('numberToVietnameseWords', () => {
  it('reads zero', () => {
    expect(numberToVietnameseWords(0)).toBe('không');
  });

  it('reads simple millions used in salary fixtures', () => {
    expect(numberToVietnameseWords(30_000_000)).toBe('ba mươi triệu');
    expect(numberToVietnameseWords(26_215_000)).toBe(
      'hai mươi sáu triệu hai trăm mười lăm nghìn',
    );
  });

  it('reads lẻ / mốt / lăm patterns', () => {
    expect(numberToVietnameseWords(101)).toBe('một trăm lẻ một');
    expect(numberToVietnameseWords(21)).toBe('hai mươi mốt');
    expect(numberToVietnameseWords(15)).toBe('mười lăm');
  });

  it('reads tỷ scale', () => {
    expect(numberToVietnameseWords(1_000_000_000)).toBe('một tỷ');
  });
});

describe('moneyAccessibilityLabel', () => {
  it('appends đồng and optional prefix', () => {
    expect(moneyAccessibilityLabel(1_000_000, 'Thực nhận Net')).toBe(
      'Thực nhận Net một triệu đồng',
    );
  });
});
