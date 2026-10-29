# DeepTrace V7 — Source audit, cleanup & pre-push review

Ngày kiểm tra: 2026-10-29
Repository: deeppro-fe-platform (repository root)

## A. Tổng quan repository

Repository là pnpm/Turborepo monorepo gồm ba workspace app/package:

| Đường dẫn | Vai trò thực tế |
| --- | --- |
| apps/web | React 19 + TypeScript + Vite 8; landing page, prerender và trải nghiệm Three.js/React Three Fiber. |
| apps/poc-astro | Prototype Astro xuất static site, có bản sao landing page để nghiên cứu kiến trúc; giữ nguyên theo yêu cầu. |
| packages/ui | Thư viện component dùng chung kiểu shadcn/Base UI; không có build task riêng, có lint/typecheck. |

Root dùng pnpm 11.25.0, Turbo 2.11.7; yêu cầu Node.js >=20.19.0. Web production build chạy tsc -b, Vite và scripts/prerender.mjs. Prerender nhúng markup của App vào #root, inline stylesheet để phục vụ HTML có nội dung trước khi JavaScript hydrate. main.tsx chọn hydrateRoot cho HTML prerender và createRoot cho dev.

README trước đó vẫn là nội dung template shadcn. Đã thay bằng hướng dẫn cài đặt, chạy riêng landing page, chạy các workspace, build, preview và QA; có ghi chú lệnh Vite trực tiếp khi Turbo trên Windows không tìm được pnpm binary. Landing page không cần file .env theo source hiện tại.

Không tìm thấy AGENTS.md, GEMINI.md, .env* hay GitHub Actions workflow trong repository. packages/ui và apps/poc-astro được giữ nguyên, không di chuyển hay xóa workspace.

## B. Kiểm toán kiến trúc

### Luồng ứng dụng

- apps/web/index.html chứa metadata SEO/OG, theme prepaint script và link Google Fonts.
- src/main.tsx nạp hai stylesheet, sau đó mount App hoặc hydrate HTML prerender.
- App.tsx lắp các section landing page; component và CSS đang nằm trong src/components/landing và src/styles.
- Hero Three.js được import động, có poster/fallback, hardware/reduced-motion/save-data gates, pause khi khuất, context recovery và cơ chế retry.
- Scene ở section thương hiệu trước đây import ngay khi React mount. Đã chuyển sang import khi section tiến gần viewport, bắt lỗi import, tôn trọng reduced motion/thiết bị hạn chế, dừng RAF khi section hoặc tab khuất, xử lý context lost/restored và dọn listener/RAF khi unmount.
- Đã giữ lại cả hai scene 3D, fallback của Hero, các stage truy xuất, hotspot picking, điều khiển camera và cơ chế prerender/hydration.

### Kết quả cấu trúc và refactor

- TypeScript dependency walk trên 47 file .ts/.tsx tìm thấy 0 runtime import cycle và 0 file trong apps/web/src bị bỏ ngoài luồng từ main.tsx. Có một type-only edge giữa HeroScene.tsx và TraceabilityScene.tsx; TypeScript xóa cạnh này khỏi JavaScript runtime nên không tạo runtime cycle.
- TraceabilityScene.tsx lớn và quản lý nhiều phần của một scene tương tác. Không chia nhỏ hàng loạt vì chưa có ranh giới thay đổi độc lập đủ rõ.
- Không có component, hook hoặc selector CSS nào bị xóa theo heuristic. TypeScript noUnusedLocals và ESLint hiện pass; các class CSS có thể được bật bằng state/data attribute vẫn được giữ.
- components.json trỏ tới @workspace/ui/lib/utils, nhưng file utility chưa tồn tại. Đã thêm packages/ui/src/lib/utils.ts để export cn đúng alias hiện có.
- TrustStructureScene.tsx trước đó tạo EdgesGeometry inline cho hai vòng và không dispose chúng. Đã giữ tham chiếu riêng và dispose cùng các geometry còn lại.
- CSS có @import Google Fonts trùng với stylesheet link trong HTML; đã bỏ import trùng. Đã bỏ preload Oswald vì font-family này không được dùng trong giao diện hiện tại. Các font files, @font-face, Montserrat preload/fallback, logo và variants chính thức vẫn được giữ.

## C. Dead-code / dependency inventory

