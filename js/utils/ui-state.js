/**
 * UI State
 *
 * Plantillas compartidas para los estados de carga, error y vacío
 * que se muestran dentro de un contenedor.
 */

/**
 * Renderizar estado de carga
 * @param {HTMLElement} container - Contenedor
 * @param {string} message - Mensaje a mostrar
 */
export function renderLoadingState(container, message = 'Cargando...') {
    if (!container) return;

    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Renderizar estado de error
 * @param {HTMLElement} container - Contenedor
 * @param {object} options - { title, message, icon, actionHtml }
 */
export function renderErrorState(container, options = {}) {
    if (!container) return;

    const {
        title = 'Error',
        message = 'Por favor, intenta nuevamente',
        icon = '❌',
        actionHtml = ''
    } = options;

    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${message}</p>
            ${actionHtml}
        </div>
    `;
}

/**
 * Renderizar estado vacío
 * @param {HTMLElement} container - Contenedor
 * @param {object} options - { title, message, icon, actionHtml }
 */
export function renderEmptyState(container, options = {}) {
    if (!container) return;

    const {
        title = 'No hay resultados',
        message = '',
        icon = '🎬',
        actionHtml = ''
    } = options;

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${message}</p>
            ${actionHtml}
        </div>
    `;
}
