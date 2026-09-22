# Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi nhận tại file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án này tuân thủ chuẩn đánh số phiên bản [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Cơ chế Offscreen Sandbox Clone xuất ảnh chuẩn mực (`src/lib/chartExport.ts`):**
  - Tách biệt hoàn toàn quá trình kết xuất ảnh khỏi DOM hiển thị thực tế: Nhân bản cây DOM độc lập (`cloneNode`), đưa vào Sandbox Host ẩn với chiều rộng pixel chuẩn (`720px`), loại bỏ toàn bộ ảnh hưởng của CSS `zoom`, `transform` hay co giãn màn hình điện thoại.
  - Khắc phục triệt để lỗi ảnh bị phóng đại cắt cụt (mất cột trụ giờ, mất đại vận 8-10) và lỗi khoảng trắng đáy ảnh khi sao chép hoặc tải về trên mọi thiết bị (máy tính, iPad, điện thoại).
  - Trả về đồng thời `dataUrl` chất lượng cao trong `copyChartImage` giúp các modal xem trước luôn hiển thị ảnh nét nguyên bản.
- **Khôi phục hoàn toàn tính năng Lập Quẻ Dịch Lục Hào (`[PAGE-ICHING-LUCHAO]`):**
  - Sửa lỗi định tuyến API gọi sai đường dẫn: Chuyển sang kết nối endpoint chuẩn `/api/iching/calculate` kèm tham số `method: 'Lục Hào'`, khôi phục việc gieo và an quẻ tức thì.
- **Tinh chỉnh tỷ lệ Logo Lữ Phúc hài hòa toàn hệ thống:**
  - Giảm kích thước logo trên thanh điều hướng Header xuống `w-10 h-10`, tạo vẻ thanh lịch sang trọng.
  - Tối ưu huy hiệu logo trên đầu lá số Bát Tự xuống `w-9 h-9` cùng phông chữ thương hiệu cân xứng, không còn bị quá khổ.
  - Tinh chỉnh logo tại trung tâm Thiên Bàn Tử Vi và chân trang Footer xuống `w-8 h-8` hài hòa và nhã nhặn.
- **Thay logo chính thức Lữ Phúc (`public/logo.png`):**
  - Cập nhật logo mới từ thư mục `Ảnh thay/Logo.png` ("LP - Lữ Phúc - Gieo Phúc - Gặt Phước").
  - Đồng bộ hiển thị logo trên Header, Footer và đầu lá số Bát Tự (`BaziChartHeader.tsx`).
- **Quy chuẩn kích thước và thanh công cụ lá số chuẩn hocvienlyso.org:**
  - `[PAGE-BAZI]`: Chuẩn hóa kích thước lá số Bát Tự xuất bản thành 1440 x 2000 px (tương ứng base 720 x 1000 px ở 2x DPI, tỷ lệ 18:25). Đồng bộ thanh công cụ chuẩn (Phóng to, Sao chép ảnh, Tải ảnh, In lá số, Lưu lá số, Đọc luận giải).
  - `[PAGE-TUVI]`, `[UI-TUVI-CHART]`: Chuẩn hóa kích thước lá số Tử Vi xuất bản thành 1440 x 2000 px (base 720 x 1000 px ở 2x DPI). Bổ sung đầy đủ hệ thống sao phong phú (14 Chánh Tinh có độ sáng miếu/vượng/đắc/hãm, Tứ Hóa, Lục Cát, Lục Sát, Thái Tuế, Bác Sĩ, Tràng Sinh, Mệnh Chủ, Thân Chủ, Mệnh Quái, Bát Tự 4 trụ thu nhỏ tại Thiên Bàn, Tuần & Triệt, bảng màu ngũ hành).
  - `[PAGE-ICHING-LUCHAO]`, `[UI-ICHING-RESULT]`: Chuẩn hóa kích thước quẻ dịch Lục Hào xuất bản thành 1440 x 1440 px (vuông 1:1, base 720 x 720 px ở 2x DPI). Đồng bộ thanh công cụ chuẩn (Đọc luận giải quẻ này, Phóng to, Sao chép ảnh, Tải ảnh, In quẻ, Lưu quẻ).
