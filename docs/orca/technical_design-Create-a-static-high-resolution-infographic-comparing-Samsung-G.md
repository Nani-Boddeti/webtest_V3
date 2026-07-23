# technical_design: Create a static high-resolution infographic comparing Samsung Galaxy S26 Ultra and iPhone 17 Pro Max using HTML/CSS and 

Status: draft

## riskNotes

- Spec data for unreleased devices may be inaccurate; placeholder data used. Product renders must be sourced manually and placed in `infographic/images/`. Font rendering may vary slightly across OS. Output PNG size could be large; no optimization required as the goal is ultra-high resolution.

## backendPlan

- No backend required.

## agentHandoff

- The implementing agent should build the infographic HTML/CSS with sample spec data and placeholder product images, then create the Puppeteer capture script. On completion, the reviewer will run `npm run generate` and confirm `output/infographic.png` exists with dimensions meeting the 4:5 ratio and width ≥ 2000px. The user can later replace placeholder images and update spec data.

## databasePlan

- None.

## frontendPlan

- Single static HTML page (`infographic/index.html`) with external CSS (`infographic/style.css`). Use CSS Flexbox or Grid for the two-column layout. Product renders placed via <img> tags pointing to local placeholder images (to be replaced by the user). Spec data defined directly in HTML. Pastel accent colors (e.g., light blue #B3E5FC, light pink #F8BBD0) applied to table headers or borders. Red titles: #D32F2F. Sharp text via `font-smoothing: antialiased` and system fonts.

## testStrategy

- Automated: run `npm run generate`, then use `image-size` (or `identify` if ImageMagick available) to check `output/infographic.png` dimensions: width ≥ 2000px and aspect ratio 4:5 (0.8) within ±1%. Verify file size > 500KB to indicate high resolution. Include a simple validation script (e.g., `validate.js`) that exits with code 0 on success.

## dependencyPlan

- No external integrations. Puppeteer will download its own Chromium binary on first install.

## lowLevelDesign

- The infographic will be implemented as a single HTML page with a fixed container set to a 4:5 aspect ratio (e.g., 1200x1500 CSS pixels) rendered at a device scale factor of 2 to produce an ultra-high resolution PNG (2400x3000 pixels). Two-column layout: left column for Galaxy S26 Ultra, right for iPhone 17 Pro Max. Each column contains a red bold product name, a photorealistic product render placeholder, and a specifications table (Display, Processor, OS, Cameras, Battery, Charging, Weight, Security, Price, RAM/Storage). Pastel color accents on borders or section highlights, subtle box shadows on images, sharp system fonts. Hardcoded sample spec data in the HTML (easily editable). Puppeteer script opens the local file, sets viewport, takes a full-page screenshot, and saves to `output/infographic.png`.

## blockedOnIntegrations


## implementationRoadmap

- Step 1: Scaffold the infographic HTML/CSS with placeholder images and spec data. Step 2: Add Puppeteer script to capture screenshot. Step 3: Verify output resolution and aspect ratio (via automated check).

## implementationApproach

- 1. Create `infographic/` directory with `index.html`, `style.css`, and `generate.js` (Puppeteer script). 2. Add `package.json` with dependencies (`puppeteer`) and script `generate`. 3. Use puppeteer to launch headless Chrome, navigate to `file://` path, set viewport to 1200x1500 with `deviceScaleFactor: 2`, capture full-page screenshot as `output/infographic.png`. 4. Provide placeholder images in `infographic/images/` for the product renders.
