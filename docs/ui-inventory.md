# UI & Design System Inventory

Detailed catalog of layout components, color tokens, typography, and responsive rules matching nguhanh.net.

## 1. Color Palette & Ngũ Hành Tokens

| Element / Role | Class Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Kim (Metal)** | `.nguhanh1`, `.gray` | `#708090` / `#5a6268` | Metallic gray/silver used for Can/Chi of Kim element |
| **Mộc (Wood)** | `.nguhanh2`, `.green` | `#28a745` / `#1e7e34` | Green used for Can/Chi of Mộc element |
| **Thủy (Water)** | `.nguhanh3`, `.blue` | `#007bff` / `#0056b3` | Blue used for Can/Chi of Thủy element |
| **Hỏa (Fire)** | `.nguhanh4`, `.red` | `#dc3545` / `#bd2130` | Red used for Can/Chi of Hỏa element |
| **Thổ (Earth)** | `.nguhanh5`, `.brown` | `#856404` / `#a0522d` | Brown/Gold used for Can/Chi of Thổ element |
| **Top Bar Dark** | `.site-header-top` | `#222222` | Header news bar and social icons background |
| **Primary Navy** | `.main-navigation` | `#27303f` / `#1f2937` | Main navigation background bar |
| **Accent Gold** | `.accent-gold` | `#c8860a` | Borders, buttons, banner badges, focus indicators |
| **Table Header** | `.table-dark` | `#2b3036` | Bát Tự & Tử Vi table column headers |
| **Card Background**| `.card-bg` | `#ffffff` | Content container background |

## 2. Typography
- **Headings**: `Ubuntu`, sans-serif (700 bold).
- **Body & Data**: `PT Sans`, sans-serif (400 regular, 700 bold).
- **Numbers & Coordinates**: Monospace or clean tabular numerals (`Ubuntu Condensed`).
- **Vietnamese Diacritics**: Explicit UTF-8 support with normalized composite characters.

## 3. Layout Grid & Breakpoints
- **Container Max Width**: `1140px` centered (`mx-auto`).
- **Breakpoints**:
  - Mobile Small: `< 640px` (Single column, stacked form items, scrollable tables with sticky headers).
  - Tablet: `640px - 1024px` (2-column layout, collapsible mobile drawer menu).
  - Desktop: `> 1024px` (Full multi-level dropdowns, 4-pillar side-by-side grid).

## 4. UI Components Inventory
1. **Header**:
   - Date display (`Thứ Hai, 21 Tháng Chín, 2026`).
   - Breaking news marquee / ticker.
   - Social links (Facebook, Youtube).
   - Global Search trigger.
   - Account dropdown (Login / Register / Profile / Logout).
2. **Navigation Bar**:
   - Home icon.
   - Dropdown menus with hover & click behavior.
   - Mobile hamburger toggle with slide-in drawer.
3. **Forms**:
   - Bát Tự Form (Name, Gender radio, Day/Month/Year/Hour/Minute selects, Focus Year, 100-year checkbox).
   - Reverse Bát Tự Form (6 pillar selectors).
   - Lục Hào Form (6-line Âm/Dương toggles, moving line checkboxes).
   - Auth Forms (Login, Register, Forgot Password with verification code).
4. **Result Cards**:
   - Bát Tự Chart (Header info, Tứ Trụ table, Chủ Tinh, Tàng Ẩn, Phó Tinh, Thần Sát, Đại Vận 10-year timeline, Lưu Niên grid).
   - Hexagram Cards (Upper/Lower trigrams, moving lines, Thế/Ứng, Lục Thú, Spirits).
   - Tử Vi Chart (12 Palaces concentric grid with Stars and Cục).
   - Bát Trạch Compass Grid (8 Directions with Good/Bad indicators and degrees).
5. **Footer**:
   - Cultural disclaimer, contact info, copyright, quick links.
