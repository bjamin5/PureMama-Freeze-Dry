(function () {
  'use strict';

  // Mobile menu
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('nav-open'));
  });
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  // Carousel arrows (swipe/scroll works natively)
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var prev = carousel.querySelector('.prev');
    var next = carousel.querySelector('.next');
    function update() {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }
    carousel.querySelectorAll('.carousel-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = Number(btn.getAttribute('data-dir'));
        track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
      });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Reels drift slowly on their own in an endless loop. Pauses while being
  // hovered, touched or focused; still swipeable; off for reduced-motion users.
  var reels = document.querySelector('.reels-track');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reels && !reduceMotion) {
    var originals = Array.prototype.slice.call(reels.children);
    originals.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      reels.appendChild(clone);
    });
    var firstClone = reels.children[originals.length];
    function loopWidth() { return firstClone.offsetLeft - originals[0].offsetLeft; }
    var speed = 30; // px per second
    var pos = 0, last = null, paused = false, resumeTimer = null;
    function pause() { paused = true; clearTimeout(resumeTimer); }
    function resumeSoon() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () { pos = reels.scrollLeft; paused = false; }, 2500);
    }
    reels.addEventListener('mouseenter', pause);
    reels.addEventListener('mouseleave', resumeSoon);
    reels.addEventListener('touchstart', pause, { passive: true });
    reels.addEventListener('touchend', resumeSoon, { passive: true });
    reels.addEventListener('focusin', pause);
    reels.addEventListener('focusout', resumeSoon);
    reels.parentElement.querySelectorAll('.carousel-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { pause(); resumeSoon(); });
    });
    (function tick(now) {
      if (last !== null && !paused) {
        pos += speed * (now - last) / 1000;
        if (pos >= loopWidth()) pos -= loopWidth();
        reels.scrollLeft = pos;
      } else if (paused && reels.scrollLeft >= loopWidth()) {
        // swiped into the cloned half: jump back to the matching original
        reels.scrollLeft -= loopWidth();
      }
      last = now;
      requestAnimationFrame(tick);
    })(performance.now());
  }

  // Sticky "Message Sophia" button appears after scrolling past the hero,
  // hidden again once the contact section is on screen
  var sticky = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');
  var contact = document.querySelector('#contact');
  var pastHero = false, atContact = false;
  function render() { sticky.classList.toggle('show', pastHero && !atContact); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting; render();
    }).observe(hero);
    new IntersectionObserver(function (entries) {
      atContact = entries[0].isIntersecting; render();
    }).observe(contact);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
