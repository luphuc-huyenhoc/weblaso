# HỆ THỐNG MÃ DANH MỤC DỰ ÁN (PROJECT MODULE & DATA CATALOG)

Tài liệu này định nghĩa hệ thống **Mã Danh Mục Định Danh (Module & Data Codes)** cho toàn bộ dự án **Lữ Phúc (Lá số Bát Tự, Tử Vi, Dịch Học & Phong Thủy)**.

Khi cần bảo trì, sửa lỗi hoặc nâng cấp, bạn chỉ cần gửi yêu cầu kèm theo **Mã danh mục** (Ví dụ: *"Chỉnh sửa cho tao `[UI-BAZI-FORM]` thêm trường XYZ"*). Hệ thống AI sẽ **chỉ can thiệp chính xác vào các tệp tin thuộc mã đó**, không làm ảnh hưởng đến các thành phần khác.

---

## 📌 QUY TẮC ĐẶT TIỀN TỐ (PREFIXES)

| Tiền tố | Ý nghĩa | Phạm vi tác động |
| :--- | :--- | :--- |
| **`[CORE-...]`** | Động cơ & Thuật toán tính toán | Logic lập lá số, an sao, nạp giáp, ngũ hành, can chi |
| **`[UI-...]`** | Thành phần giao diện (Component) | Form nhập liệu, bảng kết quả, đồ họa, la bàn, màu sắc |
| **`[PAGE-...]`** | Trang màn hình người dùng (Route) | Khung trang, tiêu đề SEO, bố cục hiển thị tổng thể |
| **`[API-...]`** | Giao diện lập trình cổng Backend | Xử lý request/response, validation Zod, xác thực |
| **`[DB-...]`** | Cơ sở dữ liệu (Database Schema) | Bảng dữ liệu Prisma, trường lưu trữ, migrate, seed data |
| **`[CFG-...]`** | Cấu hình toàn dự án (Configuration) | Biến môi trường, Tailwind CSS, bảo mật, font chữ |

---

## 1. NHÓM THUẬT TOÁN & LOGIC TÍNH TOÁN (`[CORE-...]`)

| Mã Danh Mục | Tên & Ý Nghĩa | Tệp Tin Phụ Trách | Phạm Vi Logic |
| :--- | :--- | :--- | :--- |
| `[CORE-BAZI]` | **Thuật toán Bát Tự Manh Phái** | `src/domain/bazi/index.ts` | 4 trụ (Năm, Tháng, Ngày, Giờ), Tiết khí Lập Xuân, Tàng Can, Thập Thần, Vượng Nhược, Thần Sát, Đại Vận 100 năm, Lưu Niên. |
| `[CORE-BAZI-REVERSE]` | **Tìm ngày sinh theo Tứ Trụ** | `src/domain/bazi/reverse.ts` | Thuật toán quét ngược tổ hợp can chi 1900–2150 tìm ngày giờ sinh tương ứng. |
| `[CORE-TUVI]` | **Động cơ An Sao Tử Vi Đẩu Số** | `src/domain/ziweidoushu/index.ts` | 12 Cung, Thân, Cục, 14 Chính Tinh, Vòng Lộc Tồn, Thái Tuế, Tràng Sinh, Tứ Hóa, Tuần Triệt. |
| `[CORE-ICHING]` | **Động cơ Dịch Học & Lục Hào** | `src/domain/iching/index.ts` | 64 Quẻ Dịch, Nạp Giáp, Thế Ứng, Lục Thân, Phục Thần, Lục Thú, biến hào quẻ động. |
| `[CORE-SIM]` | **Mai Hoa Dịch Số Điện Thoại** | `src/domain/sim/index.ts` | Chuẩn hóa số điện thoại, chia thượng/hạ quái, tìm hào động và luận cát hung. |
| `[CORE-BAT-TRACH]` | **Phong Thủy Bát Trạch & La Bàn**| `src/domain/fengshui/index.ts` | Quái mệnh, Đông/Tây Tứ Trạch, 8 hướng cát hung, 24 Sơn Hướng ($0^\circ - 360^\circ$). |
| `[CORE-CALENDAR]` | **Lịch Âm Dương Cổ Truyền** | `src/domain/calendar/index.ts` | Thuật toán chuyển đổi Dương lịch $\leftrightarrow$ Âm lịch, tính tháng nhuận, can chi ngày. |
| `[CORE-SAOHAN]` | **Xem Sao Niên Hạn** | `src/domain/astrology/sao-han.ts`| Cửu Diệu (9 sao), 8 Niên Hạn, Hạn Tam Tai, Kim Lâu, Hoang Ốc. |
| `[CORE-ALMANAC]` | **Thông Thư Vạn Sự (Lịch Ngày Tốt)**| `src/domain/almanac/index.ts` | Trực, Tú (Nhị Thập Bát Tú), Hoàng đạo, Hắc đạo, việc nên làm và kiêng cữ. |

