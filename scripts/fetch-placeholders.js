/**
 * fetch-placeholders.js
 * ─────────────────────────────────────────────────────────────────────────
 * Downloads temporary placeholder images from Unsplash Source API for the
 * Malom Invest preview deploy. These are NOT final images — the client will
 * supply real photography before production launch.
 *
 * Usage:  node scripts/fetch-placeholders.js
 * Deps:   sharp (npm install sharp --save-dev)
 * Node:   18+  (uses native fetch)
 * ─────────────────────────────────────────────────────────────────────────
 */

'use strict';

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const sharp  = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

// ── Target list ──────────────────────────────────────────────────────────
const TARGETS = [
  {
    file:    'hero.jpg',
    url:     'https://source.unsplash.com/1920x1080/?architecture,dusk,minimalist',
    w: 1920, h: 1080,
    note:    'Hero background — cinematic architecture at dusk',
  },
  {
    file:    'product-1.jpg',
    url:     'https://source.unsplash.com/800x1000/?scandinavian,villa,modern,luxury',
    w: 800,  h: 1000,
    note:    'Elite Residential — Scandinavian luxury villa',
  },
  {
    file:    'product-2.jpg',
    url:     'https://source.unsplash.com/800x1000/?atrium,minimalist,interior,commercial',
    w: 800,  h: 1000,
    note:    'Commercial Icons — minimalist atrium interior',
  },
  {
    file:    'tatar-hill.jpg',
    url:     'https://source.unsplash.com/800x600/?villa,hillside,sunset,architecture',
    w: 800,  h: 600,
    note:    'Tatar Hill — modern villa on hillside at sunset',
  },
];

// ── Colour palette for SVG placeholders (matches design system) ──────────
const MALOM_BLUE  = '#315972';
const STONE       = '#F5F4F1';
const TATAR_SAGE  = '#A2A094';

// ── Utility: follow redirects and download to a file ────────────────────
function download(url, dest, maxRedirects = 8) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;

    const req = proto.get(url, { headers: { 'User-Agent': 'malom-placeholder-fetcher/1.0' } }, (res) => {
      // Follow redirects (Unsplash Source always redirects to a CDN URL)
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308)
          && res.headers.location && maxRedirects > 0) {
        req.destroy();
        return resolve(download(res.headers.location, dest, maxRedirects - 1));
      }

      if (res.statusCode !== 200) {
        req.destroy();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

// ── Utility: get actual image dimensions via sharp ───────────────────────
async function getDimensions(filePath) {
  try {
    const meta = await sharp(filePath).metadata();
    return { width: meta.width, height: meta.height, format: meta.format };
  } catch {
    return { width: '?', height: '?', format: '?' };
  }
}

// ── Utility: human-readable file size ────────────────────────────────────
function humanSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024)        return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

// ── Create SVG placeholder image ─────────────────────────────────────────
async function createSvgPlaceholder(dest, w, h, label, bg = STONE, fg = MALOM_BLUE) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect x="${w*0.05}" y="${h*0.05}" width="${w*0.9}" height="${h*0.9}" fill="none" stroke="${fg}" stroke-width="1.5" stroke-dasharray="8 4"/>
  <text x="${w/2}" y="${h/2 - 20}" font-family="Georgia,serif" font-size="${Math.min(w,h)*0.035}" font-weight="300" fill="${fg}" text-anchor="middle" dominant-baseline="middle">MALOM INVEST</text>
  <text x="${w/2}" y="${h/2 + 16}" font-family="Arial,sans-serif" font-size="${Math.min(w,h)*0.022}" fill="${TATAR_SAGE}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <text x="${w/2}" y="${h/2 + 44}" font-family="Arial,sans-serif" font-size="${Math.min(w,h)*0.016}" fill="${TATAR_SAGE}" text-anchor="middle" dominant-baseline="middle">${w} × ${h} — placeholder</text>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(dest);
}

