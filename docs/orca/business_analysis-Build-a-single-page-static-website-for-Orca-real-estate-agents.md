# business_analysis: Build a single-page static website for Orca real estate agents, with sections: About Us, Services, Property Listings, Co

Status: draft

## outOfScope

- Contact form or any form submission handling.
- Google Maps integration or any interactive map.
- Dynamic or updatable property listings (database/cms).
- User authentication or account management.
- Payment processing or transaction handling.
- Search or filtering of property listings.
- Admin dashboard or content management.
- Analytics, monitoring, or error tracking.
- Chat or support widgets.
- Multilingual support or localization.

## tlFeedback

- User stories and acceptance criteria are specific and testable.
- Assumptions and out-of-scope are clearly defined.

## assumptions

- The site is purely static (HTML/CSS/JS) and requires no backend.
- Placeholder content will be used for property listings, team, and testimonials unless the user provides actual content.
- The Contact section does not include a form; only static contact details are shown.
- Social media links will be set to placeholder URLs (#) until the user supplies real ones.
- The design will incorporate pastel colors as requested; no specific brand guidelines beyond colors are provided.
- Deployment and hosting (including the orca.co domain) are handled by project settings and are not part of this scope.
- No SEO or analytics integrations are required for MVP.

## userStories

- As a visitor, I can see a single page with all key sections about the real estate business.
- As a visitor, I can click navigation links to smoothly scroll to each section.
- As a visitor, I can view property listings with images and descriptions.
- As a visitor, I can read about the team members.
- As a visitor, I can see customer testimonials.
- As a visitor, I can find contact information (phone, email, etc.) in the Contact section.
- As a visitor, I can click social media icons to go to the company's social profiles.
- As the business owner, I want the site to reflect my brand with pastel colors and the domain name displayed.

## scopeQuestions

- Will you provide actual content for property listings (images, text), or should we use placeholder data?
- What social media platforms and specific URLs should be included?
- What static contact details should be displayed (phone number, email, physical address)? Since no Google Maps, is an address needed?
- Do you have a logo for Orca Real Estate Agents, or should we create a placeholder?
- For the Team section, will you provide names, photos, and roles, or should we use placeholder data?
- What text or descriptions should appear in the Services section? Should we use generic real estate services?

## tlReviewStatus

- Changes requested by Tech Lead

## tlChangeRequests

- BLOCKING USER DECISION: Which social media platforms and specific URLs should be included? (Acceptance criterion mentions 'platforms TBD'). Please provide the list of platforms and their URLs, or confirm that placeholder icons and links can be used for MVP.

## visualReferences


## acceptanceCriteria

- The page is a single HTML page with all sections visible or reachable via anchor links.
- The header displays 'Orca Real Estate Agents' as the site name.
- A navigation bar allows scrolling to each of the specified sections.
- The Property Listings section displays static cards with images and property details.
- The Team section shows member names, photos, and roles (placeholder or provided).
- The Testimonials section shows customer quotes and names.
- The Contact section contains at least a phone number and email address (static).
- Social media icons (platforms TBD) are placed in the footer or a designated area and link to external URLs (new tab).
- The color scheme uses pastel colors throughout.
- The layout is responsive and works on mobile, tablet, and desktop.
- The domain 'orca.co' is referenced or used appropriately.
