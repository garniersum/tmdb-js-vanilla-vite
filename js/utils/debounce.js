/**
 * Debounce Utility
 * 
 * Implementación específica de debounce para ser usada
 * en la búsqueda y otros eventos que necesitan ser retardados.
 */

/**
 * Debounce function - Retrasa la ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms (default: 300)
 * @returns {Function} Función con debounce
 * 
 * Esta función es especialmente útil para:
 * - Búsqueda: no ejecutar en cada tecla, sino después de que el usuario deje de escribir
 * - Resize events: no recalcular en cada pixel de cambio
 * - Scroll events: no ejecutar en cada pixel de scroll
 * 
 * TODO: Esta función ya está implementada, pero entiende cómo funciona:
 * 1. Crea un timeout variable fuera de la función retornada
 * 2. Cada vez que se ejecuta la función, limpia el timeout anterior
 * 3. Crea un nuevo timeout que ejecutará la función después de 'wait' ms
 * 4. Retorna la función con el comportamiento de debounce
 */
export function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Debounce inmediato - Ejecuta inmediatamente y luego debounces
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce inmediato
 * 
 * TODO: Implementar si necesitas que la primera ejecución sea inmediata
 */
export function debounceImmediate(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const callNow = !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
        }, wait);
        
        if (callNow) {
            func(...args);
        }
    };
}
