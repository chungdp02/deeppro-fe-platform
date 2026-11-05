# DeepTrace V8.3 — Final GitHub Pre-Push Validation

**Date:** 2026-11-01  
**Branch:** `landing-page` at `1b6814a`  
**Scope:** Git inventory, security checks, exact candidate tree, and release readiness.  
**Git actions:** no regular-index staging, commit, push, merge, or deployment.

## Executive result

**READY WITH WARNINGS for a development-branch candidate.** The allowlisted source tree passed frozen install, typecheck, lint, production build, 29 functional checks, and 70 responsive visual checks in an isolated snapshot. Gitleaks found no secret in the candidate or local Git history.

Two items need human review before a public push: a machine-local path in the unchanged V7 audit report from `HEAD`, and non-empty author/creator/keywords fields in the tracked brand-guideline PDF metadata. Neither produced a credential, email, or machine-path match in the scanned metadata. The values are intentionally not copied into this report. This status does not record user acceptance of those items and does not authorize a push.

Production performance is **NOT READY / INCONCLUSIVE**: the previous mobile Lighthouse median remains 4.281 s LCP and Performance 42, so the stated KPI is not met. No new Lighthouse run was made because the prior runs consistently reported poor mobile CPU calibration.

## 1. Repository and Git inventory

| Item                                     | Observed state                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current branch and `HEAD`                | `landing-page`, `1b6814a`                                                                                                                        |
| Local `origin/landing-page` tracking ref | Same commit as local `HEAD`; local comparison is 0/0. No remote fetch was performed for this audit.                                              |
| Upstream                                 | `origin/landing-page`                                                                                                                            |
| Staged paths                             | 0; the user's normal Git index is unchanged.                                                                                                     |
| Tracked worktree changes                 | 16 modified files and 1 deleted file. The deletion is `docs/deeptrace-v7-source-audit-cleanup-report.md` and is outside the candidate allowlist. |
| Untracked files                          | 141 at inventory time; 8 were in the V8.1 allowlist and the rest were excluded. This report adds one more allowlisted untracked file.            |
| Ignored files                            | 218,250 at inventory time, mostly dependency folders, caches, and local QA artifacts. They are not copied into the candidate tree.               |
| `git diff --check`                       | Exit 0. Git emitted only LF-to-CRLF worktree warnings.                                                                                           |
| GitHub workflow/hooks                    | No tracked `.github/workflows` files, configured `core.hooksPath`, or active local hook files were found.                                        |

The candidate is a complete tree made from `HEAD` plus the allowlist below. It is not a directory containing only changed files. Consequently, unchanged tracked files from `HEAD` remain in the candidate, including the brand-guideline PDF, tracked logo source images, and the old V7 report. The deletion of the V7 report in the current worktree is not included.

The updated staging manifest contains **25 paths**. It excludes unrelated `.agents/`, the Astro proof of concept, ad hoc research/benchmark scripts, untracked page-image extracts, `skills-lock.json`, and generated `tmp/` content. The tracked `apps/web/tests/visual.cjs` comes from `HEAD`, so the `test:visual` command is present in the clean snapshot.

## 2. Final candidate manifest

