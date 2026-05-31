# Malom Invest — Production Website

**Malom Invest** is a premium international real estate developer. This repository
contains the production-ready static landing page targeting the Serbian market entry.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| HTML5 | Structure |
| Tailwind CSS v3 (CLI) | Styling — compiled, no CDN |
| Vanilla JS | Interactions (no framework) |
| Formspree | Contact form backend (no server required) |
| Google Fonts | Inter + Merriweather |

---

## Local Development

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- npm (comes with Node)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Tailwind in watch mode
npm run dev

# 3. In a separate terminal, serve the site locally
npx serve . -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The site requires `dist/output.css` to be compiled before it renders correctly.
> Always run `npm run dev` or `npm run build` first.

---

## Production Build

```bash
npm run build
```

This compiles and **minifies** `dist/output.css`. Commit both `index.html` and `dist/output.css`
to your repository before deployment.

---

## Deployment

### Option A — Vercel (Recommended)

1. Install [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`
2. Run `npm run build` first
3. Run `vercel` in the project directory
4. Follow the prompts — select "Static Site"

Alternatively, connect the GitHub repository to Vercel's dashboard for auto-deploy on push.

The included `vercel.json` sets correct routing and cache headers.

**Build command (in Vercel dashboard):** `npm run build`  
**Output directory:** `.` (the project root)

---

### Option B — Netlify

1. Run `npm run build` first
2. Drag-and-drop the project folder at [netlify.com/drop](https://netlify.com/drop)

Or connect your GitHub repo for auto-deploy. The included `netlify.toml` configures
the build command and publish directory.

**Build command:** `npm run build`  
**Publish directory:** `.` (project root)

---

### Option C — Any Static Host

After running `npm run build`, upload the entire project folder to any static file host
(AWS S3 + CloudFront, DigitalOcean Spaces, GitHub Pages, etc.).

Required files for deployment:
```
index.html
dist/output.css
src/main.js
favicon.svg
images/        (all image files)
Логотипы/      (logo files)
```

---

## Domain Setup (malominvest.com)

1. Purchase `malominvest.com` at your registrar (Namecheap, GoDaddy, etc.)
2. If using **Vercel**: Add domain in Vercel dashboard → Domains → Add domain.
   Vercel provides the DNS records (A + CNAME) to add at your registrar.
3. If using **Netlify**: Add domain in Netlify dashboard → Domain settings.
4. SSL/TLS is handled automatically by both platforms.

**Recommended DNS records for Vercel:**
```
A     @   76.76.21.21
CNAME www cname.vercel-dns.com
```

---

## Contact Form — Formspree Setup

The form uses [Formspree](https://formspree.io) — a no-backend form service.

**One-time setup:**

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Click **New Form** → name it "Malom Invest Inquiry"
3. Copy the endpoint URL: `https://formspree.io/f/xxxxxxxx`
4. Open `index.html` and find:
   ```html
   action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID"
   ```
5. Replace `REPLACE_WITH_YOUR_FORMSPREE_ID` with your actual form ID (e.g., `xyzabcde`)
6. All submissions go to the email you used to register with Formspree

**Free plan:** 50 submissions/month  
**Gold plan (€10/mo):** Unlimited submissions, GDPR compliance, file uploads

---

## Images — Client Deliverables Required

Place final images in the `/images/` directory. Replace placeholders before going live.

| Filename | Dimensions | Content Description |
|----------|-----------|---------------------|
| `hero.jpg` | 1920×1080px | **Hero background** — Cinematic wide-angle shot of minimalist concrete/glass structure at dusk. Blue hour lighting, soft mist, warm interior glow. High-end architectural photography. |
| `product-1.jpg` | 800×1000px | **Elite Residential** — Ultra-modern residential building facade, preferably in Sweden. Clean white planes, natural oak accents, large windows reflecting a garden. High-key, minimalist lighting. |
| `product-2.jpg` | 800×1000px | **Commercial Icons** — Expansive minimalist commercial atrium with high ceilings and geometric glass installations. Polished grey stone floor. Corporate headquarters feel. |
| `map.png` | 1200×600px | **World Map** — Minimalist world map (light grey line art) with subtle markers on Cyprus, Sweden, Poland, Middle East, Serbia. Clean and elegant. |
| `tatar-hill.jpg` | 800×600px | **Tatar Hill** — Architectural visualization of luxury villa on Serbian hillside at sunrise. Expansive glass walls, cantilevered infinity pool, natural stone cladding. |
| `og-image.jpg` | 1200×630px | **Social Share Image** — Used for Open Graph / Twitter Card previews when the site is shared on social media. Should contain brand + hero visual. |

**Image optimization notes:**
- Use JPEG for photos (80–85% quality in ImageOptim or Squoosh)
- Use WebP with a JPEG fallback for maximum compatibility
- Hero image must be ≤300 KB (critical for LCP/Lighthouse score)

---

## Logo Files (Already Included)

| File | Usage |
|------|-------|
| `Логотипы/1.png` | Full horizontal lockup — used in nav and footer |
| `Логотипы/2.png` | M icon mark — can be used as favicon or app icon |
| `Логотипы/3.png` | Tatar Hill full logo |
| `Логотипы/4.png` | Tatar Hill icon mark |

For production, copy logos to `/images/` and update paths in `index.html`.

---

## Internationalization (i18n) — Phase 2

The site is currently **English only**. All text content is wrapped in semantic HTML
elements (`<p>`, `<h1>`–`<h4>`, `<span>`, `<address>`) making it straightforward to
extract into a translation layer.

**Planned languages:** English (en), Serbian (sr), Russian (ru)

When multilang is implemented:
1. Swap `<html lang="en">` to the active locale (`sr`, `ru`, etc.)
2. Create `/sr/index.html` and `/ru/index.html` with translated strings
3. Add `<link rel="alternate" hreflang="sr" href="/sr/" />` tags
4. Update sitemap with all language variants

---

## Project Structure

```
/
├── index.html              ← Main page (edit content here)
├── package.json            ← npm scripts
├── tailwind.config.js      ← Design tokens (colors, typography, spacing)
├── postcss.config.js       ← PostCSS config
├── vercel.json             ← Vercel deployment config
├── netlify.toml            ← Netlify deployment config
├── .gitignore
├── favicon.svg             ← SVG favicon placeholder
├── README.md               ← This file
├── src/
│   ├── input.css           ← Tailwind source (edit globals here)
│   └── main.js             ← Reveal animations + form logic
├── dist/
│   └── output.css          ← Compiled CSS (generated by npm run build)
└── images/
    ├── README.md           ← Image specifications
    └── (placeholder for client images)
```

---

## Going Live Checklist

- [ ] Run `npm run build` and verify `dist/output.css` is generated
- [ ] Replace all images in `/images/` with client-provided assets
- [ ] Set up Formspree and replace form ID in `index.html`
- [ ] Update canonical URL `<link rel="canonical">` with live domain
- [ ] Update all `og:url` and `og:image` meta tags with live domain
- [ ] Replace JSON-LD URLs with live domain
- [ ] Replace LinkedIn/Instagram `href` with actual profile URLs
- [ ] Replace phone number (`+357 25 000 000`) with real number
- [ ] Generate proper favicon from `Логотипы/2.png` using realfavicongenerator.net
- [ ] Run Lighthouse audit: target Performance >90, Accessibility >95, SEO 100
- [ ] Test contact form end-to-end (submit → check email)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Configure domain DNS records
