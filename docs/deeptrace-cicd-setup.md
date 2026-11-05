# Thiết lập DeepTrace CI/CD

## Kích hoạt CI

Review và đưa workflow/composite action/scripts vào nhánh `landing-page`. Lượt triển khai này không tự commit hoặc push. Workflow dispatch chỉ xuất hiện trong UI khi workflow đã có trên default branch theo cơ chế GitHub; trước đó có thể dùng push/PR trigger. Không đổi default branch chỉ để chạy thử.

CI dùng Node 22.16.0, pnpm 11.25.0. Local cần Node >=22.13.0. Chạy từ root:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm --filter web build
$env:QA_SUITE='verify'; node scripts/ci/run-qa.mjs
$env:QA_SUITE='visual'; node scripts/ci/run-qa.mjs
$env:QA_SUITE='perf'; node scripts/ci/run-qa.mjs
```

Cần cài Chromium trước: `corepack pnpm --filter web exec playwright install chromium`. Ubuntu dùng thêm `--with-deps`. Cổng 4174 phải trống. Logs/artifacts nằm tại `tmp/ci/<suite>`.

## Vercel Preview (mặc định tắt)

Không tìm thấy project có tên DeepTrace trong phạm vi connector tài khoản được truy cập ngày khảo sát. Không tự tạo project. Chủ tài khoản chọn một project có sẵn hoặc tự tạo theo quy trình của nhóm.

Project Vercel cần dùng repository root làm Root Directory, install command `corepack pnpm install --frozen-lockfile`, build command `corepack pnpm --filter web build`, Output Directory `apps/web/dist`, Node 22.x. Kiểm tra Preview env trong project. Chặn/tắt auto deployments của Vercel Git Integration cho repo này trước khi bật Actions CD để tránh deploy trùng hoặc production ngoài ý muốn.

Tạo GitHub Environment `preview`, giới hạn deployment branch chính xác `landing-page`, thêm required reviewer nếu tính năng/gói hỗ trợ. Không bỏ protection để xử lý một run bị chặn.

| Thiết lập | Vị trí | Giá trị |
| --- | --- | --- |
| `ENABLE_DEEPTRACE_VERCEL_PREVIEW` | **Repository variable** | `false` ban đầu, chỉ chuyển `true` sau review |
| `VERCEL_TOKEN` | Environment `preview` secret | Token có quyền đúng team/project; không nhập vào source hoặc command args |
| `VERCEL_ORG_ID` | Environment `preview` variable | ID team sở hữu project |
| `VERCEL_PROJECT_ID` | Environment `preview` variable | ID project đã tồn tại |
| `VERCEL_CLI_VERSION` | Environment `preview` variable | Exact semver đã review, ví dụ `65.11.0`; không dùng latest/range |

Enable flag phải ở repository vì job `if` được đánh giá trước khi environment variables được cấp. Token được đọc native từ env bởi CLI; không dùng `--token`. `.vercel` bị Git ignore và không upload artifact.

Khi đã bật, push landing-page có thể deploy sau gates và approval. Dispatch chọn `preview` để yêu cầu chạy lại. Preview phải truy cập được bởi smoke browser; nếu deployment protection trả 401 thì smoke fail, cần cấu hình quyền/bypass automation theo chính sách nhóm trước khi nghiệm thu. Không ghi bypass secret vào URL/summary.

## Ruleset cho landing-page

Quyền hiện tại của tài khoản GitHub: push=true, admin=false, maintain=false. Chủ repo/admin cấu hình ruleset branch `landing-page`: yêu cầu PR nếu phù hợp, chặn force push/xóa branch, giới hạn bypass, require checks sau lần run đầu:

- `Landing Quality`
- `Landing QA (verify)`
- `Landing QA (visual)`

Đối chiếu tên check thực tế trong PR trước khi lưu ruleset. Không require Performance/Preview vì chúng là optional. Nếu bật yêu cầu PR, các cập nhật tiếp theo vào landing-page phải đi qua PR.

## Xử lý lỗi và rollback Preview

Mở job fail và tải artifact đúng suite; sửa lỗi source/test thực tế thay vì bỏ gate. Rerun cùng commit sau lỗi hạ tầng; thay đổi source phải chạy đủ gates lại. Nếu Preview lỗi sau deploy, đặt flag repo về false để dừng deploy mới, giữ URL Preview tốt trước đó cho review hoặc rerun commit tốt đã qua CI; không dùng promote/rollback production. Không công bố URL là đạt khi smoke fail.