- **Bộ công cụ xuất ảnh chuẩn hóa đa nền tảng (`src/lib/chartExport.ts`):**
  - Xây dựng module `captureChartImage`: Trước khi chụp tự động reset tạm thời `zoom` của CSS về 1 và cố định kích thước pixel chuẩn nhằm khắc phục hoàn toàn hiện tượng ảnh bị cắt xén (clipping), mờ nhòe hoặc lệch tỉ lệ do co giãn màn hình di động. Cố định màu nền trắng đồng nhất `#ffffff`, loại bỏ lỗi nền đen hoặc trong suốt.
  - Tích hợp `copyChartImage` và `downloadChartImage`: Hỗ trợ Clipboard API trên máy tính, Web Share API trên điện thoại và modal xem trước nét cao cho thao tác chạm giữ sao chép / lưu ảnh.
- **Đổi mới bộ nhận diện thương hiệu & Logo hoàng kim Bát Tự Lữ Phúc:**
  - Chuyển đổi tên thương hiệu chính thức từ "Bát Tự Phúc Sơn" $\rightarrow$ **"Bát Tự Lữ Phúc"** trên toàn hệ thống (Header, Footer, Bát Tự, Tử Vi, Quẻ Dịch, Phong Thủy, Liên Hệ, Metadata).
  - Thiết kế huy hiệu Logo hoàng kim đế vương với đĩa Thái Cực Bát Quái, chữ viết tắt **LP** và danh hiệu **BÁT TỰ LỮ PHÚC** tinh xảo, uy nghiêm.
- **Quy chuẩn kích thước lá số Bát Tự 750 x 1056 px & Khắc phục sao chép trên điện thoại (`[UI-BAZI-DOCUMENT]`):**
  - Căn chỉnh chiều rộng tiêu chuẩn lá số Bát Tự là **750px** và chiều cao tối thiểu **1056px** tạo dáng thuôn dài trang nhã chuẩn tỷ lệ vàng.
  - Tự động co giãn (auto-scale zoom) theo chiều rộng màn hình thiết bị di động giúp lá số luôn hiển thị trọn vẹn 100% không bị tràn mép hay vỡ khung.
  - Khắc phục triệt để lỗi không sao chép được ảnh trên điện thoại: Tích hợp Web Share API cho phép 1 chạm chia sẻ/lưu ảnh trực tiếp vào Thư viện ảnh/Zalo/Messenger; bổ sung nút và cửa sổ xem trước **"📱 Xem ảnh lá số"** với hướng dẫn nhấn giữ 1-2s để sao chép hình ảnh.
- **Tối ưu hiển thị và sao chép Quẻ Dịch trên điện thoại (`[UI-ICHING-RESULT]`):**
  - Tự động co giãn kích thước quẻ dịch Lục Hào và Quẻ Dịch Ngẫu Nhiên vừa khít màn hình di động, không bị tràn lề ngang hay mất quẻ biến.
  - Hỗ trợ thanh chuyển đổi chế độ xem linh hoạt "Thu nhỏ vừa màn hình" và "Phóng to 100% (Vuốt ngang)".
  - Tích hợp Web Share API và cửa sổ xem trước **"📱 Xem ảnh quẻ"** giúp người dùng điện thoại nhấn giữ sao chép hoặc lưu vào máy dễ dàng.
- **Động cơ Huyền Không Phi Tinh & Giao diện Cửu Cung 24 Sơn Hướng (`[UI-COMPASS-24]`, `[PAGE-COMPASS]`):**
  - Xây dựng động cơ `flyingStars.ts` hoàn chỉnh: Tính toán Tinh bàn Cửu Cung 3x3 theo Lạc Thư cho Tam Nguyên Cửu Vận (từ Vận 1 đến Vận 9, đặc biệt là Hạ Nguyên Vận 9: 2024 - 2043), 24 Sơn Hướng, Tam Nguyên Long (Địa, Thiên, Nhân), phi tinh Vận bàn, Sơn bàn, Hướng bàn, Lưu Niên tinh, Nguyệt tinh.
  - Nhận diện tự động 4 đại cách cục kiến trúc kinh điển: Vượng Sơn Vượng Hướng (Đinh tài lưỡng đắc), Song Tinh Hội Hướng (Vượng tài tổn đinh), Song Tinh Hội Tọa (Vượng đinh tổn tài), Thượng Sơn Hạ Thủy (Tổn đinh phá tài), cùng cách cục Âm Dương Hợp Thập.
  - Xây dựng bảng hiển thị Cửu Cung trực quan, sinh động (`FlyingStarsTable.tsx`) tích hợp vào La Bàn 24 Sơn Hướng khi người dùng xoay hoặc chọn độ số, hiển thị chi tiết Sơn tinh, Hướng tinh, Vận tinh, Niên tinh cùng khuyến nghị kích hoạt cung vị.
