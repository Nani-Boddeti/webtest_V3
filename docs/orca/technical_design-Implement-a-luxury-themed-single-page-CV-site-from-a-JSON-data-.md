# technical_design: Implement a luxury-themed single-page CV site from a JSON data file, with animated skill bars, PDF download, dynamic fav

Status: draft

## riskNotes

- cv-data.json is assumed valid; malformed data may cause incomplete rendering. Reliance on external CDN for html2pdf.js poses availability risk, but page functions without it until download. Print fidelity may vary across browsers; CSS adjustments for PDF identified but may need tweaking. No offline capability for external image URLs.

## backendPlan

- Not applicable – this is a static frontend site with no backend.

## agentHandoff

- After completing each task, verify acceptance criteria: page loads, data renders correctly, luxury theme tokens present, skill bars animate on scroll, PDF includes all content and avatar, favicon auto-generated (or fallback), valid JSON-LD, correct SEO meta tags, keyboard accessible. Test with sample cv-data.json and real JSON variants.

## databasePlan

- Not applicable – no database required.

## frontendPlan

- Single index.html file. JavaScript loads cv-data.json, populates all sections. IntersectionObserver used for skill bar animation. Canvas API generates favicon. Meta tags and JSON-LD injected after data load. html2pdf.js attached to a button for PDF download. No frontend frameworks; only vanilla JavaScript and one CDN library.

## testStrategy

- Manual in-browser testing: load page, verify all sections populate, check console for errors, inspect skill bar animation via scroll, click PDF download and review output, inspect favicon (tab icon), validate JSON-LD with structured data testing tool, check <title> and meta tags in document head, test mobile viewport responsiveness.

## dependencyPlan

- Zero runtime dependencies except html2pdf.js loaded from CDN. All other resources (fonts) loaded via Google Fonts CSS link. Project contains only index.html and cv-data.json.

## lowLevelDesign

- Single static HTML file with embedded CSS and JavaScript, using no build tools or frameworks.
- Theme tokens defined as CSS custom properties: --bg #FFFFFF, --text #333333, --gold #C9A84C, --gold2 #E5C158, --font-heading 'Lora', --font-body 'Open Sans', etc.
- Data loaded from cv-data.json using fetch; minimal error handling (console.warn on missing fields).
- Semantic HTML with <header>, <main>, <section>, <article>, and ARIA roles for accessibility.
- Avatar rendered as <img> with onerror fallback to initials (CSS-styled circle).
- Skill bars implemented as <div> with inner fill; animation via IntersectionObserver triggering CSS transition on width.
- PDF download button triggers html2pdf.js (loaded via CDN) to clone the visible DOM, replace animated skill bars with static filled representations, and export.
- Favicon generated using <canvas>: draw avatar (or initials) onto a small canvas, convert to data URI (or use default if no avatar).
- SEO: <title> and <meta> tags dynamically inserted from JSON; JSON-LD Person schema embedded in a <script type='application/ld+json'> tag.
- Responsive design handled via media queries with max-width container (960px).

## blockedOnIntegrations


## implementationRoadmap

- Step 1 (Scaffolding): Set up project folder, create cv-data.json with sample data and schema comments, build index.html boilerplate with data fetching and error logging.
- Step 2 (Core Layout): Implement all sections with luxury theme, static skill bars, avatar fallback, responsive CSS.
- Step 3 (Enhancements): Add skill bar animations, PDF generation, favicon via canvas, JSON-LD, meta tags, and accessibility checks.

## implementationApproach

- Iterative: first scaffold project with sample data and skeleton, then build static luxury layout, finally add animations, PDF, favicon, SEO, and polish accessibility.
