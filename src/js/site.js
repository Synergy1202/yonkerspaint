/* Yonkers Paint & Hardware — one script for the whole site.
   No libraries. Everything here is an enhancement: with JavaScript disabled
   the <noscript> block in layout.njk renders the nav as a plain stacked
   list, and every link on the site stays reachable. */
(function () {
  'use strict';

  var MOBILE_MAX = 820;
  var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  document.addEventListener('DOMContentLoaded', function () {

    /* Copyright year. Server-rendered already; this keeps it correct on a
       cached page served across a New Year boundary. */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* Sticky-header shadow, and collapsing the utility strip on scroll. */
    var header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    var nav = document.getElementById('mainNav');
    var toggle = document.getElementById('navToggle');
    var closeBtn = document.getElementById('navClose');
    var scrim = document.getElementById('navScrim');
    var subToggle = nav ? nav.querySelector('.sub-toggle') : null;
    var subParent = subToggle ? subToggle.parentElement : null;
    var lastFocus = null;

    function isMobile() { return window.innerWidth <= MOBILE_MAX; }

    /* ---- Departments panel ------------------------------------------
       Hover and :focus-within are handled in CSS. This adds the tap path
       and keyboard activation, via a class so nothing leaks across the
       breakpoint. */
    function closeSub() {
      if (!subParent) return;
      subParent.classList.remove('is-open');
      subToggle.setAttribute('aria-expanded', 'false');
    }

    if (subToggle && subParent) {
      subToggle.addEventListener('click', function () {
        var open = subParent.classList.toggle('is-open');
        subToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* ---- Drawer ------------------------------------------------------ */
    function openNav() {
      lastFocus = document.activeElement;
      nav.classList.add('open');
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
      if (!nav || !nav.classList.contains('open')) return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (scrim) scrim.hidden = true;
      document.body.style.overflow = '';
      closeSub();
      if (returnFocus && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (nav && toggle) {
      toggle.addEventListener('click', function () {
        if (nav.classList.contains('open')) closeNav(true);
        else openNav();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', function () { closeNav(true); });
    if (scrim) scrim.addEventListener('click', function () { closeNav(true); });

    /* ---- Focus trap while the drawer is open ------------------------- */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      if (!nav || !nav.classList.contains('open') || !isMobile()) return;
      var items = Array.prototype.filter.call(
        nav.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    /* ---- Escape closes, focus returns -------------------------------- */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;
      if (subParent && subParent.classList.contains('is-open')) {
        closeSub();
        subToggle.focus();
        return;
      }
      closeNav(true);
    });

    /* ---- Clicking outside the departments panel closes it ------------ */
    document.addEventListener('click', function (e) {
      if (subParent && !subParent.contains(e.target) && !isMobile()) closeSub();
    });

    /* ---- Resize past the breakpoint clears the open state ------------ */
    var wasMobile = isMobile();
    window.addEventListener('resize', function () {
      var nowMobile = isMobile();
      if (nowMobile !== wasMobile) {
        closeNav(false);
        closeSub();
        document.body.style.overflow = '';
        wasMobile = nowMobile;
      }
    }, { passive: true });
  });
})();