- **Nâng cấp Hệ Thống Sao & Tối ưu Giao Diện Lá Số Tử Vi (`[CORE-ZIWEI]`, `[UI-ZIWEI-RESULT]`):**
  - Bổ sung tính toán đắc hãm (Miếu, Vượng, Đắc, Hãm) cho 14 Chính Tinh.
  - Bổ sung an Lục Cát Tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt), Lục Sát Tinh (Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh), Vòng Lộc Tồn / Bác Sĩ (12 sao thuận nghịch), Vòng Thái Tuế (12 sao), Vòng Tràng Sinh (12 sao), Tuần Trung & Triệt Lộ Không Vong, các Phụ tinh quan trọng (Thiên Mã, Đào Hoa, Hồng Loan, Thiên Hỷ, Thiên Khốc, Thiên Hư, Long Trì, Phượng Các, Giải Thần).
  - Tinh chỉnh giao diện 12 cung Tử Vi: Phân màu trực quan theo tính chất sao (Chính tinh đỏ đậm đắc hãm, Tứ Hóa tím nổi bật, Cát tinh xanh dương, Sát tinh nâu đỏ, Vòng sao xám thanh nhã).
  - Tự động co giãn (auto-scale) vừa vặn màn hình điện thoại di động, tích hợp nút "📱 Xem ảnh lá số", hỗ trợ Web Share API và sao chép ảnh trên di động.
- **Bổ sung Cẩm Nang Kiến Thức Phong Thủy Chuyên Sâu (`src/app/phong-thuy/page.tsx`):**
  - Mở rộng trang Hub Phong Thủy với cẩm nang tri thức thực chiến:
    1. Bát Trạch Minh Cảnh & 8 Hướng Cát Hung (Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại).
    2. Huyền Không Phi Tinh & Hạ Nguyên Vận 9 (2024 - 2043) cùng 4 đại cách cục kiến trúc.
    3. Phân Kim 24 Sơn Hướng & Bí Quyết Tránh Tuyến Đại Không Vong, Tiểu Không Vong.
    4. Bố cục "Tam Yếu Dương Trạch": Môn (Cửa chính), Táo (Bếp "Tọa Hung Hướng Cát"), Chủ (Phòng ngủ gia chủ).
- **Hỗ trợ sao chép hình ảnh trực tiếp (Copy Image) cho Lá số và Quẻ Dịch (`[UI-BAZI-DOCUMENT]`, `[UI-ICHING-RESULT]`, `[UI-ZIWEI-RESULT]`):**
  - Tích hợp lớp phủ ảnh trong suốt chuẩn nét cao (2x DPI) lên toàn bộ vùng lá số Bát Tự, Quẻ Dịch Lục Hào và Lá số Tử Vi, cho phép người dùng nhấp chuột phải trực tiếp để hiện menu ngữ cảnh trình duyệt: **"Sao chép hình ảnh"** (Copy image), **"Lưu hình ảnh thành..."** (Save image as...), **"Mở hình ảnh trong thẻ mới"**.
  - Hỗ trợ đầy đủ trên thiết bị di động (iOS Safari, Android Chrome): Nhấn giữ (long-press) vào lá số hoặc quẻ dịch để chọn **"Sao chép"** hoặc **"Lưu vào Ảnh"**.
  - Bổ sung nút bấm 1 chạm **"📋 Sao chép ảnh"** / **"📋 Sao chép ảnh quẻ"** trên thanh công cụ điều khiển của Bát Tự, Quẻ Dịch Lục Hào, Quẻ Ngẫu Nhiên và Tử Vi, tự động ghi trực tiếp ảnh PNG vào khay nhớ tạm (Clipboard) kèm thông báo `"✓ Đã sao chép ảnh!"`.
  - Bổ sung dòng gợi ý hướng dẫn người dùng nhấp chuột phải hoặc nhấn giữ để sao chép gửi nhanh qua Zalo, Messenger.
