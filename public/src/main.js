/* ─────────────────────────────────────────────────────────────────────────
   Malom Invest — src/main.js
   Reveal-on-scroll + smooth scroll + contact form (Formspree + validation)
   ───────────────────────────────────────────────────────────────────────── */

/* ── 1. Reveal-on-scroll via IntersectionObserver (reveal once) ─────────── */
(function(){'use strict';var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)||!els.length){els.forEach(function(e){e.classList.add('is-visible');});return;}var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('is-visible');io.unobserve(x.target);}});},{threshold:0.12,rootMargin:'0px 0px -10% 0px'});els.forEach(function(e){io.observe(e);});})();


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

  // NOTE: the form is currently a DESIGN ELEMENT only — no backend is wired.
  // Submission is handled entirely client-side: validate, then show the
  // thank-you state and reset. No network request is made.
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
      }
      return;
    }

    if (errorMsg) errorMsg.classList.add('hidden');

    // Show thank-you state and reset the form (no request sent)
    form.reset();
    form.classList.add('hidden');
    if (thankYou) thankYou.classList.remove('hidden');
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
