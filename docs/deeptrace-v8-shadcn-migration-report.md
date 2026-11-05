# DeepTrace V8 — shadcn/Base UI migration report

**Ngày thực hiện:** 2026-10-30  
**Repository:** `deeppro-fe-platform`  
**Branch:** `landing-page`  
**Phạm vi:** `apps/web` và shared package `packages/ui`

## 1. Tóm tắt

`apps/web` đã bắt đầu dùng shared primitives thực tế từ `@workspace/ui`: `Button`, `Card`, `Badge` và `buttonVariants`. Tailwind CSS v4 đã được nối qua package export, source detection được thu hẹp đúng các component được dùng và semantic tokens sáng/tối được thêm theo màu DEEP PRO. CTA vẫn là anchor; Three.js, FAQ native, menu navigation và bố cục landing tiếp tục dùng implementation phù hợp hiện tại.

Không thêm dependency, không đổi Radix, không chạy `shadcn init`, không thay backend/API. Không stage, commit, push hoặc deploy.

## 2. Architecture ban đầu

- Monorepo pnpm/Turborepo gồm `apps/web` (React 19, TypeScript, Vite 8), `packages/ui` (shadcn Base Nova, Base UI 1.9, Tailwind CSS v4) và `apps/poc-astro`.
- `apps/web` chưa import primitive nào từ `@workspace/ui`; package đã có Button, Card, Badge, Accordion, Dialog và các component khác dựa trên Base UI.
- Vite đã dùng `@tailwindcss/vite`, nhưng `main.tsx` chỉ nạp `landing.css` và `trace-experience.css`. Shared `globals.css` chưa được app import; `@source` khi đó không trỏ chính xác đến source app từ vị trí stylesheet.
- `landing.css` và `trace-experience.css` chứa reset, typography, layout, theme và motion riêng. Theme được áp trên `html` bởi `ThemeProvider`/prepaint script; prerender dùng `renderToString()`, sau đó client dùng `hydrateRoot()`.
- Hero 3D dùng React Three Fiber/Three.js, load theo capability, có fallback, reduced-motion, pause khi offscreen và phục hồi WebGL context. Không thay lifecycle hoặc cấu trúc scene trong migration.
- Montserrat và Oswald đã có file local; body dùng Montserrat nhưng headings dùng Plus Jakarta Sans từ Google Fonts. Brand guideline chính thức yêu cầu Oswald/Montserrat và bảng màu `#005AAB`, `#0C263D`, `#ADD8FF`, `#EDEFF4`, `#D8E0E8`, `#8EA9C1`.
- Các báo cáo V5–V6 không có trong working tree hiện tại. Báo cáo V7 có trong `HEAD`, nhưng đã bị xóa ở working tree trước V8; chỉ đọc qua `git show`, không khôi phục.

