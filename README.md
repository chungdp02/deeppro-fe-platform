# DeepTrace frontend platform

Monorepo này chứa landing page DeepTrace, thư viện giao diện dùng chung và một
prototype Astro phục vụ nghiên cứu kiến trúc.

## Yêu cầu

- Node.js `>=20.19.0` (phiên bản đã khai báo trong `package.json`).
- Corepack và pnpm `11.25.0` (phiên bản đã khai báo trong `package.json`).

## Cài đặt và chạy landing page

Từ thư mục gốc repository:

```powershell
corepack pnpm install
corepack pnpm --filter web dev
```

Vite in địa chỉ local, thường là `http://localhost:5173/`. Có thể chạy các
workspace app cùng lúc bằng `corepack pnpm dev`; lệnh này chạy cả landing page
và prototype Astro. Nếu Turbo trên Windows báo không tìm thấy package manager
binary, dùng lệnh lọc `corepack pnpm --filter web dev` ở trên để chạy riêng
landing page bằng Vite.

## Cấu trúc workspace

| Đường dẫn | Vai trò |
| --- | --- |
| `apps/web` | Ứng dụng React 19, TypeScript, Vite; landing page và trải nghiệm Three.js. |
| `apps/poc-astro` | Prototype Astro tĩnh để thử nghiệm kiến trúc; chạy mặc định ở cổng `4175`. |
| `packages/ui` | Thư viện component giao diện dùng chung và cấu hình shadcn. |
| `docs` | Brand guideline, báo cáo hiệu năng/kiến trúc và tài liệu nghiên cứu. |

Các lệnh thường dùng từ thư mục gốc:

```powershell
corepack pnpm --filter web typecheck
corepack pnpm --filter web lint
corepack pnpm --filter web build
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
```

`corepack pnpm build` build các ứng dụng có task build trong Turborepo. Bản
React được prerender thành `apps/web/dist/index.html`; có thể xem bản production
bằng:

```powershell
corepack pnpm --filter web exec vite preview
```

## Kiểm thử landing page

Các functional và visual test dùng Playwright. Build trước, sau đó chạy preview
ở cổng `4174` trong một terminal:

```powershell
corepack pnpm --filter web build
corepack pnpm --filter web exec vite preview --host 127.0.0.1 --port 4174 --strictPort
```

Trong terminal khác:

```powershell
corepack pnpm --filter web test:verify
corepack pnpm --filter web test:visual
corepack pnpm --filter web test:perf
```

Mặc định test dùng `http://localhost:4174/` và ghi artifact cục bộ vào
`tmp/v4-qa/`. Có thể đặt `TEST_URL` và `TEST_OUTPUT_DIR` để trỏ tới preview hoặc
thư mục kết quả khác. Lighthouse được gọi qua Corepack và tải bản `13.5.0` khi
cần; lần chạy đầu cần kết nối mạng và Chrome/Chromium phù hợp.

Ứng dụng hiện không yêu cầu file `.env` để chạy landing page. Không commit các
file environment cục bộ có thông tin xác thực.
