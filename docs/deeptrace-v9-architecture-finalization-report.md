# DeepTrace V9 — Báo cáo chốt kiến trúc và kiểm tra candidate GitHub

**Ngày kiểm tra:** 2026-11-03  
**Repository:** chungdp02/deeppro-fe-platform  
**Branch:** landing-page  
**HEAD:** 1b6814a91373c77265228b35bc6809b77080ee5a  
**Phạm vi:** cấu trúc monorepo, component dùng chung theo shadcn/ui, cleanup, audit dependency/security, kiểm tra candidate cô lập.  
**Git:** không stage vào index người dùng, không commit, không push, không deploy.

## Kết luận

Candidate phù hợp để review trên development branch, với các cảnh báo dependency dev và hiệu năng đã ghi ở dưới. Cấu trúc hiện tại có ranh giới rõ giữa ứng dụng landing page, component giao diện tái sử dụng và prototype Astro. Các primitive giao diện dùng chung đã được chuẩn hóa theo hướng shadcn/ui; các section DeepTrace và cảnh Three.js vẫn nằm trong ứng dụng vì chúng mang nghiệp vụ/trình bày riêng của landing page.

Các kiểm tra cài đặt, typecheck, lint, build, functional QA và responsive QA đều đạt trên bản candidate cô lập. Chưa đủ cơ sở kết luận production performance đã đạt KPI: số đo Lighthouse mới nhất trong báo cáo V8.3 là median mobile Performance 42 và LCP 4.281 giây; V9 không chạy lại Lighthouse.

## Cấu trúc và ranh giới hiện tại

- apps/web là ứng dụng production hiện tại: React 19, TypeScript, Vite và prerender. main.tsx nạp token CSS dùng chung, sau đó nạp CSS landing/Three.js; nó dùng hydrateRoot cho HTML prerendered và createRoot cho đường chạy Vite thông thường.
- apps/web/src/App.tsx ghép ThemeProvider, Header, Hero, các section landing, FAQ, Contact/Footer. Nội dung được chia trong components/landing; mã scene nằm ở components/landing/three; hooks chứa hook dùng trong app; styles chứa stylesheet theo phạm vi.
- packages/ui là workspace component dùng chung @workspace/ui. Nó chứa lib/utils.ts, token CSS, cấu hình components.json và bốn primitive đang được dùng: Button, Badge, Card, Sheet.
- apps/poc-astro là prototype Astro độc lập gồm 43 file source/config/asset. Nó có một static route và build riêng. README hiện ghi rõ prototype này chưa nối vào quy trình triển khai production.
- docs lưu brand guideline và các báo cáo kiến trúc/migration/kiểm tra trước đó.

Luồng phụ thuộc: root pnpm/Turborepo điều phối ba workspace; web tiêu thụ @workspace/ui và tải cảnh Three.js dạng lazy chunk; Astro là prototype độc lập và không import @workspace/ui.

## Đánh giá shadcn/ui

packages/ui/components.json khai báo style base-nova, CSS variables và alias @workspace/ui/components, @workspace/ui/lib và @workspace/ui. Button được xây trên primitive của @base-ui/react, dùng class-variance-authority cho variant/size và cn để hợp nhất class. Badge, Card và Sheet theo cùng nguyên tắc: source component được quản lý trong workspace, token nằm trong globals.css, app tiêu thụ qua package export.

Đây là nền tảng shadcn/ui dùng chung đã triển khai, không phải việc chuyển mọi JSX của landing page thành primitive UI. Hero, các section, navigation theo nội dung, FAQ native details và Three.js scene là composition theo sản phẩm. Ép chúng vào packages/ui sẽ làm package dùng chung phụ thuộc vào nội dung DeepTrace. Các CTA đã dùng buttonVariants để dùng chung variant mà vẫn giữ class/style đặc thù.

Ma trận hiện tại: Button cho CTA và điều khiển; Badge/Card cho thông tin và feature card; Sheet cho mobile navigation; FAQ vẫn native details/summary để giữ hoạt động cơ bản khi JavaScript tắt. Cách phân chia này đúng hướng kiến trúc thực tế: primitive chung ở package, composition theo trang ở apps/web.

## Quyết định kiến trúc và cleanup

