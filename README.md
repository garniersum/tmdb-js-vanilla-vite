# TMDB Movie App - Guía de Aprendizaje

Proyecto de aplicación de películas construido con **JavaScript Vanilla**, HTML5 y CSS3 puro para aprender a consumir APIs REST.

## 🎯 Objetivo

Este proyecto está diseñado para que practiques el consumo de la API de TMDB (The Movie Database). Toda la estructura, componentes y estilos ya están implementados. Tu trabajo es implementar la lógica de consumo de la API.

## 📁 Estructura del Proyecto

```
tmdb-js-vanilla/
├── index.html                   # SPA principal
├── css/                         # Estilos CSS
│   ├── variables.css            # Variables CSS (temas)
│   ├── reset.css                # Reset y estilos base
│   ├── layout.css               # Layout y grid
│   ├── components.css           # Componentes UI
│   ├── views.css                # Estilos de vistas
│   └── main.css                 # Import principal
├── js/
│   ├── config/
│   │   └── tmdb.config.js       # Configuración de API
│   ├── services/
│   │   ├── tmdb.service.js      # Servicio de TMDB
│   │   ├── storage.service.js   # Servicio de LocalStorage
│   │   └── router.service.js    # Sistema de routing
│   ├── utils/
│   │   ├── formatters.js        # Formateo de datos
│   │   ├── helpers.js           # Funciones helper
│   │   └── debounce.js          # Utilidad de debounce
│   ├── components/
│   │   ├── navbar.js            # Componente navbar
│   │   ├── movie-card.js        # Componente tarjeta
│   │   ├── search-bar.js        # Componente búsqueda
│   │   ├── modal.js             # Componente modal
│   │   └── theme-toggle.js      # Componente tema
│   ├── views/
│   │   ├── home.view.js         # Vista principal
│   │   ├── movie-detail.view.js # Vista de detalles
│   │   ├── search.view.js       # Vista de búsqueda
│   │   └── favorites.view.js    # Vista de favoritos
│   └── main.js                  # Entry point
├── package.json                 # Dependencias y scripts
├── vite.config.js               # Configuración de Vite
├── vercel.json                  # Configuración de despliegue
├── .gitignore                   # Archivos ignorados por Git
├── .env.example                 # Ejemplo de variables de entorno
└── README.md                    # Esta guía
```

## 🚀 Guía de Aprendizaje Paso a Paso

Sigue estos pasos en orden para construir el proyecto progresivamente:

### Paso 1: Configurar la API Key de TMDB

**Archivo:** `js/config/tmdb.config.js`

