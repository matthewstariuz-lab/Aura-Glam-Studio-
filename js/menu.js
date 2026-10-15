/* ==========================================
   AURA GLAM STUDIO — menu.js
   Lógica exclusiva de menu.html
========================================== */

/* ── SERVICIOS: navegación y carrusel de resultados ── */
const servicios = [
    {
        titulo: 'Corte y peinado',
        subtitulo: 'Estilo y transformación',
        descripcion: 'Cortes personalizados, cepillado y planchado, peinados para eventos y ondas con acabados profesionales.',
        imagen: 'img/modelo1.png',
        alt: 'Modelo con cabello largo y peinado profesional',
        resultados: [
            { tipo: 'video', archivo: 'MULTIMEDIA/videocabello1.mp4' },
            { tipo: 'video', archivo: 'MULTIMEDIA/corteypeinadovideo1.mp4' },
            { tipo: 'imagen', archivo: 'img/peloantes1.png', alt: 'Antes del corte y peinado', etiqueta: 'ANTES' },
            { tipo: 'imagen', archivo: 'img/pelodespues1.png', alt: 'Después del corte y peinado', etiqueta: 'DESPUÉS' },
            { tipo: 'video', archivo: 'MULTIMEDIA/alisadocorteypeinado1.mp4' },
            { tipo: 'imagen', archivo: 'img/rubiaantes1.png', alt: 'Antes del peinado rubio', etiqueta: 'ANTES' },
            { tipo: 'imagen', archivo: 'img/rubiadespues1.png', alt: 'Después del peinado rubio', etiqueta: 'DESPUÉS' }
        ]
    },
    {
        titulo: 'Tratamientos capilares',
        subtitulo: 'Cuidado y reparación del cabello',
        descripcion: 'Hidratación profunda, nutrición y tratamientos profesionales para recuperar el brillo y la suavidad del cabello.',
        imagen: 'img/recurso2.png',
        alt: 'Cabello brillante con tratamiento capilar',
        resultados: [
            { tipo: 'video', archivo: 'MULTIMEDIA/video2.mp4' },
            { tipo: 'video', archivo: 'MULTIMEDIA/otroviddeoderelleno2.mp4', portada: 'img/tratamientocapilar.png' },
            { tipo: 'video', archivo: 'MULTIMEDIA/videotratamiento2.mp4' },
            { tipo: 'video', archivo: 'MULTIMEDIA/rellenocapilar2.mp4' }
        ]
    },
    {
        titulo: 'Manicure y pedicure',
        subtitulo: 'Belleza y cuidado de manos y pies',
        descripcion: 'Manicure, pedicure y diseños personalizados con atención al detalle y cuidado profesional.',
        imagen: 'img/Portada3.png',
        alt: 'Servicio profesional de manicure y pedicure',
        resultados: [
            { tipo: 'imagen', archivo: 'img/uñas1.png', alt: 'Resultado de manicure y pedicure 1' },
            { tipo: 'imagen', archivo: 'img/uñas2.png', alt: 'Resultado de manicure y pedicure 2' },
            { tipo: 'imagen', archivo: 'img/uñas3.png', alt: 'Resultado de manicure y pedicure 3' },
            { tipo: 'imagen', archivo: 'img/uñas4.png', alt: 'Resultado de manicure y pedicure 4' }
        ]
    },
    {
        titulo: 'Maquillaje y belleza',
        subtitulo: 'Preparación para cada ocasión',
        descripcion: 'Maquillaje para eventos y asesoría de belleza para resaltar tu esencia en cada ocasión.',
        imagen: 'img/maquillajeybellezza.png',
        alt: 'Servicio de maquillaje y belleza',
        resultados: [
            { tipo: 'imagen', archivo: 'img/maquillaje1.png', alt: 'Resultado de maquillaje 1' },
            { tipo: 'imagen', archivo: 'img/maquillaje2.png', alt: 'Resultado de maquillaje 2' },
            { tipo: 'imagen', archivo: 'img/maquillaje3.png', alt: 'Resultado de maquillaje 3' },
            { tipo: 'imagen', archivo: 'img/maquillaje4.png', alt: 'Resultado de maquillaje 4' }
        ]
    }
];

