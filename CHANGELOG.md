# Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi nhận tại file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án này tuân thủ chuẩn đánh số phiên bản [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Xuất tài liệu cẩm nang phương pháp luận chi tiết cách tính Tiết Khí, Đại Vận và Lưu Niên (`docs/CACH_TINH_DAI_VAN_LUU_NIEN_TIET_KHI.md`).

### Changed
- Cập nhật định danh thương hiệu: Thay thế toàn bộ "Bát Tự Manh Phái" thành "Bát Tự Phúc Sơn".
- Cập nhật khẩu hiệu thương hiệu (Slogan) trên toàn bộ hệ thống: **Lữ Phúc — Gieo Phúc - Gặt Phước**.
- Bổ sung và đồng bộ thông tin liên hệ chính thức trên Header, Footer và trang Liên hệ (`/lien-he`): Email `khotailieuquy2206@gmail.com`, Zalo/Hotline `0374436921`, TikTok `Huyền Học Lữ Phúc`.
- Chuyển đổi toàn bộ phông chữ hệ thống sang **DM Sans** (hỗ trợ đầy đủ bộ ký tự tiếng Việt với đầy đủ độ dày nét).
- Điều chỉnh tông màu nền giao diện website sang sắc ấm nhẹ nhàng (`#f9f5ec` - vàng ngà dịu mắt, hài hòa với thẻ gỗ sẫm màu).
- Cập nhật giao diện khung nhập liệu lập lá số Bát Tự (`BaziForm.tsx`) sang phong cách thẻ gỗ sẫm màu sang trọng với điểm nhấn vàng caramel, các ô chọn bo tròn thanh lịch và nút "MỞ LÁ SỐ" chuẩn theo mẫu thiết kế (`ChatGPT Image Sep 22, 2026, 08_19_14 AM`).

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
