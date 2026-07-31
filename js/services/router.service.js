/**
 * Router Service
 * 
 * Este servicio maneja el sistema de routing hash-based para la SPA.
 * Permite navegar entre diferentes vistas sin recargar la página.
 */

/**
 * Navegar a una ruta específica
 * @param {string} route - Ruta a navegar (ej: 'home', 'movie/123', 'search?q=term')
 * @param {object} params - Parámetros adicionales
 * 
 * TODO: Implementar navegación programática
 * Debe actualizar el hash de la URL
 */
export function navigateTo(route, params = {}) {
    // TODO: Implementar navegación
    // Pista: Construye el hash con los parámetros
    // Ejemplo: window.location.hash = `#${route}?${queryParams}`
    
    window.location.hash = createUrl(route, params);
}

/**
 * Obtener la ruta actual
 * @returns {object} { route, params }
 route: string (ej: 'movie', 'search')
 params: object (ej: { id: '123', q: 'term' })
 * 
 * TODO: Implementar obtención de la ruta actual
 * Debe parsear el hash de la URL
 */
export function getCurrentRoute() {
    // TODO: Implementar obtención de ruta actual
    // Pista: Usa window.location.hash
    // Pista: Usa URLSearchParams para parsear los query params
    
    const hash = window.location.hash.slice(1); // Remover el #
    if (!hash) {
        return { route: 'home', params: {} };
    }
    
    const [route, queryString] = hash.split('?');
    const params = {};
    
    if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
    }
    
    return { route, params };
}

/**
 * Parsear parámetros de ruta
 * @param {string} routePattern - Patrón de ruta (ej: 'movie/:id')
 * @param {string} actualRoute - Ruta actual (ej: 'movie/123')
 * @returns {object|null} Parámetros parseados o null si no coincide
 * 
 * TODO: Implementar parseo de parámetros de ruta
 * Útil para rutas como movie/123 donde 123 es un parámetro dinámico
 */
export function parseRouteParams(routePattern, actualRoute) {
    // TODO: Implementar parseo de parámetros de ruta
    // Pista: Divide ambas rutas por '/'
    // Pista: Compara segmento por segmento
    // Pista: Los segmentos que empiezan con ':' son parámetros
    
    const patternParts = routePattern.split('/');
    const actualParts = actualRoute.split('/');
    
    if (patternParts.length !== actualParts.length) {
        return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const actualPart = actualParts[i];
        
        if (patternPart.startsWith(':')) {
            const paramName = patternPart.slice(1);
            params[paramName] = actualPart;
        } else if (patternPart !== actualPart) {
            return null;
        }
    }
    
    return params;
}

/**
 * Inicializar el router
 * @param {function} callback - Función a ejecutar cuando cambia la ruta
 * 
 * TODO: Implementar inicialización del router
 * Debe escuchar cambios en el hash
 */
export function initRouter(callback) {
    // TODO: Implementar inicialización del router
    // Pista: Usa window.addEventListener('hashchange', ...)
    // Pista: Ejecuta el callback inmediatamente con la ruta actual
    
    const handleRouteChange = () => {
        const currentRoute = getCurrentRoute();
        callback(currentRoute);
    };
    
    window.addEventListener('hashchange', handleRouteChange);
    
    // Ejecutar callback con la ruta inicial
    handleRouteChange();
    
    // Retornar función de limpieza
    return () => {
        window.removeEventListener('hashchange', handleRouteChange);
    };
}

/**
 * Crear una URL con parámetros
 * @param {string} route - Ruta base
 * @param {object} params - Parámetros
 * @returns {string} URL completa con hash
 * 
 * TODO: Implementar creación de URLs
 */
export function createUrl(route, params = {}) {
    // TODO: Implementar creación de URLs
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `#${route}?${queryString}` : `#${route}`;
}
