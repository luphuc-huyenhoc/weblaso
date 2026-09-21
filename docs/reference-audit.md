# Nguhanh.net Black-Box Reverse Engineering & Route Audit

Comprehensive audit performed against public endpoints, forms, assets, and behavior of https://nguhanh.net/.

## 1. System Technology Stack (Observed)
- **Application Server**: ASP.NET MVC / .NET Framework on IIS.
- **CSRF Mechanism**: ASP.NET `__RequestVerificationToken` anti-forgery tokens passed via hidden form fields and verified in headers.
- **Frontend Core**: jQuery 3.3.1, jQuery unobtrusive AJAX, Select2 4.x.
- **CSS Architecture**: Colormag Theme layout, FontAwesome 4.4.0, Google Fonts (`Ubuntu`, `Ubuntu Condensed`, `PT Sans`), custom stylesheet `/Templates/css/lasotutru.css`.
- **Export Mechanism**: Client-side rendering via `html2canvas.js` to data URLs and `jquery.printElement.js` with print stylesheets.

---

## 2. Public Route Inventory & Inspection Details

### 2.1 Route: `/` (Homepage / Lá số Bát Tự)
- **HTTP Method**: GET
- **Page Title**: `Nguhanh | Bát Tự Manh Phái`
- **Layout**: Top bar (date, breaking news, social links) -> Header (logo, banner) -> Main Navigation -> Banner 728x90 -> Form Bát Tự -> Footer.
- **Form Selector**: `form[data-selector="lasotutru-form"]`
- **Form Fields**:
  - `Fullname` (text, max 128 chars, required)
  - `Gender` (radio: `true` = Nam, `false` = Nữ, default: `true`)
  - `Day` (select: 1..31)
  - `Month` (select: 1..12)
  - `Year` (select: 1900..2056, default: 1990)
  - `Hour` (select: 0..23)
  - `Minutes` (select: 0..59, default: 0)
  - `FocusYear` (select: 1900..2056, default: 2026)
  - `OneHundredYears` (checkbox: `true`/`false`, default: unchecked)
  - `PageAction` (hidden: 0 = standard, 1 = advanced)
  - `__RequestVerificationToken` (hidden)
- **Submit Action**: Button `MỞ LÁ SỐ` (`#btnCreateLaSoTuTru`)
- **Submission Endpoint**:
  - Standard: `POST /create-bazi-chart`
  - Advanced (or when `OneHundredYears` is checked): `POST /create-bazi-chart-advanced`
- **Payload Format**: `application/x-www-form-urlencoded`
- **Response**: JSON `{ status: 200, data: "<div id='lasotutru' ...>...</div>" }`
- **Client Behavior**: Injects returned HTML snippet into `.result-lasotutru`, runs a progress animation bar, converts `#prtLaSoTuTru` to canvas via `html2canvas`, activates "Tải lá số" (download image) and "In lá số" (print) buttons.

### 2.2 Route: `/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru` (Reverse Bazi Search)
- **HTTP Method**: GET
- **Page Title**: `Nguhanh | Bát Tự Manh Phái`
- **Form Fields**:
  - `ThienCanYear` (select: 1=Giáp .. 10=Quý)
  - `DiaChiYear` (select: 1=Tý .. 12=Hợi)
  - `DiaChiMonth` (select: 1=Dần .. 12=Sửu)
  - `ThienCanDay` (select: 1=Giáp .. 10=Quý)
  - `DiaChiDay` (select: 1=Tý .. 12=Hợi)
  - `DiaChiHour` (select: 1=Tý .. 12=Hợi)
- **Submit Action**: Button `TÌM KIẾM` (`#btnReverseBaziChart`)
- **Submission Endpoint**: `POST /reverse-bazi-chart`
- **Response**: JSON `{ status: 200, data: "<div>...</div>" }` with matching Gregorian dates/times and quick links to open chart for Male/Female.

### 2.3 Route: `/que-dich/luc-hao` (Manual 6-Line Hexagram)
- **HTTP Method**: GET
- **Page Title**: `Nguhanh | Bát Tự Manh Phái`
- **Form Fields**:
  - `Title` (text, "Việc cần xem")
  - `SolarDay`, `SolarMonth`, `SolarYear`, `Hour`, `Minutes`
  - 6 Lines (`LucHaos[0]` to `LucHaos[5]`):
    - `AmDuongType` (select: Âm / Dương)
    - `Dong` (checkbox/hidden: Động / Tĩnh)
- **Submit Endpoint**: `POST /create-ching-hexagram-luchao`
- **Response**: Hexagram details, original and changed hexagrams, Thế/Ứng, Nạp Giáp, Lục Thân, Lục Thú, Thần Sát.

### 2.4 Route: `/que-dich/ngau-nhien` (Random Hexagram)
- **HTTP Method**: GET
- **Page Title**: `Nguhanh | Bát Tự Manh Phái`
- **Form Fields**: `Title`, `SolarDay`, `SolarMonth`, `SolarYear`, `Hour`, `Minutes`.
- **Submit Endpoint**: `POST /create-ching-hexagram-ngaunhien`
- **Response**: Randomly rolled 6 lines, displayed with Hexagram names, judgment, lines, and spirits.

### 2.5 Route: `/que-dich/so-dien-thoai` (Phone Divination)
- **HTTP Method**: GET
- **Page Title**: `Nguhanh | Bát Tự Manh Phái`
- **Form Fields**: `Title`, `Phone`, `SolarDay`, `SolarMonth`, `SolarYear`, `Hour`, `Minutes`.
- **Submit Endpoint**: `POST /create-ching-hexagram-phone`

### 2.6 Route: `/tai-khoan/dang-nhap` (Login)
- **Form Fields**: `UserName`, `Password`, `__RequestVerificationToken`.

### 2.7 Route: `/tai-khoan/dang-ky` (Register)
- **Form Fields**: `FullName`, `UserName`, `Email`, `PhoneNumber`, `Password`, `ConfirmPassword`, `InviteCode`.

### 2.8 Route: `/tai-khoan/quen-mat-khau` (Forgot Password)
- **Form Fields**: `Email`, `Code`, `Password`, `ConfirmPassword`.

---

## 3. Reference Imperfections & Gaps
1. Multiple routes return hardcoded placeholder `<p>Hệ thống đang phát triển, vui lòng quay lại sau!!!</p>`:
   - `/la-so-bat-tu/xem-thoi-van`
   - `/la-so-bat-tu/xem-vat-pham-cai-van`
   - `/la-so-tu-vi/xem-sao-han`
   - `/la-so-tu-vi/doi-lich-am-duong`
   - `/phong-thuy/bat-trach`
   - `/phong-thuy/bat-trach-cho-8-cung`
   - `/phong-thuy/bat-trach-24-son-huong`
   - `/vat-pham/vat-pham-phong-thuy`
   - `/vat-pham/vat-pham-may-man`
2. Search query `/?s=battu` does not query any content.
3. Hexagram save endpoint was left unconfigured (`SAVE_QUEDICH_LUCHAO_PAGE_URL = ''`).
4. Bát Tự chart styling on reference site overflows horizontally on viewports under 768px (`w-1140px` hardcoded class).
5. All chart result generation on reference site uses server-rendered HTML string fragments instead of structured, queryable data.
