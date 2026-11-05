# DeepTrace V8.1 — Candidate staging manifest

**Branch:** `landing-page` (`1b6814a`)  
**Purpose:** allowlist of worktree paths to overlay onto `HEAD` for a reproducible candidate Git tree. The full candidate tree also contains unchanged tracked files from `HEAD`.  
**Current Git action:** no regular `git add`, commit, push, or deployment was performed.

## Candidate inclusion set

This allowlist includes the landing-page implementation and its review evidence. It deliberately excludes unrelated worktree content and preserves the V7 report deletion as unstaged by leaving that path from `HEAD` in the candidate tree.

| Path                                                         | Reason                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `.gitignore`                                                 | Keep generated root `tmp` output and skill lock metadata out of status/commit selection. |
| `apps/web/index.html`                                        | Landing document and initial theme/style setup.                                          |
| `apps/web/src/components/landing/BrandStatementSection.tsx`  | Landing composition.                                                                     |
| `apps/web/src/components/landing/ContactAndFooter.tsx`       | Contact/CTA/footer composition.                                                          |
| `apps/web/src/components/landing/FeaturesSection.tsx`        | Shared card/badge migration.                                                             |
| `apps/web/src/components/landing/Header.tsx`                 | Shared controls and lazy Sheet hardening.                                                |
| `apps/web/src/components/landing/Hero.tsx`                   | Landing hero.                                                                            |
| `apps/web/src/components/landing/HeroScene.tsx`              | Three.js UI controls and shared detail primitives.                                       |
| `apps/web/src/components/landing/IndustriesSection.tsx`      | Landing composition.                                                                     |
| `apps/web/src/components/landing/MobileNavigationSheet.tsx`  | New lazy-loaded shared Sheet composition.                                                |
| `apps/web/src/components/landing/navigation.ts`              | Shared navigation/contact URL constants.                                                 |
| `apps/web/src/main.tsx`                                      | Application entry and shared style setup.                                                |
| `apps/web/src/styles/landing.css`                            | Landing, theme, responsive and Sheet styles.                                             |
| `apps/web/src/styles/trace-experience.css`                   | Three.js scene styles.                                                                   |
| `apps/web/src/components/landing/ProductShowcaseSection.tsx` | Product presentation.                                                                    |
| `apps/web/tests/verify.cjs`                                  | Functional regression coverage.                                                          |
| `packages/ui/src/components/card.tsx`                        | Shared Card primitive changes.                                                           |
| `packages/ui/src/components/sheet.tsx`                       | New shared Base UI Sheet primitive.                                                      |
| `packages/ui/src/styles/globals.css`                         | Shared style source scan and tokens.                                                     |
| `docs/deeptrace-v8-shadcn-migration-report.md`               | V8 shared UI migration evidence.                                                         |
| `docs/deeptrace-v8-ui-component-matrix.md`                   | Component decisions and evidence.                                                        |
| `docs/deeptrace-v8.2-full-shadcn-migration-report.md`        | V8.2 migration, QA, and measured performance report.                                     |
| `docs/deeptrace-v8.1-final-hardening-report.md`              | V8.1 hardening, verification, security and Lighthouse report.                            |
| `docs/deeptrace-v8.1-github-staging-manifest.md`             | This allowlist and exclusions.                                                           |
| `docs/deeptrace-v8.3-pre-push-report.md`                     | V8.3 security, Git inventory, and isolated candidate validation evidence.                |

`docs/deeptrace-v7-source-audit-cleanup-report.md` is present from `HEAD` in the candidate tree; its worktree deletion is intentionally excluded because that deletion was not part of the reviewed change. The allowlist contains no PDF or extracted page-image changes. Since the candidate tree starts from `HEAD`, the tracked brand guideline PDF and tracked logo source images remain in the full tree and are covered by the V8.3 binary-metadata review. Untracked page-image extracts remain excluded.

## Explicit exclusions

| Worktree path/group                                                                                     | Reason                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `.agents/`                                                                                              | Local skill/tooling material, not landing-page source.                               |
| `apps/poc-astro/`                                                                                       | Separate Astro proof of concept and outside the requested workspace scope.           |
| `apps/web/tests/*` research, benchmark, inspect, experiment, and ad hoc scripts other than `verify.cjs` | Local audit artifacts, not production test entry points.                             |
| `docs/LOGO/page_*.png`                                                                                  | Extracted images from a brand guideline PDF; binary metadata was not fully verified. |
| `skills-lock.json`                                                                                      | Local skill tooling metadata.                                                        |
| `tmp/` and QA screenshots/reports                                                                       | Generated captures and measurement outputs; preserved locally.                       |
| `docs/deeptrace-v7-source-audit-cleanup-report.md` deletion                                             | Deletion is not verified and is excluded.                                            |

## Candidate construction and safeguards

The candidate tree was created by initializing a separate `GIT_INDEX_FILE` from `HEAD`, adding only the allowlist above, writing that temporary index as a tree, then archiving the tree to an OS temporary directory. This leaves the normal index and branch untouched. Frozen install, typecheck, lint, build, 29 functional checks, and 70 visual checks were run in that isolated snapshot.

No full-worktree `git add` is recommended. If the user later decides to commit, stage only the inclusion set after reviewing the final report and the unstaged local changes. The manifest is a review aid, not a request or authorization to stage or push.
