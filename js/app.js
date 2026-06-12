/* ============================================================
   Clean Beauty Tips — SPA Application
   Hash-based router with component rendering
   ============================================================ */

'use strict';

// --- State ---
let tipsData = [];
let currentRoute = null;
let isNavOpen = false;

// --- DOM References ---
const $app = document.getElementById('app');
const $loading = document.getElementById('loading');
const $navToggle = document.getElementById('nav-toggle');
const $mainNav = document.getElementById('main-nav');
const $navLinks = document.querySelectorAll('.header__nav-link');

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Sanitize a string for safe HTML injection.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Format a date string to a readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get a category display name from a slug.
 * @param {string} slug
 * @returns {string}
 */
function categoryDisplayName(slug) {
  const names = {
    'skincare': 'Skincare',
    'haircare': 'Haircare',
    'clean-beauty': 'Clean Beauty',
    'sustainability': 'Sustainability',
    'makeup': 'Makeup'
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
}

/**
 * Get tips by category.
 * @param {string} category
 * @returns {Array}
 */
function getTipsByCategory(category) {
  if (!category) return tipsData;
  return tipsData.filter(tip => tip.category === category);
}

/**
 * Get a tip by ID.
 * @param {number|string} id
 * @returns {object|undefined}
 */
function getTipById(id) {
  const numId = Number(id);
  return tipsData.find(tip => tip.id === numId);
}

// ============================================================
// HTML COMPONENT FUNCTIONS
// ============================================================

/**
 * Render the hero section for the home page.
 */
function renderHero() {
  return `
    <section class="hero">
      <span class="hero__badge">✨ Natural & Sustainable</span>
      <h1 class="hero__title">Your Guide to Clean Beauty</h1>
      <p class="hero__subtitle">
        Discover expert tips on natural skincare, haircare, and sustainable beauty practices.
        Embrace a simpler, more radiant you.
      </p>
      <a href="#/tips" class="hero__cta">Explore All Tips</a>
    </section>
  `;
}

/**
 * Render category pill links.
 */
function renderCategoryPills() {
  const categories = ['skincare', 'haircare', 'clean-beauty', 'sustainability', 'makeup'];
  const pills = categories.map(cat => `
    <a href="#/category/${cat}" class="category-pill">${categoryDisplayName(cat)}</a>
  `).join('');
  return `
    <nav class="categories" aria-label="Browse by category">
      ${pills}
    </nav>
  `;
}

/**
 * Render a single tip card.
 * @param {object} tip
 * @returns {string}
 */
function renderTipCard(tip) {
  const imgSrc = tip.image || '';
  const imgPlaceholder = `<div class="tip-card__image tip-card__image--placeholder" aria-label="Placeholder image">✦</div>`;
  const imgTag = imgSrc
    ? `<img class="tip-card__image" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(tip.title)}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='${imgPlaceholder.replace(/'/g, "\\'")}';">`
    : imgPlaceholder;

  return `
    <article class="tip-card">
      <div class="tip-card__image-wrapper">
        ${imgTag}
        <span class="tip-card__category">${escapeHtml(categoryDisplayName(tip.category))}</span>
      </div>
      <div class="tip-card__body">
        <h2 class="tip-card__title">
          <a href="#/tip/${tip.id}">${escapeHtml(tip.title)}</a>
        </h2>
        <p class="tip-card__summary">${escapeHtml(tip.summary)}</p>
        <div class="tip-card__meta">
          <span class="tip-card__author">${escapeHtml(tip.author || 'Anonymous')}</span>
          <time class="tip-card__date" datetime="${tip.date || ''}">${tip.date ? formatDate(tip.date) : ''}</time>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a grid of tip cards.
 * @param {Array} tips
 * @returns {string}
 */
function renderTipGrid(tips) {
  if (!tips || tips.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🌸</div>
        <h2 class="empty-state__title">No tips found</h2>
        <p class="empty-state__text">Check back soon for new beauty tips in this category.</p>
      </div>
    `;
  }
  return `<div class="tip-grid">${tips.map(renderTipCard).join('')}</div>`;
}

// ============================================================
// PAGE COMPONENTS
// ============================================================

/**
 * Home page component.
 */
