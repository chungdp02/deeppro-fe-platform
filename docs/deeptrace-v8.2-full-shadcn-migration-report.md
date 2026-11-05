# DeepTrace V8.2 — Full shadcn/UI migration & design system report

**Ngày:** 2026-10-30  
**Repository:** `deeppro-fe-platform`  
**Branch:** `landing-page`  
**Phạm vi V8.2:** `apps/web`, `packages/ui`, migration matrix và báo cáo  
**Git:** Không stage, commit, push hoặc deploy.

## Tóm tắt

V8.2 đã thực hiện migration các primitive phù hợp dựa trên shared package V8, không tạo một bộ shadcn thứ hai. Mobile drawer chuyển sang shared Base UI `Sheet`, tải động khi người dùng mở để không tải Dialog code trong lần vào trang. Scene controls dùng chung `buttonVariants`; stage detail dùng `Card` và `Badge`; FAQ vẫn dùng native `<details>/<summary>` vì có behavior hữu ích khi tắt JavaScript và hỗ trợ nhiều câu hỏi mở đồng thời.

TypeScript, ESLint, production build, 26 functional checks và 70 responsive visual combinations đều PASS. Lighthouse đã chạy 6 lượt mobile và 6 desktop trước, 6+6 sau. Baseline có cảnh báo CPU slowdown ở mọi mobile run, còn sau chỉ có 1/6; benchmark index cũng thay đổi rõ rệt. Vì vậy performance được đánh dấu **INCONCLUSIVE** dù median mobile LCP giảm trong số đo sau.

## A. Initial audit

Trước V8.2, `packages/ui` đã có `Button`, `Card`, `Badge`, `Accordion` và `Dialog`; Tailwind CSS v4 đã được nối vào app, không nạp Preflight, và semantic light/dark tokens, theme persistence, prerender/hydration cùng Three.js đã được tích hợp từ V8.

V8.2 xác nhận các luồng quan trọng:

- Mobile nav là panel custom bên trong `Header`; có anchor/hash navigation, theme toggle và CTA. Drawer cần modal behavior trên thiết bị nhỏ.
- FAQ có sáu `<details>`: mặc định đóng, có thể mở nhiều mục, answer ở trong prerendered HTML và hoạt động khi JavaScript chưa chạy.
- Three.js render trong Canvas riêng; load/retry/stage/pause và stage detail là DOM controls ngoài Canvas. Các controls không được đưa vào animation frame loop.
- Product/TiltCard, industry tree/storytelling và stage↔scroll↔camera synchronization là compositions đặc thù; không có lý do để bọc lại chúng thành primitive chung.
- Không có form, Tabs, Tooltip hay Popover flow nào cần migration.

Đã xem lại V8 report, matrix, shared package, CSS entry points, Header, landing components, Three.js scene, prerendered output và brand tokens. Không sửa `apps/poc-astro` hay API/backend.

## B. Installed skills

| Skill | Áp dụng trong V8.2 |
|---|---|
| `frontend-patterns` | Giữ primitive generic trong `packages/ui`; để navigation, theme và content composition ở `apps/web`. |
| `vercel-react-best-practices` | Tách `MobileNavigationSheet` thành dynamic import khi người dùng mở drawer; không tải Sheet/Dialog code trong initial route. |
| `systematic-debugging` | Theo dõi lỗi TypeScript ở shared component và kiểm tra DOM/focus/z-index thực tế trước khi sửa. |
| `frontend-a11y` | Kiểm tra dialog name, `aria-modal`, focus trap/return, Escape, backdrop, scroll lock, link/button semantics và reduced motion. |
| `ui-ux-pro-max` | Kiểm tra menu mobile/light-dark ở 390×844 và touch/layout behavior. |
| `webapp-testing` | Chạy regression flow Three.js, theme, FAQ, navigation, mobile menu, no-JS và responsive widths. |
| `benchmark-optimization-loop` | Chạy cùng Lighthouse harness ở production preview, sáu lượt/profile trước và sau, tổng hợp median/range. |
| `verification-before-completion` | Dựa trên output lệnh thực tế; kiểm tra diff/status trước khi báo cáo. |
| `secrets-scan` | Đọc `SKILL.md`; scanner binaries không có sẵn nên thực hiện manual high-confidence pattern scan và kiểm tra `.gitignore`/`.npmrc`. File playbook được skill tham chiếu không có trong installation. |

Không cài skill hay dependency mới.

## C. Migration matrix