---

## 2. NHÓM THÀNH PHẦN GIAO DIỆN (`[UI-...]`)

### 2.1. Giao diện Bát Tự
| Mã Danh Mục | Tên Thành Phần | Tệp Tin Phụ Trách | Chức Năng |
| :--- | :--- | :--- | :--- |
| `[UI-BAZI-FORM]` | **Khung nhập liệu lập lá số Bát Tự** | `src/components/bazi/BaziForm.tsx` | Form gỗ nâu sang trọng, các ô chọn ngày/tháng/năm/giờ sinh, nút MỞ LÁ SỐ. |
| `[UI-BAZI-DOCUMENT]` | **Tờ bản đồ lá số in ấn / xuất ảnh** | `src/components/bazi/BaziChartDocument.tsx` | Khung văn kiện truyền thống có nền hoa văn watermark in ấn. |
| `[UI-BAZI-GRID]` | **Bảng lưới 4 Trụ (Five Column Grid)**| `src/components/bazi/FourPillarsGrid.tsx` | Bảng hiển thị Dương lịch, Chủ tinh, Bát tự, Tàng can, Phó tinh, Thần sát. |
| `[UI-BAZI-DAIVAN]` | **Khung hiển thị Đại Vận & Lưu Niên**| `src/components/bazi/MajorLuckSection.tsx`<br>`src/components/bazi/AnnualLuckSection.tsx` | Các thập kỷ đại vận và 10 năm lưu niên tương ứng. |
| `[UI-BAZI-COLORS]` | **Màu sắc & Token Ngũ Hành Bát Tự** | `src/components/bazi/BaziChartColors.ts`<br>`src/components/bazi/FiveElementsLegend.tsx` | Bảng màu Kim (xám), Mộc (xanh lá), Thủy (xanh dương), Hỏa (đỏ), Thổ (vàng nâu). |
| `[UI-BAZI-RESULT]` | **Khung bao kết quả & nút xuất PDF** | `src/components/bazi/BaziChartResult.tsx` | Nút lưu lá số vào tài khoản, tải ảnh PNG chất lượng cao, chia sẻ. |

### 2.2. Giao diện Tử Vi & Quẻ Dịch
| Mã Danh Mục | Tên Thành Phần | Tệp Tin Phụ Trách | Chức Năng |
| :--- | :--- | :--- | :--- |
| `[UI-TUVI-CHART]` | **Bàn đồ 12 Cung Tử Vi** | `src/components/ziwei/ZiweiChartResult.tsx` | Ma trận 12 cung (Mệnh, Phụ, Phúc, Điền, Quan, Nô, Thiên Di, Tật, Tài, Tử, Phu, Huynh). |
| `[UI-ICHING-FORM]` | **Biểu mẫu gieo quẻ Lục Hào** | `src/components/iching/LucHaoForm.tsx`<br>`src/components/iching/LucHaoInputTable.tsx` | Bảng gieo 6 hào thủ công hoặc lắc quẻ đồng xu tự động. |
| `[UI-ICHING-DOC]` | **Bản hiển thị Quẻ Thuần & Biến** | `src/components/iching/LucHaoResultDocument.tsx`<br>`src/components/iching/LucHaoResultTable.tsx` | Bảng nạp giáp, lục thân, hào thế ứng, phục thần, lục thú. |
| `[UI-ICHING-VIZ]` | **Đồ họa hào âm dương & quẻ tượng**| `src/components/iching/HexagramLine.tsx`<br>`src/components/iching/HexagramVisualizer.tsx` | Vẽ nét liền (Dương), nét đứt (Âm), đánh dấu hào động (O, X). |
| `[UI-SIM-FORM]` | **Giao diện tra quẻ số điện thoại** | `src/components/sim/SimForm.tsx`<br>`src/components/sim/SimResultView.tsx` | Ô nhập số điện thoại, hiển thị quẻ chủ, quẻ hỗ, quẻ biến. |

