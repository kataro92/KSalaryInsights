# Remote ruleset distribution (F019)

**ADR**: [0008-remote-ruleset-update.md](././decisions/0008-remote-ruleset-update.md)

## Files

| File | Role |
|------|------|
| `ruleset-manifest.json` | Public index: `url` + `sha256` per ruleset |
| `*.json` (optional) | Ruleset / inflation payloads linked from the manifest |

Default app URL (override in tests via `setRulesetManifestUrl`):

`https://raw.githubusercontent.com/kataro92/KSalaryInsights/master/docs/product/remote/ruleset-manifest.json`

## Publish checklist

1. Update domain docs + hand test cases (Constitution I / IV).
2. Add or bump ruleset JSON (`version` must increase to override a bundled `id`).
3. Compute SHA-256 of the **exact file bytes** (UTF-8):

```bash
node -e "const fs=require('fs');const c=require('crypto');const b=fs.readFileSync('path.json');console.log(c.createHash('sha256').update(b).digest('hex'))"
```

4. Add entry to `ruleset-manifest.json` (`id`, `version`, `url`, `sha256`).
5. Commit & push; users tap **Cập nhật ruleset** in Settings (or get hydrate on next launch after a prior successful cache).

## Empty manifest

`rulesets: []` is valid. check reports “đã ở phiên bản mới nhất” and keeps the bundle.
