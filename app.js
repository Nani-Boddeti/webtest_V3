/* ── Configuration ─────────────────────────────────────────────── */
const CORS_PROXY_URL = '<to be replaced>';
const OPENAI_API_KEY_PLACEHOLDER = '<to be replaced>';
const MAX_WORDS = 500;
const MODEL = 'gpt-3.5-turbo';
const TEMPERATURE = 0.3;

const SYSTEM_PROMPT =
  'You are a meeting summarizer. Given a meeting transcript, produce a JSON object with two fields: ' +
  '"summary" (a concise paragraph of 3-5 sentences) and "action_items" (an array of objects, each with ' +
  '"task" (string), "responsible" (string or null), and "deadline" (string ISO date or null)). ' +
  'Do not include any text outside the JSON object.';

/* ── DOM References ───────────────────────────────────────────── */
const transcriptInput = document.getElementById('transcript-input');
const apiKeyInput = document.getElementById('api-key-input');
const generateBtn = document.getElementById('generate-btn');
const spinner = document.getElementById('spinner');
const errorDisplay = document.getElementById('error-display');
const wordCountSpan = document.getElementById('word-count');
const wordWarning = document.getElementById('word-warning');
const copyBtn = document.getElementById('copy-btn');
const regenerateBtn = document.getElementById('regenerate-btn');

/* ── State ────────────────────────────────────────────────────── */
let lastTranscript = '';
let lastApiKey = '';
let isGenerating = false;

/* ── Quill Initialization ─────────────────────────────────────── */
const quill = new Quill('#editor-container', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  },
  placeholder: 'Your summary will appear here…',
});

/* ── Utility Functions ────────────────────────────────────────── */

/** Count words in a string (splits on whitespace). */
function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Validate transcript: return { valid, truncated, warning } */
function validateTranscript(text) {
  const words = countWords(text);
  if (words === 0) return { valid: false, truncated: false, warning: '' };
  if (words > MAX_WORDS) {
    return { valid: true, truncated: true, warning: `Truncated from ${words} to ${MAX_WORDS} words.` };
  }
  return { valid: true, truncated: false, warning: '' };
}

/** Validate API key format: must start with 'sk-'. */
function validateApiKey(key) {
  return typeof key === 'string' && key.trim().startsWith('sk-');
}

/** Show error with user-friendly message. */
function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('hidden');
}

/** Clear error display. */
function clearError() {
  errorDisplay.textContent = '';
  errorDisplay.classList.add('hidden');
}

/** Show/hide spinner. */
function setLoading(loading) {
  isGenerating = loading;
  spinner.classList.toggle('hidden', !loading);
  generateBtn.disabled = loading || !canGenerate();
  if (loading) {
    copyBtn.disabled = true;
    regenerateBtn.disabled = true;
  }
}

/** Build a safe, truncated transcript text. */
function getProcessedTranscript() {
  const text = transcriptInput.value || '';
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return text.trim();
  return words.slice(0, MAX_WORDS).join(' ');
}

/** Determine if Generate button should be enabled. */
function canGenerate() {
  const transcriptValid = countWords(transcriptInput.value) > 0;
  const apiKeyValid = validateApiKey(apiKeyInput.value);
  return transcriptValid && apiKeyValid && !isGenerating;
}

/* ── Input Validation & Button State ──────────────────────────── */

function updateInputState() {
  clearError();

  // Transcript validation
  const text = transcriptInput.value || '';
  const tResult = validateTranscript(text);
  const wordCount = countWords(text);
  wordCountSpan.textContent = `${wordCount} / ${MAX_WORDS} words`;
  wordCountSpan.classList.toggle('over-limit', wordCount > MAX_WORDS);

  if (tResult.warning) {
    wordWarning.textContent = '⚠️ ' + tResult.warning;
    wordWarning.className = 'warning-visible';
  } else {
    wordWarning.textContent = '';
    wordWarning.className = 'warning-hidden';
  }

  // API key validation
  const apiKey = apiKeyInput.value || '';
  const apiKeyValid = validateApiKey(apiKey);

  // Generate button
  generateBtn.disabled = !canGenerate();
}

transcriptInput.addEventListener('input', updateInputState);
apiKeyInput.addEventListener('input', updateInputState);

/* ── API Call ──────────────────────────────────────────────────── */

