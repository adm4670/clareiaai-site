/* ========================================
   CLAREIA.AI - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // --- Navbar scroll effect ---
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // --- Mobile menu toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Intersection Observer for fade-in animations ---
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Waitlist form handler ---
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('.cta-input');
      const email = emailInput.value.trim();
      const btn = this.querySelector('.btn');
      const originalText = btn.textContent;

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        showFormFeedback('Por favor, insira seu email.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showFormFeedback('Por favor, insira um email válido.', 'error');
        return;
      }

      // Simulate submission
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(() => {
        btn.textContent = 'Lista de Espera';
        btn.disabled = false;
        emailInput.value = '';
        showFormFeedback('Você foi adicionado à lista de espera! 🎉', 'success');
      }, 1500);
    });
  }

  function showFormFeedback(message, type) {
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('p');
    feedback.className = 'form-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 12px;
      font-size: 0.9rem;
      padding: 8px 16px;
      border-radius: 8px;
      ${type === 'success' 
        ? 'color: #16a34a; background: rgba(22, 163, 74, 0.1);' 
        : 'color: #dc2626; background: rgba(220, 38, 38, 0.08);'
      }
    `;

    const form = document.getElementById('waitlist-form');
    form.parentNode.insertBefore(feedback, form.nextSibling);

    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 4000);
  }

  // --- Parallax effect on hero shapes (optional enhancement) ---
  window.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero-visual');
    if (!hero || window.innerWidth < 768) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    
    hero.style.transform = `translate(${x}px, ${y}px)`;
  });

  // --- Counter animation for stats (if added later) ---
  // Placeholder for future enhancements

  console.log('Clareia.ai - Landing Page initialized.');
});
