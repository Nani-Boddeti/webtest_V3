# business_analysis: A single-page CV showcase for a 10-year IT professional, featuring interactive scroll animations, skill bars, and a care

Status: draft

## outOfScope

- Contact form and backend processing of submissions.
- Downloadable PDF version of the CV.
- Server-side analytics, CMS, or database.
- Dynamic content fetching or authentication.
- Dark/light mode toggle (only dark mode implemented).
- Multiple pages or complex routing.
- Integration with third-party platforms for real-time data.

## assumptions

- Placeholder content for all sections (experience details, skill names and proficiency levels, education entries, timeline events) will be provided by the user.
- A professional photo for the Hero section is optional; a placeholder silhouette will be used if not supplied.
- The user has a GitHub account and will set up a repository and enable GitHub Pages; the generated code will be committed directly.
- The site will use the AOS library (via CDN) for scroll animations and Tailwind CSS via CDN for styling.
- Dark mode is the only theme; no toggle is required.
- No backend or build process is needed; the site is pure static HTML.

## userStories

- As a CV owner, I want a visually stunning single-page website that presents my professional background, skills, and experience in an engaging manner.
- As a visitor, I can see skill bars that animate when scrolled into view, effectively conveying my expertise levels.
- As a visitor, I can view a timeline of my career that animates on scroll, making my progression clear and dynamic.
- As a recruiter, I can easily find an email link to contact the CV owner without filling out any forms.
- As a mobile user, the page is fully responsive and fast-loading, providing a premium experience on any device.
- As a developer, the page is simple static HTML/CSS/JS, easily maintainable and deployable to GitHub Pages.

## scopeQuestions


## acceptanceCriteria

- The page loads as a single scrollable document with distinct sections: Hero, About, Experience, Skills, Education, Timeline, Contact.
- Navigation includes a sticky top bar with smooth scrolling anchor links to all sections.
- Skill bars animate from 0% to defined percentage on scroll into view using the AOS library, with a smooth transition.
- The timeline entries slide in or fade in sequentially when scrolled into view.
- The design follows a premium dark aesthetic: background color #111, text #fff, accent color #D4AF37 (gold) for headings and highlights, using a clean sans-serif font (e.g., Inter or Open Sans) with elegant spacing and subtle shadows.
- The Hero section displays the owner’s name, title, and a professional photo (placeholder if none provided).
- The contact section includes a clearly visible email link (href='mailto:naniv2615@test.com') styled as a call-to-action.
- The page is fully responsive, with a mobile-first approach, using Tailwind CSS for layout consistency.
- The codebase consists of index.html, styles.css (or Tailwind configuration via CDN), and a small script.js for initializing AOS and any additional interactions.
- The site deploys to GitHub Pages from a designated branch (e.g., main or gh-pages) and loads without errors.
