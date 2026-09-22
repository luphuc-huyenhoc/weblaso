import { test, expect } from '@playwright/test';

test.describe('Lữ Phúc Full-Stack End-to-End User Journeys', () => {
  test('1. Home page renders brand header, calculation form, and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lữ Phúc/i);
    await expect(page.locator('h2').first()).toContainText('Phong Thủy Cải Vận Bổ Khuyết');
    await expect(page.getByRole('button', { name: 'MỞ LÁ SỐ' })).toBeVisible();
  });

  test('2. Bát Tự form calculation triggers and displays results chart', async ({ page }) => {
    await page.goto('/la-so-bat-tu');
    await expect(page.getByRole('button', { name: 'MỞ LÁ SỐ' })).toBeVisible();

    // Click submit
    await page.getByRole('button', { name: 'MỞ LÁ SỐ' }).click();

    // Verify result chart appears
    await expect(page.getByText('Lá Số Bát Tự — Cải Vận Bổ Khuyết')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Dụng Thần:')).toBeVisible();
    await expect(page.getByText('Đại Vận & Lưu Niên Timeline')).toBeVisible();
  });

  test('3. Quẻ Dịch Lục Hào page loads and calculates canonical hexagram', async ({ page }) => {
    await page.goto('/que-dich/luc-hao');
    await expect(page.locator('#btnCreateLucHao')).toBeVisible();
    await page.fill('#Title', 'Hỏi việc đầu tư kinh doanh');
    await page.locator('#btnCreateLucHao').click();
    await expect(page.locator('#prtQueDich')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Lá số lập tại: LỮ PHÚC (luphuc.vn)')).toBeVisible();
  });

  test('4. Quẻ Dịch Ngẫu Nhiên page loads and calculates authentic random hexagram', async ({ page }) => {
    await page.goto('/que-dich/ngau-nhien');
    await expect(page.locator('#btnCreateNgauNhien')).toBeVisible();
    await page.fill('#Title', 'Xem tài lộc tháng tới');
    await page.locator('#btnCreateNgauNhien').click();
    await expect(page.locator('#prtQueDich')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#prtQueDich')).toContainText('Phương pháp lập quẻ:');
    await expect(page.locator('#prtQueDich')).toContainText('Ngẫu Nhiên');
    await expect(page.getByRole('heading', { name: 'Luận giải' })).toBeVisible();
    await expect(page.getByText('Lá số lập tại: LỮ PHÚC (luphuc.vn)')).toBeVisible();
  });

  test('5. Tử Vi page loads and calculates 12-palace square chart', async ({ page }) => {
    await page.goto('/la-so-tu-vi');
    await expect(page.getByRole('button', { name: 'LẬP LÁ SỐ TỬ VI' })).toBeVisible();
    await page.getByRole('button', { name: 'LẬP LÁ SỐ TỬ VI' }).click();
    await expect(page.getByRole('heading', { name: 'Lập Lá Số Tử Vi Đẩu Số Toàn' })).toBeVisible({ timeout: 15000 });
  });

  test('6. Phong Thủy Bát Trạch calculates Quái Mệnh, 360° Compass, and shareable URL', async ({ page }) => {
    await page.goto('/phong-thuy/bat-trach?year=1990&gender=male&direction=135');
    await expect(page.getByText('Bát Trạch Minh Cảnh Chuyên Khảo')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('La Bàn Phong Thủy Bát Trạch & 24 Sơn Hướng 360°')).toBeVisible();
    await expect(page.getByText('HƯỚNG NHÀ CỦA BẠN: 135°')).toBeVisible();
    await expect(page.getByText('4 Cát Hướng')).toBeVisible();
    await expect(page.getByText('4 Hung Hướng')).toBeVisible();
  });

  test('7. Global Search page searches and renders tools and items', async ({ page }) => {
    await page.goto('/tim-kiem?q=Bát tự');
    await expect(page.getByText('Lập Lá Số Bát Tự Tứ Trụ')).toBeVisible();
  });

  test('8. Xem Sao Hạn calculates Cửu Diệu, Niên Hạn, Tam Tai, Kim Lâu, Hoang Ốc', async ({ page }) => {
    await page.goto('/la-so-tu-vi/xem-sao-han');
    await expect(page.getByRole('button', { name: 'XEM SAO HẠN' })).toBeVisible();
    await page.getByRole('button', { name: 'XEM SAO HẠN' }).click();
    await expect(page.getByText('Sao Chiếu Mệnh Năm')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Hạn Trong Năm:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hạn Tam Tai' })).toBeVisible();
  });

  test('9. Lịch Âm Dương month view allows navigating and inspecting day cells', async ({ page }) => {
    await page.goto('/la-so-tu-vi/lich-am-duong');
    await expect(page.getByRole('heading', { name: 'Lịch Âm Dương & Vạn Niên' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Hôm nay')).toBeVisible();

    // Click 'Hôm nay' to open the detail panel
    await page.getByText('Hôm nay').click();
    await expect(page.getByText('Chi tiết ngày', { exact: true })).toBeVisible();
    await expect(page.getByText('Giờ Hoàng Đạo (Giờ tốt)')).toBeVisible();
  });

  test('10. Đổi Lịch Âm Dương converts 2-way with complete breakdown', async ({ page }) => {
    await page.goto('/la-so-tu-vi/doi-lich-am-duong');
    await expect(page.getByRole('button', { name: 'CHUYỂN ĐỔI NGÀY' })).toBeVisible();
    await page.getByRole('button', { name: 'CHUYỂN ĐỔI NGÀY' }).click();
    await expect(page.getByText('Kết Quả Chuyển Đổi')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Can Chi Ngày')).toBeVisible();
    await expect(page.getByText('Giờ Hoàng Đạo trong ngày:')).toBeVisible();
  });

  test('11. Lịch Ngày Tốt Xấu renders month cards, purpose search, and detail view', async ({ page }) => {
    await page.goto('/lich-ngay-tot-xau');
    await expect(page.getByRole('heading', { name: 'Lịch Ngày Tốt Xấu & Tra Cứu' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'XEM LỊCH THEO THÁNG' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TÌM NGÀY TỐT THEO MỤC ĐÍCH' })).toBeVisible();

    // Click purpose search tab
    await page.getByRole('button', { name: 'TÌM NGÀY TỐT THEO MỤC ĐÍCH' }).click();
    await expect(page.getByRole('button', { name: 'TÌM NGÀY ĐẠI CÁT' })).toBeVisible();
    await page.getByRole('button', { name: 'TÌM NGÀY ĐẠI CÁT' }).click();
    await expect(page.getByText('Kết Quả Tìm Ngày Tốt Cho Việc:')).toBeVisible({ timeout: 15000 });

    // Navigate to day detail
    await page.goto('/lich-ngay-tot-xau/2026-09-21');
    await expect(page.getByText('Đánh Giá Tổng Quan Ngày & Trực Thần')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Bảng Giờ Hoàng Đạo / Hắc Đạo (12 Thời Thần)')).toBeVisible();
    await expect(page.getByText('Việc Nên Làm Trong Ngày')).toBeVisible();
    await expect(page.getByText('Việc Nên Tránh / Kiêng Kỵ')).toBeVisible();
    await expect(page.getByText('Hướng Xuất Hành Cát Lợi')).toBeVisible();
  });
});
