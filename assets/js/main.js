/* ============================================================
   THE MERCURY BETHESDA — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Nav: scroll effect + hamburger ---------- */
  const nav = document.querySelector('.nav');

  function updateNav() {
    if (!nav) return;
    if (nav.classList.contains('nav--solid')) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  (function highlightNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  })();

  /* ---------- Intersection Observer: fade-up ---------- */
  const animEls = document.querySelectorAll('.fade-up, .fade-in');

  if ('IntersectionObserver' in window && animEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything
    animEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Stagger children ---------- */
  document.querySelectorAll('.stagger').forEach(function (parent) {
    Array.from(parent.children).forEach(function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox  = document.querySelector('.lightbox');
  const lbImg     = document.querySelector('.lightbox__img');
  const lbClose   = document.querySelector('.lightbox__close');

  if (lightbox) {
    document.querySelectorAll('.gallery-item[data-src]').forEach(function (item) {
      item.addEventListener('click', function () {
        const src = this.getAttribute('data-src');
        const alt = this.getAttribute('data-alt') || 'The Mercury Bethesda';
        if (lbImg) { lbImg.src = src; lbImg.alt = alt; }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lbImg) lbImg.src = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- Contact form ---------- */
  const form    = document.querySelector('.contact-form');
  const success = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simulate submission
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      setTimeout(function () {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 900);
    });

    // Remove red border on input
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Counter animation ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = target < 10 ? (eased * target).toFixed(1) : Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

})();
