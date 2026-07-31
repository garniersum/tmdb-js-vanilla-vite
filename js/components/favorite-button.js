/**
 * Favorite Button Component
 *
 * Lógica compartida del botón de favoritos usado en las tarjetas
 * y en la vista de detalles.
 */

import { toggleFavorite } from '../services/storage.service.js';

const ICON_LABELS = {
    active: '❤️',
    inactive: '🤍'
};

const TEXT_LABELS = {
    active: '❤️ En Favoritos',
    inactive: '🤍 Agregar a Favoritos'
};

/**
 * Obtener la etiqueta del botón de favoritos
 * @param {boolean} isFav - Si la película es favorita
 * @param {boolean} withText - Incluir texto además del icono
 * @returns {string} Etiqueta del botón
 */
export function renderFavoriteLabel(isFav, withText = false) {
    const labels = withText ? TEXT_LABELS : ICON_LABELS;
    return isFav ? labels.active : labels.inactive;
}

/**
 * Registrar el comportamiento de toggle en un botón de favoritos
 * @param {HTMLElement} button - Botón de favoritos
 * @param {object} movie - Datos de la película
 * @param {object} options - { withText, stopPropagation }
 */
export function bindFavoriteButton(button, movie, options = {}) {
    if (!button) return;

    const { withText = false, stopPropagation = false } = options;

    button.addEventListener('click', (e) => {
        if (stopPropagation) {
            e.stopPropagation();
        }

        const isNowFavorite = toggleFavorite(movie.id, movie);
        button.classList.toggle('active', isNowFavorite);
        button.textContent = renderFavoriteLabel(isNowFavorite, withText);
    });
}