### 2.3. Giao diện Phong Thủy & Bố Cục Chung
| Mã Danh Mục | Tên Thành Phần | Tệp Tin Phụ Trách | Chức Năng |
| :--- | :--- | :--- | :--- |
| `[UI-BAT-TRACH]` | **Sơ đồ phối hướng Bát Trạch** | `src/components/fengshui/BatTrachVisualizer.tsx` | Vẽ sơ đồ 8 cung cát hung (Sinh Khí, Diên Niên, Thiên Y, Phục Vị...). |
| `[UI-COMPASS-24]` | **La bàn 24 Sơn Hướng tương tác** | `src/components/fengshui/Compass24Mountains.tsx` | Vòng xoay la bàn đo độ góc $0^\circ - 360^\circ$ xác định hướng nhà. |
| `[UI-LAYOUT-NAV]` | **Thanh Menu Điều Hướng (Navbar)** | `src/components/Navbar.tsx` | Hệ thống menu đa cấp (Bát Tự, Tử Vi, Quẻ Dịch, Phong Thủy, Vật Phẩm...). |
| `[UI-LAYOUT-HEAD]` | **Header & Đăng Nhập / Profile** | `src/components/Header.tsx` | Logo thương hiệu, thanh tìm kiếm nhanh, icon tài khoản người dùng. |
| `[UI-LAYOUT-FOOT]` | **Footer & Thông Tin Liên Hệ** | `src/components/Footer.tsx` | Bản quyền, địa chỉ, liên kết hữu ích và mạng xã hội. |

---

## 3. NHÓM TRANG MÀN HÌNH (`[PAGE-...]`)

### 3.1. Trang Công Cụ Mệnh Lý
| Mã Danh Mục | URL Route | Tệp Tin Trang |
| :--- | :--- | :--- |
| `[PAGE-HOME]` | `/` | `src/app/page.tsx` |
| `[PAGE-BAZI]` | `/la-so-bat-tu` | `src/app/la-so-bat-tu/page.tsx` |
| `[PAGE-BAZI-THOIVAN]` | `/la-so-bat-tu/xem-thoi-van` | `src/app/la-so-bat-tu/xem-thoi-van/page.tsx` |
| `[PAGE-BAZI-REMEDY]` | `/la-so-bat-tu/xem-vat-pham-cai-van` | `src/app/la-so-bat-tu/xem-vat-pham-cai-van/page.tsx` |
| `[PAGE-BAZI-REVERSE]`| `/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru`| `src/app/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru/page.tsx` |
| `[PAGE-TUVI]` | `/la-so-tu-vi` | `src/app/la-so-tu-vi/page.tsx` |
| `[PAGE-TUVI-SAOHAN]` | `/la-so-tu-vi/xem-sao-han` | `src/app/la-so-tu-vi/xem-sao-han/page.tsx` |
| `[PAGE-CALENDAR-VIEW]`| `/la-so-tu-vi/lich-am-duong` | `src/app/la-so-tu-vi/lich-am-duong/page.tsx` |
| `[PAGE-CALENDAR-CONV]`| `/la-so-tu-vi/doi-lich-am-duong` | `src/app/la-so-tu-vi/doi-lich-am-duong/page.tsx` |
| `[PAGE-ALMANAC]` | `/lich-ngay-tot-xau` | `src/app/lich-ngay-tot-xau/page.tsx` |
| `[PAGE-ICHING-INDEX]`| `/que-dich` | `src/app/que-dich/page.tsx` |
| `[PAGE-ICHING-LUCHAO]`| `/que-dich/luc-hao` | `src/app/que-dich/luc-hao/page.tsx` |
| `[PAGE-ICHING-RANDOM]`| `/que-dich/ngau-nhien` | `src/app/que-dich/ngau-nhien/page.tsx` |
| `[PAGE-ICHING-PHONE]`| `/que-dich/so-dien-thoai` | `src/app/que-dich/so-dien-thoai/page.tsx` |
| `[PAGE-FENGSHUI]` | `/phong-thuy/bat-trach` | `src/app/phong-thuy/bat-trach/page.tsx` |
| `[PAGE-COMPASS]` | `/phong-thuy/bat-trach-24-son-huong` | `src/app/phong-thuy/bat-trach-24-son-huong/page.tsx` |
| `[PAGE-ITEMS]` | `/vat-pham` | `src/app/vat-pham/page.tsx` |

