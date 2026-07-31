/**
 * TMDB Configuration
 * 
 * Este archivo contiene la configuración base para conectar con la API de TMDB.
 * 
 * TODO: Reemplaza 'YOUR_API_KEY' con tu API key real de TMDB.
 * Para obtener una API key:
 * 1. Ve a https://www.themoviedb.org/
 * 2. Regístrate o inicia sesión
 * 3. Ve a Settings > API > Create
 * 4. Copia tu API key y pégala abajo
 */

export const TMDB_CONFIG = {
    // TODO: Ingresa tu API key de TMDB aquí
    API_KEY: import.meta.env.VITE_TMDB_API_KEY,
    
    // Base URL de la API de TMDB
    BASE_URL: 'https://api.themoviedb.org/3',
    
    // Base URL para imágenes
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    
    // Tamaños de imagen disponibles
    IMAGE_SIZES: {
        poster: {
            w92: 'w92',
            w154: 'w154',
            w185: 'w185',
            w342: 'w342',
            w500: 'w500',
            w780: 'w780',
            original: 'original'
        },
        backdrop: {
            w300: 'w300',
            w780: 'w780',
            w1280: 'w1280',
            original: 'original'
        },
        profile: {
            w45: 'w45',
            w185: 'w185',
            h632: 'h632',
            original: 'original'
        }
    },
    
    // Endpoints principales
    ENDPOINTS: {
        // Películas
        MOVIE_POPULAR: '/movie/popular',
        MOVIE_TOP_RATED: '/movie/top_rated',
        MOVIE_UPCOMING: '/movie/upcoming',
        MOVIE_NOW_PLAYING: '/movie/now_playing',
        MOVIE_DETAILS: '/movie/{movie_id}',
        MOVIE_SIMILAR: '/movie/{movie_id}/similar',
        MOVIE_RECOMMENDATIONS: '/movie/{movie_id}/recommendations',
        MOVIE_VIDEOS: '/movie/{movie_id}/videos',
        MOVIE_CREDITS: '/movie/{movie_id}/credits',
        MOVIE_REVIEWS: '/movie/{movie_id}/reviews',
        
        // Series de TV
        TV_POPULAR: '/tv/popular',
        TV_TOP_RATED: '/tv/top_rated',
        TV_ON_THE_AIR: '/tv/on_the_air',
        TV_AIRING_TODAY: '/tv/airing_today',
        TV_DETAILS: '/tv/{tv_id}',
        TV_SIMILAR: '/tv/{tv_id}/similar',
        TV_RECOMMENDATIONS: '/tv/{tv_id}/recommendations',
        
        // Tendencias
        TRENDING: '/trending/{media_type}/{time_window}',
        
        // Búsqueda
        SEARCH_MULTI: '/search/multi',
        SEARCH_MOVIE: '/search/movie',
        SEARCH_TV: '/search/tv',
        SEARCH_PERSON: '/search/person',
        
        // Personas
        PERSON_DETAILS: '/person/{person_id}',
        PERSON_CREDITS: '/person/{person_id}/movie_credits',
        PERSON_IMAGES: '/person/{person_id}/images',
        
        // Géneros
        GENRE_MOVIE_LIST: '/genre/movie/list',
        GENRE_TV_LIST: '/genre/tv/list',
        
        // Descubrir
        DISCOVER_MOVIE: '/discover/movie',
        DISCOVER_TV: '/discover/tv'
    },
    
    // Parámetros por defecto para las peticiones
    DEFAULT_PARAMS: {
        language: 'es-ES',
        include_adult: false,
        page: 1
    },
    
    // Configuración de imágenes por defecto
    DEFAULT_IMAGE_SIZE: 'w500',
    DEFAULT_BACKDROP_SIZE: 'w1280',
    DEFAULT_PROFILE_SIZE: 'w185'
};

/**
 * Placeholders usados cuando la API no provee una imagen
 */
export const IMAGE_PLACEHOLDERS = {
    poster: 'https://placehold.co/500x750/1a1a1a/ffffff?text=No+Image',
    backdrop: 'https://placehold.co/1920x1080/1a1a1a/ffffff?text=No+Backdrop',
    profile: 'https://placehold.co/185x278/1a1a1a/ffffff?text=No+Photo'
};

/**
 * Helper base para construir URLs de imagen de TMDB
 * @param {string} path - Ruta de la imagen (ej: '/abc123.jpg')
 * @param {string} size - Tamaño de la imagen (ej: 'w500')
 * @param {string} placeholder - URL a usar cuando no hay imagen
 * @returns {string} URL completa de la imagen
 */
export const buildImageUrl = (path, size, placeholder) => {
    if (!path) {
        return placeholder;
    }
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Helper para construir URLs de poster
 * @param {string} path - Ruta de la imagen
 * @param {string} size - Tamaño de la imagen
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (path, size = TMDB_CONFIG.DEFAULT_IMAGE_SIZE) =>
    buildImageUrl(path, size, IMAGE_PLACEHOLDERS.poster);

/**
 * Helper para construir URLs de backdrop
 * @param {string} path - Ruta del backdrop
 * @param {string} size - Tamaño del backdrop
 * @returns {string} URL completa del backdrop
 */
export const getBackdropUrl = (path, size = TMDB_CONFIG.DEFAULT_BACKDROP_SIZE) =>
    buildImageUrl(path, size, IMAGE_PLACEHOLDERS.backdrop);

/**
 * Helper para construir URLs de perfil
 * @param {string} path - Ruta del perfil
 * @param {string} size - Tamaño del perfil
 * @returns {string} URL completa del perfil
 */
export const getProfileUrl = (path, size = TMDB_CONFIG.DEFAULT_PROFILE_SIZE) =>
    buildImageUrl(path, size, IMAGE_PLACEHOLDERS.profile);
