/**
 * Person Detail View
 * 
 * Vista de detalles de una persona (actor/actriz).
 * Muestra información biográfica, filmografía, imágenes, etc.
 */

import { getPersonDetails, getPersonCredits } from '../services/tmdb.service.js';
import { getProfileUrl, getImageUrl } from '../config/tmdb.config.js';
import { formatDate } from '../utils/formatters.js';
import { navigateTo } from '../services/router.service.js';
import { lazyLoadImages } from '../utils/helpers.js';

/**
 * Inicializar vista de detalles de persona
 * @param {number} personId - ID de la persona
 */
export function initPersonDetailView(personId) {
    if (!personId) {
        showError('ID de persona no proporcionado');
        return;
    }
    
    // Cargar detalles de la persona
    loadPersonDetails(personId);
}

/**
 * Cargar detalles de la persona
 * @param {number} personId - ID de la persona
 */
async function loadPersonDetails(personId) {
    const container = document.getElementById('personDetailContainer');
    
    if (!container) return;
    
    // Mostrar loading
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando detalles...</p>
        </div>
    `;
    
    try {
        const person = await getPersonDetails(personId);
        renderPersonDetails(person);
        
        // Cargar créditos/filmografía
        loadPersonCredits(personId);
        
    } catch (error) {
        console.error('Error cargando detalles:', error);
        showError('Error al cargar detalles de la persona');
    }
}

/**
 * Renderizar detalles de la persona
 * @param {object} person - Datos de la persona
 */
function renderPersonDetails(person) {
    const container = document.getElementById('personDetailContainer');
    
    if (!container) return;
    
    const profileUrl = getProfileUrl(person.profile_path, 'h632');
    const birthday = person.birthday ? formatDate(person.birthday) : 'N/A';
    const deathday = person.deathday ? formatDate(person.deathday) : null;
    const placeOfBirth = person.place_of_birth || 'N/A';
    const knownFor = person.known_for_department || 'N/A';
    
    container.innerHTML = `
        <div class="person-detail-header">
            <div class="person-detail-content">
                <div class="person-detail-photo">
                    <img src="${profileUrl}" alt="${person.name}" class="person-profile-img">
                </div>
                
                <div class="person-detail-info">
                    <h1 class="person-detail-name">${person.name}</h1>
                    
                    <div class="person-detail-meta">
                        <span class="person-birthday">🎂 ${birthday}</span>
                        ${deathday ? `<span class="person-deathday">✝️ ${deathday}</span>` : ''}
                        <span class="person-place">📍 ${placeOfBirth}</span>
                        <span class="person-department">🎬 ${knownFor}</span>
                    </div>
                    
                    ${person.also_known_as && person.also_known_as.length > 0 ? `
                        <div class="person-also-known">
                            <h3>También conocido como:</h3>
                            <p>${person.also_known_as.join(', ')}</p>
                        </div>
                    ` : ''}
                    
                    ${person.biography ? `
                        <div class="person-biography">
                            <h3>Biografía</h3>
                            <p>${person.biography}</p>
                        </div>
                    ` : `
                        <div class="person-biography">
                            <p>No hay biografía disponible.</p>
                        </div>
                    `}
                    
                    <div class="person-detail-stats">
                        <div class="stat-item">
                            <div class="stat-value">${person.popularity.toFixed(1)}</div>
                            <div class="stat-label">Popularidad</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${person.gender === 1 ? 'Mujer' : person.gender === 2 ? 'Hombre' : 'N/A'}</div>
                            <div class="stat-label">Género</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${person.adult ? '18+' : 'Todos'}</div>
                            <div class="stat-label">Contenido</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="person-detail-section">
            <h2 class="person-detail-section-title">Películas Conocidas</h2>
            <div class="movies-grid" id="personMoviesGrid"></div>
        </div>
    `;
    
    // Aplicar fallback a la imagen de perfil
    const profileImg = container.querySelector('.person-profile-img');
    if (profileImg) {
        profileImg.onerror = function() {
            this.src = 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Photo';
        };
    }
}

/**
 * Cargar créditos/filmografía de la persona
 * @param {number} personId - ID de la persona
 */
async function loadPersonCredits(personId) {
    const moviesGrid = document.getElementById('personMoviesGrid');
    
    if (!moviesGrid) return;
    
    try {
        const credits = await getPersonCredits(personId);
        
        // Obtener películas conocidas (ordenadas por popularidad)
        const knownForMovies = credits.cast
            .filter(movie => movie.media_type === 'movie' || !movie.media_type)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 20);
        
        if (knownForMovies.length === 0) {
            moviesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎬</div>
                    <h3>No hay películas conocidas</h3>
                    <p>No se encontraron películas para esta persona</p>
                </div>
            `;
            return;
        }
        
        // Renderizar películas
        renderPersonMovies(knownForMovies, moviesGrid);
        
    } catch (error) {
        console.error('Error cargando créditos:', error);
        moviesGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h3>Error al cargar filmografía</h3>
                <p>Por favor, intenta nuevamente</p>
            </div>
        `;
    }
}

/**
 * Renderizar películas de la persona
 * @param {Array} movies - Array de películas
 * @param {HTMLElement} container - Contenedor donde renderizar
 */
function renderPersonMovies(movies, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    movies.forEach(movie => {
        const movieCard = createPersonMovieCard(movie);
        fragment.appendChild(movieCard);
    });
    
    container.appendChild(fragment);
    
    // Inicializar lazy loading
    lazyLoadImages();
}

/**
 * Crear tarjeta de película para la vista de persona
 * @param {object} movie - Datos de la película
 * @returns {HTMLElement} Elemento de tarjeta
 */
function createPersonMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.movieId = movie.id;
    
    const posterUrl = getImageUrl(movie.poster_path, 'w500');
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const character = movie.character ? `como ${movie.character}` : '';
    
    card.innerHTML = `
        <div class="movie-poster">
            <img data-src="${posterUrl}" alt="${movie.title}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${year}</span>
                <span class="movie-rating">⭐ ${rating}</span>
            </div>
            ${character ? `<p class="movie-character">${character}</p>` : ''}
        </div>
    `;
    
    // Event listener para navegar a detalles de película
    card.addEventListener('click', () => {
        navigateTo('movie', { id: movie.id });
    });
    
    // Fallback para imagen
    const img = card.querySelector('.movie-poster img');
    if (img) {
        img.onerror = function() {
            this.src = 'https://placehold.co/500x750/1a1a1a/ffffff?text=No+Image';
        };
    }
    
    return card;
}

/**
 * Mostrar error
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    const container = document.getElementById('personDetailContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}