### 3.2. Trang Tài Khoản & Quản Trị
| Mã Danh Mục | URL Route | Tệp Tin Trang |
| :--- | :--- | :--- |
| `[PAGE-AUTH-LOGIN]` | `/tai-khoan/dang-nhap` | `src/app/tai-khoan/dang-nhap/page.tsx` |
| `[PAGE-AUTH-REGISTER]`| `/tai-khoan/dang-ky` | `src/app/tai-khoan/dang-ky/page.tsx` |
| `[PAGE-AUTH-FORGOT]`| `/tai-khoan/quen-mat-khau` | `src/app/tai-khoan/quen-mat-khau/page.tsx` |
| `[PAGE-SAVED-CHARTS]`| `/tai-khoan/la-so-da-luu` | `src/app/tai-khoan/la-so-da-luu/page.tsx` |
| `[PAGE-PREMIUM]` | `/tai-khoan-premium` | `src/app/tai-khoan-premium/page.tsx` |
| `[PAGE-ADMIN]` | `/admin` | `src/app/admin/page.tsx` |

---

## 4. NHÓM BACKEND API (`[API-...]`)

| Mã Danh Mục | Phương Thức & URL | Tệp Tin Tuyến | Chức Năng |
| :--- | :--- | :--- | :--- |
| `[API-BAZI-CALC]` | `POST /api/bazi/calculate` | `src/app/api/bazi/calculate/route.ts` | Nhận ngày giờ sinh, trả về JSON toàn bộ cấu trúc lá số Bát Tự. |
| `[API-BAZI-REVERSE]`| `POST /api/bazi/reverse-search`| `src/app/api/bazi/reverse-search/route.ts`| Tìm danh sách các ngày sinh khớp 4 trụ can chi. |
| `[API-TUVI-CALC]` | `POST /api/tuvi/calculate` | `src/app/api/tuvi/calculate/route.ts` | Tính toán tọa độ và an sao 12 cung tử vi. |
| `[API-TUVI-SAOHAN]` | `POST /api/tuvi/saohan` | `src/app/api/tuvi/saohan/route.ts` | Tra cứu sao cửu diệu và niên hạn theo tuổi. |
| `[API-ICHING-CALC]` | `POST /api/iching/calculate` | `src/app/api/iching/calculate/route.ts` | Giải quẻ 6 hào nạp giáp thế ứng. |
| `[API-SIM-CALC]` | `POST /api/sim/calculate` | `src/app/api/sim/calculate/route.ts` | Luận giải cát hung số sim điện thoại. |
| `[API-FENGSHUI-CALC]`| `POST /api/fengshui/battrach`| `src/app/api/fengshui/battrach/route.ts` | Tính quái mệnh và phương vị bát trạch. |
| `[API-AUTH-LOGIN]` | `POST /api/auth/login` | `src/app/api/auth/login/route.ts` | Đăng nhập tài khoản, cấp cookie session. |
| `[API-AUTH-REG]` | `POST /api/auth/register` | `src/app/api/auth/register/route.ts` | Đăng ký thành viên mới, mã hóa mật khẩu. |
| `[API-CHARTS-CRUD]` | `GET/POST /api/charts` | `src/app/api/charts/route.ts` | Lưu lá số vào tài khoản hoặc tải danh sách lá số đã lưu. |
| `[API-PAYMENT-HOOK]`| `POST /api/payments/webhook`| `src/app/api/payments/webhook/route.ts`| Xử lý webhook nâng cấp VIP tự động. |

---

## 5. NHÓM CƠ SỞ DỮ LIỆU & DỊCH VỤ SERVER (`[DB-...]` & `[SRV-...]`)

