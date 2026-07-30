import { describe, it, expect } from 'vitest';
import { TMDB_CONFIG, getImageUrl, getBackdropUrl, getProfileUrl } from '../js/config/tmdb.config.js';

describe('getImageUrl', () => {
    it('builds a url with the default poster size', () => {
        expect(getImageUrl('/abc.jpg')).toBe(`${TMDB_CONFIG.IMAGE_BASE_URL}/w500/abc.jpg`);
    });

    it('honours an explicit size', () => {
        expect(getImageUrl('/abc.jpg', 'original')).toBe(`${TMDB_CONFIG.IMAGE_BASE_URL}/original/abc.jpg`);
    });

    it('falls back to a placeholder when there is no path', () => {
        expect(getImageUrl(null)).toContain('placehold.co');
        expect(getImageUrl('')).toContain('No+Image');
    });
});

describe('getBackdropUrl', () => {
    it('builds a url with the default backdrop size', () => {
        expect(getBackdropUrl('/bd.jpg')).toBe(`${TMDB_CONFIG.IMAGE_BASE_URL}/w1280/bd.jpg`);
    });

    it('falls back to a backdrop placeholder', () => {
        expect(getBackdropUrl(undefined)).toContain('No+Backdrop');
    });
});

describe('getProfileUrl', () => {
    it('builds a url with the default profile size', () => {
        expect(getProfileUrl('/p.jpg')).toBe(`${TMDB_CONFIG.IMAGE_BASE_URL}/w185/p.jpg`);
    });

    it('falls back to a photo placeholder', () => {
        expect(getProfileUrl(null)).toContain('No+Photo');
    });
});
