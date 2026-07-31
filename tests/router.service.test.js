import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    navigateTo,
    getCurrentRoute,
    parseRouteParams,
    initRouter,
    createUrl
} from '../js/services/router.service.js';

beforeEach(() => {
    window.location.hash = '';
});

describe('navigateTo', () => {
    it('sets a bare hash when there are no params', () => {
        navigateTo('home');
        expect(window.location.hash).toBe('#home');
    });

    it('appends params as a query string', () => {
        navigateTo('search', { q: 'dune', page: 2 });
        expect(window.location.hash).toBe('#search?q=dune&page=2');
    });
});

describe('getCurrentRoute', () => {
    it('defaults to home when the hash is empty', () => {
        expect(getCurrentRoute()).toEqual({ route: 'home', params: {} });
    });

    it('parses the route without params', () => {
        window.location.hash = '#favorites';
        expect(getCurrentRoute()).toEqual({ route: 'favorites', params: {} });
    });

    it('parses the route and its query params', () => {
        window.location.hash = '#search?q=dune%20part%20two&page=3';
        expect(getCurrentRoute()).toEqual({
            route: 'search',
            params: { q: 'dune part two', page: '3' }
        });
    });

    it('round-trips a route created by navigateTo', () => {
        navigateTo('movie/123', { from: 'home' });
        expect(getCurrentRoute()).toEqual({ route: 'movie/123', params: { from: 'home' } });
    });
});

describe('parseRouteParams', () => {
    it('extracts dynamic segments', () => {
        expect(parseRouteParams('movie/:id', 'movie/123')).toEqual({ id: '123' });
        expect(parseRouteParams('person/:id/credits/:type', 'person/7/credits/movie')).toEqual({
            id: '7',
            type: 'movie'
        });
    });

    it('returns an empty object for a static match', () => {
        expect(parseRouteParams('home', 'home')).toEqual({});
    });

    it('returns null when the static segments differ', () => {
        expect(parseRouteParams('movie/:id', 'tv/123')).toBeNull();
    });

    it('returns null when the segment counts differ', () => {
        expect(parseRouteParams('movie/:id', 'movie/123/similar')).toBeNull();
    });
});

describe('initRouter', () => {
    it('invokes the callback immediately with the current route', () => {
        window.location.hash = '#favorites';
        const callback = vi.fn();

        initRouter(callback);

        expect(callback).toHaveBeenCalledWith({ route: 'favorites', params: {} });
    });

    it('invokes the callback on hashchange and stops after cleanup', () => {
        const callback = vi.fn();
        const cleanup = initRouter(callback);

        window.dispatchEvent(new HashChangeEvent('hashchange'));
        expect(callback).toHaveBeenCalledTimes(2);

        cleanup();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        expect(callback).toHaveBeenCalledTimes(2);
    });
});

describe('createUrl', () => {
    it('builds a hash url with and without params', () => {
        expect(createUrl('home')).toBe('#home');
        expect(createUrl('search', { q: 'dune' })).toBe('#search?q=dune');
    });

    it('encodes param values', () => {
        expect(createUrl('search', { q: 'a b&c' })).toBe('#search?q=a+b%26c');
    });
});
