# technical_design: Build a static Next.js website for beauty tips with homepage featuring hero and featured tips, listing page with paginat

Status: draft

## riskNotes

- No external dependencies, low risk. All content is static, no authentication or dynamic data. Risk of missing SEO or performance best practices is mitigated by using Next.js defaults and static generation.

## backendPlan


## agentHandoff

- Agent for Step 1 will initialize the Next.js project, add Tailwind, create the data model, and prepare the JSON file. Agent for Steps 2–4 will implement page components and data integration. The same agent may handle all page implementations sequentially. No backend agent needed. Ensure each page is a separate server component with static generation.

## databasePlan


## frontendPlan

- Framework: Next.js with App Router. Language: TypeScript. Styling: Tailwind CSS. Components: Hero (title, subtitle, CTA button), TipCard (title, category, excerpt), PaginationControls, TipDetail (full content). Pages: HomePage (hero + featured tips), ListingPage (paginated tips), DetailPage (single tip). Data fetching: Import tips array from data module, filter/sort as needed. PWA: not required. Testing: manual visual verification against acceptance criteria, Lighthouse audit.

## testStrategy

- Verify against acceptance criteria: homepage hero text, CTA button, featured tips display, listing pagination (3 pages, 10 tips each), detail page content and categories. Run Lighthouse audit to confirm LCP <2s desktop, <2.5s mobile. Test on common mobile/desktop viewports for responsiveness.

## dependencyPlan

- None. All required libraries are included in the Next.js + Tailwind setup.

## lowLevelDesign

- Architecture: Next.js 14+ with App Router and TypeScript. All pages are server components that read from a static JSON data file at build time, achieving full static generation. No runtime server or API required. Styling: Tailwind CSS for utility-first responsive design; hero uses CSS gradient background (no images). Routes: / (homepage, server component), /tips/page/[page] (listing with pagination, generateStaticParams for pages 1..ceil(tips.length/10)), /tips/[id] (detail, generateStaticParams for all tip IDs). Data: src/data/tips.ts exports an array of Tip objects (Tip interface defined in types.ts), created from a manually maintained src/data/tips.json file. Pagination logic: on listing page, slice array per page, compute total pages; navigation links to /tips/page/{page}. Featured tips: homepage selects 3 most recent tips by createdAt field. Performance: fully static HTML/CSS/JS, no client-side data fetching, LCP expected under 2s. Output: static export, served by Nginx.

## blockedOnIntegrations


## implementationRoadmap

- Step 1: Project scaffolding, setup Tailwind, create Tip type, create tips.json with 30 sample entries, configure build. Step 2: Implement homepage with hero and featured tips. Step 3: Implement listing page with pagination. Step 4: Implement detail page. Step 5: Apply final styling and ensure responsiveness, performance check.

## implementationApproach

- Static site generation. All pages are pre-rendered at build time. Source code in repository. JSON data file manually maintained and imported as a module. No external APIs or services. Deployment: build project with `next build && next export` and serve static files via Nginx.
