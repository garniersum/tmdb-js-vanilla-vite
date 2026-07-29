/**
 * Formatters
 * 
 * Utilidades para formatear datos como fechas, ratings, monedas, etc.
 */

/**
 * Formatear fecha
 * @param {string} dateString - Fecha en formato ISO (ej: '2024-01-15')
 * @param {string} locale - Locale para formateo (default: 'es-ES')
 * @param {object} options - Opciones de formateo de fecha
 * @returns {string} Fecha formateada
 * 
 * TODO: Implementar formateo de fecha
 * Pista: Usa new Date() y Intl.DateTimeFormat o toLocaleDateString()
 */
export function formatDate(dateString, locale = 'es-ES', options = {}) {
    // TODO: Implementar formateo de fecha
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
}

/**
 * Formatear año
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Año (ej: '2024')
 * 
 * TODO: Implementar extracción del año
 */
export function formatYear(dateString) {
    // TODO: Implementar extracción del año
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
}

/**
 * Formatear rating/voto
 * @param {number} rating - Rating de 0 a 10
 * @param {number} maxRating - Rating máximo (default: 10)
 * @returns {string} Rating formateado (ej: '8.5/10')
 * 
 * TODO: Implementar formateo de rating
 */
export function formatRating(rating, maxRating = 10) {
    // TODO: Implementar formateo de rating
    if (rating === null || rating === undefined) return 'N/A';
    return `${rating.toFixed(1)}/${maxRating}`;
}

/**
 * Formatear duración
 * @param {number} minutes - Duración en minutos
 * @returns {string} Duración formateada (ej: '2h 30min')
 * 
 * TODO: Implementar formateo de duración
 * Pista: Calcula horas y minutos
 */
export function formatRuntime(minutes) {
    // TODO: Implementar formateo de duración
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
        return `${mins}min`;
    }
    
    if (mins === 0) {
        return `${hours}h`;
    }
    
    return `${hours}h ${mins}min`;
}

/**
 * Formatear moneda
 * @param {number} amount - Monto
 * @param {string} currency - Código de moneda (default: 'USD')
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Monto formateado (ej: '$1,000,000')
 * 
 * TODO: Implementar formateo de moneda
 * Pista: Usa Intl.NumberFormat
 */
export function formatCurrency(amount, currency = 'USD', locale = 'es-ES') {
    // TODO: Implementar formateo de moneda
    if (!amount) return 'N/A';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Formatear número con separadores de miles
 * @param {number} num - Número a formatear
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Número formateado (ej: '1,000,000')
 * 
 * TODO: Implementar formateo de número
 */
export function formatNumber(num, locale = 'es-ES') {
    // TODO: Implementar formateo de número
    if (num === null || num === undefined) return 'N/A';
    
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (default: '...')
 * @returns {string} Texto truncado
 * 
 * TODO: Implementar truncado de texto
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
    // TODO: Implementar truncado de texto
    if (!text) return '';
    
    if (text.length <= maxLength) {
        return text;
    }
    
    return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalizar primera letra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 * 
 * TODO: Implementar capitalización
 */
export function capitalize(text) {
    // TODO: Implementar capitalización
    if (!text) return '';
    
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatear género
 * @param {Array} genres - Array de géneros
 * @param {string} separator - Separador (default: ', ')
 * @returns {string} Géneros formateados
 * 
 * TODO: Implementar formateo de géneros
 */
export function formatGenres(genres, separator = ', ') {
    // TODO: Implementar formateo de géneros
    if (!genres || !Array.isArray(genres)) return 'N/A';
    
    return genres.map(genre => genre.name).join(separator);
}

/**
 * Formatear porcentaje
 * @param {number} value - Valor
 * @param {number} total - Total
 * @returns {string} Porcentaje formateado
 * 
 * TODO: Implementar formateo de porcentaje
 */
export function formatPercentage(value, total) {
    // TODO: Implementar formateo de porcentaje
    if (!total || total === 0) return '0%';
    
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
}

/**
 * Formatear tiempo relativo (ej: "hace 2 horas")
 * @param {string} dateString - Fecha
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Tiempo relativo
 * 
 * TODO: Implementar formateo de tiempo relativo
 * Pista: Usa Intl.RelativeTimeFormat
 */
export function formatRelativeTime(dateString, locale = 'es-ES') {
    // TODO: Implementar formateo de tiempo relativo
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (diffInSeconds < 60) {
        return rtf.format(-Math.floor(diffInSeconds), 'second');
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
}
