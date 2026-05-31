/* ─────────────────────────────────────────────────────────────────────────
   Malom Invest — src/main.js
   Reveal-on-scroll + smooth scroll + contact form (Formspree + validation)
   ───────────────────────────────────────────────────────────────────────── */

/* ── 1. Reveal-on-scroll via IntersectionObserver ──────────────────────── */
(function () {
  'use strict';

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // fire once only
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── 2. Smooth scroll for anchor links & custom CTA buttons ────────────── */
(function () {
  'use strict';

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration) {
    var startY = window.scrollY;
    var difference = targetY - startY;
    var startTime = performance.now();

    function step(timestamp) {
      var progress = (timestamp - startTime) / duration;
      if (progress > 1) progress = 1;
      
      var ease = easeInOutCubic(progress);
      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  // Anchor links smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = 80; // matches h-20 = 5rem = 80px
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      smoothScrollTo(top, 1600);
    });
  });

  // "Inquire" button scrolls to contact form
  var inquireBtn = document.getElementById('btn-inquire');
  if (inquireBtn) {
    inquireBtn.addEventListener('click', function () {
      var contactSection = document.getElementById('contact');
      if (!contactSection) return;
      var navHeight = 80;
      var top = contactSection.getBoundingClientRect().top + window.scrollY - navHeight;
      smoothScrollTo(top, 1600);
    });
  }

  // "Explore Estates" button scrolls to portfolios
  var exploreBtn = document.getElementById('btn-explore');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function () {
      var portfoliosSection = document.getElementById('portfolios');
      if (!portfoliosSection) return;
      var navHeight = 80;
      var top = portfoliosSection.getBoundingClientRect().top + window.scrollY - navHeight;
      smoothScrollTo(top, 1600);
    });
  }
})();


/* ── 5. Mobile nav toggle ───────────────────────────────────────────────── */
(function () {
  'use strict';

  var mobileMenuBtn = document.getElementById('btn-mobile-menu');
  var mobileMenu    = document.getElementById('mobile-menu');
  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', function () {
    var expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ── 6. Contact form — validation + Formspree submission ────────────────── */
(function () {
  'use strict';

  /**
   * HOW TO SET UP FORMSPREE:
   * 1. Go to https://formspree.io and create a free account.
   * 2. Create a new form — choose "HTML Form".
   * 3. Copy the form endpoint (e.g., https://formspree.io/f/xyzabcde).
   * 4. Replace the action attribute on the <form id="contact-form"> element
   *    in index.html with your endpoint URL.
   * 5. Formspree will send submissions to the email address you registered with.
   * No backend code is required.
   */

  var form       = document.getElementById('contact-form');
  var thankYou   = document.getElementById('form-thankyou');
  var submitBtn  = document.getElementById('btn-submit');
  var errorMsg   = document.getElementById('form-error');

  if (!form) return;

  // Simple required-field validation
  function validateForm () {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add('border-red-500');
        valid = false;
      } else {
        field.classList.remove('border-red-500');
      }
    });

    // Email format
    var emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.classList.add('border-red-500');
        valid = false;
      }
    }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
      }
      return;
    }

    if (errorMsg) errorMsg.classList.add('hidden');

    // Disable submit button to prevent double submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    var data = new FormData(form);

    fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' },
    })
      .then(function (response) {
        if (response.ok) {
          // Show thank-you state
          form.classList.add('hidden');
          if (thankYou) thankYou.classList.remove('hidden');
        } else {
          return response.json().then(function (data) {
            throw new Error(data.error || 'Submission failed.');
          });
        }
      })
      .catch(function (err) {
        console.error('Form error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Inquiry';
        }
        if (errorMsg) {
          errorMsg.textContent = 'Something went wrong. Please try again or email concierge@malominvest.com directly.';
          errorMsg.classList.remove('hidden');
        }
      });
  });

  // Clear error state on input
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      this.classList.remove('border-red-500');
      if (errorMsg) errorMsg.classList.add('hidden');
    });
  });
})();


/* ── 7. Dynamic footer year ─────────────────────────────────────────────── */
(function () {
  'use strict';
  document.getElementById('footer-year') && (document.getElementById('footer-year').textContent = new Date().getFullYear());
})();
