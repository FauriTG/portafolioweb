/* ================================================================
   PORTAFOLIO — Miguel Fauricio Quiros Salas
   main.js  |  Vanilla JavaScript ES6 (sin frameworks)
   ================================================================ */


/* ── TEMA CLARO / OSCURO ─────────────────────────────────────────── */
(function initTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const html   = document.documentElement;

  const SUN_ICON  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>`;
  const MOON_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;

  // Preferencia guardada; si no hay, la del sistema
  const stored = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  let theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
  if (toggle) toggle.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* modo privado */ }
    toggle.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  });
})();


/* ── MENÚ MÓVIL ──────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Cerrar al hacer clic en un enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ── BORDE DEL NAV AL HACER SCROLL ──────────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = scrollY > 20
      ? 'var(--color-border)'
      : 'var(--color-divider)';
  }, { passive: true });
})();


/* ── LUCIDE ICONS ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});


/* ── SALUDO DINÁMICO SEGÚN HORA ─────────────────────────────────── */
/* Se repinta en cada cambio de idioma: el traductor restaura el <span>
   vacío, así que este módulo es el dueño de su contenido. */
(function initDynamicGreeting() {
  const GREETINGS = {
    es: ['Buenos días.', 'Buenas tardes.', 'Buenas noches.'],
    en: ['Good morning.', 'Good afternoon.', 'Good evening.'],
  };

  function render() {
    const el = document.getElementById('dynamic-greeting');
    if (!el) return;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    const hour = new Date().getHours();
    const i = hour >= 6 && hour < 12 ? 0 : hour >= 12 && hour < 19 ? 1 : 2;
    el.textContent = GREETINGS[lang][i];
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('langchange', render);
})();


/* ── VISOR DE IMÁGENES CON ZOOM ──────────────────────────────────── */
(function initLightbox() {
  const box = document.getElementById('lightbox');
  const triggers = document.querySelectorAll('.zoomable[data-full]');
  if (!box || !triggers.length) return;

  const stage   = box.querySelector('[data-lb="stage"]');
  const img     = box.querySelector('[data-lb="img"]');
  const caption = box.querySelector('#lightbox-caption');
  const level   = box.querySelector('[data-lb="level"]');
  const btnIn   = box.querySelector('[data-lb="in"]');
  const btnOut  = box.querySelector('[data-lb="out"]');

  const MIN = 1, MAX = 6;
  let scale = 1, tx = 0, ty = 0;
  let lastFocus = null;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function render() {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    level.textContent = Math.round(scale * 100) + '%';
    stage.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
    btnIn.disabled  = scale >= MAX;
    btnOut.disabled = scale <= MIN;
  }

  // Al alejar hasta 1x la imagen vuelve a quedar centrada
  function setScale(next, originX, originY) {
    next = clamp(next, MIN, MAX);
    if (next === scale) return;
    const r = stage.getBoundingClientRect();
    const cx = (originX ?? r.left + r.width / 2) - r.left - r.width / 2;
    const cy = (originY ?? r.top + r.height / 2) - r.top - r.height / 2;
    const k = next / scale;
    tx = cx - (cx - tx) * k;
    ty = cy - (cy - ty) * k;
    scale = next;
    if (scale === MIN) { tx = 0; ty = 0; }
    render();
  }

  function open(trigger) {
    lastFocus = trigger;
    img.src = trigger.dataset.full;
    img.alt = trigger.querySelector('img')?.alt || '';
    caption.textContent = trigger.dataset.caption || '';
    scale = 1; tx = 0; ty = 0;
    render();
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('[data-lb="close"]').focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === '+' || e.key === '=') { setScale(scale * 1.4); return; }
    if (e.key === '-') { setScale(scale / 1.4); return; }
    // Mantiene el foco dentro del visor mientras está abierto
    if (e.key === 'Tab') {
      const f = [...box.querySelectorAll('button')].filter(b => !b.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  triggers.forEach(t => t.addEventListener('click', () => open(t)));

  box.addEventListener('click', e => {
    const action = e.target.closest('[data-lb]')?.dataset.lb;
    if (action === 'close') { close(); return; }
    if (action === 'in')    { setScale(scale * 1.5); return; }
    if (action === 'out')   { setScale(scale / 1.5); return; }
    // Clic fuera de la imagen cierra
    if (e.target === stage || e.target === box) close();
  });

  stage.addEventListener('dblclick', e => setScale(scale > 1 ? MIN : 2.5, e.clientX, e.clientY));

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    setScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
  }, { passive: false });

  /* Arrastre y pellizco con punteros: sirve igual para ratón y táctil */
  const pointers = new Map();
  let start = null, pinchStart = null;

  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.lightbox-btn')) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      start = { x: e.clientX - tx, y: e.clientY - ty };
      if (scale > 1) stage.classList.add('is-panning');
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      start = null;
    }
    try { stage.setPointerCapture(e.pointerId); } catch { /* puntero ya liberado */ }
  });

  stage.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setScale(pinchStart.scale * (dist / pinchStart.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (start && scale > 1) {
      tx = e.clientX - start.x;
      ty = e.clientY - start.y;
      render();
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) { start = null; stage.classList.remove('is-panning'); }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
})();


/* ── TRADUCCIÓN ES / EN ──────────────────────────────────────────────
   El español vive en el HTML; aquí solo está su equivalente en inglés,
   indexado por el propio texto en español (sin claves intermedias).
   ------------------------------------------------------------------ */
const I18N = {
  /* Navegación */
  'Sobre mí': 'About',
  'Proyectos': 'Projects',
  'Experiencia': 'Experience',
  'Contacto': 'Contact',

  /* Hero */
  'Disponible para trabajar': 'Available for work',
  'Desarrollador Móvil y Full-Stack Estudiante de Ingeniería':
    'Mobile &amp; Full-Stack Developer<br>Engineering Student',
  'Construyo aplicaciones móviles y web para negocios reales. Flutter y Android nativo, con backend en Firebase y Supabase.':
    'I build mobile and web applications for real businesses. Flutter and native Android, with Firebase and Supabase on the backend.',
  'Ver proyectos': 'View projects',
  'Contactarme': 'Get in touch',
  'Años estudiando': 'Years studying',
  'Inglés': 'English',

  /* Sobre mí */
  'Buenos días.': 'Good morning.',
  'Buenas tardes.': 'Good afternoon.',
  'Buenas noches.': 'Good evening.',
  'Soy Miguel Fauricio Quiros Salas, estudiante de Ingeniería en Sistemas Computacionales en la Universidad Latina de Costa Rica. Construyo software para negocios reales: Autex Manager, mi proyecto principal, es una plataforma SaaS multi-negocio que adapta su flujo de trabajo a talleres, autolavados y lubricentros.':
    'I am <span class="about-highlight">Miguel Fauricio Quiros Salas</span>, a Computer Systems Engineering student at Universidad Latina de Costa Rica. I build software for real businesses: <span class="about-highlight">Autex Manager</span>, my main project, is a multi-business SaaS platform that adapts its workflow to auto repair shops, car washes and lube centers.',
  'En móvil trabajo con Flutter y con Android nativo en Kotlin y Jetpack Compose, aplicando arquitectura por capas, MVVM e inyección de dependencias. En el backend uso Firebase y Supabase: autenticación, base de datos, storage y funciones en la nube, con reglas de seguridad y control de acceso por roles.':
    'On mobile I work with <span class="about-highlight">Flutter</span> and native Android in <span class="about-highlight">Kotlin and Jetpack Compose</span>, applying layered architecture, MVVM and dependency injection. On the backend I use Firebase and Supabase: authentication, database, storage and cloud functions, with security rules and role-based access control.',
  'En web voy desde el modelado de datos con SQL Server y Entity Framework hasta la interfaz en ASP.NET, HTML, CSS y JavaScript. Los sitios de César Brenes Car Service y Pillo Performance House ya están publicados y en uso.':
    'On web I go from data modeling with SQL Server and Entity Framework to the interface in ASP.NET, HTML, CSS and JavaScript. The César Brenes Car Service and Pillo Performance House sites are live and in use.',
  'Ingeniería en Sistemas Computacionales': 'Computer Systems Engineering',
  'Inglés B2': 'English B2',
  'Nivel intermedio alto, técnico y conversacional': 'Upper-intermediate, technical and conversational',
  'Stack principal': 'Core stack',
  'Disponibilidad': 'Availability',
  'Inmediata — en busca de empleo, proyectos freelance y colaboraciones':
    'Immediate — open to employment, freelance work and collaborations',

  /* Skills */
  'Tecnologías': 'Technologies',
  'Mis herramientas de trabajo.': 'The tools I work with.',
  'Desde backend con C# hasta aplicaciones móviles con Flutter, trabajo con el stack completo de desarrollo.':
    'From C# on the backend to mobile apps in Flutter, I work across the full development stack.',
  'Backend Web': 'Web Backend',
  'Móvil': 'Mobile',
  'Bases de Datos': 'Databases',
  'Herramientas & DevOps': 'Tools &amp; DevOps',
  'Redes & Infraestructura': 'Networks &amp; Infrastructure',
  'Migraciones EF': 'EF Migrations',
  'Diseño relacional': 'Relational design',

  /* Proyectos */
  'Lo que he construido.': 'What I have built.',
  'Proyectos realizados por mi. Cada uno resuelve un problema concreto.':
    'Projects I built myself. Each one solves a concrete problem.',
  'App Móvil — SaaS Multi-Negocio': 'Mobile App — Multi-Business SaaS',
  'Landing Page — Negocio Real': 'Landing Page — Real Business',
  'E-commerce — En desarrollo': 'E-commerce — In development',
  'Sitio Web — Negocio Real': 'Website — Real Business',
  'App Android — Proyecto Universitario': 'Android App — University Project',
  'Plataforma SaaS multi-negocio para la gestión integral de talleres automotrices, autolavados, lubricentros y talleres de motos. Con una sola base de código, el dashboard y el flujo de trabajo se adaptan automáticamente al tipo de negocio, ofreciendo a cada rubro una experiencia optimizada sin sacrificar una identidad visual consistente. Incluye órdenes de servicio, clientes y vehículos, inventario, facturación, reportes y gestión de equipo, con control de acceso por roles y multi-tenant sobre Firebase.':
    'Multi-business SaaS platform for the end-to-end management of auto repair shops, car washes, lube centers and motorcycle shops. From a single codebase, the dashboard and workflow adapt automatically to the type of business, giving each one an optimized experience without sacrificing a consistent visual identity. It covers service orders, customers and vehicles, inventory, invoicing, reports and team management, with role-based access control and multi-tenancy on Firebase.',
  'Landing page profesional para negocio de taller mecánico. Diseño moderno, responsivo y optimizado para conversión. Incluye información de servicios, contacto y ubicación del negocio.':
    'Professional landing page for an auto repair business. Modern, responsive design optimized for conversion. Includes services, contact details and the shop location.',
  'Página web para compras en línea con interfaz clara, moderna y responsiva. Incluye catálogo de productos, diseño adaptable para móviles, estilos personalizados y componentes interactivos. Preparado para integración con backend.':
    'Online shopping site with a clear, modern and responsive interface. Includes a product catalog, mobile-friendly layout, custom styling and interactive components. Ready for backend integration.',
  'Sitio web para un negocio de motocicletas especializado en tuning, performance y personalización. Identidad visual oscura construida alrededor de la marca, con secciones de servicios, marcas, galería y reels, y llamado directo a agendar cita.':
    'Website for a motorcycle business specialized in tuning, performance and customization. Dark visual identity built around the brand, with sections for services, brands, gallery and reels, and a direct call to book an appointment.',
  'App Android nativa para reportar y encontrar mascotas perdidas en Costa Rica. Conecta a quien perdió a su mascota con quien la vio en la calle mediante reportes georreferenciados sobre mapa, un motor de coincidencias entre casos perdidos y encontrados, y chat directo entre usuarios. Reemplaza los grupos de Facebook dispersos por un solo lugar donde actuar rápido.':
    'Native Android app to report and find lost pets in Costa Rica. It connects whoever lost a pet with whoever spotted it on the street through geolocated map reports, a matching engine between lost and found cases, and direct chat between users. It replaces scattered Facebook groups with a single place to act fast.',
  'Tablero Kanban de órdenes': 'Kanban board of service orders',
  'Creación de orden de servicio': 'Creating a service order',
  'Repuestos, fotos y costeo': 'Parts, photos and cost breakdown',
  'RBAC multi-tenant': 'Multi-tenant RBAC',
  'Catálogo': 'Catalog',

  /* Experiencia */
  'Trayectoria': 'Background',
  'Educación & experiencia.': 'Education &amp; experience.',
  'Formación técnica en ingeniería, aplicada en proyectos reales.':
    'Engineering education, applied to real projects.',
  '2023 — Presente': '2023 — Present',
  'Formación en desarrollo web, bases de datos, redes y programación orientada a objetos. Proyectos prácticos con ASP.NET, Entity Framework, Flutter y Firebase.':
    'Training in web development, databases, networking and object-oriented programming. Hands-on projects with ASP.NET, Entity Framework, Flutter and Firebase.',

  /* Contacto y pie */
  'Trabajemos juntos.': 'Let us work together.',
  'Estoy en busca de empleo, con disponibilidad inmediata. También tomo proyectos freelance y colaboraciones. Si tienes algo en mente, escríbeme.':
    'I am looking for a job and available immediately. I also take on freelance projects and collaborations. If you have something in mind, drop me a line.',
  'Enviar un correo': 'Send an email',
  'Teléfono': 'Phone',

  /* Visor de imágenes */
  'Haz clic para ver en grande': 'Click to view larger',
  'Rueda del ratón o pellizca para hacer zoom · arrastra para mover · doble clic para alternar · Esc para salir':
    'Scroll or pinch to zoom · drag to pan · double-click to toggle · Esc to exit',
  'Dashboard principal de Autex Manager en el taller': 'Autex Manager main dashboard in the workshop',
  'Landing page de César Brenes Car Service': 'César Brenes Car Service landing page',
  'Tienda en línea La Nueva Avenida': 'La Nueva Avenida online store',
  'Sitio web de Pillo Performance House': 'Pillo Performance House website',
  'PetFinder CR — pantalla principal': 'PetFinder CR — home screen',
};

(function initLanguage() {
  const btn = document.querySelector('[data-lang-toggle]');
  if (!btn) return;

  /* Elementos cuyo texto se traduce. Lo que no esté en I18N queda igual:
     nombres de tecnologías, de proyectos y datos de contacto. */
  const SELECTORS = [
    '.nav-links a', '.mobile-menu a', '.nav-cta', '.hero-badge', '.hero-title',
    '.hero-desc', '.btn', '.hero-stat-label', '.section-label', '.section-title',
    '.section-subtitle', '.about-text p', '.about-info-title', '.about-info-val',
    '.skill-card-title', '.skill-tag', '.project-type', '.project-desc',
    '.project-gallery > li > span', '.project-tag', '.timeline-period',
    '.timeline-role', '.timeline-detail', '.contact-cta-title',
    '.contact-cta-subtitle', '.contact-link-label', '.footer-links a',
    '.lightbox-help', '.zoom-hint',
  ].join(',');

  /* Clave de búsqueda: el <br> no aporta espacio en textContent, así que se
     convierte antes; el elemento temporal decodifica entidades como &amp;. */
  const scratch = document.createElement('div');
  const norm = el => {
    scratch.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, ' ');
    return scratch.textContent.replace(/\s+/g, ' ').trim();
  };
  const nodes = [...document.querySelectorAll(SELECTORS)]
    .filter(el => !el.querySelector('#dynamic-greeting'));
  const original = new Map();
  nodes.forEach(n => original.set(n, n.innerHTML));

  // Las leyendas del visor viven en un atributo, no en el texto
  const captioned = [...document.querySelectorAll('[data-caption]')];
  captioned.forEach(n => { n.dataset.captionEs = n.dataset.caption; });

  function apply(lang) {
    const en = lang === 'en';
    nodes.forEach(n => {
      if (!en) { n.innerHTML = original.get(n); return; }
      const t = I18N[norm(n)];
      if (t) n.innerHTML = t;
    });
    captioned.forEach(n => {
      const es = n.dataset.captionEs;
      n.dataset.caption = en ? (I18N[es] || es) : es;
    });
    document.documentElement.lang = lang;
    document.title = en ? 'Fauricio Quiros — Developer' : 'Fauricio Quiros — Desarrollador';
    btn.textContent = en ? 'ES' : 'EN';
    btn.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  let lang = (() => { try { return localStorage.getItem('lang'); } catch { return null; } })();
  if (!lang) lang = (navigator.language || '').startsWith('es') ? 'es' : 'en';
  apply(lang);

  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('lang', lang); } catch { /* modo privado */ }
    apply(lang);
  });
})();
