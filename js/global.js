/* ==========================================
   AURA GLAM STUDIO — global.js
   Cargado en TODAS las páginas.
   Maneja: navbar scroll, hamburguesa móvil,
   animaciones reveal de scroll.
========================================== */

/* ──────────────────────────────────────────
   1. NAVBAR — fondo sólido al hacer scroll
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLogos = document.querySelectorAll('.nav-logo-img');
const nextHomeSection = document.querySelector('body.pagina-inicio .beauty-essence');

function actualizarEstadoNavbar() {
    const scrolled = nextHomeSection
        ? nextHomeSection.getBoundingClientRect().top <= navbar.offsetHeight
        : window.scrollY > 60;

    navbar.classList.toggle('activo', scrolled);
    navbar.classList.toggle('scrolled', scrolled);

    navLogos.forEach(logo => {
        logo.classList.toggle('logo-negro', scrolled);
    });
}

window.addEventListener('scroll', actualizarEstadoNavbar);
actualizarEstadoNavbar();


/* ──────────────────────────────────────────
   2. HAMBURGUESA — menú móvil
────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

function cerrarMenu() {
    hamburger.classList.remove('abierto');
    navMobile.classList.remove('visible');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const abierto = navMobile.classList.contains('visible');
    if (abierto) {
        cerrarMenu();
    } else {
        hamburger.classList.add('abierto');
        navMobile.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
});

// Cierra al tocar fuera del menú
navMobile.addEventListener('click', (e) => {
    if (e.target === navMobile) cerrarMenu();
});

// Cierra al hacer clic en un link del menú móvil
document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', cerrarMenu);
});


/* ──────────────────────────────────────────
   3. REVEAL — animación al hacer scroll
      Usa IntersectionObserver (eficiente,
      sin escuchar scroll constantemente)
────────────────────────────────────────── */
const elementosReveal = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .scroll-reveal'
);

const observerReveal = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('scroll-reveal')) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.add('show');
                }
                observerReveal.unobserve(entry.target); // solo una vez
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

elementosReveal.forEach(el => observerReveal.observe(el));
