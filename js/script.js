/**
 * WEB CREATE — MODERN PORTFOLIO JAVASCRIPT
 * Vanilla JS: Theme switcher, Smooth Scrolling, Scroll Animations,
 * Interactive Counters, Mobile Navigation, Project Modal, Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME TOGGLE (Dark Mode Default + Light Mode Support)
     ========================================================================== */
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const THEME_KEY = 'webcreate_theme_preference';

// 1. تحديد الثيم الأول: التفضيل المحفوظ > تفضيل النظام > 'light'
const getPreferredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
  } catch (e) {
    // في حال حظر localStorage
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// 2. تطبيق الثيم وتحديث الخصائص
const applyTheme = (theme) => {
  htmlElement.setAttribute('data-theme', theme);
  
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}

  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
};

// تطبيق الثيم المبدئي فوراً
applyTheme(getPreferredTheme());

// 3. الاستماع للنقر على الزر
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);

    // فحص وجود showToast قبل استدعائها لمنع توقف السكريبت
    if (typeof showToast === 'function') {
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    }
  });
}

// 4. الاستماع لتغيرات نظام التشغيل مع دعم المتصفحات القديمة
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = (e) => {
    let hasStored = false;
    try {
      hasStored = !!localStorage.getItem(THEME_KEY);
    } catch (err) {}

    if (!hasStored) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemChange);
  }
}
  /* ==========================================================================
     2. STICKY HEADER & SCROLL BEHAVIOR
     ========================================================================== */
  const siteHeader = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = (forceClose = false) => {
    const isActive = forceClose ? false : !navMenu.classList.contains('is-active');
    
    navMenu.classList.toggle('is-active', isActive);
    mobileToggle.classList.toggle('is-active', isActive);
    mobileBackdrop.classList.toggle('is-active', isActive);
    mobileToggle.setAttribute('aria-expanded', String(isActive));
    
    // Prevent body scroll when drawer is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(true));
  }

  // Close mobile nav when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMobileMenu(true);
      }
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
      toggleMobileMenu(true);
    }
  });


  /* ==========================================================================
     4. ACTIVE NAVIGATION LINK ON SCROLL (SPY)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight - 50;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }


  /* ==========================================================================
     6. ACHIEVEMENT NUMBERS COUNTER ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const startTime = performance.now();
      const startValue = target > 1000 ? target - 50 : 0; // Quick ramp for year 2017

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic function
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuad);

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsSection);
  }


  /* ==========================================================================
     7. PROJECT DETAILS MODAL
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const projectViewBtns = document.querySelectorAll('.project-view-btn');

  const openProjectModal = (btn) => {
    if (!projectModal) return;

    const title = btn.getAttribute('data-project') || 'Project Showcase';
    const category = btn.getAttribute('data-category') || 'Web Design';
    const desc = btn.getAttribute('data-desc') || 'Custom project crafted for client objectives.';
    const tech = btn.getAttribute('data-tech') || 'Custom Development';

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDesc.textContent = desc;
    modalTech.textContent = tech;

    if (typeof projectModal.showModal === 'function') {
      projectModal.showModal();
    } else {
      projectModal.setAttribute('open', '');
    }
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    if (typeof projectModal.close === 'function') {
      projectModal.close();
    } else {
      projectModal.removeAttribute('open');
    }
  };

  projectViewBtns.forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn));
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);

  // Close modal when clicking backdrop
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      const dialogDimensions = projectModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeProjectModal();
      }
    });

    // Close modal and smooth scroll if inquiry CTA clicked
    const modalContactBtn = projectModal.querySelector('.modal-contact-btn');
    if (modalContactBtn) {
      modalContactBtn.addEventListener('click', () => {
        closeProjectModal();
      });
    }
  }


  /* ==========================================================================
     8. CONTACT FORM — EMAILJS FREE INTEGRATION
     ========================================================================== */
  
  // ─── EMAILJS CONFIGURATION ────────────────────────────────────────────────
  // Replace these placeholders with your actual credentials from EmailJS Dashboard:
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: '-pcIPj3n2NvYhf74Z',       // e.g., 'user_xxxxxxxxxxxxxx'
    SERVICE_ID: 'service_xkt521j',       // e.g., 'service_xxxxxxx'
    TEMPLATE_ID: 'template_2egvanu',     // e.g., 'template_xxxxxxx'
    RECIPIENT_EMAIL: 'web.create.46@gmail.com'   // Official recipient email
  };

  // Initialize EmailJS with Public Key if configured
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    } catch (err) {
      console.warn('EmailJS initialization warning:', err);
    }
  }

  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const formErrorFeedback = document.getElementById('form-error-feedback');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const retryFormBtn = document.getElementById('retry-form-btn');
  const submitBtn = document.getElementById('submit-btn');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateField = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.classList.add('is-visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.classList.remove('is-visible');
      return true;
    }
  };

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const typeSelect = document.getElementById('project-type');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const typeError = document.getElementById('type-error');
    const messageError = document.getElementById('message-error');

    // Real-time validation listeners
    nameInput?.addEventListener('input', () => validateField(nameInput, nameError, nameInput.value.trim().length > 1));
    emailInput?.addEventListener('input', () => validateField(emailInput, emailError, validateEmail(emailInput.value.trim())));
    typeSelect?.addEventListener('change', () => validateField(typeSelect, typeError, typeSelect.value !== ''));
    messageInput?.addEventListener('input', () => validateField(messageInput, messageError, messageInput.value.trim().length > 3));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Validate all fields
      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 1);
      const isEmailValid = validateField(emailInput, emailError, validateEmail(emailInput.value.trim()));
      const isTypeValid = validateField(typeSelect, typeError, typeSelect.value !== '');
      const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length > 3);

      if (!isNameValid || !isEmailValid || !isTypeValid || !isMessageValid) {
        showToast('Please check the required fields in the form.');
        return;
      }

      // 2. Set loading state & prevent multiple submissions
      submitBtn.disabled = true;
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.querySelector('.btn-text').textContent = 'Sending Message...';

      // 3. Prepare parameters for EmailJS Template
      const templateParams = {
        from_name: nameInput.value.trim(),
        reply_to: emailInput.value.trim(),
        project_type: typeSelect.value,
        message: messageInput.value.trim(),
        to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL
      };

      // 4. Send via EmailJS (or handle placeholder for testing)
      if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.PUBLIC_KEY)
          .then((response) => {
            console.log('EmailJS Success:', response.status, response.text);
            
            // Show Success Message
            contactForm.classList.add('hidden');
            formErrorFeedback?.classList.add('hidden');
            formFeedback?.classList.remove('hidden');
            contactForm.reset();
            showToast('Thank you! Your message has been sent successfully.');
          })
          .catch((error) => {
            console.error('EmailJS Failed:', error);
            
            // Show Error Message (Never show success on failure)
            contactForm.classList.add('hidden');
            formFeedback?.classList.add('hidden');
            formErrorFeedback?.classList.remove('hidden');
            showToast('Unable to send message. Please try again.');
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
          });
      } else {
        // Development / Placeholder fallback: simulate realistic sending process
        setTimeout(() => {
          contactForm.classList.add('hidden');
          formErrorFeedback?.classList.add('hidden');
          formFeedback?.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully.');
        }, 800);
      }
    });

    // Reset button: clears form and shows input screen again
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        formFeedback?.classList.add('hidden');
        formErrorFeedback?.classList.add('hidden');
        contactForm.classList.remove('hidden');
        nameInput.focus();
      });
    }

    // Retry button: preserves user typed values so they can re-submit
    if (retryFormBtn) {
      retryFormBtn.addEventListener('click', () => {
        formFeedback?.classList.add('hidden');
        formErrorFeedback?.classList.add('hidden');
        contactForm.classList.remove('hidden');
      });
    }
  }


  /* ==========================================================================
     9. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
});
