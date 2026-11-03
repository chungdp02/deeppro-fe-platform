# DeepTrace — Kiểm tra kiến trúc, shadcn và clean code

Ngày cập nhật: 2026-11-04. Phạm vi: `apps/web`, shared UI liên quan trong `packages/ui` và tài liệu hiện trạng.

## 1. Kết luận

Dự án **đang sử dụng shadcn/ui theo mô hình shared source**, cấu hình `base-nova` và Base UI. Không có hai bộ primitive trùng nhau trong app và package. Tuy nhiên, landing page không phải toàn bộ đều là component shadcn: layout, nội dung, carousel chạy liên tục và hiệu ứng cuộn là composition riêng; FAQ và tính năng dùng native disclosure.

Đây là cấu trúc hợp lý cho landing page. Không cần biến mọi `section`, ảnh hoặc timeline thành primitive shadcn. Việc có `components.json` chưa đủ để kết luận; lượt review đã kiểm tra cả source primitive, import thực tế và DOM production.

## 2. Cấu trúc hiện tại

```text
apps/web/
  components.json             # Alias CLI về shared package; không tạo bộ UI thứ hai
  vite.config.ts              # React + Tailwind v4; alias @ về src
  src/
    main.tsx                  # Import shared globals trước landing styles; hydrate prerender
    App.tsx                   # ThemeProvider và thứ tự các section
    components/
      theme-provider.tsx      # Theme persistence, system preference, root class
      landing/
        Header.tsx            # Điều hướng, theme, lazy import mobile Sheet
        MobileNavigationSheet.tsx
        Hero.tsx
        AboutSection.tsx
        PlatformValueSection.tsx
        SolutionCarousel.tsx
        TraceabilityJourney.tsx
        ProductPassportSection.tsx
        FeaturesSection.tsx
        IndustrySolutions.tsx
        FAQSection.tsx
        FinalCTASection.tsx
        Footer.tsx
        Reveal.tsx            # Observer dùng chung cho reveal hai chiều
        ArrowIcon.tsx
        navigation.ts         # Anchors và URL dùng chung
    lib/motion-tokens.ts       # Token chuyển động GSAP
    styles/landing.css        # Layout và visual composition của landing page
  tests/
    verify.cjs                # Functional + theme regression
    visual.cjs                # Geometry, text clipping, image checks theo viewport
    run-lighthouse.cjs
  scripts/prerender.mjs
  public/images/
packages/ui/
  components.json
  src/components/
    button.tsx
    card.tsx
    badge.tsx
    sheet.tsx
  src/lib/utils.ts            # cn — class merging
  src/styles/globals.css     # Tailwind sources, class-based dark, semantic tokens
```

Các file cấu hình và thành phần template không liên quan được giữ nguyên trong lượt này. Không di chuyển component chỉ để thay đổi tên thư mục.

## 3. Bằng chứng tích hợp shadcn

| Thành phần | Cách triển khai | Nơi sử dụng |
| --- | --- | --- |
| Button | Base UI Button + CVA variants + `cn`; `buttonVariants` cho anchor | Header, Hero, About, carousel pause, product preview, industry CTA, Final CTA, mobile menu |
| Card | Shared composition có `data-slot`; bổ sung `as="article"` để giữ ngữ nghĩa | About, carousel, ngành hàng, hộ chiếu sản phẩm |
| Badge | Base UI `useRender`, variants dùng chung | Trạng thái trong preview hộ chiếu |
| Sheet | Local adapter theo mẫu shadcn, dùng Base UI Dialog/Portal/Backdrop | MobileNavigationSheet; tải động khi mở menu |
| Semantic tokens | Một nguồn shared trong `globals.css` | Tailwind utilities và landing styles |

Cả hai `components.json` đều trỏ tới shared UI và shared stylesheet. Package export `./components/*` cho phép import `@workspace/ui/components/button` trực tiếp. Không có `apps/web/src/components/ui` sao chép bộ primitive.

`shadcn` là CLI trong dev dependencies; mô hình này sở hữu source component trong repository, không yêu cầu một runtime package tên `shadcn/ui`.

Các primitive đã được điều chỉnh cho dự án; báo cáo không khẳng định chúng là bản registry nguyên trạng.

## 4. Các phần giữ custom/native

| Phần | Trạng thái và lý do |
| --- | --- |
| Hero, section headings, ảnh, footer | Layout riêng của landing page; HTML semantic và CSS phù hợp |
| FAQ | Native `details/summary`; hỗ trợ keyboard, nhiều câu mở và hoạt động trước hydration |
| Features | Native disclosure, phần đầu mở mặc định; không cần state/Accordion mới |
| SolutionCarousel | Shared Card/Button; dải lặp CSS riêng để chạy liên tục, không phải shadcn Carousel/Embla |
| Journey | Bốn article sticky xếp chồng; GSAP ScrollTrigger tải gần section, có cleanup và reduced motion |
| Product passport | UI minh họa dùng Card/Badge, không phải ứng dụng backend hay QR thật |
| ThemeProvider, Reveal | Logic đặc thù của app, không đặt trong shared primitive |

Vì vậy không nên mô tả dự án là “100% mọi component đều dùng shadcn”. Các native/custom exception là lựa chọn có căn cứ, không phải import bị thiếu.

