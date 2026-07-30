/**
 * Search View
 * 
 * Vista de resultados de búsqueda.
 * Muestra resultados de búsqueda de películas, series y personas.
 */

import { searchMulti, searchMovies, searchTV, searchPeople, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/tmdb.service.js';
import { getImageUrl } from '../config/tmdb.config.js';
import { buildPosterCardMarkup } from '../components/movie-card.js';
import { loadMovieGrid } from '../components/movie-grid.js';
import { initSearchHistory } from '../components/search-history.js';
import { navigateTo } from '../services/router.service.js';
import { renderEmptyState } from '../utils/ui-state.js';
import { observeIntersection, setActiveInGroup, appendScrollSentinel } from '../utils/dom.js';

/**
 * Funciones de búsqueda por tipo de filtro
 */
const SEARCH_FETCHERS = {
    movie: searchMovies,
    tv: searchTV,
    person: searchPeople
};

/**
 * Listas ordenadas disponibles (para "ver todas")
 */
const SORTED_LISTS = {
    popularity: { title: 'Películas Populares', fetch: getPopularMovies },
    vote_average: { title: 'Mejor Calificadas', fetch: getTopRatedMovies },
    release_date: { title: 'Próximos Estrenos', fetch: getUpcomingMovies }
};

/**
 * Estado de la vista de búsqueda
 */
let searchState = {
    query: '',
    type: 'all',
    sort: '',
    page: 1,
    totalPages: 1,
    results: [],
    isLoading: false,
    hasMore: true
};

/**
 * Inicializar vista de búsqueda
 * @param {object} params - Parámetros de la URL
 * 
 * TODO: Implementar inicialización de vista de búsqueda
 */
export function initSearchView(params = {}) {
    // TODO: Implementar inicialización de vista de búsqueda
    
    // Obtener parámetros
    const query = params.q || '';
    const type = params.type || 'all';
    const sort = params.sort || '';
    
    // Actualizar estado
    searchState.query = query;
    searchState.type = type;
    searchState.sort = sort;
    searchState.page = 1;
    searchState.results = [];
    searchState.isLoading = false;
    searchState.hasMore = true;
    
    // Actualizar UI
    updateSearchTitle(query, sort);
    
    // Inicializar filtros
    initFilters();
    
    // Inicializar historial
    initSearchHistory(handleHistorySelection);
    
    // Realizar búsqueda si hay query o sort
    if (query) {
        performSearch(query, type, 1);
    } else if (sort) {
        performSortedList(sort, 1);        
    } else {
        showEmptyState();
    }
    
    // Inicializar infinite scroll
    initInfiniteScroll();
}

/**
 * Actualizar título de búsqueda
 * @param {string} query - Término de búsqueda
 * @param {string} sort - Tipo de ordenamiento
 * 
 * TODO: Implementar actualización de título
 */
function updateSearchTitle(query, sort = '') {
    // TODO: Implementar actualización de título
    const searchTitle = document.getElementById('searchTitle');
    
    if (!searchTitle) return;
    
    if (query) {
        searchTitle.textContent = `Resultados para "${query}"`;
    } else if (sort) {
        searchTitle.textContent = SORTED_LISTS[sort]?.title || 'Buscar';
    } else {
        searchTitle.textContent = 'Buscar';
    }
}

/**
 * Inicializar filtros
 * 
 * TODO: Implementar inicialización de filtros
 */
function initFilters() {
    // TODO: Implementar inicialización de filtros
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveInGroup(btn, filterBtns);
            
            // Actualizar tipo y realizar búsqueda
            searchState.type = btn.dataset.filter;
            searchState.page = 1;
            
            if (searchState.query) {
                performSearch(searchState.query, searchState.type, 1);
            }
        });
    });
}

/**
 * Manejar selección de un término del historial
 * @param {string} query - Término seleccionado
 */
function handleHistorySelection(query) {
    searchState.query = query;
    searchState.page = 1;
    updateSearchTitle(query);
    performSearch(query, searchState.type, 1);
}

/**
 * Actualizar el estado de paginación con la respuesta de la API
 * @param {object} data - Respuesta de la API
 * @param {number} page - Página solicitada
 */
function updatePaginationState(data, page) {
    searchState.results = page === 1 ? data.results : [...searchState.results, ...data.results];
    searchState.page = data.page;
    searchState.totalPages = data.total_pages;
    searchState.hasMore = data.page < data.total_pages;
}

/**
 * Cargar resultados en el grid de la vista de búsqueda
 * @param {object} options - { fetchPage, page, label, filterResults }
 */
async function loadResults({ fetchPage, page, label, filterResults = results => results }) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    // Evitar cargas duplicadas
    if (searchState.isLoading) return;
    searchState.isLoading = true;
    
    const append = page > 1;
    let movies = [];
    
    if (!append) {
        resultsContainer.innerHTML = '<div class="movies-grid"></div>';
    }
    
    try {
        const loaded = await loadMovieGrid({
            grid: resultsContainer.querySelector('.movies-grid'),
            label,
            append,
            showSkeletons: false,
            fetchMovies: async () => {
                const data = await fetchPage(page);
                updatePaginationState(data, page);
                movies = filterResults(data.results || []);
                return movies;
            }
        });
        
        if (loaded && !append && movies.length === 0) {
            showEmptyState();
        }
    } finally {
        searchState.isLoading = false;
    }
}

