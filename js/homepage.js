document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  var heroSlides = document.querySelectorAll('.hero-slide');
  var currentSlide = 0;
  var slideshowInterval;

  // Sticky nav scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // Hero slideshow
  function showSlide(index) {
    heroSlides.forEach(function (slide) {
      slide.classList.remove('active');
    });
    if (heroSlides[index]) {
      heroSlides[index].classList.add('active');
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
  }

  function startSlideshow() {
    if (heroSlides.length > 1) {
      slideshowInterval = setInterval(nextSlide, 5000);
    }
  }

  function stopSlideshow() {
    clearInterval(slideshowInterval);
  }

  if (heroSlides.length > 0) {
    showSlide(0);
    startSlideshow();

    var heroSection = heroSlides[0].parentElement;
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopSlideshow);
      heroSection.addEventListener('mouseleave', startSlideshow);
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
