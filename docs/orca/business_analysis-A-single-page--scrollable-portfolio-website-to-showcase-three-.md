# business_analysis: A single-page, scrollable portfolio website to showcase three Android applications: AutoScroll, SharePark, and WakeMust.

Status: draft

## outOfScope

- Contact form or email capture
- Social media profile links
- Multi-page navigation (tabs, sidebars, separate pages)
- Backend server or database
- User authentication or login
- Analytics tracking (e.g., PostHog, Google Analytics)
- Blog, news, or update section
- Dynamic content management or CMS
- Payment or subscription features
- PWA offline support (beyond basic static caching)

## assumptions

- The developer’s name or logo will be provided later; currently a placeholder is acceptable.
- The page will be deployed to a static hosting platform (e.g., GitHub Pages) with a custom domain provided later.
- Scroll-triggered fade-in animations are desired and considered part of the 'best looking' requirement.
- No analytics tracking is required for the initial version.
- App icons and promotional images will either be fetched from Google Play or supplied later; placeholder images are acceptable during development.
- The design will adhere to Material Design dark theme guidelines as specified.
- All scope questions have been resolved through the user's clarifications.

## userStories

- As a visitor, I want to see a visually appealing overview of the developer's Android apps so that I can quickly understand their offerings.
- As a visitor, I want to read a concise description of each app without leaving the page so that I can decide if it meets my needs.
- As a visitor, I want to click on an app to open its Google Play Store page in a new tab to install or learn more.
- As a visitor, I want the page to be easily scrolled through with smooth transitions between app sections so that browsing feels effortless.
- As a visitor, I want the page to load quickly and be responsive on mobile devices so that I can view it on any screen.
- As a developer, I want the site to have proper SEO meta tags so that it appears in search engine results.

## scopeQuestions


## acceptanceCriteria

- The page is a single HTML file with minimal dependencies (no heavy frameworks), hosted via static hosting.
- A hero section at the top includes a placeholder developer name/logo.
- The page contains three sections, one for each app: AutoScroll, SharePark, WakeMust.
- Each app section displays the app name, a short description, and a clearly visible link/button to its Google Play Store URL.
- Short descriptions: AutoScroll – makes scrolling hands-free and effortless; SharePark – find and share parking spaces easily; WakeMust – a smart alarm that actually makes you wake up.
- Google Play Store URLs: AutoScroll (https://play.google.com/store/apps/details?id=com.autoscroll.scrollmind), SharePark (https://play.google.com/store/apps/details?id=com.sharepark.mobile), WakeMust (https://play.google.com/store/apps/details?id=com.wakemust).
- The page uses a dark color palette: background #121212, surface/cards #1E1E1E, primary accent #BB86FC, secondary accent #03DAC6, primary text #FFFFFF, secondary text #B0B0B0.
- All interactive elements meet WCAG 2.1 AA contrast ratios.
- Smooth scrolling is implemented when a visitor scrolls or navigates to an app section via anchor links (no dedicated navigation bar, single continuous page).
- Each app section fades in with a subtle animation when scrolled into view (CSS or vanilla JS).
- The page is fully responsive, adapting layout for desktop, tablet, and mobile viewports.
- SEO meta tags are present: <title>Android App Developer – AutoScroll, SharePark, WakeMust</title>, <meta name="description" content="Discover innovative Android apps: AutoScroll for hands-free scrolling, SharePark for easy parking, WakeMust for smarter alarms. Explore now on Google Play.">.
- No contact form, social media links, or external analytics scripts are present.
- Placeholder app images (e.g., app icons from Google Play) may be used until final assets are provided.
