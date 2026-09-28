const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const srcIcon = path.join(rootDir, 'public', 'icon-512.png');
const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generate() {
  if (!fs.existsSync(srcIcon)) {
    console.error('Source icon not found:', srcIcon);
    process.exit(1);
  }

  for (const [folder, size] of Object.entries(iconSizes)) {
    const targetDir = path.join(resDir, folder);
    if (!fs.existsSync(targetDir)) continue;

    // Standard launcher icon
    await sharp(srcIcon)
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round launcher icon
    await sharp(srcIcon)
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon (usually with padding or exact size)
    await sharp(srcIcon)
      .resize(Math.round(size * 0.8), Math.round(size * 0.8))
      .extend({
        top: Math.round(size * 0.1),
        bottom: Math.round(size * 0.1),
        left: Math.round(size * 0.1),
        right: Math.round(size * 0.1),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${folder} (${size}x${size})`);
  }

  console.log('All Android icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
