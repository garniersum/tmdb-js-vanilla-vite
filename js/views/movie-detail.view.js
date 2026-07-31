/**
 * Movie Detail View
 * 
 * Vista de detalles de una película individual.
 * Muestra información completa, elenco, videos, películas similares, etc.
 */

import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieRecommendations } from '../services/tmdb.service.js';
import { getImageUrl, getBackdropUrl, getProfileUrl } from '../config/tmdb.config.js';
import { formatDate, formatRuntime, formatRating, formatGenres } from '../utils/formatters.js';
import { loadMovieGrid } from '../components/movie-grid.js';
import { bindFavoriteButton, renderFavoriteLabel } from '../components/favorite-button.js';
import { openModal } from '../components/modal.js';
import { isFavorite } from '../services/storage.service.js';
import { escapeHtml } from '../utils/helpers.js';
import { renderLoadingState, renderErrorState } from '../utils/ui-state.js';

/**
 * Inicializar vista de detalles de película
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar inicialización de vista de detalles
 */
export function initMovieDetailView(movieId) {
    // TODO: Implementar inicialización de vista de detalles
    
    if (!/^\d+$/.test(String(movieId))) {
        showError('ID de película no válido');
        return;
    }
    
    // Cargar detalles de la película
    loadMovieDetails(movieId);
    
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
    renderLoadingState(container, 'Cargando detalles...');
    
    try {
        const movie = await getMovieDetails(movieId);
        renderMovieDetails(movie);

        // Cargar créditos/elenco
        loadMovieCredits(movieId);
        
        // Cargar videos/trailers
        loadMovieVideos(movieId);
    
        // Cargar películas similares
        loadSimilarMovies(movieId);
        
        // Cargar recomendaciones
        loadRecommendations(movieId);
        
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
        <div class="movie-detail-header" style="background-image:  var(--movie-detail-header-background), url('${encodeURI(backdropUrl)}'); background-size: cover; background-position: center;">
                <div class="movie-detail-header-content" >
                    <img src="${escapeHtml(posterUrl)}" alt="${escapeHtml(movie.title)}" class="movie-detail-poster" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
                    
                    <div class="movie-detail-info">
                        <h1 class="movie-detail-title">${escapeHtml(movie.title)}</h1>
                        
                        <div class="movie-detail-meta">
                            <span>${escapeHtml(releaseDate)}</span>
                            <span>•</span>
                            <span>${escapeHtml(runtime)}</span>
                            <span>•</span>
                            <span>⭐ ${escapeHtml(rating)}</span>
                        </div>
                        
                        ${movie.tagline ? `<p class="movie-detail-tagline">"${escapeHtml(movie.tagline)}"</p>` : ''}
                        
                        <div class="movie-detail-genres">
                            ${(movie.genres || []).map(genre => `<span class="genre-tag">${escapeHtml(genre.name)}</span>`).join('')}
                        </div>
                        
                        <p class="movie-detail-overview">${escapeHtml(movie.overview)}</p>
                        
                        <div class="movie-detail-actions">
                            <button class="btn btn-primary" id="watchTrailerBtn">
                                <span>▶</span> Ver Trailer
                            </button>
                            <button class="btn btn-outline favorite-btn ${isFav ? 'active' : ''}" id="favoriteBtn">
                                ${renderFavoriteLabel(isFav, true)}
                            </button>
                        </div>                    
                </div>
            </div>
        </div>
        
        <div class="movie-detail-stats" style="max-width: var(--container-max-width); margin: var(--spacing-2xl) auto; padding: 0 var(--container-padding);">
            <div class="stat-item">
                <div class="stat-value">${escapeHtml(movie.vote_count)}</div>
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
            <h2 class="movie-detail-section-title">Recomendaciones</h2>
            <div class="movies-grid" id="recommendationsGrid"></div>
        </div>
        
        <div class="movie-detail-section" style="max-width: var(--container-max-width); margin: 0 auto var(--spacing-2xl); padding: 0 var(--container-padding);">
            <h2 class="movie-detail-section-title">Películas Similares</h2>
            <div class="movies-grid" id="similarGrid"></div>
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
    
    watchTrailerBtn?.addEventListener('click', () => {
        // TODO: Obtener trailer y abrir modal
        console.log('Ver trailer', movie.id);
    });
    
    bindFavoriteButton(document.getElementById('favoriteBtn'), movie, { withText: true });
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
        castGrid.innerHTML = '<p class="section-error">No se pudo cargar el elenco.</p>';
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
            <img src="${escapeHtml(getProfileUrl(actor.profile_path, 'w185'))}" 
                 alt="${escapeHtml(actor.name)}" 
                 class="cast-photo"
                 loading="lazy">
            <div class="cast-info">
                <h4 class="cast-name">${escapeHtml(actor.name)}</h4>
                <p class="cast-character">${escapeHtml(actor.character)}</p>
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
        
        // Usar cualquier video disponible (Trailer, Teaser, Clip, etc.)
        const video = videos.results.find(v => v.site === 'YouTube');
        
        if (video) {
            const watchTrailerBtn = document.getElementById('watchTrailerBtn');
            if (watchTrailerBtn) {
                watchTrailerBtn.onclick = () => openModal(video.key);
            }
        } else {
            // Si no hay videos, deshabilitar el botón
            const watchTrailerBtn = document.getElementById('watchTrailerBtn');
            if (watchTrailerBtn) {
                watchTrailerBtn.disabled = true;
                watchTrailerBtn.textContent = '❌ No hay video';
                watchTrailerBtn.style.opacity = '0.5';
                watchTrailerBtn.style.cursor = 'not-allowed';
            }
        }
        
    } catch (error) {
        console.error('Error cargando videos:', error);
        const watchTrailerBtn = document.getElementById('watchTrailerBtn');
        if (watchTrailerBtn) {
            watchTrailerBtn.disabled = true;
            watchTrailerBtn.textContent = '❌ Trailer no disponible';
            watchTrailerBtn.style.opacity = '0.5';
            watchTrailerBtn.style.cursor = 'not-allowed';
        }
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
    await loadMovieGrid({
        gridId: 'similarGrid',
        label: 'películas similares',
        showSkeletons: false,
        fetchMovies: () => getSimilarMovies(movieId)
    });
}

/**
 * Cargar recomendaciones
 * @param {number} movieId - ID de la película
 * 
 * TODO: Implementar carga de recomendaciones
 */
async function loadRecommendations(movieId) {
    // TODO: Implementar carga de recomendaciones
    await loadMovieGrid({
        gridId: 'recommendationsGrid',
        label: 'recomendaciones',
        showSkeletons: false,
        fetchMovies: () => getMovieRecommendations(movieId)
    });
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

    renderErrorState(container, {
        message,
        actionHtml: '<button class="btn btn-primary" id="errorBackBtn">Volver</button>'
    });

    container?.querySelector('#errorBackBtn')?.addEventListener('click', () => window.history.back());
}
