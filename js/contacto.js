/* ==========================================
   AURA GLAM STUDIO — contacto.js
   Lógica exclusiva de contacto.html
========================================== */

/* Efecto de hover: el ícono de cada card
   sube levemente al pasar el cursor */

document.querySelectorAll('.contacto-card').forEach(card => {
    const icono = card.querySelector('.contacto-icono');
    if (!icono) return;

    card.addEventListener('mouseenter', () => {
        icono.style.transform  = 'translateY(-6px) scale(1.08)';
        icono.style.transition = 'transform .35s ease';
    });
    card.addEventListener('mouseleave', () => {
        icono.style.transform = 'translateY(0) scale(1)';
    });
});


/* ── BOTÓN ENVIAR MENSAJE ── */
const formContacto = document.getElementById('formulario');
const btnEnviar    = document.getElementById('btnEnviar');

if (formContacto && btnEnviar) {
    formContacto.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que recargue la página

        // Cambia el botón a estado "enviado"
        btnEnviar.textContent = '✔ Mensaje enviado';
        btnEnviar.disabled = true;
        btnEnviar.style.background   = '#1F3A05';
        btnEnviar.style.color        = 'white';
        btnEnviar.style.cursor       = 'default';
        btnEnviar.style.letterSpacing = '2px';

        // Después de 4 segundos vuelve al estado original
        setTimeout(() => {
            btnEnviar.textContent    = 'ENVIAR MENSAJE';
            btnEnviar.disabled       = false;
            btnEnviar.style.background   = '';
            btnEnviar.style.color        = '';
            btnEnviar.style.cursor       = '';
            btnEnviar.style.letterSpacing = '';
            formContacto.reset();
        }, 4000);
    });
}


/* ── MOSTRAR CATEGORÍA SELECCIONADA desde la página de inicio ── */

// Array que almacena las categorías seleccionadas
let categoriasActivas = [];

function renderPills() {
    const pills          = document.getElementById('categoriaPills');
    const inputCategoria = document.getElementById('categoria');
    const campoCategoria = document.getElementById('campoCategoria');
    if (!pills) return;

    pills.innerHTML = '';

    categoriasActivas.forEach((cat, i) => {
        const pill = document.createElement('span');
        pill.className = 'categoria-pill';
        pill.innerHTML = `
            ${cat}
            <button type="button" class="categoria-pill-x" aria-label="Eliminar ${cat}">✕</button>
        `;

        // Botón X elimina esta categoría
        pill.querySelector('.categoria-pill-x').addEventListener('click', () => {
            categoriasActivas.splice(i, 1);
            renderPills();
        });

        pills.appendChild(pill);
    });

    // Actualiza el input hidden con todas las categorías separadas por coma
    if (inputCategoria) inputCategoria.value = categoriasActivas.join(', ');

    // Muestra u oculta el campo completo
    if (campoCategoria) {
        campoCategoria.style.display = categoriasActivas.length > 0 ? '' : 'none';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const categoria      = sessionStorage.getItem('categoriaSeleccionada');
    const anteriores     = sessionStorage.getItem('categoriasAnteriores');
    const campoCategoria = document.getElementById('campoCategoria');
    const nombresProductoValidos = new Set([
        'Sérum capilar',
        'Shampoo profesional',
        'Aceite capilar',
        'Crema facial'
    ]);
    const productosSeleccionados = new URLSearchParams(window.location.search)
        .getAll('producto')
        .filter(nombre => nombresProductoValidos.has(nombre));
    const campoProductos = document.getElementById('productosSeleccionados');
    const listaProductos = document.getElementById('listaProductosSeleccionados');
    const inputProductos = document.getElementById('productosReserva');

    if (productosSeleccionados.length > 0 && campoProductos && listaProductos && inputProductos) {
        const cantidades = new Map();
        productosSeleccionados.forEach(nombre => {
            cantidades.set(nombre, (cantidades.get(nombre) || 0) + 1);
        });

        cantidades.forEach((cantidad, nombre) => {
            const item = document.createElement('li');
            item.textContent = cantidad > 1 ? `${nombre} × ${cantidad}` : nombre;
            listaProductos.appendChild(item);
        });

        inputProductos.value = [...cantidades.entries()]
            .map(([nombre, cantidad]) => cantidad > 1 ? `${nombre} × ${cantidad}` : nombre)
            .join(', ');
        campoProductos.hidden = false;
    }

    // Restaura las categorías anteriores si las había
    if (anteriores) {
        categoriasActivas = JSON.parse(anteriores);
        sessionStorage.removeItem('categoriasAnteriores');
    }

    // Agrega la nueva categoría seleccionada (si no está ya)
    if (categoria) {
        if (!categoriasActivas.includes(categoria)) {
            categoriasActivas.push(categoria);
        }
        sessionStorage.removeItem('categoriaSeleccionada');
    }

    // Si hay categorías, muestra el campo y renderiza
    if (categoriasActivas.length > 0 && campoCategoria) {
        renderPills();

        // Scroll suave al formulario
        setTimeout(() => {
            const formulario = document.getElementById('formulario');
            if (formulario) formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    }

    // Cuando el usuario presiona "+", guarda las categorías actuales antes de navegar
    const btnAgregar = document.getElementById('btnAgregarCategoria');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('categoriasAnteriores', JSON.stringify(categoriasActivas));
            window.location.href = 'index.html#aura-moment';
        });
    }
});
