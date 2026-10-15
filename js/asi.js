/* ==========================================
   AURA GLAM STUDIO — asi.js
   Lógica exclusiva de asi.html (Nosotros)
   Fusión de: nosotros.js + mision.js
========================================== */

/* ── BADGE "Est. 2024" — animación de entrada ── */
const badge = document.querySelector('.img-badge');

if (badge) {
    const observerBadge = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    badge.style.animation =
                        'badgeEntrar .6s cubic-bezier(.34,1.56,.64,1) both';
                    observerBadge.unobserve(badge);
                }
            });
        },
        { threshold: 0.5 }
    );
    observerBadge.observe(badge);
}

/* Keyframe del badge inyectado dinámicamente */
const styleBadge = document.createElement('style');
styleBadge.textContent = `
@keyframes badgeEntrar {
    from { opacity: 0; transform: scale(.6) rotate(-8deg); }
    to   { opacity: 1; transform: scale(1)  rotate(0deg);  }
}`;
document.head.appendChild(styleBadge);


/* ── ÍCONOS DE MISIÓN Y VISIÓN — hover animado ── */
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


/* ── ÍCONOS DE VALORES — hover animado ── */
document.querySelectorAll('.valor-card').forEach(card => {
    const num = card.querySelector('.valor-num');
    if (!num) return;

    card.addEventListener('mouseenter', () => {
        num.style.transform  = 'scale(1.1) rotate(-3deg)';
        num.style.transition = 'transform .35s ease';
    });
    card.addEventListener('mouseleave', () => {
        num.style.transform = 'scale(1) rotate(0deg)';
    });
});

/* ── REPRODUCTOR DEL JINGLE ── */
document.querySelectorAll('.corporate-jingle-card').forEach(card => {
    const audio = card.querySelector('audio');
    const playButton = card.querySelector('.play-toggle');
    const volumeButton = card.querySelector('.volume-btn');
    const timecode = card.querySelector('.timecode');
    const progressBar = card.querySelector('.progress-bar');
    const progressFill = card.querySelector('.progress-bar span');
    const songName = card.querySelector('.jingle-name');

    if (!audio || !playButton || !volumeButton || !timecode || !progressBar || !progressFill) return;

    const formatoTiempo = (segundos) => {
        if (!Number.isFinite(segundos)) return '0:00';
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = Math.floor(segundos % 60).toString().padStart(2, '0');
        return `${minutos}:${segundosRestantes}`;
    };

    const actualizarTiempo = () => {
        const progreso = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        progressFill.style.width = `${progreso}%`;
        timecode.textContent = `${formatoTiempo(audio.currentTime)} / ${formatoTiempo(audio.duration)}`;
    };

    audio.addEventListener('loadedmetadata', actualizarTiempo);
    audio.addEventListener('timeupdate', actualizarTiempo);
    audio.addEventListener('play', () => {
        playButton.textContent = '❚❚';
        playButton.setAttribute('aria-label', 'Pausar jingle');
        if (songName) songName.textContent = 'Aura Song Jingle';
    });
    audio.addEventListener('pause', () => {
        playButton.textContent = '▶';
        playButton.setAttribute('aria-label', 'Reproducir jingle');
    });
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        actualizarTiempo();
    });

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => {
                playButton.setAttribute('aria-label', 'No se pudo reproducir el jingle');
            });
        } else {
            audio.pause();
        }
    });

    progressBar.addEventListener('click', (event) => {
        if (!audio.duration) return;
        const area = progressBar.getBoundingClientRect();
        const porcentaje = Math.min(Math.max((event.clientX - area.left) / area.width, 0), 1);
        audio.currentTime = porcentaje * audio.duration;
    });

    volumeButton.addEventListener('click', () => {
        audio.muted = !audio.muted;
        volumeButton.textContent = audio.muted ? '◌' : '◉';
        volumeButton.setAttribute('aria-label', audio.muted ? 'Activar volumen' : 'Silenciar jingle');
    });

    actualizarTiempo();
});
