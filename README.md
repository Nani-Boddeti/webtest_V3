# Maison Élégance — Luxury Product Catalog

A luxury product catalog page featuring 10 hand-selected artisan pieces with a responsive grid layout, detail view, and elegant typography.

## Project Overview

This repository contains a single-page luxury product catalog (`catalog.html`) built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — open it directly in any modern browser.

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Fonts and product placeholder images via Unsplash)

## Install

No installation required. Simply clone or download the repository.

## How to Start

Open the catalog page directly in your browser:

```bash
open catalog.html      # macOS
# OR
xdg-open catalog.html  # Linux
# OR
start catalog.html     # Windows
```

The page is fully self-contained and requires no server.

## Features

- **10 luxury products** displayed in a responsive CSS Grid
- **Detail view** — click any product card to see full information (large image, description, material, origin, SKU, year)
- **Back to Collection** button and **Escape key** to return to the grid view
- **Luxury light theme** — Cormorant Garamond & Inter typefaces, neutral warm background, subtle gold/cream accents
- **SEO-ready** — semantic HTML, meta description, Open Graph / Twitter tags, canonical URL
- **Structured data** available for product schema
- **Responsive** — optimized for desktop, tablet, and mobile
- **Keyboard accessible** — navigate and select products with keyboard

## Environment Setup

No environment variables or secrets required. The page uses:

- [Google Fonts](https://fonts.google.com/) (Cormorant Garamond + Inter) loaded via CDN
- [Unsplash](https://unsplash.com/) for placeholder product imagery
- Inline SVG fallback for images that fail to load

## Project Structure

```
.
├── catalog.html    # Luxury product catalog (single HTML file)
├── index.html      # CV page (from previous task)
├── README.md       # This file
└── docs/
    └── orca/       # Task documentation
```

## Port

No server needed. Open `catalog.html` directly in a browser — it works on `file://` protocol.
