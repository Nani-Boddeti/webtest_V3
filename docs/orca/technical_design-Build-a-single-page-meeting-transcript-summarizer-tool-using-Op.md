# technical_design: Build a single-page meeting transcript summarizer tool using OpenAI API, Quill.js rich text editor, and a CORS proxy. Th

Status: draft

## riskNotes

- Risks: 1) User's OpenAI API key is exposed in browser memory and network traffic; mitigation: warn user to use a temporary key, no storage. 2) Reliance on external CORS proxy; if proxy is misconfigured or unreachable, the tool fails. 3) GPT-3.5-turbo may not always produce valid JSON; implement parsing fallback with error message. 4) Clipboard API may not be available on older browsers; implement a textarea fallback. 5) 500-word limit enforced client-side; truncation with warning reduces risk of exceeding context limits. 6) No authentication; anyone with the page can use it if they have an API key.

## backendPlan

- None. The application is entirely client-side. The CORS proxy (e.g., a serverless function or simple Express app) is considered a separate deployment responsibility and is assumed to be available at a configurable URL. All logic runs in the browser.

## agentHandoff

- For the scaffolding task: create index.html with semantic HTML structure (form, editor div, buttons), link styles.css and app.js, load Quill from CDN. Initialize a basic Quill editor with a simple toolbar. styles.css should provide a centered container, responsive layout (grid/flex), and basic styling. For the implementation task: in app.js, define DOM references, implement word count, API key validation, generate button state manager, fetch wrapper that uses the CORS proxy URL and API key, a prompt builder, a parser for the expected JSON shape, a function to build HTML from the parsed data, and insert into Quill. Add 'Copy to Clipboard' using navigator.clipboard.write with fallback. Add regenerate button that repeats the API call. Display loading spinner (CSS class toggle) during fetch. Show user-friendly error messages in error div. Ensure responsive behavior is maintained. Placeholder variables: CORS_PROXY_URL = '<to be replaced>', OPENAI_API_KEY_PLACEHOLDER = '<to be replaced>'. The API request body: model 'gpt-3.5-turbo', messages with system prompt instructing to return JSON with 'summary' and 'action_items' array of {task, responsible, deadline}. Use temperature 0.3 for consistency.

## databasePlan

- None. All data is ephemeral and client-side.

## frontendPlan

- Tech: HTML5, CSS3, vanilla JavaScript (ES6+), Quill.js 1.3.7 from CDN. Libraries: Quill.js for rich text editing. Components: 1) Input form with textarea for transcript (max 500 words, count displayed), input for API key (type password, validated), and Generate button (disabled unless valid). 2) Loading spinner (CSS animation) shown during API call. 3) Error message div for user feedback. 4) Quill editor container (toolbar with basic formatting). 5) Copy and Regenerate buttons below editor. Functionality: validate inputs on change; on Generate, send POST request to proxy with OpenAI API key and messages; parse response; format summary as <p> and action items as <ul><li> with task, responsible (or 'Unassigned'), deadline; paste into Quill editor via .clipboard.dangerouslyPasteHTML(). Regenerate clears editor and resends same inputs. Copy uses Clipboard API to copy editor's innerHTML. Responsive CSS: fluid layout, stack vertically on screens <768px, no horizontal scrolling at 320px.

## testStrategy

- Manual testing in modern browsers (Chrome, Firefox, Safari) at desktop and tablet viewports. Test scenarios: valid transcript and valid API key (success), empty transcript (button disabled), invalid API key format (button disabled), transcript >500 words (truncation and warning), network error (proxy down), invalid API key rejection by OpenAI (HTTP 401), response not JSON, response missing fields, Clipboard API copy success/failure, regeneration, editing content in Quill. Provide a sample transcript for testing.

## dependencyPlan

- No runtime dependencies beyond Quill.js loaded from CDN. Build and deployment dependencies are minimal (any static file server). Development dependencies: none. The project relies on external services (CORS proxy, OpenAI API) which are user-managed; provide clear documentation for setup.

## lowLevelDesign

- Architecture: a single HTML file (index.html) loads Quill.js from CDN, local styles.css, and local app.js. The page contains an input form (transcript textarea, API key input), a generate button, a loading spinner, an error display area, and a Quill editor container. app.js handles: form validation (API key starts with 'sk-', transcript word count ≤500), disabling/enabling the generate button, fetching via a CORS proxy URL to OpenAI's chat completions endpoint, parsing the JSON response with expected fields (summary, action_items), populating the Quill editor with formatted HTML, and providing 'Copy to Clipboard' and 'Regenerate' buttons. Error handling covers invalid API key, network errors, proxy errors, parsing failures, and invalid responses. Responsive design uses CSS media queries (breakpoint 768px). No state persistence; all data resides in memory.

## blockedOnIntegrations

- Code Repository (Git)
- Static Site Hosting
- API Proxy (CORS proxy)
- OpenAI API

## implementationRoadmap

- Step 1: Scaffold HTML structure, CSS responsive layout, Quill initialization. Step 2: Implement input validation, form enable/disable logic, and loading spinner. Step 3: Implement API call logic with placeholder proxy and API key. Step 4: Implement response parsing and rich text insertion. Step 5: Add Copy and Regenerate functionality. Step 6: Apply final polish and error handling.

## implementationApproach

- Scaffold the project with a minimal set of static files (index.html, styles.css, app.js) and include Quill via CDN. Implement the core functionality in a single app.js file using modular functions for clarity. Use a configurable CORS proxy URL placeholder. Integrate the OpenAI API via fetch with error handling. Focus on simplicity and minimal external dependencies. Deploy as static files to any web server or hosting service.
