import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TMDB_CONFIG } from '../js/config/tmdb.config.js';
import {
    fetchFromTMDB,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getTrending,
    getMovieDetails,
    getSimilarMovies,
    getMovieRecommendations,
    getMovieVideos,
    getMovieCredits,
    searchMulti,
    searchMovies,
    searchTV,
    searchPeople,
    getMovieGenres,
    getTVGenres,
    getPersonDetails,
    getPersonCredits,
    discoverMovies
} from '../js/services/tmdb.service.js';

let get;

beforeEach(() => {
    get = vi.fn().mockResolvedValue({ data: { results: [] } });
    vi.stubGlobal('axios', { get });
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const lastCall = () => get.mock.calls.at(-1);

describe('fetchFromTMDB', () => {
    it('calls the base url with default params plus the api key', async () => {
        get.mockResolvedValue({ data: { page: 1 } });

        await expect(fetchFromTMDB('/movie/popular')).resolves.toEqual({ page: 1 });

        const [url, config] = lastCall();
        expect(url).toBe(`${TMDB_CONFIG.BASE_URL}/movie/popular`);
        expect(config.params).toMatchObject({
            ...TMDB_CONFIG.DEFAULT_PARAMS,
            api_key: TMDB_CONFIG.API_KEY
        });
    });

    it('lets caller params override the defaults', async () => {
        await fetchFromTMDB('/movie/popular', { page: 4, language: 'en-US' });

        const [, config] = lastCall();
        expect(config.params.page).toBe(4);
        expect(config.params.language).toBe('en-US');
    });

    it('wraps server error responses with status and message', async () => {
        get.mockRejectedValue({
            response: { status: 401, statusText: 'Unauthorized', data: { status_message: 'Invalid API key' } }
        });

        await expect(fetchFromTMDB('/movie/popular')).rejects.toThrow('HTTP Error 401: Invalid API key');
    });

    it('falls back to statusText when the body has no status_message', async () => {
        get.mockRejectedValue({ response: { status: 404, statusText: 'Not Found', data: {} } });

        await expect(fetchFromTMDB('/movie/1')).rejects.toThrow('HTTP Error 404: Not Found');
    });

    it('reports a network error when there is no response', async () => {
        get.mockRejectedValue({ request: {} });

        await expect(fetchFromTMDB('/movie/popular')).rejects.toThrow(
            'Error de red: No se pudo conectar con la API de TMDB'
        );
    });

    it('rethrows request setup errors untouched', async () => {
        const error = new Error('bad config');
        get.mockRejectedValue(error);

        await expect(fetchFromTMDB('/movie/popular')).rejects.toBe(error);
    });
});

describe('list endpoints', () => {
    it.each([
        [getPopularMovies, TMDB_CONFIG.ENDPOINTS.MOVIE_POPULAR],
        [getTopRatedMovies, TMDB_CONFIG.ENDPOINTS.MOVIE_TOP_RATED],
        [getUpcomingMovies, TMDB_CONFIG.ENDPOINTS.MOVIE_UPCOMING]
    ])('requests %o with a default page of 1', async (fn, endpoint) => {
        await fn();
        const [url, config] = lastCall();
        expect(url).toBe(TMDB_CONFIG.BASE_URL + endpoint);
        expect(config.params.page).toBe(1);
    });

    it('forwards an explicit page', async () => {
        await getPopularMovies(3);
        expect(lastCall()[1].params.page).toBe(3);
    });
});

describe('getTrending', () => {
    it('interpolates media type and time window', async () => {
        await getTrending('movie', 'week', 2);

        const [url, config] = lastCall();
        expect(url).toBe(`${TMDB_CONFIG.BASE_URL}/trending/movie/week`);
        expect(config.params.page).toBe(2);
    });

    it('defaults to all/day', async () => {
        await getTrending();
        expect(lastCall()[0]).toBe(`${TMDB_CONFIG.BASE_URL}/trending/all/day`);
    });
});

describe('movie detail endpoints', () => {
    it('appends related resources to the details request', async () => {
        await getMovieDetails(42);

        const [url, config] = lastCall();
        expect(url).toBe(`${TMDB_CONFIG.BASE_URL}/movie/42`);
        expect(config.params.append_to_response).toBe('credits,videos,similar,recommendations');
    });

    it.each([
        [getSimilarMovies, '/movie/42/similar'],
        [getMovieRecommendations, '/movie/42/recommendations']
    ])('builds the related-movies url %o', async (fn, path) => {
        await fn(42, 5);
        const [url, config] = lastCall();
        expect(url).toBe(TMDB_CONFIG.BASE_URL + path);
        expect(config.params.page).toBe(5);
    });

    it('requests credits for the movie', async () => {
        await getMovieCredits(42);
        expect(lastCall()[0]).toBe(`${TMDB_CONFIG.BASE_URL}/movie/42/credits`);
    });
});

describe('getMovieVideos', () => {
    it('requests videos in english and keeps only supported YouTube videos', async () => {
        get.mockResolvedValue({
            data: {
                results: [
                    { site: 'YouTube', type: 'Trailer', key: 'a' },
                    { site: 'YouTube', type: 'Teaser', key: 'b' },
                    { site: 'YouTube', type: 'Opening Credits', key: 'c' },
                    { site: 'Vimeo', type: 'Trailer', key: 'd' }
                ]
            }
        });

        const data = await getMovieVideos(42);

        const [url, config] = lastCall();
        expect(url).toBe(`${TMDB_CONFIG.BASE_URL}/movie/42/videos`);
        expect(config.params.language).toBe('en-US');
        expect(data.results.map((v) => v.key)).toEqual(['a', 'b']);
    });
});

describe('search endpoints', () => {
    it.each([
        [searchMulti, TMDB_CONFIG.ENDPOINTS.SEARCH_MULTI],
        [searchMovies, TMDB_CONFIG.ENDPOINTS.SEARCH_MOVIE],
        [searchTV, TMDB_CONFIG.ENDPOINTS.SEARCH_TV],
        [searchPeople, TMDB_CONFIG.ENDPOINTS.SEARCH_PERSON]
    ])('sends the query and page to %o', async (fn, endpoint) => {
        await fn('dune', 2);

        const [url, config] = lastCall();
        expect(url).toBe(TMDB_CONFIG.BASE_URL + endpoint);
        expect(config.params).toMatchObject({ query: 'dune', page: 2 });
    });
});

describe('unimplemented endpoints', () => {
    it.each([
        [getNowPlayingMovies, 'getNowPlayingMovies no implementado aún'],
        [getMovieGenres, 'getMovieGenres no implementado aún'],
        [getTVGenres, 'getTVGenres no implementado aún'],
        [getPersonDetails, 'getPersonDetails no implementado aún'],
        [getPersonCredits, 'getPersonCredits no implementado aún'],
        [discoverMovies, 'discoverMovies no implementado aún']
    ])('rejects with a not-implemented error', async (fn, message) => {
        await expect(fn()).rejects.toThrow(message);
        expect(get).not.toHaveBeenCalled();
    });
});