Migration inventory và lý do KEEP CUSTOM / DEFER nằm trong [component matrix](deeptrace-v8-ui-component-matrix.md). Tổng cộng 19 nhóm/pattern: 5 MIGRATE, 4 ADAPT, 8 KEEP CUSTOM, 1 REMOVE DUPLICATE và 1 DEFER.

Các custom exceptions có lý do kỹ thuật cụ thể: FAQ cần native no-JS disclosure; product preview và industry tree có cấu trúc/storytelling riêng; timeline đồng bộ scroll với camera; theme state/prepaint thuộc hydration; desktop/footer/hero là navigation/composition hiện hữu. Không có shared primitive trùng chức năng nào bị bỏ qua mà chưa đánh giá.

## D. Architecture

- Thêm `packages/ui/src/components/sheet.tsx`, wrap `@base-ui/react/dialog` và export `Sheet`, `SheetTrigger`, `SheetClose`, `SheetOverlay`, `SheetContent`, `SheetTitle`, `SheetDescription`.
- `SheetContent` hỗ trợ các cạnh mở và portal overlay/popup. Component được export qua wildcard package export hiện có; không sửa `package.json` hoặc lockfile.
- `MobileNavigationSheet.tsx` là app composition. Header giữ shared `Button` làm trigger, mở component bằng dynamic import, điều khiển `open` từ bên ngoài và truyền `finalFocus` ref về trigger.
- Cấu hình `@source "../components/sheet.tsx";` trong `packages/ui/src/styles/globals.css`; app sources tiếp tục được scan qua đường dẫn tương đối. Không hardcode absolute path và không nạp Preflight.
- Dùng Base UI data states cho overlay/panel transitions, semantic `popover` color token cho light/dark, và CSS riêng cho brand layout.
- Không thêm Radix, shadcn CLI hoặc dependency.

