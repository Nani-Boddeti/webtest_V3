#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadWeatherData(filePath) {
  const resolvedPath = path.resolve(__dirname, filePath);
  const raw = fs.readFileSync(resolvedPath, 'utf8');
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Matching helpers
// ---------------------------------------------------------------------------

/**
 * Find all entries whose city matches the given name (case-insensitive).
 * @param {Object[]} data
 * @param {string} cityName
 * @returns {Object[]}
 */
function findByCity(data, cityName) {
  const lower = cityName.toLowerCase().trim();
  return data.filter(entry => entry.city.toLowerCase() === lower);
}

/**
 * Attempt to parse a "City, Qualifier" input where qualifier may be
 * a state or country.
 * @param {Object[]} data
 * @param {string} input
 * @returns {Object|null}
 */
function tryParseQualifiedInput(data, input) {
  const parts = input.split(',').map(s => s.trim());
  if (parts.length < 2) return null;

  const cityQuery = parts[0];
  const qualifier = parts.slice(1).join(' ').toLowerCase();

  const cityMatches = findByCity(data, cityQuery);
  if (cityMatches.length === 0) {
    return { type: 'none' };
  }

  // Try to match qualifier against state (case-insensitive)
  const byState = cityMatches.filter(
    e => e.state && e.state.toLowerCase() === qualifier
  );
  if (byState.length === 1) {
    return { type: 'unique', matches: byState, qualifier: qualifier };
  }

  // Try to match qualifier against country (case-insensitive)
  const byCountry = cityMatches.filter(
    e => e.country && e.country.toLowerCase() === qualifier
  );
  if (byCountry.length === 1) {
    return { type: 'unique', matches: byCountry, qualifier: qualifier };
  }

  // Check for state abbreviations (e.g., IL, MO)
  const stateAbbrMap = {
    al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas',
    ca: 'California', co: 'Colorado', ct: 'Connecticut', de: 'Delaware',
    fl: 'Florida', ga: 'Georgia', hi: 'Hawaii', id: 'Idaho',
    il: 'Illinois', in: 'Indiana', ia: 'Iowa', ks: 'Kansas',
    ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
    ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi',
    mo: 'Missouri', mt: 'Montana', ne: 'Nebraska', nv: 'Nevada',
    nh: 'New Hampshire', nj: 'New Jersey', nm: 'New Mexico',
    ny: 'New York', nc: 'North Carolina', nd: 'North Dakota',
    oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania',
    ri: 'Rhode Island', sc: 'South Carolina', sd: 'South Dakota',
    tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
    va: 'Virginia', wa: 'Washington', wv: 'West Virginia',
    wi: 'Wisconsin', wy: 'Wyoming'
  };

  const expandedState = stateAbbrMap[qualifier];
  if (expandedState) {
    const byAbbr = cityMatches.filter(
      e => e.state && e.state.toLowerCase() === expandedState.toLowerCase()
    );
    if (byAbbr.length === 1) {
      return { type: 'unique', matches: byAbbr, qualifier: expandedState };
    }
  }

  // Qualifier matched multiple entries – treat as ambiguous
  if (byState.length > 1 || byCountry.length > 1) {
    return { type: 'ambiguous', matches: byState.length > 1 ? byState : byCountry };
  }

  // Qualifier didn't narrow to exactly one
  return { type: 'none' };
}

/**
 * Main entry point: given raw user input, determine the match result.
 * @param {Object[]} data
 * @param {string} input
 * @returns {Object}
 */
