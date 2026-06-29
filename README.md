# CV Webpage with PDF Download

A single-page, responsive CV/resume website with placeholder content and a client-side PDF download feature powered by [jsPDF](https://github.com/parallax/jsPDF).

## Overview

- **Single HTML file** — no build tools or frameworks required.
- **Responsive layout** using CSS flexbox and media queries (desktop + mobile).
- **SEO-ready** with semantic HTML, meta tags, Open Graph, and Twitter card support.
- **PDF download** that captures the CV content programmatically, including the profile photo, and saves as `CV_John_Doe.pdf`.
- All content is hardcoded with placeholders — edit `index.html` directly to customise.

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari).

## How to Run

Simply open the file in your browser:

```bash
open index.html
```

Or serve it locally (optional, for some browsers' strict CORS on `file://`):

```bash
npx serve .
```

The page loads at **http://localhost:3000** (or the port shown by `serve`).

## How to Use

1. **View the CV** — the card displays a photo, name, title, email, summary, experience, skills, and education.
2. **Download PDF** — click the **Download PDF** button at the bottom-right. A styled PDF (`CV_John_Doe.pdf`) will be generated and downloaded.
3. **Customise** — edit the HTML to replace placeholder text, the photo, or section content.

## Customisation

| Element | How to change |
|---|---|
| Name | Edit `id="cvName"` text |
| Email | Edit `id="cvEmail"` text and `href` |
| Photo | Replace `src` on `id="cvPhoto"` `<img>` |
| Sections | Update content inside the `<section>` blocks |
| PDF filename | Change `doc.save('CV_John_Doe.pdf')` in the script |

## Environment Variables

None required. This is a static client-side page.

## Notes

- jsPDF is loaded from CDN (`https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`).
- The PDF button is hidden via `@media print` and programmatically excluded from the PDF output.
- The profile photo is used as a placeholder SVG; replace it with a real image for production use.

## License

MIT
