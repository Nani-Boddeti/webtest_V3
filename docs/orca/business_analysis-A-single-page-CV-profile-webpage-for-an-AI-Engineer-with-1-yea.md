# business_analysis: A single-page CV/profile webpage for an AI Engineer with 1 year experience at Onflotech. It includes sections: Header wi

Status: draft

## outOfScope

- Functional contact form (only mailto link).
- SEO meta tags or optimization.
- Hosting or deployment of the webpage.
- Analytics, tracking, or monitoring.
- Multi-page design or separate sections on different pages.
- Password protection or any authentication.
- Live data fetching or backend integration.

## assumptions

- Candidate name placeholder: 'John Doe' will be used unless real name is provided.
- Candidate email placeholder: 'john.doe@example.com' will be used unless real email provided.
- Profile photo placeholder: a generic silhouette or generated avatar (e.g., via DiceBear API or an inline SVG) will be used; real photo can replace it.
- The content sections (Summary, Experience, Education, Skills) will contain placeholder/dummy text describing the candidate as an AI Engineer with 1 year of experience at Onflotech, until the candidate supplies actual text.
- Color scheme: neutral tones (light background, dark text) for readability.
- Font: system default sans-serif.
- jsPDF will be loaded from a CDN (jsdelivr) for client-side PDF generation.
- No backend or server-side processing is required; the page is a static HTML file.
- The page will not have any SEO-specific meta tags beyond a basic title tag.
- The candidate will eventually host the HTML file (and any assets) on a web server or static hosting service of their choice (out of scope for Orca).
- The PDF download button will not rely on browser's print dialog; it will create a PDF file programmatically.

## userStories

- As a candidate, I want a clean, one-page CV website so that I can present my professional information to potential employers.
- As a candidate, I want to download a PDF version of my CV so that I can share it via email or print it.
- As a candidate, I want to include my profile photo on the webpage and in the PDF for a personal touch.
- As a candidate, I want my contact email to be accessible via a mailto link so that visitors can easily reach out.
- As a candidate, I want the CV content to be easily updatable so that I can modify my information as needed.

## scopeQuestions

- Please provide the candidate's full name, email address, and profile photo. Without these, placeholders will be used.
- Confirm that the placeholder summary/experience content describing 1 year as AI Engineer at Onflotech is acceptable, or provide the exact text you want.

## acceptanceCriteria

- The webpage displays all specified sections (Summary, Experience, Education, Skills, Contact) with placeholder or provided content.
- The header shows the candidate's full name and profile photo.
- The contact section includes a mailto link that opens the default email client with the candidate's email address in the To field.
- There is a visible 'Download PDF' button that, when clicked, triggers the generation of a PDF file using jsPDF and initiates a download in the browser.
- The generated PDF includes all content (name, photo, summary, experience, education, skills, contact info with email displayed as text) in a single page layout, with the download button hidden.
- Hyperlinks in the PDF (e.g., email) are displayed as plain text plus the URL to ensure they are preserved when printed.
- The webpage and PDF use a simple, professional color scheme and font (e.g., sans-serif, grayscale) that adapts for good print readability.
- Browser native print functionality remains available, but the dedicated button provides a consistent PDF output independent of browser differences.
