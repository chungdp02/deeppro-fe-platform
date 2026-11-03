# DeepTrace V10 Design System

## Design intent

**Editorial agriculture technology with a practical enterprise product story.** NaturaX informs the use of whitespace, large photography, asymmetric layouts and section rhythm. DeepTrace retains its own brand palette and typography. Layouts stay restrained: no dashboard-like wall of cards, constant animation, WebGL scene or borrowed reference-site assets.

## Brand and semantic tokens

The base values below are from `docs/[DEEPPRO] BRAND GUIDELINE.pdf`; semantic foreground/background values are mapped in `packages/ui/src/styles/globals.css`.

| Token | Light value | Dark value / use |
| --- | --- | --- |
| Brand primary blue | `#005AAB` | Light blue is promoted to the interactive primary for contrast |
| Brand navy | `#0C263D` | Main dark surface and light-mode foreground |
| Brand light blue | `#ADD8FF` | Accent and dark-mode interactive primary |
| Brand neutral | `#EDEFF4` | Light page background |
| Brand neutral border | `#D8E0E8` | Light borders / secondary surface |
| Brand secondary | `#8EA9C1` | Inputs and secondary brand detail |
| Background | `#EDEFF4` | `#071D2E` |
| Foreground | `#0C263D` | `#F1F6FB` |
| Card / popover | `#FFFFFF` | `#0C263D` |
| Secondary / muted | `#D8E0E8` / `#E4E9F0` | `#173850` |
| Muted foreground | `#334D63` | `#C3D2DF` |
| Border | `#D8E0E8` | `#315069` |
| Destructive | `#B42318` | `#FFB4AB` |
| Radius base | `1rem` | `1rem` |

The semantic tokens (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `destructive`) are mapped to Tailwind v4 utilities using `@theme inline`. This keeps sections and shared primitives on the same light/dark color system.

## Typography

- Display/headings: self-hosted **Oswald**, with Montserrat fallback.
- Body/interface: self-hosted **Montserrat**.
- Files are split into Latin and Vietnamese subsets; both use `font-display: swap`.
- Headings use fluid sizes and compact line-height; body copy uses readable line-height and a constrained measure.
- No external Google Fonts request is added.

## Layout and spacing

- Maximum content width: `1320px` (`--page-max`).
- Desktop gutters: `clamp(20px, 5vw, 72px)`; mobile gutter: `20px`.
- Section spacing: `clamp(76px, 9vw, 144px)`; mobile: `72px`.
- Main content becomes a single column below `980px`; mobile-specific navigation and spacing apply below `640px`.
- Photographs retain source proportions where useful and use context-specific crop positioning for editorial compositions.

## Shared shadcn-style components

The project’s existing shared library is built on Base UI and Tailwind CSS v4. V10 uses:

| Primitive | Landing use |
| --- | --- |
| `Button` / `buttonVariants` | Hero and CTA actions, interactive journey stages, product login link |
| `Card`, `CardHeader`, `CardContent` | Platform value, industry image cards and passport illustration |
| `Badge` | `Bản minh họa` marker on the static product passport |
| `Sheet` | Mobile navigation with close, Escape and focus-return behavior |

Page-specific compositions remain in `apps/web/src/components/landing/`. Native `<details>/<summary>` is used for FAQ instead of adding an unnecessary second accordion implementation.

## Component states and accessibility

- Buttons and links have visible keyboard focus, touch-sized interactive areas, and verified WCAG AA contrast compliance (`.button--primary` and `.button--header` provide 4.7:1 contrast in light mode and 10.8:1 in dark mode, passing Lighthouse accessibility 100/100).
- Journey buttons expose `aria-pressed` and update the live journey panel.
- Mobile navigation uses the shared Sheet and is checked for open, navigate, Escape and focus-return behavior.
- FAQs use semantic native disclosures; headings and sections use landmarks and `aria-labelledby`.
- Images include descriptive alt text, intrinsic width/height, lazy loading outside the hero, and async decoding.
- Theme uses semantic tokens rather than per-section hard-coded mode overrides.
- Decorative reveal motion is disabled or bypassed under `prefers-reduced-motion`.

## Motion and interaction

The interactive traceability journey uses React state and CSS, not an animation dependency. Reveal behavior uses Intersection Observer as progressive enhancement; content remains visible if motion is reduced or script setup is unavailable. Hover/focus transitions are short and never block content access.

## Product data and trust

The product passport card is labeled **Bản minh họa** and states that it is not connected to real product data. It does not fabricate a QR code, batch result, certificate, customer, deployment metric or regulatory claim. Login/contact actions use existing destinations from the project.
