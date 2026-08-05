# Data Model: 009-app-shell-ux

## AppPreferences

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemaVersion` | `1` | yes | Cho phép migrate sau này |
| `defaultRegion` | `'I' \| 'II' \| 'III' \| 'IV'` | yes | Vùng LTTV mặc định |
| `defaultTaxYear` | `number` | yes | Năm thuế mặc định (năm có ruleset) |

**Defaults**: `schemaVersion=1`, `defaultRegion='I'`, `defaultTaxYear` = năm hiện tại (nếu ≥2025) else `2026`.

**Storage**: AsyncStorage key `kv.preferences.v1` — JSON string.

**Validation**: Reject unknown region; tax year must be finite integer 2000–2100; on failure use defaults.

## NavigationDestination (logical)

| Id | Label (VI) | Route |
|----|------------|-------|
| `home` | Tính lương | `/(tabs)/` |
| `settings` | Cài đặt | `/(tabs)/settings` |

## UiThemeTokens

Ánh xạ design-system: `background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `border`, radii `md|lg`, spacing scale 4, font families Outfit weights 400/500/600/700/800.

## Relationships

- Home / Calculator (001) **reads** `AppPreferences` for initial form values.
- Settings **writes** `AppPreferences`.
- Splash **does not** mutate preferences (except reading readiness).
