/**
 * fetch-real-images.js
 * ─────────────────────────────────────────────────────────────────────────
 * Replaces corporate-style photos with premium cozy residential photography
 * from Pexels API based on new copywriting focus ("premium home for life").
 *
 * Usage:  node scripts/fetch-real-images.js
 * Deps:   sharp (already installed)
 * Node:   18+ (uses native fetch)
 * ─────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ── Configuration ────────────────────────────────────────────────────────
const PEXELS_API_KEY = 'A9AB8fccKk8MdBx2hPBccM04iCZKW2lja9kZbWseoV6axRZB90NZF0Hb';
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Image targets and search queries with sequential fallbacks
const PHOTO_TARGETS = [
  {
    file: 'hero.jpg',
    queries: [
      'luxury home interior warm light evening cozy',
      'modern villa exterior sunset warm lights',
      'premium residential architecture twilight'
    ],
    orientation: 'landscape',
    width: 1920,
    height: 1080,
    note: 'Hero background — warm evening home space'
  },
  {
    file: 'product-1.jpg',
    queries: [
      'luxury living room natural wood stone fireplace',
      'modern villa interior natural materials',
      'premium home living space warm wood'
    ],
    orientation: 'portrait',
    width: 800,
    height: 1000,
    note: 'Private Residences — luxury living room with wood & stone'
  },
  {
    file: 'product-2.jpg',
    queries: [
      'premium apartment bedroom morning light natural materials',
      'luxury apartment interior bedroom soft light',
      'boutique residential interior bedroom modern'
    ],
    orientation: 'portrait',
    width: 800,
    height: 1000,
    note: 'Boutique Apartments — refined bedroom space'
  },
  {
    file: 'tatar-hill.jpg',
    queries: [
      'mediterranean villa stone wood terrace sunset',
      'luxury villa hillside sunset stone facade',
      'modern villa balkan architecture terrace'
    ],
    orientation: 'landscape',
    width: 800,
    height: 600,
    note: 'Tatar Hill — premium villa terrace at sunset'
  }
];

// ── Utility: Human Readable File Size ────────────────────────────────────
function humanSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

// ── Utility: Search Pexels API ───────────────────────────────────────────
async function searchPexels(query, orientation) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1`;
  const response = await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY,
      'User-Agent': 'malom-invest-builder/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Pexels API HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.photos && data.photos.length > 0 ? data.photos[0] : null;
}

// ── Utility: Download Image to Buffer ────────────────────────────────────
async function downloadToBuffer(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'malom-invest-builder/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Download HTTP ${response.status}: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ── Main Execution ───────────────────────────────────────────────────────
async function main() {
  console.log('\n=====================================================');
  console.log('   Malom Invest — Pexels Photographic Overhaul');
  console.log('=====================================================\n');

  // Ensure output directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const attributionList = [];

  // 1. Process Photograph Downloads
  for (const target of PHOTO_TARGETS) {
    const destPath = path.join(IMAGES_DIR, target.file);
    console.log(`\n• Processing ${target.file}...`);

    let photoData = null;
    // Try queries in order until one returns a photo
    for (let i = 0; i < target.queries.length; i++) {
      const q = target.queries[i];
      console.log(`  Trying query [${i + 1}/${target.queries.length}]: "${q}"...`);
      try {
        photoData = await searchPexels(q, target.orientation);
        if (photoData) {
          console.log(`  ✓ Found photo #${photoData.id} under query: "${q}"`);
          break;
        }
      } catch (err) {
        console.warn(`  ⚠ Search failed: ${err.message}`);
      }
    }

    if (!photoData) {
      throw new Error(`Could not find any photos on Pexels for target: "${target.file}"`);
    }

    const downloadUrl = photoData.src.original || photoData.src.large2x || photoData.src.large;
    console.log(`  Photographer: ${photoData.photographer}`);
    console.log(`  Downloading from: ${downloadUrl}`);

    const imageBuffer = await downloadToBuffer(downloadUrl);
    console.log(`  Downloaded raw buffer size: ${humanSize(imageBuffer.length)}`);

    // Cover-resize to expected dimensions and save
    console.log(`  Resizing & converting to JPEG ${target.width}x${target.height}...`);
    await sharp(imageBuffer)
      .resize(target.width, target.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: target.file === 'tatar-hill.jpg' ? 98 : 90, mozjpeg: true })
      .toFile(destPath);

    // Save for report
    attributionList.push({
      file: target.file,
      pexelsId: photoData.id,
      photographer: photoData.photographer,
      photographerUrl: photoData.photographer_url,
      srcUrl: photoData.url
    });
  }

  // 2. Crop hero.jpg -> og-image.jpg (1200x630)
  const heroPath = path.join(IMAGES_DIR, 'hero.jpg');
  const ogPath = path.join(IMAGES_DIR, 'og-image.jpg');
  console.log('\n• Generating og-image.jpg (cropped from hero.jpg)...');
  await sharp(heroPath)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(ogPath);

  // Link og-image to hero attribution
  const heroAttr = attributionList.find(a => a.file === 'hero.jpg');
  attributionList.push({
    file: 'og-image.jpg',
    pexelsId: heroAttr.pexelsId,
    photographer: heroAttr.photographer,
    photographerUrl: heroAttr.photographer_url,
    srcUrl: heroAttr.srcUrl
  });

  // 3. File Verification
  console.log('\n=====================================================');
  console.log('   Verification Report');
  console.log('=====================================================\n');

  let allValid = true;
  for (const attr of attributionList) {
    const filePath = path.join(IMAGES_DIR, attr.file);

    // 3.1 Check File Existence
    if (!fs.existsSync(filePath)) {
      console.error(`  [FAIL] ${attr.file} does not exist`);
      allValid = false;
      continue;
    }
    const size = fs.statSync(filePath).size;
    const isSizeOk = size > 80 * 1024; // 80 KB minimum size constraint for photos

    // 3.2 Check Format Magic Bytes (FF D8 FF for JPEGs)
    const fd = fs.openSync(filePath, 'r');
    const magic = Buffer.alloc(3);
    fs.readSync(fd, magic, 0, 3, 0);
    fs.closeSync(fd);

    const formatValid = magic[0] === 0xFF && magic[1] === 0xD8 && magic[2] === 0xFF;
    const formatName = 'JPEG';

    // 3.3 Check Dimensions via sharp
    let dimsOk = false;
    let dimsStr = 'unknown';
    try {
      const meta = await sharp(filePath).metadata();
      dimsStr = `${meta.width}x${meta.height}`;
      if (attr.file === 'hero.jpg') dimsOk = meta.width === 1920 && meta.height === 1080;
      else if (attr.file === 'product-1.jpg' || attr.file === 'product-2.jpg') dimsOk = meta.width === 800 && meta.height === 1000;
      else if (attr.file === 'tatar-hill.jpg') dimsOk = meta.width === 800 && meta.height === 600;
      else if (attr.file === 'og-image.jpg') dimsOk = meta.width === 1200 && meta.height === 630;
    } catch (e) {
      console.error(`  ⚠ Could not read dimensions for ${attr.file}: ${e.message}`);
    }

    const fileStatus = (formatValid && isSizeOk && dimsOk);
    if (!fileStatus) allValid = false;

    console.log(`  File: ${attr.file}`);
    console.log(`    Format:    ${formatName} (${formatValid ? 'VALID' : 'INVALID'})`);
    console.log(`    Size:      ${humanSize(size)} (${isSizeOk ? 'OK (>80KB)' : 'FAIL (<80KB)'})`);
    console.log(`    Dimensions: ${dimsStr} (${dimsOk ? 'OK' : 'FAIL'})`);
    console.log(`    Status:    ${fileStatus ? '✅ PASSED' : '❌ FAILED'}\n`);
  }

  // 4. Output Final Markdown Attribution Table
  console.log('=====================================================');
  console.log('   Pexels Photo Attribution / Records');
  console.log('=====================================================\n');

  console.log('| Filename | Pexels Photo ID | Photographer | Source URL | Size |');
  console.log('|---|---|---|---|---|');
  for (const attr of attributionList) {
    const size = fs.existsSync(path.join(IMAGES_DIR, attr.file)) ? humanSize(fs.statSync(path.join(IMAGES_DIR, attr.file)).size) : 'N/A';
    console.log(`| ${attr.file} | ${attr.pexelsId} | ${attr.photographer} | [Link](${attr.srcUrl}) | ${size} |`);
  }

  if (allValid) {
    console.log('\n✅ All photography assets downloaded, processed, and verified successfully!');
  } else {
    console.error('\n❌ Verification failed. Please inspect errors above.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error in script:', err.message);
  process.exit(1);
});