// ── Create map SVG placeholder (PNG output) ───────────────────────────────
async function createMapPlaceholder(dest) {
  const w = 1200, h = 600;
  // Simplified world continents as abstract shapes in the brand palette
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${STONE}"/>

  <!-- Abstract continent outlines -->
  <!-- Europe/Africa -->
  <path d="M 410,120 Q 430,100 460,115 L 470,180 Q 450,200 440,230 L 420,280 Q 400,320 390,360 L 380,420 Q 370,450 360,460 L 340,440 Q 330,400 340,370 L 350,340 Q 360,300 370,270 L 380,220 Q 390,180 410,120 Z"
        fill="${TATAR_SAGE}" opacity="0.35"/>

  <!-- Americas -->
  <path d="M 200,110 Q 230,100 250,120 L 255,160 Q 265,190 260,220 L 240,260 Q 230,280 235,300 L 250,340 Q 260,380 245,420 L 230,460 Q 210,480 190,460 L 180,430 Q 175,400 185,370 L 195,330 Q 200,300 190,270 L 175,230 Q 165,200 170,160 L 185,120 Z"
        fill="${TATAR_SAGE}" opacity="0.35"/>

  <!-- Asia -->
  <path d="M 520,90 Q 580,80 650,95 L 720,110 Q 780,125 810,140 L 820,180 Q 800,210 770,220 L 730,230 Q 700,240 680,260 L 650,280 Q 620,270 600,255 L 570,240 Q 540,220 525,200 L 510,170 Q 505,140 520,90 Z"
        fill="${TATAR_SAGE}" opacity="0.35"/>

  <!-- Australia -->
  <path d="M 730,350 Q 770,340 800,355 L 820,390 Q 815,420 790,430 L 755,435 Q 725,425 715,400 L 720,370 Z"
        fill="${TATAR_SAGE}" opacity="0.35"/>

  <!-- Office location dots -->
  <!-- Cyprus -->
  <circle cx="510" cy="185" r="6" fill="${MALOM_BLUE}"/>
  <text x="510" y="172" font-family="Arial" font-size="10" fill="${MALOM_BLUE}" text-anchor="middle">Cyprus</text>

  <!-- Sweden -->
  <circle cx="470" cy="115" r="6" fill="${MALOM_BLUE}"/>
  <text x="470" y="102" font-family="Arial" font-size="10" fill="${MALOM_BLUE}" text-anchor="middle">Sweden</text>

  <!-- Poland -->
  <circle cx="488" cy="130" r="6" fill="${MALOM_BLUE}"/>
  <text x="488" y="117" font-family="Arial" font-size="10" fill="${MALOM_BLUE}" text-anchor="middle">Poland</text>

  <!-- Serbia -->
  <circle cx="493" cy="148" r="6" fill="${MALOM_BLUE}"/>
  <text x="505" y="161" font-family="Arial" font-size="10" fill="${MALOM_BLUE}" text-anchor="middle">Serbia</text>

  <!-- Middle East -->
  <circle cx="548" cy="195" r="6" fill="${MALOM_BLUE}"/>
  <text x="565" y="192" font-family="Arial" font-size="10" fill="${MALOM_BLUE}" text-anchor="middle">Middle East</text>

  <!-- Connection lines between locations -->
  <line x1="470" y1="115" x2="488" y2="130" stroke="${MALOM_BLUE}" stroke-width="0.8" opacity="0.4"/>
  <line x1="488" y1="130" x2="493" y2="148" stroke="${MALOM_BLUE}" stroke-width="0.8" opacity="0.4"/>
  <line x1="493" y1="148" x2="510" y2="185" stroke="${MALOM_BLUE}" stroke-width="0.8" opacity="0.4"/>
  <line x1="510" y1="185" x2="548" y2="195" stroke="${MALOM_BLUE}" stroke-width="0.8" opacity="0.4"/>

  <!-- Label -->
  <text x="${w/2}" y="${h - 28}" font-family="Arial,sans-serif" font-size="12" font-weight="600"
        fill="${TATAR_SAGE}" text-anchor="middle" letter-spacing="0.15em">PLACEHOLDER MAP — REPLACE WITH CUSTOM ASSET</text>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(dest);
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Malom Invest — Placeholder Image Fetcher');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const results = [];

  // ── Step 1: Download Unsplash images ─────────────────────────────────
  for (const target of TARGETS) {
    const dest = path.join(IMAGES_DIR, target.file);
    process.stdout.write(`▶ Downloading ${target.file} ... `);

    try {
      await download(target.url, dest);
      const dims = await getDimensions(dest);
      const size = fs.statSync(dest).size;
      console.log(`✓ ${dims.width}×${dims.height} (${humanSize(size)})`);
      results.push({
        file:   target.file,
        status: 'downloaded (Unsplash)',
        dims:   `${dims.width}×${dims.height}`,
        size:   humanSize(size),
      });
    } catch (err) {
      // Fallback: create SVG placeholder if download fails
      console.log(`⚠ Download failed (${err.message}) → creating SVG placeholder`);
      try {
        await createSvgPlaceholder(dest, target.w, target.h, target.note);
        const dims = await getDimensions(dest);
        const size = fs.statSync(dest).size;
        results.push({
          file:   target.file,
          status: 'SVG placeholder (download failed)',
          dims:   `${dims.width}×${dims.height}`,
          size:   humanSize(size),
        });
      } catch (svgErr) {
        console.error(`  ✗ Placeholder also failed: ${svgErr.message}`);
        results.push({ file: target.file, status: 'FAILED', dims: '—', size: '—' });
      }
    }
  }

  // ── Step 2: Create og-image.jpg from hero.jpg (1200×630 crop) ────────
  process.stdout.write('▶ Creating og-image.jpg from hero.jpg (1200×630 crop) ... ');
  const heroPath  = path.join(IMAGES_DIR, 'hero.jpg');
  const ogPath    = path.join(IMAGES_DIR, 'og-image.jpg');
  try {
    const heroMeta = await sharp(heroPath).metadata();
    // Centre-crop to 1200×630 (standard OG aspect ratio)
    await sharp(heroPath)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(ogPath);
    const dims = await getDimensions(ogPath);
    const size = fs.statSync(ogPath).size;
    console.log(`✓ ${dims.width}×${dims.height} (${humanSize(size)})`);
    results.push({
      file:   'og-image.jpg',
      status: 'cropped from hero.jpg',
      dims:   `${dims.width}×${dims.height}`,
      size:   humanSize(size),
    });
  } catch (err) {
    console.log(`⚠ Crop failed (${err.message}) → creating SVG placeholder`);
    await createSvgPlaceholder(ogPath, 1200, 630, 'Open Graph share image', MALOM_BLUE, '#ffffff');
    const dims = await getDimensions(ogPath);
    const size = fs.statSync(ogPath).size;
    results.push({
      file:   'og-image.jpg',
      status: 'SVG placeholder (crop failed)',
      dims:   `${dims.width}×${dims.height}`,
      size:   humanSize(size),
    });
  }

  // ── Step 3: Create map.png placeholder ───────────────────────────────
  process.stdout.write('▶ Creating map.png placeholder (branded SVG → PNG) ... ');
  const mapPath = path.join(IMAGES_DIR, 'map.png');
  try {
    await createMapPlaceholder(mapPath);
    const dims = await getDimensions(mapPath);
    const size = fs.statSync(mapPath).size;
    console.log(`✓ ${dims.width}×${dims.height} (${humanSize(size)})`);
    results.push({
      file:   'map.png',
      status: 'branded SVG placeholder',
      dims:   `${dims.width}×${dims.height}`,
      size:   humanSize(size),
    });
  } catch (err) {
    console.error(`✗ Map placeholder failed: ${err.message}`);
    results.push({ file: 'map.png', status: 'FAILED', dims: '—', size: '—' });
  }

  // ── Step 4: Write MAP_TODO.md ─────────────────────────────────────────
  const mapTodo = path.join(IMAGES_DIR, 'MAP_TODO.md');
  fs.writeFileSync(mapTodo, `# Map Image — Custom Generation Required

The file \`map.png\` is currently a branded placeholder.  
A custom world map asset should be generated before production launch.

## Recommended Prompt (Midjourney / Flux / Recraft / DALL-E)

> "Minimalist world map illustration, flat design, light grey silhouette continents
> on warm white (#FAFAF8) background, no country labels, no borders, subtle texture.
> Highlighted dots in deep blue (#315972) at: Cyprus, Sweden, Poland, Serbia,
> Middle East. Clean, editorial, architectural style. 1200×600px, PNG."

## Specifications

| Property | Value |
|----------|-------|
| Dimensions | 1200 × 600 px |
| Format | PNG (transparency optional) |
| Style | Minimalist, flat, no fills — outline only |
| Continent fill | #A2A094 (Tatar Sage) at 20–30% opacity |
| Office dots | #315972 (Malom Blue), 6–8px radius |
| Background | #FAFAF8 (Warm White) |
| Labels | None, or very small Inter Light |

## Drop-in Instructions

Replace \`images/map.png\` with the generated file.  
Dimensions must be exactly 1200×600 or the \`<img width="1200" height="600">\` 
attribute in \`index.html\` will cause layout shift.  
Run \`git add images/map.png && git commit -m "Replace map placeholder with final asset"\`.
`);
  console.log('▶ Written MAP_TODO.md');

  // ── Step 5: Summary table ─────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const col = (s, n) => String(s).padEnd(n);
  console.log(`  ${col('File', 22)} ${col('Status', 34)} ${col('Dimensions', 14)} ${col('Size', 10)}`);
  console.log(`  ${'-'.repeat(85)}`);
  for (const r of results) {
    const icon = r.status.includes('FAILED') ? '✗' : r.status.includes('placeholder') || r.status.includes('SVG') ? '⚠' : '✓';
    console.log(`  ${icon} ${col(r.file, 21)} ${col(r.status, 34)} ${col(r.dims, 14)} ${r.size}`);
  }
  console.log('');

  const failed = results.filter(r => r.status.includes('FAILED'));
  if (failed.length === 0) {
    console.log('  ✅ All images ready. Run the dev server and open http://localhost:3000');
  } else {
    console.log(`  ⚠  ${failed.length} image(s) failed — check errors above.`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\n✗ Fatal error:', err.message);
  process.exit(1);
});
