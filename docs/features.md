# Feature Matrix & Functional Parity

Comparison between reference site (nguhanh.net) and our independent implementation.

| Module / Feature | Reference Status | Our Implementation | Enhancement Details |
| :--- | :--- | :--- | :--- |
| **Bát Tự Calculation** | Server HTML snippet | Fully Deterministic Engine + Structured JSON + React Presenter | Supports Lập Xuân boundary, 23:00 Day change, 12 Solar Terms for Month Pillar, and exact Major Luck age |
| **Bát Tự 100-Year Đại Vận** | Supported | Supported | Full 10 Major Luck pillars, each with 10 Annual Luck (Lưu Niên) years |
| **Tìm Ngày Sinh Theo Tứ Trụ** | Supported (server-rendered) | Supported + Paginated Search Engine | Deterministic modular cycle search across 1900–2150, direct links to Nam/Nữ charts |
| **Xem Thời Vận** | Placeholder | Fully Implemented | Combines Major Luck (Đại Vận) and Annual Luck (Lưu Niên) with Ten Gods interaction |
| **Xem Vật Phẩm Cải Vận** | Placeholder | Fully Implemented | Consumes Bát Tự Dụng Thần & Hỷ Thần to suggest Five Element remedies from database |
| **Quẻ Dịch: Lục Hào** | Supported | Supported | Full 64 Hexagrams, Nạp Giáp, Thế/Ứng, Lục Thân, Phục Thần, Lục Thú, Thần Sát |
| **Quẻ Dịch: Ngẫu Nhiên** | Supported | Supported | Cryptographically seeded 3-coin simulation ($1/8, 3/8, 3/8, 1/8$), stable Cast ID |
| **Quẻ Dịch: Số Điện Thoại** | Supported | Supported | Normalized phone digits, Mai Hoa Dịch Số algorithm with Upper/Lower Quái & Hào Động |
| **Lưu Quẻ Dịch** | Broken (Empty URL) | Fully Implemented | Registered users can persist, name, and revisit hexagram readings |
| **Tử Vi Đẩu Số Lá Số** | Placeholder | Fully Implemented | 12 Palaces, Thân Palace, Cục, 14 Chánh Tinh, Vòng Lộc Tồn, Thái Tuế, Tràng Sinh, Tứ Hóa, Tuần/Triệt |
| **Xem Sao Hạn** | Placeholder | Fully Implemented | Cửu Diệu (9 stars), 8 Niên Hạn, Tam Tai, Kim Lâu, Hoang Ốc with cultural mitigation guides |
| **Lịch Âm Dương** | Supported | Supported | Interactive month view, Can Chi for every day, Solar Terms, Leap month markers |
| **Đổi Lịch Âm Dương** | Placeholder | Fully Implemented | Two-way conversion (Solar <-> Lunar) with leap month support and validation |
| **Phong Thủy Bát Trạch** | Placeholder | Fully Implemented | Quái Mệnh, Đông Tứ Mệnh / Tây Tứ Mệnh, 8 Directions (4 Auspicious, 4 Inauspicious) |
| **Bát Trạch Cho 8 Cung** | Placeholder | Fully Implemented | Structural layout for each of the 8 House Palaces |
| **Bát Trạch 24 Sơn Hướng** | Placeholder | Fully Implemented | $0^\circ - 360^\circ$ degree compass mapped to 24 mountains with 8 Trạch orientations |
| **Vật Phẩm Phong Thủy** | Placeholder | Database Catalog | Filterable by element (Kim, Mộc, Thủy, Hỏa, Thổ), category, status, and price |
| **Vật Phẩm May Mắn** | Placeholder | Database Catalog | Charms, talismans, and cultural auspicious items |
| **Authentication** | Basic ASP.NET session | Hardened Session Architecture | Opaque server sessions, SHA-256 token hashing, email verification, password reset |
| **Global Search** | Broken (0 results) | Fully Implemented | Full-text query across articles, items, and divination guides with pagination |
| **Admin Dashboard** | Closed proprietary | Fully Implemented | Users, subscriptions, items, articles, site settings, and immutable audit logs |
| **Premium & Payments** | Static info page | Database Entitlements + Webhook Engine | Provider abstraction (Mock/VNPAY/Stripe), idempotent webhooks, automated expiry |
| **Mobile Responsiveness**| Horizontal scroll bug | First-Class Responsive | Tested at 390px, 768px, 1024px, 1440px with zero horizontal overflow |
| **Chart Export** | Client html2canvas | Canvas PNG + Print Stylesheet | High-resolution canvas rendering + dedicated clean print mode |
