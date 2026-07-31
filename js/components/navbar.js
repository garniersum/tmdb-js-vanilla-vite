/**
 * Navbar Component
 * 
 * Maneja la funcionalidad del navbar incluyendo navegación,
 * toggle de menú móvil y toggle de tema.
 */

import { navigateTo } from '../services/router.service.js';
import { bindThemeToggle } from '../utils/theme.js';
import { onClickOutside } from '../utils/dom.js';

/**
 * Inicializar el navbar
 * 
 * TODO: Implementar inicialización del navbar
 * Debe:
 * 1. Registrar event listeners para los links de navegación
 * 2. Inicializar el toggle de tema
 * 3. Inicializar el menú móvil
 * 4. Aplicar el tema guardado
 */
export function initNavbar() {
    // TODO: Implementar inicialización del navbar
    
    // Event listeners para navegación
    initNavigation();
    
    // Aplicar tema guardado y registrar el toggle de tema
    bindThemeToggle('#themeToggle');
    
    // Event listener para menú móvil
    initMobileMenu();
    
    // Event listener para toggle de búsqueda
    initSearchToggle();
}

/**
 * Inicializar navegación
 * 
 * TODO: Implementar navegación por links
 * Los links con data-link deben navegar sin recargar la página
 */
function initNavigation() {
    // TODO: Implementar navegación
    const navLinks = document.querySelectorAll('[data-link]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const route = href.slice(1); // Remover el #
            navigateTo(route);
        });
    });
}

/**
 * Inicializar menú móvil
 * 
 * TODO: Implementar menú hamburguesa para móvil
 */
function initMobileMenu() {
    // TODO: Implementar menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (!menuToggle || !navbarMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un link
    const navLinks = navbarMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer click fuera
    onClickOutside([navbarMenu, menuToggle], () => {
        navbarMenu.classList.remove('active');
    });
}

/**
 * Inicializar toggle de búsqueda
 * 
 * TODO: Implementar toggle de barra de búsqueda
 */
function initSearchToggle() {
    // TODO: Implementar toggle de búsqueda
    const searchToggle = document.getElementById('searchToggle');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchToggle || !searchBarContainer) return;
    
    searchToggle.addEventListener('click', () => {
        searchBarContainer.classList.toggle('active');
        
        if (searchBarContainer.classList.contains('active')) {
            searchInput?.focus();
        }
    });
}

/**
 * Actualizar link activo
 * @param {string} route - Ruta actual
 * 
 * TODO: Implementar actualización de link activo
 */
export function updateActiveLink(route) {
    // TODO: Implementar actualización de link activo
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        const linkRoute = href.slice(1);
        
        if (linkRoute === route || (route === '' && linkRoute === 'home')) {
            link.classList.add('active');
        }
    });
}