Tài liệu chính thức đã dùng để đối chiếu API: [Base UI Dialog](https://base-ui.com/react/components/dialog), [shadcn Sheet (Base UI)](https://ui.shadcn.com/docs/components/base/sheet), [shadcn Accordion (Base UI)](https://ui.shadcn.com/docs/components/base/accordion) và [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).

## E. Actual implementation

| File | V8.2 change |
|---|---|
| `packages/ui/src/components/sheet.tsx` | Primitive Sheet dùng Base UI Dialog. |
| `packages/ui/src/styles/globals.css` | Thêm source scan cho Sheet. |
| `apps/web/src/components/landing/Header.tsx` | Dùng shared Button làm menu trigger; lazy-load drawer; giữ close-on-desktop-resize và dùng nav constants dùng chung. |
| `apps/web/src/components/landing/MobileNavigationSheet.tsx` | Sheet content/title/description/close, links, theme control, CTA; `aria-modal="true"`; truyền `finalFocus`. |
| `apps/web/src/components/landing/navigation.ts` | Chia sẻ navigation, login URL và phone URL giữa Header và mobile drawer. |
| `apps/web/src/components/landing/HeroScene.tsx` | Load/retry/stage/pause controls dùng `buttonVariants`; stage detail chuyển sang `Card` + `Badge`. Giữ native button semantics. |
| `apps/web/src/styles/landing.css` | Dùng data states cho drawer/backdrop, z-index modal, reduced-motion và responsive side panel; bỏ state selectors `.is-open` cũ. |
| `apps/web/src/styles/trace-experience.css` | Reset mặc định Card/Badge tại scene detail để giữ visual transparent/brand hiện tại. |
| `apps/web/tests/verify.cjs` | Thêm Sheet modal/focus/backdrop/navigation/scroll/resize assertions; no-JS FAQ; kiểm tra Sheet chưa tải trên initial desktop và control variants. |
| `docs/deeptrace-v8-ui-component-matrix.md` | Cập nhật coverage V8.2. |
| `docs/deeptrace-v8.2-full-shadcn-migration-report.md` | Báo cáo này. |

Three.js, camera mapping, pointer picking, lifecycle, WebGL recovery, hardware gate, mobile fallback, reduced motion và lazy scene loading không bị đổi.

## F. Design system

Giữ tokens DEEP PRO của V8: primary `#005AAB`, navy `#0C263D`, light blue `#ADD8FF`, neutral `#EDEFF4` / `#D8E0E8` / `#8EA9C1`; Oswald/Montserrat và logo assets hiện tại vẫn nguyên. Light/dark theme state, local storage, system preference và initial prepaint không bị sửa.

Sheet sử dụng semantic colors; panel layout, overlay tint, border, shadow, spacing và CTA vẫn do CSS DeepTrace kiểm soát. Card detail reset default surface/ring/padding để không thêm lớp chrome vào panel 3D. Button variants chuẩn hóa focus/disabled/hover states mà không thay đổi URL hoặc semantics của links.

## G. Cleanup

- Thay phần modal behavior của mobile drawer bằng một shared Sheet; old drawer state selectors được đổi sang Base UI data states.
- Không xóa custom FAQ, `landing.css`, Three.js CSS hoặc product/industry composition.
- Không có component duplicate mới và không đổi dependency.
- Không xóa CSS diện rộng; chỉ thay rules điều khiển trạng thái drawer. Test CSS/layout sau migration thay vì dựa trên số lượng class.

## H. Quality assurance

| Check | Kết quả |
|---|---|
| `corepack pnpm typecheck` | PASS; Turbo resolved UI and web tasks successfully. |
| `corepack pnpm lint` | PASS; Turbo resolved UI and web tasks successfully. |
| `corepack pnpm --filter web build` | PASS; có cảnh báo chunk Three.js >500 KB, chunk 3D vốn được load riêng theo scene. |
| `corepack pnpm --filter web test:verify` | 26/26 PASS. |
| `corepack pnpm --filter web test:visual` | 70/70 PASS ở 10 viewport: 320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920 px; light/dark. |
| Lighthouse accessibility | 100 trong cả sáu mobile và sáu desktop reports sau. |

Functional coverage xác nhận: Sheet dialog name/modal semantics; focus vào drawer, focus trap và return; Escape; backdrop dismissal; anchor navigation đóng drawer; scroll lock bật/tắt; close-on-resize; theme toggle; FAQ nhiều mục cùng mở khi JavaScript tắt; responsive overflow/hero overlap; stage keyboard/picking; pause/resume; WebGL fallback/retry/context recovery; reduced motion; Save-Data; không có console/page errors trong normal flows.

Ảnh browser 390×844 light/dark được rà trực tiếp; panel không tràn ngang, chỉ còn một nút đóng, nội dung/CTA nằm trong panel. Hydration/no-JS behavior được kiểm tra bằng production prerender build và browser tests; không phát hiện warning/error trong normal verification.

## I. Performance

### Controlled run setup

- Lighthouse **13.5.0**, HeadlessChrome **156.0.0.0**; production preview `http://localhost:4174/`; script `apps/web/tests/run-lighthouse.cjs`, cùng profile/throttling/cache settings.
- Mỗi profile có 6 report hợp lệ trước (hai lần chạy × 3) và 6 sau. Một lần chạy baseline đầu tiên khi preview dừng bị loại khỏi tập dữ liệu; chỉ dùng hai tập sau khi production preview trả HTTP 200.
- Median và range dưới đây lấy trực tiếp từ JSON reports; thời gian là giây, trừ TBT (ms).

### Lighthouse results

| Profile / metric | V8 baseline median (range) | V8.2 median (range) |
|---|---:|---:|
| Mobile Performance | 33 (31–36) | 59.5 (31–62) |
| Mobile LCP | 5.328 (4.892–5.847) | 2.976 (2.665–5.666) |
| Mobile FCP | 5.328 (4.892–5.847) | 2.976 (2.665–5.666) |
| Mobile TBT | 4,567 (3,800–5,765) ms | 1,980 (1,531–4,836) ms |
| Mobile CLS | 0.000 (0–0) | 0.00036 (0–0.00038) |
| Desktop Performance | 76.5 (73–77) | 93.5 (89–99) |
| Desktop LCP | 0.691 (0.664–0.698) | 0.551 (0.547–0.604) |
| Desktop FCP | 0.582 (0.558–0.600) | 0.473 (0.469–0.485) |
| Desktop TBT | 530 (509–689) ms | 203 (104–276) ms |
| Desktop CLS | 0.000666 (constant) | 0.000667 (constant) |

### LCP diagnosis and confidence

Baseline mobile LCP element trong cả sáu report là `p.trace-intro__description`; FCP bằng LCP. Lighthouse breakdown cho thấy TTFB chỉ khoảng 25–32 ms, còn element render delay khoảng 4.864–5.817 s. Render-blocking insight không liệt kê blocking request; font-display insight không ghi nhận saving. Đây là text trong hero, không phải ảnh.

Tất cả 6/6 baseline mobile reports có cảnh báo “tested device appears to have a slower CPU than Lighthouse expects” và benchmark index median khoảng 676 (653.5–788). Sau V8.2 chỉ 1/6 report có cảnh báo; benchmark index median khoảng 1,510 (673.5–2,045). Desktop benchmark index cũng thay đổi từ median khoảng 691 (550.5–762) lên 1,730 (1,228–2,554). LCP element vẫn là hero description và render delay vẫn chiếm phần lớn (khoảng 2.646–5.639 s). Số đo sau tốt hơn ở median, nhưng CPU calibration/index đã đổi và range còn rộng. **Không thể quy mức chênh lệch cho source change; performance comparison INCONCLUSIVE.** Mobile LCP median cũng chưa đạt 2.5 s.

### Bundle and transfer delta

| Asset | V8 baseline | V8.2 | Delta / note |
|---|---:|---:|---|
| Initial JS transfer trên mobile | 100,278 B (entry + runtime) | 100,573 B (entry + JSX runtime) | +295 B theo Lighthouse Network Requests; gần như ngang nhau. |
| Main entry JS build size | 314,939 B / 98,796 B gzip | 307,288 B / 96,383 B gzip | −7,651 B / −2,413 B gzip. |
| CSS | 77,990 B / 14,754 B gzip | 82,357 B / 15,507 B gzip | +4,367 B / +753 B gzip. |
| Prerendered HTML (inline CSS) | 135,712 B / 24,736 B gzip | 141,792 B / 25,474 B gzip | +6,080 B / +738 B gzip. |
| Mobile Sheet chunk | — | 50,957 B / 17,168 B gzip | Chỉ tải sau khi mở menu; test xác nhận không có request lúc vào desktop. |
| Three vendor chunk | 710,111 B / 180,322 B gzip | 710,106 B / 180,320 B gzip | Gần như không đổi; vẫn tách riêng. |
| Traceability scene chunk | 194,838 B / 60,433 B gzip | 193,311 B / 59,976 B gzip | −1,527 B / −457 B gzip. |

Không loại bỏ 3D để tăng điểm. Mobile initial route không tải Sheet chunk hay Three.js scene; drawer chunk chỉ tải sau click. Build vẫn báo chunk Three vendor lớn hơn 500 KB, nhưng chunk này tách khỏi initial route.

## J. GitHub readiness

- Branch hiện tại: `landing-page`.
- `git diff --check` exit code 0; Git chỉ in cảnh báo line endings LF→CRLF trên files vốn đã modified.
- Không có staged diff. Không stage, commit, push hay deploy.
- Worktree đã có modifications/untracked artifacts trước V8.2 (V8 source, `.agents/`, Astro PoC, research/test scripts, logo extraction images, `skills-lock.json`, v.v.). Đã giữ nguyên; các file này không thể được xem như rác và cần chọn lọc khi người dùng muốn chuẩn bị commit.
- Không đổi package manifests/lockfile hoặc backend/API.
- Secret check: `trufflehog`, `gitleaks`, `detect-secrets` không cài trên máy. Manual pattern scan xét 211 text files; bỏ qua 39 binary và một file >2 MB; không có high-confidence key/credential match. `.env` bị ignore, không thấy `.env` tracked; `.npmrc` không có auth/password/token setting. Không tìm thấy `.github` hay `.husky` scan hooks trong repo.
- Do workspace còn nhiều unrelated/untracked files và chưa có automated secret hook, **GitHub readiness = WARNINGS**; chưa an toàn để stage toàn bộ workspace như một nhóm.

## K. Final decision

- **SHADCN MIGRATION: PASS** — các primitive phù hợp đã migrate/adapt; FAQ và scene-specific pieces giữ custom có lý do/bằng chứng trong matrix.
- **DESIGN SYSTEM: PASS** — shared components/tokens được giữ nhất quán, light/dark hoạt động.
- **FUNCTIONAL QA: PASS** — 26/26.
- **VISUAL QA: PASS** — 70/70; drawer được rà riêng ở mobile light/dark.
- **ACCESSIBILITY: PASS** — keyboard/modal/focus/roles, Lighthouse accessibility 100; chưa chạy kiểm thử screen reader trên thiết bị thật.
- **PERFORMANCE: INCONCLUSIVE** — 6+6 report hợp lệ nhưng CPU/benchmark distribution trước và sau không tương đương; LCP median sau vẫn >2.5 s.
- **GITHUB READINESS: WARNINGS** — worktree dirty/untracked từ trước; secret scanning tự động và pre-commit hook không có. Không có gì được stage/commit/push/deploy.

**Kết luận:** migration và regression QA đã hoàn tất. Performance chưa thể được gọi là đạt hoặc cải thiện dựa trên run hiện tại; cần re-run Lighthouse trên host ổn định/calibrated để có kết luận chắc chắn.
