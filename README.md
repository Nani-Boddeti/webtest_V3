# Haven & Hearth Realty — Static Real Estate Website

A premium single-page real estate agency website built with vanilla HTML, CSS, and JavaScript. Features a pastel color scheme, responsive layout, and SEO-ready markup with structured data.

## Sections

- **Hero** — eye-catching banner with CTA
- **About Us** — agency story with stats
- **Services** — five service cards
- **Property Listings** — four featured properties
- **Testimonials** — three client stories
- **Team** — four team member profiles
- **Contact** — address, phone, email, hours, and a demo contact form
- **Footer** — quick links, social icons, legal

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools, package managers, or runtime required

## Install & Run

```bash
# Clone or download the repository, then serve the root directory.
# Example using Python's built-in HTTP server:
python3 -m http.server 8080

# Or with Node.js (if npx serve is available):
npx serve . -l 3000
```

Then open:

- http://localhost:8080 (Python)
- http://localhost:3000 (serve)

The site works when opened directly as `file://` as well; no server is required.

## Environment

No environment variables are needed. This is a fully static site.

## Project Structure

```
webtest_V3/
├── index.html              # Main page (all sections)
├── css/
│   └── style.css           # Pastel-themed stylesheet with CSS variables
├── js/
│   └── script.js           # Smooth scrolling, nav toggle, form handler
├── assets/
│   └── images/
│       ├── property-1.svg  # Property listing placeholder
│       ├── property-2.svg
│       ├── property-3.svg
│       ├── property-4.svg
│       ├── avatar-placeholder.svg
│       └── logo.svg
├── .env.example            # No variables required (static site)
├── .htmlvalidate.json      # HTML validation config
├── .stylelintrc.json       # CSS linting config
└── README.md
```

## Linting

```bash
# HTML validation
npx html-validate index.html

# CSS validation
npx stylelint "css/**/*.css"

# JavaScript syntax check
node -c js/script.js
```
