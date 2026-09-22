# Quy Định Dự Án & Nguyên Tắc Làm Việc (Project Rules)

Tài liệu này định nghĩa các quy tắc làm việc, tiêu chuẩn commit/merge, các giai đoạn cột mốc (Checkpoints) và nhật ký thay đổi (Changelog) bắt buộc tuân thủ trong dự án.

---

## 1. Rules (Quy định dự án)

### 1.1. Quy tắc phân nhánh (Branching)
Áp dụng mô hình **Git Flow** cơ bản:
- `main`: Nhánh chứa phiên bản ổn định nhất, sẵn sàng triển khai trên môi trường Production.
- `develop`: Nhánh tích hợp dành cho môi trường thử nghiệm (Staging/Dev).
- Các nhánh công việc nhỏ phân tách theo mục đích:
  - `feature/tên-tính-năng`: Phát triển tính năng mới (ví dụ: `feature/auth-google`, `feature/tuvi-pdf-export`).
  - `bugfix/mô-tả-lỗi`: Sửa các lỗi phát sinh trong quá trình thử nghiệm (ví dụ: `bugfix/bazi-leap-month`).
  - `hotfix/lỗi-nghiêm-trọng`: Sửa lỗi khẩn cấp trực tiếp từ nhánh `main` (ví dụ: `hotfix/payment-webhook-timeout`).

### 1.2. Quy tắc Commit (Commit Convention)
Bắt buộc sử dụng chuẩn **Conventional Commits**. Mọi commit message phải bắt đầu bằng tiền tố phân loại rõ ràng:
- `feat:` Thêm tính năng mới (Ví dụ: `feat: them chuc nang dang nhap bang email`)
- `fix:` Sửa lỗi (Ví dụ: `fix: sua loi tinh gio ty bat tu sau 23h`)
- `chore:` Công việc bảo trì, cấu hình build/tooling (Ví dụ: `chore: cap nhat prisma migration`)
- `refactor:` Tối ưu, tái cấu trúc mã nguồn nhưng không đổi hành vi (Ví dụ: `refactor: tach logic an sao tu vi ra module rieng`)
- `test:` Bổ sung hoặc cập nhật unit/e2e test (Ví dụ: `test: them test case cho luc hao quai`)
- `docs:` Viết hoặc cập nhật tài liệu (Ví dụ: `docs: cap nhat huong dan ket noi supabase`)
- `style:` Thay đổi định dạng, khoảng trắng, không ảnh hưởng logic (Ví dụ: `style: format css tailwind`)

### 1.3. Quy trình Merge (Pull Request & Review)
- **Tuyệt đối không đẩy code (push) trực tiếp** lên nhánh `main` hoặc `develop`.
- Bắt buộc tạo **Pull Request (PR)** từ nhánh nhánh con vào `develop` hoặc từ `develop` vào `main`.
- **Điều kiện gộp code (Merge Criteria):**
  1. Vượt qua toàn bộ kiểm tra tự động (CI): Linting (`npm run lint`), Typecheck (`npm run typecheck`), Unit test (`npm run test`).
  2. Phải có ít nhất **01 thành viên khác review và Approve** trước khi gộp code.

---

## 2. Checkpoints (Giai đoạn & Cột mốc)

### Phase 1: Khởi tạo (Foundation)
- **Nội dung:** Thiết lập Repository, cấu trúc thư mục chuẩn, cài đặt linter/formatter, cấu hình môi trường phát triển (Dev) và thiết kế sơ đồ cơ sở dữ liệu cơ bản (Prisma Schema).
- **Tiêu chí hoàn thành:** Code chạy được trên máy cá nhân mà không báo lỗi cấu hình (`npm run dev` chạy thành công, kết nối DB thông suốt).
- **Trạng thái:** ✅ Đã hoàn thành (Next.js 15, Prisma 6, Supabase, Tailwind CSS, TypeScript).

### Phase 2: Tính năng cốt lõi (MVP)
- **Nội dung:** Phát triển hệ thống xác thực (Login/Register/Session), xây dựng các API nền tảng (Bát Tự, Tử Vi, Dịch Học, Bát Trạch) và lắp ráp giao diện người dùng (UI) cho các trang quan trọng nhất.
- **Tiêu chí hoàn thành:** Luồng nghiệp vụ chính hoạt động xuyên suốt từ Frontend xuống Backend (Tính toán và kết xuất lá số đầy đủ, lưu trữ dữ liệu).
- **Trạng thái:** ✅ Đã hoàn thành (Giao diện và API các bộ môn Bát Tự, Tử Vi, Lục Hào, Phong Thủy, Tài khoản đã sẵn sàng).

### Phase 3: Tối ưu & Kiểm thử (QA & Optimization)
- **Nội dung:** Viết Unit Test cho các logic phức tạp, kiểm tra trên các trình duyệt/thiết bị khác nhau (Responsive), tối ưu tốc độ truy vấn, cache và sửa các lỗi phát sinh.
- **Tiêu chí hoàn thành:** Ứng dụng chạy mượt mà, không có lỗi nghiêm trọng (Critical Bugs), 100% test case thuật toán then chốt vượt qua.
- **Trạng thái:** 🔄 Đang triển khai (Hiện đã có bộ test Vitest & Playwright, tiếp tục hoàn thiện độ phủ).

### Phase 4: Triển khai (Deployment)
- **Nội dung:** Cấu hình tên miền, SSL, thiết lập CI/CD đẩy code tự động lên server Production (Vercel / Docker VPS), và cài đặt các công cụ theo dõi lỗi (Monitoring / Sentry).
- **Tiêu chí hoàn thành:** Dự án có thể truy cập công khai và ổn định trên Internet.
- **Trạng thái:** ⏳ Kế hoạch tiếp theo.

---

## 3. Changelog (Nhật ký thay đổi)
- Mọi thay đổi đáng chú ý của dự án phải được ghi nhận tại file [`CHANGELOG.md`](./CHANGELOG.md).
- Định dạng tuân thủ nghiêm ngặt chuẩn **[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)** với các nhóm mục:
  - `Added`: Tính năng mới được thêm vào.
  - `Changed`: Thay đổi trong các chức năng hiện có.
  - `Deprecated`: Các tính năng sắp bị loại bỏ.
  - `Removed`: Các tính năng đã bị gỡ bỏ.
  - `Fixed`: Bất kỳ lỗi nào đã được sửa.
  - `Security`: Các cải thiện về bảo mật.

---

## 4. Bounded Context & Module Catalog (Nguyên tắc Mã Danh Mục)
- Dự án áp dụng hệ thống mã định danh danh mục tại file [`DANH_MUC_MA.md`](./DANH_MUC_MA.md).
- Khi người dùng gửi yêu cầu kèm theo mã định danh (Ví dụ: `[UI-BAZI-FORM]`, `[CORE-TUVI]`, `[DB-USER]`), Agent **bắt buộc chỉ được can thiệp vào các tệp tin và phạm vi logic tương ứng với mã đó**, tuyệt đối không chỉnh sửa lan sang các module khác ngoài phạm vi được chỉ định.

