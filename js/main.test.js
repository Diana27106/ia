/**
 * @jest-environment jsdom
 */
const { alternarVisibilidad, inicializarBotones } = require('./main.js');

describe('Funciones de visibilidad y botones', () => {
    beforeEach(() => {
        // Simulamos el DOM
        document.body.innerHTML = `
      <button id="verdades-btn">Mostrar Sección</button>
      <button id="mentiras-btn">Mostrar Sección</button>
      <div id="verdades-list" class="hidden">Verdades</div>
      <div id="mentiras-list" class="hidden">Mentiras</div>
    `;
    });

    test('alternarVisibilidad muestra u oculta el contenido y cambia el texto del botón', () => {
        const boton = document.getElementById('verdades-btn');
        const contenido = document.getElementById('verdades-list');

        // Estado inicial
        expect(contenido.classList.contains('hidden')).toBe(true);
        expect(boton.textContent).toBe('Mostrar Sección');

        // Mostrar contenido
        alternarVisibilidad('verdades-list', boton);
        expect(contenido.classList.contains('hidden')).toBe(false);
        expect(boton.textContent).toBe('Ocultar Sección');

        // Ocultar contenido nuevamente
        alternarVisibilidad('verdades-list', boton);
        expect(contenido.classList.contains('hidden')).toBe(true);
        expect(boton.textContent).toBe('Mostrar Sección');
    });

    test('inicializarBotones añade los event listeners correctamente', () => {
        const botonVerdades = document.getElementById('verdades-btn');
        const contenidoVerdades = document.getElementById('verdades-list');

        inicializarBotones();

        // Simular clic
        botonVerdades.click();

        expect(contenidoVerdades.classList.contains('hidden')).toBe(false);
        expect(botonVerdades.textContent).toBe('Ocultar Sección');
    });
});
