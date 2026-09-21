# Complete Application Route Specification

## 1. Public Routes

| Route | Parent Navigation | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/` | Home | Homepage with Bát Tự form and breaking news | Public |
| `/la-so-bat-tu` | Lá số Bát Tự | Bát Tự calculation form and result view | Public |
| `/la-so-bat-tu/xem-thoi-van` | Lá số Bát Tự | Annual and Major Luck fortune inspection | Public / Entitlement |
| `/la-so-bat-tu/xem-vat-pham-cai-van` | Lá số Bát Tự | Curated remedies matching Bát Tự Dụng Thần | Public |
| `/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru`| Lá số Bát Tự | Reverse search date/time matching 4 pillars | Public |
| `/la-so-tu-vi` | Lá số Tử Vi | Tử Vi 12 Palaces & Star generation | Public |
| `/la-so-tu-vi/xem-sao-han` | Lá số Tử Vi | Cửu Diệu, Tam Tai, Kim Lâu, Hoang Ốc | Public |
| `/la-so-tu-vi/lich-am-duong` | Lá số Tử Vi | Interactive Vietnamese Lunar Calendar | Public |
| `/la-so-tu-vi/doi-lich-am-duong` | Lá số Tử Vi | Two-way Solar <-> Lunar date converter | Public |
| `/que-dich` | Quẻ Dịch | I Ching overview and method picker | Public |
| `/que-dich/luc-hao` | Quẻ Dịch | Manual 6-line Lục Hào hexagram casting | Public |
| `/que-dich/ngau-nhien` | Quẻ Dịch | Random 3-coin hexagram casting | Public |
| `/que-dich/so-dien-thoai` | Quẻ Dịch | Telephone number divination | Public |
| `/phong-thuy` | Phong Thủy | Phong Thủy overview | Public |
| `/phong-thuy/bat-trach` | Phong Thủy | Bát Trạch Quái Mệnh & 8 Directions | Public |
| `/phong-thuy/bat-trach-cho-8-cung` | Phong Thủy | Bát Trạch for 8 Palaces | Public |
| `/phong-thuy/bat-trach-24-son-huong` | Phong Thủy | 24 Mountain direction degree calculator | Public |
| `/vat-pham` | Vật Phẩm | Catalog of Feng Shui items & gemstones | Public |
| `/vat-pham/vat-pham-phong-thuy` | Vật Phẩm | Feng Shui remedies & cures | Public |
| `/vat-pham/vat-pham-may-man` | Vật Phẩm | Lucky charms & talismans | Public |
| `/tai-khoan-premium` | Tài khoản Premium | Pricing plans, feature comparison, upgrade | Public |
| `/lien-he` | Liên Hệ | Contact form & cultural advisory info | Public |
| `/tim-kiem` | Search | Global search with query string `?s=...` | Public |
| `/tai-khoan/dang-nhap` | Account | User login | Public (Guests only) |
| `/tai-khoan/dang-ky` | Account | User registration | Public (Guests only) |
| `/tai-khoan/quen-mat-khau` | Account | Forgot & reset password with code | Public (Guests only) |
| `/tai-khoan/xac-thuc-email` | Account | Email verification confirmation | Public |

## 2. Authenticated & Protected Routes

| Route | Minimum Role | Entitlement Required | Description |
| :--- | :--- | :--- | :--- |
| `/tai-khoan/ho-so` | USER | None | Profile settings, password change, data export |
| `/tai-khoan/la-so-da-luu` | USER | None (Quota tiered) | Saved charts dashboard (view, rename, delete) |
| `/tai-khoan/nang-cap` | USER | None | Checkout & subscription upgrade flow |

## 3. Administrative Routes

| Route | Minimum Role | Description |
| :--- | :--- | :--- |
| `/admin` | ADMIN | Metrics dashboard (Users, Subscriptions, Saved Charts) |
| `/admin/users` | ADMIN | User management & role assignment |
| `/admin/subscriptions` | ADMIN | Subscription logs & manual activation |
| `/admin/products` | ADMIN | CRUD catalog for Feng Shui items & remedies |
| `/admin/articles` | ADMIN | Content management for guides & news |
| `/admin/audit-logs` | ADMIN | Immutable administrative audit log |
| `/admin/settings` | ADMIN | Site settings & calculation parameter configs |

## 4. API Endpoints

| Method | Endpoint | Description | Rate Limited |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bazi/calculate` | Compute Four Pillars, Ten Gods, Major Luck | Yes (60/min) |
| `POST` | `/api/bazi/reverse-search` | Reverse lookup matching 4 pillars | Yes (20/min) |
| `POST` | `/api/calendar/convert` | Solar <-> Lunar conversion | Yes (120/min) |
| `POST` | `/api/iching/calculate` | Compute 64 hexagrams & Lục Hào relations | Yes (60/min) |
| `POST` | `/api/tuvi/calculate` | Compute 12 Palaces & Star placements | Yes (60/min) |
| `POST` | `/api/tuvi/saohan` | Compute Cửu Diệu & annual stars | Yes (60/min) |
| `POST` | `/api/fengshui/battrach` | Compute Quái Mệnh & 24 Mountains | Yes (60/min) |
| `POST` | `/api/auth/register` | Register new account | Yes (10/hr) |
| `POST` | `/api/auth/login` | Authenticate & issue session cookie | Yes (15/15min) |
| `POST` | `/api/auth/logout` | Revoke session | No |
| `POST` | `/api/auth/forgot-password` | Generate reset token | Yes (5/hr) |
| `POST` | `/api/auth/reset-password` | Consume reset token & update password | Yes (5/hr) |
| `POST` | `/api/charts/save` | Save calculated chart to database | Auth required |
| `GET` | `/api/charts` | List user saved charts | Auth required |
| `DELETE` | `/api/charts/:id` | Delete saved chart | Auth required |
| `POST` | `/api/payments/create` | Create payment intent | Auth required |
| `POST` | `/api/payments/webhook` | Verified payment provider webhook | Signature verified |
| `GET` | `/api/health` | Healthcheck (HTTP, DB latency, memory) | No |