| Mã Danh Mục | Đối Tượng | Tệp Tin Phụ Trách | Ý Nghĩa |
| :--- | :--- | :--- | :--- |
| `[DB-SCHEMA]` | **Prisma Schema** | `prisma/schema.prisma` | Định nghĩa toàn bộ bảng, quan hệ, kiểu dữ liệu PostgreSQL. |
| `[DB-USER]` | **Bảng User & Session** | `prisma/schema.prisma` | Tài khoản, vai trò (USER/ADMIN), mật khẩu hash, token phiên. |
| `[DB-SAVED-CHART]` | **Bảng SavedChart** | `prisma/schema.prisma` | Lá số đã lưu dạng Native JSONB (chứa toàn bộ kết quả tính toán). |
| `[DB-PAYMENT]` | **Bảng Payment & Event** | `prisma/schema.prisma` | Lịch sử nạp tiền, giao dịch gói cước VIP, webhook log. |
| `[DB-FENGSHUI-ITEM]`| **Bảng FengShuiItem** | `prisma/schema.prisma` | Danh mục vật phẩm phong thủy cải vận theo ngũ hành. |
| `[DB-SEED]` | **Dữ liệu mầm (Seed)** | `prisma/seed.ts` | Khởi tạo tài khoản quản trị mặc định và danh mục vật phẩm ban đầu. |
| `[SRV-AUTH]` | **Xác thực Server** | `src/server/auth.ts` | Quản lý phiên làm việc, mã hóa mật khẩu, kiểm tra phiên đăng nhập. |
| `[SRV-ENTITLEMENT]`| **Phân quyền người dùng** | `src/server/entitlements.ts` | Kiểm tra quyền truy cập tính năng VIP/Pro theo gói đăng ký. |
| `[SRV-DB-CLIENT]` | **Prisma Client Singleton** | `src/server/db.ts` | Khởi tạo kết nối duy nhất an toàn tới Supabase PostgreSQL. |

---

## 6. NHÓM CẤU HÌNH & HỆ THỐNG (`[CFG-...]`)

| Mã Danh Mục | Tên Cấu Hình | Tệp Tin Phụ Trách | Mục Đích |
| :--- | :--- | :--- | :--- |
| `[CFG-ENV]` | **Biến Môi Trường** | `.env` | Chuỗi kết nối Supabase, SESSION_SECRET, cổng chạy. |
| `[CFG-TAILWIND]` | **Cấu hình Giao diện Tailwind**| `tailwind.config.js`<br>`src/app/globals.css` | Bảng màu ngũ hành, container width, phông chữ Lora/Playfair. |
| `[CFG-NEXT]` | **Cấu hình Next.js** | `next.config.mjs` | Thiết lập Next.js 15, tối ưu hình ảnh, redirects. |
| `[CFG-RULES]` | **Quy chuẩn Dự Án** | `AGENTS.md`<br>`GEMINI.md` | Quy tắc phân nhánh Git Flow, chuẩn Conventional Commits, tiêu chuẩn PR. |
| `[CFG-CHANGELOG]` | **Nhật Ký Thay Đổi** | `CHANGELOG.md` | Lịch sử các phiên bản phát hành theo chuẩn Keep a Changelog. |
| `[DOC-METHODOLOGY]` | **Phương Pháp Luận Bát Tự** | `docs/CACH_TINH_DAI_VAN_LUU_NIEN_TIET_KHI.md` | Cẩm nang tính toán chi tiết Tiết Khí, Đại Vận và Lưu Niên. |

---

## 💡 CÁCH BẠN RA LỆNH KHI CẦN CHỈNH SỬA

Khi bạn muốn sửa bất kỳ thứ gì, chỉ cần gõ yêu cầu kèm theo mã trong dấu ngoặc vuông `[...]`.

**Ví dụ thực tế:**
* *"Chỉnh sửa `[UI-BAZI-FORM]` cho đổi màu chữ của ô Họ tên sang màu vàng."*  
  ➡️ *AI sẽ chỉ mở và sửa đúng file `src/components/bazi/BaziForm.tsx`.*
* *"Kiểm tra lại thuật toán an sao Hóa Khoa trong `[CORE-TUVI]`."*  
  ➡️ *AI sẽ chỉ phân tích và chỉnh sửa `src/domain/ziweidoushu/index.ts`.*
* *"Thêm trường link sản phẩm Shopee vào `[DB-FENGSHUI-ITEM]`."*  
  ➡️ *AI sẽ chỉ cập nhật `schema.prisma` cho model FengShuiItem.*
* *"Đổi màu nền trang chủ `[PAGE-HOME]`."*  
  ➡️ *AI sẽ chỉ tác động lên `src/app/page.tsx`.*
