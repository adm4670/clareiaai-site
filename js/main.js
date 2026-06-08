/* =============================================
   CLAREIA.AI - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ===== MOBILE MENU =====
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== WAITLIST FORM =====
  const waitlistForm = document.getElementById('waitlist-form');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = waitlistForm.querySelector('input[type="email"]');
      const nameInput = waitlistForm.querySelector('input[type="text"]');
      const email = emailInput.value.trim();
      const name = nameInput ? nameInput.value.trim() : '';
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Simple validation
      if (!email || !email.includes('@')) {
        showFormFeedback('Por favor, insira um e-mail válido.', 'error');
        emailInput.focus();
        return;
      }

      // Disable form
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Success!
        showFormFeedback('🎉 Você está na lista! Assim que tivermos novidades, avisaremos.', 'success');
        waitlistForm.reset();

        // Track conversion (optional)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {
            'send_to': 'AW-XXXXX/waitlist_signup'
          });
        }

      } catch (error) {
        showFormFeedback('Ops! Algo deu errado. Tente novamente.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function showFormFeedback(message, type) {
    // Remove existing feedback
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 16px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: fadeInUp 0.3s ease;
    `;

    if (type === 'success') {
      feedback.style.background = 'rgba(0,181,216,0.08)';
      feedback.style.color = '#0099b8';
      feedback.style.border = '1px solid rgba(0,181,216,0.2)';
    } else {
      feedback.style.background = 'rgba(239,0,112,0.08)';
      feedback.style.color = '#c5005c';
      feedback.style.border = '1px solid rgba(239,0,112,0.2)';
    }

    waitlistForm.appendChild(feedback);

    // Auto remove after 5 seconds
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 5000);
  }

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const targetText = counter.textContent;
      const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''));
      if (isNaN(targetNum)) return;

      const suffix = targetText.replace(/[0-9]/g, '');
      let current = 0;
      const increment = Math.ceil(targetNum / 60);
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          current = targetNum;
          clearInterval(timer);
        }
        counter.textContent = current + suffix;
      }, 25);
    });
  }

  // Trigger counters when visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // ===== PARALLAX EFFECT ON HERO =====
  window.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    hero.style.transform = `translate(${x}px, ${y}px)`;
  });

  // ===== NAV ACTIVE LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.btn-nav)');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(anchor => {
      anchor.style.color = '';
      if (anchor.getAttribute('href') === `#${current}`) {
        anchor.style.color = 'var(--primary)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  console.log('🚀 Clareia.ai - Landing Page carregada com sucesso!');
});
