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
 * Leer y parsear un array desde LocalStorage de forma segura.
 * Si el valor está corrupto o LocalStorage no está disponible,
 * registra el error, descarta el valor inválido y devuelve el fallback.
 * @param {string} key - Clave de LocalStorage
 * @param {Array} fallback - Valor por defecto
 * @returns {Array}
 */
function readArray(key, fallback = []) {
    let stored;
    try {
        stored = localStorage.getItem(key);
    } catch (error) {
        console.error(`No se pudo leer "${key}" de LocalStorage:`, error);
        return fallback;
    }

    if (!stored) return fallback;

    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        console.error(`Datos corruptos en "${key}", se descartan:`, error);
        try {
            localStorage.removeItem(key);
        } catch (removeError) {
            console.error(`No se pudo limpiar "${key}":`, removeError);
        }
        return fallback;
    }
}

/**
 * Escribir un valor en LocalStorage de forma segura.
 * @param {string} key - Clave de LocalStorage
 * @param {*} value - Valor a serializar y guardar
 * @returns {boolean} True si se guardó correctamente
 */
function writeItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`No se pudo guardar "${key}" en LocalStorage:`, error);
        return false;
    }
}

/**
 * Eliminar una clave de LocalStorage de forma segura.
 * @param {string} key - Clave a eliminar
 * @returns {boolean} True si se eliminó correctamente
 */
function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`No se pudo eliminar "${key}" de LocalStorage:`, error);
        return false;
    }
}

/**
 * Obtener favoritos del LocalStorage
 * @returns {Array} Lista de IDs de películas favoritas
 * 
 * TODO: Implementar obtención de favoritos desde LocalStorage
 * Pista: Usa JSON.parse() para convertir el string a array
 */
export function getFavorites() {
    return readArray(STORAGE_KEYS.FAVORITES);
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
    
    // Devuelve false si la escritura falla para no reportar un guardado inexistente
    return writeItem(STORAGE_KEYS.FAVORITES, favorites);
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
    return writeItem(STORAGE_KEYS.FAVORITES, filtered);
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
    // Devuelve el estado realmente persistido para no mostrar un cambio
    // que no se guardó (p. ej. si LocalStorage falla o está lleno).
    if (isFavorite(movieId)) {
        removeFavorite(movieId);
    } else {
        addFavorite(movieId, movieData);
    }
    return isFavorite(movieId);
}

/**
 * Obtener historial de búsqueda
 * @returns {Array} Lista de términos de búsqueda
 * 
 * TODO: Implementar obtención de historial
 */
export function getSearchHistory() {
    return readArray(STORAGE_KEYS.SEARCH_HISTORY);
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
    
    return writeItem(STORAGE_KEYS.SEARCH_HISTORY, trimmed);
}

/**
 * Limpiar historial de búsqueda
 * 
 * TODO: Implementar limpieza del historial
 */
export function clearSearchHistory() {
    return removeItem(STORAGE_KEYS.SEARCH_HISTORY);
}

/**
 * Obtener tema guardado
 * @returns {string} 'dark' o 'light'
 * 
 * TODO: Implementar obtención del tema
 */
export function getTheme() {
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    } catch (error) {
        console.error('No se pudo leer el tema de LocalStorage:', error);
        return 'dark';
    }
}

/**
 * Guardar tema
 * @param {string} theme - 'dark' o 'light'
 * 
 * TODO: Implementar guardado del tema
 */
export function setTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        return true;
    } catch (error) {
        console.error('No se pudo guardar el tema en LocalStorage:', error);
        return false;
    }
}

/**
 * Limpiar todos los datos de la aplicación
 * 
 * TODO: Implementar limpieza de todos los datos
 */
export function clearAllData() {
    const results = Object.values(STORAGE_KEYS).map(key => removeItem(key));
    return results.every(Boolean);
}
