/**
 * Storage Service
 * 
 * Este servicio maneja todas las operaciones de LocalStorage
 * para persistir datos como favoritos, historial de búsqueda y tema.
 */

const STORAGE_KEYS = {
    FAVORITES: 'tmdb_favorites',
    SEARCH_HISTORY: 'tmdb_search_history',
    THEME: 'tmdb_theme'
};

/**
 * Obtener favoritos del LocalStorage
 * @returns {Array} Lista de IDs de películas favoritas
 * 
 * TODO: Implementar obtención de favoritos desde LocalStorage
 * Pista: Usa JSON.parse() para convertir el string a array
 */
export function getFavorites() {
    // TODO: Implementar obtención de favoritos
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Agregar película a favoritos
 * @param {number} movieId - ID de la película
 * @param {object} movieData - Datos completos de la película (opcional)
 * 
 * TODO: Implementar agregado de favoritos
 * Debe verificar si ya existe antes de agregar
 */
export function addFavorite(movieId, movieData = null) {
    // TODO: Implementar agregado de favoritos
    const favorites = getFavorites();
    
    // Verificar si ya existe
    if (favorites.some(fav => fav.id === movieId)) {
        return false; // Ya existe
    }
    
    // Agregar nuevo favorito
    if (movieData) {
        favorites.push(movieData);
    } else {
        favorites.push({ id: movieId });
    }
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
}

/**
 * Remover película de favoritos
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar remoción de favoritos
 */
export function removeFavorite(movieId) {
    // TODO: Implementar remoción de favoritos
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
}

/**
 * Verificar si una película es favorita
 * @param {number} movieId - ID de la película
 * @returns {boolean} True si es favorita
 * 
 * TODO: Implementar verificación de favorito
 */
export function isFavorite(movieId) {
    // TODO: Implementar verificación de favorito
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === movieId);
}

/**
 * Toggle favorito (agregar si no existe, remover si existe)
 * @param {number} movieId - ID de la película
 * @param {object} movieData - Datos completos de la película (opcional)
 * @returns {boolean} True si se agregó, false si se removió
 * 
 * TODO: Implementar toggle de favorito
 */
export function toggleFavorite(movieId, movieData = null) {
    // TODO: Implementar toggle de favorito
    if (isFavorite(movieId)) {
        removeFavorite(movieId);
        return false;
    } else {
        addFavorite(movieId, movieData);
        return true;
    }
}

/**
 * Obtener historial de búsqueda
 * @returns {Array} Lista de términos de búsqueda
 * 
 * TODO: Implementar obtención de historial
 */
export function getSearchHistory() {
    // TODO: Implementar obtención de historial
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Agregar término al historial de búsqueda
 * @param {string} query - Término de búsqueda
 * 
 * TODO: Implementar agregado al historial
 * Debe mantener solo los últimos 10 términos
 * Debe evitar duplicados
 */
export function addToSearchHistory(query) {
    // TODO: Implementar agregado al historial
    const history = getSearchHistory();
    
    // Remover si ya existe (para moverlo al principio)
    const filtered = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Agregar al principio
    filtered.unshift(query);
    
    // Mantener solo los últimos 10
    const trimmed = filtered.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(trimmed));
}

/**
 * Limpiar historial de búsqueda
 * 
 * TODO: Implementar limpieza del historial
 */
export function clearSearchHistory() {
    // TODO: Implementar limpieza del historial
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
}

/**
 * Obtener tema guardado
 * @returns {string} 'dark' o 'light'
 * 
 * TODO: Implementar obtención del tema
 */
export function getTheme() {
    // TODO: Implementar obtención del tema
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored || 'dark';
}

/**
 * Guardar tema
 * @param {string} theme - 'dark' o 'light'
 * 
 * TODO: Implementar guardado del tema
 */
export function setTheme(theme) {
    // TODO: Implementar guardado del tema
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Limpiar todos los datos de la aplicación
 * 
 * TODO: Implementar limpieza de todos los datos
 */
export function clearAllData() {
    // TODO: Implementar limpieza de todos los datos
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.THEME);
}
