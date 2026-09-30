/* Collins Literary | shared vanilla interactions */
(function () {
  'use strict';

  var whatsappNumber = '2349155233789';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var consentKey = 'collinsCookieConsent';

  function getStoredConsent() {
    try {
      return localStorage.getItem(consentKey) || '';
    } catch (error) {
      return '';
    }
  }

  function setStoredConsent(value) {
    try {
      localStorage.setItem(consentKey, value);
    } catch (error) {
      // No storage available in some privacy modes.
    }
    document.body.dataset.cookieConsent = value;
  }

  function initCookieBanner() {
    var currentConsent = getStoredConsent();
    if (currentConsent) {
      document.body.dataset.cookieConsent = currentConsent;
      return;
    }

    if (document.getElementById('cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = [
      '<div class="cookie-content">',
      '<h2>Cookie preferences</h2>',
      '<p>We use strictly necessary cookies to keep this website secure and working. You can accept all cookies or reject non-essential cookies.</p>',
      '</div>',
      '<div class="cookie-actions">',
      '<button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-choice="essential">Essential only</button>',
      '<button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-choice="reject">Reject non-essential</button>',
      '<button type="button" class="cookie-btn cookie-btn-primary" data-cookie-choice="all">Accept all</button>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    banner.querySelectorAll('[data-cookie-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        var choice = button.getAttribute('data-cookie-choice');
        setStoredConsent(choice);
        banner.remove();
      });
    });
  }

  function initPerformanceEnhancements() {
    document.querySelectorAll('img:not([loading])').forEach(function (img) {
      if (!img.closest('.hero') && !img.closest('.brand')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    document.querySelectorAll('img:not([decoding])').forEach(function (img) {
      img.setAttribute('decoding', 'async');
    });
  }

  function initThemeToggle() {
    var root = document.documentElement;
    var themeKey = 'collinsLiteraryTheme';
    var savedTheme = '';
    try {
      savedTheme = localStorage.getItem(themeKey) || '';
    } catch (error) {
      savedTheme = '';
    }

    var theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var header = document.querySelector('.header-inner');
    var menuToggle = header && header.querySelector('.menu-toggle');
    var button = document.createElement('button');
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    button.className = 'theme-toggle';
    button.type = 'button';

    function applyTheme(nextTheme, save) {
      var isDark = nextTheme === 'dark';
      var nextLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
      button.setAttribute('aria-label', nextLabel);
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.title = nextLabel;
      button.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>';
      if (themeMeta) themeMeta.content = isDark ? '#0B1220' : '#FFFFFF';
      if (save) {
        try {
          localStorage.setItem(themeKey, nextTheme);
        } catch (error) {
          return;
        }
      }
    }

    applyTheme(theme, false);
    if (header && menuToggle) header.insertBefore(button, menuToggle);
    button.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  function initHeader() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!header || !toggle || !nav) return;
    function setScrolled() { header.classList.toggle('scrolled', window.scrollY > 12); }
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    var servicesLink = Array.prototype.find.call(nav.querySelectorAll('a'), function (link) {
      return link.textContent.trim() === 'Services';
    });
    if (servicesLink && !servicesLink.parentElement.classList.contains('nav-services')) {
      var wrapper = document.createElement('div');
      wrapper.className = 'nav-services';
      servicesLink.parentNode.insertBefore(wrapper, servicesLink);
      wrapper.appendChild(servicesLink);
      var menu = document.createElement('div');
      menu.className = 'service-menu';
      menu.setAttribute('aria-label', 'Services submenu');
      [
        ['Visual Branding', 'branding'], ['Video Production', 'video'], ['Amazon Optimization', 'amazon'],
        ['Goodreads Management', 'goodreads'], ['Social Media', 'social'], ['Virtual Assistance', 'assistant'],
        ['Launch Strategy', 'launch']
      ].forEach(function (item) {
        var link = document.createElement('a');
        link.href = 'services.html#' + item[1];
        link.textContent = item[0];
        menu.appendChild(link);
      });
      wrapper.appendChild(menu);
    }
  }

  function initSharedUtilities() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    var footer = document.querySelector('.site-footer');
    if (footer && !footer.querySelector('.footer-newsletter')) {
      var brand = footer.querySelector('.footer-grid > div');
      if (brand) {
        var form = document.createElement('form');
        form.className = 'footer-newsletter';
        form.innerHTML = '<input type="email" aria-label="Email for newsletter" placeholder="Your email" required><button type="submit">Join</button>';
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          form.querySelector('button').textContent = 'Added';
        });
        brand.appendChild(form);
      }
    }
    if (!document.querySelector('.back-top')) {
      var top = document.createElement('button');
      top.className = 'back-top';
      top.type = 'button';
      top.setAttribute('aria-label', 'Back to top');
      top.textContent = '^';
      top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }); });
      document.body.appendChild(top);
      window.addEventListener('scroll', function () { top.classList.toggle('is-visible', window.scrollY > 500); }, { passive: true });
    }
    if (!document.querySelector('.whatsapp-chat')) {
      var chat = document.createElement('a');
      chat.className = 'whatsapp-chat';
      chat.href = 'https://wa.me/' + whatsappNumber;
      chat.target = '_blank';
      chat.rel = 'noopener noreferrer';
      chat.setAttribute('aria-label', 'Chat with us on WhatsApp');
      chat.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 .8A15.1 15.1 0 0 0 3.1 23.7L1 31l7.5-2A15.2 15.2 0 1 0 16 .8zm0 27.6c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.4 1.2 1.2-4.3-.3-.5A12.4 12.4 0 1 1 16 28.4zm6.8-9.3c-.4-.2-2.3-1.1-2.7-1.2-.4-.2-.6-.2-.9.2-.3.4-1 1.2-1.2 1.4-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-.1-.1-2-1.8-2.2-2.2-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3s1.4 3.8 1.6 4.1c.2.3 2.8 4.3 6.8 6 .9.4 1.6.6 2.1.7.9.3 1.8.2 2.4.1.8-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z"/></svg>';
      document.body.appendChild(chat);
    }
  }

  function initReveal() {
    var elements = Array.prototype.slice.call(document.querySelectorAll('.section, .service-block, .work, .post, .principles > div, [data-reveal]'));
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (element, index) {
        element.style.transitionDelay = (index * 90) + 'ms';
        elements.push(element);
      });
    });
    elements = elements.filter(function (element, index) { return elements.indexOf(element) === index; });
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
    elements.forEach(function (element) { element.classList.add('reveal'); });
    var observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    elements.forEach(function (element) { observer.observe(element); });
  }

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(function (counter) {
      var target = Number(counter.getAttribute('data-count')) || 0;
      if (prefersReducedMotion) { counter.textContent = target; return; }
      var start = 0;
      var step = Math.max(1, Math.ceil(target / 40));
      var timer = window.setInterval(function () {
        start = Math.min(target, start + step);
        counter.textContent = start;
        if (start === target) window.clearInterval(timer);
      }, 35);
    });
  }

  function initPortfolioFilters() {
    var buttons = document.querySelectorAll('.filters button');
    var items = document.querySelectorAll('.work');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');
        buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
        items.forEach(function (item) { item.hidden = !(filter === 'all' || item.getAttribute('data-cat') === filter); });
      });
    });
  }

  function initBlogSearch() {
    var posts = document.querySelectorAll('.post');
    if (!posts.length || document.querySelector('.blog-search')) return;
    var list = document.querySelector('.post-list');
    var input = document.createElement('input');
    input.className = 'blog-search';
    input.type = 'search';
    input.placeholder = 'Search notes';
    input.setAttribute('aria-label', 'Search blog posts');
    input.style.cssText = 'width:100%;max-width:420px;margin-bottom:1.5rem;border:1px solid #bbc7e3;border-radius:999px;padding:.8rem 1rem;font:inherit';
    list.parentNode.insertBefore(input, list);
    input.addEventListener('input', function () {
      var query = input.value.toLowerCase();
      posts.forEach(function (post) { post.hidden = query && !post.textContent.toLowerCase().includes(query); });
    });
  }

  function initScrollSpy() {
    var links = document.querySelectorAll('.jump a');
    var sections = Array.prototype.map.call(links, function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
    if (!links.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) links.forEach(function (link) { link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id); }); }); }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function initVideoPreviews() {
    document.querySelectorAll('.video-card video').forEach(function (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.setAttribute('playsinline', 'true');
      video.pause();

      var card = video.closest('.video-card');
      var startPreview = function () {
        if (video.readyState >= 2) {
          video.play().catch(function () {});
        }
      };

      var stopPreview = function () {
        video.pause();
        video.currentTime = 0;
      };

      if (card) {
        card.addEventListener('mouseenter', startPreview);
        card.addEventListener('mouseleave', stopPreview);
        card.addEventListener('focus', startPreview);
        card.addEventListener('blur', stopPreview);
      }
    });
  }

  function initVideoCarousels() {
    document.querySelectorAll('[data-video-carousel]').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.portfolio-video'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('.video-carousel-dots button'));
      var current = 0;
      var timer;
      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
          if (slideIndex !== current) slide.pause();
        });
        dots.forEach(function (dot, dotIndex) { dot.setAttribute('aria-selected', dotIndex === current ? 'true' : 'false'); });
      }
      function start() { if (!prefersReducedMotion) timer = window.setInterval(function () { showSlide(current + 1); }, 7000); }
      function stop() { window.clearInterval(timer); }
      carousel.querySelector('.video-carousel-prev').addEventListener('click', function () { showSlide(current - 1); stop(); start(); });
      carousel.querySelector('.video-carousel-next').addEventListener('click', function () { showSlide(current + 1); stop(); start(); });
      dots.forEach(function (dot, dotIndex) { dot.addEventListener('click', function () { showSlide(dotIndex); stop(); start(); }); });
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      carousel.addEventListener('focusin', stop);
      carousel.addEventListener('focusout', function (event) { if (!carousel.contains(event.relatedTarget)) start(); });
      showSlide(0);
      start();
    });
  }

  function initContact() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var steps = Array.prototype.slice.call(form.querySelectorAll('fieldset[data-step]'));
    var current = 0;
    function showStep(index) {
      current = index;
      steps.forEach(function (step, stepIndex) { step.hidden = stepIndex !== current; });
      form.querySelectorAll('.wizard-progress span').forEach(function (dot, dotIndex) { dot.classList.toggle('is-active', dotIndex <= current); });
      if (current === 3) {
        var values = new FormData(form);
        var review = form.querySelector('.wizard-review');
        review.innerHTML = '<p><strong>' + (values.get('name') || 'Your name') + '</strong><br>' + (values.get('email') || 'Your email') + '</p><p>' + (values.get('book') || 'Book details not given') + '<br>' + (values.get('service') || 'Service not selected') + '<br>Launch: ' + (values.get('launch_date') || 'Not set') + '</p><p>' + (values.get('message') || 'No message') + '</p>';
        var body = 'Name: ' + values.get('name') + '\nEmail: ' + values.get('email') + '\nBook: ' + values.get('book') + '\nService: ' + values.get('service') + '\nLaunch date: ' + values.get('launch_date') + '\n\n' + values.get('message');
        var email = form.querySelector('[data-email]');
        if (email) email.href = 'mailto:Collinssliterary@gmail.com?subject=' + encodeURIComponent('Collins Literary enquiry') + '&body=' + encodeURIComponent(body);
        var whatsapp = form.querySelector('[data-whatsapp]');
        if (whatsapp && whatsappNumber.indexOf('TODO_') !== 0) whatsapp.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(body);
      }
    }
    form.querySelectorAll('.wizard-next').forEach(function (button) { button.addEventListener('click', function () { var visibleFields = steps[current].querySelectorAll('input, select, textarea'); var valid = true; visibleFields.forEach(function (field) { if (!field.checkValidity()) { field.reportValidity(); valid = false; } }); if (valid) showStep(Math.min(current + 1, steps.length - 1)); }); });
    form.querySelectorAll('.wizard-back').forEach(function (button) { button.addEventListener('click', function () { showStep(Math.max(current - 1, 0)); }); });
    form.addEventListener('submit', function () { if (status) status.textContent = 'Sending your message securely...'; });
    showStep(0);
  }

  initCookieBanner();
  initPerformanceEnhancements();
  initThemeToggle();
  initHeader();
  initSharedUtilities();
  initReveal();
  initCounters();
  initPortfolioFilters();
  initBlogSearch();
  initScrollSpy();
  initVideoPreviews();
  initVideoCarousels();
  initContact();
})();

