/**
 * scripts/update-copy-final.js
 * Performs the final copy updates and accessibility alt text updates in public/index.html.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function replaceString(oldStr, newStr) {
  if (html.includes(oldStr)) {
    html = html.split(oldStr).join(newStr);
    console.log(`✓ Replaced: "${oldStr.substring(0, 45)}..."`);
  } else {
    console.warn(`⚠ Could not find: "${oldStr.substring(0, 45)}..."`);
  }
}

console.log('--- Updating final copy in public/index.html ---');

// 1. Meta descriptions (including Open Graph / Twitter)
replaceString(
  '<meta name="description" content="Premium residences in Serbia and across Europe. Natural materials, intelligent comfort, uncompromising craftsmanship — since 2016." />',
  '<meta name="description" content="Premium residences in Serbia and across Europe. Hillside and urban homes designed for the rhythm of daily life — since 2016." />'
);

replaceString(
  '<meta property="og:description" content="Premium residences in Serbia and across Europe. Natural materials, intelligent comfort, uncompromising craftsmanship — since 2016." />',
  '<meta property="og:description" content="Premium residences in Serbia and across Europe. Hillside and urban homes designed for the rhythm of daily life — since 2016." />'
);

replaceString(
  '<meta name="twitter:description" content="Premium residences in Serbia and across Europe. Natural materials, intelligent comfort, uncompromising craftsmanship — since 2016." />',
  '<meta name="twitter:description" content="Premium residences in Serbia and across Europe. Hillside and urban homes designed for the rhythm of daily life — since 2016." />'
);

// 2. Block 3 (Portfolios/Products restructure: Hillside & Urban Residences)
replaceString(
  '<h3 class="font-headline-md text-headline-md mb-4">Private Residences</h3>',
  '<h3 class="font-headline-md text-headline-md mb-4">Hillside Residences</h3>'
);

replaceString(
  'Standalone homes and villas surrounded by nature. For families seeking quiet, space, and a place where children grow up among trees, not traffic.',
  'Set in the protected landscapes of Vojvodina — surrounded by mature forest, panoramic views, and the quiet that only altitude provides. Each Malom hillside building hosts only 6 families. Underground parking, terraces on every floor, oak interiors. The address where Belgrade\'s professionals come to disconnect.'
);

replaceString(
  '<h3 class="font-headline-md text-headline-md mb-4">Boutique Apartments</h3>',
  '<h3 class="font-headline-md text-headline-md mb-4">Urban Residences</h3>'
);

replaceString(
  'Limited collections of premium apartments in carefully chosen city locations. Each building hosts only 6 to 10 families — intimate scale, full amenities, complete privacy.',
  'Boutique apartment buildings designed for the heart of refined European cities. The same intimate scale, the same uncompromising materials — adapted to urban life. Available across our European footprint: Cyprus, Stockholm, Warsaw, Belgrade.'
);

// 3. Block 5 (Serbia section updates)
replaceString(
  '<h3 class="font-headline-lg text-headline-lg mb-6">And now — at home in Serbia.</h3>',
  '<h3 class="font-headline-lg text-headline-lg mb-6">Tatar Hill — at the highest residence in Vojvodina.</h3>'
);

replaceString(
  'Tatar Hill is our flagship residence on Serbian soil. Twelve apartments. Two boutique buildings. Located in Novi Sad where Balkan heritage meets European refinement.',
  'Tatar Hill rises on the northern slopes of Fruška Gora — the highest residential point near Novi Sad. Two boutique buildings. Twelve apartments. Surrounded by Europe\'s leading respiratory and cardiology institutes — independent confirmation of the cleanest air in Vojvodina. Fifteen minutes to the city center. A thousand years from its noise.'
);

replaceString(
  'Visit Tatar Hill <span class="material-symbols-outlined"',
  'Discover Tatar Hill <span class="material-symbols-outlined"'
);

// 4. Alt Text Updates for Accessibility
replaceString(
  'alt="Minimalist luxury architectural building at dusk — Malom Invest flagship project"',
  'alt="Malom Invest residence — contemporary white building with cherry blossoms in spring garden"'
);

replaceString(
  'alt="Elite Residential development — modern Swedish villa with natural materials and expansive glass façade"',
  'alt="Hillside Residences — aerial view of Malom building integrated with Vojvodina forest, with Danube valley in distance"'
);

replaceString(
  'alt="Commercial Icons development — minimalist atrium with geometric glass installations and high ceilings"',
  'alt="Urban Residences — contemporary low-rise apartment building on tree-lined European street"'
);

replaceString(
  'alt="Tatar Hill — luxury villa development on a Serbian hillside at sunrise with panoramic valley views"',
  'alt="Tatar Hill on Fruška Gora — Malom Invest flagship residence with panoramic view of Danube and Novi Sad"'
);

replaceString(
  'alt="World map showing Malom Invest international presence in Cyprus, Sweden, Poland, Middle East, and Serbia"',
  'alt="Malom Invest international presence across Cyprus, Sweden, Poland, Middle East, and Serbia"'
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('--- Final copy update completed ---');
