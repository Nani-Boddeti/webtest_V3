/**
 * AI Intent Extraction Accuracy Test
 * 
 * Tests the intent extraction logic against the curated test set.
 * Acceptance: >= 90% accuracy on 500+ utterance test set.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Pattern matching logic mirrors backend/app/services/ai_service.py
// Order matters: cancel/reschedule checked BEFORE booking to avoid false matches

const INTENT_PATTERNS = {
  "cancel": [
    /\b(cancel|cancelled|cancellation)\b/i,
    /\b(delete|remove|unbook|void|call off)\b/i,
    /\b(need to cancel|want to cancel|i'd like to cancel|i have to cancel)\b/i,
    /\b(can (I|you) cancel|please cancel)\b/i,
    /\b(cancel (my|the|this))\b/i,
  ],
  "reschedule": [
    /\b(reschedule|rescheduling)\b/i,
    /\b(move)\b/i,
    /\b(rearrange)\b/i,
    /\b(change (my )?(appointment|booking|time|date|day))\b/i,
    /\b(different time|different day|different date)\b/i,
    /\b(need to (reschedule|move|change|rearrange))\b/i,
    /\b(want to (reschedule|move|change|rearrange))\b/i,
    /\b(can (I|we) (reschedule|move|change))\b/i,
    /\b(i'd like to (reschedule|move|change))\b/i,
  ],
  "booking": [
    /\b(book|schedule|reserve|reservation)\b/i,
    /\b(booking)\b/i,
    /\b(want to (come|see))\b/i,
    /\b(i'd like to (book|schedule|make|come|reserve))\b/i,
    /\b(can I (book|schedule|get|come|make))\b/i,
    /\b(can you book|can you schedule)\b/i,
    /\b(make (a|an|me) (booking|appointment|reservation))\b/i,
    /\b(i need (a|an|to) (book|schedule|appointment|reservation|make|get))\b/i,
    /\b(i want (a|an|to) (book|schedule|appointment|reservation|make|get))\b/i,
    /\b(i'd like (a|an))/i,
    /\b(need to (book|schedule|make|get))\b/i,
    /\b(want to (book|schedule|make|get|reserve))\b/i,
    /\b(get (a|an|my) (haircut|massage|facial|manicure|pedicure|consultation|hair.?cut))\b/i,
    /\b(come in for)\b/i,
    /\b(i want (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b/i,
    /\b(i need (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b/i,
    /\b(i'd like (a|an) (haircut|massage|facial|manicure|pedicure|consultation))\b/i,
  ],
  "availability": [
    /\b(available|availability)\b/i,
    /\bfree\b/i,
    /\b(free.?slot|open.?slot|slot.?open|slot.?free)\b/i,
    /\b(when can|what times|any openings|openings)\b/i,
    /\b(do you have|is there (any|an)|are there)\b/i,
    /\b(what (time|slots|appointments) (is|are|do))\b/i,
    /\b(show me|tell me|check|see)\b.*\b(available|free|open|slot|schedule)\b/i,
    /\b(i want to check|i need to check|can (i|you) check)\b/i,
  ],
  "greeting": [
    /\b(hi|hello|hey|howdy)\b/i,
    /\b(good morning|good afternoon|good evening)\b/i,
    /\b(hi there|hello there|hey there)\b/i,
    /\b(what's up|how are you|how's it going|how are you doing)\b/i,
    /\b(greetings|good day|nice to meet you)\b/i,
    /\b(yo)\b/i,
  ],
  "help": [
    /\b(help|support|instructions)\b/i,
    /\b(what can you do|what do you do|how (does this|do i|can i))\b/i,
    /\b(how (to|do|does|can))\b/i,
    /\b(tell me|show me|guide me)\b/i,
    /\b(need help|need assistance)\b/i,
    /\b(i don't know how|not sure how|don't understand)\b/i,
    /\b(i need (help|assistance))\b/i,
    /\b(what (services|options) do you)\b/i,
  ],
};

function extractIntent(message) {
  const msg = message.trim();
  const msgLower = msg.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(msg)) {
        // For booking patterns using generic terms, exclude if message is about cancel/reschedule
        if (intent === 'booking') {
          if (/\b(cancel|reschedule|delete|remove|void|unbook)\b/i.test(msg)) {
            continue;
          }
        }
        return intent;
      }
    }
  }
  
  // Fallback checks for patterns that might be missed
  if (/\b(cancel|delete|remove|void|unbook)\b/i.test(msg)) {
    return "cancel";
  }
  
  if (/\b(move|reschedule|rearrange)\b/i.test(msg) && 
      /\b(appointment|booking|time|date|day)\b/i.test(msg)) {
    return "reschedule";
  }
  
  return "unknown";
}

// Load test set
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testSetPath = join(__dirname, 'ai_test_set.json');

let testSet;
try {
  const raw = readFileSync(testSetPath, 'utf8');
  testSet = JSON.parse(raw);
} catch (err) {
  console.error(`Error loading test set: ${err.message}`);
  process.exit(1);
}

console.log(`\n📊 AI Intent Accuracy Test`);
console.log(`Test set: ${testSet.length} utterances\n`);

const results = {
  total: testSet.length,
  correct: 0,
  incorrect: 0,
  byIntent: {}
};

let firstErrors = 0;
testSet.forEach((test, i) => {
  const predicted = extractIntent(test.message);
  const isCorrect = predicted === test.expected_intent;
  
  if (isCorrect) {
    results.correct++;
  } else {
    results.incorrect++;
    if (firstErrors < 20) {
      console.log(`  ❌ #${i+1}: "${test.message.substring(0, 65)}..." → expected "${test.expected_intent}", got "${predicted}"`);
      firstErrors++;
    }
  }
  
  if (!results.byIntent[test.expected_intent]) {
    results.byIntent[test.expected_intent] = { total: 0, correct: 0 };
  }
  results.byIntent[test.expected_intent].total++;
  if (isCorrect) results.byIntent[test.expected_intent].correct++;
});

const accuracy = (results.correct / results.total * 100).toFixed(2);
const passed = parseFloat(accuracy) >= 90;

console.log(`\n📈 Results:`);
console.log(`  ✅ Correct:   ${results.correct}/${results.total}`);
console.log(`  ❌ Incorrect: ${results.incorrect}/${results.total}`);
console.log(`  🎯 Accuracy:  ${accuracy}%`);
console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'} (threshold: >= 90%)\n`);

console.log('📊 By Intent:');
for (const [intent, data] of Object.entries(results.byIntent)) {
  const pct = (data.correct / data.total * 100).toFixed(1);
  console.log(`  ${intent.padEnd(15)} ${data.correct}/${data.total} (${pct}%)`);
}

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  totalTests: results.total,
  correct: results.correct,
  incorrect: results.incorrect,
  accuracy: parseFloat(accuracy),
  passed,
  byIntent: results.byIntent,
  threshold: 90
};

try {
  writeFileSync(join(__dirname, 'ai_accuracy_report.json'), JSON.stringify(report, null, 2));
  console.log('\n📝 Report saved to tests/ai_accuracy_report.json');
} catch (err) {
  console.error(`Warning: Could not save report: ${err.message}`);
}

process.exit(passed ? 0 : 1);
