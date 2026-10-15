/* ==========================================
   AURA GLAM STUDIO — mision.js
   Lógica exclusiva de mision.html
========================================== */

/* Las tarjetas de misión/visión ya tienen
   animación reveal desde global.js.
   Aquí añadimos un efecto de hover que
   ilumina levemente el ícono al pasar el cursor. */

document.querySelectorAll('.mv-card').forEach(card => {
    const icono = card.querySelector('.mv-icon');
    if (!icono) return;

    card.addEventListener('mouseenter', () => {
        icono.style.transform  = 'scale(1.12) rotate(-4deg)';
        icono.style.transition = 'transform .35s ease';
    });
    card.addEventListener('mouseleave', () => {
        icono.style.transform = 'scale(1) rotate(0deg)';
    });
});
