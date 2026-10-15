/* ==========================================
   AURA GLAM STUDIO — inicio.js
   Intro del logo + parallax del hero
========================================== */

/* ── INTRO: deformación de entrada y salida ── */
(function iniciarIntroLogo() {
    const overlay = document.getElementById('logoIntro');
    const marco = document.getElementById('logoIntroMarco');
    const navImg = document.getElementById('navLogoImg');
    const deformMap = document.getElementById('logoDeformMap');

    if (!overlay || !marco || !navImg) return;

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento) {
        overlay.remove();
        document.body.classList.remove('intro-activa');
        document.body.classList.add('intro-lista');
        return;
    }

    function animarDeformacion(intensidad, duracion) {
        if (!deformMap) return Promise.resolve();
        return new Promise((resolve) => {
            const inicio = performance.now();
            function cuadro(ahora) {
                const t = Math.min((ahora - inicio) / duracion, 1);
                const onda = Math.sin(t * Math.PI);
                deformMap.setAttribute('scale', String(intensidad * onda));
                if (t < 1) {
                    requestAnimationFrame(cuadro);
                } else {
                    deformMap.setAttribute('scale', '0');
                    resolve();
                }
            }
            requestAnimationFrame(cuadro);
        });
    }

    function destinoNavbar() {
        const splash = marco.getBoundingClientRect();
        const destino = navImg.getBoundingClientRect();
        const dx = (destino.left + destino.width / 2) - (splash.left + splash.width / 2);
        const dy = (destino.top + destino.height / 2) - (splash.top + splash.height / 2);
        const escala = destino.width / splash.width;
        marco.style.setProperty('--dx', `${dx}px`);
        marco.style.setProperty('--dy', `${dy}px`);
        marco.style.setProperty('--scale-end', String(escala));
    }

    function terminarIntro() {
        overlay.classList.add('terminado');
        document.body.classList.remove('intro-activa');
        document.body.classList.add('intro-lista');
        window.setTimeout(() => overlay.remove(), 420);
    }

    overlay.classList.add('entrando');

    function iniciarSalida() {
        destinoNavbar();
        overlay.classList.remove('entrando');
        overlay.classList.add('saliendo');
    }

    marco.addEventListener('animationend', function alTerminarEntrada(e) {
        if (e.animationName !== 'logoEntrar') return;
        marco.removeEventListener('animationend', alTerminarEntrada);
        iniciarSalida();
    });

    marco.addEventListener('animationend', function alTerminarSalida(e) {
        if (e.animationName !== 'logoSalir') return;
        marco.removeEventListener('animationend', alTerminarSalida);
        terminarIntro();
    });
})();

/* Animación sutil del círculo decorativo
   ya está controlada por CSS (@keyframes girar).
   Sin parallax en el hero: la imagen permanece fija al mover el mouse. */


/* ── TARJETAS DE CATEGORÍA → redirige a contacto con categoría ── */
document.querySelectorAll('.aura-card[data-categoria]').forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
        const categoria = card.dataset.categoria;
        // Guarda la categoría en sessionStorage y navega a contacto.html
        sessionStorage.setItem('categoriaSeleccionada', categoria);
        window.location.href = 'contacto.html#formulario';
    });

    // También funciona con teclado (Enter)
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') card.click();
    });
});

