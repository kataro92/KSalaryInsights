import {
  getDefaultPreferences,
  loadPreferences,
  parsePreferences,
  PREFERENCES_STORAGE_KEY,
  resetPreferences,
  savePreferences,
  systemDefaultTaxYear,
} from '@/src/store/preferences';

describe('preferences', () => {
  it('returns system defaults with region I', () => {
    const prefs = getDefaultPreferences(new Date('2026-08-05'));
    expect(prefs).toEqual({
      schemaVersion: 1,
      defaultRegion: 'I',
      defaultTaxYear: 2026,
    });
  });

  it('systemDefaultTaxYear uses current year when >= 2025', () => {
    expect(systemDefaultTaxYear(new Date('2025-01-01'))).toBe(2025);
    expect(systemDefaultTaxYear(new Date('2024-12-31'))).toBe(2026);
  });

  it('parsePreferences accepts valid payload', () => {
    expect(
      parsePreferences({
        schemaVersion: 1,
        defaultRegion: 'III',
        defaultTaxYear: 2025,
      }),
    ).toEqual({
      schemaVersion: 1,
      defaultRegion: 'III',
      defaultTaxYear: 2025,
    });
  });

  it('parsePreferences rejects corrupt payloads', () => {
    expect(parsePreferences(null)).toBeNull();
    expect(parsePreferences({ schemaVersion: 2, defaultRegion: 'I', defaultTaxYear: 2026 })).toBeNull();
    expect(parsePreferences({ schemaVersion: 1, defaultRegion: 'V', defaultTaxYear: 2026 })).toBeNull();
    expect(parsePreferences({ schemaVersion: 1, defaultRegion: 'I', defaultTaxYear: 1999 })).toBeNull();
  });

  it('uses stable storage key', () => {
    expect(PREFERENCES_STORAGE_KEY).toBe('kv.preferences.v1');
  });

  it('persists and reloads preferences', async () => {
    await savePreferences({
      schemaVersion: 1,
      defaultRegion: 'II',
      defaultTaxYear: 2025,
    });
    const loaded = await loadPreferences();
    expect(loaded.recoveredFromCorrupt).toBe(false);
    expect(loaded.preferences).toEqual({
      schemaVersion: 1,
      defaultRegion: 'II',
      defaultTaxYear: 2025,
    });
  });

  it('resetPreferences restores defaults', async () => {
    await savePreferences({
      schemaVersion: 1,
      defaultRegion: 'IV',
      defaultTaxYear: 2027,
    });
    const reset = await resetPreferences();
    expect(reset.defaultRegion).toBe('I');
    const loaded = await loadPreferences();
    expect(loaded.preferences.defaultRegion).toBe('I');
  });
});
