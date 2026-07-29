/**
 * Movie Detail View
 * 
 * Vista de detalles de una película individual.
 * Muestra información completa, elenco, videos, películas similares, etc.
 */

import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieRecommendations } from '../services/tmdb.service.js';
import { getImageUrl, getBackdropUrl } from '../config/tmdb.config.js';
import { formatDate, formatRuntime, formatRating, formatGenres } from '../utils/formatters.js';
import { renderMovieCards } from '../components/movie-card.js';
import { openModal } from '../components/modal.js';
import { isFavorite, toggleFavorite } from '../services/storage.service.js';

/**
 * Inicializar vista de detalles de película
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar inicialización de vista de detalles
 */
export function initMovieDetailView(movieId) {
    // TODO: Implementar inicialización de vista de detalles
    
    if (!movieId) {
        showError('ID de película no proporcionado');
        return;
    }
    
    // Cargar detalles de la película
    loadMovieDetails(movieId);
    
    // Cargar créditos/elenco
    loadMovieCredits(movieId);
    
    // Cargar videos/trailers
    loadMovieVideos(movieId);
    
    // Cargar películas similares
    loadSimilarMovies(movieId);
    
    // Cargar recomendaciones
    loadRecommendations(movieId);
}

/**
 * Cargar detalles de la película
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de detalles de película
 */
