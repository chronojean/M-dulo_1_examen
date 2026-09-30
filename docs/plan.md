# Plan — Landing Barbería Premium (Módulo 1 Examen)

> Para el agente builder que implemente. Repo ya inicializado en `main` con `.gitignore` + `README.md` vacío. No hay remote aún.

## 1. Decisiones cerradas por el usuario (2026-09-29 / 2026-09-30)
1. **Nombre + ubicación:** `NOBLE · Barbería Premium`, ubicada en **153 N 100 E, Lehi, UT 84043** (Lehi City Hall, ubicación pública real usada como referencia de práctica). Fallback clima: Lehi, UT (lat 40.3916, lon -111.8505). `lang="en"` para el sitio (negocio en Utah).
2. **Estilo:** Premium oscuro (negro + dorado + crema).
3. **Servicios/precios:** los inventa el agente (ver §4, precios USD).

## 2. Objetivo — cubrir puntos del teacher
- Git y GitHub: historial con commits por bloque, push a GitHub, README final.
- HTML: Header, Logo (SVG inline), Navbar, Hero, CTA, Gallery, Cards.
- Accordion con modo `uno solo / múltiples abiertos` conmutable por el usuario.
- Responsive móvil/desktop, transiciones CSS, animaciones + `@keyframes`.
- API Geolocation del navegador + OpenWeatherMap (solo temp + icono en Header).
  - Key: `3eacb37d511e5b347ccd8d2b00f3be54`
  - Endpoint: `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&lang=es&appid=KEY`
  - Icono: `https://openweathermap.org/img/wn/{icon}.png` (usar `@2x` solo en desktop vía `srcset` si no penaliza).
- Formulario registro (nombre + email) con `localStorage`, recuerda visitante.
- Calidad: Lighthouse ≥95 en Accessibility / Best Practices / SEO. Cero errores en validator.w3.org/nu, jigsaw CSS, WAVE (solo errores, ignorar alertas).

## 3. Stack y estructura (sin frameworks)
```
index.html
css/styles.css        # un solo CSS para simplificar validador + performance
js/app.js             # JS vanilla, defer, ~4 módulos: menu, accordion, weather, form+reveal
assets/               # hero.webp, cortes (4-6 .webp), og-cover.jpg, favicon.svg
README.md             # completar al final: descripción, cómo abrir, APIs usadas
```
- Sin Tailwind/Bootstrap/jQuery. Google Fonts con `preconnect` + `display=swap` (o mejor: sistema + 1 font). Mantener ≤2 pesos.
- Mobile-first, 1 breakpoint principal `48rem` (~768px), opcional `64rem`.