/**
 * Realizar lista ordenada (para "ver todas")
 * @param {string} sort - Tipo de ordenamiento ('popularity', 'vote_average', 'release_date')
 * @param {number} page - Número de página
 */
async function performSortedList(sort, page = 1) {
    const fetchList = SORTED_LISTS[sort]?.fetch;
    
    await loadResults({
        page,
        label: 'la lista',
        fetchPage: requestedPage => fetchList
            ? fetchList(requestedPage)
            : Promise.resolve({ results: [], page: requestedPage, total_pages: 1 })
    });
}

/**
 * Realizar búsqueda
 * @param {string} query - Término de búsqueda
 * @param {string} type - Tipo de búsqueda ('all', 'movie', 'tv', 'person')
 * @param {number} page - Número de página
 * 
 * TODO: Implementar ejecución de búsqueda
 */
async function performSearch(query, type = 'all', page = 1) {
    // TODO: Implementar ejecución de búsqueda
    const search = SEARCH_FETCHERS[type] ?? searchMulti;
    
    await loadResults({
        page,
        label: 'la búsqueda',
        fetchPage: requestedPage => search(query, requestedPage),
        // En búsqueda multi solo se muestran películas y series en el grid
        filterResults: results => type === 'all'
            ? results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            : results
    });
}

/**
 * Crear tarjeta de resultado de búsqueda
 * @param {object} item - Item de resultado
 * @returns {HTMLElement} Elemento de tarjeta
 * 
 * TODO: Implementar creación de tarjeta de resultado
 */
function createSearchResultCard(item) {
    // TODO: Implementar creación de tarjeta de resultado
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Determinar tipo y datos apropiados
    const isPerson = item.media_type === 'person' || item.known_for_department;
    const title = isPerson ? item.name : (item.title || item.name);
    const date = isPerson ? null : (item.release_date || item.first_air_date);
    const posterPath = isPerson ? item.profile_path : item.poster_path;
    
    card.innerHTML = buildPosterCardMarkup({
        posterUrl: getImageUrl(posterPath, 'w500'),
        title,
        metaHtml: `
                <span class="movie-year">${date ? date.split('-')[0] : ''}</span>
                <span class="movie-type">${isPerson ? '👤 Persona' : (item.media_type === 'tv' ? '📺 Serie' : '🎬 Película')}</span>
        `
    });
    
    // Event listener para click
    card.addEventListener('click', () => {
        if (isPerson) {
            // TODO: Navegar a vista de persona
            console.log('Ver persona', item.id);
        } else {
            const route = item.media_type === 'tv' ? 'tv' : 'movie';
            navigateTo(route, { id: item.id });
        }
    });
    
    return card;
}

/**
 * Mostrar estado vacío
 * 
 * TODO: Implementar mostrado de estado vacío
 */
function showEmptyState() {
    // TODO: Implementar mostrado de estado vacío
    renderEmptyState(document.getElementById('searchResults'), {
        icon: '🔍',
        title: 'No se encontraron resultados',
        message: 'Intenta con otro término de búsqueda'
    });
}

/**
 * Inicializar infinite scroll
 */
function initInfiniteScroll() {
    const sentinel = appendScrollSentinel(document.getElementById('searchResults'));
    
    // Guardar observer para limpieza
    searchState.observer = observeIntersection(sentinel, () => {
        if (searchState.hasMore && !searchState.isLoading) {
            loadMoreResults();
        }
    }, {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
    });
}

/**
 * Cargar más resultados
 */
async function loadMoreResults() {
    if (!searchState.hasMore || searchState.isLoading) return;
    
    await loadSearchPage(searchState.page + 1);
}

/**
 * Cargar una página según el estado actual (búsqueda o lista ordenada)
 * @param {number} page - Página a cargar
 */
async function loadSearchPage(page) {
    if (searchState.sort) {
        await performSortedList(searchState.sort, page);
    } else if (searchState.query) {
        await performSearch(searchState.query, searchState.type, page);
    }
}

/**
 * Inicializar paginación
 * 
 * TODO: Implementar inicialización de paginación
 */
function initPagination() {
    // TODO: Implementar inicialización de paginación
    const prevBtn = document.getElementById('searchPrevPage');
    const nextBtn = document.getElementById('searchNextPage');
    
    prevBtn?.addEventListener('click', () => {
        if (searchState.page > 1) {
            searchState.page--;
            loadSearchPage(searchState.page);
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        if (searchState.page < searchState.totalPages) {
            searchState.page++;
            loadSearchPage(searchState.page);
        }
    });
}

/**
 * Actualizar paginación
 * 
 * TODO: Implementar actualización de paginación
 */
function updatePagination() {
    // TODO: Implementar actualización de paginación
    const prevBtn = document.getElementById('searchPrevPage');
    const nextBtn = document.getElementById('searchNextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (prevBtn) {
        prevBtn.disabled = searchState.page <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = searchState.page >= searchState.totalPages;
    }
    
    if (pageInfo) {
        pageInfo.textContent = `Página ${searchState.page} de ${searchState.totalPages}`;
    }
}
