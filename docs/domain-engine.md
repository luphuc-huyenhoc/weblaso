# Domain Engine Formal Specification

Architecture and algorithms for the five pure TypeScript domain engines.

## 1. Calendar Domain (`/src/domain/calendar`)

### 1.1 Solar to Lunar Algorithm
Based on the astronomical calculation of the Moon's phase and the Sun's ecliptic longitude at Indochina standard meridian ($105^\circ\text{E}$ / UTC+7).
- Julian Day Number:
  $$\text{JDN} = \text{int}(365.25(y + 4716)) + \text{int}(30.6001(m + 1)) + d + B - 1524.5$$
- New Moon (Sóc) determination:
  Exact astronomical New Moon instant determines the 1st day of each lunar month.
- Leap Month (Tháng Nhuận) rule:
  A lunar year with 13 New Moons has a leap month. The leap month is the first month that does not contain a Major Solar Term (Trung Khí: Vũ Thủy, Xuân Phân, Cốc Vũ, Tiểu Mãn, Hạ Chí, Đại Thử, Xử Thử, Thu Phân, Sương Giáng, Tiểu Tuyết, Đông Chí, Đại Hàn).

### 1.2 24 Solar Terms (Tiết Khí)
Calculated continuously from the Sun's apparent ecliptic longitude $\lambda_\odot \in [0^\circ, 360^\circ)$:
- $315^\circ$: Lập Xuân (Bắt đầu Tháng Dần)
- $330^\circ$: Vũ Thủy
- $345^\circ$: Kinh Trập (Bắt đầu Tháng Mão)
- $0^\circ$: Xuân Phân
- $15^\circ$: Thanh Minh (Bắt đầu Tháng Thìn)
- $30^\circ$: Cốc Vũ
- $45^\circ$: Lập Hạ (Bắt đầu Tháng Tỵ)
- $60^\circ$: Tiểu Mãn
- $75^\circ$: Mang Chủng (Bắt đầu Tháng Ngọ)
- $90^\circ$: Hạ Chí
- $105^\circ$: Tiểu Thử (Bắt đầu Tháng Mùi)
- $120^\circ$: Đại Thử
- $135^\circ$: Lập Thu (Bắt đầu Tháng Thân)
- $150^\circ$: Xử Thử
- $165^\circ$: Bạch Lộ (Bắt đầu Tháng Dậu)
- $180^\circ$: Thu Phân
- $195^\circ$: Hàn Lộ (Bắt đầu Tháng Tuất)
- $210^\circ$: Sương Giáng
- $225^\circ$: Lập Đông (Bắt đầu Tháng Hợi)
- $240^\circ$: Tiểu Tuyết
- $255^\circ$: Đại Tuyết (Bắt đầu Tháng Tý)
- $270^\circ$: Đông Chí
- $285^\circ$: Tiểu Hàn (Bắt đầu Tháng Sửu)
- $300^\circ$: Đại Hàn

---

## 2. Bát Tự Domain (`/src/domain/bazi`)

### 2.1 Four Pillars (Tứ Trụ)
1. **Niên Trụ (Year Pillar)**:
   - Stem = $(\text{SolarYear} + 6) \pmod{10}$ (0=Giáp .. 9=Quý).
   - Branch = $(\text{SolarYear} + 8) \pmod{12}$ (0=Tý .. 11=Hợi).
   - **Lập Xuân Boundary**: If the birth instant occurs before Lập Xuân, subtract 1 from the astrological year.
2. **Nguyệt Trụ (Month Pillar)**:
   - Branch determined by the 12 Jie (Lập Xuân = Dần, Kinh Trập = Mão, ..., Tiểu Hàn = Sửu).
   - Stem determined by **Ngũ Hổ Độn** using Year Stem:
     - Giáp / Kỷ khởi Bính Dần
     - Ất / Canh khởi Mậu Dần
     - Bính / Tân khởi Canh Dần
     - Đinh / Nhâm khởi Nhâm Dần
     - Mậu / Quý khởi Giáp Dần
