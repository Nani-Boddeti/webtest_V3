# business_analysis: A modern, ATS-friendly single-page CV website for a software engineer with a luxury light theme, interactive skill bars,

Status: draft

## outOfScope

- Multi-page navigation or routing
- Backend server or dynamic content management
- User authentication or admin panel
- Real-time analytics or tracking
- Multi-language support
- Integration with proprietary SaaS services (e.g., LinkedIn API, Google Analytics)
- Automated deployment pipelines

## assumptions

- The CV website is a static single-page application with no backend server.
- CV data is stored in a `cv-data.json` file in the project root and loaded asynchronously by the browser.
- The luxury light theme uses a palette with gold accents (#D4AF37) as primary accent, complemented by neutral tones like #F5F5F5 (background) and #2C2C2C (text), with a serif font for headings (e.g., Playfair Display) and sans-serif for body (e.g., Lato).
- Skill bars will animate via CSS width transitions triggered when the element enters the viewport (or on page load).
- PDF generation uses a client-side library (e.g., html2canvas + jsPDF) to capture the page content; skill bars are rendered as static filled bars with percentage text.
- The avatar image is provided as a URL or local file; if a local file, it is placed in an `assets` folder.
- Favicon is included; if not generated from the avatar, a default `favicon.ico` will be placed in the root.
- Hosting environment is a static site host (e.g., GitHub Pages, Netlify, Vercel) or can be run locally; the exact host does not affect the codebase.
- No analytics or external tracking scripts are included.
- SEO metadata values are extracted from the CV JSON file's dedicated fields.

## userStories

- As a job seeker, I want a professional online CV that presents my skills and experience clearly so recruiters can quickly assess my profile.
- As a job seeker, I want to download a PDF version of my CV so I can attach it to job applications.
- As a user, I want the CV to have a luxury light theme with gold accents to convey elegance and attention to detail.
- As a user, I want skill bars to animate on page load to make the page more engaging and visually appealing.
- As a user, I want the site to include structured data (JSON-LD) so applicant tracking systems (ATS) can parse my information easily.
- As a user, I want SEO metadata (title, description, Open Graph tags) to improve the site's discoverability in search engines.
- As a developer, I want the CV content to be defined in a JSON file so it can be easily updated and maintained separately from the source code.

## scopeQuestions

- What is the hosting environment? (e.g., static site hosting like Netlify, GitHub Pages, or local file)
- Should the favicon be generated from the avatar image or provided as a separate file (e.g., favicon.ico)?
- Should the downloadable PDF include the avatar photo?

## acceptanceCriteria

- A JSON schema is defined for CV data including personal info, experience, education, skills (with levels), avatar URL, and SEO metadata.
- The design follows a luxury light theme with explicitly provided color hex codes, font choices, and spacing guidelines (design tokens).
- Semantic HTML is generated from the JSON data and includes JSON-LD structured data following schema.org/Person.
- Skill bars are data-driven from the skills JSON array and animate from 0% to the given level on page load using CSS transitions.
- A downloadable PDF version is generated client-side and includes all content statically (skill bars represented as filled horizontal bars with percentage labels, no animation).
- The page includes an avatar image (either from a URL or local file) and a favicon (to be determined if generated from avatar or separate).
- SEO meta tags (title, description, og:title, og:description, og:image) are populated from the JSON data.
- The CV JSON file is named `cv-data.json` and placed in the project root, loaded by the web page via a fetch request or similar.
- The mapping from JSON fields to JSON-LD Person schema is clearly documented and implemented.
- The site is a single static HTML page with no server-side dependencies.
