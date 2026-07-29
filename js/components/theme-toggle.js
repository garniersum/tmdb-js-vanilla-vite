/**
 * Theme Toggle Component
 * 
 * Componente específico para manejar el toggle de tema claro/oscuro.
 * Esta funcionalidad ya está incluida en navbar.js, pero este componente
 * puede ser usado si necesitas un toggle independiente en otra parte de la UI.
 */

import { getTheme, setTheme } from '../services/storage.service.js';

/**
 * Inicializar toggle de tema
 * @param {string} selector - Selector CSS del elemento toggle
 * 
 * TODO: Implementar inicialización de toggle de tema
 */
export function initThemeToggle(selector = '#themeToggle') {
    // TODO: Implementar inicialización de toggle de tema
    const toggle = document.querySelector(selector);
    
    if (!toggle) return;
    
    // Aplicar tema guardado
    const savedTheme = getTheme();
    applyTheme(savedTheme, toggle);
    
    // Event listener
    toggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        applyTheme(newTheme, toggle);
    });
}

/**
 * Aplicar tema
 * @param {string} theme - 'dark' o 'light'
 * @param {HTMLElement} toggle - Elemento toggle
 * 
 * TODO: Implementar aplicación de tema
 */
function applyTheme(theme, toggle) {
    // TODO: Implementar aplicación de tema
    document.body.setAttribute('data-theme', theme);
    
    const icon = toggle?.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

/**
 * Obtener tema actual
 * @returns {string} 'dark' o 'light'
 * 
 * TODO: Implementar obtención de tema actual
 */
export function getCurrentTheme() {
    // TODO: Implementar obtención de tema actual
    return getTheme();
}

/**
 * Cambiar tema
 * @param {string} theme - 'dark' o 'light'
 * 
 * TODO: Implementar cambio de tema
 */
export function setAppTheme(theme) {
    // TODO: Implementar cambio de tema
    setTheme(theme);
    document.body.setAttribute('data-theme', theme);
    
    // Actualizar todos los toggles
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
        const icon = toggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    });
}
