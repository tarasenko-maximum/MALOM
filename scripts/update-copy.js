/**
 * scripts/update-copy.js
 * Updates all site copy for the Malom Invest repositioning (investment -> premium homes).
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Helper to log and verify replacement
function replaceString(oldStr, newStr) {
  if (html.includes(oldStr)) {
    html = html.split(oldStr).join(newStr);
    console.log(`✓ Replaced: "${oldStr.substring(0, 40)}..."`);
  } else {
    console.warn(`⚠ Could not find: "${oldStr.substring(0, 40)}..."`);
  }
}

console.log('--- Updating copy in public/index.html ---');

// 1. Title & Meta
replaceString(
  '<title>Malom Invest — Crafting Legacies. Building the Future.</title>',
  '<title>Malom Invest — Homes that live with you.</title>'
);

replaceString(
  '<meta name="description" content="Uncompromising standards of premium real estate since 2016. International expertise embodied in every square meter." />',
  '<meta name="description" content="Premium residences in Serbia and across Europe. Natural materials, intelligent comfort, uncompromising craftsmanship — since 2016." />'
);

// 2. Hero Section
replaceString(
  'Crafting Legacies. <br /> Building the Future.',
  'Homes that live with you.'
);

// Match the exact multi-line structure of the subhead
const oldSubhead = `Uncompromising standards of premium real estate since 2016.<br class="hidden md:block" />
        International expertise embodied in every square meter.`;
const newSubhead = `Premium residences designed for the rhythm of daily life. <br class="hidden md:block" />
        Natural materials, intelligent comfort, and uncompromising craftsmanship — since 2016.`;
replaceString(oldSubhead, newSubhead);

replaceString(
  'Explore Estates',
  'Discover Our Homes'
);

// 3. Block 2: Philosophy / Heritage
replaceString(
  'Our Heritage</p>',
  'OUR PHILOSOPHY</p>'
);

replaceString(
  'Architectural Rigor. Financial Precision.',
  'Built for the way you live.'
);

const oldBodyParagraph = `Malom Invest represents a synthesis of classical investment principles and
          cutting-edge architectural vision. We don't just develop properties; we curate
          enduring assets that stand as monuments to quiet luxury and structural integrity.`;
const newBodyParagraph = `Since 2016, Malom Invest has been creating premium residences that put people first. Every detail — from the choice of natural stone to the temperature of the morning light through your kitchen window — is considered for one purpose: a home that feels like yours from the first day.`;
replaceString(oldBodyParagraph, newBodyParagraph);

replaceString(
  'Global<br />Developments',
  'Homes<br />Delivered'
);

replaceString(
  'Strategic<br />Hubs',
  'Countries of<br />Experience'
);

// 4. Block 3: Portfolios (Two ways to come home)
replaceString(
  '<h2 id="portfolios-heading" class="sr-only">Our Portfolios</h2>',
  '<h2 id="portfolios-heading" class="sr-only">Two ways to come home.</h2>'
);

replaceString(
  '<h3 class="font-headline-md text-headline-md mb-4">Elite Residential</h3>',
  '<h3 class="font-headline-md text-headline-md mb-4">Private Residences</h3>'
);

replaceString(
  'Bespoke living environments designed for privacy, wellness, and multi-generational legacy.',
  'Standalone homes and villas surrounded by nature. For families seeking quiet, space, and a place where children grow up among trees, not traffic.'
);

replaceString(
  '<h3 class="font-headline-md text-headline-md mb-4">Commercial Icons</h3>',
  '<h3 class="font-headline-md text-headline-md mb-4">Boutique Apartments</h3>'
);

replaceString(
  'High-performance commercial spaces that define the skyline and foster innovation through architectural clarity.',
  'Limited collections of premium apartments in carefully chosen city locations. Each building hosts only 6 to 10 families — intimate scale, full amenities, complete privacy.'
);

// 5. Block 4: Philosophy Quote and Pillars
replaceString(
  '"Perfectionism comes as standard."',
  '"A home is not a structure. It is the air your child breathes."'
);

replaceString(
  '<h3 id="phil-1-heading" class="font-headline-md text-headline-md mb-6">Material Honesty</h3>',
  '<h3 id="phil-1-heading" class="font-headline-md text-headline-md mb-6">Materials That Age With Grace</h3>'
);

const oldPillar1Body = `Sourcing the finest raw materials—travertine, aged oak, and brushed steel—to ensure
          tactile luxury in every square inch.`;
const newPillar1Body = `Natural travertine, century-old European oak, hand-finished brass. We choose materials that become more beautiful over decades — not less. Your home tells your family's story through its surfaces.`;
replaceString(oldPillar1Body, newPillar1Body);

replaceString(
  '<h3 id="phil-2-heading" class="font-headline-md text-headline-md mb-6">Digital Precision</h3>',
  '<h3 id="phil-2-heading" class="font-headline-md text-headline-md mb-6">Intelligence In The Background</h3>'
);

const oldPillar2Body = `Integrating seamless smart-home technology that anticipates needs without ever
          intruding on the aesthetic harmony.`;
const newPillar2Body = `Climate adjusts itself before you feel the change. Lighting matches the hour and your mood. Security operates silently. Technology serves the rhythm of your life — and stays out of sight.`;
replaceString(oldPillar2Body, newPillar2Body);

replaceString(
  '<h3 id="phil-3-heading" class="font-headline-md text-headline-md mb-6">Absolute Privacy</h3>',
  '<h3 id="phil-3-heading" class="font-headline-md text-headline-md mb-6">Built To Outlast Us</h3>'
);

const oldPillar3Body = `Our developments are sanctuaries. Acoustic engineering and strategic layout ensure
          total seclusion in urban environments.`;
const newPillar3Body = `Solar integration, rainwater recovery, geothermal climate, A+ insulation standards. Our homes are designed for the next 100 years — for your children, and theirs. Quiet luxury includes responsibility.`;
replaceString(oldPillar3Body, newPillar3Body);

// Pillar Icons
replaceString(
  'landscape',
  'park'
);
replaceString(
  'architecture',
  'auto_awesome'
);
replaceString(
  'shield',
  'eco'
);

// 6. Block 5: International Experience
replaceString(
  'Our Network</p>',
  'OUR EXPERIENCE</p>'
);

// Main Network Headline & adding new body paragraph
const oldNetworkHeader = `<p class="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4">OUR EXPERIENCE</p>
      <h2 id="network-heading" class="font-headline-lg text-headline-lg">International Presence</h2>`;
const newNetworkHeader = `<p class="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4">OUR EXPERIENCE</p>
      <h2 id="network-heading" class="font-headline-lg text-headline-lg">Eight years of expertise. Now at home in Serbia.</h2>
      <p class="mt-6 font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
        Whether built into a Cypriot hillside or nestled in a Stockholm suburb, every Malom residence shares one principle: a home is the most personal thing a person owns. We honor that — everywhere we build.
      </p>`;
replaceString(oldNetworkHeader, newNetworkHeader);

// Serbia Subsection
replaceString(
  '<h3 class="font-headline-lg text-headline-lg mb-6">Now in Serbia</h3>',
  '<h3 class="font-headline-lg text-headline-lg mb-6">And now — at home in Serbia.</h3>'
);

const oldSerbiaBody = `Introducing <strong>Tatar Hill</strong>—a landmark development in the heart of the Balkans.
              A fusion of local heritage and Malom's signature minimalist rigor.`;
const newSerbiaBody = `Tatar Hill is our flagship residence on Serbian soil. Twelve apartments. Two boutique buildings. Located in Novi Sad where Balkan heritage meets European refinement.`;
replaceString(oldSerbiaBody, newSerbiaBody);

replaceString(
  'Discover Tatar Hill',
  'Visit Tatar Hill'
);

// 7. Block 6: Partners
replaceString(
  'Global Strategic Partners',
  'Crafted With The Best'
);

// 8. Block 7: Future Vision
replaceString(
  'Our Future Vision',
  'Investments In The Future.'
);

// Commitments with new titles and bodies
const oldComm1 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="Strategic vision plan year: 2028">2028</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]">Strategic Vision Plan</p>`;
const newComm1 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="Net-zero new builds year: 2028">2028</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-semibold">Net-Zero New Builds</p>
        <p class="mt-4 font-body-md text-body-md text-secondary max-w-xs mx-auto">All homes from 2028 will operate with zero carbon emissions.</p>`;
replaceString(oldComm1, newComm1);

const oldComm2 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="Plus 3 new markets emerging">+3</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]">New Markets Emerging</p>`;
const newComm2 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="Three new residences in the Balkans">+3</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-semibold">New Residences In The Balkans</p>
        <p class="mt-4 font-body-md text-body-md text-secondary max-w-xs mx-auto">Three more boutique buildings over five years.</p>`;
replaceString(oldComm2, newComm2);

const oldComm3 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="5 star sustainable excellence">5★</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]">Sustainable Excellence</p>`;
const newComm3 = `<p class="font-display-lg text-display-lg text-primary mb-4" aria-label="Concierge service: 5 stars">5★</p>
        <p class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-semibold">Concierge Service</p>
        <p class="mt-4 font-body-md text-body-md text-secondary max-w-xs mx-auto">Personal property management for every Malom home, in every city.</p>`;
replaceString(oldComm3, newComm3);

// 9. Block 8: Contact Form
const oldContactHeading = `<h2 id="contact-heading" class="font-headline-lg text-headline-lg mb-12">
          Connect With <br />Our Portfolio.
        </h2>`;
const newContactHeading = `<h2 id="contact-heading" class="font-headline-lg text-headline-lg mb-6">
          Talk with us about your next home.
        </h2>
        <p class="font-body-lg text-body-lg text-white/70 mb-12">
          Whether you're considering Tatar Hill or curious about future projects — let's start the conversation.
        </p>`;
replaceString(oldContactHeading, newContactHeading);

replaceString(
  'Submit Inquiry',
  'Begin the Conversation'
);

replaceString(
  'aria-label="Submit your investment inquiry"',
  'aria-label="Begin the conversation"'
);

replaceString(
  '<h3 class="font-headline-md text-headline-md mb-4">Thank You</h3>',
  '<h3 class="font-headline-md text-headline-md mb-4">Thank you — we\'ll be in touch.</h3>'
);

replaceString(
  'Your inquiry has been received. A member of our team will be in touch within 24 hours.',
  'Your message has been received. A member of our team will reach out personally within 24 hours.'
);

// Save output
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('--- HTML copy update completed ---');
