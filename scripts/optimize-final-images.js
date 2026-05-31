/**
 * scripts/optimize-final-images.js
 * Validates, optimizes and converts AI-generated PNG images to progressive JPEGs.
 * Re-generates the OG image and cleans up duplicate PNG files.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const PHOTO_TARGETS = [
  { file: 'hero', width: 1920, height: 1080 },
  { file: 'product-1', width: 800, height: 1000 },
  { file: 'product-2', width: 800, height: 1000 },
  { file: 'tatar-hill', width: 800, height: 600 }
];

async function run() {
  console.log('\n=====================================================');
  console.log('   Part A: Image Verification & Optimization');
  console.log('=====================================================\n');

  for (const target of PHOTO_TARGETS) {
    const pngPath = path.join(IMAGES_DIR, `${target.file}.png`);
    const jpgPath = path.join(IMAGES_DIR, `${target.file}.jpg`);

    console.log(`• Processing ${target.file}.png...`);

    // 1. Verify existence
    if (!fs.existsSync(pngPath)) {
      throw new Error(`File ${target.file}.png does not exist in public/images/`);
    }

    // 2. Verify file size (> 200 KB)
    const pngSize = fs.statSync(pngPath).size;
    console.log(`  Size: ${(pngSize / 1024 / 1024).toFixed(2)} MB`);
    if (pngSize < 200 * 1024) {
      throw new Error(`File ${target.file}.png size is under 200 KB (${(pngSize / 1024).toFixed(1)} KB)`);
    }

    // 3. Verify magic bytes (89 50 4E 47)
    const fd = fs.openSync(pngPath, 'r');
    const magic = Buffer.alloc(4);
    fs.readSync(fd, magic, 0, 4, 0);
    fs.closeSync(fd);
    const isPng = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4E && magic[3] === 0x47;
    console.log(`  Magic bytes: ${magic.toString('hex').toUpperCase()} (${isPng ? 'PNG VALID' : 'PNG INVALID'})`);
    if (!isPng) {
      throw new Error(`File ${target.file}.png is not a valid PNG file!`);
    }

    // 4. Convert and resize to progressive JPEG (quality 88)
    console.log(`  Converting to JPEG ${target.width}x${target.height} (quality 88)...`);
    await sharp(pngPath)
      .resize(target.width, target.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(jpgPath);

    const jpgSize = fs.statSync(jpgPath).size;
    console.log(`  ✓ Saved optimized ${target.file}.jpg | Size: ${(jpgSize / 1024).toFixed(1)} KB`);
  }

  // 5. Crop og-image.jpg from the new hero.jpg
  const heroJpgPath = path.join(IMAGES_DIR, 'hero.jpg');
  const ogJpgPath = path.join(IMAGES_DIR, 'og-image.jpg');
  console.log('\n• Generating og-image.jpg (1200x630 crop of hero.jpg)...');
  await sharp(heroJpgPath)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(ogJpgPath);
  const ogSize = fs.statSync(ogJpgPath).size;
  console.log(`  ✓ Saved optimized og-image.jpg | Size: ${(ogSize / 1024).toFixed(1)} KB`);

  // 6. Delete .png files
  console.log('\n• Cleaning up PNG source files...');
  for (const target of PHOTO_TARGETS) {
    const pngPath = path.join(IMAGES_DIR, `${target.file}.png`);
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
      console.log(`  Deleted ${target.file}.png`);
    }
  }

  // 7. Verify Map Situation
  console.log('\n• Checking map situation...');
  const mapJpgPath = path.join(IMAGES_DIR, 'map.jpg');
  if (fs.existsSync(mapJpgPath)) {
    const mapSize = fs.statSync(mapJpgPath).size;
    const fd = fs.openSync(mapJpgPath, 'r');
    const magic = Buffer.alloc(3);
    fs.readSync(fd, magic, 0, 3, 0);
    fs.closeSync(fd);
    const isJpg = magic[0] === 0xFF && magic[1] === 0xD8 && magic[2] === 0xFF;
    console.log(`  map.jpg exists | Size: ${(mapSize / 1024).toFixed(1)} KB | Signature: ${magic.toString('hex').toUpperCase()} (${isJpg ? 'JPEG VALID' : 'JPEG INVALID'})`);
  } else {
    console.warn('  ⚠ map.jpg does not exist. Please check.');
  }

  console.log('\n=====================================================');
  console.log('   Final Photo Optimization Completed');
  console.log('=====================================================\n');
}

run().catch(err => {
  console.error('\n❌ Error in optimization:', err.message);
  process.exit(1);
});