| Group                                 | Paths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared UI and tokens                  | `packages/ui/src/components/card.tsx`, `packages/ui/src/components/sheet.tsx`, `packages/ui/src/styles/globals.css`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Landing page and interactions         | `apps/web/index.html`, `apps/web/src/components/landing/BrandStatementSection.tsx`, `apps/web/src/components/landing/ContactAndFooter.tsx`, `apps/web/src/components/landing/FeaturesSection.tsx`, `apps/web/src/components/landing/Header.tsx`, `apps/web/src/components/landing/Hero.tsx`, `apps/web/src/components/landing/HeroScene.tsx`, `apps/web/src/components/landing/IndustriesSection.tsx`, `apps/web/src/components/landing/MobileNavigationSheet.tsx`, `apps/web/src/components/landing/ProductShowcaseSection.tsx`, `apps/web/src/components/landing/navigation.ts`, `apps/web/src/main.tsx`, `apps/web/src/styles/landing.css`, `apps/web/src/styles/trace-experience.css` |
| Functional QA                         | `apps/web/tests/verify.cjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Repository configuration and evidence | `.gitignore`, `docs/deeptrace-v8-shadcn-migration-report.md`, `docs/deeptrace-v8-ui-component-matrix.md`, `docs/deeptrace-v8.1-final-hardening-report.md`, `docs/deeptrace-v8.1-github-staging-manifest.md`, `docs/deeptrace-v8.2-full-shadcn-migration-report.md`, `docs/deeptrace-v8.3-pre-push-report.md`                                                                                                                                                                                                                                                                                                                                                                              |

The allowlist is recorded in `docs/deeptrace-v8.1-github-staging-manifest.md`. Its binary note now distinguishes changed files from unchanged tracked assets inherited from `HEAD`.

## 3. Security validation

### Secret scanning

- Downloaded Gitleaks **8.30.1** from its official GitHub release and verified the Windows archive against the release checksum before use.
- Scanned the extracted candidate tree with Gitleaks: **0 findings**.
- Scanned all locally available Git history with `--log-opts=--all`: **0 findings**.
- Extracted text from the tracked PDF locally and scanned the extracted text: **0 findings**.
- Source and document contents were not sent to a third-party scanning service. Secret values were not printed in this report.
- No `.env` file was found in the candidate. The tracked `.npmrc` was covered by the candidate scan and produced no finding.

### Binary metadata and local paths

- Reviewed metadata in **20 image files and 1 PDF** from the full candidate tree using local Pillow and pypdf readers. `exiftool` was unavailable, so those local libraries were used instead.
- No machine-path or email pattern was found in the image/PDF metadata. The brand-guideline PDF has non-empty `/Author`, `/Creator`, and `/Keywords` fields; their provenance still needs human review.
- A text scan found one machine-local absolute path in `docs/deeptrace-v7-source-audit-cleanup-report.md:79`. That file is unchanged in `HEAD`; its current worktree deletion is excluded from this candidate. The match is not a credential and is not part of the V8.3 change set, but should be reviewed before a public push.
- Gitleaks found no credential in the candidate or Git history. No secret rotation is indicated by these scans. Security is recorded as **no secret detected, with metadata/path review pending**, rather than an unconditional security pass.

## 4. Exact candidate snapshot and verification

A temporary Git index was initialized from `HEAD`, populated with only the reviewed manifest paths, written as a tree, and archived outside the repository. The ordinary Git index and branch were not changed. A clean copy was extracted to a temporary directory; it did not depend on ignored or unrelated untracked repository files.

The following checks passed in that clean candidate snapshot:

| Check                                     | Result                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `corepack pnpm install --frozen-lockfile` | **PASS**; lockfile unchanged, workspace install completed with pnpm 11.25.0.                                                                                  |
| `corepack pnpm typecheck`                 | **PASS**, 2/2 workspace tasks.                                                                                                                                |
| `corepack pnpm lint`                      | **PASS**, 2/2 workspace tasks.                                                                                                                                |
| `corepack pnpm --filter web build`        | **PASS**; 219 modules transformed. Existing warning: the Three.js vendor chunk is over 500 KB raw.                                                            |
| Production preview health                 | **PASS**, HTTP 200 on the test preview.                                                                                                                       |
| `corepack pnpm --filter web test:verify`  | **PASS**, 29/29 checks, including navigation, lazy Sheet lifecycle, theme, 3D interaction, WebGL failure/recovery, reduced motion, and no-JavaScript content. |
| `corepack pnpm --filter web test:visual`  | **PASS**, 70/70 viewport/section combinations at 320, 375, 390, 430, 768, 939, 1024, 1440, 1600, and 1920 px.                                                 |

Normal tested browser flows reported no console errors or warnings. Visual checks found no horizontal overflow, hero overlap, clipped text, or clipped scene controls.

## 5. Final source review

The review covered the V8.1 allowlist diff, shared UI package exports, Tailwind CSS v4 source/token setup, React prerender/hydration entry, local font preloads, landing assets and links, and the mobile Sheet and Three.js paths.

- `@workspace/ui` exports resolve through the package export map and TypeScript path mapping; the clean install, typecheck, lint, and build all passed.
- The landing app imports shared CSS tokens before its own styles. The generated CSS and responsive checks confirm the styles are present in the built app.
- Prerendered pages use `hydrateRoot`; the regular Vite path uses `createRoot`. Functional QA covered the prerendered/no-JavaScript path without runtime errors.
- The mobile Sheet stays in a separate lazy chunk (50.95 KB raw / 17.34 KB gzip). The Three.js vendor chunk is also separated from the main entry; WebGL fallback, context loss, retry, and reduced-motion behavior passed functional checks.
- The README's Corepack/pnpm install, web dev, production preview, and QA instructions match the workspace scripts. No backend, API, package manifest, or lockfile changes are in the allowlist.
- Code review found no P1 or P2 defect in the candidate changes. The inherited local-path and PDF metadata items are listed above for manual review.

### Current bundle output

| Built asset        |              Current candidate |
| ------------------ | -----------------------------: |
| Main entry JS      |  307.90 KB raw / 97.48 KB gzip |
| CSS                |   82.32 KB raw / 15.52 KB gzip |
| Lazy mobile Sheet  |   50.95 KB raw / 17.34 KB gzip |
| Three.js vendor    | 710.10 KB raw / 181.82 KB gzip |
| Traceability scene |  193.31 KB raw / 60.58 KB gzip |

The V8.1 report measured the main entry at 275.65 KB raw / 84.28 KB gzip and CSS at 59.88 KB raw / 11.54 KB gzip. The current main entry is therefore about 13.20 KB gzip larger and CSS about 3.98 KB gzip larger; the Three.js vendor chunk is effectively unchanged and remains separately emitted.

## 6. Performance and release policy

No Lighthouse rerun was made. The previous interleaved runs reported a slower-CPU calibration warning in every mobile run, so another run on the same host would not resolve the uncertainty.

The V8.1 evidence remains **PERFORMANCE INCONCLUSIVE**: the current V8.2 candidate's mobile median was Performance 42 and LCP 4.281 s, compared with the targets of Performance ≥90 and LCP ≤2.5 s. The prior report also found the external Google Fonts stylesheet on the V8 baseline critical path, while the current build uses local font files. The remaining LCP delay is not isolated to one component by available evidence.

| Readiness area                 | Status                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Git source and reproducibility | **PASS WITH WARNINGS** — exact candidate builds and tests; manual path/PDF metadata review remains.                       |
| Development branch             | **READY WITH WARNINGS** — no blocking source/build/test issue; unrelated worktree material remains excluded and unstaged. |
| Production release             | **NOT READY** — mobile KPI remains unmet and the benchmark conclusion is inconclusive.                                    |

## 7. Recommended commit plan

If the user later chooses to commit, use explicit paths from the manifest and review the resulting staged diff before each commit. Do not use `git add .`.

1. **Shared UI and tokens:** `packages/ui/src/components/card.tsx`, `packages/ui/src/components/sheet.tsx`, `packages/ui/src/styles/globals.css`.
2. **Landing integration and interaction:** the 14 paths in the “Landing page and interactions” group above.
3. **Functional QA:** `apps/web/tests/verify.cjs`.
4. **Repository configuration and reports:** `.gitignore` and the six `docs/deeptrace-v*.md`/component-matrix files in the “Repository configuration and evidence” group above.

The V7 report deletion is not in this plan. No file was staged, committed, pushed, merged, or deployed during this validation.

## 8. Skills and limitations

Skills applied: `kn-init`, `kn-review`, `secrets-scan`, `verification-before-completion`, and `webapp-testing`. The `kn-init` tool reports that this repository is not connected to a Knowns project, so code-intelligence navigation was unavailable; the review used the Git diff, source/package configuration, and the clean-snapshot checks. The `secrets-scan` skill's referenced `plays/secrets-scan.md` file is absent; its installed `SKILL.md` procedure was followed. `systematic-debugging` was not needed because no project check failed.

No repository-root `AGENTS.md` or `GEMINI.md` was found under the repository or its parent. The user-provided agent instructions were applied.

## Outstanding items

1. Human review of the redacted machine-local path at `docs/deeptrace-v7-source-audit-cleanup-report.md:79` and confirmation that it is acceptable to leave this unchanged base file in the tree.
2. Human review of the PDF's non-empty author/creator/keywords metadata.
3. A stable Lighthouse run on a correctly calibrated, idle mobile test host before treating performance as a production pass.

**Final conclusion: READY WITH WARNINGS for development-branch source review; public push remains unapproved and was not performed. Production release readiness is not established.**
