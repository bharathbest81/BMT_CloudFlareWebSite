/* ============================================================
   Brainwave Matrix Technologies — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Year ────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Matrix Rain Canvas ──────────────────────────────────────
  (function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, drops;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/\\|~';

    function init() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const cols = Math.floor(W / 18);
      drops = Array(cols).fill(1);
    }

    function draw() {
      ctx.fillStyle = 'rgba(6,15,36,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00ff88';
      ctx.font = '13px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }

    init();
    setInterval(draw, 50);
    window.addEventListener('resize', init);
  })();

  // ── Navbar Scroll Behaviour ──────────────────────────────────
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    if (backTop) {
      if (window.scrollY > 400) {
        backTop.classList.remove('opacity-0', 'translate-y-4');
      } else {
        backTop.classList.add('opacity-0', 'translate-y-4');
      }
    }
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileToggle.querySelector('i').className = isOpen ? 'fas fa-bars text-lg' : 'fas fa-times text-lg';
    });
  }

  window.closeMobileMenu = function () {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.add('hidden');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.querySelector('i').className = 'fas fa-bars text-lg';
  };

  // ── Reveal on Scroll ─────────────────────────────────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Progress Bars ─────────────────────────────────────────────
  const progObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        progObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-fill').forEach(el => progObs.observe(el));

  // ── Counter Animation ─────────────────────────────────────────
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let start    = 0;
        const step   = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / 1500, 1);
          el.textContent = Math.floor(progress * target) + (progress === 1 ? suffix : '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cntObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  // ── Typewriter ────────────────────────────────────────────────
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const phrases = [
      'Running build...',
      'Launching app... done!',
      'SEO score: 98/100',
      'Deploy complete!',
      'Kids are learning!'
    ];
    let pi = 0, ci = 0, del = false;
    function type() {
      const phrase = phrases[pi];
      if (!del) {
        typeEl.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { del = true; setTimeout(type, 2000); return; }
      } else {
        typeEl.textContent = phrase.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 40 : 80);
    }
    type();
  }

  // ── Toast ─────────────────────────────────────────────────────
  window.showToast = function (success) {
    const toast = document.getElementById('toast');
    const icon  = document.getElementById('toast-icon');
    const title = document.getElementById('toast-title');
    const sub   = document.getElementById('toast-sub');
    if (!toast) return;

    if (success) {
      icon.className  = 'w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0';
      icon.innerHTML  = '<i class="fas fa-check text-white text-sm"></i>';
      title.textContent = 'Message Sent!';
      sub.textContent   = 'We will get back to you within 24 hours.';
    } else {
      icon.className  = 'w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0';
      icon.innerHTML  = '<i class="fas fa-times text-white text-sm"></i>';
      title.textContent = 'Send Failed';
      sub.textContent   = 'Please email us at Brainwavematrixtech@gmail.com';
    }
    toast.classList.add('show');
    setTimeout(window.hideToast, 6000);
  };

  window.hideToast = function () {
    const toast = document.getElementById('toast');
    if (toast) toast.classList.remove('show');
  };

  // ── Contact Form ──────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Validate required fields
      let valid = true;
      [['form-name', name], ['form-email', email], ['form-message', message]].forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!val) {
          valid = false;
          el.style.borderColor = 'rgba(239,68,68,0.6)';
          el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
          setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 3000);
        }
      });
      if (!valid) return;

      const btn = document.getElementById('form-submit');
      const txt = document.getElementById('btn-text');
      btn.disabled = true;
      txt.textContent = 'Sending...';
      btn.querySelector('i').className = 'fas fa-spinner fa-spin';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(this) });
        const json = await res.json();
        if (json.success) { this.reset(); window.showToast(true); }
        else { console.error('Web3Forms error:', json); window.showToast(false); }
      } catch (err) {
        console.error('Network error:', err);
        window.showToast(false);
      } finally {
        btn.disabled = false;
        txt.textContent = 'Send Message';
        btn.querySelector('i').className = 'fas fa-paper-plane';
      }
    });
  }

  // ── Active Nav Highlight ──────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const active = document.querySelector('.nav-link[href="#' + e.target.id + '"]');
        if (active) active.style.color = '#00ff88';
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => sectionObs.observe(s));

  // ── Play Store Icon Fallback ──────────────────────────────────
  (function loadPlayStoreIcons() {
    const icons = [
      { id: 'icon-spellbuddy',       pkg: 'com.bmt.spellbuddy' },
      { id: 'icon-numberninjas',     pkg: 'com.bmt.numberninjas' },
      { id: 'icon-arithmetic',       pkg: 'com.bmt.arithmetic' },
      { id: 'icon-arithmeticpuzzle', pkg: 'com.bmt.arithmeticpuzzle' }
    ];
    icons.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      // onerror on the <img> tag handles emoji fallback
    });
  })();

})();
