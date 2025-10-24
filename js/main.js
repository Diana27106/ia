/**
 * Función que maneja la lógica de alternar la visibilidad de un elemento
 * y actualizar el texto de su botón asociado.
 * @param {string} idContenedor - El ID del div de contenido a ocultar/mostrar.
 * @param {HTMLElement} boton - La referencia al elemento botón que fue clickeado.
 */
function alternarVisibilidad(idContenedor, boton) {
    const contenido = document.getElementById(idContenedor);

    // Añadir o quitar la clase 'hidden'
    contenido.classList.toggle('hidden');

    // Actualizar el texto del botón (Feedback)
    if (contenido.classList.contains('hidden')) {
        boton.textContent = 'Mostrar Sección';
    } else {
        boton.textContent = 'Ocultar Sección';
    }
}

/**
 * Inicializa los Event Listeners para los botones de toggle.
 */
function inicializarBotones() {
    const botonVerdades = document.getElementById('verdades-btn');
    const contenidoVerdadesId = 'verdades-list';

    const botonMentiras = document.getElementById('mentiras-btn');
    const contenidoMentirasId = 'mentiras-list';

    botonVerdades.addEventListener('click', () => {
        alternarVisibilidad(contenidoVerdadesId, botonVerdades);
    });

    botonMentiras.addEventListener('click', () => {
        alternarVisibilidad(contenidoMentirasId, botonMentiras);
    });
}

// Exportar funciones para Jest
module.exports = { alternarVisibilidad, inicializarBotones };