function resolveInput(data, input) {
  const trimmed = input.trim();
  if (!trimmed) return { type: 'none' };

  // 1. Try comma-qualified input
  const qualified = tryParseQualifiedInput(data, trimmed);
  if (qualified) return qualified;

  // 2. Simple city lookup
  const matches = findByCity(data, trimmed);
  if (matches.length === 0) {
    return { type: 'none' };
  }
  if (matches.length === 1) {
    return { type: 'unique', matches };
  }
  return { type: 'ambiguous', matches };
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

function displayWeather(entry) {
  const location = entry.state
    ? `${entry.city}, ${entry.state} (${entry.country})`
    : `${entry.city}, ${entry.country}`;
  console.log(`📍 ${location}`);
  console.log(`🌤  ${entry.weather}`);
}

function displayAmbiguity(matches) {
  console.log(`Which did you mean?`);
  matches.forEach((entry, i) => {
    const location = entry.state
      ? `  ${i + 1}. ${entry.city}, ${entry.state} (${entry.country})`
      : `  ${i + 1}. ${entry.city}, ${entry.country}`;
    console.log(location);
  });
}

// ---------------------------------------------------------------------------
// CLI loop
// ---------------------------------------------------------------------------

function startCLI(data) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  // Disambiguation context: stored when we are awaiting clarification
  let disambiguationMatches = null;

  console.log('🌤  Weather Chatbot');
  console.log('Type a city name to get the weather. Type "quit" or "exit" to stop.\n');

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();

    if (/^(quit|exit)$/i.test(input)) {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    // If we're in a disambiguation turn
    if (disambiguationMatches) {
      // Treat the input as a qualifier against all stored ambiguous matches
      const result = resolveDisambiguation(data, input, disambiguationMatches);
      if (result.type === 'unique') {
        displayWeather(result.matches[0]);
        disambiguationMatches = null;
      } else if (result.type === 'ambiguous') {
        displayAmbiguity(result.matches);
        disambiguationMatches = result.matches;
      } else {
        console.log('❌  Sorry, I could not resolve your selection. Please try again.');
        displayAmbiguity(disambiguationMatches);
      }
      rl.prompt();
      return;
    }

    // Normal turn
    const result = resolveInput(data, input);

    switch (result.type) {
      case 'unique':
        displayWeather(result.matches[0]);
        break;
      case 'ambiguous':
        displayAmbiguity(result.matches);
        disambiguationMatches = result.matches;
        break;
      case 'none':
        console.log(`❌  Sorry, I don't have weather data for "${input}".`);
        break;
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

/**
 * Resolve input during a disambiguation turn.
 * The user can type a state/country name, a city name again with comma,
 * or a number.
 */
function resolveDisambiguation(data, input, matches) {
  // Try parsing as "City, Qualifier" first
  const qualified = tryParseQualifiedInput(data, input);
  if (qualified && qualified.type === 'unique') {
    return qualified;
  }

  // Try matching input as a state or country against current ambiguous matches
  const lowerInput = input.toLowerCase().trim();

  // State abbreviation map
  const stateAbbrMap = {
    al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas',
    ca: 'California', co: 'Colorado', ct: 'Connecticut', de: 'Delaware',
    fl: 'Florida', ga: 'Georgia', hi: 'Hawaii', id: 'Idaho',
    il: 'Illinois', in: 'Indiana', ia: 'Iowa', ks: 'Kansas',
    ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
    ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi',
    mo: 'Missouri', mt: 'Montana', ne: 'Nebraska', nv: 'Nevada',
    nh: 'New Hampshire', nj: 'New Jersey', nm: 'New Mexico',
    ny: 'New York', nc: 'North Carolina', nd: 'North Dakota',
    oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania',
    ri: 'Rhode Island', sc: 'South Carolina', sd: 'South Dakota',
    tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
    va: 'Virginia', wa: 'Washington', wv: 'West Virginia',
    wi: 'Wisconsin', wy: 'Wyoming'
  };

  // Match by state name
  let filtered = matches.filter(
    e => e.state && e.state.toLowerCase() === lowerInput
  );
  if (filtered.length === 1) {
    return { type: 'unique', matches: filtered };
  }

  // Match by state abbreviation
  const expanded = stateAbbrMap[lowerInput];
  if (expanded) {
    filtered = matches.filter(
      e => e.state && e.state.toLowerCase() === expanded.toLowerCase()
    );
    if (filtered.length === 1) {
      return { type: 'unique', matches: filtered };
    }
  }

  // Match by country
  filtered = matches.filter(
    e => e.country && e.country.toLowerCase() === lowerInput
  );
  if (filtered.length === 1) {
    return { type: 'unique', matches: filtered };
  }

  // Match by number (e.g., "1", "2")
  const num = parseInt(input, 10);
  if (!isNaN(num) && num >= 1 && num <= matches.length) {
    return { type: 'unique', matches: [matches[num - 1]] };
  }

  // If it matched multiple, return ambiguous again
  if (filtered.length > 1) {
    return { type: 'ambiguous', matches: filtered };
  }

  return { type: 'none' };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

try {
  const data = loadWeatherData('weather-data.json');
  startCLI(data);
} catch (err) {
  console.error('Failed to load weather data:', err.message);
  process.exit(1);
}
