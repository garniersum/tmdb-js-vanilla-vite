/**
 * Home View
 * 
 * Vista principal de la aplicación.
 * Muestra el hero section, tendencias, películas populares, etc.
 */

import { getTrending, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getMovieVideos } from '../services/tmdb.service.js';
import { getBackdropUrl } from '../config/tmdb.config.js';
import { renderMovieCards, renderSkeletons } from '../components/movie-card.js';
import { openModal } from '../components/modal.js';
import { navigateTo } from '../services/router.service.js';
import { lazyLoadImages } from '../utils/helpers.js';

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
    const grid = document.getElementById('trendingGrid');
    
    if (!grid) return;
    
    // Mostrar skeletons
    renderSkeletons(grid, 4);
    
    try {
        const data = await getTrending('movie', timeWindow, page);
        
        // Renderizar películas
        renderMovieCards(data.results, grid);
        lazyLoadImages();
    } catch (error) {
        console.error('Error cargando tendencias:', error);
        renderSectionError(grid, 'Error al cargar tendencias');
    }
}

/**
 * Renderizar estado de error en una sección
 * @param {HTMLElement} grid - Contenedor de la sección
 * @param {string} title - Título del error
 */
function renderSectionError(grid, title) {
    if (!grid) return;
    grid.innerHTML = `
        <div class="error-state">
            <div class="error-icon">❌</div>
            <h3>${title}</h3>
            <p>Por favor, intenta nuevamente</p>
        </div>
    `;
}

/**
 * Cargar sección de películas populares
 * 
 * TODO: Implementar carga de películas populares
 */
async function loadPopularSection(page = 1) {
    // TODO: Implementar carga de películas populares
    const grid = document.getElementById('popularGrid');
    
    if (!grid) return;
    
    renderSkeletons(grid, 4);
    
    try {
        const data = await getPopularMovies(page);
        renderMovieCards(data.results, grid);
        lazyLoadImages();
    } catch (error) {
        console.error('Error cargando populares:', error);
        renderSectionError(grid, 'Error al cargar películas populares');
    }
}

/**
 * Cargar sección de películas top rated
 * 
 * TODO: Implementar carga de películas top rated
 */
async function loadTopRatedSection(page = 1) {
    // TODO: Implementar carga de películas top rated
    const grid = document.getElementById('topRatedGrid');
    
    if (!grid) return;
    
    renderSkeletons(grid, 4);
    
    try {
        const data = await getTopRatedMovies(page);
        renderMovieCards(data.results, grid);
        lazyLoadImages();
    } catch (error) {
        console.error('Error cargando top rated:', error);
        renderSectionError(grid, 'Error al cargar mejor calificadas');
    }
}

/**
 * Cargar sección de próximos estrenos
 * 
 * TODO: Implementar carga de próximos estrenos
 */
async function loadUpcomingSection(page = 1) {
    // TODO: Implementar carga de próximos estrenos
    const grid = document.getElementById('upcomingGrid');
    
    if (!grid) return;
    
    renderSkeletons(grid, 4);
    
    try {
        const data = await getUpcomingMovies(page);
        renderMovieCards(data.results, grid);
        lazyLoadImages();
    } catch (error) {
        console.error('Error cargando upcoming:', error);
        renderSectionError(grid, 'Error al cargar próximos estrenos');
    }
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
            // Remover active de todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar active al tab clickeado
            tab.classList.add('active');
            
            // Cargar datos correspondientes
            const timeWindow = tab.dataset.tab;
            loadTrendingSection(timeWindow);
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading) {
                isLoading = true;
                // TODO: Cargar más películas
                currentPage++;
                // loadPopularSection(currentPage);
                isLoading = false;
            }
        });
    }, {
        rootMargin: '200px'
    });
    
    // Observar el footer o un elemento al final de la página
    const footer = document.querySelector('.footer');
    if (footer) {
        observer.observe(footer);
    }
}
