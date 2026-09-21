# Bát Tự Methodology & Rule Specifications

Documentation of Bát Tự (Four Pillars of Destiny) methodology implemented in this system, adhering to Zi Ping Manh Phái standards.

## 1. Boundary & Invariant Rules
1. **Year Pillar Invariant**:
   - The boundary of the Bát Tự Year is strictly determined by the exact solar timestamp of **Lập Xuân** (立春).
   - It does **NOT** follow the Lunar New Year (Tết Nguyên Đán).
   - A native born after the lunar 1st of January but before Lập Xuân still carries the Year Pillar of the preceding year.
2. **Month Pillar Invariant**:
   - Month Pillar changes at the exact astronomical solar minute of the **12 Jie** (節):
     - Month 1 (Dần): Lập Xuân
     - Month 2 (Mão): Kinh Trập
     - Month 3 (Thìn): Thanh Minh
     - Month 4 (Tỵ): Lập Hạ
     - Month 5 (Ngọ): Mang Chủng
     - Month 6 (Mùi): Tiểu Thử
     - Month 7 (Thân): Lập Thu
     - Month 8 (Dậu): Bạch Lộ
     - Month 9 (Tuất): Hàn Lộ
     - Month 10 (Hợi): Lập Đông
     - Month 11 (Tý): Đại Tuyết
     - Month 12 (Sửu): Tiểu Hàn
3. **Day Pillar Invariant**:
   - The Day Pillar transitions strictly at **23:00** (Dạ Tý / Early Rat).
   - 23:00 - 23:59:59 uses the Day Pillar of the incoming day.
4. **Timezone Policy**:
   - All calculations use fixed `UTC+07-fixed` (`Asia/Ho_Chi_Minh`) with solar longitude aligned to Vietnam ($105^\circ\text{E}$).

---

## 2. Quantitative Ngũ Hành & Dụng Thần Engine

To decouple mathematical calculation from philosophical interpretation, the system implements a two-stage evaluation:

### Stage 1: Five Elements Quantitative Scoring (Calculation Fact)
Each element (Kim, Mộc, Thủy, Hỏa, Thổ) receives points based on:
1. **Heavenly Stems**: 100 points per visible stem matching the element.
2. **Month Branch (Lệnh Tháng)**: 300 points multiplier if the element rules the season of birth.
3. **Hidden Stems**: Weighted according to Qi percentage (Main Qi: 60-70%, Middle Qi: 20-30%, Residual Qi: 10%).

### Stage 2: Zi Ping Rule Engine (Interpretation)
- **Vượng / Nhược (Day Master Strength)**:
  - If Day Master score $\ge 40\%$ of total chart score, Day Master is considered **Thân Vượng** (Strong).
  - If Day Master score $< 40\%$, Day Master is considered **Thân Nhược** (Weak).
- **Dụng Thần (Useful God) & Hỷ Thần (Favorable God)**:
  - Thân Nhược: Needs generation (Ấn) or assistance (Tỷ/Kiếp) -> Dụng Thần is the generating element.
  - Thân Vượng: Needs drainage (Thực/Thương), control (Quan/Sát), or wealth consumption (Tài) -> Dụng Thần is chosen to balance the chart.
- **Kỵ Thần (Taboo Element)**:
  - Element that aggravates the imbalance (e.g. for Thân Nhược, strong Sát/Quan without Ấn protection).

All interpretation outputs explicitly identify `methodology: "tu-binh-manh-phai-v1"` to ensure transparent lineage.
