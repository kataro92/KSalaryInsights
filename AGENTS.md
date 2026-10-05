# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
This is a **GitHub Spec Kit** spec-driven-development repository for the planned
product **KVSalaryTools** (a Vietnamese salary/tax/insurance calculator, target
stack React + Expo). See `README.md`, `docs/`, and `.specify/memory/constitution.md`.

**There is no application source code yet** — no `package.json`, no build, no
test suite, no lint config, and no dev server. Do not expect `npm install`,
`npm run dev`, Docker, or a database. The "app" is not implemented; the repo is
currently specs + domain docs (`specs/`, `docs/`) plus the Spec Kit workflow.

### The toolchain: PowerShell
The Spec Kit workflow is driven by the Cursor skills under `.cursor/skills/`
(`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`,
etc.), which invoke the PowerShell scripts in `.specify/scripts/powershell/`.
These scripts require **PowerShell (`pwsh`)** — the only non-standard system
dependency. It is baked into the VM (the update script re-installs it only if
missing). Verify with `pwsh -Version`.

### Running the workflow scripts (this is the "app")
All scripts are run with `pwsh -NoProfile -File <script> ...` from the repo root:
- Resolve feature paths (read-only): `pwsh -NoProfile -File .specify/scripts/powershell/check-prerequisites.ps1 -PathsOnly -Json`
- Create a feature (generates `spec.md` from template): `.specify/scripts/powershell/create-new-feature.ps1 -Json '<description>'`
- Set up a plan (generates `plan.md` from template): `.specify/scripts/powershell/setup-plan.ps1 -Json`
- Set up tasks: `.specify/scripts/powershell/setup-tasks.ps1 -Json`

Prefer driving these through the `/speckit-*` skills rather than calling scripts
directly; read the relevant `.cursor/skills/speckit-*/SKILL.md` first.

### Gotchas
- The active feature is tracked in `.specify/feature.json` (currently
  `specs/001-tinh-luong-gross-net`). `create-new-feature.ps1` and
  `setup-plan.ps1` **write** to this file and to `specs/`, so they dirty the
  working tree. If you only want to preview, use `create-new-feature.ps1 -DryRun`.
- `create-new-feature.ps1` derives the next feature number from existing
  `specs/NNN-*` directory names.
- Docs and specs are written in Vietnamese.
