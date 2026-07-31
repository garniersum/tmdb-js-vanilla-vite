/**
 * Theme Toggle Component
 * 
 * Componente específico para manejar el toggle de tema claro/oscuro.
 * Esta funcionalidad ya está incluida en navbar.js, pero este componente
 * puede ser usado si necesitas un toggle independiente en otra parte de la UI.
 * 
 * La lógica compartida vive en js/utils/theme.js.
 */

import { bindThemeToggle, getCurrentTheme, setAppTheme } from '../utils/theme.js';

/**
 * Inicializar toggle de tema
 * @param {string} selector - Selector CSS del elemento toggle
 */
export function initThemeToggle(selector = '#themeToggle') {
    bindThemeToggle(selector);
}

export { getCurrentTheme, setAppTheme };
