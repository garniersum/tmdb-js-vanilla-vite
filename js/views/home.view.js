/**
 * Home View
 * 
 * Vista principal de la aplicación.
 * Muestra el hero section, tendencias, películas populares, etc.
 */

import { getTrending, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getMovieVideos } from '../services/tmdb.service.js';
import { getBackdropUrl } from '../config/tmdb.config.js';
import { loadMovieGrid } from '../components/movie-grid.js';
import { openModal } from '../components/modal.js';
import { navigateTo } from '../services/router.service.js';
import { observeIntersection, setActiveInGroup } from '../utils/dom.js';

/**
 * Inicializar vista home
 * 
 * TODO: Implementar inicialización de vista home
 * Debe cargar todas las secciones de la página principal
 */
export function initHomeView() {
    // TODO: Implementar inicialización de vista home
    
    // Cargar hero section
    loadHeroSection();
    
    // Cargar tendencias
    loadTrendingSection();
    
    // Cargar películas populares
    loadPopularSection();
    
    // Cargar películas top rated
    loadTopRatedSection();
    
    // Cargar próximos estrenos
    loadUpcomingSection();
    
    // Inicializar event listeners de tabs
    initTabs();
    
    // Inicializar infinite scroll
    initInfiniteScroll();
}

/**
 * Cargar hero section
 * 
 * TODO: Implementar carga del hero section
 * Debe mostrar una película destacada
 */
async function loadHeroSection() {
    // TODO: Implementar carga del hero section
    // Pista: Usa getTrending o getPopularMovies para obtener una película destacada
    // Pista: Actualiza el DOM con los datos de la película
    
    const heroTitle = document.getElementById('heroTitle');
    const heroOverview = document.getElementById('heroOverview');
    const heroBackground = document.getElementById('heroBackground');
    const heroWatchBtn = document.getElementById('heroWatchBtn');
    const heroDetailsBtn = document.getElementById('heroDetailsBtn');
    
    // Mostrar estado de carga
    heroTitle.textContent = 'Cargando...';
    
    try {
        const trending = await getTrending('movie', 'day', 1);
        const featuredMovie = trending.results[0];        
        
        // Actualizar DOM
        heroTitle.textContent = featuredMovie.title;
        heroOverview.textContent = featuredMovie.overview;                
        heroBackground.style.backgroundImage = `url(${getBackdropUrl(featuredMovie.backdrop_path)})`;
        
        // Obtener trailer para el botón de ver
        let trailerKey = null;
        try {
            const videos = await getMovieVideos(featuredMovie.id);
            const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                trailerKey = trailer.key;
            }
        } catch (videoError) {
            console.warn('No se pudo obtener el trailer:', videoError);
        }
        
        // Event listeners
        heroWatchBtn?.addEventListener('click', () => {
            if (trailerKey) {
                openModal(trailerKey);
            } else {
                console.log('No hay trailer disponible para esta película');
            }
        });
        
        heroDetailsBtn?.addEventListener('click', () => {
            navigateTo('movie', { id: featuredMovie.id });
        });
        
    } catch (error) {
        console.error('Error cargando hero section:', error);
        heroTitle.textContent = 'Error al cargar';
    }
}

/**
 * Cargar sección de tendencias
 * 
 * TODO: Implementar carga de tendencias
 */
async function loadTrendingSection(timeWindow = 'day', page = 1) {
    // TODO: Implementar carga de tendencias
    await loadMovieGrid({
        gridId: 'trendingGrid',
        label: 'tendencias',
        fetchMovies: () => getTrending('movie', timeWindow, page)
    });
}

/**
 * Cargar sección de películas populares
 * 
 * TODO: Implementar carga de películas populares
 */
async function loadPopularSection(page = 1) {
    // TODO: Implementar carga de películas populares
    await loadMovieGrid({
        gridId: 'popularGrid',
        label: 'populares',
        fetchMovies: () => getPopularMovies(page)
    });
}

/**
 * Cargar sección de películas top rated
 * 
 * TODO: Implementar carga de películas top rated
 */
async function loadTopRatedSection(page = 1) {
    // TODO: Implementar carga de películas top rated
    await loadMovieGrid({
        gridId: 'topRatedGrid',
        label: 'top rated',
        fetchMovies: () => getTopRatedMovies(page)
    });
}

/**
 * Cargar sección de próximos estrenos
 * 
 * TODO: Implementar carga de próximos estrenos
 */
async function loadUpcomingSection(page = 1) {
    // TODO: Implementar carga de próximos estrenos
    await loadMovieGrid({
        gridId: 'upcomingGrid',
        label: 'próximos estrenos',
        fetchMovies: () => getUpcomingMovies(page)
    });
}

/**
 * Inicializar tabs de tendencias
 * 
 * TODO: Implementar inicialización de tabs
 */
function initTabs() {
    // TODO: Implementar inicialización de tabs
    const tabs = document.querySelectorAll('.tab[data-section="trending"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setActiveInGroup(tab, tabs);
            
            // Cargar datos correspondientes
            loadTrendingSection(tab.dataset.tab);
        });
    });
}

/**
 * Inicializar infinite scroll
 * 
 * TODO: Implementar infinite scroll
 * Detecta cuando el usuario llega al final de la página y carga más contenido
 */
function initInfiniteScroll() {
    // TODO: Implementar infinite scroll
    // Pista: Usa IntersectionObserver o scroll event con throttle
    // Pista: Detecta cuando el usuario está cerca del final de la página
    // Pista: Carga la siguiente página de resultados
    
    let isLoading = false;
    let currentPage = 1;
    
    // Observar el footer o un elemento al final de la página
    observeIntersection(document.querySelector('.footer'), () => {
        if (isLoading) return;
        
        isLoading = true;
        // TODO: Cargar más películas
        currentPage++;
        // loadPopularSection(currentPage);
        isLoading = false;
    }, { rootMargin: '200px' });
}
