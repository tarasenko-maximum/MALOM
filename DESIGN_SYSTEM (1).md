---
name: Malom Architectural Narrative
colors:
  surface: '#faf9ff'
  surface-dim: '#d5d9ea'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edfe'
  surface-container-high: '#e4e8f9'
  surface-container-highest: '#dee2f3'
  on-surface: '#161b27'
  on-surface-variant: '#41474c'
  inverse-surface: '#2b303d'
  inverse-on-surface: '#edf0ff'
  outline: '#72787d'
  outline-variant: '#c1c7cd'
  surface-tint: '#3a637c'
  primary: '#315972'
  on-primary: '#ffffff'
  primary-container: '#4a728c'
  on-primary-container: '#e4f3ff'
  inverse-primary: '#a3cce9'
  secondary: '#605f54'
  on-secondary: '#ffffff'
  secondary-container: '#e6e3d5'
  on-secondary-container: '#66655a'
  tertiary: '#6a512c'
  on-tertiary: '#ffffff'
  tertiary-container: '#846941'
  on-tertiary-container: '#ffeedc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7e7ff'
  primary-fixed-dim: '#a3cce9'
  on-primary-fixed: '#001e2e'
  on-primary-fixed-variant: '#204b63'
  secondary-fixed: '#e6e3d5'
  secondary-fixed-dim: '#c9c7ba'
  on-secondary-fixed: '#1c1c14'
  on-secondary-fixed-variant: '#48473d'
  tertiary-fixed: '#ffddb1'
  tertiary-fixed-dim: '#e3c193'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#5a431f'
  background: '#faf9ff'
  on-background: '#161b27'
  surface-variant: '#dee2f3'
typography:
  display-lg:
    fontFamily: Merriweather
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Merriweather
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  max_width: 1280px
  section_padding: 120px
  gutter: 24px
  margin_mobile: 20px
  unit: 8px
---

## Brand & Style

This design system is built on the pillars of **Architectural Rigor** and **Quiet Luxury**. It targets high-net-worth investors and individuals who value precision, heritage, and modern sophistication. The visual direction leans into a "New Minimalist" aesthetic—where the emptiness of whitespace is as intentional as the structural elements themselves.

The core visual motif is the **Diamond**, derived from a 45-degree rotated square. This geometric constant serves as a grounding element across the interface, appearing in iconography, list markers, and as a subtle rhythmic separator in long-form editorial content. The tone is calm, confident, and authoritative, evoking the feeling of a private gallery or a bespoke architectural firm.

## Colors

The palette is rooted in nature and structural materials. 
- **Malom Blue (#4A728C):** A deep, petrol blue used for primary actions and brand presence.
- **Tatar Sage (#A2A094):** A bridge accent that softens the transition between the structural blue and the warm background.
- **Warm White & Stone:** These create a layered "gallery" effect, using the alternate stone color to define distinct functional zones without relying on harsh lines.
- **Bronze (#8B6F47):** Reserved exclusively for high-tier luxury indicators, such as "Available" tags on premium listings or decorative flourishes in the diamond motif.
- **Charcoal (#1A1F2B):** Used for all primary typography to ensure high legibility against the off-white backgrounds.

## Typography

The typographic hierarchy relies on the contrast between the intellectual, literary feel of **Merriweather** (as a high-quality alternative to Cormorant Garamond for digital screens) and the utilitarian precision of **Inter**. 

- **Headlines:** Set in light weights (300) with generous leading. Display styles should use slight negative letter-spacing to feel more "locked-in" and architectural.
- **Body Text:** Focuses on readability with a 1.7 line-height, allowing the text to breathe.
- **Labels:** Always uppercase with tracked-out letter spacing (0.1em) to create a premium, "stamped" appearance on cards and metadata.

## Layout & Spacing

The layout follows a strict **12-column fixed grid** with a maximum width of 1280px. 

- **Section Padding:** A standard 120px vertical gap between major sections ensures the design never feels crowded. 
- **Horizontal Rhythm:** Content should be centered with 24px gutters. On mobile, margins reduce to 20px, and the 120px section padding should be halved to 60px.
- **Asymmetry:** To reinforce the architectural theme, consider offsetting text blocks against imagery (e.g., a 7-column image paired with a 4-column text block starting on column 9).

## Elevation & Depth

This design system avoids traditional shadows in favor of **Tonal Layering** and **Structural Outlines**. 

- **Depth through Color:** Use the "Stone" background color to create depth behind "Warm White" cards. 
- **Interactions:** Hover states on cards should not lift via shadow, but rather through a subtle 1px border shift in the primary Malom Blue or a slight scale increase of the image within a clipped container.
- **Glassmorphism:** Reserved only for mobile navigation overlays or specific high-end "Property Overlay" badges, using a background blur of 12px and 80% opacity on the Warm White base.

## Shapes

The shape language is **Architectural & Sharp**. 

- **Primary Radius:** A 2px radius is applied to buttons and inputs to prevent "surgical" sharpness while maintaining a hard-edged, structural look.
- **The Diamond:** Icons must be enclosed in or utilize a 45-degree rotated square. For example, a "Play" button for a property tour should be a diamond shape rather than a circle.
- **Images:** All property photography should remain perfectly square (0px radius) to emphasize the grid.

## Components

### Buttons
- **Primary:** Solid Malom Blue fill, 2px radius, white Inter Medium text.
- **Secondary (Ghost):** 1px Malom Blue or Charcoal border, 2px radius, transparent background.
- **Tertiary:** Text-only with a small 4px diamond icon following the label.

### Input Fields
- **Architecture Style:** Borderless except for a 1px Charcoal bottom line. 
- **Labels:** Floating labels that transition from body-md to label-sm (uppercase) upon focus.
- **Focus State:** The bottom line thickens to 2px in Malom Blue.

### Cards
- **Property Card:** 0px radius images. Information is displayed below the image on the "Stone" background.
- **Metadata:** Use the Diamond motif as a separator between "Beds" and "Baths" specs.

### Lists
- Standard bullet points are replaced with 4px x 4px Malom Blue diamonds, centered vertically with the first line of text.

### Dividers
- Use thin 1px Tatar Sage lines. Occasionally place a small Bronze diamond in the horizontal center of a divider to signify a transition to a "Premium" section.