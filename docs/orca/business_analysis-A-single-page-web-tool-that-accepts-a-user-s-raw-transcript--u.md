# business_analysis: A single-page web tool that accepts a user's raw transcript (up to 500 words) and an OpenAI API key, then uses a structu

Status: draft

## outOfScope

- Transcripts longer than 500 words are truncated; no support for longer documents.
- Languages other than English.
- Persistent storage or history of transcripts/summaries.
- User authentication or multi-user features.
- Support for LLM providers other than OpenAI.
- Advanced rich text formatting beyond Quill.js defaults (e.g., tables, images, custom styles).
- Export to PDF, Word, or other formats.
- Mobile app or offline functionality.
- Analytics, error tracking, monitoring, or alerting.
- Real-time collaboration or sharing.

## assumptions

- User has a valid OpenAI API key with sufficient quota.
- Modern browser with Fetch, Clipboard, and Quill.js compatibility.
- The CORS proxy is deployed as a separate service (e.g., Vercel serverless function or Express app) by the customer.
- Default AI model is gpt-3.5-turbo for cost-effectiveness.
- Transcripts are in English and follow basic meeting structure with speaker labels (e.g., 'Speaker1: ...'); if absent, responsible person may be null.
- Deadlines mentioned as explicit dates can be normalized to ISO 8601 (YYYY-MM-DD) by the AI; otherwise the raw text is displayed.
- Static site hosting is separate; Orca orchestrates build and deployment but does not host the proxy.
- No authentication, user management, or persistent storage required.

## userStories

- As a user, I want to paste a raw meeting transcript (up to 500 words) and my OpenAI API key, and generate a formatted meeting summary with bulleted action items.
- As a user, I want to see action items that include a task description, an inferred responsible person (or null if unclear), and a deadline (if mentioned) in ISO date format or free text.
- As a user, I want the output displayed in a rich text editor (Quill.js) so I can edit the summary and action items before exporting.
- As a user, I want to be able to copy the rich text content to my clipboard or regenerate the summary using the same input.
- As a user, I want clear error messages if my API key is invalid, the transcript is too long, the API call fails, or the response cannot be parsed.
- As a user, I want a loading spinner while the summary is being generated.
- As a user, I want responsive design so the tool works well on desktop and tablet screens.
- As a user, I want the system to validate my API key format (must start with 'sk-') before sending the request.
- As a user, I want the tool to function statelessly without storing my data.

## scopeQuestions


## acceptanceCriteria

- Transcript length limit: accepts up to 500 words; if longer, truncates with a visible warning.
- API key format validation: only keys starting with 'sk-' are accepted; otherwise an error is shown and the Generate button remains disabled.
- Generate button is disabled when the transcript is empty or the API key is invalid.
- On generation, a loading spinner is shown until the response is received.
- The structured prompt requests a JSON response containing a 'summary' (text) and 'action_items' (array of objects with 'task', 'responsible', 'deadline').
- The API proxy correctly forwards requests to OpenAI and returns the response; network errors are caught and displayed.
- JSON response parsing: if parsing fails or the response lacks required fields, a clear error message is displayed.
- The rich text editor displays a formatted summary and bulleted action items, each showing task, responsible (or 'Unassigned' if null), and deadline (ISO date string if parseable, else raw text).
- User can edit the content within Quill editor.
- User can copy the editor's rich text content to clipboard.
- User can regenerate the summary (re-send same input) which replaces the current content.
- Responsive behavior: at viewports >= 768px, layout is fluid and optimized for desktop; below 768px, layout stacks vertically for tablet/mobile; no horizontal scroll at >= 320px.
- All error states (validation, network, API response) display user-friendly, non-technical messages.
