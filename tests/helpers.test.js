import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    debounce,
    throttle,
    lazyLoadImages,
    deepClone,
    generateId,
    shuffleArray,
    getRandomItem,
    groupBy,
    removeDuplicates,
    sortBy,
    chunk,
    sleep,
    retryWithBackoff,
    isValidEmail,
    isValidUrl,
    escapeHtml,
    copyToClipboard
} from '../js/utils/helpers.js';

describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('runs the function once after the wait with the last arguments', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 300);

        debounced('a');
        debounced('b');
        vi.advanceTimersByTime(299);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('b');
    });
});

describe('throttle', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('runs immediately and ignores calls inside the limit window', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);

        throttled(1);
        throttled(2);
        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith(1);

        vi.advanceTimersByTime(100);
        throttled(3);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith(3);
    });
});

describe('lazyLoadImages', () => {
    let observed;
    let unobserved;
    let callback;

    beforeEach(() => {
        observed = [];
        unobserved = [];
        vi.stubGlobal('IntersectionObserver', class {
            constructor(cb) {
                callback = cb;
                this.unobserve = (el) => unobserved.push(el);
            }
            observe(el) {
                observed.push(el);
            }
        });
        document.body.innerHTML = `
            <img data-src="/a.jpg">
            <img data-src="/b.jpg">
        `;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.innerHTML = '';
    });

    it('observes every matching image', () => {
        lazyLoadImages();
        expect(observed).toHaveLength(2);
    });

    it('swaps data-src into src only for intersecting images', () => {
        lazyLoadImages();
        const [first, second] = observed;
        const observer = { unobserve: (el) => unobserved.push(el) };

        callback(
            [
                { isIntersecting: true, target: first },
                { isIntersecting: false, target: second }
            ],
            observer
        );

        expect(first.getAttribute('src')).toBe('/a.jpg');
        expect(first.hasAttribute('data-src')).toBe(false);
        expect(unobserved).toEqual([first]);
        expect(second.getAttribute('data-src')).toBe('/b.jpg');
    });

    it('does nothing for an intersecting image without data-src', () => {
        lazyLoadImages();
        const [first] = observed;
        first.removeAttribute('data-src');

        callback([{ isIntersecting: true, target: first }], { unobserve: (el) => unobserved.push(el) });

        expect(first.hasAttribute('src')).toBe(false);
        expect(unobserved).toEqual([]);
    });
});

describe('deepClone', () => {
    it('returns primitives and null as-is', () => {
        expect(deepClone(null)).toBeNull();
        expect(deepClone(5)).toBe(5);
        expect(deepClone('x')).toBe('x');
    });

    it('clones dates', () => {
        const date = new Date('2024-01-15T00:00:00Z');
        const clone = deepClone(date);
        expect(clone).not.toBe(date);
        expect(clone.getTime()).toBe(date.getTime());
    });

    it('clones nested objects and arrays without sharing references', () => {
        const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
        const clone = deepClone(original);

        expect(clone).toEqual(original);
        expect(clone.b).not.toBe(original.b);
        clone.b.c[2].d = 99;
        expect(original.b.c[2].d).toBe(3);
    });
});

describe('generateId', () => {
    it('generates unique non-empty ids', () => {
        const ids = new Set(Array.from({ length: 50 }, () => generateId()));
        expect(ids.size).toBe(50);
        expect([...ids].every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
    });
});

describe('shuffleArray', () => {
    it('keeps the same elements and does not mutate the input', () => {
        const input = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(input);

        expect(shuffled).not.toBe(input);
        expect([...shuffled].sort()).toEqual(input);
        expect(input).toEqual([1, 2, 3, 4, 5]);
    });

    it('reverses the array when Math.random always returns 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(shuffleArray([1, 2, 3])).toEqual([2, 3, 1]);
        vi.restoreAllMocks();
    });
});

describe('getRandomItem', () => {
    it('returns null for empty or missing arrays', () => {
        expect(getRandomItem([])).toBeNull();
        expect(getRandomItem(null)).toBeNull();
    });

    it('returns an element of the array', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.99);
        expect(getRandomItem(['a', 'b', 'c'])).toBe('c');
        vi.restoreAllMocks();
    });
});

describe('groupBy', () => {
    it('groups items by the given key', () => {
        const items = [
            { type: 'movie', id: 1 },
            { type: 'tv', id: 2 },
            { type: 'movie', id: 3 }
        ];

        expect(groupBy(items, 'type')).toEqual({
            movie: [items[0], items[2]],
            tv: [items[1]]
        });
    });

    it('returns an empty object for an empty array', () => {
        expect(groupBy([], 'type')).toEqual({});
    });
});

