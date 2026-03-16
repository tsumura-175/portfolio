/**
 * top.js
 * Top page interactions: smooth scroll, scroll reveal, header effect,
 * mobile nav, card glow, scroll indicator
 */

(function () {
  'use strict';

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeader() {
    var header = document.getElementById('topHeader');
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  function initMobileNav() {
    var btn = document.getElementById('mobileMenuBtn');
    var overlay = document.getElementById('mobileNavOverlay');
    if (!btn || !overlay) return;

    var links = overlay.querySelectorAll('.mobile-nav-link');

    function openMenu() {
      btn.classList.add('is-active');
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      btn.classList.remove('is-active');
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (overlay.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ========================================
  // Scroll Reveal (IntersectionObserver)
  // ========================================
  function initScrollReveal() {
    var elements = document.querySelectorAll('.top-reveal');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ========================================
  // Card Glow Effect (mouse follow)
  // ========================================
  function initCardGlow() {
    var cards = document.querySelectorAll('.project-card:not(.project-card--placeholder)');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var inner = card.querySelector('.project-card-inner');
        if (!inner) return;
        var rect = inner.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        inner.style.setProperty('--mouse-x', x + 'px');
        inner.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // ========================================
  // Scroll Indicator Hide
  // ========================================
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    function updateIndicator() {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '';
        indicator.style.pointerEvents = '';
      }
    }

    window.addEventListener('scroll', updateIndicator, { passive: true });
  }

  // ========================================
  // Contact Form
  // ========================================
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    if (!form || !success) return;

    var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScR2M-zPmHHWlt-J96_YsoMY5OhRNxq15ETZvPt5jwk9yrdkQ/formResponse';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Reset errors
      form.querySelectorAll('.top-form-group').forEach(function (group) {
        group.classList.remove('has-error');
      });

      var nameInput = form.querySelector('#name');
      var emailInput = form.querySelector('#email');
      var serviceInput = form.querySelector('#service');
      var messageInput = form.querySelector('#message');
      var valid = true;

      if (!nameInput.value.trim()) {
        nameInput.closest('.top-form-group').classList.add('has-error');
        valid = false;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.top-form-group').classList.add('has-error');
        valid = false;
      }

      if (!valid) return;

      // Build form data for Google Forms
      var params = new URLSearchParams();
      params.append('entry.593411620', nameInput.value.trim());
      params.append('entry.81051294', emailInput.value.trim());
      params.append('entry.854515103', serviceInput.value);
      params.append('entry.1283378040', messageInput.value.trim());

      // Submit to Google Forms
      fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).then(function () {
        form.style.display = 'none';
        success.classList.add('active');
      }).catch(function () {
        form.style.display = 'none';
        success.classList.add('active');
      });
    });
  }

  // ========================================
  // Initialize
  // ========================================
  function init() {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initCardGlow();
    initScrollIndicator();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