async function loadMovieDetails(movieId) {
    // TODO: Implementar carga de detalles
    const container = document.getElementById('movieDetailContainer');
    
    if (!container) return;
    
    // Mostrar loading
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando detalles...</p>
        </div>
    `;
    
    try {
        const movie = await getMovieDetails(movieId);
        renderMovieDetails(movie);
        
    } catch (error) {
        console.error('Error cargando detalles:', error);
        showError('Error al cargar detalles de la película');
    }
}

/**
 * Renderizar detalles de la película
 * @param {object} movie - Datos de la película
 * 
 * TODO: Implementar renderizado de detalles
 */
function renderMovieDetails(movie) {
    // TODO: Implementar renderizado de detalles
    const container = document.getElementById('movieDetailContainer');
    
    if (!container) return;
    
    const isFav = isFavorite(movie.id);
    const posterUrl = getImageUrl(movie.poster_path, 'w500');
    const backdropUrl = getBackdropUrl(movie.backdrop_path);
    const releaseDate = formatDate(movie.release_date);
    const runtime = formatRuntime(movie.runtime);
    const rating = formatRating(movie.vote_average);
    const genres = formatGenres(movie.genres);
    
    container.innerHTML = `
        <div class="movie-detail-header" style="background-image:  var(--movie-detail-header-background), url('${backdropUrl}'); background-size: cover; background-position: center;">
                <div class="movie-detail-header-content" >
                    <img src="${posterUrl}" alt="${movie.title}" class="movie-detail-poster" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
                    
                    <div class="movie-detail-info">
                        <h1 class="movie-detail-title">${movie.title}</h1>
                        
                        <div class="movie-detail-meta">
                            <span>${releaseDate}</span>
                            <span>•</span>
                            <span>${runtime}</span>
                            <span>•</span>
                            <span>⭐ ${rating}</span>
                        </div>
                        
                        ${movie.tagline ? `<p class="movie-detail-tagline">"${movie.tagline}"</p>` : ''}
                        
                        <div class="movie-detail-genres">
                            ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                        </div>
                        
                        <p class="movie-detail-overview">${movie.overview}</p>
                        
                        <div class="movie-detail-actions">
                            <button class="btn btn-primary" id="watchTrailerBtn">
                                <span>▶</span> Ver Trailer
                            </button>
                            <button class="btn btn-outline favorite-btn ${isFav ? 'active' : ''}" id="favoriteBtn">
                                ${isFav ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos'}
                            </button>
                        </div>                    
                </div>
            </div>
        </div>
        
        <div class="movie-detail-stats" style="max-width: var(--container-max-width); margin: var(--spacing-2xl) auto; padding: 0 var(--container-padding);">
            <div class="stat-item">
                <div class="stat-value">${movie.vote_count}</div>
                <div class="stat-label">Votos</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${movie.budget ? '$' + (movie.budget / 1000000).toFixed(1) + 'M' : 'N/A'}</div>
                <div class="stat-label">Presupuesto</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${movie.revenue ? '$' + (movie.revenue / 1000000).toFixed(1) + 'M' : 'N/A'}</div>
                <div class="stat-label">Recaudación</div>
            </div>
        </div>
        
        <div class="movie-detail-section" style="max-width: var(--container-max-width); margin: 0 auto var(--spacing-2xl); padding: 0 var(--container-padding);">
            <h2 class="movie-detail-section-title">Elenco</h2>
            <div class="cast-grid" id="castGrid"></div>
        </div>
        
        <div class="movie-detail-section" style="max-width: var(--container-max-width); margin: 0 auto var(--spacing-2xl); padding: 0 var(--container-padding);">
            <h2 class="movie-detail-section-title">Películas Similares</h2>
            <div class="movies-grid" id="similarGrid"></div>
        </div>
        
        <div class="movie-detail-section" style="max-width: var(--container-max-width); margin: 0 auto var(--spacing-2xl); padding: 0 var(--container-padding);">
            <h2 class="movie-detail-section-title">Recomendaciones</h2>
            <div class="movies-grid" id="recommendationsGrid"></div>
        </div>
    `;
    
    // Event listeners
    initDetailEventListeners(movie);
}

/**
 * Inicializar event listeners de detalles
 * @param {object} movie - Datos de la película
 * 
 * TODO: Implementar event listeners de detalles
 */
function initDetailEventListeners(movie) {
    // TODO: Implementar event listeners
    
    const watchTrailerBtn = document.getElementById('watchTrailerBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    watchTrailerBtn?.addEventListener('click', () => {
        // TODO: Obtener trailer y abrir modal
        console.log('Ver trailer', movie.id);
    });
    
    favoriteBtn?.addEventListener('click', () => {
        const isNowFavorite = toggleFavorite(movie.id, movie);
        favoriteBtn.classList.toggle('active', isNowFavorite);
        favoriteBtn.textContent = isNowFavorite ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos';
    });
}

/**
 * Cargar créditos/elenco
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de créditos
 */
async function loadMovieCredits(movieId) {
    // TODO: Implementar carga de créditos
    const castGrid = document.getElementById('castGrid');
    
    if (!castGrid) return;
    
    try {
        const credits = await getMovieCredits(movieId);
        renderCast(credits.cast);
        
    } catch (error) {
        console.error('Error cargando créditos:', error);
    }
}

/**
 * Renderizar elenco
 * @param {Array} cast - Array de actores
 * 
 * TODO: Implementar renderizado de elenco
 */
function renderCast(cast) {
    // TODO: Implementar renderizado de elenco
    const castGrid = document.getElementById('castGrid');
    
    if (!castGrid) return;
    
    if (!cast || cast.length === 0) {
        castGrid.innerHTML = '<p>No hay información del elenco disponible.</p>';
        return;
    }
    
    castGrid.innerHTML = cast.slice(0, 10).map(actor => `
        <div class="cast-card">
            <img src="${actor.profile_path ? getImageUrl(actor.profile_path, 'w185') : 'https://placehold.co/185x278/1a1a1a/ffffff?text=No+Photo'}" 
                 alt="${actor.name}" 
                 class="cast-photo"
                 loading="lazy">
            <div class="cast-info">
                <h4 class="cast-name">${actor.name}</h4>
                <p class="cast-character">${actor.character}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Cargar videos/trailers
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de videos
 */
async function loadMovieVideos(movieId) {
    // TODO: Implementar carga de videos
    try {
        const videos = await getMovieVideos(movieId);
        
        // Guardar el primer trailer para el botón de "Ver Trailer"
        const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        
        if (trailer) {
            const watchTrailerBtn = document.getElementById('watchTrailerBtn');
            if (watchTrailerBtn) {
                watchTrailerBtn.onclick = () => openModal(trailer.key);
            }
        }
        
    } catch (error) {
        console.error('Error cargando videos:', error);
    }
}

/**
 * Cargar películas similares
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de películas similares
 */
async function loadSimilarMovies(movieId) {
    // TODO: Implementar carga de películas similares
    const similarGrid = document.getElementById('similarGrid');
    
    if (!similarGrid) return;
    
    try {
        const data = await getSimilarMovies(movieId);
        renderMovieCards(data.results, similarGrid);
        
    } catch (error) {
        console.error('Error cargando películas similares:', error);
    }
}

/**
 * Cargar recomendaciones
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de recomendaciones
 */
async function loadRecommendations(movieId) {
    // TODO: Implementar carga de recomendaciones
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    
    if (!recommendationsGrid) return;
    
    try {
        const data = await getMovieRecommendations(movieId);
        renderMovieCards(data.results, recommendationsGrid);
        
    } catch (error) {
        console.error('Error cargando recomendaciones:', error);
    }
}

/**
 * Mostrar error
 * @param {string} message - Mensaje de error
 * 
 * TODO: Implementar mostrado de error
 */
function showError(message) {
    // TODO: Implementar mostrado de error
    const container = document.getElementById('movieDetailContainer');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">❌</div>
            <h3>Error</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="window.history.back()">Volver</button>
        </div>
    `;
}
