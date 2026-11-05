# DeepTrace V8.1 — Final hardening report

**Date:** 2026-10-30  
**Branch:** `landing-page` (`1b6814a`)  
**Scope:** V8/V8.2 source and QA hardening for `apps/web` and `packages/ui`  
**Git constraint:** no normal-index staging, commit, push, or deployment was performed.

## Executive summary

The V8.2 migration uses the existing shared UI package and its Base UI foundation. The audit confirmed that the Sheet is loaded only when the mobile menu is opened, the FAQ remains server-rendered native disclosure markup, and the Three.js scene and product compositions remain application-specific. The hardening change fixes a real loading-state accessibility and cancellation problem in the lazy mobile drawer, with retry behavior after chunk failure.

Frozen install, TypeScript, lint, production build, functional browser QA, and responsive visual QA passed on the independent candidate snapshot. Lighthouse was measured in interleaved V8/V8.2 runs on the same host; the final figures and confidence decision are recorded below. The performance comparison remains inconclusive because machine calibration is poor and score changes are mixed.

The security review found no high-confidence secret match in the candidate text files, but automated secret scanners were unavailable and binary metadata inspection was not completed. Security is therefore **NOT FULLY VERIFIED**. GitHub readiness is **WARNINGS** because the existing worktree includes unrelated untracked material and the security scan has these limits.

## Audit scope and architecture decision

Reviewed the existing V8 and V8.2 migration reports and component matrix, the root/web/shared-UI manifests, `apps/web/index.html`, landing components and styles, theme bootstrapping, `Header`, `MobileNavigationSheet`, the shared Base UI `Sheet`, the Three.js journey, image/font references, prerender behavior, and Git status/diff.

V8.2 is a continuation of the existing React 19 + Vite + Tailwind CSS v4 workspace, not a replacement landing page. `packages/ui` already provides shared button/card/badge primitives on Base UI. The app owns DeepTrace composition and branding. The 19-pattern migration matrix records 5 MIGRATE, 4 ADAPT, 8 KEEP CUSTOM, 1 REMOVE DUPLICATE, and 1 DEFER decision. The FAQ stays as six native `<details>` elements so answers render without JavaScript and multiple questions can remain open. Product showcase, the industry tree, scroll-to-camera journey, theme prepaint, footer, and hero remain custom compositions for product-specific behavior. No backend/API or Astro POC files are part of the candidate.

### Lazy Sheet QA finding and fix

The old V8.2 behavior set `aria-expanded="true"` as soon as the menu was clicked, before the dynamically imported Sheet existed. During that gap, the menu trigger was hidden by the expanded-state CSS, leaving no visible way to cancel. A rejected import only logged an error and gave users no retry path.

`apps/web/src/components/landing/Header.tsx` now tracks `idle`, `loading`, and `error` states; shares one pending import promise; keeps the trigger available to cancel while loading; announces loading/failure with a live status; only exposes `aria-expanded` and `aria-controls` after the Sheet is mounted; and offers a labeled retry after failure. The Sheet remains lazy and uses the shared Base UI Dialog primitive. Regression checks cover delayed load/cancel/reopen, desktop resize during load, failed chunk announcement/retry, and the no-JavaScript trigger state.

## Source changes

| Area | Change |
|---|---|
| `apps/web/src/components/landing/Header.tsx` | Hardened lazy Sheet lifecycle, accessible loading/error announcements, cancel behavior, and retry. |
| `apps/web/tests/verify.cjs` | Added the above regression cases; waits for the lazy dialog and localized stage detail before asserting React-rendered state. Theme toggles also wait for React state instead of racing the render. |
| `.gitignore` | Keeps generated files under root `/tmp/` ignored, while preserving the directory contents; corrects the `skills-lock.json` ignore pattern. |
| Existing V8/V8.2 files | Candidate retains the shared Sheet, migration usage, visual styles, migration report and matrix as an integrated implementation. |

No dependency, package manifest, lockfile, API, or backend changes were needed for V8.1. The repository's existing animation approach is retained: CSS transitions and the existing IntersectionObserver/Three.js behavior cover the required motion. No Motion for React, GSAP, or additional 3D library was added because they would duplicate capabilities already present and no measured benefit justified their cost.

## Verification

All checks below were run against a temporary candidate snapshot created from a separate Git index. The user's ordinary index was not modified.

