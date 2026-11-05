# DeepTrace CI/CD — Báo cáo xác minh

Ngày: 2026-11-05. Baseline source bắt đầu: `b0d5bd6` trên `landing-page`; working tree sạch trước khi thêm CI/CD. Không sửa UI, không commit/push hoặc kích hoạt deployment trong lượt này.

## Kết quả thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| Frozen lockfile install | PASS, cả ba workspace projects; không đổi lockfile |
| Root `corepack pnpm typecheck` | PASS, web và shared UI |
| Root `corepack pnpm lint` | PASS, web và shared UI |
| Web production build + prerender | PASS |
| TypeScript + Vite build + prerender bằng Node 22.16.0 | PASS, chạy trực tiếp các CLI bằng runtime 22.16.0 |
| Functional qua CI wrapper | PASS, 16/16; runtime errors 0; 22 ảnh tải được |
| Responsive qua CI wrapper | PASS, 90/90; 10 widths từ 320 đến 1920 |
| Lighthouse | PASS thực thi 6 audits, không phải score gate |
| Node syntax checks cho CI scripts | PASS |
| Actionlint 1.7.12 | PASS, gồm workflow và local action; shellcheck không có nên tắt riêng tích hợp shellcheck |
| SHA actions | Đối chiếu tag v4 bằng git ls-remote upstream |
| Invalid suite failure propagation | PASS, suite không hợp lệ trả nonzero |
| Git diff whitespace check | PASS |

Actionlint tải từ release chính thức, kiểm tra archive SHA256 bằng checksum release trước khi chạy. Metadata npm của pnpm 11.25.0 yêu cầu Node >=22.13; đã sửa root engines tương ứng. Bộ quality/QA/perf local đầu tiên dùng Node 24.14.0, pnpm 11.25.0, Windows; môi trường CI khai báo Ubuntu 24.04 / Node 22.16.0.

## Lighthouse mới (3 lượt mỗi profile)

Lighthouse 13.5.0, Chromium 156, Vite production preview 127.0.0.1:4174. Mobile dùng preset perf (devtools throttling, RTT 150ms, CPU x4); desktop preset desktop. Không so trực tiếp với V10 khác môi trường. Mỗi ô là **trung vị [min–max]**.

| Metric | Mobile | Desktop |
| --- | --- | --- |
| Performance | 77 [71–78] | 99 [99–99] |
| Accessibility | 100 [100–100] | 100 [100–100] |
| Best Practices | 100 [100–100] | 100 [100–100] |
| SEO | 100 [100–100] | 100 [100–100] |
| LCP | 3.105s [2.931–3.383] | 0.825s [0.804–0.829] |
| FCP | 3.022s [2.864–3.267] | 0.473s [0.472–0.474] |
| TBT | 513ms [311–708] | 18.5ms [0–24.5] |
| CLS | 0 [0–0] | 0 [0–0] |

Bundle snapshot (raw/gzip theo node zlib): entry JS 345,055 / 110,031 bytes; lazy scanner JS 483,033 / 125,186; stylesheet 67,963 / 13,187; prerender HTML chứa CSS inline 147,177 / 24,977. Không cộng stylesheet với HTML để suy ra initial transfer vì CSS đã inline. File JSON tổng hợp lưu tại `tmp/ci/perf/v10-performance-summary.json`; raw audits/logs/screenshots ở `tmp/ci/`, được Git ignore. Hậu tố v10 là tên output script cũ, dữ liệu là lần chạy mới này.

Có cảnh báo Windows EPERM khi Lighthouse dọn thư mục Chrome tạm; audits vẫn kết thúc exit 0 và đủ 6 JSON. Không xóa thư mục tạm bằng cách vượt giới hạn môi trường.

## Giới hạn chưa xác minh

**NOT VERIFIED IN GITHUB ACTIONS.** Workflow chưa push; chưa có run GitHub để xác nhận Ubuntu dependencies, upload/download artifacts, check names hay cancellation thực tế. Điều kiện chặn deploy được review trong YAML, chưa thử một run CI fail trên GitHub. Không có quyền admin để cài ruleset (GitHub API trả admin=false).

**NOT VERIFIED ON VERCEL.** Connector tìm project theo tên DeepTrace trả rỗng trong tài khoản hiện tại; không tự tạo project. Chưa cấp environment/IDs/token, chưa chạy CLI deploy hoặc smoke lên Preview thật. Không có URL deployment để công bố.

Source hiện khóa Light theme; functional xác nhận cả OS light/dark vẫn giữ Light. Visual suite chụp khi đặt hai giá trị theme để đối chiếu, không chứng minh có dark mode sản phẩm.

## Thay đổi trong phạm vi

Thêm workflow/composite setup, hai scripts CI, ba tài liệu CI/CD; README trỏ tới tài liệu; root engines khớp pnpm; ignore `.vercel/`. Không thay test assertions, dependency versions, lockfile hoặc source UI. Skill áp dụng: `github-actions-hardening`.
