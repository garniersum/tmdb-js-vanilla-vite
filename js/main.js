/**
 * Main Entry Point
 * 
 * Punto de entrada principal de la aplicación.
 * Inicializa todos los componentes y maneja el routing.
 */

import { initRouter, getCurrentRoute } from './services/router.service.js';
import { initNavbar, updateActiveLink } from './components/navbar.js';
import { initSearchBar, initSearchHistory } from './components/search-bar.js';
import { initModal } from './components/modal.js';
import { initHomeView } from './views/home.view.js';
import { initMovieDetailView } from './views/movie-detail.view.js';
import { initSearchView } from './views/search.view.js';
import { initFavoritesView, reloadFavorites } from './views/favorites.view.js';
import { applyTheme, getCurrentTheme } from './utils/theme.js';
import { lazyLoadImages } from './utils/helpers.js';

/**
 * Inicializar la aplicación
 * 
 * TODO: Implementar inicialización de la aplicación
 * Debe:
 * 1. Aplicar el tema guardado
 * 2. Inicializar componentes globales
 * 3. Inicializar el router
 * 4. Cargar la vista inicial
 */
function initApp() {
    // TODO: Implementar inicialización de la aplicación
    
    console.log('🎬 Inicializando TMDB Movie App...');
    
    // Aplicar tema guardado
    applyTheme(getCurrentTheme());
    
    // Inicializar componentes globales
    initNavbar();
    initSearchBar();
    initModal();
    // Inicializar router
    initRouter(handleRouteChange);
    lazyLoadImages();
    console.log('✅ Aplicación inicializada');
}

/**
 * Manejar cambios de ruta
 * @param {object} routeInfo - Información de la ruta { route, params }
 * 
 * TODO: Implementar manejo de cambios de ruta
 * Debe:
 * 1. Ocultar todas las vistas
 * 2. Mostrar la vista correspondiente
 * 3. Actualizar el link activo en el navbar
 * 4. Inicializar la vista específica
 */
function handleRouteChange(routeInfo) {
    // TODO: Implementar manejo de cambios de ruta
    console.log('🔄 Navegando a:', routeInfo);
    
    const { route, params } = routeInfo;
    
    // Ocultar todas las vistas
    hideAllViews();
    
    // Actualizar link activo en navbar
    updateActiveLink(route);
    
    // Mostrar y cargar la vista correspondiente
    switch (route) {
        case 'home':
        case '':
            showView('homeView');
            initHomeView();
            break;
            
        case 'movie':
            showView('movieDetailView');
            const movieId = parseInt(params.id);
            initMovieDetailView(movieId);
            break;
            
        case 'tv':
            // TODO: Implementar vista de series de TV
            console.log('Vista de TV no implementada aún');
            showView('homeView');
            break;
            
        case 'search':
            showView('searchView');
            initSearchView(params);
            break;
            
        case 'favorites':
            showView('favoritesView');
            initFavoritesView();
            break;
            
        default:
            console.warn('Ruta no reconocida:', route);
            showView('homeView');
            initHomeView();
    }
    
    // Scroll al top
    window.scrollTo(0, 0);
}

/**
 * Ocultar todas las vistas
 * 
 * TODO: Implementar ocultamiento de vistas
 */
function hideAllViews() {
    // TODO: Implementar ocultamiento de vistas
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.add('hidden');
    });
}

/**
 * Mostrar una vista específica
 * @param {string} viewId - ID de la vista a mostrar
 * 
 * TODO: Implementar mostrado de vista
 */
function showView(viewId) {
    // TODO: Implementar mostrado de vista
    const view = document.getElementById(viewId);
    
    if (view) {
        view.classList.remove('hidden');
    }
}

/**
 * Mostrar notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en ms (default: 3000)
 * 
 * TODO: Implementar mostrado de notificación toast
 */
export function showToast(message, duration = 3000) {
    // TODO: Implementar mostrado de toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.getElementById('toastClose');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    // Auto ocultar después de duration
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
    
    // Event listener para cerrar manualmente
    toastClose?.addEventListener('click', () => {
        toast.classList.remove('active');
    });
}

/**
 * Inicializar cuando el DOM esté listo
 * 
 * TODO: Implementar inicialización al cargar el DOM
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/**
 * Exportar funciones útiles para uso global
 */
window.tmdbApp = {
    showToast,
    reloadFavorites
};
