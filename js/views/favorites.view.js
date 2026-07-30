/**
 * Favorites View
 * 
 * Vista de favoritos del usuario.
 * Muestra todas las películas guardadas como favoritas.
 */

import { getFavorites, removeFavorite } from '../services/storage.service.js';
import { renderMovieCards } from '../components/movie-card.js';
import { navigateTo } from '../services/router.service.js';
import { lazyLoadImages } from '../utils/helpers.js';
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
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (!favoritesGrid) return;
    
    favoritesGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <h3>No tienes favoritos aún</h3>
            <p>Agrega películas a tus favoritos para verlas aquí</p>
            <button class="btn btn-primary" id="exploreMoviesBtn">
                Explorar Películas
            </button>
        </div>
    `;
    
    favoritesGrid.querySelector('#exploreMoviesBtn')?.addEventListener('click', () => {
        window.location.hash = '#home';
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
