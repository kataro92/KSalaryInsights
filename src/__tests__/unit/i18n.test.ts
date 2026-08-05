import { getTip, LOCALE_OPTIONS, translate } from '@/src/i18n';

describe('i18n', () => {
  it('exposes seven locale options with Vietnamese default label first', () => {
    expect(LOCALE_OPTIONS).toHaveLength(7);
    expect(LOCALE_OPTIONS[0].code).toBe('vi');
    expect(LOCALE_OPTIONS.map((o) => o.code)).toEqual([
      'vi',
      'en',
      'zh',
      'hi',
      'es',
      'fr',
      'ja',
    ]);
  });

  it('translates settings keys per locale', () => {
    expect(translate('vi', 'settings.authorName')).toBe('Phạm Huy Đức');
    expect(translate('en', 'tabs.settings')).toBe('Settings');
    expect(translate('ja', 'tabs.salary')).toBe('給与');
  });

  it('interpolates variables', () => {
    expect(translate('en', 'salary.labelPitBracket', { n: 2, pct: 10 })).toBe(
      'Bracket 2 (10%)',
    );
  });

  it('tips include title body and sources', () => {
    const tip = getTip('vi', 'salary.bhxh');
    expect(tip.title).toMatch(/BHXH/);
    expect(tip.body.length).toBeGreaterThan(20);
    expect(tip.sources.length).toBeGreaterThan(0);
    expect(getTip('en', 'salary.net').title).toMatch(/Net/i);
  });
});