## 4. Contenido inventado (usar tal cual si no hay cambios)
- **Marca:** NOBLE · Barbería Premium — tagline: "Corte preciso. Estilo atemporal."
- **Nav:** Servicios, Galería, Opiniones/FAQ, Reservar (CTA) + widget clima.
- **Hero:** H1 "Premium barbershop in Lehi, Utah", sub + 2 CTA (Book now → #reservar, View services → #servicios). Badge "Since 2015 · 4.9★".
- **Servicios (Cards, 6):**
  1. Corte Clásico — $28 — 45 min
  2. Arreglo de Barba — $22 — 30 min
  3. Corte + Barba Noble — $48 — 75 min (destacada "Más popular")
  4. Afeitado Navaja — $26 — 40 min
  5. Color / Camuflaje — $38 — 50 min
  6. Ritual Facial — $34 — 45 min
  - Card: `article > img + h3 + p + precio/duración + a/botón`.
- **Galería (6 figures):** cortes, barba, interior, detalle navaja. `loading="lazy"`, `width/height` explícitos, `alt` descriptivo.
- **FAQ Accordion (5):** horarios, reserva, métodos pago, cancelación, productos. + switch modo.
- **Reserva/Form:** nombre + email (+ teléfono opcional + servicio select). Texto legal corto. Al guardar: muestra "Hola, {nombre}" en hero/form y botón "Olvidar mis datos".
- **Footer:** `address` real de práctica: 153 N 100 E, Lehi, UT 84043 + mapa/embed opcional, horario Mon–Sat 10am–8pm, teléfono +1 (385) 555-0148, Instagram, copyright.

## 5. Diseño Premium — tokens
```css
--bg: #0e0e11; --surface: #16161c; --surface-2: #1e1e26;
--gold: #c9a86a; --gold-soft: #e6cf9b;
--cream: #f5f0e8; --muted: #b8b3a7;
--line: rgba(201,168,106,.22);
--radius: 14px; --font-display: "Playfair Display", Georgia, serif; --font-body: Inter, system-ui, sans-serif;
```
- Hero oscuro con foto + overlay degradado, dorado solo en acentos/CTA para contraste AA (verificar: dorado sobre negro OK, no usar dorado claro sobre crema para texto).
- Foco visible: `outline: 3px solid var(--gold)` con offset.
- Respetar `prefers-reduced-motion`.

## 6. HTML semántico exigido
- `<!doctype html>`, `lang="en"`, `meta viewport`, `title`, `description`, OG/Twitter, `favicon.svg`, `theme-color`.
- `header.site-header` (sticky): logo SVG + nombre, `nav aria-label`, lista links, `#weather` (`role="status"`), botón hamburguesa `aria-expanded/aria-controls`.
- `main > section` con `aria-labelledby` + `h2` por sección: `#servicios`, `#galeria`, `#faq`, `#reservar`.
- Accordion: `div.faq-item > h3 > button[aria-expanded][aria-controls] + div[role=region][id]` + switch `checkbox #faq-mode`.
- Form: `label` explícitos, `autocomplete`, `required`, `type=email`, `aria-describedby` para mensajes `role=status`.
- Footer con `address`.

## 7. CSS — qué implementar
- Reset mínimo, variables, tipografía fluida con `clamp()`.
- Layout: `.container{max-width:72rem}`; grid servicios `auto-fit minmax(16rem,1fr)`; galería `auto-fill minmax(12rem,1fr)`.
- Header sticky con `backdrop-filter`, nav colapsada en móvil (`.nav-open`).
- Transiciones (solo `transform, opacity, background-color`): hover cards (`translateY(-4px)` + sombra), botones, links nav con subrayado animado, accordion `grid-template-rows` o `max-height`.
- `@keyframes` (mínimo 2): `fadeUp` hero, `float` icono clima / brillo dorado CTA, `reveal` con `.is-visible` vía IntersectionObserver.
- Imágenes: `aspect-ratio`, `object-fit: cover`.

## 8. JS — `js/app.js` (defer, sin errores si API falla)
1. **Menu:** toggle hamburguesa, cierra con link/Escape, actualiza `aria-expanded`.
2. **Accordion:** `querySelectorAll('.faq-item')`; checkbox `#faq-mode` (checked = múltiples). En modo single, abrir uno cierra otros. Animar altura + `aria-expanded`. Primer item abierto por defecto.
3. **Weather:** `navigator.geolocation.getCurrentPosition(ok, err, {timeout:8000})` → `fetch` OpenWeather `units=imperial&lang=en` (Lehi usa °F). Render solo `Math.round(temp)°F` + `img icono`. Cache `localStorage 'noble-weather'` 10 min. Fallback coords Lehi 40.3916,-111.8505 + texto "Lehi". Si falla todo: muestra "—" sin romper layout. No exponer más datos.
4. **Form `localStorage 'noble-user'`:** `{name, email, service?, ts}`. Al cargar: si existe, personaliza `#form-greeting` y badge hero. Validar con nativo + mensaje. Botón "borrar" hace `removeItem`. Nunca guardar clave API.
5. **Reveal:** `IntersectionObserver` agrega `.is-visible`, respeta `reduced-motion`.

## 9. Accesibilidad / SEO / Performance (para ≥95)
- Un solo `h1`, orden headings, alts, contraste AA, targets ≥44px, labels, `aria-*` correctos, skip-link "Saltar al contenido".
- `width/height` en imgs, `loading=lazy` salvo hero (`fetchpriority=high`), `preconnect` fonts, CSS/JS minificado manual (sin sourcemaps), total <300KB aprox.
- No usar `tabindex` positivos, no texto en imágenes, `html lang=en`.

## 10. Git/GitHub
- Commits sugeridos: `feat: base + header/nav`, `feat: hero + CTA`, `feat: servicios cards`, `feat: galeria`, `feat: accordion dual-mode`, `feat: reserva localstorage`, `feat: weather geolocation`, `style: responsive + motion`, `a11y: lighthouse pass`, `docs: readme`.
- Luego: crear repo GitHub, `git remote add origin …`, `git push -u origin main`. Completar README (qué es, stack, cómo ver con `python3 -m http.server`, APIs, checklist verificación).

## 11. Verificación final (obligatoria)
1. `npx serve` o Live Server + DevTools Lighthouse móvil + desktop → anotar 3 scores.
2. https://validator.w3.org/nu/ → 0 errores.
3. https://jigsaw.w3.org/css-validator/ → 0 errores.
4. https://wave.webaim.org/ → 0 errores.
- Corregir todo lo que sea error (no alertas) y re-ejecutar.

## 12. Criterios de aceptación
- Todos los elementos visibles y navegables en 375px y 1280px.
- Clima visible en header con temp + icono reales o fallback elegante.
- Form recuerda nombre tras recargar; accordion cambia de modo correctamente.
- Lighthouse ≥95 en las 3 categorías; validadores sin errores.
