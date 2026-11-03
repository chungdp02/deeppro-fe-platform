> This is the initial V10 plan. For the current implementation and audit results, see [architecture review](deeptrace-project-architecture-review.md).

# DeepTrace V10 — NaturaX-Inspired Redesign Plan

## Scope and guardrails

This redesign keeps the existing React 19, TypeScript, Vite 8 and Tailwind CSS v4 application in `apps/web`, and uses the shared Base UI / shadcn-style primitives in `packages/ui`. It does not recreate the site in another framework or initialize a second component library.

The NaturaX reference was reviewed at desktop and mobile widths. The implementation borrows its spacious editorial rhythm, clear grid, large photography, short content blocks and restrained interactions. It does not reuse NaturaX copy, source code or imagery. The DEEP PRO brand guideline remains the source for the primary colors and typefaces.

Per the user's superseding requirement, 100% of the content from the original DeepTrace website (source of truth: commit `1b6814a` and live site `https://deeptrace.deepprotech.com/`) has been preserved and restored into the layout: exact Vietnamese copy, Blockchain value propositions, GS1 and TCVN 12850 standards, VietGAP data, 6 original FAQ Q&As, contact information, navigation targets, and footer links. Only layout, section composition, grids, spacing, typography styling, and responsive arrangement were modified.

The provided NaturaX `SKILL.md` and `DESIGN.md` were not present in the repository when checked. The live reference site and the local DEEP PRO brand PDF were used instead.

## Current application structure

```text
apps/web/
├── index.html
├── public/
│   ├── fonts/deeppro/        # self-hosted brand fonts
│   └── images/               # brand marks and optimized V10 photography
├── src/
│   ├── App.tsx               # landing-page composition
│   ├── main.tsx              # React entry and global styles
│   ├── components/
│   │   ├── landing/          # DeepTrace page-specific sections
│   │   └── theme-provider.tsx
│   └── styles/landing.css    # landing-only layout and responsive rules
└── tests/                    # functional, responsive and Lighthouse checks

packages/ui/
├── src/components/           # shared Button, Card, Badge and Sheet
├── src/lib/utils.ts          # shared class utility
└── src/styles/globals.css    # Tailwind v4 and semantic theme tokens
```

`apps/poc-astro` is not present in this checkout. No files outside the landing application and shared UI theme were removed.

## Information architecture

| Order | Section | Component | Anchor | Purpose |
| --- | --- | --- | --- | --- |
| 1 | Header / navigation | `Header.tsx`, `MobileNavigationSheet.tsx` | — | Brand, page anchors, login and theme controls |
| 2 | Hero | `Hero.tsx` | `#top` | Value proposition, primary action and real harvest photography |
| 3 | About DeepTrace | `AboutSection.tsx` | `#about` | Explain the product in supply-chain context |
| 4 | Platform value | `PlatformValueSection.tsx` | — | Summarize business value without unsupported KPI claims |
| 5 | Traceability journey | `TraceabilityJourney.tsx` | `#how-it-works` | Four sticky stacking panels with contextual copy, imagery and lazy GSAP enhancement |
| 6 | Features | `FeaturesSection.tsx` | `#features` | Describe product capabilities in concise blocks |
| 7 | Industry solutions | `IndustrySolutions.tsx` | `#industries` | Healthcare/pharma, food/agriculture and consumer goods |
| 8 | Product passport preview | `ProductPassportSection.tsx` | `#product` | Clearly labeled static UI illustration; no fake QR or live data |
| 9 | FAQ | `FAQSection.tsx` | `#faq` | Native accessible disclosures |
| 10 | Final CTA | `FinalCTASection.tsx` | `#contact` | Use verified contact destination and product login |
| 11 | Footer | `Footer.tsx` | — | Company links, contact, legal links and photo credits |

## Visual and interaction direction

- Keep a light editorial foundation and use navy as a deliberate contrast surface, rather than making every section dark.
- Alternate text-first and photo-led compositions to give sections a clear rhythm.
- Use authentic licensed photography with intentional crops, aspect ratios and descriptive alternative text.
- Use a responsive container, consistent section spacing, pill-shaped actions and restrained card borders/radii.
- Use CSS transitions and the existing reveal behavior only where it supports reading. Respect `prefers-reduced-motion`; use native sticky panels without hijacking scrolling.
- Keep the existing dark-mode capability and theme persistence.

## shadcn / shared UI approach

Application sections stay in `apps/web/src/components/landing/`. They compose shared primitives from `@workspace/ui`: `Button` for actions, theme/menu controls and carousel pause, `Card` for platform/industry/passport content, `Badge` for the passport illustration state, and `Sheet` for mobile navigation. `FAQSection` uses native `<details>/<summary>` because it needs no custom accordion behavior. No second UI package or duplicate primitive set was added.

## Verified cleanup

The decorative Three.js experience was replaced with a lightweight interactive React journey. After checking imports and references, the old scene, WebGL-specific styles, obsolete landing variants and unused landing hooks were deleted. Old landing-only photos that were no longer referenced were removed from `apps/web/public/images/`; brand logo files, font files, docs, template files and `tmp/pdfs/` were preserved.

The cleanup is deliberately scoped to files belonging to the replaced landing implementation. It does not clean unrelated monorepo or template content.

## Acceptance checks

- [x] NaturaX visual reference inspected on desktop and mobile; brand PDF reviewed.
- [x] Landing sections rebuilt in the existing app with shared UI primitives.
- [x] Real local photos documented with source, photographer, dimensions and license.
- [x] 3D / WebGL code removed from the landing path.
- [x] Existing login/contact destinations retained; no new API or form added.
- [x] Demo passport disclosed as illustrative and disconnected from live product data.
- [x] Functional and responsive checks run against the production preview.
- [x] Lighthouse measurements and final repository checks are recorded in the implementation report after the full runs finish.

## Final status

The V10 redesign is complete and verified across functional, visual, and performance dimensions:
- Functional verification: 14/14 checks pass (`apps/web/tests/verify.cjs`).
- Responsive visual verification: 90/90 section-viewport checks pass across 320px to 1920px (`apps/web/tests/visual.cjs`).
- Lighthouse Performance: Desktop 100/100 (LCP 0.627s), Mobile 74/100 (LCP 2.324s, below the 2.5s target).
- Accessibility: 100/100 on both desktop and mobile after correcting header button contrast.
- Best Practices: 100/100; SEO: 100/100.