const botonesServicio = document.querySelectorAll('.servicio-nav-item');
const servicioNumero = document.getElementById('servicioNumero');
const servicioIndice = document.getElementById('servicioIndice');
const servicioTitulo = document.getElementById('servicioTitulo');
const servicioSubtitulo = document.getElementById('servicioSubtitulo');
const servicioDescripcion = document.getElementById('servicioDescripcion');
const servicioModelo = document.getElementById('servicioModelo');
const servicioShowcase = document.getElementById('servicios');
const servicioIntro = document.querySelector('.servicio-intro');
const resultadoVisor = document.getElementById('resultadoVisor');
const resultadoTipo = document.getElementById('resultadoTipo');
const resultadoContador = document.getElementById('resultadoContador');
const resultadoAnterior = document.getElementById('resultadoAnterior');
const resultadoSiguiente = document.getElementById('resultadoSiguiente');
let servicioActual = 0;
let resultadoActual = 0;
let temporizadorCambioServicio;

function renderizarResultado() {
    const servicio = servicios[servicioActual];
    const resultado = servicio.resultados[resultadoActual];
    resultadoVisor.replaceChildren();
    resultadoVisor.classList.toggle('resultado-visor--paso', Boolean(resultado.etiqueta));
    resultadoVisor.classList.toggle('resultado-visor--maquillaje', servicioActual === 3 && resultado.tipo === 'imagen');

    if (resultado.tipo === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        if (resultado.portada) video.poster = resultado.portada;
        video.setAttribute('aria-label', `Video de resultados: ${servicio.titulo}`);
        const fuente = document.createElement('source');
        fuente.src = resultado.archivo;
        fuente.type = 'video/mp4';
        video.append(fuente);
        resultadoVisor.append(video);
        const numeroVideo = servicio.resultados
            .slice(0, resultadoActual + 1)
            .filter(item => item.tipo === 'video')
            .length;
        const etiqueta = document.createElement('span');
        etiqueta.className = 'resultado-etiqueta resultado-etiqueta--video';
        etiqueta.textContent = `VIDEO ${numeroVideo}`;
        resultadoVisor.append(etiqueta);
        resultadoTipo.textContent = '';
    } else {
        const imagen = document.createElement('img');
        imagen.src = resultado.archivo;
        imagen.alt = resultado.alt;
        resultadoVisor.append(imagen);
        resultadoTipo.textContent = resultado.etiqueta || 'RESULTADO';

        if (resultado.etiqueta) {
            const etiqueta = document.createElement('span');
            etiqueta.className = 'resultado-etiqueta';
            etiqueta.textContent = resultado.etiqueta;
            resultadoVisor.append(etiqueta);
        }
    }

    resultadoContador.textContent = `${String(resultadoActual + 1).padStart(2, '0')} / ${String(servicio.resultados.length).padStart(2, '0')}`;
}

function seleccionarServicio(indice) {
    const servicio = servicios[indice];
    if (!servicio) return;

    window.clearTimeout(temporizadorCambioServicio);
    servicioActual = indice;
    resultadoActual = 0;
    servicioShowcase.classList.remove('servicio--corte', 'servicio--tratamientos', 'servicio--manicure', 'servicio--maquillaje');
    if (indice === 0) servicioShowcase.classList.add('servicio--corte');
    if (indice === 1) servicioShowcase.classList.add('servicio--tratamientos');
    if (indice === 2) servicioShowcase.classList.add('servicio--manicure');
    if (indice === 3) servicioShowcase.classList.add('servicio--maquillaje');
    servicioIntro.classList.add('cambiando-servicio');

    servicioModelo.classList.add('cambiando');
    const actualizarServicio = () => {
        servicioNumero.textContent = String(indice + 1).padStart(2, '0');
        servicioIndice.textContent = String(indice + 1).padStart(2, '0');
        servicioTitulo.textContent = servicio.titulo;
        servicioSubtitulo.textContent = servicio.subtitulo;
        servicioDescripcion.textContent = servicio.descripcion;
        servicioModelo.src = servicio.imagen;
        servicioModelo.alt = servicio.alt;

        servicioModelo.addEventListener('load', () => {
            servicioModelo.classList.remove('cambiando');
        }, { once: true });
        servicioIntro.classList.remove('cambiando-servicio');
        renderizarResultado();
    };
    temporizadorCambioServicio = window.setTimeout(actualizarServicio, 220);

    botonesServicio.forEach((boton, botonIndice) => {
        const activo = botonIndice === indice;
        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', String(activo));
    });
}

