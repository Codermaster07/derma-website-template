/* ============================================================
   AURELIA DERMATOLOGY & SKIN CLINIC — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // —— Header Scroll Behavior ——
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // —— Mobile Menu ——
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // —— Scroll Animations (Intersection Observer) ——
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-in, .stagger-children, .img-reveal').forEach(el => {
    animObserver.observe(el);
  });

  // —— Animated Counters ——
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * easeOut);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // —— FAQ Accordion ——
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all siblings
      item.parentElement.querySelectorAll('.faq-item.active').forEach(activeItem => {
        activeItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // —— Testimonial Carousel ——
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    const track = carousel.querySelector('.testimonials-track');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentSlide = 0;
    let slidesPerView = 3;

    function getSlidesPerView() {
      if (window.innerWidth <= 767) return 1;
      if (window.innerWidth <= 991) return 2;
      return 3;
    }

    function updateCarousel() {
      slidesPerView = getSlidesPerView();
      const maxSlide = Math.max(0, cards.length - slidesPerView);
      if (currentSlide > maxSlide) currentSlide = maxSlide;

      const card = cards[0];
      if (!card) return;
      const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight);
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

      // Update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }
    }

    function createDots() {
      if (!dotsContainer) return;
      slidesPerView = getSlidesPerView();
      const totalDots = Math.max(1, cards.length - slidesPerView + 1);
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentSlide = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxSlide = Math.max(0, cards.length - slidesPerView);
        if (currentSlide < maxSlide) {
          currentSlide++;
          updateCarousel();
        }
      });
    }

    createDots();
    updateCarousel();

    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });
  }

  // —— Before & After Filters ——
  document.querySelectorAll('.ba-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.ba-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.ba-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // —— Gallery Filters ——
  document.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // —— Pricing Tabs ——
  document.querySelectorAll('.pricing-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.pricing-group').forEach(group => {
        if (category === 'all' || group.getAttribute('data-category') === category) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // —— Lightbox ——
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // —— Booking Form ——
  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const requiredFields = bookingForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--color-error)';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (isValid) {
        // Show success
        bookingForm.style.display = 'none';
        const successMsg = document.querySelector('.form-success');
        if (successMsg) successMsg.classList.add('show');
      }
    });
  }

  // —— Newsletter Form ——
  document.querySelectorAll('.footer__newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        const btn = form.querySelector('button');
        btn.textContent = 'Subscribed!';
        btn.style.background = 'var(--color-success)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  // —— Active Nav Link ——
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // —— Smooth scroll for anchor links ——
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // —— Lazy Loading Images ——
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
});
