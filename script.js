// Portfolio Premium - Enhanced JavaScript with 3D Effects
(function () {
  'use strict';

  // --- 1. Theme Management ---
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);

      // Update Vanta background color if instance exists
      if (window.vantaEffect) {
        setVantaColors(next);
      }
    });
  }

  // --- 2. 3D Background (Vanta.js) ---
  function setVantaColors(theme) {
    if (!window.vantaEffect) return;
    if (theme === 'light') {
      window.vantaEffect.setOptions({
        color: 0x0891b2,
        backgroundColor: 0xf8fafc,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00
      });
    } else {
      window.vantaEffect.setOptions({
        color: 0x06b6d4, // Cyan neon
        backgroundColor: 0x0a0e27, // Dark blue deep
        points: 10.00,
        maxDistance: 20.00,
        spacing: 16.00
      });
    }
  }

  function initVanta() {
    if (window.VANTA) {
      try {
        window.vantaEffect = window.VANTA.NET({
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x06b6d4,
          backgroundColor: 0x0a0e27
        });

        // Set initial colors based on current theme
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        setVantaColors(currentTheme);

      } catch (e) {
        console.warn("Vanta.js init failed:", e);
      }
    }
  }

  // --- 3. 3D Tilt Effect (Vanilla JS) ---
  function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.tilt-element, .project-featured, .skill-card, .contact-card');

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation center (middle of element)
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;

        // Max rotation degrees
        const xRot = yPct * -5; // Reverse Y for intuitive tilt
        const yRot = xPct * 5;

        el.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --- 4. Image Modal ---
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.querySelector('.modal-caption');
  const closeBtn = document.querySelector('.modal-close');

  if (modal) {
    document.querySelectorAll('.gallery-img[data-zoom]').forEach(img => {
      img.addEventListener('click', function () {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        const caption = this.closest('.gallery-item')?.querySelector('.gallery-caption');
        if (caption) modalCaption.textContent = caption.textContent;
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); });
  }

  // --- 5. Scroll & Animations ---
  // Smooth scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // Intersection Observer for Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Init animations elements
  ['.section', '.skill-card', '.project-featured'].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      // Set initial state via JS to avoid checking CSS
      if (!el.classList.contains('hero')) { // Don't hide hero initially to prevent flash
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
      }
    });
  });

  // Header scroll shadow
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      else header.style.boxShadow = 'none';
    });
  }

  // --- 6. Typewriter Effect for Terminal ---
  function initTypewriter() {
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length > 0) {
      codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.animation = 'typing 0.5s steps(40, end)';
          // Ensure clip-path is reset after animation
          line.addEventListener('animationend', () => {
            line.style.clipPath = 'none';
          });
        }, index * 300 + 500); // Initial delay + stagger
      });

      // Inject styles dynamically if not present
      if (!document.getElementById('typewriter-styles')) {
        const style = document.createElement('style');
        style.id = 'typewriter-styles';
        style.innerHTML = `
          @keyframes typing {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          .code-line {
            position: relative;
            clip-path: inset(0 100% 0 0); /* Hidden initially */
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  // --- Init ---
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    initVanta();
    initTiltEffect();
    initTypewriter(); // Start typing
    console.log('✨ Portfolio 3D Enhanced loaded');
  });

})();
