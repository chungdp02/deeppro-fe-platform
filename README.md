# DeepTrace frontend platform

Monorepo này chứa landing page DeepTrace và thư viện giao diện dùng chung.

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
workspace task bằng `corepack pnpm dev`. Nếu Turbo trên Windows báo không tìm
thấy package manager binary, dùng lệnh lọc `corepack pnpm --filter web dev` ở
trên để chạy riêng landing page bằng Vite.

## Cấu trúc workspace

| Đường dẫn | Vai trò |
| --- | --- |
| `apps/web` | Ứng dụng React 19, TypeScript và Vite; landing page được ghép từ các section theo domain. |
| `packages/ui` | Các primitive shadcn-style dùng chung trên Base UI (`Button`, `Badge`, `Card`, `Sheet`). |
| `docs` | Brand guideline, báo cáo hiệu năng/kiến trúc và tài liệu nghiên cứu. |

Trong `apps/web/src`, `App.tsx` ghép các section ở `components/landing`. Hành
trình sản phẩm dùng các panel sticky và GSAP tải động; trang không tải Three.js/WebGL.
`packages/ui/src/components` chỉ chứa primitive giao diện dùng chung. Các
section DeepTrace ở lại trong ứng dụng vì gắn với nội dung và hành trình riêng
của landing page.

Các lệnh thường dùng từ thư mục gốc:

```powershell
corepack pnpm --filter web typecheck
corepack pnpm --filter web lint
corepack pnpm --filter web build
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
```

`corepack pnpm build` build các workspace có task build trong Turborepo. Landing
page được prerender thành `apps/web/dist/index.html`. Để tạo artifact production,
dùng `corepack pnpm --filter web build`.
Có thể xem bản production bằng:

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
`tmp/v10-qa/`. Có thể đặt `TEST_URL` và `TEST_OUTPUT_DIR` để trỏ tới preview hoặc
thư mục kết quả khác. Lighthouse được gọi qua Corepack và tải bản `13.5.0` khi
cần; lần chạy đầu cần kết nối mạng và Chrome/Chromium phù hợp.

Ứng dụng hiện không yêu cầu file `.env` để chạy landing page. Không commit các
file environment cục bộ có thông tin xác thực.

Báo cáo cấu trúc hiện tại và phạm vi dùng shadcn: [architecture review](docs/deeptrace-project-architecture-review.md).
