# Prompt phối hợp Antigravity — DeepTrace V10

Sao chép toàn bộ prompt bên dưới vào Antigravity khi đã mở đúng thư mục dự án.

---

## PROMPT

Bạn đang mở cùng workspace với một kỹ sư AI khác. Hãy phối hợp để hoàn tất redesign DeepTrace V10, tránh ghi đè thay đổi của nhau.

### Workspace

- Repository: `E:/Intern/DeepPro/deeppro-fe-platform`
- App: `apps/web` — React 19, TypeScript, Vite 8, Tailwind CSS v4
- Shared UI: `packages/ui` — Base UI với các primitive shadcn-style
- Branch hiện tại: `landing-page`
- Design reference: https://naturax-design.webflow.io/
- Brand guideline: `docs/[DEEPPRO] BRAND GUIDELINE.pdf`

### Trạng thái hiện tại — đọc trước khi nhận xét

Landing page V10 đã được triển khai trong source hiện tại: header, hero, giới thiệu, platform value, journey tương tác, features, industry cards, passport demo, FAQ, CTA và footer. Giao diện dùng `Button`, `Card`, `Badge`, `Sheet` từ thư viện shared; các section DeepTrace vẫn ở `apps/web/src/components/landing/`. Scene Three.js đã bị thay bằng journey 2D dùng React state.

Ảnh là ảnh chụp thật từ Pexels, được lưu local. Passport chỉ là minh họa và không nối dữ liệu thật. Các URL login/contact hiện có được giữ. Không thêm claim về khách hàng, tiêu chuẩn, blockchain, AI hoặc chứng nhận nếu không có bằng chứng trong repository.

QA đã ghi nhận trước đợt tối ưu ảnh mới nhất:

- Functional check: 13/13 pass trên production preview.
- Responsive visual check: 90 tổ hợp section/kích thước pass tại 320, 375, 390, 430, 768, 939, 1024, 1440, 1600 và 1920px.
- Sau khi chuyển sang responsive WebP: Lighthouse median mobile Performance 66, LCP 3.256s, TBT 1.416s, CLS 0.00184; desktop Performance 100, LCP 0.652s, TBT 0.053s, CLS 0.00058.
- LCP breakdown xác định ảnh hero là LCP element. Bản trước tối ưu mất 5.285s tải 310 KB; responsive source 960px giảm còn khoảng 2.3s/111 KB. Bản mobile crop 480/672px và các kích thước trung gian mới đang được triển khai, vì vậy số liệu trên chưa phải kết quả cuối.
- Build và visual/functional QA phải chạy lại sau những thay đổi ảnh mới nhất.

### Giai đoạn 1: review độc lập, chỉ đọc

Do nhiều tiến trình cùng sử dụng workspace, trong lượt này **không sửa, xóa, format hay ghi bất kỳ file nào**. Không tạo file mới. Không chạy lệnh thay đổi dependency, lockfile, Git index hoặc Git history.

Đọc source hiện tại và trả về một review ngắn, có dẫn đường dẫn và vị trí trong file, tập trung vào:

1. Bố cục desktop/mobile so với các nguyên tắc NaturaX: whitespace, nhịp section, hierarchy, photography và số lượng card.
2. Hero và responsive image selection: `picture`, `srcset`, `sizes`, responsive preload, kích thước intrinsic, LCP và khả năng tải trùng ảnh.
3. shadcn/Base UI: component nào đang dùng shared primitive thật, component nào còn custom không cần thiết.
4. Accessibility: keyboard/focus, mobile Sheet, contrast, semantics, alt text, reduced motion và Lighthouse findings.
5. Performance: LCP/TBT, unused JavaScript, font/image transfer, main-thread layout. Phân biệt số đo thực với giả thuyết.
6. Clean architecture: dead component, import/dependency/asset chưa dùng; chỉ nêu file đã xác nhận không có consumer.
7. Chỉ đề xuất tối đa 5 thay đổi có lợi ích rõ ràng. Với mỗi thay đổi, ghi: bằng chứng, file liên quan, tác động dự kiến, rủi ro và cách xác minh.

### Guardrails

- Không tạo site hoặc app mới; không đổi React/Vite/Tailwind.
- Không chạy lại shadcn init; không tạo UI library thứ hai.
- Không sao chép source, ảnh hoặc nội dung NaturaX.
- Không tạo ảnh AI, QR giả, khách hàng giả, testimonial, KPI hoặc claim chứng nhận.
- Không thay backend/API, URL login/contact hoặc workspace khác.
- Không xóa template/brand assets, brand PDF, `docs/LOGO/`, `.agents/`, `.taste-skill/`, báo cáo trước đó hoặc `tmp/pdfs/`.
- Không commit, push, deploy, `git reset`, `git clean` hoặc stage file.
- Workspace có dirty changes có từ trước. Không suy diễn toàn bộ Git diff hiện tại là của riêng V10.

### Định dạng phản hồi

Trả lời bằng tiếng Việt theo cấu trúc:

```text
## Findings
- [P0/P1/P2] Finding — file:line — evidence

## Recommended changes
1. Change — files — expected impact — verification

## Checks run
- Command/tool — actual result

## Not verified
- Items that need a real browser/device or another measurement
```

Không tuyên bố đã sửa source. Chờ người dùng chuyển sang giai đoạn implementation sau khi review được xem xét.

---