3. **Nhật Trụ (Day Pillar)**:
   - Derived from continuous JDN sequence: $\text{DayIndex} = (\text{JDN} + 0.5 + 49) \pmod{60}$.
   - **23:00 Boundary**: If birth time $\ge 23:00$, $\text{DayIndex} = (\text{DayIndex} + 1) \pmod{60}$.
4. **Thời Trụ (Hour Pillar)**:
   - Branch determined by 12 double-hours ($23-1 = \text{Tý}, 1-3 = \text{Sửu}, \dots$).
   - Stem determined by **Ngũ Thử Độn** using Day Stem:
     - Giáp / Kỷ khởi Giáp Tý
     - Ất / Canh khởi Bính Tý
     - Bính / Tân khởi Mậu Tý
     - Đinh / Nhâm khởi Canh Tý
     - Mậu / Quý khởi Nhâm Tý

### 2.2 Hidden Stems (Địa Chi Tàng Can)
- Tý: Quý (100%)
- Sửu: Kỷ (60%), Quý (30%), Tân (10%)
- Dần: Giáp (60%), Bính (30%), Mậu (10%)
- Mão: Ất (100%)
- Thìn: Mậu (60%), Ất (30%), Quý (10%)
- Tỵ: Bính (60%), Mậu (30%), Canh (10%)
- Ngọ: Đinh (70%), Kỷ (30%)
- Mùi: Kỷ (60%), Đinh (30%), Ất (10%)
- Thân: Canh (60%), Nhâm (30%), Mậu (10%)
- Dậu: Tân (100%)
- Tuất: Mậu (60%), Tân (30%), Đinh (10%)
- Hợi: Nhâm (70%), Giáp (30%)

### 2.3 Thập Thần (Ten Gods)
Relationship between Day Master (Nhật Chủ) and target stem:
- Same Element, Same Polarity: **Tỷ Kiên** (Tỷ)
- Same Element, Different Polarity: **Kiếp Tài** (Kiếp)
- Day Master Generates, Same Polarity: **Thực Thần** (Thực)
- Day Master Generates, Different Polarity: **Thương Quan** (Thương)
- Target Generates Day Master, Same Polarity: **Thiên Ấn** (Kiêu)
- Target Generates Day Master, Different Polarity: **Chính Ấn** (Ấn)
- Day Master Controls, Same Polarity: **Thiên Tài** (T.Tài)
- Day Master Controls, Different Polarity: **Chính Tài** (Tài)
- Target Controls Day Master, Same Polarity: **Thất Sát** (Sát)
- Target Controls Day Master, Different Polarity: **Chính Quan** (Quan)

### 2.4 Thần Sát (Deities & Stars)
- **Thiên Ất Quý Nhân**:
  - Giáp, Mậu: Sửu, Mùi.
  - Ất, Kỷ: Tý, Thân.
  - Bính, Đinh: Hợi, Dậu.
  - Canh, Tân: Dần, Ngọ.
  - Nhâm, Quý: Tỵ, Mão.
- **Lộc Thần**: Giáp tại Dần, Ất tại Mão, Bính/Mậu tại Tỵ, Đinh/Kỷ tại Ngọ, Canh tại Thân, Tân tại Dậu, Nhâm tại Hợi, Quý tại Tý.
- **Kình Dương**: Trực tiếp sau Lộc (Giáp tại Mão, Ất tại Thìn, Canh tại Dậu, v.v.).
- **Dịch Mã (Trạch Mã)**: Thân-Tý-Thìn tại Dần; Dần-Ngọ-Tuất tại Thân; Tỵ-Dậu-Sửu tại Hợi; Hợi-Mão-Mùi tại Tỵ.
- **Đào Hoa**: Thân-Tý-Thìn tại Dậu; Dần-Ngọ-Tuất tại Mão; Tỵ-Dậu-Sửu tại Ngọ; Hợi-Mão-Mùi tại Tý.
- **Hoa Cái**: Thân-Tý-Thìn tại Thìn; Dần-Ngọ-Tuất tại Tuất; Tỵ-Dậu-Sửu tại Sửu; Hợi-Mão-Mùi tại Mùi.

