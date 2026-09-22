# Quy Định Dự Án & Nguyên Tắc Làm Việc (Project Rules)

Tài liệu này định nghĩa các quy tắc làm việc, tiêu chuẩn commit/merge, các giai đoạn cột mốc (Checkpoints) và nhật ký thay đổi (Changelog) bắt buộc tuân thủ trong dự án.

---

## 1. Rules (Quy định dự án)

### 1.1. Quy tắc phân nhánh (Branching)
Áp dụng mô hình **Git Flow** cơ bản:
- `main`: Nhánh chứa phiên bản ổn định nhất, sẵn sàng triển khai trên môi trường Production.
- `develop`: Nhánh tích hợp dành cho môi trường thử nghiệm (Staging/Dev).
- Các nhánh công việc nhỏ tuân thủ định dạng:
  - `feature/tên-tính-năng`: Phát triển tính năng mới.
  - `bugfix/mô-tả-lỗi`: Sửa các lỗi phát sinh trong quá trình thử nghiệm.
  - `hotfix/lỗi-nghiêm-trọng`: Sửa lỗi khẩn cấp trực tiếp từ nhánh `main`.

### 1.2. Quy tắc Commit (Commit Convention)
Bắt buộc sử dụng chuẩn **Conventional Commits**. Mọi commit message phải bắt đầu bằng tiền tố phân loại rõ ràng:
- `feat:` Thêm tính năng mới (Ví dụ: `feat: them chuc nang dang nhap`)
- `fix:` Sửa lỗi (Ví dụ: `fix: sua loi tinh gio ty bat tu`)
- `chore:` Công việc bảo trì, cấu hình build/tooling (Ví dụ: `chore: cap nhat prisma migration`)
- `refactor:` Tối ưu, tái cấu trúc mã nguồn nhưng không đổi hành vi (Ví dụ: `refactor: toi uu hoa thuat toan luc hao`)
- `test:` Bổ sung hoặc cập nhật unit/e2e test (Ví dụ: `test: them test case cho luc hao quai`)
- `docs:` Viết hoặc cập nhật tài liệu (Ví dụ: `docs: cap nhat huong dan ket noi supabase`)
- `style:` Thay đổi định dạng, khoảng trắng, không ảnh hưởng logic (Ví dụ: `style: format css tailwind`)

### 1.3. Quy trình Merge (Pull Request & Review)
- **Không đẩy code (push) trực tiếp** lên nhánh `main` hoặc `develop`.
- Bắt buộc tạo **Pull Request (PR)**, phải vượt qua các bài kiểm tra tự động (Linting, Formatting, Typecheck, Test).
- Phải có ít nhất **một thành viên khác review (Approve)** trước khi gộp code.

---

## 2. Checkpoints (Giai đoạn & Cột mốc)

### Phase 1: Khởi tạo (Foundation)
- **Mô tả:** Thiết lập Repository, cấu trúc thư mục chuẩn, cài đặt các bộ linter/formatter, cấu hình môi trường phát triển (Dev) và thiết kế sơ đồ cơ sở dữ liệu cơ bản.
- **Tiêu chí hoàn thành:** Code chạy được trên máy cá nhân mà không báo lỗi cấu hình.
- **Trạng thái:** ✅ Đã hoàn thành (Next.js 15, Prisma 6, Supabase, Tailwind CSS, TypeScript).

### Phase 2: Tính năng cốt lõi (MVP)
- **Mô tả:** Phát triển hệ thống xác thực (Login/Register), xây dựng các API nền tảng và lắp ráp giao diện người dùng (UI) cho các trang quan trọng nhất.
- **Tiêu chí hoàn thành:** Luồng nghiệp vụ chính hoạt động xuyên suốt từ Frontend xuống Backend.
- **Trạng thái:** ✅ Đã hoàn thành (Bát Tự, Tử Vi, Lục Hào, Phong Thủy, Tài khoản).

### Phase 3: Tối ưu & Kiểm thử (QA & Optimization)
- **Mô tả:** Viết Unit Test cho các logic phức tạp, kiểm tra trên các trình duyệt/thiết bị khác nhau (Responsive), tối ưu tốc độ truy vấn và sửa các lỗi phát sinh.
- **Tiêu chí hoàn thành:** Ứng dụng chạy mượt mà, không có lỗi nghiêm trọng (Critical Bugs).
- **Trạng thái:** 🔄 Đang triển khai (Hiện có Vitest & Playwright, tiếp tục tối ưu).

### Phase 4: Triển khai (Deployment)
- **Mô tả:** Cấu hình tên miền, SSL, thiết lập CI/CD đẩy code tự động lên server Production, và cài đặt các công cụ theo dõi lỗi (Monitoring).
- **Tiêu chí hoàn thành:** Dự án có thể truy cập công khai trên Internet.
- **Trạng thái:** ⏳ Kế hoạch tiếp theo.

---

## 3. Changelog (Nhật ký thay đổi)
Sử dụng định dạng dựa trên tiêu chuẩn **"Keep a Changelog"** tại file [`CHANGELOG.md`](./CHANGELOG.md).

---

## 4. Bounded Context & Module Catalog (Nguyên tắc Mã Danh Mục)
- Dự án áp dụng hệ thống mã định danh danh mục tại file [`DANH_MUC_MA.md`](./DANH_MUC_MA.md).
- Khi người dùng gửi yêu cầu kèm theo mã định danh (Ví dụ: `[UI-BAZI-FORM]`, `[CORE-TUVI]`, `[DB-USER]`), Agent **bắt buộc chỉ được can thiệp vào các tệp tin và phạm vi logic tương ứng với mã đó**, tuyệt đối không chỉnh sửa lan sang các module khác ngoài phạm vi được chỉ định.

