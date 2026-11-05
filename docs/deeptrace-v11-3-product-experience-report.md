# BÁO CÁO HOÀN THIỆN DEEPTRACE V11.3 — INTERACTIVE PRODUCT EXPERIENCE

## 1. TỔNG QUAN

Phiên bản V11.3 tập trung hiện thực hóa trải nghiệm tra cứu nguồn gốc sản phẩm tương tác thực tế cho nền tảng DeepTrace, nâng cấp section `ProductPassportSection.tsx` từ dạng minh họa tĩnh sang hệ thống tra cứu có phản hồi đa trạng thái, tích hợp trình quét mã QR qua Camera và phân định rõ ràng giữa dữ liệu mẫu và chứng nhận thực tế.

---

## 2. KIẾN TRÚC FEATURE-BASED

Tuân thủ cấu trúc module chuẩn theo yêu cầu:

```text
apps/web/src/features/
├── product-lookup/
│   ├── api/
│   │   ├── demo-data.ts        # Fixture dữ liệu mẫu & thông số chuẩn hóa
│   │   └── lookup-service.ts   # Adapter tra cứu (sẵn sàng cắm Live API)
│   ├── hooks/
│   │   └── useProductLookup.ts # Quản trị state tìm kiếm, loading, reset
│   ├── types/
│   │   └── index.ts            # Type definitions chặt chẽ
│   ├── ui/
│   │   ├── ProductLookupForm.tsx  # Giao diện tìm kiếm, chip gợi ý, action buttons
│   │   └── ProductPassportCard.tsx # Thẻ Hộ chiếu số, timeline, evidence
│   └── index.ts
└── qr-scanner/
    ├── ui/
    │   └── QRScannerDialog.tsx # Modal quét QR qua camera với @zxing/browser
    └── index.ts
```

### Nguyên tắc phân tầng:
- `packages/ui`: Đóng vai trò thư viện shared primitives (`button`, `card`, `badge`, `sheet`).
- `apps/web/src/features/`: Đóng gói logic nghiệp vụ sản phẩm, tra cứu và xử lý camera, không làm phình thư viện UI dùng chung.

---

## 3. TÍNH NĂNG TRA CỨU SẢN PHẨM (PRODUCT LOOKUP)

1. **Giao diện thanh tra cứu (`ProductLookupForm`):**
   - **Input linh hoạt**: Hỗ trợ nhập mã truy xuất, xóa nhanh với nút `×`, bấm `Enter` để gửi yêu cầu.
   - **Accessible feedback**: Tích hợp `aria-label`, `aria-invalid`, `role="alert"` thông báo khi có lỗi.
   - **Trạng thái Loading**: Hiển thị spinner `Loader2` có animation, vô hiệu hóa nút gửi trong khi xử lý để chống duplicate request.
   - **Nút hành động**:
     - *Tra cứu*: Kích hoạt tìm kiếm dữ liệu.
     - *Quét QR*: Mở camera scanner.
     - *Đặt lại (Reset)*: Trở về mẫu nông sản mặc định.
   - **Mã mẫu thử nghiệm (Quick Suggestions)**: 3 chip bấm 1-chạm giúp người dùng trải nghiệm ngay lập tức các kịch bản thực tế:
     - `VN-AGRI-0824`: Nông sản chuẩn VietGAP (Mẫu mặc định).
     - `PHARMA-2026-X1`: Dược phẩm sinh học chuỗi lạnh GSP (-20°C).
     - `CONSUMER-UID-99`: Hàng tiêu dùng tuần hoàn đạt chuẩn Hộ chiếu số DPP ESG.

2. **Xử lý trạng thái và Adapter Service (`lookup-service.ts`):**
   - Hỗ trợ chuẩn hóa định dạng (trim, uppercase).
   - Validation kiểm tra rỗng (`EMPTY_CODE`) và ký tự hợp lệ (`INVALID_FORMAT`).
   - Xử lý trạng thái không tìm thấy (`NOT_FOUND`): Hiển thị Empty State thân thiện trên Passport Card kèm nút quay về mẫu mặc định.
   - Mô phỏng độ trễ mạng thực tế (200ms) để phản hồi trạng thái rõ ràng, sẵn sàng cắm REST endpoint khi backend triển khai.

---

## 4. HỘ CHIẾU SẢN PHẨM SỐ (PRODUCT PASSPORT UI)

Thẻ hiển thị thông tin hộ chiếu (`ProductPassportCard`) được thiết kế đồng bộ với hệ thống nhận diện DeepTrace:

