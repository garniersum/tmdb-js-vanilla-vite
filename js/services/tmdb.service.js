/**
 * TMDB Service
 * 
 * Este servicio maneja todas las peticiones a la API de TMDB.
 * Todas las funciones están preparadas pero la lógica de implementación
 * debe ser completada por ti.
 * 
 * TODO: Implementar la lógica de axios para cada función.
 * Usa Axios y maneja errores apropiadamente.
 */

import { TMDB_CONFIG } from '../config/tmdb.config.js';

/**
 * Función base para hacer peticiones a la API de TMDB usando Axios
 * @param {string} endpoint - Endpoint de la API
 * @param {object} params - Parámetros de la query string
 * @returns {Promise<object>} Respuesta de la API
 */
export async function fetchFromTMDB(endpoint, params = {}) {
    // Fusionar parámetros por defecto con los proporcionados
    const allParams = {
        ...TMDB_CONFIG.DEFAULT_PARAMS,
        ...params,
        api_key: TMDB_CONFIG.API_KEY
    };
    
    try {
        // Hacer petición con Axios
        const response = await axios.get(TMDB_CONFIG.BASE_URL + endpoint, {
            params: allParams
        });
        
        // Axios automáticamente transforma la respuesta a JSON
        return response.data;
    } catch (error) {
        // Manejo de errores de Axios
        if (error.response) {
            // El servidor respondió con un código de error
            const status = error.response.status;
            const errorMessage = error.response.data?.status_message || error.response.statusText;
            throw new Error(`HTTP Error ${status}: ${errorMessage}`);
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            throw new Error('Error de red: No se pudo conectar con la API de TMDB');
        } else {
            // Error en la configuración de la petición
            throw error;
        }
    }
}

/**
 * Construir un endpoint reemplazando sus placeholders
 * @param {string} template - Endpoint con placeholders (ej: '/movie/{movie_id}')
 * @param {object} values - Valores por placeholder (ej: { movie_id: 123 })
 * @returns {string} Endpoint listo para usar
 */
export function buildEndpoint(template, values = {}) {
    return Object.entries(values).reduce(
        (endpoint, [key, value]) => endpoint.replace(`{${key}}`, value),
        template
    );
}

/**
 * Obtener una lista paginada de un endpoint
 * @param {string} template - Endpoint con placeholders
 * @param {object} options - { page, values, params }
 * @returns {Promise<object>} Respuesta paginada de la API
 */
function fetchPaginated(template, { page = 1, values = {}, params = {} } = {}) {
    return fetchFromTMDB(buildEndpoint(template, values), { page, ...params });
}

/**
 * Obtener películas populares
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de películas populares
 * 
 * TODO: Consumir el endpoint /movie/popular
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_POPULAR
 * Parámetros: page, language
 * Datos esperados: { page, results: [], total_pages, total_results }
 */
export async function getPopularMovies(page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.MOVIE_POPULAR, { page });
}

/**
 * Obtener películas mejor calificadas
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de películas top rated
 * 
 * TODO: Consumir el endpoint /movie/top_rated
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_TOP_RATED
 */
export async function getTopRatedMovies(page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.MOVIE_TOP_RATED, { page });
}

/**
 * Obtener próximos estrenos
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de próximos estrenos
 * 
 * TODO: Consumir el endpoint /movie/upcoming
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_UPCOMING
 */
export async function getUpcomingMovies(page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.MOVIE_UPCOMING, { page });
}

/**
 * Obtener películas en cartelera
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de películas en cartelera
 * 
 * TODO: Consumir el endpoint /movie/now_playing
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_NOW_PLAYING
 */
export async function getNowPlayingMovies(page = 1) {
    // TODO: Implementar consumo de endpoint de películas en cartelera
    throw new Error('getNowPlayingMovies no implementado aún');
}

/**
 * Obtener tendencias
 * @param {string} mediaType - Tipo de media ('all', 'movie', 'tv', 'person')
 * @param {string} timeWindow - Ventana de tiempo ('day', 'week')
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de tendencias
 * 
 * TODO: Consumir el endpoint /trending/{media_type}/{time_window}
 * Endpoint: TMDB_CONFIG.ENDPOINTS.TRENDING
 * Reemplaza {media_type} y {time_window} en el endpoint
 */
export async function getTrending(mediaType = 'all', timeWindow = 'day', page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.TRENDING, {
        page,
        values: { media_type: mediaType, time_window: timeWindow }
    });
}

/**
 * Obtener detalles de una película
 * @param {number} movieId - ID de la película
 * @returns {Promise<object>} Detalles completos de la película
 * 
 * TODO: Consumir el endpoint /movie/{movie_id}
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_DETAILS
 * Reemplaza {movie_id} con el ID real
 * Datos esperados: title, overview, poster_path, backdrop_path, vote_average, release_date, genres, etc.
 */
export async function getMovieDetails(movieId) {
    const endpoint = buildEndpoint(TMDB_CONFIG.ENDPOINTS.MOVIE_DETAILS, { movie_id: movieId });
    return await fetchFromTMDB(endpoint, { append_to_response: 'credits,videos,similar,recommendations' });
}

/**
 * Obtener películas similares
 * @param {number} movieId - ID de la película
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de películas similares
 * 
 * TODO: Consumir el endpoint /movie/{movie_id}/similar
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_SIMILAR
 */
export async function getSimilarMovies(movieId, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.MOVIE_SIMILAR, { page, values: { movie_id: movieId } });
}

/**
 * Obtener recomendaciones
 * @param {number} movieId - ID de la película
 * @param {number} page - Número de página
 * @returns {Promise<object>} Lista de recomendaciones
 * 
 * TODO: Consumir el endpoint /movie/{movie_id}/recommendations
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_RECOMMENDATIONS
 */
