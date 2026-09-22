# CẨM NANG TOÀN TẬP: CÁCH TÍNH TIẾT KHÍ, ĐẠI VẬN VÀ LƯU NIÊN TRONG BÁT TỰ

Tài liệu này trình bày chi tiết và có hệ thống toàn bộ cơ sở thiên văn, toán học và phương pháp luận Tử Bình Manh Phái dùng để tính toán **Tiết Khí (Solar Terms)**, **Đại Vận (Major Luck Decades)** và **Lưu Niên (Annual Luck Years)** được triển khai trong hệ thống phần mềm Bát Tự **Lữ Phúc**.

---

## MỤC LỤC
1. [Phần I: Bản Chất & Phương Pháp Tính Tiết Khí](#phan-i-ban-chat--phuong-phap-tinh-tiet-khi)
   - [1.1. Bản chất thiên văn học của Tiết Khí](#11-ban-chat-thien-van-hoc-cua-tiet-khi)
   - [1.2. Phân biệt "Tiết" (Jie) và "Khí" (Qi)](#12-phan-biet-tiet-jie-va-khi-qi)
   - [1.3. Bảng 12 Tiết Lệnh định ranh giới 12 Tháng Bát Tự](#13-bang-12-tiet-lenh-dinh-ranh-gioi-12-thang-bat-tu)
   - [1.4. Thuật toán xác định thời điểm chuyển Tiết Khí (Kinh độ Mặt Trời)](#14-thuat-toan-xac-dinh-thoi-diem-chuyen-tiet-khi-kinh-do-mat-troi)
2. [Phần II: Phương Pháp Tính Đại Vận (10 Năm Mỗi Bước)](#phan-ii-phuong-phap-tinh-dai-van-10-nam-moi-buoc)
   - [2.1. Quy tắc xác định chiều vận hành: Thuận hay Nghịch](#21-quy-tac-xac-dinh-chieu-van-hanh-thuan-hay-nghich)
   - [2.2. Công thức tính khoảng cách thời gian khởi vận](#22-cong-thuc-tinh-khoang-cach-thoi-gian-khoi-van)
   - [2.3. Quy tắc quy đổi thời gian: 3 ngày = 1 năm](#23-quy-tac-quy-doi-thoi-gian-3-ngay--1-nam)
   - [2.4. Cách an Can Chi cho 10 bước Đại Vận (100 năm)](#24-cach-an-can-chi-cho-10-buoc-dai-van-100-nam)
   - [2.5. An Thập Thần cho Can Đại Vận](#25-an-thap-than-cho-can-dai-van)
3. [Phần III: Phương Pháp Tính Lưu Niên (Từng Năm Cụ Thể)](#phan-iii-phuong-phap-tinh-luu-nien-tung-nam-cu-the)
   - [3.1. Xác định Can Chi của năm Lưu Niên](#31-xac-dinh-can-chi-cua-nam-luu-nien)
   - [3.2. Phân bổ 10 năm Lưu Niên vào từng bước Đại Vận](#32-phan-bo-10-nam-luu-nien-vao-tung-buoc-dai-van)
   - [3.3. Tương tác đa tầng: Bát Tự gốc - Đại Vận - Lưu Niên](#33-tuong-tac-da-tang-bat-tu-goc---dai-van---luu-nien)
4. [Phần IV: Ví Dụ Thực Nghiệm Toàn Diện](#phan-iv-vi-du-thuc-nghiem-toan-dien)

---

## PHẦN I: BẢN CHẤT & PHƯƠNG PHÁP TÍNH TIẾT KHÍ

### 1.1. Bản chất thiên văn học của Tiết Khí
Khác với quan niệm dân gian thường nhầm lẫn Bát Tự dùng "Âm lịch" (dựa theo chu kỳ Mặt Trăng), **Bát Tự Tứ Trụ là hệ thống Lịch Tiết Khí thuần Dương (Solar Calendar)** dựa trên sự chuyển động biểu kiến của Trái Đất quay quanh Mặt Trời.

- Quỹ đạo của Trái Đất quanh Mặt Trời tạo thành một đường tròn $360^\circ$ trên thiên cầu gọi là **Hoàng đạo (Ecliptic)**.
- Người xưa chia đường tròn $360^\circ$ này thành **24 phần bằng nhau**, mỗi phần ứng với $15^\circ$ kinh độ mặt trời ($\lambda_\odot$), gọi là **24 Tiết Khí**.
- Mốc bắt đầu của một năm thiên văn Bát Tự là **Lập Xuân** (khi kinh độ Mặt Trời đạt đúng $315^\circ$), tuyệt đối **không phụ thuộc** vào ngày mùng 1 Tết Nguyên Đán âm lịch.

### 1.2. Phân biệt "Tiết" (Jie) và "Khí" (Qi)
Trong 24 tiết khí được phân thành 2 nhóm xen kẽ nhau:
1. **12 Tiết lệnh (Tiết - 節 / Jie):** Là ranh giới chuyển giao giữa các tháng của Bát Tự (xác định Nguyệt Lệnh).
2. **12 Trung khí (Khí - 中氣 / Zhongqi):** Nằm ở giữa mỗi tháng (dùng trong việc xác định tháng nhuận của âm lịch).

### 1.3. Bảng 12 Tiết Lệnh định ranh giới 12 Tháng Bát Tự

| Tháng Bát Tự | Địa Chi Tháng | Tiết Lệnh Mở Đầu Tháng | Tọa Độ Kinh Độ Mặt Trời ($\lambda_\odot$) | Khoảng Ngày Dương Lịch |
| :---: | :---: | :---: | :---: | :---: |
| **Tháng 1** | **Dần** | **Lập Xuân** | $315^\circ$ | 03/02 – 05/02 |
| **Tháng 2** | **Mão** | **Kinh Trập** | $345^\circ$ | 05/03 – 07/03 |
| **Tháng 3** | **Thìn** | **Thanh Minh** | $15^\circ$ | 04/04 – 06/04 |
| **Tháng 4** | **Tỵ** | **Lập Hạ** | $45^\circ$ | 05/05 – 07/05 |
| **Tháng 5** | **Ngọ** | **Mang Chủng** | $75^\circ$ | 05/06 – 07/06 |
| **Tháng 6** | **Mùi** | **Tiểu Thử** | $105^\circ$ | 06/07 – 08/07 |
| **Tháng 7** | **Thân** | **Lập Thu** | $135^\circ$ | 07/08 – 09/08 |
| **Tháng 8** | **Dậu** | **Bạch Lộ** | $165^\circ$ | 07/09 – 09/09 |
| **Tháng 9** | **Tuất** | **Hàn Lộ** | $195^\circ$ | 08/10 – 09/10 |
| **Tháng 10** | **Hợi** | **Lập Đông** | $225^\circ$ | 07/11 – 08/11 |
| **Tháng 11** | **Tý** | **Đại Tuyết** | $255^\circ$ | 06/12 – 08/12 |
| **Tháng 12** | **Sửu** | **Tiểu Hàn** | $285^\circ$ | 05/01 – 07/01 |

> **Quy tắc bất biến:** Một người sinh vào tháng nào thì Nguyệt Lệnh chỉ được đổi sang tháng tiếp theo khi thời khắc sinh đã **vượt qua đúng phút giây** chuyển tiết khí tương ứng của tháng đó.

### 1.4. Thuật toán xác định thời điểm chuyển Tiết Khí
Hệ thống tính toán tọa độ biểu kiến của Mặt Trời theo chuẩn thiên văn học Jean Meeus:

1. **Quy đổi ngày sinh ra Ngày Julian (Julian Day Number - JDN):**
   $$JDN = \text{gregorianToJdn}(Y, M, D) + \frac{h + m/60 - 7}{24}$$
2. **Tính toán kinh độ biểu kiến của Mặt Trời $L_\odot$ tại thời điểm $JDN$:**
   Sử dụng chuỗi hàm lượng giác xác định độ lệch tâm của quỹ đạo Trái Đất và độ nghiêng của hoàng đạo.
3. **Thuật toán tìm kiếm nhị phân (Binary Search / 40 vòng lặp):**
   Tìm thời điểm $T_{\text{instant}}$ (độ chính xác đến từng giây) sao cho:
   $$|L_\odot(T_{\text{instant}}) - \lambda_{\text{target}}| < 0.00001^\circ$$
4. **Múi giờ quy chuẩn:**
   Áp dụng múi giờ cố định Việt Nam: $\text{UTC}+07:00$ (kinh tuyến $105^\circ\text{E}$).

---

## PHẦN II: PHƯƠNG PHÁP TÍNH ĐẠI VẬN (10 NĂM MỖI BƯỚC)

Đại Vận là chuỗi thời gian 10 năm một bước mô tả con đường ngoại cảnh mà đời người sẽ đi qua.

### 2.1. Quy tắc xác định chiều vận hành: Thuận hay Nghịch
Chiều đi của Đại Vận dựa vào tính chất **Âm/Dương của Can Năm Sinh** và **Giới tính** của đương số:

* **Can Dương gồm 5 Can:** Giáp, Bính, Mậu, Canh, Nhâm.
* **Can Âm gồm 5 Can:** Ất, Đinh, Kỷ, Tân, Quý.

| Giới Tính | Năm Sinh Mang Can Dương | Năm Sinh Mang Can Âm |
| :---: | :---: | :---: |
| **Nam** | **Đi THUẬN** (Theo chiều kim đồng hồ) | **Đi NGHỊCH** (Ngược chiều kim đồng hồ) |
| **Nữ** | **Đi NGHỊCH** (Ngược chiều kim đồng hồ) | **Đi THUẬN** (Theo chiều kim đồng hồ) |

*Khẩu quyết cốt lõi:* **DƯƠNG NAM - ÂM NỮ ĐI THUẬN; ÂM NAM - DƯƠNG NỮ ĐI NGHỊCH.**

---

### 2.2. Công thức tính khoảng cách thời gian khởi vận
Để biết chính xác bao nhiêu tuổi thì người đó bắt đầu bước vào Đại Vận đầu tiên, ta đo khoảng cách thời gian từ lúc sinh tới mốc Tiết Lệnh:

* **Trường hợp đi THUẬN:**
  Đo từ **thời khắc sinh** tiến tới **thời khắc Tiết Lệnh của tháng tiếp theo**:
  $$\Delta t = T_{\text{Tiết lệnh kế tiếp}} - T_{\text{Thời khắc sinh}}$$
* **Trường hợp đi NGHỊCH:**
  Đo từ **thời khắc sinh** lùi lại **thời khắc Tiết Lệnh của tháng hiện tại**:
  $$\Delta t = T_{\text{Thời khắc sinh}} - T_{\text{Tiết lệnh hiện tại}}$$

---

### 2.3. Quy tắc quy đổi thời gian: 3 ngày = 1 năm
Trong dịch lý Tử Bình, một năm có 360 ngày (12 tháng $\times$ 30 ngày), do đó một chu kỳ 12 tháng ứng với 72 giờ (3 ngày).

| Khoảng Thời Gian Thực Tế ($\Delta t$) | Quy Đổi Thời Gian Vận Mệnh |
| :--- | :--- |
| **3 Ngày** | **1 Năm** ($12\text{ tháng}$) |
| **1 Ngày** | **4 Tháng** ($120\text{ ngày}$) |
| **1 Giờ** (60 phút) | **5 Ngày** |
| **12 Phút** | **1 Ngày** |

#### Công thức tính toán cụ thể:
$$\text{Tổng số tháng khởi vận} = \left(\frac{\Delta t \text{ (tính bằng ngày)}}{3}\right) \times 12$$

- **Số năm khởi vận:** $\text{StartAgeYears} = \lfloor \text{Tổng số tháng} / 12 \rfloor$
- **Số tháng lẻ:** $\text{StartAgeMonths} = \text{round}(\text{Tổng số tháng} \pmod{12})$
- **Tuổi mụ danh nghĩa khởi Đại Vận:**
  $$\text{NominalStartAge} = \text{StartAgeYears} + 1$$
- **Năm dương lịch bắt đầu Đại Vận 1:**
  $$\text{StartYear} = \text{Năm sinh} + \text{StartAgeYears}$$

---

### 2.4. Cách an Can Chi cho 10 bước Đại Vận (100 năm)
Đại Vận **không khởi từ Trụ Năm** mà **bắt buộc khởi từ TRỤ THÁNG (Nguyệt Trụ)** của lá số:

* Nếu đi **THUẬN**: Từ Can và Chi của Trụ Tháng, đếm tiến lên 1 bước cho Đại Vận 1, 2 bước cho Đại Vận 2, v.v.
  $$\text{Can}_{i} = (\text{Can}_{\text{Tháng}} + i) \pmod{10}$$
  $$\text{Chi}_{i} = (\text{Chi}_{\text{Tháng}} + i) \pmod{12}$$
* Nếu đi **NGHỊCH**: Từ Can và Chi của Trụ Tháng, đếm lùi lại 1 bước cho Đại Vận 1, 2 bước cho Đại Vận 2, v.v.
  $$\text{Can}_{i} = (\text{Can}_{\text{Tháng}} - i + 10) \pmod{10}$$
  $$\text{Chi}_{i} = (\text{Chi}_{\text{Tháng}} - i + 12) \pmod{12}$$

Mỗi bước Đại Vận quản lý trọn vẹn **10 năm tuổi**:
- Đại vận $i$: Bắt đầu từ tuổi $P_{\text{start}} = \text{NominalStartAge} + (i - 1) \times 10$ đến tuổi $P_{\text{end}} = P_{\text{start}} + 9$.

---

### 2.5. An Thập Thần cho Can Đại Vận
Thiên Can của mỗi bước Đại Vận được so sánh trực tiếp với **Nhật Chủ (Thiên Can Trụ Ngày)** để suy ra Thập Thần tương ứng:

* Cùng hành, cùng cực Âm/Dương: **Tỷ Kiên (Tỷ)**.
* Cùng hành, khác cực Âm/Dương: **Kiếp Tài (Kiếp)**.
* Được Nhật Chủ sinh, cùng cực: **Thực Thần (Thực)**; khác cực: **Thương Quan (Thương)**.
* Khắc Nhật Chủ, cùng cực: **Thất Sát (Sát)**; khác cực: **Chính Quan (Quan)**.
* Bị Nhật Chủ khắc, cùng cực: **Thiên Tài (T.Tài)**; khác cực: **Chính Tài (Tài)**.
* Sinh ra Nhật Chủ, cùng cực: **Thiên Ấn / Kiêu Thần (Kiêu)**; khác cực: **Chính Ấn (Ấn)**.

---

## PHẦN III: PHƯƠNG PHÁP TÍNH LƯU NIÊN (TỪNG NĂM CỤ THỂ)

### 3.1. Xác định Can Chi của năm Lưu Niên
Lưu Niên (hay Niên Vận) là Can Chi của từng năm dương lịch trôi qua trong cuộc đời.

Với bất kỳ năm dương lịch $Y$ nào:
1. **Thiên Can của năm:**
   $$\text{Index}_{\text{Can}} = (Y + 6) \pmod{10}$$
   *(0: Giáp, 1: Ất, 2: Bính, 3: Đinh, 4: Mậu, 5: Kỷ, 6: Canh, 7: Tân, 8: Nhâm, 9: Quý)*
2. **Địa Chi của năm:**
   $$\text{Index}_{\text{Chi}} = (Y + 8) \pmod{12}$$
   *(0: Tý, 1: Sửu, 2: Dần, 3: Mão, 4: Thìn, 5: Tỵ, 6: Ngọ, 7: Mùi, 8: Thân, 9: Dậu, 10: Tuất, 11: Hợi)*

*Ví dụ:* Năm 2026:
- Can: $(2026 + 6) \pmod{10} = 2 \rightarrow$ **Bính**.
- Chi: $(2026 + 8) \pmod{12} = 6 \rightarrow$ **Ngọ**.
$\Rightarrow$ Năm 2026 là năm **Bính Ngọ**.

---

### 3.2. Phân bổ 10 năm Lưu Niên vào từng bước Đại Vận
Trong mỗi bước Đại Vận 10 năm (ví dụ từ năm $Y_{\text{start}}$ đến $Y_{\text{start}} + 9$), hệ thống thiết lập bảng 10 năm Lưu Niên:
- Tuổi của từng năm: $\text{Tuổi} = \text{Tuổi khởi vận} + y$ ($y \in [0..9]$).
- Can Chi từng năm tương ứng với lịch vạn niên năm đó.
- Điểm đánh dấu năm trọng tâm (**Focus Year**): Cho phép làm nổi bật năm đương số muốn xem cụ thể (ví dụ: năm hiện tại 2026).

---

### 3.3. Tương tác đa tầng: Bát Tự gốc - Đại Vận - Lưu Niên
Theo tôn chỉ Manh Phái:
> *"Lưu Niên là Vua (Chí tôn tối thượng), Đại Vận là Thần (Thừa hành), Bát Tự nguyên cục là Dân (Tiếp nhận sự việc)."*

Mỗi năm Lưu Niên đi qua sẽ kích hoạt sự biến đổi vận khí qua 3 cấp độ:
1. **Thiên Can Tương Tác:**
   - **Ngũ Hợp:** Giáp-Kỷ, Ất-Canh, Bính-Tân, Đinh-Nhâm, Mậu-Quý.
   - **Tương Xung:** Canh-Giáp, Tân-Ất, Nhâm-Bính, Quý-Đinh.
2. **Địa Chi Tương Tác:**
   - **Lục Xung:** Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi.
   - **Tam Hợp Cục:** Thân-Tý-Thìn (Thủy), Hợi-Mão-Mùi (Mộc), Dần-Ngọ-Tuất (Hỏa), Tỵ-Dậu-Sửu (Kim).
   - **Lục Hợp:** Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi.
   - **Tương Hình / Tương Hại (Xuyên) / Tương Phá.**
3. **Cát Hung Thời Điểm:**
   - Nếu Lưu Niên mang **Hỷ Thần / Dụng Thần** đến: Vận thế thăng hoa, tài lộc hanh thông.
   - Nếu Lưu Niên mang **Kỵ Thần** đến khắc phá Dụng Thần hoặc Xung kích Trụ Ngày (Thiên khắc Địa xung): Dễ gặp trắc trở, biến động lớn về sức khỏe, công việc hoặc tình cảm.

---

## PHẦN IV: VÍ DỤ THỰC NGHIỆM TOÀN DIỆN

Giả sử đương số có dữ liệu sinh như sau:
* **Họ tên:** NGUYỄN VĂN A
* **Giới tính:** Nam
* **Ngày sinh dương lịch:** 15/08/1990 lúc 10 giờ 30 phút

### 1. Xác định Bát Tự nguyên cục
- **Trụ Năm:** Canh Ngọ (Năm Canh: Thiên Can Dương $\rightarrow$ **Dương Nam**).
- **Trụ Tháng:** Giáp Thân (Sinh sau tiết Lập Thu 08/08/1990 và trước tiết Bạch Lộ 08/09/1990 $\rightarrow$ Tháng Thân).
- **Trụ Ngày:** Nhâm Tý.
- **Trụ Giờ:** Ất Tỵ.

### 2. Xác định chiều đi của Đại Vận
- Đương số là **Dương Nam** (Nam giới sinh năm Can Dương - Canh).
- Theo khẩu quyết: **Dương Nam đi THUẬN**.

### 3. Tính tuổi khởi Đại Vận
- Vì đi **THUẬN**, ta tính khoảng cách từ lúc sinh (10:30 ngày 15/08/1990) tiến tới Tiết lệnh kế tiếp là **Bạch Lộ** (xảy ra lúc 19:14 ngày 07/09/1990).
- Khoảng cách thời gian đo được:
  $$\Delta t \approx 23 \text{ ngày } 8 \text{ giờ } 44 \text{ phút} \approx 23.36 \text{ ngày}$$
- Áp dụng công thức 3 ngày = 1 năm:
  $$\text{Tổng số tháng} = \left(\frac{23.36}{3}\right) \times 12 \approx 93.44 \text{ tháng}$$
  - $93.44 / 12 = 7$ năm lẻ $9.44$ tháng (làm tròn $\approx 9$ tháng).
  - Tuổi mụ khởi vận: $7 + 1 =$ **8 tuổi**.
  - Năm bắt đầu Đại Vận 1: $1990 + 7 =$ **1997** (tháng khởi: tháng 10/1997).

### 4. An 10 bước Đại Vận (Khởi từ Trụ Tháng Giáp Thân tiến tới)
Vì đi **THUẬN**, từ **Giáp Thân** đếm tiến lên:

1. **Đại Vận 1 (8 – 17 tuổi | 1997 – 2006):** Can Chi là **Ất Dậu** (Thập Thần: Thương Quan).
2. **Đại Vận 2 (18 – 27 tuổi | 2007 – 2016):** Can Chi là **Bính Tuất** (Thập Thần: Thiên Tài).
3. **Đại Vận 3 (28 – 37 tuổi | 2017 – 2026):** Can Chi là **Đinh Hợi** (Thập Thần: Chính Tài).
4. **Đại Vận 4 (38 – 47 tuổi | 2027 – 2036):** Can Chi là **Mậu Tý** (Thập Thần: Thất Sát).
5. **Đại Vận 5 (48 – 57 tuổi | 2037 – 2046):** Can Chi là **Kỷ Sửu** (Thập Thần: Chính Quan).
6. **Đại Vận 6 (58 – 67 tuổi | 2047 – 2056):** Can Chi là **Canh Dần** (Thập Thần: Thiên Ấn).
7. **Đại Vận 7 (68 – 77 tuổi | 2057 – 2066):** Can Chi là **Tân Mão** (Thập Thần: Chính Ấn).
8. **Đại Vận 8 (78 – 87 tuổi | 2067 – 2076):** Can Chi là **Nhâm Thìn** (Thập Thần: Tỷ Kiên).
9. **Đại Vận 9 (88 – 97 tuổi | 2077 – 2086):** Can Chi là **Quý Tỵ** (Thập Thần: Kiếp Tài).
10. **Đại Vận 10 (98 – 107 tuổi | 2087 – 2096):** Can Chi là **Giáp Ngọ** (Thập Thần: Thực Thần).

### 5. Chi tiết 10 năm Lưu Niên trong Đại Vận 3 (Đinh Hợi | 2017 – 2026):
- 2017 (28 tuổi): Đinh Dậu
- 2018 (29 tuổi): Mậu Tuất
- 2019 (30 tuổi): Kỷ Hợi
- 2020 (31 tuổi): Canh Tý
- 2021 (32 tuổi): Tân Sửu
- 2022 (33 tuổi): Nhâm Dần
- 2023 (34 tuổi): Quý Mão
- 2024 (35 tuổi): Giáp Thìn
- 2025 (36 tuổi): Ất Tỵ
- **2026 (37 tuổi): Bính Ngọ** *(Năm trọng tâm Focus Year - Bính Hỏa khắc Nhâm Thủy, Ngọ xung Tý)*.

---

> [!TIP]
> Toàn bộ logic trên được lập trình tự động hóa tại module `[CORE-BAZI]` (`src/domain/bazi/index.ts`) và `[CORE-CALENDAR]` (`src/domain/calendar/index.ts`), đảm bảo tính chính xác tuyệt đối theo vị trí kinh độ địa lý và thuật toán thiên văn thực nghiệm.
