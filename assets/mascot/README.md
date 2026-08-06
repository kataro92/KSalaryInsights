# Ngài Miu - mascot assets

Cartoon raster illustrations (PNG + WebP). **Do not replace with SVG** - brand character must stay illustrated.

| File | Pose | Typical use |
|------|------|-------------|
| `miu-wave` | Welcome wave | Onboarding intro, greetings |
| `miu-tip` | Helpful tip | Inline tips beside results |
| `miu-point` | Pointing | Explaining a step / Gross↔Net |
| `miu-confused` | Mild confusion | Empty / error / dependents tip |
| `miu-bow` | Bow | About Us, completion |
| `miu-docs` | Holding docs | Filing season, settlement disclaimer |
| `miu-icon` | Portrait | App icon source |
| `miu-splash` | Full welcome | Legacy square pose (tips / fallback) |

Full-bleed cold-start splash (Ngài Miu introducing the app) lives in
`../images/splash-full.png` (1125×2436, iPhone XS @3x) and is wired via
`expo-splash-screen` + `SplashView`. Rebuild with:

`node scripts/compose-splash.mjs`

(uses `splash-scene.png` + Plus Jakarta Sans for crisp type).
