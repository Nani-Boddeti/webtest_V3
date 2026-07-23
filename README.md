# Phone Comparison Infographic

A static high-resolution infographic comparing the Samsung Galaxy S26 Ultra and iPhone 17 Pro Max, generated as a 2400×3000 PNG via Puppeteer.

## Overview

This project produces a two-column comparison infographic with:
- Red titles and pastel accent colors (light blue for Samsung, light pink for iPhone)
- Side-by-side spec tables covering display, processor, cameras, battery, and more
- SVG placeholder product renders (replaceable with real images)
- SEO-ready semantic HTML with Open Graph and Twitter Card meta tags

## Prerequisites

- **Node.js** >= 22.17.0 (v24 recommended)
- **npm** >= 9

## Install

```bash
cd infographic
npm install
```

## Generate the Infographic

```bash
cd infographic
npm run generate
```

This launches a headless Chromium browser (bundled via `@sparticuz/chromium`), renders `infographic/index.html` at a 1200×1500 viewport with 2× device scale factor, and saves the resulting **2400×3000 PNG** to `output/infographic.png`.

## Validate the Output

```bash
cd infographic
npm run validate
```

Checks that `output/infographic.png`:
- Width ≥ 2000 px
- Aspect ratio 4:5 (0.8) within ±1%
- File size ≥ 400 KB

## Environment Variables

No environment variables are required for this project. The bundled Chromium binary includes all necessary system libraries.

## Project Structure

```
infographic/
  index.html       # Infographic HTML (two-column comparison)
  style.css        # Styles (pastel accents, red titles, clean layout)
  generate.js      # Puppeteer screenshot script
  validate.js      # Output dimension/size validator
  package.json     # Dependencies and scripts
output/
  infographic.png  # Generated 2400×3000 infographic
```

## Customization

- **Product images**: Replace the inline SVG placeholders in `infographic/index.html` with `<img>` tags pointing to real product renders.
- **Spec data**: Edit the table rows directly in the HTML.
- **Colors**: Adjust the pastel accent colors and red title color in `infographic/style.css`.
