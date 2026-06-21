# technical_design: Create a static HTML/CSS perfume showcase site with home, listing, and detail pages. The site uses CSS-only responsive n

Status: draft

## riskNotes

- No significant risks. Ensure images are linked correctly and have correct filenames. Responsive nav must function without JavaScript. Fallback fonts are provided in case Google Fonts CDN fails.

## backendPlan


## agentHandoff

- Execution agent should produce a complete static site. Start by scaffolding the folder structure and global CSS. Then build each HTML page using the provided dataset and copy. Implement CSS-only responsive nav. Generate placeholder images exactly as specified (size, color, text). Verify each page matches acceptance criteria, including links, image sources, and content accuracy. No build step required; the site works by opening files locally.

## databasePlan


## frontendPlan

- Implement all HTML pages with semantic structure, link to external CSS, import Google Fonts (Playfair Display, Lato). CSS handles layout, responsive nav, card styling, and visual effects per color palette and specifications. Placeholder images generated with exact dimensions, backgrounds, and text styling (Playfair Display italic 24px white). Ensure accessibility: alt text, semantic tags.

## testStrategy

- Manual verification: open each HTML file, check layout, navigation, card design, detail page information, image display, and responsive breakpoints. Validate HTML using W3C validator.

## dependencyPlan

- Only dependency is Google Fonts CDN for typography. Ensure local fallback (e.g., `font-family: 'Playfair Display', serif;`). No other external services.

## lowLevelDesign

- File structure:
- index.html (home page)
- listing.html (collection listing)
- detail-eclat-de-nuit.html
- detail-noir-velours.html
- detail-bois-dete.html
- detail-oud-mystique.html
- css/styles.css (global styles: typography, colors, layout, card, button, responsive nav)
- images/ (eclat-de-nuit.jpg, noir-velours.jpg, bois-dete.jpg, oud-mystique.jpg; 300x400px each with specified background colors and text)
Navigation: CSS-only hamburger using checkbox hack; horizontal on >768px.
No JavaScript; all interactivity via CSS.

## blockedOnIntegrations


## implementationRoadmap

- Set up repository structure (css/, images/ folders)
- Create global styles (colors, typography, buttons, cards, responsive nav)
- Build index.html (hero, CTA, contact)
- Build listing.html (perfume cards from hardcoded data)
- Build four detail pages (brand, name, notes, family, year, description)
- Generate four placeholder images with specified attributes
- Test all links, responsive behavior, and visual consistency

## implementationApproach

- Write static HTML and CSS directly. Use CSS checkbox hack for menu. Create images using a simple script (e.g., Python with Pillow) or manually via image editor. All pages link together correctly. Validate HTML and ensure cross-browser compatibility.
