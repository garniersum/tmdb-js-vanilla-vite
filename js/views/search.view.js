/**
 * Search View
 * 
 * Vista de resultados de búsqueda.
 * Muestra resultados de búsqueda de películas, series y personas.
 */

import { searchMulti, searchMovies, searchTV, searchPeople, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/tmdb.service.js';
import { getImageUrl } from '../config/tmdb.config.js';
import { renderMovieCards, renderSkeletons } from '../components/movie-card.js';
import { getSearchHistory, clearSearchHistory } from '../services/storage.service.js';
import { navigateTo } from '../services/router.service.js';
import { lazyLoadImages } from '../utils/helpers.js';

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
    initSearchHistory();
    
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
 * 
 * TODO: Implementar actualización de título
 */
function updateSearchTitle(query, sort = '') {
    // TODO: Implementar actualización de título
    const searchTitle = document.getElementById('searchTitle');
    
    if (searchTitle) {
        if (query) {
            searchTitle.textContent = `Resultados para "${query}"`;
        } else if (sort) {
            const titles = {
                'popularity': 'Películas Populares',
                'vote_average': 'Mejor Calificadas',
                'release_date': 'Próximos Estrenos'
            };
            searchTitle.textContent = titles[sort] || 'Buscar';
        } else {
            searchTitle.textContent = 'Buscar';
        }
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
            // Remover active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            // Actualizar tipo y realizar búsqueda
            const type = btn.dataset.filter;
            searchState.type = type;
            searchState.page = 1;
            
            if (searchState.query) {
                performSearch(searchState.query, type, 1);
            }
        });
    });
}

/**
 * Inicializar historial de búsqueda
 * 
 * TODO: Implementar inicialización de historial
 */
function initSearchHistory() {
    // TODO: Implementar inicialización de historial
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    if (!historyList) return;
    
    const history = getSearchHistory();
    
    if (history.length === 0) {
        document.getElementById('searchHistory')?.classList.add('hidden');
        return;
    }
    
    document.getElementById('searchHistory')?.classList.remove('hidden');
    
    historyList.innerHTML = history.map(item => `
        <span class="history-item" data-query="${item}">${item}</span>
    `).join('');
    
    // Event listeners para items del historial
    historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            searchState.query = query;
            searchState.page = 1;
            updateSearchTitle(query);
            performSearch(query, searchState.type, 1);
        });
    });
    
    // Event listener para limpiar historial
    clearHistoryBtn?.addEventListener('click', () => {
        clearSearchHistory();
        document.getElementById('searchHistory')?.classList.add('hidden');
    });
}

/**
 * Realizar lista ordenada (para "ver todas")
 * @param {string} sort - Tipo de ordenamiento ('popularity', 'vote_average', 'release_date')
 * @param {number} page - Número de página
 */
