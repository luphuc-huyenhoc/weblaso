import { test, expect } from '@playwright/test';

test('capture traditional Bát Tự chart matching reference', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 2200 });
  await page.goto('/la-so-bat-tu');

  await page.fill('input#fullName', 'dsad');
  await page.selectOption('select#day', '1');
  await page.selectOption('select#month', '2');
  await page.selectOption('select#year', '1990');
  await page.selectOption('select#hour', '1');
  await page.selectOption('select#minute', '1');
  await page.selectOption('select#focusYear', '2026');

  await page.getByRole('button', { name: 'MỞ LÁ SỐ' }).click();

  const chartLocator = page.locator('#bazi-printable-chart');
  await expect(chartLocator).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_full_bazi_page.png',
    fullPage: true,
  });
  await chartLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_bazi_chart.png',
  });
  console.log('Successfully saved actual_full_bazi_page.png and actual_bazi_chart.png!');
});

test('capture Quẻ Dịch Ngẫu Nhiên chart matching reference', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 2200 });
  await page.goto('/que-dich/ngau-nhien');

  await page.fill('#Title', 'Xem tài lộc tháng tới');
  await page.locator('#btnCreateNgauNhien').click();

  const chartLocator = page.locator('#prtQueDich');
  await expect(chartLocator).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1000);

  await chartLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_ngaunhien_chart.png',
  });
  console.log('Successfully saved actual_ngaunhien_chart.png!');
});

test('capture Lá số Tử Vi chart with BACKGROUND.png', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.goto('/la-so-tu-vi');

  await page.getByRole('button', { name: 'LẬP LÁ SỐ TỬ VI' }).click();

  const chartLocator = page.locator('.grid-cols-4').first();
  await expect(chartLocator).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1000);

  await chartLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_tuvi_chart.png',
  });
  console.log('Successfully saved actual_tuvi_chart.png!');
});

test('capture Phong thủy Bát Trạch result with BACKGROUND.png', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1800 });
  await page.goto('/phong-thuy/bat-trach');

  const heroLocator = page.locator('text=Cung Phi:').first();
  await expect(heroLocator).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1000);

  const bannerLocator = page.locator('.bg-\\[\\#27303f\\]').first();
  await bannerLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_battrach_banner.png',
  });
  console.log('Successfully saved actual_battrach_banner.png!');
});

test('capture Sim Phong Thủy result with BACKGROUND.png', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 2600 });
  await page.goto('/que-dich/so-dien-thoai?so=0826226888&ngay=1&thang=11&nam=1992&gio=17&phut=0&gioitinh=nam&lich=dl');

  const docLocator = page.locator('#sim-printable-document');
  await expect(docLocator).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Trạch Địa Tụy').first()).toBeVisible();
  await page.waitForTimeout(1000);

  await docLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_sim_result.png',
  });
  console.log('Successfully saved actual_sim_result.png!');
});

