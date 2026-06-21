# business_analysis: A static HTML/CSS website with three pages (Home, Perfume Listing, Perfume Detail) showcasing a user's personal perfume 

Status: draft

## outOfScope

- Search and filtering functionality
- User accounts, authentication, or profiles
- E-commerce features (cart, checkout, payment processing)
- Backend or CMS integration
- Dynamic content loading via API
- Social media sharing or embedded feeds
- Performance monitoring or analytics
- Multilingual support or localization
- SEO optimization beyond basic <title> tags
- Deployment or hosting setup

## assumptions

- The website is purely static HTML/CSS with no server-side processing or database.
- Minimal vanilla JavaScript is used solely for the mobile hamburger menu toggle; no other dynamic behavior.
- The user will deploy the site to their own hosting; no deployment or CI/CD is within scope.
- Placeholder images are created as static assets (solid color with text overlay) during development; no image generation at runtime.
- Perfume data is fixed and hardcoded directly into the HTML pages; no data files or external sources.
- Target browsers are modern (latest Chrome, Firefox, Safari, Edge); no IE support.
- Breakpoints for responsive design: small (<=576px), medium (577px - 768px), large (769px+).
- The contact email contactus@test.com is provided and will be used as-is.
- The design follows the 'luxury light' aesthetic as described; no additional branding beyond color/typography is required.

## userStories

- As a visitor, I want to land on a welcoming home page with a hero section, so that I understand the site's purpose and can navigate to the perfume collection.
- As a visitor, I want to click a prominent 'Explore Collection' button to access the product listing page.
- As a visitor, I want to see a contact section on the home page with an email address so I can reach out for inquiries.
- As a visitor, I want to browse a list of perfume items on the listing page, each displaying a name, brand, and image, so I can quickly scan the collection.
- As a visitor, I want to click on a perfume item to view its full details (brand, name, scent notes, fragrance family, year, description, and image) to learn more.
- As a visitor, I want the website to present a consistent luxury light aesthetic with elegant typography, refined color palette, and high-quality visual elements to evoke a premium feel.
- As a visitor, I want the website to be responsive so that I can view it comfortably on mobile, tablet, and desktop screens (including a hamburger menu on mobile for navigation).

## scopeQuestions


## acceptanceCriteria

- Home page includes a hero section with headline, subtext, and an 'Explore Collection' button linking to listing page.
- Home page includes a contact section displaying the email address contactus@test.com.
- Product listing page displays all 3-5 perfumes in a grid or list layout.
- Each perfume card shows the product name, brand, and a placeholder image.
- Clicking a perfume card navigates to its detail page.
- Product detail page shows all fields: brand, name, scent notes, fragrance family, year, description, and a larger image.
- The hardcoded dataset includes exactly 3-5 items, each with all specified fields: brand, name, scent notes, fragrance family, year, description.
- Placeholder images: Each perfume has a unique placeholder image (3-5 total), dimensions 600x400px, solid background color #F5F5DC (cream), centered text overlay in #D4AF37 (dark gold) displaying the perfume name in a large serif font (Playfair Display or equivalent). This ensures alignment with the design palette (secondary background and accent as per TL change request).
- Visual design adheres to the luxury light aesthetic: primary background #FAF9F6, secondary background #F5F5DC, primary text #2F2F2F, secondary text #5C5C5C, accent #D4AF37, border #D3D3D3; typography: headings use 'Playfair Display' (serif, weights 400/700), body uses 'Lato' (sans-serif, weights 300/400/700).
- Consistent visual elements include subtle box shadows on cards, clean lines, generous white space, and gold accents for buttons and interactive elements.
- Navigation menu in site header includes links to Home and Listing, styled per typography.
- Responsive behavior: at viewport width below 768px, the navigation collapses into a hamburger icon; clicking it toggles menu visibility using vanilla JavaScript. Fluid grid/flexbox layout adjusts for tablet and desktop.
- All pages validate as HTML5 and CSS3, using no external CSS frameworks.
- Contact email is represented as plain text and optionally a mailto link.
- No search or filter functionality present.
