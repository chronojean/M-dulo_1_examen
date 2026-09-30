/* ============================================
   NOBLE · Premium Barbershop — Lehi, Utah
   ============================================ */
(function () {
  'use strict';

  /* --- Mobile Navigation --- */
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('nav-open');
    });

    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('nav-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('nav-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('nav-open');
        navToggle.focus();
      }
    });
  }

  /* --- Accordion (single / multiple mode) --- */
  var faqMode = document.getElementById('faq-mode');
  var faqItems = document.querySelectorAll('.faq-item');

  function closeItem(item) {
    var btn = item.querySelector('.faq-btn');
    var panel = item.querySelector('.faq-panel');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
  }

  function openItem(item) {
    var btn = item.querySelector('.faq-btn');
    var panel = item.querySelector('.faq-panel');
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
  }

  faqItems.forEach(function (item, index) {
    var btn = item.querySelector('.faq-btn');
    if (index === 0) {
      openItem(item);
    }
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var multi = faqMode && faqMode.checked;
      if (!multi) {
        faqItems.forEach(function (other) {
          if (other !== item) closeItem(other);
        });
      }
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  /* --- Weather: Geolocation + OpenWeatherMap --- */
  var OWM_KEY = '3eacb37d511e5b347ccd8d2b00f3be54';
  var OWM_URL = 'https://api.openweathermap.org/data/2.5/weather';
  var FALLBACK = { lat: 40.3916, lon: -111.8505, city: 'Lehi' };
  var CACHE_KEY = 'noble-weather';
  var CACHE_TTL = 10 * 60 * 1000;

  var weatherTemp = document.getElementById('weather-temp');
  var weatherIcon = document.getElementById('weather-icon');
  var weatherCity = document.getElementById('weather-city');

  function renderWeather(data) {
    if (!data || !data.main || !data.weather) return;
    var temp = Math.round(data.main.temp);
    var iconCode = data.weather[0].icon;
    var city = data.name || FALLBACK.city;
    weatherTemp.textContent = temp + '°F';
    weatherCity.textContent = city;
    weatherIcon.innerHTML = '<img src="https://openweathermap.org/img/wn/' + iconCode + '.png" alt="" width="20" height="20">';
  }

  function fetchWeather(lat, lon) {
    var url = OWM_URL + '?lat=' + lat + '&lon=' + lon + '&units=imperial&lang=en&appid=' + OWM_KEY;
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Weather API error: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data, ts: Date.now() }));
        } catch (e) { /* storage full or unavailable */ }
        renderWeather(data);
      })
      .catch(function () {
        weatherTemp.textContent = '—';
        weatherCity.textContent = '';
        weatherIcon.innerHTML = '';
      });
  }

  function getCachedWeather() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < CACHE_TTL) return parsed.data;
    } catch (e) { /* ignore */ }
    return null;
  }

  function initWeather() {
    var cached = getCachedWeather();
    if (cached) {
      renderWeather(cached);
      return;
    }
    if (!navigator.geolocation) {
      fetchWeather(FALLBACK.lat, FALLBACK.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      function () {
        fetchWeather(FALLBACK.lat, FALLBACK.lon);
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }

  initWeather();

  /* --- Booking Form + localStorage --- */
  var USER_KEY = 'noble-user';
  var form = document.getElementById('booking-form');
  var formStatus = document.getElementById('form-status');
  var formGreeting = document.getElementById('form-greeting');
  var heroGreeting = document.getElementById('hero-greeting');
  var forgetBtn = document.getElementById('forget-btn');

  function getStoredUser() {
    try {
      var raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) { /* ignore */ }
  }

  function clearUser() {
    try { localStorage.removeItem(USER_KEY); } catch (e) { /* ignore */ }
  }

  function showGreeting(name) {
    var msg = 'Welcome back, ' + name + '! Your spot is reserved.';
    if (formGreeting) {
      formGreeting.textContent = msg;
      formGreeting.classList.add('visible');
    }
    if (heroGreeting) {
      heroGreeting.textContent = 'Welcome back, ' + name + '!';
    }
    if (forgetBtn) forgetBtn.hidden = false;
  }

  function hideGreeting() {
    if (formGreeting) {
      formGreeting.textContent = '';
      formGreeting.classList.remove('visible');
    }
    if (heroGreeting) heroGreeting.textContent = '';
    if (forgetBtn) forgetBtn.hidden = true;
  }

  var storedUser = getStoredUser();
  if (storedUser && storedUser.name) {
    showGreeting(storedUser.name);
    if (form) {
      var nameInput = document.getElementById('form-name');
      var emailInput = document.getElementById('form-email');
      if (nameInput) nameInput.value = storedUser.name || '';
      if (emailInput) emailInput.value = storedUser.email || '';
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('form-name').value.trim();
      var email = document.getElementById('form-email').value.trim();
      var phone = document.getElementById('form-phone').value.trim();
      var service = document.getElementById('form-service').value;
      var message = document.getElementById('form-message').value.trim();

      if (!name || !email) {
        formStatus.textContent = 'Please fill in your name and email.';
        formStatus.className = 'form-status error';
        return;
      }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      saveUser({ name: name, email: email, phone: phone, service: service, message: message, ts: Date.now() });
      formStatus.textContent = 'Reservation confirmed! We will email you shortly.';
      formStatus.className = 'form-status success';
      showGreeting(name);
    });
  }

  if (forgetBtn) {
    forgetBtn.addEventListener('click', function () {
      clearUser();
      hideGreeting();
      if (form) form.reset();
      if (formStatus) {
        formStatus.textContent = 'Your data has been removed.';
        formStatus.className = 'form-status';
      }
    });
  }

  /* --- Scroll Reveal --- */
  var revealElements = document.querySelectorAll('.anim-reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
