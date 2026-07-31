/**
 * DOM Utils
 *
 * Utilidades compartidas para interacciones comunes con el DOM.
 */

/**
 * Observar elementos con IntersectionObserver
 * @param {HTMLElement|HTMLElement[]|NodeList} targets - Elemento(s) a observar
 * @param {Function} onIntersect - Callback (entry, observer)
 * @param {object} options - Opciones del IntersectionObserver
 * @returns {IntersectionObserver|null} Observer creado
 */
export function observeIntersection(targets, onIntersect, options = {}) {
    const elements = targets instanceof Element ? [targets] : Array.from(targets || []);

    if (elements.length === 0) return null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                onIntersect(entry, observer);
            }
        });
    }, options);

    elements.forEach(element => observer.observe(element));

    return observer;
}

/**
 * Marcar un elemento como activo dentro de un grupo, desactivando el resto
 * @param {HTMLElement} activeElement - Elemento a activar
 * @param {HTMLElement[]|NodeList} group - Grupo de elementos
 * @param {string} activeClass - Clase de estado activo
 */
export function setActiveInGroup(activeElement, group, activeClass = 'active') {
    Array.from(group || []).forEach(element => element.classList.remove(activeClass));
    activeElement?.classList.add(activeClass);
}

/**
 * Ejecutar un callback cuando se hace click fuera de los elementos indicados
 * @param {Array<HTMLElement|null>} elements - Elementos considerados "dentro"
 * @param {Function} onOutsideClick - Callback a ejecutar
 */
export function onClickOutside(elements, onOutsideClick) {
    document.addEventListener('click', (e) => {
        const isInside = elements.some(element => element?.contains(e.target));

        if (!isInside) {
            onOutsideClick(e);
        }
    });
}

/**
 * Crear un elemento sentinel invisible para detectar el final de una lista
 * @param {HTMLElement} container - Contenedor donde agregar el sentinel
 * @returns {HTMLElement|null} Elemento sentinel
 */
export function appendScrollSentinel(container) {
    if (!container) return null;

    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.style.height = '50px';
    sentinel.style.visibility = 'hidden';
    container.appendChild(sentinel);

    return sentinel;
}
