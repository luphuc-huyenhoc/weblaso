import { test, expect } from '@playwright/test';

test('capture traditional Bát Tự chart matching reference', async ({ page }) => {
  // Set viewport large enough to capture high resolution
  await page.setViewportSize({ width: 1280, height: 2000 });

  await page.goto('/la-so-bat-tu');

  // Fill input matching reference test case: Name: SFDSADF, Date: 01/01/1990 00:00, FocusYear: 2026, Male
  await page.fill('input#fullName', 'SFDSADF');
  await page.selectOption('select#day', '1');
  await page.selectOption('select#month', '1');
  await page.selectOption('select#year', '1990');
  await page.selectOption('select#hour', '0');
  await page.selectOption('select#minute', '0');
  await page.selectOption('select#focusYear', '2026');

  // Click calculate button
  await page.getByRole('button', { name: 'MỞ LÁ SỐ' }).click();

  // Wait for chart to appear
  const chartLocator = page.locator('#bazi-printable-chart');
  await expect(chartLocator).toBeVisible({ timeout: 15000 });

  // Wait a moment for fonts and watermark SVG to settle
  await page.waitForTimeout(1000);

  // Take screenshot of chart container
  await chartLocator.screenshot({
    path: '/Volumes/DU LIEU/THANG LÁ SỐ/actual_bazi_chart.png',
  });

  console.log('Successfully saved actual_bazi_chart.png!');
});