async function callSummarizer(transcript, apiKey) {
  const url = CORS_PROXY_URL;

  const body = JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: transcript },
    ],
    temperature: TEMPERATURE,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    let errorMsg = `API request failed with status ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody.error && errBody.error.message) {
        errorMsg = errBody.error.message;
      }
    } catch (_) {
      // ignore JSON parse failure on error body
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Validate OpenAI response structure
  if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error('Unexpected API response structure. Missing choices array.');
  }

  const content = data.choices[0].message?.content;
  if (!content) {
    throw new Error('API response missing message content.');
  }

  // Parse the expected JSON from the content
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (_) {
    throw new Error(
      'Failed to parse AI response as JSON. The model did not return a valid JSON structure.'
    );
  }

  // Validate expected shape
  if (!parsed.summary || typeof parsed.summary !== 'string') {
    throw new Error('Response missing required field: "summary" (string).');
  }
  if (!Array.isArray(parsed.action_items)) {
    throw new Error('Response missing required field: "action_items" (array).');
  }

  // Validate each action item shape
  for (let i = 0; i < parsed.action_items.length; i++) {
    const item = parsed.action_items[i];
    if (!item.task || typeof item.task !== 'string') {
      throw new Error(`Action item ${i + 1} is missing a valid "task" field.`);
    }
  }

  return parsed;
}

/* ── HTML Construction ─────────────────────────────────────────── */

function formatDeadline(deadline) {
  if (!deadline) return null; // will show as raw
  // Check if it's a valid ISO date
  const date = new Date(deadline);
  if (!isNaN(date.getTime())) {
    // Valid date - format nicely
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return deadline; // return raw string
}

function buildResultHtml(result) {
  let html = '';

  // Summary
  html += '<p><strong>📝 Summary</strong></p>';
  html += `<p>${escapeHtml(result.summary)}</p>`;

  // Action Items
  if (result.action_items.length > 0) {
    html += '<p><strong>✅ Action Items</strong></p>';
    html += '<ul>';
    for (const item of result.action_items) {
      const task = escapeHtml(item.task);
      const responsible = item.responsible
        ? escapeHtml(item.responsible)
        : 'Unassigned';
      const deadline = formatDeadline(item.deadline)
        ? escapeHtml(formatDeadline(item.deadline))
        : 'No deadline';
      html += `<li><strong>${task}</strong> – ${responsible} (${deadline})</li>`;
    }
    html += '</ul>';
  }

  return html;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ── Insert into Quill ────────────────────────────────────────── */

function insertIntoEditor(html) {
  quill.clipboard.dangerouslyPasteHTML(html);
}

/* ── Generate Flow ─────────────────────────────────────────────── */

async function handleGenerate() {
  clearError();

  // Get and process inputs
  let transcript = transcriptInput.value || '';
  const apiKey = apiKeyInput.value.trim();

  // Validate again
  if (countWords(transcript) === 0) {
    showError('Please enter a meeting transcript before generating.');
    return;
  }
  if (!validateApiKey(apiKey)) {
    showError('Please enter a valid API key starting with "sk-".');
    return;
  }

  // Truncate if needed
  const tResult = validateTranscript(transcript);
  if (tResult.truncated) {
    transcript = getProcessedTranscript();
    // Warning is already displayed in UI via updateInputState
  }

  // Store for regeneration
  lastTranscript = transcript;
  lastApiKey = apiKey;

  // Show loading
  setLoading(true);
  generateBtn.disabled = true;
  copyBtn.disabled = true;
  regenerateBtn.disabled = true;

  try {
    const result = await callSummarizer(transcript, apiKey);
    const html = buildResultHtml(result);
    insertIntoEditor(html);
    copyBtn.disabled = false;
    regenerateBtn.disabled = false;
  } catch (err) {
    showError(err.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
}

generateBtn.addEventListener('click', handleGenerate);

/* ── Regenerate ────────────────────────────────────────────────── */

async function handleRegenerate() {
  if (!lastTranscript || !lastApiKey) {
    showError('No previous request to regenerate. Generate a summary first.');
    return;
  }

  clearError();
  setLoading(true);
  generateBtn.disabled = true;
  copyBtn.disabled = true;
  regenerateBtn.disabled = true;

  try {
    const result = await callSummarizer(lastTranscript, lastApiKey);
    const html = buildResultHtml(result);
    insertIntoEditor(html);
    copyBtn.disabled = false;
    regenerateBtn.disabled = false;
  } catch (err) {
    showError(err.message || 'An unexpected error occurred during regeneration.');
  } finally {
    setLoading(false);
  }
}

regenerateBtn.addEventListener('click', handleRegenerate);

/* ── Copy to Clipboard ─────────────────────────────────────────── */

function getEditorContent() {
  return quill.root.innerHTML;
}

async function handleCopy() {
  const content = getEditorContent();
  if (!content || content === '<p><br></p>') {
    showError('Nothing to copy. Generate a summary first.');
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    // Temporary success feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    // Fallback: use document.execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (_) {
      showError('Failed to copy to clipboard. Please select and copy the text manually.');
    }
  }
}

copyBtn.addEventListener('click', handleCopy);

/* ── Keyboard Shortcut: Ctrl+Enter to Generate ─────────────────── */

transcriptInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter' && !generateBtn.disabled) {
    e.preventDefault();
    handleGenerate();
  }
});

/* ── Initial State ─────────────────────────────────────────────── */
updateInputState();
