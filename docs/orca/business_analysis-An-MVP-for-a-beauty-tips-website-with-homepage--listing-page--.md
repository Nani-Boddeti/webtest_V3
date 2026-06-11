# business_analysis: An MVP for a beauty tips website with homepage, listing page, and detail page. The homepage includes a hero section and 

Status: draft

## outOfScope

- Image assets or media for tips.
- Search or filtering functionality.
- Automated scraping or backend scraping pipelines.
- User authentication or comments.
- Integration with external APIs for dynamic content.
- Responsive design beyond standard mobile/desktop breakpoints (MVP focuses on basic responsiveness).
- Performance optimization beyond specified LCP thresholds.

## assumptions

- Content: All beauty tips are either original (written for MVP) or curated from permissively licensed sources with proper attribution; to avoid legal issues, we will use fictional/original tips for initial MVP.
- Scraping process: Manual collection of tips; they are hand-picked and entered into the JSON data file.
- Number of tips: Initially 30 tips will be included to demonstrate pagination.
- Categories: Defined as skincare, makeup, haircare, wellness.
- No filtering or search: Out of scope for MVP.
- No images: The MVP is text-only; the hero background uses CSS gradients, no image assets.
- Featured tips: Selection logic is '3 most recent tips based on createdAt'.
- Hero content: Title, subtitle, CTA, and background gradient are defined in a configuration file with defaults as specified in acceptance criteria.
- Data serving architecture: Static generation using Next.js; the site is built at deploy time from the JSON data.
- Performance: Target LCP under 2.5s mobile, under 2s desktop; achieved through static generation and optimized assets.
- Pagination: 10 tips per page; total 30 tips yields 3 pages.
- Category display: Categories are shown as tags on listing cards and on the detail page.
- Open scope decisions: All original scope questions (Q1–Q5) have been resolved: sources and topics defined, initial tip count set to 30, filtering excluded, images excluded, and category display clarified.

## userStories

- As a user, I want to see a welcoming homepage with a hero section so I understand the site’s purpose.
- As a user, I want to view the 3 most recent beauty tips on the homepage as featured tips.
- As a user, I want to navigate to a listing page to browse all beauty tips with pagination.
- As a user, I want to click on a tip to view its detailed content including category and source.
- As a content curator, I want to manually add beauty tips to a centralized JSON data file to maintain the site’s content.

## scopeQuestions


## acceptanceCriteria

- Homepage: Hero section displays title 'Welcome to Beauty Tips Hub', subtitle 'Discover expert advice for your daily beauty routine', and a CTA button 'Explore Tips' linking to the listing page.
- Homepage: Featured tips section displays the 3 most recent tips (based on createdAt field) in card format, each card showing title, category, and a snippet of content (first 150 characters).
- Listing page: Displays all tips in a paginated list with 10 tips per page; each tip card shows title, category, and a short excerpt.
- Listing page: Pagination controls are present to navigate between pages.
- Detail page: Displays full tip content: title, full text content, category, source, and attribution.
- Detail page: Category is displayed as a label/tag.
- Performance: Largest Contentful Paint (LCP) on mobile is under 2.5 seconds, on desktop under 2 seconds.
- Data: All tips are sourced from a static JSON file (e.g., tips.json) which is manually maintained.
- Data: Each tip object must contain: id (string, UUID), title (string), content (string), category (string, one of 'skincare', 'makeup', 'haircare', 'wellness'), source (string), attribution (string), createdAt (ISO date string).
- No images are present anywhere in the site; the hero background is a CSS gradient.
- No search or filtering functionality is included.
- The site is generated as static HTML files and served by a standard web server (e.g., Nginx).
