/**
 * Favorites View
 * 
 * Vista de favoritos del usuario.
 * Muestra todas las películas guardadas como favoritas.
 */

import { getFavorites } from '../services/storage.service.js';
import { renderMovieCards } from '../components/movie-card.js';
import { lazyLoadImages } from '../utils/helpers.js';
import { renderEmptyState } from '../utils/ui-state.js';
/**
 * Inicializar vista de favoritos
 * 
 * TODO: Implementar inicialización de vista de favoritos
 */
export function initFavoritesView() {
    // TODO: Implementar inicialización de vista de favoritos
    
    // Cargar favoritos
    loadFavorites();
}

/**
 * Cargar favoritos
 * 
 * TODO: Implementar carga de favoritos
 */
function loadFavorites() {
    // TODO: Implementar carga de favoritos
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (!favoritesGrid) return;
    
    const favorites = getFavorites();
    
    if (!favorites || favorites.length === 0) {
        showEmptyState();
        return;
    }
    
    renderMovieCards(favorites, favoritesGrid);
    lazyLoadImages();
}

/**
 * Mostrar estado vacío
 * 
 * TODO: Implementar mostrado de estado vacío
 */
function showEmptyState() {
    // TODO: Implementar mostrado de estado vacío
    renderEmptyState(document.getElementById('favoritesGrid'), {
        icon: '❤️',
        title: 'No tienes favoritos aún',
        message: 'Agrega películas a tus favoritos para verlas aquí',
        actionHtml: `
            <button class="btn btn-primary" onclick="window.location.hash='#home'">
                Explorar Películas
            </button>
        `
    });
}

/**
 * Recargar vista de favoritos
 * 
 * TODO: Implementar recarga de favoritos
 * Útil para actualizar después de agregar/remover favoritos
 */
export function reloadFavorites() {
    // TODO: Implementar recarga de favoritos
    loadFavorites();
}
