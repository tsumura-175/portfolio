/**
 * main.js
 * Core functionality: header, nav, cursor, lightbox, carousel, form, mobile CTA
 */

(function () {
  'use strict';

  // ========================================
  // Header Scroll Effect & Progress Bar
  // ========================================
  function initHeader() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');

    if (!header) return;

    function updateHeader() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      // Background blur on scroll
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Progress bar
      if (scrollProgress) {
        scrollProgress.style.transform = `scaleX(${progress})`;
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  function initMobileNav() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const links = menu ? menu.querySelectorAll('.mobile-menu-link') : [];

    if (!btn || !menu) return;

    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      btn.classList.toggle('active', isOpen);
      menu.classList.toggle('active', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');

      // Lock body scroll
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      btn.classList.remove('active');
      menu.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', toggleMenu);

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ========================================
  // Custom Cursor
  // ========================================
  function initCustomCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.getElementById('customCursor');
    const cursorText = document.getElementById('cursorText');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const lerp = 0.15; // Smoothing factor (replaces spring animation)

    function updateCursor() {
      // Lerp interpolation for smooth following
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;

      const size = cursor.classList.contains('expanded')
        ? 80
        : cursor.classList.contains('interactive')
        ? 40
        : 16;
      const offset = size / 2;

      cursor.style.transform = `translate(${cursorX - offset}px, ${cursorY - offset}px)`;

      requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursor.classList.contains('visible')) {
        cursor.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });

    // Detect interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, .work-card');

      if (target) {
        const customText = target.dataset.cursor;
        if (customText) {
          cursor.classList.remove('default', 'interactive');
          cursor.classList.add('expanded');
          if (cursorText) cursorText.textContent = customText;
        } else {
          cursor.classList.remove('default', 'expanded');
          cursor.classList.add('interactive');
          if (cursorText) cursorText.textContent = '';
        }
      } else {
        cursor.classList.remove('interactive', 'expanded');
        cursor.classList.add('default');
        if (cursorText) cursorText.textContent = '';
      }

      // Toggle light cursor on dark sections
      const darkSection = e.target.closest('[data-cursor-theme="light"]');
      if (darkSection) {
        cursor.classList.add('cursor-light');
      } else {
        cursor.classList.remove('cursor-light');
      }
    });

    requestAnimationFrame(updateCursor);
  }

  // ========================================
  // Magnetic Buttons
  // ========================================
  function initMagneticButtons() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    const strength = 0.3;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ========================================
  // Lightbox
  // ========================================
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox) return;

    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.work-card-image');
        const title = card.querySelector('.work-card-title');

        if (img && lightboxImage) {
          lightboxImage.src = img.src;
          lightboxImage.alt = img.alt;
        }

        if (title && lightboxCaption) {
          lightboxCaption.textContent = title.textContent;
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ========================================
  // Testimonials Carousel
  // ========================================
  function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialsDots');

    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    const dots = dotsContainer.querySelectorAll('.testimonials-dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalSlides);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Dot clicks
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        goToSlide(index);
        startAutoplay(); // Reset autoplay timer
      });
    });

    // Pause on hover
    const carousel = track.closest('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  // ========================================
  // Contact Form Validation
  // ========================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate name
      const nameField = form.querySelector('#name');
      const nameGroup = nameField.closest('.form-group');
      if (!nameField.value.trim()) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate email
      const emailField = form.querySelector('#email');
      const emailGroup = emailField.closest('.form-group');
      if (!emailRegex.test(emailField.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      if (isValid) {
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScR2M-zPmHHWlt-J96_YsoMY5OhRNxq15ETZvPt5jwk9yrdkQ/formResponse';
        const serviceField = form.querySelector('#service');
        const messageField = form.querySelector('#message');

        const params = new URLSearchParams();
        params.append('entry.593411620', nameField.value.trim());
        params.append('entry.81051294', emailField.value.trim());
        params.append('entry.854515103', serviceField ? serviceField.value : '');
        params.append('entry.1283378040', messageField ? messageField.value.trim() : '');

        fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        }).then(() => {
          form.style.display = 'none';
          if (success) success.classList.add('active');
        }).catch(() => {
          form.style.display = 'none';
          if (success) success.classList.add('active');
        });
      }
    });

    // Remove error on input
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  // ========================================
  // Mobile CTA
  // ========================================
  function initMobileCTA() {
    const mobileCta = document.getElementById('mobileCta');
    if (!mobileCta) return;

    function updateVisibility() {
      const threshold = window.innerHeight * 0.5;

      if (window.scrollY > threshold) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  // ========================================
  // Initialize All
  // ========================================
  function init() {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initCustomCursor();
    initMagneticButtons();
    initLightbox();
    initTestimonials();
    initContactForm();
    initMobileCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