Tài liệu shadcn xác nhận cách dùng package exports cho monorepo và Tailwind v4 semantic tokens; Tailwind cho phép không import Preflight để tránh reset ngoài ý muốn. Base UI Button xác nhận link nên tiếp tục là `<a>` thay vì bị gán button semantics. ([monorepo](https://ui.shadcn.com/docs/monorepo), [theming](https://ui.shadcn.com/docs/theming), [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), [Preflight](https://tailwindcss.com/docs/preflight), [Base UI Button](https://base-ui.com/react/components/button))

## 3. Chiến lược migration

- Dùng đúng `@workspace/ui` đã có, không tạo bộ component thứ hai.
- Nạp `theme.css` và `utilities.css`, bỏ `preflight.css`. Quy tắc reset/layout chưa layer trong CSS hiện tại vì vậy giữ nguyên mức ưu tiên.
- Tailwind scan toàn bộ `apps/web/src` và đúng ba file primitive đang dùng (`button.tsx`, `card.tsx`, `badge.tsx`) để tránh sinh utilities cho các component chưa được import.
- Dùng Base UI Button cho controls trong header/theme; dùng `buttonVariants` để chia sẻ style cho CTA anchors nhưng giữ nguyên semantics, href và target.
- Dùng Card cho hai tập nội dung card thực sự (feature và benefits), bổ sung `as="article"` để giữ semantics; dùng Badge cho nhãn chứng nhận, số bước và tree node.
- Giữ native `<details>/<summary>` cho FAQ và giữ mobile drawer tùy biến vì chúng đã đáp ứng behavior hiện có mà không biến navigation thành modal. Các nút chặng, load/retry và pause của scene giữ native button/CSS riêng để không thêm wrapper vào luồng điều khiển 3D.

## 4. Thay đổi source

| File | Thay đổi |
| --- | --- |
| `packages/ui/src/styles/globals.css` | Thêm Tailwind v4 theme/utilities không có Preflight; sửa source paths; thêm semantic light/dark tokens, font và radius tokens. |
| `apps/web/src/main.tsx` | Import stylesheet shared qua package export trước CSS riêng của landing. |
| `packages/ui/src/components/card.tsx` | Thêm `as="div" | "article"`, vẫn giữ data-slot, size và classes hiện tại. |
| `apps/web/src/components/landing/Header.tsx` | Dùng shared Base UI Button cho theme toggles và mobile menu trigger; CTA liên hệ dùng `buttonVariants`. |
| `apps/web/src/components/landing/Hero.tsx`, `ContactAndFooter.tsx` | Dùng `buttonVariants` cho 3 CTA link; URLs và link behavior giữ nguyên. |
| `apps/web/src/components/landing/FeaturesSection.tsx` | Chuyển 6 feature cards sang shared `Card as="article"`. |
| `apps/web/src/components/landing/BrandStatementSection.tsx` | Chuyển 3 benefit cards sang Card và step labels sang Badge. |
| `apps/web/src/components/landing/IndustriesSection.tsx` | Dùng Badge cho các số node trang trí; node vẫn nằm trong `aria-hidden`. |
| `apps/web/src/components/landing/ProductShowcaseSection.tsx` | Dùng Badge cho nhãn “Chuẩn VietGAP”. |
| `apps/web/index.html` và hai stylesheet landing | Xóa request Google Fonts; preload Oswald tiếng Việt và giữ preload Montserrat; dùng Oswald cho headings/display và Montserrat cho body, theo brand guideline. |
| `apps/web/src/styles/trace-experience.css` | Đảm bảo nút retry có target tối thiểu 44px. |
| `apps/web/tests/verify.cjs` | Thêm regression check số lượng/data-slot của shared Button, Card, Badge và CTA anchor semantics. |

Không có dependency hoặc lockfile changes. `packages/ui` không bị nhân bản; Astro POC và backend/API không bị sửa.

## 5. Design system và theme

- Light tokens: `--primary: #005aab`, `--primary-foreground: #ffffff`, `--secondary: #d8e0e8`, `--accent: #add8ff`, `--background: #edeff4`, `--foreground: #0c263d`, cùng border/ring/destructive tokens.
- Dark tokens: navy surfaces `#07131f`/`#0c2033`, foreground `#f0f6fc`, primary `#add8ff` với foreground `#0c263d`; các token phụ có cặp foreground riêng.
- Tailwind semantic mappings: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring; font-sans/font-heading và radius scale.
- `ThemeProvider`, class `.dark`, key `deeptrace-theme`, prepaint script và hydration path giữ nguyên. Không có Dialog/Portal mới.
- Logo header/footer sáng/tối giữ asset chính thức. Không đổi tỉ lệ hoặc recolor logo.
- CTA variant colors, spacing, motion và section-specific layout vẫn do CSS thương hiệu điều khiển; shared variants cung cấp primitive/focus styling.

## 6. Skills đã dùng

| Skill | Vị trí | Áp dụng thực tế |
| --- | --- | --- |
| `frontend-patterns` | Skill đã cài trong môi trường agent | Audit package boundaries và giữ composition/business UI trong `apps/web`; shared primitives trong `packages/ui`. |
| `vercel-react-best-practices` | Skill đã cài trong môi trường agent | Không thêm dependency, kiểm tra initial bundle và giữ scene dynamic/lazy loading. |
| `systematic-debugging` | Skill đã cài trong môi trường agent | Theo lỗi type `data-size` trong `mergeProps` và sửa bằng API Card `as` đơn giản; sửa test expectation theo 7 Badge thực tế. |
| `benchmark-optimization-loop` | Skill đã cài trong môi trường agent | Thu thập cùng Lighthouse/Chrome, ba lượt mỗi profile, báo median/range và so bundle. |
| `webapp-testing` | Skill đã cài trong môi trường agent | Functional, reduced motion, mobile navigation, theme, prerender, WebGL fallback và responsive visual QA. |
| `verification-before-completion` | Skill đã cài trong môi trường agent | Chỉ báo PASS theo lệnh đã chạy; kiểm tra diff/status trước khi báo kết quả. |
| `frontend-a11y` | Skill đã cài trong môi trường agent | Giữ link/button semantics, label/pressed state, focus behavior và target kích thước cho retry. |
| `ui-ux-pro-max` | Skill đã cài trong môi trường agent | Tìm guidance cụ thể cho mobile touch/navigation và dark semantic tokens; dùng kết quả để giữ target, keyboard path và paired tokens. |
| `pdf:pdf` | PDF skill của môi trường agent | Trích xuất guideline gốc để xác nhận palette, font và logo rules. |

`design-system-techno` không có trong bộ skill đã cài; không cài skill bên ngoài. Knowns không thể kết nối vì repo thiếu `.knowns/`, nên việc discovery/edit source thực hiện bằng công cụ file của workspace.

## 7. Quality gates

| Kiểm tra | Kết quả |
| --- | --- |
| `corepack pnpm typecheck` | PASS (web và shared UI). |
| `corepack pnpm lint` | PASS (web và shared UI). |
| `corepack pnpm --filter web build` | PASS; TypeScript, Vite production build và prerender đều chạy. |
| `corepack pnpm --filter web test:verify` | PASS 26/26; kiểm tra 3D WebGL, camera, hotspots, keyboard, context recovery, theme, mobile menu, no-JS prerender và console. |
| `corepack pnpm --filter web test:visual` | PASS 70/70 viewport/section combinations. |
| Responsive widths | 320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920 px; không tràn ngang, overlap hoặc clipped text. |
| Lighthouse accessibility / best practices / SEO | Mỗi profile đạt median 100/100/100 trong các lượt đã đo. |
| Reduced motion / dark mode / SSR hydration / WebGL fallback | Được kiểm tra trong functional suite; PASS. |

Không có form, dialog, tooltip hay popover mới cần test. Mobile menu Escape/resize/focus, FAQ expand, links, 3D stage keyboard, save-data, reduced-motion và WebGL recovery đều giữ test hiện có.

## 8. Lighthouse và bundle

### Baseline V8

Baseline được đo lại trước sửa trên production preview cùng Lighthouse 13.5/Chrome 156, ba lượt mobile và desktop. Kết quả baseline là:

| Profile | Performance | LCP | FCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile | 61 (40–66) | 2.647 s (2.338–4.823) | 2.647 s (2.338–4.823) | 2162 ms (2087–2710) | 0.000090 |
| Desktop | 91 (90–94) | 0.859 s (0.839–0.897) | 0.839 s (0.819–0.877) | 209 ms (146–225) | 0.000608 |

LCP element là `p.trace-intro__description`. Trong baseline, Lighthouse ghi element render delay 2.633 s và Google Fonts stylesheet là render-blocking với ước tính tiết kiệm khoảng 1.406 s. Đây là bằng chứng dẫn đến việc bỏ Google Fonts request, preload font local và chuẩn hóa family theo guideline.

### Sau migration

Đo lại trên cùng production preview bằng Lighthouse 13.5/Chrome 156 sau khi giữ native controls trong scene 3D. Desktop có đủ ba lượt hợp lệ; mobile có hai lượt hợp lệ. Lượt mobile thứ ba timeout và không trả về Performance/TBT hợp lệ, nên được loại khỏi median và ghi riêng bên dưới.

| Profile | Performance | LCP | FCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile (n=2 hợp lệ) | 57.5 (56–59) | 3.025 s (2.874–3.176) | 3.025 s (2.874–3.176) | 2292 ms (2280–2304) | 0.000191 (0–0.000381) |
| Desktop (n=3) | 93 (89–94) | 0.620 s (0.605–0.694) | 0.490 s (0.485–0.561) | 198 ms (187–264) | 0.000666 (0.000666–0.000770) |

Lượt mobile thứ ba ghi `page loaded too slowly`, benchmark CPU thấp hơn mức Lighthouse kỳ vọng và không có khoảng CPU idle để tính TBT (`NO_TTI_CPU_IDLE_PERIOD`). Lượt này bị loại khỏi median; mobile chỉ còn n=2 nên số liệu chưa ổn định như bộ ba lượt hợp lệ. So với baseline đã đo, mobile median hiện kém hơn (LCP 3.025 s so với 2.647 s; TBT 2292 ms so với 2162 ms), vì vậy mục tiêu LCP ≤2.5 s chưa đạt. Desktop giữ kết quả tốt (Performance median 93, LCP 0.620 s). Không kết luận phần migrate cải thiện hiệu năng mobile từ bộ benchmark này.

Root cause có bằng chứng ở baseline: Google Fonts stylesheet chặn render và Lighthouse ước tính có thể tiết kiệm khoảng 1.406 s; LCP element là `p.trace-intro__description`, với render delay 2.633 s. Thay đổi đã bỏ request Google Fonts và preload font local. Sau migrate, LCP vẫn nằm ở paragraph này và thời gian TBT còn cao, nên phần chặn font đã được xử lý nhưng công việc main thread/render còn lại chưa được xác định đầy đủ. Cần profiling trace riêng trên thiết bị CPU ổn định trước khi đề xuất tối ưu tiếp theo.

Ở lượt mobile hợp lệ đầu tiên sau migrate, Lighthouse ghi Style/Layout khoảng 4.48 s, Script Evaluation khoảng 2.81 s và Rendering khoảng 1.46 s trong main-thread breakdown; audit `unused-css-rules` ước tính tiết kiệm 0 B, còn `unused-javascript` ước tính khoảng 40 KB. Đây là gợi ý để profiling JavaScript/long tasks tiếp theo, không phải căn cứ xóa CSS hay trì hoãn chức năng. Do Lighthouse cảnh báo CPU chậm và bộ mobile chỉ còn hai lượt hợp lệ, không quy toàn bộ chênh lệch này cho migration.

### Bundle

| Asset | Baseline raw / gzip | Sau migration raw / gzip | Chênh lệch gzip |
| --- | ---: | ---: | ---: |
| Main JS | 275,647 / 83,478 B | 314,939 / 98,796 B | +15,318 B |
| CSS build | 59,879 / 11,519 B | 77,990 / 14,754 B | +3,235 B |
| Prerendered HTML, inline CSS | 103,124 / 20,341 B | 135,712 / 24,736 B | +4,395 B |
| Three.js vendor chunk | 710,111 / 180,322 B | 710,111 / 180,322 B | 0 B |
| Traceability scene chunk | 194,838 / 60,434 B | 194,838 / 60,433 B | -1 B |
| Trust scene chunk | 5,836 / 2,567 B | 5,836 / 2,567 B | 0 B |

Prerender injects built CSS vào HTML, nên không cộng riêng CSS artifact lần nữa khi ước tính HTML initial response. Build tiếp tục có cảnh báo Three.js chunk >500 KB raw; chunk này được giữ riêng theo dynamic scene loading.

## 9. GitHub readiness / giới hạn

- V8 source changes: các file được liệt kê ở mục 4; hai report V8 mới.
- Dependency/lockfile: không thay đổi.
- `git diff --check`: không có lỗi whitespace; Git chỉ báo cảnh báo chuyển LF sang CRLF với các file đã sửa.
- Git status cuối: vẫn ở `landing-page`, không có file staged; `pnpm-lock.yaml` không đổi. Thay đổi V8 nằm ở source/UI/config và hai report mới.
- Secret scan: không có `trufflehog`, `gitleaks` hoặc `detect-secrets` trong PATH; playbook được skill tham chiếu không có trong thư mục cài. Đã chạy manual high-confidence pattern scan trên các source V8, hai report và `.npmrc`, không có match. `.gitignore` bỏ qua `.env` và `.env.*` nhưng giữ các file example; không tìm thấy `.github/workflows`, `.husky` hoặc `core.hooksPath` tùy chỉnh. Đây không thay thế scanner toàn repository hoặc lịch sử Git.
- Trước V8, working tree đã có thay đổi `.gitignore`, xóa local report V7 và nhiều file untracked (`.agents`, Astro POC, các test/report nghiên cứu và ảnh PDF). Chúng được giữ nguyên; không stage hoặc khôi phục.
- Không chạy commit, push hoặc deploy.

### Kết luận readiness

Migration và regression gates về type, lint, build, functional QA, responsive/visual QA, theme và hydration đều pass. Desktop Lighthouse không giảm so với baseline. Tuy nhiên mobile median sau migration thấp hơn baseline và chỉ có hai lượt hợp lệ, nên chưa thể chứng nhận acceptance “không suy giảm hiệu năng đáng kể” cho mobile. Phần triển khai sẵn sàng để review; performance sign-off mobile vẫn cần bộ benchmark ổn định hơn và profiling main thread.

## 10. Nguồn tham khảo

- [shadcn monorepo](https://ui.shadcn.com/docs/monorepo)
- [shadcn theming](https://ui.shadcn.com/docs/theming)
- [shadcn Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [Tailwind v4 source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind Preflight](https://tailwindcss.com/docs/preflight)
- [Base UI Button](https://base-ui.com/react/components/button)
- [Base UI Dialog](https://base-ui.com/react/components/dialog)
- [Base UI Accordion](https://base-ui.com/react/components/accordion)
