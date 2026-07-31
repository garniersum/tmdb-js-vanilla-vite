/**
 * Movie Card Component
 * 
 * Componente para renderizar tarjetas de películas individuales.
 */

import { getImageUrl } from '../config/tmdb.config.js';
import { formatYear, formatRating } from '../utils/formatters.js';
import { isFavorite } from '../services/storage.service.js';
import { navigateTo } from '../services/router.service.js';
import { escapeHtml } from '../utils/helpers.js';
import { bindFavoriteButton, renderFavoriteLabel } from './favorite-button.js';
import { renderEmptyState } from '../utils/ui-state.js';

/**
 * Construir el markup base de una tarjeta con poster
 * @param {object} data - { posterUrl, title, metaHtml, actionsHtml }
 * @returns {string} Markup de la tarjeta
 */
export function buildPosterCardMarkup({ posterUrl, title, metaHtml = '', actionsHtml = '' }) {
    return `
        <div class="movie-poster">
            <img data-src="${escapeHtml(posterUrl)}" alt="${escapeHtml(title)}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${escapeHtml(title)}</h3>
            <div class="movie-meta">${metaHtml}</div>
        </div>
        ${actionsHtml}
    `;
}

/**
 * Crear elemento de tarjeta de película
 * @param {object} movie - Datos de la película
 * @param {object} options - Opciones adicionales
 * @returns {HTMLElement} Elemento de tarjeta
 * 
 * TODO: Implementar creación de tarjeta de película
 * Debe crear un elemento HTML con la estructura de .movie-card
 */
export function createMovieCard(movie, options = {}) {
    // TODO: Implementar creación de tarjeta
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.movieId = movie.id;
    
    const posterUrl = getImageUrl(movie.poster_path, 'w500');
    const year = formatYear(movie.release_date);
    const rating = formatRating(movie.vote_average);
    const isFav = isFavorite(movie.id);
    
    card.innerHTML = buildPosterCardMarkup({
        posterUrl,
        title: movie.title,
        metaHtml: `
                <span class="movie-year">${escapeHtml(year)}</span>
                <span class="movie-rating">⭐ ${escapeHtml(rating)}</span>
        `,
        actionsHtml: `
        <div class="movie-card-actions">
            <button class="action-btn favorite-btn ${isFav ? 'active' : ''}" data-action="favorite" title="Agregar a favoritos">
                ${renderFavoriteLabel(isFav)}
            </button>
            <button class="action-btn" data-action="details" title="Ver detalles">
                ℹ️
            </button>
        </div>
        `
    });
    
    // Event listeners
    initCardEvents(card, movie);
    
    return card;
}

/**
 * Inicializar eventos de la tarjeta
 * @param {HTMLElement} card - Elemento de tarjeta
 * @param {object} movie - Datos de la película
 * 
 * TODO: Implementar eventos de la tarjeta
 */
function initCardEvents(card, movie) {
    // TODO: Implementar eventos de la tarjeta
    
    // Click en la tarjeta (navegar a detalles)
    card.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn')) return; // No navegar si click en botón de acción
        navigateTo('movie', { id: movie.id });
    });
    
    // Botón de favoritos
    bindFavoriteButton(card.querySelector('[data-action="favorite"]'), movie, { stopPropagation: true });
    
    // Botón de detalles
    const detailsBtn = card.querySelector('[data-action="details"]');
    detailsBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateTo('movie', { id: movie.id });
    });
}

/**
 * Renderizar múltiples tarjetas
 * @param {Array} movies - Array de películas
 * @param {HTMLElement} container - Contenedor donde renderizar
 * @param {object} options - Opciones adicionales
 * 
 * TODO: Implementar renderizado múltiple de tarjetas
 */
export function renderMovieCards(movies, container, options = {}) {
    // TODO: Implementar renderizado múltiple
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        renderEmptyState(container, {
            title: 'No hay películas para mostrar',
            message: 'Intenta con otra búsqueda o categoría'
        });
        return;
    }
    
    appendMovieCards(movies, container, options);
}

/**
 * Agregar tarjetas a un contenedor sin limpiar su contenido
 * @param {Array} movies - Array de películas
 * @param {HTMLElement} container - Contenedor donde renderizar
 * @param {object} options - Opciones adicionales
 */
export function appendMovieCards(movies, container, options = {}) {
    if (!container || !movies || movies.length === 0) return;
    
    const fragment = document.createDocumentFragment();
    
    movies.forEach(movie => {
        fragment.appendChild(createMovieCard(movie, options));
    });
    
    container.appendChild(fragment);
}

/**
 * Renderizar skeletons de carga
 * @param {HTMLElement} container - Contenedor
 * @param {number} count - Cantidad de skeletons
 * 
 * TODO: Implementar renderizado de skeletons
 */
export function renderSkeletons(container, count = 4) {
    // TODO: Implementar renderizado de skeletons
    if (!container) return;
    
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'movie-card skeleton';
        skeleton.innerHTML = `
            <div class="movie-poster skeleton-poster"></div>
            <div class="movie-info">
                <div class="movie-title skeleton-text"></div>
                <div class="movie-meta skeleton-text"></div>
            </div>
        `;
        fragment.appendChild(skeleton);
    }
    
    container.appendChild(fragment);
}

/**
 * Actualizar tarjeta con nuevos datos
 * @param {HTMLElement} card - Elemento de tarjeta
 * @param {object} movie - Nuevos datos de la película
 * 
 * TODO: Implementar actualización de tarjeta
 */
export function updateMovieCard(card, movie) {
    // TODO: Implementar actualización de tarjeta
    if (!card) return;
    
    const poster = card.querySelector('.movie-poster img');
    const title = card.querySelector('.movie-title');
    const year = card.querySelector('.movie-year');
    const rating = card.querySelector('.movie-rating');
    
    if (poster) {
        poster.src = getImageUrl(movie.poster_path, 'w500');
        poster.alt = movie.title;
    }
    
    if (title) {
        title.textContent = movie.title;
    }
    
    if (year) {
        year.textContent = formatYear(movie.release_date);
    }
    
    if (rating) {
        rating.textContent = `⭐ ${formatRating(movie.vote_average)}`;
    }
}
