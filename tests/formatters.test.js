import { describe, it, expect, vi, afterEach } from 'vitest';
import {
    formatDate,
    formatYear,
    formatRating,
    formatRuntime,
    formatCurrency,
    formatNumber,
    truncateText,
    capitalize,
    formatGenres,
    formatPercentage,
    formatRelativeTime
} from '../js/utils/formatters.js';

describe('formatDate', () => {
    it('returns a placeholder for empty input', () => {
        expect(formatDate('')).toBe('Fecha desconocida');
        expect(formatDate(null)).toBe('Fecha desconocida');
    });

    it('formats an ISO date with the default locale', () => {
        expect(formatDate('2024-01-15')).toBe('15 de enero de 2024');
    });

    it('honours locale and options overrides', () => {
        expect(formatDate('2024-01-15', 'en-US', { month: 'short' })).toBe('Jan 15, 2024');
    });
});

describe('formatYear', () => {
    it('returns an empty string when there is no date', () => {
        expect(formatYear(undefined)).toBe('');
    });

    it('extracts the year', () => {
        expect(formatYear('1999-03-31')).toBe(1999);
    });
});

describe('formatRating', () => {
    it('returns N/A for null or undefined', () => {
        expect(formatRating(null)).toBe('N/A');
        expect(formatRating(undefined)).toBe('N/A');
    });

    it('formats with one decimal and the max rating', () => {
        expect(formatRating(8.456)).toBe('8.5/10');
        expect(formatRating(0)).toBe('0.0/10');
        expect(formatRating(4, 5)).toBe('4.0/5');
    });
});

describe('formatRuntime', () => {
    it('returns N/A for falsy durations', () => {
        expect(formatRuntime(0)).toBe('N/A');
        expect(formatRuntime(null)).toBe('N/A');
    });

    it('formats minutes, hours and both', () => {
        expect(formatRuntime(45)).toBe('45min');
        expect(formatRuntime(120)).toBe('2h');
        expect(formatRuntime(150)).toBe('2h 30min');
    });
});

describe('formatCurrency', () => {
    it('returns N/A for falsy amounts', () => {
        expect(formatCurrency(0)).toBe('N/A');
    });

    it('formats using Intl.NumberFormat', () => {
        const formatted = formatCurrency(1000000, 'USD', 'en-US');
        expect(formatted).toBe('$1,000,000.00');
    });
});

describe('formatNumber', () => {
    it('returns N/A for null or undefined', () => {
        expect(formatNumber(null)).toBe('N/A');
        expect(formatNumber(undefined)).toBe('N/A');
    });

    it('formats zero and large numbers', () => {
        expect(formatNumber(0, 'en-US')).toBe('0');
        expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
    });
});

describe('truncateText', () => {
    it('returns an empty string for falsy text', () => {
        expect(truncateText('')).toBe('');
    });

    it('leaves short text untouched', () => {
        expect(truncateText('hola', 10)).toBe('hola');
    });

    it('truncates and appends the suffix without exceeding maxLength', () => {
        const result = truncateText('abcdefghij', 5);
        expect(result).toBe('ab...');
        expect(result).toHaveLength(5);
    });

    it('supports a custom suffix', () => {
        expect(truncateText('abcdefghij', 5, '!')).toBe('abcd!');
    });
});

describe('capitalize', () => {
    it('returns an empty string for falsy text', () => {
        expect(capitalize(null)).toBe('');
    });

    it('capitalizes the first letter and lowercases the rest', () => {
        expect(capitalize('hOLA mundo')).toBe('Hola mundo');
    });
});

describe('formatGenres', () => {
    it('returns N/A when genres are missing or not an array', () => {
        expect(formatGenres(null)).toBe('N/A');
        expect(formatGenres({})).toBe('N/A');
    });

    it('joins genre names with the separator', () => {
        const genres = [{ name: 'Acción' }, { name: 'Drama' }];
        expect(formatGenres(genres)).toBe('Acción, Drama');
        expect(formatGenres(genres, ' | ')).toBe('Acción | Drama');
    });
});

describe('formatPercentage', () => {
    it('returns 0% when the total is missing or zero', () => {
        expect(formatPercentage(5, 0)).toBe('0%');
        expect(formatPercentage(5, undefined)).toBe('0%');
    });

    it('computes the percentage with one decimal', () => {
        expect(formatPercentage(1, 3)).toBe('33.3%');
    });
});

describe('formatRelativeTime', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns an empty string when there is no date', () => {
        expect(formatRelativeTime('')).toBe('');
    });

    it.each([
        ['2024-01-15T11:59:30Z', -30, 'second'],
        ['2024-01-15T11:30:00Z', -30, 'minute'],
        ['2024-01-15T09:00:00Z', -3, 'hour'],
        ['2024-01-13T12:00:00Z', -2, 'day'],
        ['2023-12-01T12:00:00Z', -1, 'month'],
        ['2021-01-15T12:00:00Z', -3, 'year']
    ])('picks the right unit and amount for %s', (dateString, amount, unit) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));

        const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
        expect(formatRelativeTime(dateString, 'en-US')).toBe(rtf.format(amount, unit));
    });
});
