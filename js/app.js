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

  /* --- i18n (EN/ES) --- */
  var STRINGS = {
    en: {
      'nav.services': 'Services',
      'nav.gallery': 'Gallery',
      'nav.faq': 'FAQ',
      'nav.book': 'Book Now',
      'hero.badge': 'Since 2015 · 4.9★ on Google',
      'hero.title': 'Premium Barbershop<br>in Lehi, Utah',
      'hero.sub': 'Classic cuts, straight-razor shaves and beard styling crafted with precision. Where tradition meets modern style.',
      'hero.cta1': 'Book Now',
      'hero.cta2': 'View Services',
      'services.eyebrow': 'What we do',
      'services.title': 'Services & Pricing',
      'services.popular': 'Most Popular',
      'services.book': 'Book this service',
      'services.s1t': 'Classic Cut',
      'services.s1d': 'Precision scissor cut tailored to your face shape and style.',
      'services.s2t': 'Beard Trim',
      'services.s2d': 'Shape, line-up and condition your beard for a sharp finish.',
      'services.s3t': 'Cut + Beard Noble',
      'services.s3d': 'Our signature package: full cut plus straight-razor beard finish. The complete NOBLE experience — precision scissor work, hot towel treatment and a clean beard line-up.',
      'services.s4t': 'Straight-Razor Shave',
      'services.s4d': 'Hot towel, pre-shave oil and a clean straight-razor finish.',
      'services.s5t': 'Color & Camouflage',
      'services.s5d': 'Subtle grey blending or full color by our senior stylist.',
      'services.s6t': 'Facial Ritual',
      'services.s6d': 'Deep cleanse, exfoliation and hydration for healthy skin.',
      'gallery.eyebrow': 'Styles',
      'gallery.title': 'Haircut Styles',
      'faq.eyebrow': 'Questions',
      'faq.title': 'Frequently Asked Questions',
      'faq.mode': 'Allow multiple open answers',
      'faq.q1': 'What are your hours?',
      'faq.a1': 'We are open Monday through Saturday, 10:00 AM to 8:00 PM. We are closed on Sundays and major holidays.',
      'faq.q2': 'Do I need an appointment?',
      'faq.a2': 'Walk-ins are welcome, but we strongly recommend booking ahead to guarantee your preferred time slot. Online booking takes less than a minute.',
      'faq.q3': 'What payment methods do you accept?',
      'faq.a3': 'We accept cash, all major credit and debit cards, Apple Pay and Google Pay. A 20% gratuity is appreciated but never required.',
      'faq.q4': 'What is your cancellation policy?',
      'faq.a4': 'Life happens. You can reschedule or cancel free of charge up to 4 hours before your appointment. Later cancellations may incur a 50% fee.',
      'faq.q5': 'What products do you use?',
      'faq.a5': 'We use premium American-made brands including Suavecito, Layrite and Baxter of California. All products are available for retail purchase in-shop.',
      'form.eyebrow': 'Book your visit',
      'form.title': 'Reserve Your Spot',
      'form.intro': 'Register now and we will confirm your appointment by WhatsApp. No spam, ever.',
      'form.name': 'Full name',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.optional': '(optional)',
      'form.service': 'Service',
      'form.message': 'Message',
      'form.messagePh': 'Any special requests?',
      'form.legal': 'By registering you agree to be contacted on WhatsApp to confirm your appointment. Your data is stored locally in your browser and never shared.',
      'form.submit': 'Send via WhatsApp',
      'form.forget': 'Forget my data',
      'form.errRequired': 'Please fill in your name and email.',
      'form.errEmail': 'Please enter a valid email address.',
      'form.sent': 'Opening WhatsApp with your request…',
      'form.removed': 'Your data has been removed.',
      'footer.visit': 'Visit Us',
      'footer.hours': 'Hours',
      'footer.hoursBody': 'Mon – Sat: 10am – 8pm<br>Sunday: Closed',
      'footer.follow': 'Follow',
      'footer.rights': '&copy; 2026 NOBLE Barbershop. All rights reserved.'
    },
    es: {
      'nav.services': 'Servicios',
      'nav.gallery': 'Galería',
      'nav.faq': 'Preguntas',
      'nav.book': 'Reservar',
      'hero.badge': 'Desde 2015 · 4.9★ en Google',
      'hero.title': 'Barbería Premium<br>en Lehi, Utah',
      'hero.sub': 'Cortes clásicos, afeitado a navaja y arreglo de barba con precisión artesanal. Donde la tradición se encuentra con el estilo moderno.',
      'hero.cta1': 'Reservar',
      'hero.cta2': 'Ver servicios',
      'services.eyebrow': 'Lo que hacemos',
      'services.title': 'Servicios y Precios',
      'services.popular': 'Más popular',
      'services.book': 'Reservar este servicio',
      'services.s1t': 'Corte Clásico',
      'services.s1d': 'Corte a tijera de precisión adaptado a tu rostro y estilo.',
      'services.s2t': 'Arreglo de Barba',
      'services.s2d': 'Perfilado, delineado e hidratación para un acabado impecable.',
      'services.s3t': 'Corte + Barba Noble',
      'services.s3d': 'Nuestro paquete insignia: corte completo más acabado de barba a navaja. La experiencia NOBLE completa — tijera de precisión, toalla caliente y delineado perfecto.',
      'services.s4t': 'Afeitado a Navaja',
      'services.s4d': 'Toalla caliente, aceite pre-afeitado y acabado limpio a navaja.',
      'services.s5t': 'Color y Camuflaje',
      'services.s5d': 'Matizado sutil de canas o color completo por nuestro estilista senior.',
      'services.s6t': 'Ritual Facial',
      'services.s6d': 'Limpieza profunda, exfoliación e hidratación para una piel sana.',
      'gallery.eyebrow': 'Estilos',
      'gallery.title': 'Estilos de Corte',
      'faq.eyebrow': 'Preguntas',
      'faq.title': 'Preguntas Frecuentes',
      'faq.mode': 'Permitir varias respuestas abiertas',
      'faq.q1': '¿Cuál es su horario?',
      'faq.a1': 'Abrimos de lunes a sábado, de 10:00 AM a 8:00 PM. Cerramos domingos y días festivos.',
      'faq.q2': '¿Necesito cita?',
      'faq.a2': 'Aceptamos visitas sin cita, pero recomendamos reservar para garantizar tu horario preferido. Reservar en línea toma menos de un minuto.',
      'faq.q3': '¿Qué métodos de pago aceptan?',
      'faq.a3': 'Aceptamos efectivo, las principales tarjetas de crédito y débito, Apple Pay y Google Pay. Una propina del 20% se agradece pero nunca es obligatoria.',
      'faq.q4': '¿Cuál es su política de cancelación?',
      'faq.a4': 'La vida pasa. Puedes reprogramar o cancelar sin costo hasta 4 horas antes de tu cita. Cancelaciones tardías pueden tener un cargo del 50%.',
      'faq.q5': '¿Qué productos usan?',
      'faq.a5': 'Usamos marcas premium americanas como Suavecito, Layrite y Baxter of California. Todos disponibles para venta en el local.',
      'form.eyebrow': 'Reserva tu visita',
      'form.title': 'Reserva Tu Lugar',
      'form.intro': 'Regístrate ahora y confirmaremos tu cita por WhatsApp. Sin spam, nunca.',
      'form.name': 'Nombre completo',
      'form.email': 'Correo electrónico',
      'form.phone': 'Teléfono',
      'form.optional': '(opcional)',
      'form.service': 'Servicio',
      'form.message': 'Mensaje',
      'form.messagePh': '¿Alguna petición especial?',
      'form.legal': 'Al registrarte aceptas ser contactado por WhatsApp para confirmar tu cita. Tus datos se guardan localmente en tu navegador y nunca se comparten.',
      'form.submit': 'Enviar por WhatsApp',
      'form.forget': 'Olvidar mis datos',
      'form.errRequired': 'Por favor completa tu nombre y correo.',
      'form.errEmail': 'Por favor ingresa un correo válido.',
      'form.sent': 'Abriendo WhatsApp con tu solicitud…',
      'form.removed': 'Tus datos han sido eliminados.',
      'footer.visit': 'Visítanos',
      'footer.hours': 'Horario',
      'footer.hoursBody': 'Lun – Sáb: 10am – 8pm<br>Domingo: Cerrado',
      'footer.follow': 'Síguenos',
      'footer.rights': '&copy; 2026 NOBLE Barbershop. Todos los derechos reservados.'
    }
  };

  var LANG_KEY = 'noble-lang';
  var PH_PREFIX = 'data-i18n-ph';

  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) || 'en';
    } catch (e) { return 'en'; }
  }

  function t(key) {
    var lang = getLang();
    return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || '';
  }

  function applyLang(lang) {
    if (STRINGS[lang]) {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (STRINGS[lang][key] !== undefined) el.innerHTML = STRINGS[lang][key];
      });
      document.querySelectorAll('[' + PH_PREFIX + ']').forEach(function (el) {
        var key = el.getAttribute(PH_PREFIX);
        if (STRINGS[lang][key] !== undefined) el.setAttribute('placeholder', STRINGS[lang][key]);
      });
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    }
    var btnEn = document.getElementById('lang-en');
    var btnEs = document.getElementById('lang-es');
    if (btnEn && btnEs) {
      var isEn = lang === 'en';
      btnEn.classList.toggle('is-active', isEn);
      btnEs.classList.toggle('is-active', !isEn);
      btnEn.setAttribute('aria-pressed', String(isEn));
      btnEs.setAttribute('aria-pressed', String(!isEn));
    }
    updateWhatsappFloat();
    refreshGreeting();
  }

  var btnEn = document.getElementById('lang-en');
  var btnEs = document.getElementById('lang-es');
  if (btnEn) btnEn.addEventListener('click', function () { applyLang('en'); });
  if (btnEs) btnEs.addEventListener('click', function () { applyLang('es'); });

  /* --- Booking Form + localStorage + WhatsApp --- */
  var USER_KEY = 'noble-user';
  var WHATSAPP_NUMBER = '13855550148';
  var form = document.getElementById('booking-form');
  var formStatus = document.getElementById('form-status');
  var headerGreeting = document.getElementById('header-greeting');
  var forgetBtn = document.getElementById('forget-btn');
  var whatsappFloat = document.getElementById('contact-float');

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
    if (headerGreeting) {
      var msg = getLang() === 'es' ? 'Hola, ' + name : 'Welcome, ' + name;
      headerGreeting.textContent = msg;
      headerGreeting.hidden = false;
    }
    if (forgetBtn) forgetBtn.hidden = false;
  }

  function refreshGreeting() {
    var user = getStoredUser();
    if (user && user.name) showGreeting(user.name);
  }

  function hideGreeting() {
    if (headerGreeting) {
      headerGreeting.textContent = '';
      headerGreeting.hidden = true;
    }
    if (forgetBtn) forgetBtn.hidden = true;
  }

  function updateWhatsappFloat() {
    if (!whatsappFloat) return;
    var msg = getLang() === 'es'
      ? '¡Hola NOBLE! Quisiera reservar una cita.'
      : 'Hi NOBLE! I\'d like to book an appointment.';
    whatsappFloat.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
  }

  var storedUser = getStoredUser();
  if (storedUser && storedUser.name) {
    refreshGreeting();
    if (form) {
      var nameInput = document.getElementById('form-name');
      var emailInput = document.getElementById('form-email');
      if (nameInput) nameInput.value = storedUser.name || '';
      if (emailInput) emailInput.value = storedUser.email || '';
    }
  }

  function buildWhatsappUrl(data) {
    var es = getLang() === 'es';
    var lines = es ? [
      '¡Hola NOBLE! Quisiera reservar:',
      'Nombre: ' + data.name,
      'Email: ' + data.email,
      'Teléfono: ' + (data.phone || '-'),
      'Servicio: ' + data.service,
      'Mensaje: ' + (data.message || '-')
    ] : [
      'Hi NOBLE! I\'d like to book:',
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + (data.phone || '-'),
      'Service: ' + data.service,
      'Message: ' + (data.message || '-')
    ];
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('form-name').value.trim();
      var email = document.getElementById('form-email').value.trim();
      var phone = document.getElementById('form-phone').value.trim();
      var serviceSelect = document.getElementById('form-service');
      var service = serviceSelect.options[serviceSelect.selectedIndex].text;
      var message = document.getElementById('form-message').value.trim();

      if (!name || !email) {
        formStatus.textContent = t('form.errRequired');
        formStatus.className = 'form-status error';
        return;
      }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        formStatus.textContent = t('form.errEmail');
        formStatus.className = 'form-status error';
        return;
      }

      saveUser({ name: name, email: email, phone: phone, ts: Date.now() });
      formStatus.textContent = t('form.sent');
      formStatus.className = 'form-status success';
      showGreeting(name);
      window.open(buildWhatsappUrl({ name: name, email: email, phone: phone, service: service, message: message }), '_blank', 'noopener');
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

  /* --- Init language --- */
  applyLang(getLang());

})();