1. Giữ apps/poc-astro trong candidate. Đây là prototype có workspace entry, lockfile importer, asset và build độc lập; Astro build tạo một route tĩnh thành công. Chưa có workflow triển khai được phát hiện để coi đây là ứng dụng production. Chi phí giữ lại là code/assets có thể trùng với React; nếu không tiếp tục thử nghiệm, nên có quyết định sở hữu hoặc gỡ prototype trong thay đổi riêng.
2. Giữ TraceabilityScene.tsx nguyên khối ở thời điểm này. Dù file dài, các phần setup scene, material/geometry, orbit, hotspot và lifecycle Three.js liên kết chặt. Tách file chỉ theo số dòng sẽ tăng bề mặt diff mà chưa cải thiện ranh giới trách nhiệm.
3. Xóa khỏi candidate 18 component scaffold không có import/caller nội bộ cùng file .gitkeep. Các component bị bỏ là Accordion, AlertDialog, Alert, Attachment, Avatar, Breadcrumb, ButtonGroup, Calendar, Chart, Checkbox, Combobox, Command, Dialog, InputGroup, Input, Separator và Textarea. Còn lại Button, Badge, Card, Sheet.
4. Gỡ các dependency chỉ phục vụ scaffold đã bỏ: cmdk, lucide-react, react-day-picker, recharts và tw-animate-css; đồng thời bỏ package export hooks/* không còn module đích. Không tìm thấy import nội bộ nào cho các component/export bị bỏ; typecheck, lint và build candidate đều qua. Rủi ro còn lại là consumer bên ngoài repo dùng private workspace package theo wildcard export. Có thể khôi phục các file từ HEAD nếu sau này xác nhận consumer đó tồn tại.
5. Giữ nguyên .agents, bốn ảnh PNG trong docs/LOGO, brand guideline và toàn bộ tmp/ (đặc biệt tmp/pdfs/); đây là skill bundle, tài liệu/ảnh đính kèm và kết quả QA cục bộ. Sau lần audit, dọn 12 script research/benchmark không có caller hoặc package script tham chiếu trong apps/web/tests; giữ lại verify.cjs và visual.cjs. Không sửa template, brand asset hay source/config trong lượt cleanup này.

## Sửa lỗi và hardening đã kiểm chứng

- Đưa PRODUCT_LOGIN_URL và PHONE_LINK vào landing/navigation.ts; Header, Hero, Contact/Footer và MobileNavigationSheet dùng chung giá trị thay vì lặp URL/điện thoại.
- ThemeProvider dùng một hàm setTheme chung cho state và lưu trữ. Phím tắt không gọi localStorage bên trong state updater; cập nhật storage được bọc để SecurityError không làm hỏng đổi theme. Thêm regression case chặn localStorage và kiểm tra hai lần toggle light → dark → light.
- Mobile sheet giữ navigation/login/telephone CTA là anchor HTML thật và đóng qua onClick; chỉ nút đóng dùng primitive SheetClose/Button. Điều này bảo toàn role/link semantics, keyboard behavior và kiểm tra accessibility của browser.
- pnpm-lock.yaml được đồng bộ lại với workspace manifests. Thêm hai override patch tương thích cho baseline-browser-mapping và browserslist nhằm loại advisory phiên bản cũ trong cây dev dependency.

## Dependency và bảo mật

corepack pnpm audit --prod không tìm thấy advisory production. Audit toàn cây còn ba advisory trong dependency dev được kéo qua bộ công cụ shadcn/registry:

| Mức độ | Gói | Phiên bản trong lock | Bản được advisory đánh dấu đã vá | Quyết định |
| --- | --- | --- | --- | --- |
| High | zod 3.25.76 | 3.x | từ 4.6.6 | Không ép major upgrade vì rủi ro tương thích của CLI/tooling. |
| Moderate | minimatch 10.2.6 | 10.x | từ 11.0.1 | Không ép major upgrade trong hệ sinh thái ESLint/dev tooling. |
| Low | deepmerge 4.3.1 | 4.x | Chưa có bản vá trong advisory được audit báo | Theo dõi dependency upstream. |

Gitleaks 8.30.1 quét candidate và hai commit Git hiện có: 0 finding ở cả hai lượt. Audit metadata local kiểm tra 26 ảnh, 69 giá trị metadata ảnh, một PDF 12 trang và 7 giá trị metadata PDF; không thấy đường dẫn máy/email trong metadata hoặc text trích từ PDF. Đây là kiểm tra định dạng và mẫu dữ liệu cụ thể, không phải khẳng định tuyệt đối rằng mọi asset không chứa thông tin cá nhân.

Tài liệu V7 có chuỗi đường dẫn máy cục bộ đã bị xóa khỏi worktree/candidate. Blob cũ vẫn còn trong Git history hiện tại; Gitleaks không phân loại nó là secret. Không thực hiện rewrite/force-push history. Nếu yêu cầu riêng tư bắt buộc xóa dấu vết lịch sử, cần một quyết định xử lý lịch sử repository riêng.

## Bundle và hiệu năng

Build React production chuyển đổi 220 module. Kích thước minified/raw và gzip:

| Artifact | Raw | Gzip |
| --- | ---: | ---: |
| Main JS | 307.73 KB | 97.55 KB |
| CSS | 82.32 KB | 15.52 KB |
| Three.js vendor | 709.94 KB | 181.80 KB |
| TraceabilityScene lazy chunk | 193.26 KB | 60.58 KB |
| MobileNavigationSheet lazy chunk | 50.79 KB | 17.31 KB |

Vite vẫn cảnh báo chunk Three.js vendor vượt 500 KB raw; scene và mobile sheet được tách lazy khỏi entry. KPI Lighthouse production chưa được xác nhận trong V9. Theo V8.3, median mobile gần nhất là Performance 42 và LCP 4.281 giây, chưa đạt mục tiêu Performance ≥90/LCP ≤2.5 giây; các lần trước có cảnh báo calibration CPU chậm. Cần một Lighthouse run ổn định trên host mobile đã hiệu chuẩn trước khi tuyên bố production performance đạt.

## Kiểm tra trên candidate cô lập

Candidate được dựng từ HEAD bằng Git index tạm và allowlist; source được trích ra thư mục tạm sạch. Workspace Git index thông thường vẫn không có staged path.

Hai tài liệu V9 được thêm sau lượt browser QA; SHA-256 đối chiếu xác nhận 96 path còn lại giống hệt snapshot đã chạy functional/responsive QA. Frozen install, root build, typecheck và lint được chạy lại trên archive cuối có đủ 98 path. Vì hai file thêm vào chỉ là Markdown, runtime tree được kiểm tra không thay đổi.

Lượt dọn cấu trúc tiếp theo chỉ xóa 12 script research không nằm trong manifest; source, template, brand asset và cấu hình build không đổi. Hai báo cáo được cập nhật để phản ánh chính xác phần dọn dẹp này; manifest vẫn là 98 path.

| Kiểm tra | Kết quả |
| --- | --- |
| corepack pnpm install --frozen-lockfile | PASS; pnpm 11.25.0, 641 package, lockfile không đổi |
| corepack pnpm typecheck | PASS; 2 task (@workspace/ui và web) |
| corepack pnpm lint | PASS; 2 task (@workspace/ui và web) |
| corepack pnpm --filter web build | PASS; 220 module |
| corepack pnpm --filter poc-astro build | PASS; 1 static route |
| Production preview | PASS; HTTP 200 |
| test:verify | PASS; 30/30, không có runtime error hoặc warning trong luồng bình thường |
| test:visual | PASS; 70/70 tổ hợp viewport/section |
| git diff --check | PASS; chỉ có cảnh báo chuẩn hóa LF/CRLF trên Windows |

Functional QA bao gồm WebGL/Three.js, camera/pointer/hotspot, pause/offscreen, context loss và retry, reduced motion, Save-Data, no-JavaScript prerender, mobile sheet lazy-load/focus/retry/resize, blocked localStorage, CTA/FAQ và console. Bộ kiểm tra responsive dùng 320, 375, 390, 430, 768, 939, 1024, 1440, 1600 và 1920 px; không thấy horizontal overflow, hero overlap hoặc section clipping trong 70 tổ hợp đã chạy.

## Trạng thái candidate và việc còn lại

Manifest V9 liệt kê 98 path thay đổi/add/delete trên nền HEAD; candidate có prototype Astro và các báo cáo V8 được duyệt, không gồm 12 research script đã dọn, ảnh PNG được giữ nguyên hoặc thư mục .agents. Đây là danh sách đề xuất chính xác, chưa được stage vào index thật.

Việc còn lại trước khi coi production sẵn sàng: chạy Lighthouse với calibration hợp lệ, quyết định nâng major các dependency dev có bản vá, và xác nhận có consumer ngoài repository nào phụ thuộc các scaffold UI đã bỏ hay không. Không có thay đổi backend/API, commit, push hoặc deploy trong lần này.
