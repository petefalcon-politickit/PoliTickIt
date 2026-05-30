/**
 * Generates required PNG assets for EAS Android APK build.
 * Source: PoliTickIt-Icon-300x274.png → 1024x1024 centered on white bg
 * Output: assets/images/icon.png, adaptive-icon-foreground.png, splash-icon.png
 */
const Jimp = require('jimp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const SOURCE = path.join(ASSETS_DIR, 'PoliTickIt-Icon-300x274.png');

async function generate() {
  const source = await Jimp.read(SOURCE);

  // --- icon.png (1024x1024, white background) ---
  const icon = await new Jimp(1024, 1024, 0xffffffff);
  const iconCopy = source.clone().resize(700, Jimp.AUTO);
  const iconX = Math.floor((1024 - iconCopy.bitmap.width) / 2);
  const iconY = Math.floor((1024 - iconCopy.bitmap.height) / 2);
  icon.composite(iconCopy, iconX, iconY);
  await icon.writeAsync(path.join(ASSETS_DIR, 'icon.png'));
  console.log('✅ icon.png generated (1024x1024)');

  // --- adaptive-icon-foreground.png (1024x1024, transparent bg) ---
  const adaptive = await new Jimp(1024, 1024, 0x00000000);
  const adaptiveCopy = source.clone().resize(640, Jimp.AUTO);
  const adaptiveX = Math.floor((1024 - adaptiveCopy.bitmap.width) / 2);
  const adaptiveY = Math.floor((1024 - adaptiveCopy.bitmap.height) / 2);
  adaptive.composite(adaptiveCopy, adaptiveX, adaptiveY);
  await adaptive.writeAsync(path.join(ASSETS_DIR, 'adaptive-icon-foreground.png'));
  console.log('✅ adaptive-icon-foreground.png generated (1024x1024 transparent)');

  // --- adaptive-icon-background.png (1024x1024, brand color #E6F4FE) ---
  const bg = await new Jimp(1024, 1024, 0xE6F4FEff);
  await bg.writeAsync(path.join(ASSETS_DIR, 'adaptive-icon-background.png'));
  console.log('✅ adaptive-icon-background.png generated (1024x1024 #E6F4FE)');

  // --- splash-icon.png (1024x1024, white background) ---
  const splash = await new Jimp(1024, 1024, 0xffffffff);
  const splashCopy = source.clone().resize(500, Jimp.AUTO);
  const splashX = Math.floor((1024 - splashCopy.bitmap.width) / 2);
  const splashY = Math.floor((1024 - splashCopy.bitmap.height) / 2);
  splash.composite(splashCopy, splashX, splashY);
  await splash.writeAsync(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('✅ splash-icon.png generated (1024x1024)');
}

generate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
