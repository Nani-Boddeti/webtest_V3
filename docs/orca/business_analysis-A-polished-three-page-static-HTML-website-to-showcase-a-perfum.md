# business_analysis: A polished three-page static HTML website to showcase a perfume collection with a luxury light aesthetic. The home page 

Status: draft

## outOfScope

- Dynamic backend or CMS for managing perfumes
- Search and filter functionality on the listing page
- Shopping cart or e-commerce features
- User accounts or personalization
- Analytics or tracking
- Payment processing
- Cross-browser testing beyond modern browsers

## assumptions

- The perfume dataset (brand, name, scent notes, fragrance family, year, description) is provided by the product owner and will be hardcoded; the implementer will create fictional entries.
- Placeholder images will be generated programmatically or created as static assets; each perfume gets a unique image (same background color, different text overlay).
- The site will be deployed to a simple static hosting service (e.g., GitHub Pages, Netlify) or served directly from a local file system; no server-side processing.
- The contact email is a mailto link; no form processing is required.
- Responsive design uses a mobile-first approach with a breakpoint at 768px.
- JavaScript usage is minimal only for the hamburger menu toggle; otherwise pages are static.

## userStories

- As a visitor, I want to see an inviting home page that clearly presents the collection and provides a prominent 'Explore Collection' button, so I can easily navigate to the listing.
- As a visitor, I want to browse all perfumes on a single listing page, each showing a name, brand, and a thumbnail image, so I can quickly scan the collection.
- As a visitor, I want to click on a perfume from the listing to view a detailed page with full information: brand, name, scent notes, fragrance family, year, and a description, so I can learn more before purchasing.
- As a visitor, I want the site to have a consistent luxury light design with an elegant color palette and typography, creating a premium feel that reflects the perfume brand.
- As a site owner, I want visitors to be able to contact me via a visible email link on the home page, so they can reach out with inquiries.
- As a developer, I want placeholder images for each perfume to be generated with a uniform luxury style and consistent dimensions, so the product pages look polished without real photography.

## scopeQuestions


## acceptanceCriteria

- The home page (index.html) contains a hero section with an 'Explore Collection' button that links to the listing page (listing.html).
- The listing page (listing.html) displays all 3-5 perfumes in a grid or list layout. Each card shows a thumbnail image, perfume name, brand, and a link to its detail page.
- Each perfume has its own HTML detail page (e.g., perfume1.html) that includes: brand, name, scent notes, fragrance family, year, description, and a larger placeholder image.
- The perfume dataset is hardcoded in the HTML and includes at least 5 items with all required fields.
- Placeholder images are generated with dimensions 800x600 px, using a solid background color (e.g., #F5F0E6 cream) with the perfume name centered in an elegant serif font (e.g., Playfair Display) in dark gold (#B8860B) to mimic a luxury label.
- The design adheres to a 'luxury light' color palette: background #FFFFFF, primary accent #D4AF37 (gold), secondary background #F5F5DC (beige), text #333333, headings #2C2C2C. Typography: headings in 'Playfair Display' serif (weights 400, 700), body text in 'Lato' sans-serif (weights 300, 400).
- All pages share a consistent header with navigation (Home, Collection) and footer, styled according to the design palette.
- Responsive navigation: On screens narrower than 768px, the navigation collapses into a hamburger menu. Clicking the hamburger toggles the menu visibility using minimal JavaScript (or a CSS-only solution if acceptable). The menu design matches the luxury aesthetic.
- The home page includes a 'Contact Us' section with the email link: contactus@test.com (mailto:contactus@test.com).
- All pages are valid HTML5 and use external CSS for styling, with Google Fonts imported for the specified typefaces.
- No search or filtering functionality is implemented on the listing page.