| Check | Result |
|---|---|
| `corepack pnpm install --frozen-lockfile` | PASS; candidate workspace resolved root, `web`, and `@workspace/ui` without the excluded Astro POC. |
| `corepack pnpm typecheck` | PASS. |
| `corepack pnpm lint` | PASS. |
| `corepack pnpm build` | PASS; Vite reports the existing Three.js vendor chunk above 500 KB raw. It remains separately loaded from the initial route. |
| `corepack pnpm --filter web test:verify` | **29/29 PASS** after hardening one stale-content assertion, including menu loading/cancel/failure/retry, resize, theme, FAQ without JavaScript, navigation, 3D controls, WebGL fallback/recovery, reduced motion, Save-Data, and runtime error checks. |
| `corepack pnpm --filter web test:visual` | **70/70 PASS** across 10 widths (320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920 px), light and dark. Overflow, hero overlap, and clipped stage controls assertions passed. |
| Manual screenshot review | Mobile 390 px and desktop 1440 px candidate captures showed no text/image overlap or horizontal overflow. |
| `git diff --check` | PASS (exit 0); Git emitted only expected LF-to-CRLF worktree warnings. |

The final no-WebGL run caught a flaky test read: the fallback scene changed its selected stage correctly, but the test read the live detail panel before React had replaced its old text. A separate production-preview probe confirmed both the selected button and localized “Sản xuất” detail were correct after the update. The assertion now waits for the expected Vietnamese title and `ứng dụng mobile` description before reading the panel. No product behavior change was needed.

The UI automation used the production preview build. It also confirmed normal tested paths produced no console or uncaught page errors. These checks do not replace screen-reader testing on physical devices.

## Lighthouse performance comparison

### Test conditions

The comparison uses the existing V8 source at `HEAD` and the V8.2 candidate as separate production builds. Three interleaved rounds run mobile V8, mobile V8.2, desktop V8, and desktop V8.2 on the same Windows host with Lighthouse 13.5.0 and installed Chrome 156.0.8078.74. Each profile uses the existing `apps/web/tests/run-lighthouse.cjs` settings and a fresh headless browser/cache for each run. Before measuring, both preview servers were checked for HTTP success and distinct expected entry bundle names (`index-_ZQV7A2V.js` for V8 and `index-7Lk4S4pO.js` for V8.2). An earlier measurement attempt served the same build to both ports; those 12 reports were rejected and are not used here. The reports below use the corrected independent preview roots. Raw JSON output was retained outside the repository.

Each profile has three valid V8 reports and three valid V8.2 reports. Values below are medians with full run ranges from those 12 raw JSON reports. Time values are seconds except TBT (milliseconds).

| Profile / metric | V8 median (range) | V8.2 median (range) |
|---|---:|---:|
| Mobile Performance | 40 (39–41) | 42 (40–50) |
| Mobile LCP (s) | 4.695 (4.632–4.798) | 4.281 (3.651–4.400) |
| Mobile FCP (s) | 4.695 (4.632–4.798) | 4.281 (3.651–4.400) |
| Mobile TBT (ms) | 2,653 (2,422–2,781) | 3,364 (2,297–3,760) |
| Mobile CLS | 0.000078 (0.000078–0.000090) | 0.000000 (0–0.000381) |
| Desktop Performance | 80 (69–81) | 72 (71–73) |
| Desktop LCP (s) | 0.865 (0.837–0.903) | 0.793 (0.791–0.861) |
| Desktop FCP (s) | 0.845 (0.817–0.883) | 0.634 (0.606–0.677) |
| Desktop TBT (ms) | 361 (297–709) | 623 (527–636) |
| Desktop CLS | 0.000608 (constant) | 0.001430 (0.000771–0.001430) |

Machine benchmark index was low and overlapping: mobile V8 median 723 (633–876), V8.2 median 726 (701.5–766); desktop V8 median 817 (717–822.5), V8.2 median 860 (796.5–876.5). Lighthouse reported its slower-CPU calibration warning in **all 3 mobile runs per revision** and none of the desktop runs. The low mobile indices and warning mean the emulated CPU is outside Lighthouse's expected calibration. Three runs/profile on this host are not enough to separate source effects from host/calibration noise. Mobile LCP is 414 ms lower at the V8.2 median, but mobile TBT is 711 ms higher; desktop LCP is 72 ms lower, while desktop performance is 8 points lower and TBT is 262 ms higher. The mixed directions and CPU warning make the comparison **INCONCLUSIVE**.

### LCP diagnosis

In all six fresh mobile reports the LCP element is the hero paragraph, `p.trace-intro__description`; FCP equals LCP. The V8 baseline requests a render-blocking Google Fonts CSS document for Plus Jakarta Sans in all 3 runs (1.1 KB transfer, estimated 1.381–1.391 s delay). That external request does not appear in any V8.2 run. V8.2 uses local Montserrat/Oswald font files, `font-display: swap`, and local font preloads; Lighthouse reports no font-display savings in either version. Median element-render delay falls from 4.599 s to 4.231 s; median TTFB falls from 90 ms to 39 ms. This provides direct evidence that the external font stylesheet was on the baseline critical path and was removed by the local-font implementation.