botonesServicio.forEach(boton => {
    boton.addEventListener('click', () => seleccionarServicio(Number(boton.dataset.servicio)));
});

resultadoAnterior.addEventListener('click', () => {
    const total = servicios[servicioActual].resultados.length;
    resultadoActual = (resultadoActual - 1 + total) % total;
    renderizarResultado();
});

resultadoSiguiente.addEventListener('click', () => {
    resultadoActual = (resultadoActual + 1) % servicios[servicioActual].resultados.length;
    renderizarResultado();
});

seleccionarServicio(0);

/* ── PESTAÑAS: mantener separados servicios y productos ── */
const pestañasMenu = [
    { boton: document.getElementById('tabServicios'), panel: document.getElementById('servicios') },
    { boton: document.getElementById('tabProductos'), panel: document.getElementById('productos') }
];
const contenidoMenu = document.querySelector('.menu-contenido');

pestañasMenu.forEach(({ boton }, indice) => {
    boton.addEventListener('click', () => {
        contenidoMenu.classList.toggle('modo-productos', indice === 1);
        pestañasMenu.forEach(({ boton: botonPestana, panel }, indicePestana) => {
            const activo = indicePestana === indice;
            botonPestana.classList.toggle('activo-tab', activo);
            botonPestana.setAttribute('aria-selected', String(activo));
            botonPestana.tabIndex = activo ? 0 : -1;
            panel.hidden = !activo;
        });

        if (indice === 1) {
            resultadoVisor.querySelectorAll('video').forEach(video => video.pause());
        }
    });

    boton.addEventListener('keydown', evento => {
        const siguienteIndice = {
            ArrowRight: (indice + 1) % pestañasMenu.length,
            ArrowLeft: (indice - 1 + pestañasMenu.length) % pestañasMenu.length,
            Home: 0,
            End: pestañasMenu.length - 1
        }[evento.key];

        if (siguienteIndice === undefined) return;
        evento.preventDefault();
        pestañasMenu[siguienteIndice].boton.focus();
        pestañasMenu[siguienteIndice].boton.click();
    });
});

/* ── CARRITO: aparece al llegar a productos ── */
const btnCarrito   = document.getElementById('btnCarrito');
const carritoBadge = document.getElementById('carritoBadge');
const productosCarrito = [];

/* Actualiza número en el badge con animación */
function actualizarCarrito() {
    carritoBadge.textContent = productosCarrito.length;
    carritoBadge.classList.remove('bump');
    void carritoBadge.offsetWidth;
    carritoBadge.classList.add('bump');
}

const seccionProductos = document.getElementById('productos');
const observadorProductos = new IntersectionObserver(([entrada]) => {
    btnCarrito.classList.toggle('visible', entrada.isIntersecting);
}, { threshold: 0.08 });
observadorProductos.observe(seccionProductos);

btnCarrito.addEventListener('click', () => {
    if (productosCarrito.length === 0) {
        window.location.href = 'contacto.html#formulario';
        return;
    }

    const parametros = new URLSearchParams();
    productosCarrito.forEach(nombre => parametros.append('producto', nombre));
    window.location.href = `contacto.html?${parametros.toString()}#formulario`;
});

/* ── BOTONES "AÑADIR AL CARRITO" en cada tarjeta de producto ── */
document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
        const nombre = btn.dataset.producto?.trim();
        if (!nombre) return;

        productosCarrito.push(nombre);
        actualizarCarrito();
        // Feedback visual en el botón: cambia a "¡Agregado!" brevemente
        const textoOriginal = btn.innerHTML;
        btn.classList.add('agregado');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            ¡Agregado!
        `;
        btn.disabled = true;

        setTimeout(() => {
            btn.classList.remove('agregado');
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 1400);
    });
});
