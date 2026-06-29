# business_analysis: Build a single static webpage for a CV profile of an AI Engineer with 1 year experience at Onflotech. The page will incl

Status: draft

## outOfScope

- Functional contact form with server-side processing.
- SEO meta tags, analytics, or tracking.
- Multi-page CV or complex navigation.
- Dynamic content from a CMS or database.
- User authentication or admin panel.
- Hosting or deployment setup (deliverable is source files).
- Integration with third-party APIs or services.
- Social media links or widgets.
- Complex animations or frameworks (keep to vanilla HTML/CSS/JS).

## assumptions

- A placeholder profile photo (e.g., a generic silhouette) will be used unless a specific image is provided.
- The CV sections will default to Summary, Experience (Onflotech), Education, Skills, and Contact unless otherwise specified.
- A dedicated print button is included to trigger the PDF download, in addition to browser native print functionality.
- The PDF download uses client-side JavaScript (e.g., window.print() or a library like jsPDF) to generate a print-optimized layout.
- No SEO meta tags or analytics are required.
- Only a mailto link is used for contact; no functional contact form.
- The candidate's full name and email address will be provided before implementation.
- The page will be built as a single self-contained HTML file with inline CSS and JS, or minimal assets.
- No backend or hosting is required; the deliverable is the static site files.

## userStories

- As a visitor, I want to quickly view the candidate's name, photo, summary, and professional details so I can assess their suitability.
- As a visitor, I want to click on an email link to contact the candidate directly.
- As a visitor, I want to download a PDF version of the CV for offline access or sharing.
- As a visitor, I want the page to be responsive so I can view it on mobile devices.
- As a visitor, I want the CV layout to be clear and easy to read.

## scopeQuestions

- What is the candidate's full name? (required for header and browser title)
- What is the candidate's email address? (required for the mailto link)
- Should we use a default placeholder photo or will a specific image be provided? If placeholder, any preference for style?
- Are any additional sections beyond Summary, Experience, Education, Skills, and Contact needed? (e.g., Projects, Certifications, Languages)
- Should a dedicated print button be included, or is the browser's native print functionality sufficient?
- What specific elements should be hidden or modified in the print-optimized PDF layout? (e.g., remove navigation, adjust font sizes, enforce page breaks)
- Is any specific color scheme, font, or branding required? If not, we'll use a clean, professional default.
- Should the experience section detail only the Onflotech role, or include any prior internships/positions?
- Any preferred structure for the Skills section (e.g., categorized into programming languages, frameworks, tools)?

## acceptanceCriteria

- The page displays the candidate's full name in the header and browser title.
- A profile photo is shown (placeholder image accepted if not provided).
- The page includes Summary, Experience (with Onflotech entry), Education, Skills, and Contact sections.
- The Contact section contains a mailto link using the provided email address.
- Clicking the mailto link opens the default email client with the candidate's email pre-filled.
- A clearly labeled button or link triggers a PDF download of a print-optimized version of the CV.
- The PDF version hides interactive elements (buttons, mailto link) and uses a print-friendly font and layout, with appropriate page breaks to avoid splitting sections awkwardly.
- The webpage uses responsive design to render well on desktop, tablet, and mobile browsers.
- All content is static and requires no server-side processing.
- The page loads without errors on modern browsers (Chrome, Firefox, Edge).