function homePage() {
  const featuredTips = tipsData.slice(0, 3);
  return `
    ${renderHero()}
    ${renderCategoryPills()}

    <div class="section-header">
      <h2 class="section-header__title">Featured Tips</h2>
      <p class="section-header__subtitle">Handpicked advice to start your clean beauty journey</p>
    </div>
    ${renderTipGrid(featuredTips)}
    <div style="text-align:center;margin-top:var(--space-xl)">
      <a href="#/tips" class="hero__cta" style="background:transparent;color:var(--color-accent-dark);border:2px solid var(--color-accent);">View All Tips →</a>
    </div>
  `;
}

/**
 * All tips listing page component.
 */
function tipsListingPage() {
  return `
    <div class="section-header">
      <h1 class="section-header__title">All Beauty Tips</h1>
      <p class="section-header__subtitle">${tipsData.length} tip${tipsData.length !== 1 ? 's' : ''} to explore</p>
    </div>
    ${renderCategoryPills()}
    ${renderTipGrid(tipsData)}
  `;
}

/**
 * Category page component.
 * @param {string} category
 */
function categoryPage(category) {
  const filtered = getTipsByCategory(category);
  return `
    <div class="category-header">
      <h1 class="category-header__title">${escapeHtml(categoryDisplayName(category))}</h1>
      <p class="category-header__count">${filtered.length} tip${filtered.length !== 1 ? 's' : ''}</p>
    </div>
    ${renderCategoryPills()}
    ${renderTipGrid(filtered)}
  `;
}

/**
 * Tip detail page component.
 * @param {number|string} id
 */
function tipDetailPage(id) {
  const tip = getTipById(id);
  if (!tip) {
    return notFoundPage('Tip not found');
  }

  const imgSrc = tip.image || '';
  const imgPlaceholder = `<div class="tip-detail__image tip-detail__image--placeholder" aria-label="Placeholder image">✦</div>`;
  const imgTag = imgSrc
    ? `<img class="tip-detail__image" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(tip.title)}" onerror="this.onerror=null;this.parentElement.innerHTML='${imgPlaceholder.replace(/'/g, "\\'")}';">`
    : imgPlaceholder;

  const contentSections = tip.content.map(section => `
    <div class="tip-detail__section">
      <h3 class="tip-detail__section-heading">${escapeHtml(section.heading)}</h3>
      <p class="tip-detail__section-text">${escapeHtml(section.text)}</p>
    </div>
  `).join('');

  const tags = (tip.tags || []).map(tag =>
    `<span class="tip-detail__tag">${escapeHtml(tag)}</span>`
  ).join('');

  return `
    <article class="tip-detail">
      <a href="#/tips" class="tip-detail__back">
        <span class="tip-detail__back-arrow">←</span> Back to all tips
      </a>

      <header class="tip-detail__header">
        <span class="tip-detail__category">${escapeHtml(categoryDisplayName(tip.category))}</span>
        <h1 class="tip-detail__title">${escapeHtml(tip.title)}</h1>
        <div class="tip-detail__meta">
          <span class="tip-detail__author">By ${escapeHtml(tip.author || 'Anonymous')}</span>
          <time datetime="${tip.date || ''}">${tip.date ? formatDate(tip.date) : ''}</time>
        </div>
      </header>

      <div class="tip-detail__image-wrapper">
        ${imgTag}
      </div>

      <div class="tip-detail__content">
        ${contentSections}
      </div>

      <div class="tip-detail__tags">
        ${tags}
      </div>
    </article>
  `;
}

/**
 * 404 page component.
 * @param {string} [message]
 */
function notFoundPage(message) {
  return `
    <div class="not-found">
      <div class="not-found__code">404</div>
      <h1 class="not-found__title">Page Not Found</h1>
      <p class="not-found__text">${escapeHtml(message || 'The page you\'re looking for doesn\'t exist or has been moved.')}</p>
      <a href="#/" class="not-found__link">Back to Home</a>
    </div>
  `;
}

/**
 * Error page component.
 * @param {string} message
 */
function errorPage(message) {
  return `
    <div class="error-state">
      <div class="error-state__icon">🌿</div>
      <h1 class="error-state__title">Oops! Something went wrong</h1>
      <p class="error-state__text">${escapeHtml(message || 'We couldn\'t load the beauty tips. Please try again.')}</p>
      <button class="error-state__button" onclick="location.reload()">Try Again</button>
    </div>
  `;
}

// ============================================================
// ROUTER
// ============================================================

/**
 * Parse the current hash and return route info.
 * @returns {{ page: string, params: object }}
 */
function parseRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  const parts = hash.split('/').filter(Boolean);

  // Default: home
  if (hash === '/' || parts.length === 0) {
    return { page: 'home', params: {} };
  }

  const page = parts[0];

  // #/tips — all tips listing
  if (page === 'tips') {
    return { page: 'tips', params: {} };
  }

  // #/tip/:id — tip detail
  if (page === 'tip' && parts[1]) {
    return { page: 'tip', params: { id: parts[1] } };
  }

  // #/category/:slug — category filter
  if (page === 'category' && parts[1]) {
    return { page: 'category', params: { category: parts[1] } };
  }

  // Unknown route → 404
  return { page: '404', params: {} };
}

/**
 * Render the current route into the app container.
 */
function renderRoute() {
  if (!tipsData || tipsData.length === 0) {
    // If data hasn't loaded or is empty, show appropriate state
    if (tipsData && tipsData.length === 0) {
      $app.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🌸</div>
          <h2 class="empty-state__title">No tips available</h2>
          <p class="empty-state__text">Beauty tips content is coming soon. Check back later!</p>
        </div>
      `;
    }
    return;
  }

  const route = parseRoute();
  currentRoute = route;

  let html = '';

  switch (route.page) {
    case 'home':
      html = homePage();
      break;
    case 'tips':
      html = tipsListingPage();
      break;
    case 'category':
      html = categoryPage(route.params.category);
      break;
    case 'tip':
      html = tipDetailPage(route.params.id);
      break;
    default:
      html = notFoundPage();
  }

  $app.innerHTML = html;
  updateActiveNav();
  closeNav();
  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Update active nav link styling based on current route.
 */
function updateActiveNav() {
  $navLinks.forEach(link => {
    link.classList.remove('active');
    const route = link.getAttribute('data-route');

    if (currentRoute) {
      if (currentRoute.page === 'home' && route === 'home') {
        link.classList.add('active');
      } else if (currentRoute.page === 'tips' && route === 'tips') {
        link.classList.add('active');
      } else if (currentRoute.page === 'category' && route === 'category') {
        // Match category links
        const linkHref = link.getAttribute('href');
        const linkCategory = linkHref.split('/category/')[1];
        if (linkCategory === currentRoute.params.category) {
          link.classList.add('active');
        }
      }
    }
  });
}

/**
 * Toggle mobile navigation open/closed.
 */
function toggleNav() {
  isNavOpen = !isNavOpen;
  $navToggle.classList.toggle('open', isNavOpen);
  $mainNav.classList.toggle('open', isNavOpen);
  $navToggle.setAttribute('aria-expanded', String(isNavOpen));
}

/**
 * Close mobile navigation.
 */
function closeNav() {
  isNavOpen = false;
  $navToggle.classList.remove('open');
  $mainNav.classList.remove('open');
  $navToggle.setAttribute('aria-expanded', 'false');
}

// ============================================================
// DATA FETCHING
// ============================================================

/**
 * Fetch tips data from the JSON file.
 * @returns {Promise<Array>}
 */
async function fetchTips() {
  const response = await fetch('data/tips.json');
  if (!response.ok) {
    throw new Error(`Failed to load tips (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: expected an array');
  }
  return data;
}

/**
 * Initialize the application: fetch data, hide loader, start router.
 */
async function initApp() {
  try {
    tipsData = await fetchTips();

    // Hide loading state
    if ($loading) {
      $loading.style.display = 'none';
    }

    // Render initial route
    renderRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', renderRoute);

  } catch (err) {
    console.error('Failed to initialize app:', err);

    // Show error state
    if ($loading) {
      $loading.style.display = 'none';
    }
    $app.innerHTML = errorPage(err.message || 'Could not load beauty tips. Please check your connection and try again.');
  }
}

// ============================================================
// EVENT BINDING
// ============================================================

// Hamburger toggle
if ($navToggle) {
  $navToggle.addEventListener('click', toggleNav);
}

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (isNavOpen) {
    const isNavClick = $mainNav.contains(e.target);
    const isToggleClick = $navToggle.contains(e.target);
    if (!isNavClick && !isToggleClick) {
      closeNav();
    }
  }
});

// Close nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isNavOpen) {
    closeNav();
    $navToggle.focus();
  }
});

// Close nav on route link click (handled by hashchange, but close immediately)
$navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (isNavOpen) {
      closeNav();
    }
  });
});

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', initApp);
