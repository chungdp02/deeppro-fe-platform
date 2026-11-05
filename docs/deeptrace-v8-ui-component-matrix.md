# DeepTrace V8.2 — UI component migration matrix

Ngày kiểm tra: 2026-10-30  
Ứng dụng: `apps/web`  
Shared UI: `packages/ui` (shadcn-style components trên Base UI, Tailwind CSS v4)  
Branch: `landing-page`

## Inventory & migration

| # | Component group | V8.2 status | Implementation / evidence | Decision and risk |
|---:|---|---|---|---|
| 1 | Header controls (theme + menu trigger) | ADAPT | Theme controls và menu trigger dùng shared `Button`; trigger giữ `aria-expanded` / `aria-controls`. | Giữ HTML button semantics, rủi ro thấp. |
| 2 | Desktop navigation | KEEP CUSTOM | Anchor navigation với hash href và desktop breakpoint. | Đã đúng semantics/navigation; không có primitive thay thế tốt hơn. |
| 3 | Mobile drawer | MIGRATE | Dùng shared `Sheet` dựa trên Base UI Dialog; component tải động khi bấm menu. | Modal focus/scroll/outside behavior được kiểm thử; rủi ro thấp. |
| 4 | CTA anchors | ADAPT | Dùng `buttonVariants` trên `<a>`; href, `target`, `rel` giữ nguyên. | Không đổi link thành button; rủi ro thấp. |
| 5 | Hero composition / landing copy | KEEP CUSTOM | Bố cục và nội dung theo DeepTrace; CTA áp dụng variant dùng chung. | Bố cục là composition sản phẩm, rủi ro thấp. |
| 6 | Feature cards | MIGRATE | Sáu `Card as="article"` từ `packages/ui`. | Giữ semantics article và section CSS. |
| 7 | Benefits cards | MIGRATE | Ba `Card as="article"` từ `packages/ui`. | Giữ bố cục/theme/motion của brand. |
| 8 | Badges / labels | MIGRATE | Tám Badge instances gồm labels V8 và nhãn stage detail mới. | Sử dụng chung primitive; CSS riêng chỉ định hình diện mạo. |
| 9 | Product showcase / TiltCard | KEEP CUSTOM | Preview, ảnh, tilt/parallax và content riêng. | Không ép Card quanh visual tương tác nhiều lớp. |
| 10 | Industry showcase / tree story | KEEP CUSTOM | Storytelling và cấu trúc cây; nhãn node đã dùng Badge. | Tương tác gắn với visual tree; không tạo wrapper thừa. |
| 11 | Product journey / timeline | KEEP CUSTOM | Scroll ↔ stage ↔ camera mapping tiếp tục thuộc landing/Three.js. | Không đổi đồng bộ camera, rủi ro cao. |
| 12 | Three.js DOM action controls | ADAPT | Load, retry, 4 stage controls và pause/resume chia sẻ `buttonVariants` nhưng giữ `<button>` gốc. | Không thêm Button wrapper vào render loop/Canvas; camera/picking giữ nguyên. |
| 13 | 3D stage detail panel | MIGRATE | Shared `Card` và `Badge`, `aria-live="polite"` giữ nguyên. | CSS reset giữ visual panel trong suốt hiện tại. |
| 14 | FAQ | KEEP CUSTOM | Sáu native `<details>/<summary>`, nhiều mục mở đồng thời, không mục nào mặc định mở. | Hoạt động khi tắt JavaScript; Accordion không tăng lợi ích thực tế. |
| 15 | Theme state / initial paint / logos | KEEP CUSTOM | `ThemeProvider`, prepaint, persistence và logo assets V8 giữ nguyên. | Không thay state/hydration hoặc filter logo. |
| 16 | Loading / WebGL error / fallback | ADAPT | Status/fallback giữ custom; retry/load actions dùng shared variants. | Không thay error/context recovery; rủi ro cao. |
| 17 | Footer composition / links | KEEP CUSTOM | Layout/links là section-specific; CTA anchors dùng chung variant. | Giữ semantics `<a>`. |
| 18 | Forms, Tooltip, Popover, Tabs, Alert | DEFER | Không tìm thấy flow/form hoặc nội dung cần những primitives này. | Không thêm tính năng hoặc dependency chưa có. |
| 19 | Custom modal mechanics trong mobile menu | REMOVE DUPLICATE | Escape/scroll lock/focus/outside behavior cũ được thay bằng Base UI Dialog/Sheet. | Một implementation modal còn lại trong `packages/ui`. |

## Coverage

- **19 component/pattern groups** được kiểm kê sau V8.
- **5 MIGRATE:** mobile drawer, feature cards, benefits cards, badge/labels, 3D stage detail panel.
- **4 ADAPT:** header controls, CTA anchors, Three.js DOM controls, loading/error actions.
- **8 KEEP CUSTOM:** desktop navigation, hero composition, product preview, industry storytelling, journey/timeline, FAQ, theme/prepaint, footer composition.
- **1 REMOVE DUPLICATE:** custom modal mechanics của drawer.
- **1 DEFER:** form/tooltip/popover/tabs/alert flows không tồn tại trong source.
- Shared package được dùng xuyên `apps/web`: `Button`, `buttonVariants`, `Card`, `Badge`, `Sheet`.
- Không tạo component system thứ hai, không cài dependency, không chuyển Three.js sang shadcn.

## Shared package & Tailwind

`packages/ui/src/components/sheet.tsx` wrap Base UI Dialog parts (`Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetOverlay`, `SheetTitle`, `SheetTrigger`) và hỗ trợ các phía mở. `packages/ui/package.json` đã export theo wildcard, nên không cần sửa package exports.

`packages/ui/src/styles/globals.css` scan source của `apps/web` và có `@source "../components/sheet.tsx";`. Vẫn không nạp Preflight toàn cục. Landing CSS giữ phần visual brand; sheet dùng data states của Base UI và semantic popover/header colors.

## Evidence

- `corepack pnpm typecheck`: PASS.
- `corepack pnpm lint`: PASS.
- `corepack pnpm --filter web build`: PASS.
- `corepack pnpm --filter web test:verify`: 26/26 PASS.
- `corepack pnpm --filter web test:visual`: 70/70 PASS ở 320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920 px; light/dark screenshots được tạo bởi harness.
- Drawer-specific browser checks: focus trap/return, Escape, outside click, navigation close, scroll lock restoration, resize close, theme control và `aria-modal` PASS.
- FAQ chạy khi tắt JavaScript; 2 mục mở đồng thời PASS.
- Lighthouse accessibility score: 100 trong cả 6 lượt mobile và 6 lượt desktop sau V8.2; xem report V8.2 để biết độ tin cậy của performance metrics.

## Kiểm chứng hành vi FAQ và Sheet

Accordion của `packages/ui` được đọc và đánh giá, nhưng không thay FAQ native: `details` render sẵn answer trong prerendered HTML, hỗ trợ Enter/Space qua browser và cho mở nhiều mục, đồng thời hoạt động khi JavaScript tắt. Test `verify.cjs` kiểm tra hai câu hỏi cùng mở trong no-JS context. Đây là lựa chọn dựa trên behavior đang có, không phải bỏ qua migration.

Sheet được chọn vì drawer là modal trên mobile và cần focus trap, khóa cuộn, Escape, backdrop dismissal, focus return. Menu chunk tải khi người dùng mở; trigger nằm ngoài chunk và truyền `finalFocus` ref để Base UI trả focus đúng.