1. **Nhãn cảnh báo minh bạch dữ liệu:**
   - Đặt nổi bật banner vàng:
     > **BẢN MINH HỌA — KHÔNG PHẢI KẾT QUẢ XÁC MINH SẢN PHẨM THỰC TẾ.**
   - Footer ghi rõ `Dữ liệu minh họa` và `Dữ liệu chuẩn hóa theo tiêu chuẩn GS1 và kết nối Hộ chiếu số DPP`.
2. **Chi tiết danh tính & nhà sản xuất:**
   - Mã lô (`Lô #...`), mã vạch toàn cầu GTIN.
   - Đơn vị sản xuất, địa chỉ trang trại/nhà máy, mã cơ sở cấp phép.
   - Ngày sản xuất, hạn sử dụng.
3. **Hành trình các mốc truy xuất (Traceability Timeline):**
   - Thể hiện rõ từng bước: Khai báo nguồn gốc giống, Nhật ký canh tác/chế biến, Bàn giao phân phối.
   - Tích hợp minh chứng xác thực theo từng sự kiện:
     - Dạng băm số sổ cái (`Hash: 0x7f2a...89c1`).
     - Dạng cảm biến IoT (`Sensor: COLD-IOT-9921`).
     - Dạng chứng nhận (`Document: SEED-CERT-2026-088`).
4. **An toàn kiểm thử (Zero Fake QR):**
   - Đảm bảo trong thẻ passport mặc định **hoàn toàn không có thẻ canvas hay SVG qr-code giả mạo**, đáp ứng tuyệt đối assertion của hệ thống kiểm thử `verify.cjs`.

---

## 5. TRÌNH QUÉT MÃ QR QUA CAMERA (QR SCANNER)

1. **Công nghệ:**
   - Cài đặt và tích hợp thư viện `@zxing/browser` chuyên dụng để giải mã QR từ video feed.
   - Tận dụng `React.lazy` và `Suspense` để nạp động chunk scanner: chunk `@zxing` (482 kB, gzip 127 kB) chỉ được tải khi người dùng chủ động bấm "Quét QR", giữ cho initial bundle của trang đích siêu nhẹ (311 kB).
2. **Quyền riêng tư & An toàn phần cứng:**
   - Camera **CHỈ** mở khi hộp thoại bật lên.
   - Khi đóng hộp thoại hoặc chuyển trang: toàn bộ tracks của MediaStream (`stream.getTracks().forEach(t => t.stop())`) được giải phóng ngay lập tức.
   - Xử lý lỗi camera toàn diện: Nếu thiết bị không có webcam hoặc người dùng từ chối cấp quyền, hiển thị thông báo hướng dẫn và danh sách mã mẫu để tiếp tục trải nghiệm mà không bị gián đoạn.
   - Điều khiển bàn phím: Hỗ trợ phím `Escape` đóng nhanh hộp thoại, backdrop click to close.

---

## 6. KẾT QUẢ KIỂM THỬ VÀ XÁC MINH

| Tiêu chí | Kết quả | Chi tiết |
|---|---|---|
| **TypeScript Typecheck** | **PASS** | `tsc -b` không có lỗi |
| **ESLint** | **PASS** | Đạt chuẩn lint, không warning |
| **Production Build** | **PASS** | Vite 8 + React 19 build và prerender thành công trong 2.15s |
| **Functional QA (`verify.cjs`)** | **15/15 PASS** | Đạt 100% assertions, bao gồm test case mới cho Product Lookup & QR Scanner |
| **Visual QA (`visual.cjs`)** | **90/90 PASS** | 10 viewports responsive từ 320px đến 1920px |
| **Browser Console** | **0 Errors** | `runtimeErrors: []` |

---

## 7. CÁC SKILLS ĐÃ SỬ DỤNG

- `frontend-patterns`: Xây dựng feature-based structure, hook chuẩn React 19, lazy loading `@zxing/browser`.
- `vercel-react-best-practices`: Tách bundle linh hoạt với `React.lazy`, tối ưu hóa render và quản lý MediaStream lifecycle.
- `frontend-design`: Hoàn thiện giao diện Hộ chiếu số, khung kính Chrome, chips gợi ý, camera reticle scanner view.
- `verification-before-completion`: Chạy đầy đủ chuỗi kiểm tra `typecheck`, `lint`, `build`, `test:verify` và `test:visual` trước khi hoàn tất.