1. Ve a [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Regístrate o inicia sesión
3. Ve a Settings > API > Create
4. Copia tu API key
5. Reemplaza `'YOUR_API_KEY'` en `js/config/tmdb.config.js` con tu API key real

```javascript
export const TMDB_CONFIG = {
    API_KEY: 'tu_api_key_aqui', // ← Reemplaza esto
    // ...
};
```

**¿Qué aprenderás?**
- Configuración de APIs
- Manejo de credenciales
- Variables de configuración

---

### Paso 2: Implementar la función base de fetch

**Archivo:** `js/services/tmdb.service.js`

Implementa la función `fetchFromTMDB(endpoint, params)` que será usada por todas las demás funciones.

**Pistas:**
- Usa `new URLSearchParams()` para construir query params
- Incluye `api_key` en los parámetros
- Usa `fetch()` para hacer la petición
- Maneja errores (404, 500, etc.)
- Retorna el JSON de la respuesta

```javascript
export async function fetchFromTMDB(endpoint, params = {}) {
    // Tu implementación aquí
}
```

**¿Qué aprenderás?**
- Fetch API
- Query parameters
- Manejo de errores HTTP
- Async/await

---

### Paso 3: Consumir el primer endpoint - Películas Populares

**Archivo:** `js/services/tmdb.service.js`

Implementa `getPopularMovies(page)`.

**Endpoint:** `/movie/popular`

**Datos esperados:**
```javascript
{
    page: 1,
    results: [
        {
            id: 123,
            title: "Nombre de película",
            poster_path: "/abc123.jpg",
            vote_average: 8.5,
            release_date: "2024-01-01"
        }
    ],
    total_pages: 500,
    total_results: 10000
}
```

**Prueba:** Descomenta la llamada en `js/views/home.view.js` → `loadPopularSection()`.

**¿Qué aprenderás?**
- Consumo de endpoints simples
- Manejo de respuestas paginadas
- Integración con componentes UI

---

### Paso 4: Mostrar las películas populares en el Home

**Archivo:** `js/views/home.view.js`

Descomenta la llamada a `getPopularMovies()` en `loadPopularSection()`.

```javascript
async function loadPopularSection(page = 1) {
    const data = await getPopularMovies(page);
    renderMovieCards(data.results, grid);
}
```

**¿Qué aprenderás?**
- Integración de API con UI
- Renderizado dinámico
- Manejo de estados de carga

---

### Paso 5: Implementar más endpoints básicos

**Archivo:** `js/services/tmdb.service.js`

Implementa estas funciones una por una:

1. `getTopRatedMovies(page)` - Endpoint: `/movie/top_rated`
2. `getUpcomingMovies(page)` - Endpoint: `/movie/upcoming`
3. `getTrending(mediaType, timeWindow, page)` - Endpoint: `/trending/{media_type}/{time_window}`

**Prueba:** Descomenta las llamadas en `js/views/home.view.js`.

**¿Qué aprenderás?**
- Patrones repetitivos en consumo de APIs
- Reutilización de código
- Diferentes tipos de endpoints

---

### Paso 6: Implementar búsqueda con debounce

**Archivo:** `js/services/tmdb.service.js` y `js/components/search-bar.js`

1. Implementa `searchMulti(query, page)` en `tmdb.service.js`
2. La función `debounce` ya está implementada en `js/utils/debounce.js`
3. La barra de búsqueda ya usa debounce en `search-bar.js`

**Endpoint:** `/search/multi`

**Datos esperados:**
```javascript
{
    results: [
        {
            media_type: "movie", // o "tv", "person"
            id: 123,
            title: "Nombre", // o "name" para personas
            poster_path: "/abc.jpg"
        }
    ]
}
```

**¿Qué aprenderás?**
- Búsqueda en APIs
- Debounce para optimizar performance
- Manejo de diferentes tipos de resultados

---

### Paso 7: Crear la página de detalles de película

**Archivo:** `js/services/tmdb.service.js` y `js/views/movie-detail.view.js`

1. Implementa `getMovieDetails(movieId)`
2. Implementa `getMovieCredits(movieId)`
3. Implementa `getMovieVideos(movieId)`

**Endpoints:**
- `/movie/{movie_id}`
- `/movie/{movie_id}/credits`
- `/movie/{movie_id}/videos`

**Prueba:** Haz click en una tarjeta de película.

**¿Qué aprenderás?**
- Endpoints con parámetros dinámicos
- Datos complejos y anidados
- Múltiples llamadas a API para una vista

---

### Paso 8: Implementar películas similares y recomendaciones

**Archivo:** `js/services/tmdb.service.js`

1. Implementa `getSimilarMovies(movieId, page)`
2. Implementa `getMovieRecommendations(movieId, page)`

**Endpoints:**
- `/movie/{movie_id}/similar`
- `/movie/{movie_id}/recommendations`

**¿Qué aprenderás?**
- Endpoints relacionados
- Patrones de recomendación
- UX de descubrimiento

---

### Paso 9: Implementar paginación

**Archivo:** `js/views/search.view.js` y `js/views/home.view.js`

1. Usa el parámetro `page` en las funciones de API
2. Implementa botones de "Cargar más"
3. Actualiza la UI con la nueva página

**¿Qué aprenderás?**
- Paginación en APIs
- Manejo de estado de página
- UX de carga incremental

---

### Paso 10: Implementar Infinite Scroll

**Archivo:** `js/views/home.view.js`

La función `initInfiniteScroll()` ya está preparada. Completa la lógica:

1. Detecta cuando el usuario llega al final de la página
2. Carga la siguiente página automáticamente
3. Usa `IntersectionObserver` o scroll events con throttle

**¿Qué aprenderás?**
- Intersection Observer API
- Optimización de scroll
- UX moderna de contenido infinito

---

### Paso 11: Implementar favoritos con LocalStorage

**Archivo:** `js/services/storage.service.js`

Las funciones ya están implementadas, pero puedes mejorarlas:

1. `addFavorite(movieId, movieData)` - Agrega a favoritos
2. `removeFavorite(movieId)` - Remueve de favoritos
3. `isFavorite(movieId)` - Verifica si es favorito
4. `toggleFavorite(movieId, movieData)` - Toggle

**Prueba:** Haz click en el botón de corazón en las tarjetas.

**¿Qué aprenderás?**
- LocalStorage API
- Persistencia de datos
- Estado local vs API

---

### Paso 12: Optimizar el rendimiento

**Archivos:** Varios

1. **Lazy Loading:** La función `lazyLoadImages()` ya está implementada en `js/utils/helpers.js`. Úsala.
2. **Debounce:** Ya implementado en búsqueda
3. **Throttle:** Ya implementado en helpers.js
4. **Skeletons:** Ya implementados en CSS y componentes

**¿Qué aprenderás?**
- Optimización de imágenes
- Performance web
- UX de carga

---

### Paso 13: Implementar búsqueda específica por tipo

**Archivo:** `js/services/tmdb.service.js`

1. `searchMovies(query, page)` - Endpoint: `/search/movie`
2. `searchTV(query, page)` - Endpoint: `/search/tv`
3. `searchPeople(query, page)` - Endpoint: `/search/person`

**Prueba:** Usa los filtros en la vista de búsqueda.

**¿Qué aprenderás?**
- Endpoints especializados
- Filtrado de resultados
- UX de búsqueda avanzada

---

### Paso 14: Implementar géneros

**Archivo:** `js/services/tmdb.service.js`

1. `getMovieGenres()` - Endpoint: `/genre/movie/list`
2. `getTVGenres()` - Endpoint: `/genre/tv/list`

**Prueba:** Muestra los géneros en la vista de detalles.

**¿Qué aprenderás?**
- Datos de referencia
- Mapeo de IDs a nombres
- Taxonomía en APIs

---

### Paso 15: Implementar descubrimiento avanzado

**Archivo:** `js/services/tmdb.service.js`

1. `discoverMovies(filters)` - Endpoint: `/discover/movie`

**Filtros posibles:**
- `with_genres` - Filtrar por género
- `sort_by` - Ordenar por popularidad, rating, etc.
- `year` - Filtrar por año

**¿Qué aprenderás?**
- Endpoints de descubrimiento
- Filtros complejos
- Exploración de contenido

---

### Paso 16: Manejo de errores robusto

**Archivos:** Todos los archivos de servicios

Mejora el manejo de errores en todas las funciones:

1. Errores de red (offline)
2. Errores de API (404, 500)
3. Errores de rate limiting
4. Errores de autenticación

**¿Qué aprenderás?**
- Manejo robusto de errores
- UX de errores
- Logging y debugging

---

### Paso 17: Refactorizar el código

**Archivos:** Todos

Aplica buenas prácticas:

1. **DRY (Don't Repeat Yourself):** Extrae código repetido
2. **Single Responsibility:** Cada función hace una cosa
3. **Nombres descriptivos:** Usa nombres claros
4. **Comentarios:** Documenta código complejo
5. **Separación de concerns:** Separa lógica de UI

**¿Qué aprenderás?**
- Refactorización
- Código limpio
- Mantenibilidad

---

### Paso 18: Testing (Opcional)

Agrega tests a tus funciones:

1. Prueba unitaria de `fetchFromTMDB`
2. Prueba de formateadores
3. Prueba de helpers
4. Mock de API responses

**¿Qué aprenderás?**
- Testing de JavaScript
- Mocking
- TDD (Test Driven Development)

---

## 📚 Recursos Útiles

### Documentación de TMDB API
- [Documentación oficial](https://developers.themoviedb.org/3)
- [API Reference](https://developers.themoviedb.org/3/getting-started/introduction)
- [Endpoints](https://developers.themoviedb.org/3)

### JavaScript y Fetch API
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: Async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Conceptos Web
- [MDN: LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL)

## 🎓 Consejos de Aprendizaje

1. **No te saltes pasos:** Cada paso depende del anterior
2. **Lee la documentación:** Antes de implementar, lee la docs de TMDB
3. **Debug con console.log:** Usa logs para entender los datos
4. **Prueba cada paso:** No avances hasta que funcione el actual
5. **Pide ayuda:** Si te atascas, revisa la docs o pide ayuda
6. **Experimenta:** Una vez que funcione, intenta mejorarlo

## 🐛 Solución de Problemas Comunes

### Error 404
- Verifica que el endpoint sea correcto
- Revisa la documentación de TMDB

### Error 401 Unauthorized
- Verifica tu API key
- Asegúrate de que sea válida

### Error 429 Too Many Requests
- TMDB tiene límites de rate
- Implementa retry con backoff

### Las imágenes no cargan
- Verifica que `getImageUrl()` funcione
- Revisa las rutas de las imágenes

### El routing no funciona
- Verifica que el hash cambie en la URL
- Revisa `router.service.js`

## 🚀 Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel usando Vite como bundler.

### Pasos para desplegar:

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar API key:**
- Copia `.env.example` a `.env.local`
- Agrega tu API key de TMDB

3. **Probar localmente:**
```bash
npm run dev
```

4. **Build para producción:**
```bash
npm run build
```

5. **Desplegar en Vercel:**
- Conecta tu repositorio a Vercel
- Vercel detectará automáticamente la configuración
- Agrega `TMDB_API_KEY` como variable de entorno en Vercel

### Variables de Entorno en Vercel:
- `TMDB_API_KEY`: Tu API key de TMDB

## 🎉 ¡Felicidades!

Al completar esta guía, habrás aprendido:
- ✅ Consumo de APIs REST con JavaScript Vanilla
- ✅ Fetch API y async/await
- ✅ Manejo de errores HTTP
- ✅ LocalStorage para persistencia
- ✅ Routing en SPAs
- ✅ Optimización de rendimiento
- ✅ Buenas prácticas de código
- ✅ Arquitectura modular

Este proyecto es un excelente pieza para tu portafolio como **Frontend Developer Junior-Mid**.

## 📝 Notas Finales

- El código sigue principios SOLID donde aplica
- La arquitectura es escalable y mantenible
- Todos los componentes están preparados para producción
- Los estilos son responsive y modernos
- La UX está pensada para una app real de streaming

**¡Ahora es tu turno! Implementa la lógica de la API y haz que esta aplicación cobre vida.** 🚀
