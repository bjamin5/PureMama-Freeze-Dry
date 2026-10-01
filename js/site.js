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
