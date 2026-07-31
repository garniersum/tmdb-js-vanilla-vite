import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, debounceImmediate } from '../js/utils/debounce.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('debounce', () => {
    it('delays execution until the wait elapses', () => {
        const fn = vi.fn();
        const debounced = debounce(fn);

        debounced();
        vi.advanceTimersByTime(299);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledOnce();
    });

    it('resets the timer on every call and forwards the last arguments', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 200);

        debounced('a');
        vi.advanceTimersByTime(150);
        debounced('b');
        vi.advanceTimersByTime(150);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('b');
    });
});

describe('debounceImmediate', () => {
    it('runs on the first call and swallows calls inside the window', () => {
        const fn = vi.fn();
        const debounced = debounceImmediate(fn, 200);

        debounced('a');
        debounced('b');
        expect(fn).toHaveBeenCalledOnce();
        expect(fn).toHaveBeenCalledWith('a');

        vi.advanceTimersByTime(200);
        expect(fn).toHaveBeenCalledOnce();
    });

    it('runs again once the window has expired', () => {
        const fn = vi.fn();
        const debounced = debounceImmediate(fn, 200);

        debounced('a');
        vi.advanceTimersByTime(200);
        debounced('b');

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith('b');
    });
});