| Phát hiện | Bằng chứng | Hành động |
| --- | --- | --- |
| cn trực tiếp trong apps/web | Không có import từ source web; packages/ui tự khai báo cn vì component của package sử dụng nó. | Bỏ dependency trực tiếp khỏi web; giữ dependency trong packages/ui. |
| date-fns trực tiếp trong packages/ui | Không có import trong source UI; react-day-picker vẫn khai báo date-fns như dependency của chính nó. | Bỏ dependency trực tiếp dư thừa. |
| zod trong packages/ui | Không có import/runtime reference trong source hiện tại. | Bỏ dependency. Nếu sau này thêm form/schema component, khai báo lại tại package dùng nó. |
| shadcn trong packages/ui | Chỉ cần cho thao tác phát triển/sinh component, không được import runtime. | Chuyển từ dependencies sang devDependencies. |
| @workspace/ui trong apps/web | Không được import từ runtime hiện tại, nhưng components.json và TypeScript aliases kết nối app với package để phát triển component dùng chung. | Giữ lại; không xóa package packages/ui. |
| Một số ảnh/logo trong apps/web/public/images | Không có text reference trong app source/index/scripts/tests tới barcode-scan.jpg, deeptrace-logo-light.jpg, greenhouse-farming.jpg, pharmaceutical-factory.jpg, smart-warehouse.jpg, trace-grid.svg; một số logo SVG/JPG chỉ xuất hiện trong tài liệu. | Phân loại PROBABLY UNUSED / BRAND / RESEARCH và giữ lại. Không xóa dựa trên phép tìm chuỗi đơn lẻ. |
| Component, hook, 3D scene | Được import qua luồng tĩnh/động, hoặc là source của thư viện UI. | Giữ lại. Không xóa file source. |

Không cài thêm analyzer dependency. Knip/gitleaks/trufflehog không có sẵn trong môi trường; việc rà soát dùng TypeScript/ESLint, dependency graph pnpm, import walk và reference search hiện có.

## D. Thay đổi và dữ liệu được giữ

### Đã sửa/thêm

| File/khu vực | Thay đổi |
| --- | --- |
| .gitignore | Bổ sung ignore có mục tiêu cho Astro cache, ảnh inspect, Python bytecode, cache/report test và bản sao assets/PDF/QA trong tmp; cho phép .env.example; không ignore .agents/ hay source app. |
| README.md | Thay nội dung template bằng hướng dẫn developer cho repo hiện tại. |
| apps/web/src/components/landing/BrandStatementSection.tsx | Lazy-load scene 3D khi gần section; bắt lỗi import và giữ placeholder. |
| apps/web/src/components/landing/three/TrustStructureScene.tsx | Tôn trọng reduced motion, save-data/hardware gates, visibility/tab visibility; pause/resume RAF; xử lý WebGL context/resize; cleanup event listeners và geometry. |
| apps/web/src/styles/landing.css, apps/web/index.html | Bỏ Google Fonts import trùng và preload Oswald không được dùng. |
| apps/web/package.json, packages/ui/package.json, pnpm-lock.yaml | Loại bỏ dependency dư; chuyển CLI dependency sang dev dependency; đồng bộ lockfile. |
| apps/web/tests/verify.cjs | Chờ frame count ổn định trước assertion reduced-motion; thêm test lazy scene, static motion và pause khi offscreen. |
| apps/web/tests/run-lighthouse.cjs | Hỗ trợ TEST_URL/TEST_OUTPUT_DIR, dùng Corepack để gọi Lighthouse và tránh ghi đè artifact mặc định. |
| packages/ui/src/lib/utils.ts | Thêm export cn từ cn theo alias shadcn đã cấu hình. |
| docs/deeptrace-v7-source-audit-cleanup-report.md | Báo cáo này. |

Không có file nào bị xóa hoặc di chuyển. Không sửa backend/API. Các thay đổi local trước khi audit được giữ nguyên; không stage, commit, push hoặc deploy.

### Artifacts

Đã thêm ignore cho apps/poc-astro/.astro/, apps/web/.taste-skill/inspect/, __pycache__, tmp/pdfs, tmp/qa-reports, tmp/downloaded-assets và test caches. Các file hiện có vẫn nằm trên ổ đĩa; không chạy lệnh xóa. Ảnh render PDF trong tmp/pdfs/ được giữ riêng khỏi staging. tmp/ còn các script/ảnh nghiên cứu khác nên không ignore toàn bộ thư mục.

packages/ui, Astro PoC, assets thương hiệu, các report cũ và .agents/skills đều được giữ. .agents/ không bị ignore; chỉ bytecode cache bên trong bị ignore. Một số report lịch sử còn đường dẫn tuyệt đối E:/Intern/.../file:///E:/...; rà soát hoặc loại khỏi staging trước khi công khai các report đó.

## E. Security và Git hygiene

