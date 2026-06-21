# business_analysis: A three-page static HTML website to showcase a luxury perfume collection. It includes a home page with a hero section an

Status: draft

## outOfScope

- Search or filter functionality on the listing page.
- Shopping cart, checkout, payment processing, or any e-commerce features.
- User accounts, login, or authentication.
- Backend server, database, or CMS integration.
- Image hosting or content delivery network; images are local files.
- Dynamic data loading or API integration.
- SEO optimization, analytics, or performance monitoring.
- Cross-browser testing beyond modern Chrome/Firefox/Safari.
- Accessibility beyond basic semantic HTML and alt text.

## assumptions

- The placeholder images will be manually created by the implementer or generated using a simple tool based on the specified colors and text overlays.
- The hardcoded dataset is sufficient and will not change dynamically.
- The site is for display purposes only, with no e-commerce or user interaction beyond navigation.
- Responsive navigation uses a CSS-only approach (no JavaScript) to keep the implementation simple.
- The fonts are loaded from Google Fonts CDN; an internet connection is assumed for proper rendering, but a local fallback can be added if needed.

## userStories

- As a perfume enthusiast, I want to land on a welcoming home page that introduces the collection and provides clear navigation to explore the perfumes.
- As a visitor, I want to browse a listing of perfumes with their name, brand, and a preview image so I can see what's available.
- As a visitor, I want to click on a perfume from the listing to view a detailed page with scent notes, fragrance family, year, and a description.

## scopeQuestions


## acceptanceCriteria

- Home page hero section contains headline: 'Discover the Art of Scent' and subtext: 'Explore a curated collection of luxury fragrances, each telling a story through exquisite notes and timeless elegance.'
- Home page includes a prominent 'Explore Collection' button in the hero section that links to the listing page (listing.html).
- Home page includes a contact section with email 'contactus@test.com' displayed and linked via mailto.
- Listing page (listing.html) displays at least 4 perfume cards, each showing a placeholder image, perfume name, brand, and a link to its dedicated detail page.
- Each perfume in the dataset has the following hardcoded fields: brand, name, scent notes, fragrance family, year, description. The dataset is as follows:
  - Brand: Maison Lumière, Name: Éclat de Nuit, Scent Notes: Bergamot, Jasmine, Sandalwood, Fragrance Family: Floral Woody, Year: 2021, Description: A luminous evening fragrance that opens with sparkling bergamot, unfolds into a heart of lush jasmine, and settles into a warm sandalwood base.
  - Brand: Olfactif Studio, Name: Noir Velours, Scent Notes: Pink Pepper, Rose, Patchouli, Fragrance Family: Oriental Floral, Year: 2022, Description: A velvety embrace of spicy pink pepper, romantic rose, and deep patchouli, evoking the allure of a midnight garden.
  - Brand: Essence Rare, Name: Bois d'Été, Scent Notes: Lemon, Cedarwood, Vetiver, Fragrance Family: Citrus Woody, Year: 2020, Description: Capturing the essence of a sun-drenched forest, this scent blends zesty lemon with earthy cedarwood and smoky vetiver.
  - Brand: Maison Lumière, Name: Oud Mystique, Scent Notes: Saffron, Oud, Amber, Fragrance Family: Woody Spicy, Year: 2023, Description: An opulent fusion of precious saffron, smoky oud, and golden amber that leaves a hypnotic trail.
- Each perfume has its own dedicated detail HTML file named using the pattern detail-<name>.html (lowercase, hyphens for spaces). Example: detail-eclat-de-nuit.html, detail-noir-velours.html, detail-bois-dete.html, detail-oud-mystique.html.
- Each detail page presents all perfume fields (brand, name, scent notes, fragrance family, year, description) in a visually rich layout and includes a link back to the listing page.
- Placeholder images are generated per perfume: dimensions 300x400px, each with a unique solid background color (Éclat de Nuit: #D3C5B5, Noir Velours: #4A3B3C, Bois d'Été: #A3B18A, Oud Mystique: #5C4033). The image displays the perfume name in white, centered, using Playfair Display italic at 24px, with a subtle text shadow for readability. Image files follow the same hyphenated name pattern as detail pages, e.g., eclat-de-nuit.jpg.
- Color palette: primary #1A1A1A (dark charcoal for headings/buttons), accent #C5A46D (gold for highlights/borders), background #FAF8F5 (warm off-white), secondary background #F0EDE6 (light beige for cards), text #333333 (dark gray for body).
- Typography: headings use 'Playfair Display', serif, with weights 400 (regular) and 700 (bold); body text uses 'Lato', sans-serif, with weights 300 (light) and 400 (regular). Fonts are imported from Google Fonts via link tag.
- Consistent visual elements: subtle box shadows on cards (0 2px 8px rgba(0,0,0,0.05)), thin gold borders (1px solid #C5A46D) on primary buttons and image containers, generous white space, and elegant line spacing (1.6 for body).
- Responsive navigation: On screens wider than 768px, a horizontal nav bar is displayed with links to Home and Collection. Below 768px, a hamburger menu (CSS-only checkbox hack) reveals a vertical dropdown with the same links. The hamburger icon uses the Unicode character ☰ styled appropriately.
- All pages are pure static HTML with no JavaScript frameworks; any interactivity uses CSS only.
- The site is fully functional when opened locally in a modern browser (no build step required).