async function performSortedList(sort, page = 1) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    // Evitar cargas duplicadas
    if (searchState.isLoading) return;
    searchState.isLoading = true;
    
    try {
        let data;
        
        // Obtener lista según el tipo de sort
        switch (sort) {
            case 'popularity':
                data = await getPopularMovies(page);
                break;
            case 'vote_average':
                data = await getTopRatedMovies(page);
                break;
            case 'release_date':
                data = await getUpcomingMovies(page);
                break;
            default:
                data = { results: [], page, total_pages: 1 };
        }
        
        // Actualizar estado
        searchState.results = page === 1 ? data.results : [...searchState.results, ...data.results];
        searchState.page = data.page;
        searchState.totalPages = data.total_pages;
        searchState.hasMore = data.page < data.total_pages;
        
        // Renderizar resultados
        if (page === 1) {
            resultsContainer.innerHTML = '<div class="movies-grid"></div>';
            const grid = resultsContainer.querySelector('.movies-grid');
            renderMovieCards(data.results, grid);
            lazyLoadImages();
        } else {
            const grid = resultsContainer.querySelector('.movies-grid');
            if (grid) {
                renderMovieCards(data.results, grid);
                lazyLoadImages();
            }
        }
        
    } catch (error) {
        console.error('Error cargando lista:', error);
        if (page === 1) {
            resultsContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h3>Error al cargar la lista</h3>
                    <p>Por favor, intenta nuevamente</p>
                </div>
            `;
        }
    } finally {
        searchState.isLoading = false;
    }
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
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    // Evitar cargas duplicadas
    if (searchState.isLoading) return;
    searchState.isLoading = true;
    
    try {
        let data;
        
        // TODO: Llama a la función de búsqueda apropiada según el tipo
        switch (type) {
            case 'movie':
                data = await searchMovies(query, page);
                break;
            case 'tv':
                data = await searchTV(query, page);
                break;
            case 'person':
                data = await searchPeople(query, page);
                break;
            default:
                data = await searchMulti(query, page);
        }
        
        // Actualizar estado
        searchState.results = page === 1 ? data.results : [...searchState.results, ...data.results];
        searchState.page = data.page;
        searchState.totalPages = data.total_pages;
        searchState.hasMore = data.page < data.total_pages;
        
        // Renderizar resultados
        if (page === 1) {
            renderSearchResults(data.results, type);
        } else {
            const grid = resultsContainer.querySelector('.movies-grid');
            if (grid) {
                renderMovieCards(data.results.filter(item => item.media_type === 'movie'), grid);
                lazyLoadImages();
            }
        }
        
    } catch (error) {
        console.error('Error en búsqueda:', error);
        if (page === 1) {
            resultsContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h3>Error en la búsqueda</h3>
                    <p>Por favor, intenta nuevamente</p>
                </div>
            `;
        }
    } finally {
        searchState.isLoading = false;
    }
}

/**
 * Renderizar resultados de búsqueda
 * @param {Array} results - Resultados de búsqueda
 * @param {string} type - Tipo de resultados
 * 
 * TODO: Implementar renderizado de resultados
 */
function renderSearchResults(results, type) {
    // TODO: Implementar renderizado de resultados
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    if (!results || results.length === 0) {
        showEmptyState();
        return;
    }
    
    // Crear grid horizontal
    resultsContainer.innerHTML = '<div class="movies-grid"></div>';
    const grid = resultsContainer.querySelector('.movies-grid');
    
    // Filtrar resultados según el tipo
    let filteredResults = results;
    
    if (type === 'all') {
        // En búsqueda multi, filtrar por media_type (solo películas para el grid)
        filteredResults = results.filter(item => 
            item.media_type === 'movie' || item.media_type === 'tv'
        );
    }
    
    // Renderizar como tarjetas de película
    renderMovieCards(filteredResults, grid);
    
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
    const posterUrl = getImageUrl(posterPath, 'w500');
    
    card.innerHTML = `
        <div class="movie-poster">
            <img data-src="${posterUrl}" alt="${title}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${date ? date.split('-')[0] : ''}</span>
                <span class="movie-type">${isPerson ? '👤 Persona' : (item.media_type === 'tv' ? '📺 Serie' : '🎬 Película')}</span>
            </div>
        </div>
    `;
    
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
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otro término de búsqueda</p>
        </div>
    `;
}

/**
 * Inicializar infinite scroll
 */
function initInfiniteScroll() {
    const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && searchState.hasMore && !searchState.isLoading) {
                loadMoreResults();
            }
        });
    }, options);
    
    // Crear elemento sentinel al final de los resultados
    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.style.height = '50px';
    sentinel.style.visibility = 'hidden';
    
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.appendChild(sentinel);
        observer.observe(sentinel);
    }
    
    // Guardar observer para limpieza
    searchState.observer = observer;
}

/**
 * Cargar más resultados
 */
async function loadMoreResults() {
    if (!searchState.hasMore || searchState.isLoading) return;
    
    const nextPage = searchState.page + 1;
    
    if (searchState.sort) {
        await performSortedList(searchState.sort, nextPage);
    } else if (searchState.query) {
        await performSearch(searchState.query, searchState.type, nextPage);
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
            if (searchState.sort) {
                performSortedList(searchState.sort, searchState.page);
            } else if (searchState.query) {
                performSearch(searchState.query, searchState.type, searchState.page);
            }
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        if (searchState.page < searchState.totalPages) {
            searchState.page++;
            if (searchState.sort) {
                performSortedList(searchState.sort, searchState.page);
            } else if (searchState.query) {
                performSearch(searchState.query, searchState.type, searchState.page);
            }
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