- Không tìm thấy file .env/.env.* trong repo.
- Pattern scan cho private key, token phổ biến và assignment dạng credential không trả về match trong source/config đã quét hoặc HEAD; không in nội dung secret ra log.
- Không có gitleaks/trufflehog/detect-secrets executable. Skill secrets-scan được áp dụng một phần bằng pattern scan thủ công; đây không phải chứng nhận secret scanning toàn diện. Kiểm tra thêm bằng scanner đã được tổ chức phê duyệt trước khi push public.
- Không tìm thấy đường dẫn máy cá nhân trong apps/web, apps/poc-astro hoặc packages (source, test, build/config). Đường dẫn cục bộ chỉ còn trong một số tài liệu/report lịch sử.
- .gitignore không bỏ qua apps/web/src, packages/ui/src, apps/poc-astro/src hoặc .agents/ nói chung. Các file cache/artifact mục tiêu được ignore nhưng vẫn được giữ trên đĩa.
- Không tìm thấy GitHub Actions workflow; hiện chưa có CI chạy các quality gate tự động.

## F. Regression và runtime results

Các lệnh thực tế đã chạy:

| Kiểm tra | Kết quả |
| --- | --- |
| corepack pnpm install --frozen-lockfile | PASS; lockfile đồng bộ, pnpm 11.25.0. |
| corepack pnpm typecheck | PASS; 2 task TypeScript (web, @workspace/ui). |
| corepack pnpm lint | PASS; 2 task ESLint (web, @workspace/ui). |
| corepack pnpm build | PASS; build web + Astro PoC. Vite cảnh báo vendor chunk Three.js >500 KB sau minification ở cả hai app. |
| corepack pnpm --filter web test:verify | PASS 25/25 functional checks. |
| corepack pnpm --filter web test:visual | PASS 70/70 viewport/section combinations. |
| git diff --check | PASS về whitespace; Git chỉ phát cảnh báo line-ending LF→CRLF cho working copy hiện tại. |

Functional QA xác nhận desktop WebGL2, pointer/camera, hotspot và stage keyboard, pause/offscreen, context loss/restore/retry, WebGL unsupported, save-data, reduced motion, mobile menu/touch/DPR, liên kết/FAQ/theme, prerender không JavaScript, không có lỗi/warning console trong luồng thường. Visual QA rà overflow, chồng lấn ảnh/chữ, clipping, logo ratio, theme sáng/tối ở 320, 375, 390, 430, 768, 939, 1024, 1440, 1600 và 1920px. QA artifacts được ghi ra thư mục %TEMP%, không ghi đè tmp/v4-qa của dự án.

### Lighthouse mobile/desktop

Chạy cùng script test:perf, Lighthouse 13.5.0, Chrome 156, static preview localhost:4174, 3 lần cho mobile và 3 lần cho desktop. Bảng ghi median và min–max từ đúng 3 lượt:

| Chế độ / chỉ số | Baseline | Sau thay đổi |
| --- | ---: | ---: |
| Mobile Performance | 56 (54–59) | 60 (56–65) |
| Mobile LCP | 3.20s (2.76–3.33) | 2.72s (2.17–3.41) |
| Mobile FCP | 3.20s (2.76–3.33) | 2.72s (2.17–3.41) |
| Mobile TBT | 3.43s (3.09–4.47) | 2.99s (1.62–3.12) |
| Mobile CLS | 0.000090 (0.000078–0.000090) | 0.000078 (0–0.000078) |
| Desktop Performance | 74 (73–79) | 94 (93–94) |
| Desktop LCP | 0.804s (0.796–0.829) | 0.841s (0.826–0.891) |
| Desktop FCP | 0.776s (0.531–0.784) | 0.821s (0.535–0.891) |
| Desktop TBT | 0.641s (0.448–0.684) | 0.182s (0.162–0.191) |
| Desktop CLS | 0.000568 (0.000568–0.005852) | 0.000608 (0.000608–0.005782) |

Mobile LCP median tốt hơn khoảng 0.48 giây và score tăng 4 điểm; các dải min–max vẫn rộng và chồng lấn. Benchmark index median đổi từ 1280 xuống 926 ở mobile và từ 1019 lên 1536.5 ở desktop, nên không quy toàn bộ score/TBT delta cho source changes. Desktop LCP median chậm hơn khoảng 0.04 giây. Mobile LCP còn 2.72 giây và TBT khoảng 2.99 giây; đây vẫn là điểm cần tối ưu.

LCP element là p.trace-intro__description. Lighthouse ghi timeToFirstByte khoảng 15 ms nhưng elementRenderDelay khoảng 3.31 giây ở baseline và 2.70 giây sau thay đổi. Render-blocking insight vẫn nêu stylesheet Google Fonts (Plus Jakarta Sans) với mức tiết kiệm ước tính khoảng 1.4 giây. CSS @import trùng đã bỏ, nhưng stylesheet link trong HTML còn render-blocking; vì thế không xem thay đổi đó là lời giải đầy đủ cho Mobile LCP. Các số 78/95 từ báo cáo trước không dùng để tính delta vì không có raw run và không bảo đảm cùng Chrome/Lighthouse/điều kiện.

