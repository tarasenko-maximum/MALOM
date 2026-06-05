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


/* ── 2. Custom CTA buttons (native scroll handles anchor links) ─────────── */
(function () {
  'use strict';
  function goTo(id){ var el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
  var i=document.getElementById('btn-inquire'); if(i) i.addEventListener('click',function(){goTo('contact');});
  var e=document.getElementById('btn-explore'); if(e) e.addEventListener('click',function(){goTo('portfolios');});
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