- Xuất tài liệu cẩm nang phương pháp luận chi tiết cách tính Tiết Khí, Đại Vận và Lưu Niên (`docs/CACH_TINH_DAI_VAN_LUU_NIEN_TIET_KHI.md`).

### Changed
- Cập nhật định danh thương hiệu: Thay thế toàn bộ "Bát Tự Manh Phái" và "Bát Tự Phúc Sơn" thành **"Bát Tự Lữ Phúc"**.
- Cập nhật khẩu hiệu thương hiệu (Slogan) trên toàn bộ hệ thống: **Lữ Phúc — Gieo Phúc - Gặt Phước**.
- Bổ sung và đồng bộ thông tin liên hệ chính thức trên Header, Footer và trang Liên hệ (`/lien-he`): Zalo/Hotline `0374436921`, TikTok `Huyền Học Lữ Phúc`.
- Chuyển đổi toàn bộ phông chữ hệ thống sang **DM Sans** (hỗ trợ đầy đủ bộ ký tự tiếng Việt với đầy đủ độ dày nét).
- Điều chỉnh tông màu nền giao diện website sang sắc ấm nhẹ nhàng (`#f9f5ec` - vàng ngà dịu mắt, hài hòa với thẻ gỗ sẫm màu).
- Cập nhật giao diện khung nhập liệu lập lá số Bát Tự (`BaziForm.tsx`) sang phong cách thẻ gỗ sẫm màu sang trọng với điểm nhấn vàng caramel, các ô chọn bo tròn thanh lịch và nút "MỞ LÁ SỐ" chuẩn theo mẫu thiết kế (`ChatGPT Image Sep 22, 2026, 08_19_14 AM`).

### Fixed
- **Khắc phục triệt để lỗi tải ảnh và sao chép ảnh trên cả máy tính và điện thoại (`src/lib/chartExport.ts`):**
  - Khắc phục lỗi ảnh xuất ra bị cắt cụt (clipping) do thuộc tính CSS co giãn responsive trên điện thoại bằng cơ chế tách biệt và khôi phục transform/zoom tạm thời khi render ảnh.
  - Sửa lỗi nền ảnh bị tối hoặc trong suốt, ép buộc màu nền trắng `#ffffff` chuẩn xác.
  - Tối ưu kích thước file ảnh tải về và khay nhớ tạm (Clipboard), khắc phục tình trạng lỗi bộ nhớ hoặc không tải được ảnh trên trình duyệt Safari/Chrome mobile.
- **Tối ưu hiển thị lá số Bát Tự trên điện thoại di động (`[UI-BAZI-DOCUMENT]`):**
  - Tự động co giãn tỷ lệ (auto-scale) vừa vặn 100% chiều rộng màn hình thiết bị di động, khắc phục triệt để hiện tượng bị tràn lề ngang, cắt mất 2 cột Trụ Ngày/Trụ Giờ và 5 cột Đại Vận.
  - Thêm thanh điều khiển chế độ xem: Chuyển đổi linh hoạt giữa "Thu nhỏ vừa màn hình" và "Phóng to 100% (Vuốt ngang)".
  - Tối ưu kích thước 5 ô điểm lực ngũ hành và căn chỉnh tiêu đề luận giải để không bị lệch bố cục trên màn hình nhỏ.
  - Đảm bảo khi xuất ảnh PNG hoặc in ấn vẫn tự động giữ nguyên độ phân giải sắc nét chuẩn ban đầu.
