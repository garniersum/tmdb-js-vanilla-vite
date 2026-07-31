/**
 * Search History Component
 *
 * Renderizado compartido del historial de búsqueda usado por
 * la barra de búsqueda y la vista de búsqueda.
 */

import { getSearchHistory, clearSearchHistory } from '../services/storage.service.js';
import { escapeHtml } from '../utils/helpers.js';

/**
 * Renderizar la lista del historial de búsqueda
 * @param {Function} onSelect - Callback con el término seleccionado
 * @returns {Array} Historial renderizado
 */
export function renderSearchHistory(onSelect) {
    const historyList = document.getElementById('historyList');
    const searchHistory = document.getElementById('searchHistory');

    if (!historyList) return [];

    const history = getSearchHistory();

    if (history.length === 0) {
        searchHistory?.classList.add('hidden');
        historyList.innerHTML = '';
        return history;
    }

    searchHistory?.classList.remove('hidden');

    historyList.innerHTML = history.map(item => `
        <span class="history-item" data-query="${escapeHtml(item)}">${escapeHtml(item)}</span>
    `).join('');

    historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => onSelect(item.dataset.query));
    });

    return history;
}

/**
 * Inicializar el historial de búsqueda junto a su botón de limpiar
 * @param {Function} onSelect - Callback con el término seleccionado
 */
export function initSearchHistory(onSelect) {
    const historyList = document.getElementById('historyList');

    if (!historyList) return;

    renderSearchHistory(onSelect);

    document.getElementById('clearHistory')?.addEventListener('click', () => {
        clearSearchHistory();
        renderSearchHistory(onSelect);
    });
}
