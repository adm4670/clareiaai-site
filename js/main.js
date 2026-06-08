/* =============================================
   CLAREIA.AI V2 - Origami Edition
   Interactive Canvas Background + 3D Effects
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =======================================
  // 1. INTERACTIVE ORIGAMI CANVAS
  // =======================================
  const canvas = document.getElementById('origami-canvas');
  const ctx = canvas.getContext('2d');
  let mouseX = 0, mouseY = 0;
  let origamiPieces = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Origami piece class
  class OrigamiPiece {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 8 + Math.random() * 25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.008;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.02 + Math.random() * 0.06;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.005 + Math.random() * 0.01;

      // Color from palette
      const colors = [
        { r: 239, g: 0, b: 112 },   // Rosa
        { r: 0, g: 72, b: 145 },    // Azul
        { r: 0, g: 181, b: 216 },   // Ciano
      ];
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.color = c;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;

      // Mouse interaction - gentle push
      const dx = (mouseX * canvas.width * 0.5) - this.x;
      const dy = (mouseY * canvas.height * 0.5) - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const force = (300 - dist) / 300 * 0.04;
        this.x += dx * force;
        this.y += dy * force;
        this.rotation += Math.sin(this.pulse) * 0.002;
      }

      // Wrap around with margin
      const margin = 100;
      if (this.x < -margin) this.x = canvas.width + margin;
      if (this.x > canvas.width + margin) this.x = -margin;
      if (this.y < -margin) this.y = canvas.height + margin;
      if (this.y > canvas.height + margin) this.y = -margin;
    }

    draw(ctx) {
      const s = this.size * (0.8 + 0.2 * Math.sin(this.pulse));
      const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = alpha;

      // Draw origami diamond shape
      const half = s / 2;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s, 0);
      ctx.closePath();

      // Fill with gradient
      const grad = ctx.createLinearGradient(-s, -s, s, s);
      grad.addColorStop(0, `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`);
      grad.addColorStop(0.5, `rgba(${this.color.r},${this.color.g},${this.color.b},0.4)`);
      grad.addColorStop(1, `rgba(${this.color.r},${this.color.g},${this.color.b},0.1)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw fold lines
      ctx.strokeStyle = `rgba(255,255,255,0.15)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.moveTo(-s, 0);
      ctx.lineTo(s, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Create pieces proportional to screen size
  const pieceCount = Math.min(40, Math.floor(canvas.width * canvas.height / 30000));

  for (let i = 0; i < pieceCount; i++) {
    origamiPieces.push(new OrigamiPiece());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    origamiPieces.forEach(piece => {
      piece.update();
      piece.draw(ctx);
    });

    // Connected lines between nearby pieces
    ctx.strokeStyle = 'rgba(239, 0, 112, 0.015)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < origamiPieces.length; i++) {
      for (let j = i + 1; j < origamiPieces.length; j++) {
        const dx = origamiPieces[i].x - origamiPieces[j].x;
        const dy = origamiPieces[i].y - origamiPieces[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.globalAlpha = (180 - dist) / 180 * 0.015;
          ctx.beginPath();
          ctx.moveTo(origamiPieces[i].x, origamiPieces[i].y);
          ctx.lineTo(origamiPieces[j].x, origamiPieces[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  // =======================================
  // 2. HEADER SCROLL EFFECT
  // =======================================
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // =======================================
  // 3. MOBILE MENU
  // =======================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // =======================================
  // 4. SCROLL REVEAL
  // =======================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // =======================================
  // 5. SMOOTH SCROLL
  // =======================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =======================================
  // 6. 3D TILT ON HERO VISUAL
  // =======================================
  const heroVisual = document.querySelector('.hero-visual-inner');
  if (heroVisual) {
    document.querySelector('.hero-visual').addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `
        perspective(800px)
        rotateY(${x * 10}deg)
        rotateX(${-y * 10}deg)
        translateZ(10px)
      `;
    });

    document.querySelector('.hero-visual').addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  }

  // =======================================
  // 7. 3D TILT ON CARDS
  // =======================================
  document.querySelectorAll('.feature-card, .value-card, .problem-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 4}deg)
        rotateX(${-y * 4}deg)
        translateY(-6px)
      `;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // =======================================
  // 8. WAITLIST FORM
  // =======================================
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = waitlistForm.querySelector('input[type="email"]');
      const nameInput = waitlistForm.querySelector('input[type="text"]');
      const email = emailInput.value.trim();
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      if (!email || !email.includes('@')) {
        showFeedback('Por favor, insira um e-mail válido.', 'error');
        emailInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        showFeedback('🎉 Você está na lista! Assim que tivermos novidades, avisaremos.', 'success');
        waitlistForm.reset();
      } catch (error) {
        showFeedback('Ops! Algo deu errado. Tente novamente.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function showFeedback(message, type) {
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 16px;
      padding: 14px 22px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: fadeSlideUp 0.3s ease;
    `;

    if (type === 'success') {
      feedback.style.background = 'rgba(0,181,216,0.06)';
      feedback.style.color = '#0099b8';
      feedback.style.border = '1px solid rgba(0,181,216,0.15)';
    } else {
      feedback.style.background = 'rgba(239,0,112,0.06)';
      feedback.style.color = '#c5005c';
      feedback.style.border = '1px solid rgba(239,0,112,0.15)';
    }

    waitlistForm.appendChild(feedback);
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 5000);
  }

  // =======================================
  // 9. COUNTER ANIMATION
  // =======================================
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

  // =======================================
  // 10. NAV ACTIVE LINK ON SCROLL
  // =======================================
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

  console.log('🦢 Clareia.ai V2 - Origami Edition loaded');
});
