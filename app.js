/* ============================================================
   Meeting Summarizer — Application Logic
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // Configuration (placeholder values per scaffolding)
  // ============================================================
  const CORS_PROXY_URL = '<to be replaced>';
  const MAX_WORDS = 500;
  const MODEL = 'gpt-3.5-turbo';
  const TEMPERATURE = 0.3;

  const SYSTEM_PROMPT =
    'You are an expert meeting summarizer. Analyze the provided meeting transcript and return a JSON object with exactly two fields: ' +
    '"summary" (a concise paragraph of 3-5 sentences covering key discussion points and decisions) and ' +
    '"action_items" (an array of objects, each with "task" (string), "responsible" (string or null), and "deadline" (string or null)). ' +
    'If the transcript is too short or unclear, still produce your best structured output. Ensure valid JSON.';

  // ============================================================
  // DOM References
  // ============================================================
  const form = document.getElementById('summarizer-form');
  const transcriptEl = document.getElementById('transcript');
  const apiKeyEl = document.getElementById('api-key');
  const generateBtn = document.getElementById('generate-btn');
  const btnText = generateBtn.querySelector('.btn-text');
  const spinner = generateBtn.querySelector('.spinner');
  const wordCountEl = document.getElementById('word-count');
  const wordWarningEl = document.getElementById('word-warning');
  const errorEl = document.getElementById('error-message');
  const editorSection = document.getElementById('editor-section');
  const copyBtn = document.getElementById('copy-btn');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');

  // ============================================================
  // State
  // ============================================================
  let quill = null;
  let lastTranscript = '';
  let lastApiKey = '';

  // ============================================================
  // Quill Initialization
  // ============================================================
  function initQuill() {
    if (quill) return;
    quill = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean']
        ]
      },
      placeholder: 'Your summary and action items will appear here...',
      readOnly: false
    });
  }

  // ============================================================
  // Word Count & Validation
  // ============================================================
  function countWords(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function truncateToWords(text, maxWords) {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return { text: text.trim(), truncated: false };
    return { text: words.slice(0, maxWords).join(' '), truncated: true };
  }

  function validateTranscript(text) {
    const count = countWords(text);
    wordCountEl.textContent = count + ' / ' + MAX_WORDS + ' words';

    if (count > MAX_WORDS) {
      wordWarningEl.textContent = 'Transcript exceeds ' + MAX_WORDS + ' words. It will be truncated to ' + MAX_WORDS + ' words.';
      wordWarningEl.classList.remove('hidden');
    } else {
      wordWarningEl.classList.add('hidden');
    }

    return count > 0;
  }

  function validateApiKey(key) {
    return key && key.trim().startsWith('sk-');
  }

  function validateForm() {
    const transcriptValid = transcriptEl.value.trim().length > 0;
    const keyValid = validateApiKey(apiKeyEl.value);
    const valid = transcriptValid && keyValid;

    generateBtn.disabled = !valid;
    generateBtn.setAttribute('aria-disabled', String(!valid));
    return valid;
  }

  // ============================================================
  // UI Helpers
  // ============================================================
  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    editorSection.classList.add('hidden');
  }

  function hideError() {
    errorEl.classList.add('hidden');
  }

  function showLoading() {
    btnText.classList.add('hidden');
    spinner.classList.add('active');
    generateBtn.disabled = true;
  }

  function hideLoading() {
    btnText.classList.remove('hidden');
    spinner.classList.remove('active');
    generateBtn.disabled = false;
    validateForm();
  }

  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2500);
  }

  // ============================================================
  // API Call
  // ============================================================
  async function callOpenAI(transcript, apiKey) {
    const requestBody = {
      model: MODEL,
      temperature: TEMPERATURE,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript }
      ]
    };

    const response = await fetch(CORS_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errBody = await response.json();
        errorDetail = errBody.error && errBody.error.message ? errBody.error.message : '';
      } catch (_) {
        // ignore parse error
      }

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status >= 500) {
        throw new Error('OpenAI server error. Please try again later.');
      } else {
        throw new Error(
          'Request failed (HTTP ' + response.status + ').' +
          (errorDetail ? ' ' + errorDetail : ' Please try again.')
        );
      }
    }

    const data = await response.json();
    return data;
  }

  // ============================================================
  // Response Parsing
  // ============================================================
  function parseAIResponse(data) {
    // Extract content from OpenAI response format
    let content = '';
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      content = data.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI. Please try again.');
    }

    // Try to parse JSON from the content
    let parsed;
    try {
      // Handle potential markdown code fences
      let cleaned = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleaned = jsonMatch[1].trim();
      }
      parsed = JSON.parse(cleaned);
    } catch (_) {
      // Try to find JSON object in the response
      try {
        const braceMatch = content.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          parsed = JSON.parse(braceMatch[0]);
        } else {
          throw new Error('Could not parse the AI response as JSON.');
        }
      } catch (_) {
        throw new Error('Could not parse the AI response as JSON. The response was: ' + content.substring(0, 200));
      }
    }

    // Validate structure
    if (!parsed.summary || typeof parsed.summary !== 'string') {
      throw new Error('The AI response is missing a "summary" field. Please try regenerating.');
    }

    if (!Array.isArray(parsed.action_items)) {
      parsed.action_items = [];
    }

    return parsed;
  }

  // ============================================================
  // HTML Construction
  // ============================================================
  function formatDeadline(deadline) {
    if (!deadline) return 'No deadline';
    // Try to parse as ISO date
    const date = new Date(deadline);
    if (!isNaN(date.getTime()) && deadline.match(/^\d{4}-\d{2}-\d{2}/)) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    // Return raw string if not a valid ISO date
    return String(deadline);
  }

  function buildSummaryHTML(parsed) {
    var html = '<h2>Summary</h2>';
    html += '<p>' + escapeHtml(parsed.summary) + '</p>';

    if (parsed.action_items && parsed.action_items.length > 0) {
      html += '<h3>Action Items</h3><ul>';
      parsed.action_items.forEach(function (item) {
        var task = item.task || 'Untitled task';
        var responsible = item.responsible || 'Unassigned';
        var deadline = formatDeadline(item.deadline);

        html += '<li>';
        html += '<strong>' + escapeHtml(task) + '</strong>';
        html += ' — <em>Responsible:</em> ' + escapeHtml(responsible);
        html += ' | <em>Deadline:</em> ' + escapeHtml(deadline);
        html += '</li>';
      });
      html += '</ul>';
    } else {
      html += '<p><em>No action items identified.</em></p>';
    }

    return html;
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str);
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ============================================================
  // Core: Generate Summary
  // ============================================================
  async function generateSummary() {
    hideError();

    // Validate
    if (!validateForm()) {
      showError('Please enter a valid transcript and API key before generating.');
      return;
    }

    // Truncate transcript if needed
    var transcript = transcriptEl.value;
    var truncated = truncateToWords(transcript, MAX_WORDS);
    if (truncated.truncated) {
      transcript = truncated.text;
      wordWarningEl.textContent = 'Transcript was truncated to ' + MAX_WORDS + ' words for processing.';
      wordWarningEl.classList.remove('hidden');
    }

    var apiKey = apiKeyEl.value.trim();

    // Store for regeneration
    lastTranscript = transcript;
    lastApiKey = apiKey;

    showLoading();

    try {
      var data = await callOpenAI(transcript, apiKey);
      var parsed = parseAIResponse(data);
      var html = buildSummaryHTML(parsed);

      // Initialize Quill if not already
      if (!quill) {
        initQuill();
      }

      // Insert into Quill editor
      quill.clipboard.dangerouslyPasteHTML(html);

      // Show editor section
      editorSection.classList.remove('hidden');

      hideError();
    } catch (err) {
      showError(err.message || 'An unexpected error occurred. Please try again.');
      editorSection.classList.add('hidden');
    } finally {
      hideLoading();
    }
  }

  // ============================================================
  // Copy to Clipboard
  // ============================================================
  function copyToClipboard() {
    if (!quill) return;

    var contents = quill.root.innerHTML;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // For HTML, we use write (if available) or writeText with HTML string
      var blob = new Blob([contents], { type: 'text/html' });
      var clipboardItem = new ClipboardItem({ 'text/html': blob });

      navigator.clipboard.write([clipboardItem]).then(function () {
        showToast('Copied to clipboard!');
      }).catch(function () {
        // Fallback: copy plain text
        var plainText = quill.getText();
        navigator.clipboard.writeText(plainText).then(function () {
          showToast('Copied as plain text!');
        }).catch(function () {
          fallbackCopy(contents);
        });
      });
    } else {
      fallbackCopy(contents);
    }
  }

  function fallbackCopy(html) {
    // Create a temporary element to copy
    var container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      var range = document.createRange();
      range.selectNodeContents(container);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      var success = document.execCommand('copy');
      selection.removeAllRanges();

      if (success) {
        showToast('Copied to clipboard!');
      } else {
        showToast('Copy failed. Please select and copy manually.');
      }
    } catch (_) {
      showToast('Copy failed. Please select and copy manually.');
    } finally {
      document.body.removeChild(container);
    }
  }

  // ============================================================
  // Regenerate
  // ============================================================
  function regenerate() {
    if (!lastTranscript || !lastApiKey) {
      showError('No previous generation data available. Please submit a new transcript.');
      return;
    }

    // Restore inputs
    transcriptEl.value = lastTranscript;
    apiKeyEl.value = lastApiKey;
    validateForm();
    updateWordCount();

    // Clear editor
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML('<p><em>Regenerating...</em></p>');
    }

    generateSummary();
  }

  // ============================================================
  // Word Count Update
  // ============================================================
  function updateWordCount() {
    validateTranscript(transcriptEl.value);
  }

  // ============================================================
  // Input Event Handlers
  // ============================================================
  transcriptEl.addEventListener('input', function () {
    updateWordCount();
    validateForm();
  });

  apiKeyEl.addEventListener('input', function () {
    validateForm();
  });

  // Toggle API key visibility
  toggleKeyBtn.addEventListener('click', function () {
    var type = apiKeyEl.getAttribute('type');
    if (type === 'password') {
      apiKeyEl.setAttribute('type', 'text');
    } else {
      apiKeyEl.setAttribute('type', 'password');
    }
  });

  // ============================================================
  // Form Submit Handler
  // ============================================================
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!generateBtn.disabled) {
      generateSummary();
    }
  });

  // ============================================================
  // Button Click Handlers
  // ============================================================
  copyBtn.addEventListener('click', copyToClipboard);
  regenerateBtn.addEventListener('click', regenerate);

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    // Initialize word count display
    updateWordCount();
    validateForm();

    // Pre-populate with test data if available
    var testTranscript = document.getElementById('transcript');
    if (testTranscript && !testTranscript.value) {
      // Check if there's a URL param with sample data
      var params = new URLSearchParams(window.location.search);
      var sample = params.get('sample');
      if (sample === '1') {
        testTranscript.value = 'Meeting to discuss Q1 product roadmap. Alice presented the new feature proposal for the dashboard redesign. Bob raised concerns about timeline feasibility. Agreed to extend the deadline by two weeks. Carol will coordinate with design team. Decision to prioritize user authentication module.';
        updateWordCount();
        validateForm();
      }
    }
  }

  init();
})();