/* ── MARCO DE PARTÍCULAS INTERACTIVO EN EXPERIENCIAS ── */
(function iniciarMarcoParticulasResenas() {
    const canvas = document.querySelector('.reviews-particle-frame');
    const seccion = canvas?.closest('.reviews-section');
    const contexto = canvas?.getContext('2d');
    if (!canvas || !seccion || !contexto) return;

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cantidad = 2600;
    const tonosDorado = [
        '230, 170, 0',
        '255, 196, 0',
        '255, 214, 0',
        '255, 232, 20'
    ];
    const particulas = Array.from({ length: cantidad }, () => {
        let x;
        let y;

        if (Math.random() < 0.44) {
            const derecha = Math.random() < 0.5;
            const abajo = Math.random() < 0.5;
            x = derecha ? 0.88 + Math.random() * 0.12 : Math.random() * 0.12;
            y = abajo ? 0.86 + Math.random() * 0.14 : Math.random() * 0.14;
        } else {
            const borde = Math.floor(Math.random() * 4);
            if (borde < 2) {
                x = Math.random();
                y = borde === 0 ? Math.random() * 0.1 : 0.9 + Math.random() * 0.1;
            } else {
                x = borde === 2 ? Math.random() * 0.09 : 0.91 + Math.random() * 0.09;
                y = Math.random();
            }
        }

        return {
            x,
            y,
            fase: Math.random() * Math.PI * 2,
            tamano: 1.8 + Math.random() * 2.2,
            tono: tonosDorado[Math.floor(Math.random() * tonosDorado.length)],
            profundidad: 0.62 + Math.random() * 0.38,
            destello: Math.random() < 0.08
        };
    });
    const puntero = { x: -1000, y: -1000, activo: false };
    const atraccion = { x: 0, y: 0 };
    const limites = { ancho: 0, alto: 0, escala: 1 };
    let visible = false;
    let solicitud = 0;
    let inicio = 0;

    function redimensionar() {
        const caja = seccion.getBoundingClientRect();
        limites.ancho = caja.width;
        limites.alto = caja.height;
        limites.escala = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(limites.ancho * limites.escala);
        canvas.height = Math.round(limites.alto * limites.escala);
        contexto.setTransform(limites.escala, 0, 0, limites.escala, 0, 0);
        if (reducirMovimiento) dibujar(performance.now(), false);
    }

    function dibujar(ahora, animado) {
        const { ancho, alto } = limites;
        if (!ancho || !alto) return;
        contexto.clearRect(0, 0, ancho, alto);

        const tiempo = animado ? (ahora - inicio) * 0.00065 : 0;
        const mouseX = puntero.activo ? puntero.x : -1000;
        const mouseY = puntero.activo ? puntero.y : -1000;
        const radioInteraccion = 115;

        atraccion.x += ((puntero.activo ? (mouseX / ancho - 0.5) * 25 : 0) - atraccion.x) * 0.035;
        atraccion.y += ((puntero.activo ? (mouseY / alto - 0.5) * 20 : 0) - atraccion.y) * 0.035;

        for (const particula of particulas) {
            let x = particula.x * ancho
                + Math.sin(tiempo + particula.fase) * 11
                + atraccion.x * particula.profundidad;
            let y = particula.y * alto
                + Math.cos(tiempo * 0.95 + particula.fase) * 11
                + atraccion.y * particula.profundidad;

            const dx = x - mouseX;
            const dy = y - mouseY;
            const distancia = Math.hypot(dx, dy);
            if (puntero.activo && distancia > 0 && distancia < radioInteraccion) {
                const fuerza = (1 - distancia / radioInteraccion) * 26;
                x += (dx / distancia) * fuerza;
                y += (dy / distancia) * fuerza;
            }

            const parpadeo = animado
                ? 0.9 + (Math.sin(ahora * 0.002 + particula.fase) + 1) * 0.05
                : 1;
            const radioProfundidad = 0.9 + particula.profundidad * 0.35;
            const radio = particula.tamano * radioProfundidad * (particula.destello ? 1.5 : 1);
            const opacidad = parpadeo * particula.profundidad;
            contexto.fillStyle = `rgba(${particula.tono}, ${opacidad})`;
            contexto.shadowColor = `rgba(196, 132, 0, ${particula.destello ? 1 : 0.8})`;
            contexto.shadowBlur = particula.destello ? (animado ? 11 : 7) : 4;
            contexto.beginPath();
            contexto.arc(x, y, radio, 0, Math.PI * 2);
            contexto.fill();
            contexto.shadowBlur = 0;
            contexto.strokeStyle = `rgba(125, 76, 0, ${Math.min(opacidad + 0.18, 1)})`;
            contexto.lineWidth = Math.max(0.7, radio * 0.38);
            contexto.stroke();
        }
        contexto.shadowBlur = 0;
    }

    function animar(ahora) {
        if (!visible || document.hidden || reducirMovimiento) {
            solicitud = 0;
            return;
        }
        if (!inicio) inicio = ahora;
        dibujar(ahora, true);
        solicitud = window.requestAnimationFrame(animar);
    }

    function actualizarAnimacion() {
        if (visible && !document.hidden && !reducirMovimiento && !solicitud) {
            solicitud = window.requestAnimationFrame(animar);
        } else if ((!visible || document.hidden || reducirMovimiento) && solicitud) {
            window.cancelAnimationFrame(solicitud);
            solicitud = 0;
            if (reducirMovimiento) dibujar(performance.now(), false);
        }
    }

    const observador = new IntersectionObserver(([entrada]) => {
        visible = entrada.isIntersecting;
        actualizarAnimacion();
        if (visible && reducirMovimiento) dibujar(performance.now(), false);
    }, { threshold: 0 });

    observador.observe(seccion);
    seccion.addEventListener('pointermove', (evento) => {
        const caja = seccion.getBoundingClientRect();
        puntero.x = evento.clientX - caja.left;
        puntero.y = evento.clientY - caja.top;
        puntero.activo = true;
        actualizarAnimacion();
    }, { passive: true });
    seccion.addEventListener('pointerleave', () => {
        puntero.activo = false;
    }, { passive: true });
    document.addEventListener('visibilitychange', actualizarAnimacion);
    window.addEventListener('resize', redimensionar, { passive: true });

    if ('ResizeObserver' in window) {
        new ResizeObserver(redimensionar).observe(seccion);
    }
    redimensionar();
})();