- **Tinh chỉnh tỷ lệ chữ và số trong từng ô lá số Bát Tự (`[UI-BAZI-DOCUMENT]`):**
  - Giảm cỡ chữ và số xuống khoảng 1/2 cho hài hòa với từng ô (4 Trụ Can Chi từ 36px xuống ~18-20px, Đại Vận và Lưu Niên từ 14-18px xuống 9-11px).
  - Khắc phục hoàn toàn hiện tượng chữ và số bị tràn mép, dính sát hoặc đè lẫn nhau ở các cột hẹp của 10 bước Đại Vận và Lưu Niên.
  - Cân chỉnh kích cỡ huy hiệu logo, tiêu đề và thông tin cá nhân ở phần đầu lá số trang nhã, cân đối.
- **Làm dịu hình nền watermark lá số Bát Tự (`[UI-BAZI-DOCUMENT]`):**
  - Giảm độ đậm của hình nền watermark và loại bỏ lớp background-image trùng lặp ở khung chứa, tạo độ mờ nhẹ dịu mắt giúp chữ và số nổi bật, thanh nhã.
- **Cập nhật kênh liên hệ (`[UI-LAYOUT-FOOT]`, `src/app/lien-he`):**
  - Xóa bỏ địa chỉ email khỏi phần Kênh Liên Hệ ở Footer và trang Liên Hệ (`/lien-he`), duy trì hai kênh chính thức là Zalo / Hotline (0374436921) và TikTok (Huyền Học Lữ Phúc).

### Planned
- Hoàn thiện toàn diện độ phủ Unit Test cho các trường hợp biên của Lục Hào và Tử Vi.
- Cấu hình quy trình CI/CD tự động kiểm tra Lint và Unit Test trên GitHub Actions trước khi merge.
- Thiết lập quy trình triển khai lên hạ tầng Production (Vercel / Docker VPS).

---

## [1.0.0] - 2026-09-21

### Added
- **Khởi tạo dự án (Phase 1 Foundation):**
  - Khung ứng dụng Next.js 15 với React 19, TypeScript và Tailwind CSS.
  - Cấu hình Prisma ORM 6 kết nối PostgreSQL (hỗ trợ Supabase qua Session Pooler cổng 5432).
  - Tích hợp công cụ kiểm thử Vitest và Playwright E2E.
  - Kịch bản nạp dữ liệu mẫu ban đầu (`prisma/seed.ts`).
- **Tính năng cốt lõi (Phase 2 MVP):**
  - **Lá số Bát Tự (Four Pillars):** Động cơ tính toán can chi, tàng can, thập thần, thân vượng nhược, đại vận 100 năm, lưu niên và tìm ngày sinh theo tứ trụ.
  - **Lá số Tử Vi:** An 12 cung mệnh, 14 chính tinh, tứ hóa, vòng tràng sinh, sao hạn Cửu Diệu, Tam Tai, Kim Lâu, Hoang Ốc.
  - **Quẻ Dịch:** Gieo quẻ Lục Hào thủ công, gieo quẻ 3 đồng xu ngẫu nhiên, lập quẻ theo số điện thoại (Mai Hoa Dịch Số).
  - **Phong Thủy Bát Trạch:** Tính quái mệnh, Đông/Tây Tứ Trạch, 8 hướng cát hung, phân tích 8 cung và la bàn 24 sơn hướng.
  - **Vật phẩm & Cải vận:** Danh mục vật phẩm phong thủy phân loại theo ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ).
  - **Hệ thống xác thực & tài khoản:** Đăng ký, đăng nhập, bảo vệ phiên làm việc (Session) bằng thuật toán mã hóa SHA-256 / JOSE.
  - **Quản trị (Admin):** Bảng thống kê hệ thống, quản lý người dùng, bài viết và nhật ký kiểm toán (Audit Logs).

### Fixed
- Sửa lỗi định dạng chuỗi kết nối `DATABASE_URL` trong `.env` khi kết nối tới Supabase qua IPv4/Session Pooler.
- Mở khóa chính sách thực thi script của PowerShell trên Windows (`Set-ExecutionPolicy RemoteSigned`).
- Đồng bộ và khắc phục các gói nhị phân tương thích hệ điều hành Windows trong `node_modules`.

### Security
- Mã hóa mật khẩu người dùng bằng `bcryptjs`.
- Bảo vệ các biến môi trường nhạy cảm trong `.env`, không commit credentials lên repository.