---

## 3. Quẻ Dịch & Lục Hào (`/src/domain/iching`)
- 64 Hexagrams mapping: Upper Trigram (1..8), Lower Trigram (1..8).
- Nạp Giáp: Can Chi assigned to each of the 6 lines using Dã Hạc Lục Hào standard.
- Thế & Ứng:
  - Bát Thuần: Thế tại Hào 6, Ứng tại Hào 3.
  - Nhất Thế: Thế tại Hào 1, Ứng tại Hào 4.
  - Nhị Thế: Thế tại Hào 2, Ứng tại Hào 5.
  - Tam Thế: Thế tại Hào 3, Ứng tại Hào 6.
  - Tứ Thế: Thế tại Hào 4, Ứng tại Hào 1.
  - Ngũ Thế: Thế tại Hào 5, Ứng tại Hào 2.
  - Du Hồn: Thế tại Hào 4, Ứng tại Hào 1.
  - Quy Hồn: Thế tại Hào 3, Ứng tại Hào 6.
- Lục Thú assigned according to Day Stem of casting date:
  - Giáp, Ất: Khởi Thanh Long tại Hào sơ.
  - Bính, Đinh: Khởi Chu Tước.
  - Mậu: Khởi Câu Trần.
  - Kỷ: Khởi Đằng Xà.
  - Canh, Tân: Khởi Bạch Hổ.
  - Nhâm, Quý: Khởi Huyền Vũ.

---

## 4. Tử Vi Đẩu Số (`/src/domain/ziweidoushu`)
- An 12 Cung (Mệnh, Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Thê, Huynh) starting from Dần:
  - Cung Mệnh = $\text{Dần} + \text{Tháng Âm} - 1 - (\text{Giờ Sinh} - 1)$.
  - Cung Thân = $\text{Dần} + \text{Tháng Âm} - 1 + (\text{Giờ Sinh} - 1)$.
- Cục: Tìm Can Cung Mệnh theo Ngũ Hổ Độn, đối chiếu Bảng Lục Thập Hoa Giáp để định Ngũ Hành Cục (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục).
- An Tử Vi theo Cục và Ngày sinh âm lịch.
- An 14 Chánh Tinh:
  - Nhóm Tử Vi: Tử Vi -> Thiên Cơ -> (nhảy) -> Thái Dương -> Vũ Khúc -> Thiên Đồng -> (nhảy 2) -> Liêm Trinh.
  - Nhóm Thiên Phủ: Đối xứng qua trục Dần - Thân.
- An Tứ Hóa: Can năm sinh định Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ.

---

## 5. Phong Thủy Bát Trạch (`/src/domain/fengshui`)
- Tính Quái Số Nam / Nữ:
  - Năm sinh $\le 1999$: Tổng các chữ số năm sinh $\pmod 9$.
    - Nam: $10 - \text{Tổng}$. (Nếu = 5 -> Cung Khôn).
    - Nữ: $\text{Tổng} + 5 \pmod 9$. (Nếu = 5 -> Cung Cấn).
  - Năm sinh $\ge 2000$:
    - Nam: $9 - \text{Tổng}$. (Nếu = 5 -> Cung Khôn).
    - Nữ: $6 + \text{Tổng} \pmod 9$. (Nếu = 5 -> Cung Cấn).
- Đông Tứ Mệnh: Chấn (3), Tốn (4), Ly (9), Khảm (1).
- Tây Tứ Mệnh: Càn (6), Khôn (2), Cấn (8), Đoài (7).
- 8 Hướng:
  - Sinh Khí, Thiên Y, Diên Niên, Phục Vị (Tốt).
  - Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại (Xấu).
- 24 Sơn Hướng: Mỗi hướng chính chia làm 3 sơn ($15^\circ$ mỗi sơn), từ $0^\circ$ (Tý giữa) đến $359^\circ$.