export async function getMovieRecommendations(movieId, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.MOVIE_RECOMMENDATIONS, { page, values: { movie_id: movieId } });
}

/**
 * Obtener videos/trailers de una película
 * @param {number} movieId - ID de la película
 * @returns {Promise<object>} Lista de videos
 * 
 * TODO: Consumir el endpoint /movie/{movie_id}/videos
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS
 * Datos esperados: results: [{ key, name, type, site }] donde type === 'Trailer'
 */
export async function getMovieVideos(movieId) {
    const endpoint = buildEndpoint(TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS, { movie_id: movieId });
    // Usar lenguaje inglés para tener más videos disponibles
    const data = await fetchFromTMDB(endpoint, { language: 'en-US' });
    // Filtrar videos de YouTube de varios tipos (Trailer, Teaser, Clip, Featurette, Behind the Scenes)
    data.results = data.results.filter(video => 
        video.site === 'YouTube' && 
        ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers'].includes(video.type)
    );
    return data;
}

/**
 * Obtener créditos/elenco de una película
 * @param {number} movieId - ID de la película
 * @returns {Promise<object>} Créditos completos
 * 
 * TODO: Consumir el endpoint /movie/{movie_id}/credits
 * Endpoint: TMDB_CONFIG.ENDPOINTS.MOVIE_CREDITS
 * Datos esperados: { cast: [], crew: [] }
 */
export async function getMovieCredits(movieId) {
    const endpoint = buildEndpoint(TMDB_CONFIG.ENDPOINTS.MOVIE_CREDITS, { movie_id: movieId });
    return await fetchFromTMDB(endpoint);
}

/**
 * Búsqueda multi (películas, series, personas)
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<object>} Resultados de búsqueda
 * 
 * TODO: Consumir el endpoint /search/multi
 * Endpoint: TMDB_CONFIG.ENDPOINTS.SEARCH_MULTI
 * Parámetros: query
 * Datos esperados: results: [{ media_type, title, name, poster_path, profile_path, etc. }]
 */
export async function searchMulti(query, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.SEARCH_MULTI, { page, params: { query } });
}

/**
 * Búsqueda de películas
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<object>} Resultados de películas
 * 
 * TODO: Consumir el endpoint /search/movie
 * Endpoint: TMDB_CONFIG.ENDPOINTS.SEARCH_MOVIE
 */
export async function searchMovies(query, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.SEARCH_MOVIE, { page, params: { query } });
}

/**
 * Búsqueda de series de TV
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<object>} Resultados de series
 * 
 * TODO: Consumir el endpoint /search/tv
 * Endpoint: TMDB_CONFIG.ENDPOINTS.SEARCH_TV
 */
export async function searchTV(query, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.SEARCH_TV, { page, params: { query } });
}

/**
 * Búsqueda de personas/actores
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<object>} Resultados de personas
 * 
 * TODO: Consumir el endpoint /search/person
 * Endpoint: TMDB_CONFIG.ENDPOINTS.SEARCH_PERSON
 */
export async function searchPeople(query, page = 1) {
    return await fetchPaginated(TMDB_CONFIG.ENDPOINTS.SEARCH_PERSON, { page, params: { query } });
}

/**
 * Obtener lista de géneros de películas
 * @returns {Promise<object>} Lista de géneros
 * 
 * TODO: Consumir el endpoint /genre/movie/list
 * Endpoint: TMDB_CONFIG.ENDPOINTS.GENRE_MOVIE_LIST
 * Datos esperados: { genres: [{ id, name }] }
 */
export async function getMovieGenres() {
    // TODO: Implementar consumo de endpoint de géneros de películas
    throw new Error('getMovieGenres no implementado aún');
}

/**
 * Obtener lista de géneros de series
 * @returns {Promise<object>} Lista de géneros
 * 
 * TODO: Consumir el endpoint /genre/tv/list
 * Endpoint: TMDB_CONFIG.ENDPOINTS.GENRE_TV_LIST
 */
export async function getTVGenres() {
    // TODO: Implementar consumo de endpoint de géneros de series
    throw new Error('getTVGenres no implementado aún');
}

/**
 * Obtener detalles de una persona
 * @param {number} personId - ID de la persona
 * @returns {Promise<object>} Detalles de la persona
 * 
 * TODO: Consumir el endpoint /person/{person_id}
 * Endpoint: TMDB_CONFIG.ENDPOINTS.PERSON_DETAILS
 */
export async function getPersonDetails(personId) {
    // TODO: Implementar consumo de endpoint de detalles de persona
    throw new Error('getPersonDetails no implementado aún');
}

/**
 * Obtener créditos de películas de una persona
 * @param {number} personId - ID de la persona
 * @returns {Promise<object>} Créditos de la persona
 * 
 * TODO: Consumir el endpoint /person/{person_id}/movie_credits
 * Endpoint: TMDB_CONFIG.ENDPOINTS.PERSON_CREDITS
 */
export async function getPersonCredits(personId) {
    // TODO: Implementar consumo de endpoint de créditos de persona
    throw new Error('getPersonCredits no implementado aún');
}

/**
 * Descubrir películas con filtros
 * @param {object} filters - Filtros de descubrimiento
 * @returns {Promise<object>} Resultados de descubrimiento
 * 
 * TODO: Consumir el endpoint /discover/movie
 * Endpoint: TMDB_CONFIG.ENDPOINTS.DISCOVER_MOVIE
 * Filtros posibles: with_genres, sort_by, year, etc.
 */
export async function discoverMovies(filters = {}) {
    // TODO: Implementar consumo de endpoint de descubrir películas
    throw new Error('discoverMovies no implementado aún');
}
