/**
 * fetch-real-images.js
 * ─────────────────────────────────────────────────────────────────────────
 * Replaces placeholder SVG images with real premium photographs using the
 * Pexels API. Generates a custom vector map.png outlined world map with
 * markers, rasterizes it, and verifies files are valid.
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

// Image targets and search queries
const PHOTO_TARGETS = [
  {
    file: 'hero.jpg',
    query: 'minimalist architecture dusk concrete glass building blue hour',
    orientation: 'landscape',
    width: 1920,
    height: 1080,
    note: 'Hero background — minimalist architecture at dusk'
  },
  {
    file: 'product-1.jpg',
    query: 'scandinavian modern villa wood facade nordic architecture',
    orientation: 'portrait',
    width: 800,
    height: 1000,
    note: 'Elite Residential — Scandinavian luxury villa'
  },
  {
    file: 'product-2.jpg',
    query: 'minimalist commercial atrium glass interior architecture',
    orientation: 'portrait',
    width: 800,
    height: 1000,
    note: 'Commercial Icons — minimalist atrium'
  },
  {
    file: 'tatar-hill.jpg',
    query: 'modern villa hillside mediterranean sunset architecture',
    orientation: 'landscape',
    width: 800,
    height: 600,
    note: 'Tatar Hill — modern villa on hillside at sunset'
  }
];

const FALLBACK_QUERY = 'modern architecture';

// Colors (Design System tokens)
const TATAR_SAGE = '#A2A094';
const MALOM_BLUE = '#4A728C';

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
  console.log('   Malom Invest — Pexels Photo Replacer & Verifier');
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
    console.log(`  Query: "${target.query}"`);

    let photoData = null;
    try {
      photoData = await searchPexels(target.query, target.orientation);
    } catch (err) {
      console.log(`  ⚠ Search failed: ${err.message}. Trying fallback...`);
    }

    if (!photoData) {
      console.log(`  ⚠ No results for primary query. Trying fallback query: "${FALLBACK_QUERY}"...`);
      photoData = await searchPexels(FALLBACK_QUERY, target.orientation);
    }

    if (!photoData) {
      throw new Error(`Could not find any photos on Pexels for "${target.file}"`);
    }

    const downloadUrl = photoData.src.large2x || photoData.src.large || photoData.src.original;
    console.log(`  Found photo #${photoData.id} by ${photoData.photographer}`);
    console.log(`  Downloading from: ${downloadUrl}`);

    const imageBuffer = await downloadToBuffer(downloadUrl);
    console.log(`  Downloaded raw buffer size: ${humanSize(imageBuffer.length)}`);

    // Cover-resize to expected dimensions
    console.log(`  Resizing & converting to JPEG ${target.width}x${target.height}...`);
    await sharp(imageBuffer)
      .resize(target.width, target.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, mozjpeg: true })
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

  // 3. Generate Custom map.png SVG and rasterize to 1200x600 PNG
  const mapPath = path.join(IMAGES_DIR, 'map.png');
  console.log('\n• Generating custom vector map.png...');
  const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
    <!-- Thin contour lines for continents in Tatar Sage (#A2A094) -->
    <!-- North & South America -->
    <path d="M 200,110 Q 230,100 250,120 L 255,160 Q 265,190 260,220 L 240,260 Q 230,280 235,300 L 250,340 Q 260,380 245,420 L 230,460 Q 210,480 190,460 L 180,430 Q 175,400 185,370 L 195,330 Q 200,300 190,270 L 175,230 Q 165,200 170,160 L 185,120 Z"
          fill="none" stroke="${TATAR_SAGE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Greenland -->
    <path d="M 330,60 Q 360,50 380,70 L 370,100 L 340,90 Z"
          fill="none" stroke="${TATAR_SAGE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Europe & Africa -->
    <path d="M 410,120 Q 430,100 460,115 L 470,180 Q 450,200 440,230 L 420,280 Q 400,320 390,360 L 380,420 Q 370,450 360,460 L 340,440 Q 330,400 340,370 L 350,340 Q 360,300 370,270 L 380,220 Q 390,180 410,120 Z"
          fill="none" stroke="${TATAR_SAGE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Asia -->
    <path d="M 520,90 Q 580,80 650,95 L 720,110 Q 780,125 810,140 L 820,180 Q 800,210 770,220 L 730,230 Q 700,240 680,260 L 650,280 Q 620,270 600,255 L 570,240 Q 540,220 525,200 L 510,170 Q 505,140 520,90 Z"
          fill="none" stroke="${TATAR_SAGE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Australia -->
    <path d="M 730,350 Q 770,340 800,355 L 820,390 Q 815,420 790,430 L 755,435 Q 725,425 715,400 L 720,370 Z"
          fill="none" stroke="${TATAR_SAGE}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Connection lines between locations in Malom Blue (#4A728C) -->
    <line x1="470" y1="115" x2="488" y2="130" stroke="${MALOM_BLUE}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>
    <line x1="488" y1="130" x2="493" y2="148" stroke="${MALOM_BLUE}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>
    <line x1="493" y1="148" x2="510" y2="185" stroke="${MALOM_BLUE}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>
    <line x1="510" y1="185" x2="555" y2="205" stroke="${MALOM_BLUE}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>

    <!-- Branded Diamond Markers: Rotated <rect> elements in Malom Blue (#4A728C) -->
    <!-- Sweden -->
    <g transform="translate(470, 115)">
      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="${MALOM_BLUE}" />
    </g>
    <text x="470" y="100" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" fill="${MALOM_BLUE}" text-anchor="middle">Sweden</text>

    <!-- Poland -->
    <g transform="translate(488, 130)">
      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="${MALOM_BLUE}" />
    </g>
    <text x="488" y="145" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" fill="${MALOM_BLUE}" text-anchor="middle">Poland</text>

    <!-- Serbia -->
    <g transform="translate(493, 148)">
      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="${MALOM_BLUE}" />
    </g>
    <text x="445" y="152" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" fill="${MALOM_BLUE}" text-anchor="end">Serbia</text>

    <!-- Cyprus -->
    <g transform="translate(510, 185)">
      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="${MALOM_BLUE}" />
    </g>
    <text x="495" y="189" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" fill="${MALOM_BLUE}" text-anchor="end">Cyprus</text>

    <!-- UAE -->
    <g transform="translate(555, 205)">
      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="${MALOM_BLUE}" />
    </g>
    <text x="570" y="209" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" fill="${MALOM_BLUE}" text-anchor="start">UAE</text>
  </svg>`;

  await sharp(Buffer.from(mapSvg))
    .png()
    .toFile(mapPath);

  attributionList.push({
    file: 'map.png',
    pexelsId: 'N/A',
    photographer: 'Vector (Generated SVG)',
    photographerUrl: '',
    srcUrl: 'Custom SVG world map'
  });

  // 4. File Verification
  console.log('\n=====================================================');
  console.log('   Verification Report');
  console.log('=====================================================\n');

  let allValid = true;
  for (const attr of attributionList) {
    const filePath = path.join(IMAGES_DIR, attr.file);

    // 4.1 Check File Existence and Size
    if (!fs.existsSync(filePath)) {
      console.error(`  [FAIL] ${attr.file} does not exist`);
      allValid = false;
      continue;
    }
    const size = fs.statSync(filePath).size;
    const isSizeOk = attr.file === 'map.png' ? true : size > 50 * 1024; // 50 KB (only for photos, map can be smaller)

    // 4.2 Check Format Magic Bytes
    const fd = fs.openSync(filePath, 'r');
    const magic = Buffer.alloc(4);
    fs.readSync(fd, magic, 0, 4, 0);
    fs.closeSync(fd);

    let formatValid = false;
    let formatName = '';
    if (attr.file.endsWith('.jpg')) {
      // JPEG magic: FF D8
      formatValid = magic[0] === 0xFF && magic[1] === 0xD8;
      formatName = 'JPEG';
    } else if (attr.file.endsWith('.png')) {
      // PNG magic: 89 50 4E 47
      formatValid = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4E && magic[3] === 0x47;
      formatName = 'PNG';
    }

    // 4.3 Check Dimensions via sharp
    let dimsOk = false;
    let dimsStr = 'unknown';
    try {
      const meta = await sharp(filePath).metadata();
      dimsStr = `${meta.width}x${meta.height}`;
      if (attr.file === 'hero.jpg') dimsOk = meta.width === 1920 && meta.height === 1080;
      else if (attr.file === 'product-1.jpg' || attr.file === 'product-2.jpg') dimsOk = meta.width === 800 && meta.height === 1000;
      else if (attr.file === 'tatar-hill.jpg') dimsOk = meta.width === 800 && meta.height === 600;
      else if (attr.file === 'og-image.jpg') dimsOk = meta.width === 1200 && meta.height === 630;
      else if (attr.file === 'map.png') dimsOk = meta.width === 1200 && meta.height === 600;
    } catch (e) {
      console.error(`  ⚠ Could not read dimensions for ${attr.file}: ${e.message}`);
    }

    const fileStatus = (formatValid && isSizeOk && dimsOk);
    if (!fileStatus) allValid = false;

    console.log(`  File: ${attr.file}`);
    console.log(`    Format:    ${formatName} (${formatValid ? 'VALID' : 'INVALID'})`);
    console.log(`    Size:      ${humanSize(size)} (${isSizeOk ? 'OK (>50KB)' : 'FAIL (<50KB)'})`);
    console.log(`    Dimensions: ${dimsStr} (${dimsOk ? 'OK' : 'FAIL'})`);
    console.log(`    Status:    ${fileStatus ? '✅ PASSED' : '❌ FAILED'}\n`);
  }

  // 5. Output Final Markdown Attribution Table
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
    console.log('\n✅ All assets downloaded, processed, and verified successfully!');
  } else {
    console.error('\n❌ Verification failed. Please inspect errors above.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error in script:', err.message);
  process.exit(1);
});
