/**
 * Movie Grid Component
 *
 * Flujo compartido de carga de un grid de películas:
 * skeletons -> fetch -> render -> lazy loading -> estado de error.
 */

import { renderMovieCards, appendMovieCards, renderSkeletons } from './movie-card.js';
import { lazyLoadImages } from '../utils/helpers.js';
import { renderErrorState } from '../utils/ui-state.js';

/**
 * Cargar películas en un grid
 * @param {object} options - Opciones de carga
 * @param {HTMLElement} [options.grid] - Grid destino
 * @param {string} [options.gridId] - ID del grid destino
 * @param {Function} options.fetchMovies - Función que retorna la respuesta de la API
 * @param {string} options.label - Nombre de la sección (para logs y errores)
 * @param {number} [options.skeletonCount] - Cantidad de skeletons
 * @param {boolean} [options.showSkeletons] - Mostrar skeletons antes de cargar
 * @param {boolean} [options.append] - Agregar resultados al grid existente
 * @returns {Promise<object|null>} Respuesta de la API o null si falló
 */
export async function loadMovieGrid(options) {
    const {
        grid,
        gridId,
        fetchMovies,
        label = 'contenido',
        skeletonCount = 4,
        showSkeletons = true,
        append = false
    } = options;

    const container = grid ?? (gridId ? document.getElementById(gridId) : null);

    if (!container) return null;

    if (showSkeletons && !append) {
        renderSkeletons(container, skeletonCount);
    }

    try {
        const data = await fetchMovies();
        const movies = Array.isArray(data) ? data : (data?.results ?? []);

        if (append) {
            appendMovieCards(movies, container);
        } else {
            renderMovieCards(movies, container);
        }

        lazyLoadImages();

        return data;
    } catch (error) {
        console.error(`Error cargando ${label}:`, error);

        if (!append) {
            renderErrorState(container, { title: `Error al cargar ${label}` });
        }

        return null;
    }
}