function initTranslationPrompt() {
  var widget = document.querySelector('.google-translate-wrap');
  if (!widget) return;

  var language = (navigator.language || navigator.userLanguage || '').toLowerCase();
  var needsTranslation = !!language && !language.toLowerCase().startsWith('en');

  if (needsTranslation) {
    widget.classList.add('is-visible');
  } else {
    widget.classList.remove('is-visible');
  }
}

window.googleTranslateElementInit = function () {
  if (!document.getElementById('google_translate_element')) return;
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) return;

  new window.google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: true,
    layout: window.google.translate.TranslateElement.InlineLayout.NONE,
    multilanguagePage: true,
    gaTrack: true,
    gaId: 'UA-XXXXX-Y'
  }, 'google_translate_element');

  var widget = document.querySelector('#google_translate_element .goog-te-combo');
  if (widget) {
    widget.setAttribute('aria-label', 'Translate page');
  }

  initTranslationPrompt();
};

(function () {
  var el = document.getElementById("typewriter");
  if (!el) return;

  var phrases = [
    "already browsing.",
    "scrolling Goodreads tonight.",
    "one list away from your book.",
    "waiting to hit \"want to read.\""
  ];

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = phrases[0];
    return;
  }

  var phraseIndex = 0;
  var charIndex = 0;
  var typing = true;
  var typeSpeed = 55;
  var deleteSpeed = 30;
  var pauseAfterType = 1800;
  var pauseAfterDelete = 300;

  function tick() {
    var current = phrases[phraseIndex];

    if (typing) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typing = false;
        setTimeout(tick, pauseAfterType);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typing = true;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, pauseAfterDelete);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
})();