/* ── CARRUSEL DE TESTIMONIOS ── */
(function iniciarCarruselTestimonios() {
    const seccion = document.querySelector('.reviews-section');
    const tarjetas = Array.from(document.querySelectorAll('.testimonial-card'));
    const botonAnterior = document.querySelector('[data-review-prev]');
    const botonSiguiente = document.querySelector('[data-review-next]');
    const indicador = document.querySelector('.reviews-page');
    if (!seccion || tarjetas.length !== 3 || !botonAnterior || !botonSiguiente || !indicador) return;

    const grupos = [
        [
            {
                name: 'Mariana L.',
                text: 'Transformó mi piel por completo. Después de años probando todo, por fin siento mi rostro luminoso y calmado.',
                tag: 'Rutina Glow Natural • 3 meses',
                stars: 5
            },
            {
                name: 'Sofía R.',
                text: 'El servicio es excepcional y los resultados son reales. Mi confianza volvió desde la primera semana.',
                tag: 'Tratamiento Reparador • 6 meses',
                stars: 5
            },
            {
                name: 'Valentina P.',
                text: 'Productos naturales, atención personalizada y resultados que se notan. Lo recomiendo sin dudar.',
                tag: 'Kit Hidratación Diaria • 1 año',
                stars: 5
            }
        ],
        [
            {
                name: 'Carlos M.',
                genero: 'hombre',
                text: 'Yo no creía en rutinas de skincare hasta que probé el kit para piel grasa. Me quitó el brillo excesivo sin resecar.',
                tag: 'Kit Control Graso Hombre • 2 meses',
                stars: 5
            },
            {
                name: 'Daniela G.',
                genero: 'mujer',
                text: 'La entrega en Cali llegó el mismo día y venía con una notita escrita a mano. Esos detalles enamoran.',
                tag: 'Serum Vitamina C • 1 mes',
                stars: 5
            },
            {
                name: 'Felipe A.',
                genero: 'hombre',
                text: 'Trabajo en moto todo el día y mi piel sufría mucho. Con el protector y la crema reparadora volví a tener la piel sana.',
                tag: 'Dúo Protección • 4 meses',
                stars: 5
            }
        ],
        [
            {
                name: 'Andrés J.',
                genero: 'hombre',
                text: 'Mi esposa me regaló el kit y ahora soy yo el que no puede vivir sin él. La textura es ligera, no es pegajosa como otras marcas.',
                tag: 'Kit Básico Hombre • 5 meses',
                stars: 5
            },
            {
                name: 'Laura C.',
                genero: 'mujer',
                text: 'Tengo rosácea y todo me irritaba. Esta es la única marca que me calmó el enrojecimiento de verdad.',
                tag: 'Rutina Piel Sensible • 7 meses',
                stars: 5
            },
            {
                name: 'Jorge L.',
                genero: 'hombre',
                text: 'Compro para mi barbería. Mis clientes notan el cambio cuando les aplico los productos después del afeitado.',
                tag: 'Cliente Mayorista • 1 año',
                stars: 5
            }
        ]
    ];
    let pagina = 0;

    function mostrarGrupo() {
        grupos[pagina].forEach((resena, indice) => {
            const tarjeta = tarjetas[indice];
            tarjeta.querySelector('.testimonial-stars').textContent = '★'.repeat(resena.stars);
            tarjeta.querySelector('.testimonial-stars').setAttribute('aria-label', `${resena.stars} de 5 estrellas`);
            tarjeta.querySelector('.testimonial-quote').textContent = resena.text;
            tarjeta.querySelector('.testimonial-name').textContent = resena.name;
            tarjeta.querySelector('.testimonial-tag').textContent = resena.tag;
            tarjeta.dataset.genero = resena.genero || '';
            tarjeta.classList.remove('is-entering');
        });

        indicador.textContent = `${String(pagina + 1).padStart(2, '0')} / ${String(grupos.length).padStart(2, '0')}`;
        requestAnimationFrame(() => {
            tarjetas.forEach((tarjeta) => tarjeta.classList.add('is-entering'));
        });
    }

    botonAnterior.addEventListener('click', () => {
        pagina = (pagina - 1 + grupos.length) % grupos.length;
        mostrarGrupo();
    });
    botonSiguiente.addEventListener('click', () => {
        pagina = (pagina + 1) % grupos.length;
        mostrarGrupo();
    });

    mostrarGrupo();
})();

