/**
 * Helpers
 * 
 * Funciones helper generales para la aplicación
 */

import { observeIntersection } from './dom.js';

export { debounce, debounceImmediate, throttle } from './debounce.js';

/**
 * Lazy loading de imágenes
 * @param {string} selector - Selector CSS de las imágenes
 * 
 * Usa IntersectionObserver para cargar imágenes solo cuando son visibles
 */
export function lazyLoadImages(selector = 'img[data-src]') {
    observeIntersection(document.querySelectorAll(selector), (entry, observer) => {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}

/**
 * Clonar objeto profundamente
 * @param {object} obj - Objeto a clonar
 * @returns {object} Objeto clonado
 * 
 * TODO: Implementar deep clone
 */
export function deepClone(obj) {
    // TODO: Implementar deep clone
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    
    return clonedObj;
}

/**
 * Generar ID único
 * @returns {string} ID único
 * 
 * TODO: Implementar generador de ID único
 */
export function generateId() {
    // TODO: Implementar generador de ID único
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Mezclar array (shuffle)
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado
 * 
 * TODO: Implementar shuffle de array
 */
export function shuffleArray(array) {
    // TODO: Implementar shuffle
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

/**
 * Obtener elemento aleatorio del array
 * @param {Array} array - Array
 * @returns {*} Elemento aleatorio
 * 
 * TODO: Implementar selección aleatoria
 */
export function getRandomItem(array) {
    // TODO: Implementar selección aleatoria
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Agrupar array por propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad para agrupar
 * @returns {object} Objeto agrupado
 * 
 * TODO: Implementar agrupamiento
 */
export function groupBy(array, key) {
    // TODO: Implementar agrupamiento
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Filtrar array duplicados
 * @param {Array} array - Array a filtrar
 * @param {string} key - Propiedad para comparar (opcional)
 * @returns {Array} Array sin duplicados
 * 
 * TODO: Implementar filtro de duplicados
 */
export function removeDuplicates(array, key = null) {
    // TODO: Implementar filtro de duplicados
    if (!key) {
        return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

/**
 * Ordenar array por propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad para ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 * 
 * TODO: Implementar ordenamiento
 */
export function sortBy(array, key, order = 'asc') {
    // TODO: Implementar ordenamiento
    const sorted = [...array];
    
    sorted.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];
        
        if (valueA < valueB) {
            return order === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    return sorted;
}

/**
 * Chunk array - Dividir array en chunks
 * @param {Array} array - Array a dividir
 * @param {number} size - Tamaño de cada chunk
 * @returns {Array} Array de chunks
 * 
 * TODO: Implementar chunk
 */
export function chunk(array, size) {
    // TODO: Implementar chunk
    const chunks = [];
    
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    
    return chunks;
}

/**
 * Esperar (sleep)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del tiempo
 * 
 * TODO: Implementar sleep
 */
export function sleep(ms) {
    // TODO: Implementar sleep
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reintentar función con backoff
 * @param {Function} func - Función a reintentar
 * @param {number} maxRetries - Máximo de reintentos
 * @param {number} delay - Delay inicial en ms
 * @returns {Promise} Resultado de la función
 * 
 * TODO: Implementar retry con backoff
 */
export async function retryWithBackoff(func, maxRetries = 3, delay = 1000) {
    // TODO: Implementar retry con backoff
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await func();
        } catch (error) {
            lastError = error;
            if (i === maxRetries - 1) {
                throw error;
            }
            await sleep(delay * Math.pow(2, i));
        }
    }
    // Nunca retornar undefined silenciosamente (p. ej. si maxRetries < 1)
    throw lastError ?? new Error('retryWithBackoff: no se ejecutó ningún intento');
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 * 
 * TODO: Implementar validación de email
 */
export function isValidEmail(email) {
    // TODO: Implementar validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean} True si es válida
 * 
 * TODO: Implementar validación de URL
 */
export function isValidUrl(url) {
    // TODO: Implementar validación de URL
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Escapar HTML para prevenir XSS
 * Seguro tanto para contenido de texto como para valores de atributos entre comillas.
 * @param {string} str - String a escapar
 * @returns {string} String escapado
 */
export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Copiar al clipboard
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 * 
 * TODO: Implementar copiar al clipboard
 */
export async function copyToClipboard(text) {
    // TODO: Implementar copiar al clipboard
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch {
            document.body.removeChild(textArea);
            return false;
        }
    }
}
