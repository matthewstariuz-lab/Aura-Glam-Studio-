/* ==========================================
   AURA GLAM STUDIO — nosotros.js
   Lógica exclusiva de nosotros.html
========================================== */

/* Contador animado del badge "Est. 2024"
   Al hacer scroll y llegar a la sección,
   el badge hace un pequeño rebote. */

const badge = document.querySelector('.img-badge');

if (badge) {
    const observerBadge = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    badge.style.animation = 'badgeEntrar .6s cubic-bezier(.34,1.56,.64,1) both';
                    observerBadge.unobserve(badge);
                }
            });
        },
        { threshold: 0.5 }
    );
    observerBadge.observe(badge);
}

/* Inyectamos el keyframe del badge en el head
   para no tener que tocarlo desde CSS global */
const style = document.createElement('style');
style.textContent = `
@keyframes badgeEntrar {
    from { opacity: 0; transform: scale(.6) rotate(-8deg); }
    to   { opacity: 1; transform: scale(1)  rotate(0deg);  }
}`;
document.head.appendChild(style);