### Bundle

Kích thước asset từ cùng script, format raw / gzip (bytes):

| Asset | Baseline | Sau thay đổi |
| --- | ---: | ---: |
| Main JS | 275,298 / 83,396 | 275,645 / 83,485 |
| CSS build artifact | 59,986 / 11,591 | 59,879 / 11,519 |
| Prerendered HTML | 103,499 / 20,368 | 103,122 / 20,343 |
| Three.js vendor | 710,111 / 180,322 | 710,111 / 180,322 |
| Hero TraceabilityScene | 194,838 / 60,434 | 194,838 / 60,433 |
| Brand TrustStructureScene | 4,249 / 2,034 | 5,836 / 2,566 |

Prerender inline CSS vào HTML nên không tính CSS artifact lần hai vào initial transfer. Main JS + runtime + prerendered HTML xấp xỉ 104.2 KB gzip ở baseline và 104.3 KB sau thay đổi. Brand scene tăng khoảng 1.6 KB raw do lifecycle handling, nhưng không được request ở đầu trang nữa; test xác nhận bundle chỉ được tải gần section. Three.js vendor vẫn lớn nhưng tách chunk và không thuộc HTML/CSS initial payload. Build size warning vẫn tồn tại và được giữ trong danh sách cải tiến.

## G. Git readiness và staging plan

Baseline Git trước audit: nhánh main, HEAD 5eb4f03 init, 55 tracked files, 7 tracked files modified, 0 staged và 300 untracked files. Một phần lớn apps/web, assets, docs, .agents và Astro PoC chưa được Git theo dõi; xem chúng là dữ liệu/source quan trọng. Tại thời điểm đóng audit có 258 untracked files và 9 tracked files modified; không file nào bị xóa.

Theo yêu cầu tiếp theo của người dùng, đã tạo branch `landing-page` từ `origin/main` và chọn phạm vi commit gồm 67 file liên quan trực tiếp tới landing page: source, assets, test scripts đang dùng, workspace/UI config và báo cáo này. `.agents/skills`, Astro PoC, `tmp/`, ảnh trích xuất và các báo cáo cũ không nằm trong phạm vi đó để tránh trộn prototype, tài liệu nội bộ và artifact nghiên cứu vào nhánh giao diện.

Không dùng `git add .`; file được stage theo danh sách đường dẫn rõ ràng. Báo cáo này ban đầu được viết trước khi có yêu cầu commit/push; người dùng sau đó đã ủy quyền commit và push lên branch `landing-page`. Trạng thái commit/push cuối cùng được xác nhận bằng Git sau thao tác.

## H. Skills và giới hạn kiểm tra

Đã đọc/áp dụng: frontend-patterns (React effects/lifecycle), vercel-react-best-practices (dynamic loading/perf), systematic-debugging (lần theo lỗi reduced-motion), webapp-testing (browser/functional/visual QA), benchmark-optimization-loop (baseline, nhiều lượt, cùng điều kiện, báo median/range), verification-before-completion, và pdf:pdf (đối chiếu logo/font với brand guideline). secrets-scan được đọc nhưng hướng dẫn playbook tham chiếu không có trong bản cài và không có gitleaks/trufflehog; chỉ pattern scan thủ công được thực hiện.

## I. Quyết định

### READY WITH WARNINGS

Quality gates hiện có pass và không có secret pattern được phát hiện trong phạm vi đã quét. Cần giữ các cảnh báo sau trước khi push public:

- Mobile LCP median vẫn 2.72 giây, TBT cao và Google Fonts còn render-blocking.
- Desktop/mobile Lighthouse dải dao động rộng; baseline/final benchmark index khác nhau nên score delta không hoàn toàn quy về source changes.
- Tại snapshot audit có 258 untracked files và 9 tracked modified files; follow-up đã chọn 67 file landing page. Các file còn lại vẫn được giữ cục bộ, không bị xóa.
- Secret scan chưa được thay bằng scanner toàn diện; một số tài liệu lịch sử có absolute local paths; repository chưa có CI workflow.
- Three.js vendor chunk vẫn lớn hơn 500 KB raw; hiện được tải theo nhánh 3D động.
- Nếu WebGL renderer của scene trang thương hiệu không khởi tạo được, component hiện giữ vùng minh họa trống; nội dung chữ/cards vẫn hiển thị. Chưa thêm static visual fallback cho riêng scene trang trí này.
