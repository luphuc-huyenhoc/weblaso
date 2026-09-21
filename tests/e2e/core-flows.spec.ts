import { test, expect } from '@playwright/test';

test.describe('Nguhanh.net Full-Stack End-to-End User Journeys', () => {
  test('1. Home page renders brand header, calculation form, and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nguhanh\.net/i);
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

  test('3. Quẻ Dịch Lục Hào page loads and renders dual hexagrams', async ({ page }) => {
    await page.goto('/que-dich/luc-hao');
    await expect(page.getByRole('button', { name: 'AN QUẺ LỤC HÀO' })).toBeVisible();
    await page.getByRole('button', { name: 'AN QUẺ LỤC HÀO' }).click();
    await expect(page.getByText('Dịch Học Hoa Lục Hào Dự Trắc')).toBeVisible({ timeout: 15000 });
  });

  test('4. Tử Vi page loads and calculates 12-palace square chart', async ({ page }) => {
    await page.goto('/la-so-tu-vi');
    await expect(page.getByRole('button', { name: 'LẬP LÁ SỐ TỬ VI' })).toBeVisible();
    await page.getByRole('button', { name: 'LẬP LÁ SỐ TỬ VI' }).click();
    await expect(page.getByText('Tử Vi Đẩu Số Toàn Thư')).toBeVisible({ timeout: 15000 });
  });

  test('5. Phong Thủy Bát Trạch calculates Quái Mệnh and 8 directions', async ({ page }) => {
    await page.goto('/phong-thuy/bat-trach');
    await expect(page.getByRole('button', { name: 'TRA CỨU BÁT TRẠCH' })).toBeVisible();
    await page.getByRole('button', { name: 'TRA CỨU BÁT TRẠCH' }).click();
    await expect(page.getByText('Bát Trạch Minh Cảnh Chuyên Khảo')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('4 Cát Hướng')).toBeVisible();
  });

  test('6. Global Search page searches and renders tools and items', async ({ page }) => {
    await page.goto('/tim-kiem?q=Bát tự');
    await expect(page.getByText('Lập Lá Số Bát Tự Tứ Trụ')).toBeVisible();
  });
});
