/**
 * Search Bar Component
 * 
 * Componente para manejar la barra de búsqueda con debounce
 * y sugerencias de búsqueda.
 */

import { debounce } from '../utils/debounce.js';
import { navigateTo } from '../services/router.service.js';
import { addToSearchHistory, getSearchHistory, clearSearchHistory } from '../services/storage.service.js';

/**
 * Inicializar barra de búsqueda
 * 
 * TODO: Implementar inicialización de barra de búsqueda
 * Debe:
 * 1. Registrar event listener para input con debounce
 * 2. Mostrar sugerencias de búsqueda
 * 3. Manejar submit de búsqueda
 * 4. Mostrar historial de búsqueda
 */
export function initSearchBar() {
    // TODO: Implementar inicialización de barra de búsqueda
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput) return;
    
    // Event listener para input con debounce
    const debouncedSearch = debounce(handleSearchInput, 300);
    searchInput.addEventListener('input', debouncedSearch);
    
    // Event listener para submit
    searchButton?.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    // Event listener para Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
    
    // Cerrar sugerencias al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!searchSuggestions?.contains(e.target) && !searchInput?.contains(e.target)) {
            searchSuggestions?.classList.remove('active');
        }
    });
}

/**
 * Manejar input de búsqueda
 * 
 * TODO: Implementar manejo de input
 * Debe mostrar sugerencias mientras el usuario escribe
 */
function handleSearchInput(e) {
    // TODO: Implementar manejo de input
    const query = e.target.value.trim();
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (query.length < 2) {
        searchSuggestions?.classList.remove('active');
        return;
    }
    
    // TODO: Aquí deberías llamar a la API para obtener sugerencias
    // Por ahora, muestra el historial de búsqueda
    showSearchSuggestions(query);
}

/**
 * Mostrar sugerencias de búsqueda
 * @param {string} query - Término de búsqueda
 * 
 * TODO: Implementar mostrado de sugerencias
 */
function showSearchSuggestions(query) {
    // TODO: Implementar mostrado de sugerencias
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchSuggestions) return;
    
    // Por ahora, mostrar historial que coincida con la query
    const history = getSearchHistory();
    const filtered = history.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="suggestion-item">
                <span class="suggestion-info">Presiona Enter para buscar "${query}"</span>
            </div>
        `;
    } else {
        searchSuggestions.innerHTML = filtered.map(item => `
            <div class="suggestion-item" data-query="${item}">
                <span class="suggestion-info">🕐 ${item}</span>
            </div>
        `).join('');
        
        // Event listeners para sugerencias
        searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestionQuery = item.dataset.query;
                performSearch(suggestionQuery);
            });
        });
    }
    
    searchSuggestions.classList.add('active');
}

/**
 * Realizar búsqueda
 * @param {string} query - Término de búsqueda
 * 
 * TODO: Implementar ejecución de búsqueda
 */
function performSearch(query) {
    // TODO: Implementar ejecución de búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // Agregar al historial
    addToSearchHistory(query);
    
    // Limpiar input
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Cerrar sugerencias
    if (searchSuggestions) {
        searchSuggestions.classList.remove('active');
    }
    
    // Navegar a vista de búsqueda
    navigateTo('search', { q: query });
}

/**
 * Inicializar historial de búsqueda
 * 
 * TODO: Implementar inicialización de historial
 */
export function initSearchHistory() {
    // TODO: Implementar inicialización de historial
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    if (!historyList) return;
    
    renderSearchHistory();
    
    clearHistoryBtn?.addEventListener('click', () => {
        clearSearchHistory();
        renderSearchHistory();
    });
}

/**
 * Renderizar historial de búsqueda
 * 
 * TODO: Implementar renderizado de historial
 */
function renderSearchHistory() {
    // TODO: Implementar renderizado de historial
    const historyList = document.getElementById('historyList');
    const searchHistory = document.getElementById('searchHistory');
    
    if (!historyList) return;
    
    const history = getSearchHistory();
    
    if (history.length === 0) {
        searchHistory?.classList.add('hidden');
        return;
    }
    
    searchHistory?.classList.remove('hidden');
    
    historyList.innerHTML = history.map(item => `
        <span class="history-item" data-query="${item}">${item}</span>
    `).join('');
    
    // Event listeners para items del historial
    historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            performSearch(query);
        });
    });
}

/**
 * Limpiar barra de búsqueda
 * 
 * TODO: Implementar limpieza de barra de búsqueda
 */
export function clearSearchBar() {
    // TODO: Implementar limpieza de barra de búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (searchSuggestions) {
        searchSuggestions.classList.remove('active');
        searchSuggestions.innerHTML = '';
    }
}
