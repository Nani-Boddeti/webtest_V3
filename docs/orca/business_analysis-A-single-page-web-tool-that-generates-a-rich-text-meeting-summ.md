# business_analysis: A single-page web tool that generates a rich-text meeting summary with bulleted action items from a raw transcript using

Status: draft

## outOfScope

- User authentication or accounts.
- Server-side storage of transcripts or summaries.
- Multi-language support.
- Mobile app.
- Analytics or tracking.
- CORS proxy (unless explicitly requested).
- Support for text editors other than Quill.js.
- Export to PDF or other formats.

## assumptions

- The tool is client-side only and calls OpenAI API directly from the browser (CORS issues not addressed in MVP).
- The user provides their own OpenAI API key each session and it is not stored.
- The structured prompt instructs OpenAI to return JSON with the specified action item schema.
- Users know how to obtain an OpenAI API key.
- The transcript is plain text with no formatting.
- The tool is a single HTML file with embedded JS and CSS, using CDN for Quill.js.
- No build tools or server-side components required.

## userStories

- As a user, I can paste a raw transcript and my OpenAI API key to generate a summary.
- As a user, I see a formatted summary with action items (task, responsible person, deadline) in a rich text editor.
- As a user, I can edit the generated summary inline.
- As a user, I can copy the rich text summary to my clipboard.
- As a user, I can regenerate the summary with the same input.
- As a user, I get clear error messages for API failures or JSON parsing errors.
- As a user, the Generate button is disabled when the transcript is empty or invalid, and the API key format is invalid.
- As a user, I see a loading spinner during processing.

## scopeQuestions

- Should the tool support other LLM providers (e.g., Anthropic) or only OpenAI?
- Is there a maximum number of action items to display?
- Should the tool allow downloading the summary as a file?
- Should we implement a proxy to avoid CORS issues?
- Do we need to handle transcripts longer than 500 words?
- Should the input or output be persisted in localStorage?

## acceptanceCriteria

- Transcript input limited to 500 words.
- API key input validated: must start with 'sk-'.
- Generate button disabled if transcript empty or API key invalid.
- On valid input, loading spinner shown and OpenAI API called with structured prompt.
- Response parsed as JSON with action items array (task, responsible, deadline).
- Summary rendered in Quill.js rich text editor with bulleted action items.
- Edit functionality allows inline changes.
- Copy Rich Text button copies formatted text to clipboard.
- Regenerate button re-triggers API call with original input.
- API errors (invalid key, rate limit) display error message.
- JSON parsing errors display error message.
- Responsive design for tablets (768px width).
