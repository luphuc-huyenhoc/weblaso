import { test } from '@playwright/test';
import fs from 'fs';

test('scrape nguhanh ngau nhien', async ({ page }) => {
  await page.goto('https://nguhanh.net/que-dich/ngau-nhien', { timeout: 45000 });
  await page.fill('#Title', 'Xem tài lộc tháng tới');
  await page.click('#btnCreateNgauNhien');
  await page.waitForSelector('.result-quedich > *', { timeout: 30000 });
  await page.waitForTimeout(3000);
  const html = await page.locator('.result-quedich').innerHTML();
  fs.writeFileSync('/tmp/reference_ngaunhien_result.html', html);
  await page.locator('.result-quedich').screenshot({ path: '/Volumes/DU LIEU/THANG LÁ SỐ/reference_ngaunhien_result.png' });
  console.log('Successfully captured reference_ngaunhien_result.png!');
});