The target is still **not met**: V8.2 mobile medians are 4.281 s LCP and Performance 42, versus the requested ≤2.5 s and ≥90. In V8.2, render delay remains 3.621–4.361 s with no render-blocking request. The Lighthouse trace also shows multi-second script evaluation and style/layout work under slowdown; this points to client-side main-thread/render work as the remaining area to profile, but does not isolate a single component/function as the cause. Do not claim the local-font change alone achieves the performance goal. More controlled runs on an idle, calibrated host are required for a stable source-to-source conclusion.

### Bundle size

The isolated V8 and final V8.2 candidate builds were compared using the same Vite build output:

| Asset | V8 | V8.2 candidate | Delta |
|---|---:|---:|---:|
| Main entry JS | 275,647 B (84.28 kB gzip) | 307,902 B (97.48 kB gzip) | +32,255 B raw / +13.20 kB gzip (+15.7% gzip). |
| CSS | 59,879 B (11.54 kB gzip) | 82,329 B (15.52 kB gzip) | +22,450 B raw / +3.98 kB gzip. |
| Mobile Sheet chunk | — | 50,957 B (17.34 kB gzip) | Only fetched after opening the menu. |
| Three.js vendor chunk | 710,111 B (181.82 kB gzip) | 710,106 B (181.82 kB gzip) | Effectively unchanged; not on the initial route. |
| Traceability scene chunk | 194,838 B (61.05 kB gzip) | 193,311 B (60.58 kB gzip) | −1,527 B raw / −0.47 kB gzip. |

The V8.2 entry is larger, while its mobile drawer and Three.js scene remain separate from the initial route. The build still warns about the Three.js vendor chunk exceeding 500 KB raw. This bundle cost and the additional CSS are reported as tradeoffs; no broad dependency/code-splitting rewrite was made during final hardening.

## Security and repository cleanliness

- A manual high-confidence secret-pattern scan examined 212 text files across the visible worktree and candidate-related metadata; 40 binary files were skipped. No credential/private-key/token pattern was found in the candidate text content. A machine-path match was limited to excluded `.agents` skill data and is not part of the candidate.
- `gitleaks`, `trufflehog`, `detect-secrets`, and `exiftool` were not available in `PATH`; the `secrets-scan` skill's referenced playbook was also absent. Binary metadata inspection was started but interrupted when the PDF/image reader hung. Therefore the binary metadata portion and an automated secret scan are **not fully verified**.
- No `.env` or `.env.*` file was found in the repository scan; `.gitignore` covers both patterns. `.npmrc` has no authentication/token/password entries. High-confidence credential-pattern search through the available Git history found no matching commits.
- Current worktree has unrelated untracked `.agents/`, `apps/poc-astro/`, research/QA scripts, extracted PDF logo PNGs, and `skills-lock.json`; these remain untouched and are excluded from the candidate. The tracked deletion of `docs/deeptrace-v7-source-audit-cleanup-report.md` is also excluded, so it remains present in the candidate from `HEAD`.
- No `.github/workflows`, `.husky`, or configured Git hook path was present for automated pre-push checks.

## Final statuses

| Gate | Status | Reason |
|---|---|---|
| SHADCN MIGRATION | **PASS** | Shared Base UI Sheet/buttons/cards/badges are used where appropriate; custom FAQ and storytelling compositions have documented behavior-based reasons. |
| FUNCTIONAL QA | **PASS** | 29/29 production-preview browser checks. |
| VISUAL QA | **PASS** | 70/70 responsive combinations; key mobile/desktop captures reviewed. |
| PERFORMANCE | **INCONCLUSIVE** | Corrected three interleaved runs/profile confirm the baseline Google Fonts CSS blocker is removed; the target is still missed and CPU calibration is poor. |
| SECURITY | **NOT FULLY VERIFIED** | No manual text matches, but automated scanner and binary metadata checks are incomplete. |
| GITHUB READINESS | **WARNINGS** | Candidate can be independently built and tested, but workspace contains unrelated untracked files and the secret/binary audit has limits. The user explicitly disallows push. |

## Skills used

`kn-init`, `kn-review`, `systematic-debugging`, `secrets-scan`, `benchmark-optimization-loop`, `webapp-testing`, and `verification-before-completion`. The Knowns initialization tool reported that this repository is not connected to a Knowns project. Skills informed the review; no skills or dependencies were installed.
