/**
 * Theme
 *
 * Lógica compartida de tema claro/oscuro usada por el navbar,
 * el toggle independiente y el entry point.
 */

import { getTheme, setTheme } from '../services/storage.service.js';

const THEME_ICONS = {
    dark: '🌙',
    light: '☀️'
};

/**
 * Obtener tema actual
 * @returns {string} 'dark' o 'light'
 */
export function getCurrentTheme() {
    return getTheme();
}

/**
 * Aplicar tema al documento y actualizar los iconos de los toggles
 * @param {string} theme - 'dark' o 'light'
 */
export function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);

    document.querySelectorAll('.theme-icon').forEach(icon => {
        icon.textContent = THEME_ICONS[theme] ?? THEME_ICONS.dark;
    });
}

/**
 * Guardar y aplicar un tema
 * @param {string} theme - 'dark' o 'light'
 */
export function setAppTheme(theme) {
    setTheme(theme);
    applyTheme(theme);
}

/**
 * Alternar entre tema claro y oscuro
 * @returns {string} Nuevo tema aplicado
 */
export function toggleTheme() {
    const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
    setAppTheme(newTheme);

    return newTheme;
}

/**
 * Registrar un elemento como toggle de tema y aplicar el tema guardado
 * @param {HTMLElement|string} target - Elemento o selector del toggle
 */
export function bindThemeToggle(target = '#themeToggle') {
    const toggle = typeof target === 'string' ? document.querySelector(target) : target;

    applyTheme(getTheme());

    if (!toggle) return;

    toggle.addEventListener('click', () => toggleTheme());
}