/* ── EFECTO 3D INTERACTIVO EN LAS ESTADÍSTICAS ── */
(function iniciarEstadisticas3D() {
    const tarjetas = document.querySelectorAll('.reviews-trust-stats .stat-item');
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!tarjetas.length || reducirMovimiento) return;

    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener('pointermove', (evento) => {
            if (evento.pointerType === 'touch') return;

            const limites = tarjeta.getBoundingClientRect();
            const posicionX = (evento.clientX - limites.left) / limites.width * 2 - 1;
            const posicionY = (evento.clientY - limites.top) / limites.height * 2 - 1;
            const rotacionX = -posicionY * 12;
            const rotacionY = posicionX * 12;

            tarjeta.style.setProperty('--rotate-x', `${rotacionX.toFixed(2)}deg`);
            tarjeta.style.setProperty('--rotate-y', `${rotacionY.toFixed(2)}deg`);
            tarjeta.style.setProperty('--shadow-x', `${(posicionX * 10).toFixed(2)}px`);
            tarjeta.style.setProperty('--shadow-y', `${(posicionY * 8).toFixed(2)}px`);
        }, { passive: true });

        tarjeta.addEventListener('pointerleave', () => {
            tarjeta.style.setProperty('--rotate-x', '0deg');
            tarjeta.style.setProperty('--rotate-y', '0deg');
            tarjeta.style.setProperty('--shadow-x', '0px');
            tarjeta.style.setProperty('--shadow-y', '0px');
        }, { passive: true });
    });
})();