## 5. Hai lỗi đã sửa

### Dark utility không đồng bộ với theme được chọn

Trước sửa, app dùng `html.dark` nhưng Tailwind `dark:*` mặc định theo `prefers-color-scheme`. Token và component utility có thể theo hai theme khác nhau.

Đã thêm `@custom-variant dark (&:where(.dark, .dark *));` vào shared stylesheet. Regression kiểm tra cả bốn tổ hợp theme hệ điều hành và theme được chọn; màu thực tế phải bằng reference dựa trên semantic token, không chỉ khác nhau giữa light/dark.

### Typecheck web không kiểm tra source

Script cũ `tsc --noEmit` chạy trên solution tsconfig có `files: []` và references. Kiểm tra `--listFiles` không liệt kê file nào.

Đã đổi thành `tsc -b`, kiểm tra các project app/node được tham chiếu. `pnpm typecheck` hiện kiểm tra cả shared UI và web.

## 6. Code đã dọn

- Bỏ 35 nhánh selector không còn dùng của value cards, journey dạng tab/panel cũ và các class legacy khác.
- Bỏ 54 declaration bị khai báo sau ghi đè trong cùng selector và cùng điều kiện cascade.
- Bỏ keyframe `chapter-in` không còn dùng; loại phần Hero footnote bị ẩn cùng stylesheet liên quan.
- Bỏ grid placement còn sót lại sau khi Hero đã chuyển sang flex.
- Format lại stylesheet để đọc và review được; không cài formatter/parser mới vào production dependencies.
- Bỏ semantic color tokens trùng ở landing stylesheet; shared `globals.css` là nguồn cho light/dark tokens. Các màu gradient riêng của layout vẫn thuộc app.
- Đồng bộ font tokens với system font đang render; bỏ khai báo Oswald/Montserrat không còn phù hợp.
- Export một `MobileNavigationSheetProps`, dùng type-only import ở Header; runtime Sheet vẫn lazy load.
- Gom URL tài liệu/pháp lý vào `navigation.ts`, tránh lặp literal giữa Footer, FAQ và product preview.
- Cập nhật tài liệu hiện trạng; đánh dấu V10 plan là tài liệu kế hoạch, sửa mô tả journey và Button bị lỗi thời.

Không xóa public export của shared primitive chỉ vì landing hiện chưa dùng; đó là API tái sử dụng/template. Không xóa ảnh/font/template hoặc thư mục `tmp/pdfs/` trong lượt kiểm tra này.

## 7. Xác minh

- `pnpm typecheck`: đạt, hai workspace.
- `pnpm lint`: đạt, hai workspace.
- `pnpm build`: đạt, TypeScript + Vite + prerender.
- Production preview `http://127.0.0.1:4174/`.
- Functional regression: 15/15 đạt, bao gồm menu mobile/focus, FAQ, ảnh, theme, điều hướng và kiểm tra dark utility mới.
- Responsive suite: 90/90 trường hợp đạt tại 320, 375, 390, 430, 768, 939, 1024, 1440, 1600, 1920px.
- Bước dọn dead/overridden CSS ban đầu được so sánh computed style trước/sau tại 390/1440px, hai theme: không có entry style thay đổi. Đối chiếu này áp dụng cho bước dọn CSS trước sửa theme, không dùng để khẳng định toàn bộ code thay đổi giống từng pixel.
- `git diff --check`: đạt trên phần source đã kiểm tra.
- Independent reviewer đã kiểm tra lại các thay đổi; góp ý tăng độ chặt của regression theme đã được áp dụng.

Bundle production CSS trước/sau toàn bộ cleanup: **61.08 → 56.62 kB**, gzip **11.83 → 11.16 kB**. Đây là số lượng CSS do build báo; không suy ra điểm Lighthouse từ các số này. Không đo lại Lighthouse trong lượt review kiến trúc này.

## 8. Giới hạn và repository safety

- Native disclosure và carousel tùy chỉnh chưa được chuyển thành shadcn Accordion/Carousel; không cần chuyển chỉ để tăng số lượng component shadcn.
- `landing.css` vẫn là stylesheet layout chính và còn các override theo specificity/breakpoint hợp lệ. Lượt này loại dead code và khai báo chắc chắn bị ghi đè; không thay toàn bộ bằng utility classes.
- Báo cáo V8/V9 cũ là lịch sử, có thể đề cập Three.js/scene đã được thay thế. Dùng tài liệu này cho source hiện tại.
- Working tree đã có nhiều thay đổi và file xóa từ các lượt redesign trước khi audit bắt đầu; không quy toàn bộ Git diff cho lần cleanup này.
- Không commit, push hoặc deploy. Artifact QA nằm trong thư mục tạm, không phải source cần đưa vào commit.

## Tham chiếu

- [shadcn monorepo](https://ui.shadcn.com/docs/monorepo)
- [shadcn Button / Base UI](https://ui.shadcn.com/docs/components/base/button)

Skill dùng trong lượt chính: `frontend-patterns`, `requesting-code-review`. Reviewer độc lập áp dụng `vercel-react-best-practices` và `web-design-guidelines`.
