# technical_design: Build a static beauty tips website with home, tips listing, tip detail, and 404 pages. Data is loaded from a local JSON 

Status: draft

## riskNotes

- Risk: Browser same-origin policy may block fetch() if index.html is opened via file:// protocol. Mitigation: Develop and test using a local HTTP server (live-server). Risk: Images may not load; implement fallback. Low overall risk.

## backendPlan


## agentHandoff

- The agent should build a static SPA with hash routing. Use the file structure: /index.html, /css/style.css, /js/app.js, /data/tips.json, /images/ (optional). In app.js, start with: fetch tips.json, store in variable. Router reads hash, extracts route and optional param, matches to a component function. Components return HTML; they are injected into a main element. Navigation bar links trigger hash changes. For images, use onerror attribute to set a placeholder. Ensure responsive design with CSS Grid or Flexbox. All styling mobile-first. Test with the provided acceptance criteria. Do not introduce any backend or builder tools; the site must run by simply opening index.html in a browser via an HTTP server. Use live-server for development.

## databasePlan


## frontendPlan

- Implement with plain HTML, CSS, and JavaScript. Single HTML file with viewport meta for responsiveness. CSS: custom properties for theme, BEM-style naming for clarity, mobile-first responsive breakpoints. JavaScript: use ES6 modules if needed, but plain scripts acceptable. Main app.js: initialize router on DOMContentLoaded, fetch tips.json, then render current route. Router: parse window.location.hash, match patterns, call render function. Components are pure functions that return HTML strings to be injected into DOM. Navigation bar: built as a static part of index.html, with highlight class set by JS. Data handling: cache the fetched tips in a module variable. Error handling: catch fetch errors, show error message; image onerror sets src to placeholder; if route param id not found, show 404. Testing: manual browser testing across devices.

## testStrategy

- Manual testing against acceptance criteria: Navigate to each route, verify content, check responsive layout by resizing browser, test image fallback by breaking image URL, test empty tips array, test unknown route shows 404. Use browser dev tools for network throttling to check load time. Validate HTML and CSS via W3C validators.

## dependencyPlan

- No external dependencies. A local development HTTP server is recommended (e.g., npx live-server). Optional: use a CSS reset/normalize from a CDN, but not required. The site is fully self-contained.

## lowLevelDesign

- Architecture: Single Page Application (SPA) using vanilla HTML, CSS, and JavaScript. No frameworks, no backend. All content is static. Routing: Using hash-based routing (e.g., #/tips, #/tips/:id) to avoid server-side routing needs. Data: tips.json file contains array of tip objects with fields: id, title, summary, fullContent, category, imageUrl, isFeatured, tags. JavaScript fetches this file at runtime. Components: Main script loads JSON, initializes a router that monitors hash changes. For each route, it clears the main content area and renders a component: home component shows up to 3 featured tips (isFeatured=true); tips component shows all tips as cards; detail component shows the full tip for a given id. 404 component for unknown routes. Styling: Responsive CSS with media queries for mobile (<768px), tablet (768-1024px), desktop (>1024px). Navigation: fixed header with links to Home and Tips, current page highlighted. Image fallback: onerror handler to replace with placeholder. Empty state: if tips array is empty, tips page shows 'No tips available yet.' File structure: index.html, style.css, app.js, tips.json, images/. Development: served via a local HTTP server (e.g., live-server) to allow fetch requests.

## blockedOnIntegrations


## implementationRoadmap

- Step 1: Project scaffold and data model - Create file structure, index.html with meta and empty app shell, style.css with CSS custom properties and base styles, app.js with router skeleton, tips.json with sample data.
- Step 2: Core page components - Implement home, tips listing, tip detail, and 404 page rendering with data binding. Ensure navigation works and images have fallback.
- Step 3: Responsive design and polish - Apply responsive breakpoints, finalize styling, highlight active nav link, handle edge cases (empty list, error on fetch).

## implementationApproach

- Agile, incremental delivery. First, set up project scaffold with data and basic router. Second, build all page components and wire up navigation. Third, apply responsive design and final polish. Each task should be validated against acceptance criteria before proceeding. Use feature branches per task, merge to main after validation.
