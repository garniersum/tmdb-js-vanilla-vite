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
 * Leer un valor JSON del LocalStorage
 * @param {string} key - Clave de LocalStorage
 * @param {*} fallback - Valor a retornar si no hay dato guardado
 * @returns {*} Valor almacenado o el fallback
 */
function readJson(key, fallback) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
}

/**
 * Guardar un valor JSON en el LocalStorage
 * @param {string} key - Clave de LocalStorage
 * @param {*} value - Valor a guardar
 */
function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Obtener favoritos del LocalStorage
 * @returns {Array} Lista de IDs de películas favoritas
 * 
 * TODO: Implementar obtención de favoritos desde LocalStorage
 * Pista: Usa JSON.parse() para convertir el string a array
 */
export function getFavorites() {
    // TODO: Implementar obtención de favoritos
    return readJson(STORAGE_KEYS.FAVORITES, []);
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
    
    writeJson(STORAGE_KEYS.FAVORITES, favorites);
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
    writeJson(STORAGE_KEYS.FAVORITES, filtered);
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
    return readJson(STORAGE_KEYS.SEARCH_HISTORY, []);
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
    
    writeJson(STORAGE_KEYS.SEARCH_HISTORY, trimmed);
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
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
