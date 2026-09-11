/* Yonkers Paint & Hardware — shared site interactions.
   The mobile drawer is server-rendered directly under <body>. This avoids
   department-page stacking contexts and does not depend on cloning/moving nav. */
(function () {
  'use strict';

  var MOBILE_MAX = 820;
  var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    var header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    var desktopNav = document.getElementById('mainNav');
    var mobileNav = document.getElementById('mobileMainNav');
    var toggle = document.getElementById('navToggle');
    var scrim = document.getElementById('navScrim');
    var lastFocus = null;

    function isMobile() { return window.innerWidth <= MOBILE_MAX; }

    function bindDepartmentAccordion(navEl) {
      if (!navEl) return null;
      var subToggle = navEl.querySelector('.sub-toggle');
      var subParent = subToggle ? subToggle.parentElement : null;
      if (!subToggle || !subParent) return null;

      subToggle.addEventListener('click', function () {
        var open = subParent.classList.toggle('is-open');
        subToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      return {
        toggle: subToggle,
        parent: subParent,
        close: function () {
          subParent.classList.remove('is-open');
          subToggle.setAttribute('aria-expanded', 'false');
        }
      };
    }

    var desktopSub = bindDepartmentAccordion(desktopNav);
    var mobileSub = bindDepartmentAccordion(mobileNav);

    function activeNav() { return isMobile() ? mobileNav : desktopNav; }
    function activeSub() { return isMobile() ? mobileSub : desktopSub; }

    function openNav() {
      var nav = activeNav();
      if (!nav || !toggle) return;

      lastFocus = document.activeElement;
      nav.classList.add('open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');

      if (scrim) scrim.hidden = false;

      if (isMobile()) {
        document.body.style.overflow = 'hidden';
        var first = nav.querySelector(FOCUSABLE);
        if (first) first.focus();
      }
    }

    function closeNav(returnFocus) {
      if (desktopNav) desktopNav.classList.remove('open');
      if (mobileNav) mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';

      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
      if (scrim) scrim.hidden = true;
      if (desktopSub) desktopSub.close();
      if (mobileSub) mobileSub.close();
      if (returnFocus && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var nav = activeNav();
        if (!nav) return;
        if (nav.classList.contains('open')) closeNav(true);
        else openNav();
      });
    }

    var mobileClose = document.getElementById('mobileNavClose');
    var desktopClose = document.getElementById('navClose');
    if (mobileClose) mobileClose.addEventListener('click', function () { closeNav(true); });
    if (desktopClose) desktopClose.addEventListener('click', function () { closeNav(true); });
    if (scrim) scrim.addEventListener('click', function () { closeNav(true); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        var sub = activeSub();
        if (sub && sub.parent.classList.contains('is-open')) {
          sub.close();
          sub.toggle.focus();
          return;
        }
        closeNav(true);
        return;
      }

      if (e.key === 'Tab' && isMobile() && mobileNav && mobileNav.classList.contains('open')) {
        var items = Array.prototype.filter.call(
          mobileNav.querySelectorAll(FOCUSABLE),
          function (el) { return el.offsetParent !== null; }
        );
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('click', function (e) {
      if (isMobile()) return;
      if (desktopSub && !desktopSub.parent.contains(e.target)) desktopSub.close();
    });

    window.addEventListener('resize', function () {
      closeNav(false);
    }, { passive: true });

    /* Keep contact submissions on the page. Netlify receives the encoded
       form in the background, so visitors never wait on a third-party form
       page or have to retry a navigation. Native submission remains the
       no-JavaScript fallback. */
    var contactForm = document.querySelector('form[name="contact"]');
    if (contactForm && window.fetch && window.URLSearchParams) {
      contactForm.addEventListener('submit', function (event) {
        if (!contactForm.checkValidity()) return;
        event.preventDefault();

        var button = contactForm.querySelector('button[type="submit"]');
        var status = contactForm.querySelector('.form-status');
        var originalLabel = button ? button.textContent : '';
        var data = new FormData(contactForm);

        if (button) {
          button.disabled = true;
          button.textContent = 'Sending…';
        }
        if (status) {
          status.hidden = false;
          status.className = 'form-status';
          status.textContent = 'Sending your message…';
        }

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        }).then(function (response) {
          if (!response.ok) throw new Error('Submission failed');
          contactForm.reset();
          if (status) {
            status.className = 'form-status is-success';
            status.textContent = 'Message sent. Thank you — we’ll get back to you soon.';
            status.focus();
          }
        }).catch(function () {
          if (status) {
            status.className = 'form-status is-error';
            status.innerHTML = 'We couldn’t send that message. Please call <a href="tel:+19149633525">914-963-3525</a> or email <a href="mailto:service@yonkerspaintandhardware.com">service@yonkerspaintandhardware.com</a>.';
            status.focus();
          }
        }).finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        });
      });
    }
  });
})();
