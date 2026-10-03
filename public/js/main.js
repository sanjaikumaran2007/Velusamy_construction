/**
 * Velusamy Construction — front-end interactions
 * Plain JS, no build step. Progressive: everything degrades safely
 * if a feature (IntersectionObserver, fetch) isn't supported.
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll-triggered fade-up reveal
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IO support, or user prefers reduced motion: show everything immediately.
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     Animated stat counters (hero)
     data-target accepts values like "120+", "15+", "100%", "38"
  --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    var raw = el.getAttribute('data-target') || '';
    var numMatch = raw.match(/[\d.]+/);
    var num = numMatch ? parseFloat(numMatch[0]) : 0;
    var suffix = raw.replace(/^[\d.]+/, ''); // "+", "%", or ""
    var duration = 1400;
    var start = null;

    if (prefersReducedMotion || !num) {
      el.textContent = raw;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * num);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = raw;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------------------------------------------------
     Video showcase play/pause toggle
  --------------------------------------------------------- */
  document.querySelectorAll('[data-video-player]').forEach(function (wrapper) {
    var video = wrapper.querySelector('video');
    var toggle = wrapper.querySelector('[data-video-toggle]');
    if (!video || !toggle) return;

    toggle.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        wrapper.classList.add('is-playing');
      } else {
        video.pause();
        wrapper.classList.remove('is-playing');
      }
    });

    video.addEventListener('click', function () {
      if (!video.paused) {
        video.pause();
        wrapper.classList.remove('is-playing');
      }
    });

    video.addEventListener('ended', function () {
      wrapper.classList.remove('is-playing');
    });
  });

  /* ---------------------------------------------------------
     Portfolio lightbox
  --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lastFocused = null;

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('[data-lightbox-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('[data-lightbox-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openLightbox(trigger.getAttribute('data-full'), trigger.getAttribute('data-caption'));
    });
  });

  document.querySelectorAll('[data-lightbox-close]').forEach(function (btn) {
    btn.addEventListener('click', closeLightbox);
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------------------------------------------------------
     Contact form — posts to /api/contact (Express route)
  --------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.form__submit');
      var payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim()
      };

      if (submitBtn) submitBtn.setAttribute('disabled', 'true');
      if (statusEl) { statusEl.textContent = 'Sending...'; statusEl.removeAttribute('data-state'); }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok && result.data.ok) {
            if (statusEl) { statusEl.textContent = result.data.message || 'Thanks — we will be in touch.'; statusEl.setAttribute('data-state', 'ok'); }
            form.reset();
          } else {
            if (statusEl) { statusEl.textContent = (result.data && result.data.error) || 'Something went wrong. Please call us instead.'; statusEl.setAttribute('data-state', 'error'); }
          }
        })
        .catch(function () {
          if (statusEl) { statusEl.textContent = 'Network error — please call or email us directly.'; statusEl.setAttribute('data-state', 'error'); }
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute('disabled');
        });
    });
  }

  /* ---------------------------------------------------------
     Fallback: keep footer year correct even if the page is
     ever served from a cache with a stale server-rendered value.
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
