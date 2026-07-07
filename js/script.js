/**
 * Haven & Hearth Realty — Client-Side Scripts
 * Smooth scroll fallback · Mobile nav toggle · Active nav link highlight
 */
(function () {
  'use strict';

  /* ── Mobile nav toggle ── */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked (mobile)
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Smooth scroll polyfill for browsers without native scroll-behavior ── */
  if (!('scrollBehavior' in document.documentElement.style)) {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < anchorLinks.length; j++) {
      anchorLinks[j].addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var navH = 72; // --nav-height
        var top = target.getBoundingClientRect().top + window.pageYOffset - navH;
        smoothScrollTo(top, 600);
      });
    }
  }

  /**
   * Ease-in-out cubic smooth scroll.
   */
  function smoothScrollTo(to, duration) {
    var start = window.pageYOffset;
    var change = to - start;
    var startTime = performance.now();

    function animate(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // easeInOutCubic
      var val = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + change * val);
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  /* ── Active nav link highlight on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var current = '';

    for (var k = 0; k < sections.length; k++) {
      var section = sections[k];
      var sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    }

    for (var m = 0; m < navAs.length; m++) {
      var a = navAs[m];
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--color-primary-dark, #B87D7D)';
      }
    }
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        onScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  /* ── Contact form demo handler (no backend; displays thank-you inline) ── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formMsg = document.getElementById('formMsg');
      if (formMsg) {
        formMsg.textContent = 'Thank you for your message! We will get back to you shortly.';
        formMsg.style.color = 'var(--color-primary-dark)';
        formMsg.style.fontWeight = '600';
        formMsg.style.marginTop = '1rem';
      }
      contactForm.reset();
    });
  }
})();
