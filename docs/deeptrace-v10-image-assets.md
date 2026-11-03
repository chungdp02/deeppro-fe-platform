# DeepTrace V10 Photography Asset Manifest

All six photographs below are real Pexels photographs, downloaded locally and converted to WebP for the landing page. Production code does not hotlink Pexels. Photographer, source, and license details are recorded here; the current site footer does not display photo credits. Pexels’ license permits free commercial use and editing; attribution is not required, and the images do not imply endorsement. See the [Pexels license](https://www.pexels.com/license/).

| Local asset | Source / photographer | License | Dimensions | Optimized size | Landing use | Alt text / notes |
| --- | --- | --- | ---: | ---: | --- | --- |
| `apps/web/public/images/v10-hero-harvest.webp` | [Mark Stebnicki — greenhouse harvest](https://www.pexels.com/photo/farmer-harvesting-vegetables-inside-greenhouse-28513536/) | Pexels license | 1920 × 1280 | 310,866 bytes | Hero; journey origin stage | “Người nông dân đang làm việc trong nhà kính.” Landscape image; primary photo. |
| `apps/web/public/images/v10-supply-chain-warehouse.webp` | [Tiger Lily — warehouse workers](https://www.pexels.com/photo/workers-walking-along-aisle-in-warehouse-4487383/) | Pexels license | 1920 × 1280 | 322,802 bytes | About / supply-chain story; journey distribution stage | “Nhân viên đang xử lý hàng hóa trong kho.” Real warehouse context. |
| `apps/web/public/images/v10-pharma-warehouse.webp` | [Elements Interactive — industrial warehouse](https://www.pexels.com/photo/industrial-warehouse-with-storage-and-forklift-37912780/) | Pexels license | 1920 × 1280 | 259,046 bytes | Healthcare and pharmaceutical industry card | “Kho công nghiệp với khu vực lưu trữ và xe nâng.” General warehouse image, not a claim of a particular pharmaceutical facility. |
| `apps/web/public/images/v10-food-greenhouse.webp` | [Soo Ann Woon — greenhouse vegetables](https://www.pexels.com/photo/selective-focus-photography-of-green-vegetables-3265437/) | Pexels license | 1920 × 1440 | 268,226 bytes | Food and agriculture card; journey production stage; passport illustration | “Luống rau xanh trong một nhà kính.” Reused as illustrative industry photography, not product proof. |
| `apps/web/public/images/v10-consumer-goods.webp` | [Aibek Skakov — grocery shelves](https://www.pexels.com/photo/grocery-store-shelves-loaded-with-diverse-products-36749154/) | Pexels license | 933 × 1400 | 243,136 bytes | Consumer goods industry card | “Kệ siêu thị có nhiều mặt hàng tiêu dùng.” Portrait composition. |
| `apps/web/public/images/v10-barcode-delivery.webp` | [RDNE Stock project — delivery package scan](https://www.pexels.com/photo/deliverywoman-scanning-barcode-from-a-brown-envelope-7362877/) | Pexels license | 1000 × 1500 | 94,522 bytes | Journey lookup stage; feature image | “Nhân viên giao nhận dùng điện thoại quét nhãn trên một gói hàng.” Photo illustrates scanning; not a live DeepTrace QR or product lookup. |

## Responsive hero candidates

To optimize mobile LCP without degrading visual fidelity, the hero image includes mobile-specific crops (aspect ratio 1.08, centering on the greenhouse subject) and responsive desktop candidates:

| Asset | Dimensions | File size | Use |
| --- | --- | ---: | --- |
| `apps/web/public/images/v10-hero-harvest-mobile-480.webp` | 480 × 445 | 39,052 bytes | Mobile 1x / narrow viewports |
| `apps/web/public/images/v10-hero-harvest-mobile-672.webp` | 672 × 622 | 58,034 bytes | Mobile 1.75x/2x (primary mobile LCP candidate) |
| `apps/web/public/images/v10-hero-harvest-mobile-960.webp` | 960 × 889 | 111,328 bytes | High-DPI mobile / small tablet viewports |
| `apps/web/public/images/v10-hero-harvest-480.webp` | 480 × 320 | 38,114 bytes | Desktop candidate (narrow column) |
| `apps/web/public/images/v10-hero-harvest-672.webp` | 672 × 448 | 61,650 bytes | Mid-size candidate |
| `apps/web/public/images/v10-hero-harvest-960.webp` | 960 × 640 | 111,052 bytes | Primary desktop candidate (LCP) |
| `apps/web/public/images/v10-hero-harvest-1440.webp` | 1440 × 960 | 194,146 bytes | Large desktop candidate |
| `apps/web/public/images/v10-hero-harvest.webp` | 1920 × 1280 | 310,866 bytes | Full-bleed / 2x high-res fallback |

## Delivery notes

- The hero image is preloaded via `<link rel="preload" as="image">` with `imagesrcset` and `imagesizes`, positioned first in `<head>` so discovery and download precede secondary resources.
- Below-the-fold photographs use native `loading="lazy"` and asynchronous decoding (`decoding="async"`).
- Images include intrinsic dimensions (`width`/`height`) in markup to reserve layout space and eliminate cumulative layout shift (measured CLS < 0.001 on both mobile and desktop).
- All files are local WebP.
- Photo credits are documented in this manifest rather than displayed in the site footer.
- No AI-generated images, NaturaX imagery, simulated QR code or certification artwork is used.
