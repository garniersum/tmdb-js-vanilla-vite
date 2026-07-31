import { describe, it, expect, beforeEach } from 'vitest';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getSearchHistory,
    addToSearchHistory,
    clearSearchHistory,
    getTheme,
    setTheme,
    clearAllData
} from '../js/services/storage.service.js';

const FAVORITES_KEY = 'tmdb_favorites';
const HISTORY_KEY = 'tmdb_search_history';
const THEME_KEY = 'tmdb_theme';

beforeEach(() => {
    localStorage.clear();
});

describe('favorites', () => {
    it('returns an empty list when nothing is stored', () => {
        expect(getFavorites()).toEqual([]);
    });

    it('stores only the id when no movie data is given', () => {
        expect(addFavorite(1)).toBe(true);
        expect(getFavorites()).toEqual([{ id: 1 }]);
    });

    it('stores the full movie data when provided', () => {
        addFavorite(1, { id: 1, title: 'Dune' });
        expect(getFavorites()).toEqual([{ id: 1, title: 'Dune' }]);
    });

    it('does not add the same movie twice', () => {
        addFavorite(1);
        expect(addFavorite(1, { id: 1, title: 'Dune' })).toBe(false);
        expect(getFavorites()).toHaveLength(1);
    });

    it('removes a favorite and leaves the rest untouched', () => {
        addFavorite(1);
        addFavorite(2);
        removeFavorite(1);
        expect(getFavorites()).toEqual([{ id: 2 }]);
    });

    it('removing a missing favorite is a no-op', () => {
        addFavorite(1);
        removeFavorite(99);
        expect(getFavorites()).toEqual([{ id: 1 }]);
    });

    it('reports whether a movie is a favorite', () => {
        addFavorite(1);
        expect(isFavorite(1)).toBe(true);
        expect(isFavorite(2)).toBe(false);
    });

    it('toggles a favorite on and off', () => {
        expect(toggleFavorite(1, { id: 1, title: 'Dune' })).toBe(true);
        expect(isFavorite(1)).toBe(true);

        expect(toggleFavorite(1)).toBe(false);
        expect(getFavorites()).toEqual([]);
    });
});

describe('search history', () => {
    it('returns an empty history when nothing is stored', () => {
        expect(getSearchHistory()).toEqual([]);
    });

    it('adds new terms at the front', () => {
        addToSearchHistory('dune');
        addToSearchHistory('matrix');
        expect(getSearchHistory()).toEqual(['matrix', 'dune']);
    });

    it('moves an existing term to the front ignoring case', () => {
        addToSearchHistory('dune');
        addToSearchHistory('matrix');
        addToSearchHistory('DUNE');
        expect(getSearchHistory()).toEqual(['DUNE', 'matrix']);
    });

    it('keeps at most 10 terms', () => {
        for (let i = 1; i <= 12; i++) {
            addToSearchHistory(`term-${i}`);
        }
        const history = getSearchHistory();
        expect(history).toHaveLength(10);
        expect(history[0]).toBe('term-12');
        expect(history).not.toContain('term-1');
    });

    it('clears the history without touching favorites', () => {
        addFavorite(1);
        addToSearchHistory('dune');
        clearSearchHistory();

        expect(getSearchHistory()).toEqual([]);
        expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
        expect(getFavorites()).toEqual([{ id: 1 }]);
    });
});

describe('theme', () => {
    it('defaults to dark', () => {
        expect(getTheme()).toBe('dark');
    });

    it('persists and reads back the theme', () => {
        setTheme('light');
        expect(localStorage.getItem(THEME_KEY)).toBe('light');
        expect(getTheme()).toBe('light');
    });
});

describe('clearAllData', () => {
    it('removes favorites, history and theme', () => {
        addFavorite(1);
        addToSearchHistory('dune');
        setTheme('light');

        clearAllData();

        expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
        expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
        expect(localStorage.getItem(THEME_KEY)).toBeNull();
        expect(getTheme()).toBe('dark');
    });
});
