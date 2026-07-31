/**
 * Modal Component
 * 
 * Componente para manejar modales, especialmente para mostrar trailers.
 */

/**
 * Inicializar modal
 * 
 * TODO: Implementar inicialización del modal
 * Debe registrar event listeners para abrir y cerrar el modal
 */
export function initModal() {
    // TODO: Implementar inicialización del modal
    
    const modal = document.getElementById('trailerModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (!modal) return;
    
    // Cerrar al click en overlay
    modalOverlay?.addEventListener('click', () => {
        closeModal();
    });
    
    // Cerrar al click en botón de cerrar
    modalClose?.addEventListener('click', () => {
        closeModal();
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Abrir modal con video
 * @param {string} videoKey - Key del video de YouTube
 * 
 * TODO: Implementar apertura de modal con video
 */
export function openModal(videoKey) {
    // TODO: Implementar apertura de modal
    const modal = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailerIframe');
    
    if (!modal || !trailerIframe) return;
    
    // Validar la key para evitar inyección de URLs arbitrarias en el iframe
    if (!/^[A-Za-z0-9_-]{5,32}$/.test(String(videoKey))) return;
    
    // Construir URL de YouTube embed
    const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`;
    trailerIframe.src = embedUrl;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

/**
 * Cerrar modal
 * 
 * TODO: Implementar cierre de modal
 */
export function closeModal() {
    // TODO: Implementar cierre de modal
    const modal = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailerIframe');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll del body
    
    // Limpiar src del iframe para detener el video
    if (trailerIframe) {
        setTimeout(() => {
            trailerIframe.src = '';
        }, 300);
    }
}

/**
 * Abrir modal con contenido personalizado
 * @param {string} content - Contenido HTML
 * 
 * TODO: Implementar apertura de modal con contenido personalizado
 */
export function openModalWithContent(content) {
    // TODO: Implementar apertura de modal con contenido personalizado
    const modal = document.getElementById('trailerModal');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