describe('removeDuplicates', () => {
    it('removes duplicated primitives', () => {
        expect(removeDuplicates([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
    });

    it('removes duplicated objects by key keeping the first occurrence', () => {
        const items = [{ id: 1, n: 'a' }, { id: 2, n: 'b' }, { id: 1, n: 'c' }];
        expect(removeDuplicates(items, 'id')).toEqual([items[0], items[1]]);
    });
});

describe('sortBy', () => {
    const items = [{ v: 2 }, { v: 1 }, { v: 3 }];

    it('sorts ascending by default without mutating the input', () => {
        const sorted = sortBy(items, 'v');
        expect(sorted.map((i) => i.v)).toEqual([1, 2, 3]);
        expect(items.map((i) => i.v)).toEqual([2, 1, 3]);
    });

    it('sorts descending', () => {
        expect(sortBy(items, 'v', 'desc').map((i) => i.v)).toEqual([3, 2, 1]);
    });

    it('keeps equal values together', () => {
        expect(sortBy([{ v: 1 }, { v: 1 }], 'v')).toEqual([{ v: 1 }, { v: 1 }]);
    });
});

describe('chunk', () => {
    it('splits an array into chunks with a smaller trailing chunk', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('returns an empty array for an empty input', () => {
        expect(chunk([], 3)).toEqual([]);
    });
});

describe('sleep', () => {
    it('resolves after the given delay', async () => {
        vi.useFakeTimers();
        const resolved = vi.fn();
        sleep(500).then(resolved);

        await vi.advanceTimersByTimeAsync(499);
        expect(resolved).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        expect(resolved).toHaveBeenCalled();
        vi.useRealTimers();
    });
});

describe('retryWithBackoff', () => {
    it('returns the result without retrying when the function succeeds', async () => {
        const fn = vi.fn().mockResolvedValue('ok');
        await expect(retryWithBackoff(fn)).resolves.toBe('ok');
        expect(fn).toHaveBeenCalledOnce();
    });

    it('retries with exponential delays until it succeeds', async () => {
        vi.useFakeTimers();
        const fn = vi
            .fn()
            .mockRejectedValueOnce(new Error('boom'))
            .mockRejectedValueOnce(new Error('boom'))
            .mockResolvedValue('ok');

        const promise = retryWithBackoff(fn, 3, 1000);
        await vi.advanceTimersByTimeAsync(1000);
        await vi.advanceTimersByTimeAsync(2000);

        await expect(promise).resolves.toBe('ok');
        expect(fn).toHaveBeenCalledTimes(3);
        vi.useRealTimers();
    });

    it('rethrows the last error when all retries fail', async () => {
        vi.useFakeTimers();
        const fn = vi.fn().mockRejectedValue(new Error('always fails'));

        const promise = retryWithBackoff(fn, 2, 10);
        const assertion = expect(promise).rejects.toThrow('always fails');
        await vi.advanceTimersByTimeAsync(10);

        await assertion;
        expect(fn).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
});

describe('isValidEmail', () => {
    it.each(['a@b.co', 'user.name@example.com'])('accepts %s', (email) => {
        expect(isValidEmail(email)).toBe(true);
    });

    it.each(['', 'a@b', 'a b@c.com', 'no-at-sign.com'])('rejects %s', (email) => {
        expect(isValidEmail(email)).toBe(false);
    });
});

describe('isValidUrl', () => {
    it('accepts absolute urls', () => {
        expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('rejects malformed urls', () => {
        expect(isValidUrl('not a url')).toBe(false);
        expect(isValidUrl('/relative')).toBe(false);
    });
});

describe('escapeHtml', () => {
    it('escapes characters that could inject markup', () => {
        expect(escapeHtml('<script>alert("x")</script>')).toBe(
            '&lt;script&gt;alert("x")&lt;/script&gt;'
        );
    });

    it('leaves plain text unchanged', () => {
        expect(escapeHtml('hola')).toBe('hola');
    });
});

describe('copyToClipboard', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('uses the clipboard API when available', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });

        await expect(copyToClipboard('hola')).resolves.toBe(true);
        expect(writeText).toHaveBeenCalledWith('hola');
    });

    it('falls back to execCommand and cleans up the textarea', async () => {
        vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
        document.execCommand = vi.fn().mockReturnValue(true);

        await expect(copyToClipboard('hola')).resolves.toBe(true);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
        expect(document.querySelector('textarea')).toBeNull();
    });

    it('returns false when the fallback also fails', async () => {
        vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
        document.execCommand = vi.fn(() => {
            throw new Error('unsupported');
        });

        await expect(copyToClipboard('hola')).resolves.toBe(false);
        expect(document.querySelector('textarea')).toBeNull();
    });
});
