const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(logoPath)) {
    console.error('public/logo.png not found!');
    process.exit(1);
  }

  // 1. Regular icons
  await sharp(logoPath)
    .resize(192, 192, { fit: 'contain', background: { r: 249, g: 245, b: 236, alpha: 1 } })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: { r: 249, g: 245, b: 236, alpha: 1 } })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  // 2. Apple Touch Icon (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 249, g: 245, b: 236, alpha: 1 } })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 3. Maskable Icons (padding 10% on each side for circular/squircle mask)
  await sharp(logoPath)
    .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 21,
      bottom: 21,
      left: 21,
      right: 21,
      background: { r: 249, g: 245, b: 236, alpha: 1 },
    })
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));
  console.log('Generated icon-maskable-192.png');

  await sharp(logoPath)
    .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 249, g: 245, b: 236, alpha: 1 },
    })
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('Generated icon-maskable-512.png');

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
