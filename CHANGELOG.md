# Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi nhận tại file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án này tuân thủ chuẩn đánh số phiên bản [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Hỗ trợ sao chép hình ảnh trực tiếp (Copy Image) cho Lá số và Quẻ Dịch (`[UI-BAZI-DOCUMENT]`, `[UI-ICHING-RESULT]`, `[UI-ZIWEI-RESULT]`):**
  - Tích hợp lớp phủ ảnh trong suốt chuẩn nét cao (2x DPI) lên toàn bộ vùng lá số Bát Tự, Quẻ Dịch Lục Hào và Lá số Tử Vi, cho phép người dùng nhấp chuột phải trực tiếp để hiện menu ngữ cảnh trình duyệt: **"Sao chép hình ảnh"** (Copy image), **"Lưu hình ảnh thành..."** (Save image as...), **"Mở hình ảnh trong thẻ mới"**.
  - Hỗ trợ đầy đủ trên thiết bị di động (iOS Safari, Android Chrome): Nhấn giữ (long-press) vào lá số hoặc quẻ dịch để chọn **"Sao chép"** hoặc **"Lưu vào Ảnh"**.
  - Bổ sung nút bấm 1 chạm **"📋 Sao chép ảnh"** / **"📋 Sao chép ảnh quẻ"** trên thanh công cụ điều khiển của Bát Tự, Quẻ Dịch Lục Hào, Quẻ Ngẫu Nhiên và Tử Vi, tự động ghi trực tiếp ảnh PNG vào khay nhớ tạm (Clipboard) kèm thông báo `"✓ Đã sao chép ảnh!"`.
  - Bổ sung dòng gợi ý hướng dẫn người dùng nhấp chuột phải hoặc nhấn giữ để sao chép gửi nhanh qua Zalo, Messenger.
- Xuất tài liệu cẩm nang phương pháp luận chi tiết cách tính Tiết Khí, Đại Vận và Lưu Niên (`docs/CACH_TINH_DAI_VAN_LUU_NIEN_TIET_KHI.md`).

### Changed
- Cập nhật định danh thương hiệu: Thay thế toàn bộ "Bát Tự Manh Phái" thành "Bát Tự Phúc Sơn".
- Cập nhật khẩu hiệu thương hiệu (Slogan) trên toàn bộ hệ thống: **Lữ Phúc — Gieo Phúc - Gặt Phước**.
- Bổ sung và đồng bộ thông tin liên hệ chính thức trên Header, Footer và trang Liên hệ (`/lien-he`): Email `khotailieuquy2206@gmail.com`, Zalo/Hotline `0374436921`, TikTok `Huyền Học Lữ Phúc`.
- Chuyển đổi toàn bộ phông chữ hệ thống sang **DM Sans** (hỗ trợ đầy đủ bộ ký tự tiếng Việt với đầy đủ độ dày nét).
- Điều chỉnh tông màu nền giao diện website sang sắc ấm nhẹ nhàng (`#f9f5ec` - vàng ngà dịu mắt, hài hòa với thẻ gỗ sẫm màu).
- Cập nhật giao diện khung nhập liệu lập lá số Bát Tự (`BaziForm.tsx`) sang phong cách thẻ gỗ sẫm màu sang trọng với điểm nhấn vàng caramel, các ô chọn bo tròn thanh lịch và nút "MỞ LÁ SỐ" chuẩn theo mẫu thiết kế (`ChatGPT Image Sep 22, 2026, 08_19_14 AM`).

### Fixed
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
