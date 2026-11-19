// Integer range operations: clamp, wrap, reflect.
// All functions assume integer inputs and a non-empty range [lo, hi].

/**
 * Clamp an integer to the inclusive range [lo, hi].
 * If lo > hi, the arguments are swapped so the range is valid.
 * This is a deliberate choice: callers often pass bounds in either order,
 * and silently swapping avoids surprising out-of-range results.
 */
export function clamp(value, lo, hi) {
  if (!Number.isInteger(value) || !Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('clamp requires integer arguments');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  if (value < lo) return lo;
  if (value > hi) return hi;
  return value;
}

/**
 * Wrap an integer into the inclusive range [lo, hi] using modular arithmetic.
 * The range length is hi - lo + 1. Values outside the range are mapped back
 * by adding or subtracting multiples of the length.
 * If lo > hi, the arguments are swapped.
 */
export function wrap(value, lo, hi) {
  if (!Number.isInteger(value) || !Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('wrap requires integer arguments');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  const len = hi - lo + 1;
  // Use ((value - lo) % len + len) % len to handle negative values correctly.
  const offset = ((value - lo) % len + len) % len;
  return lo + offset;
}

/**
 * Reflect an integer into the inclusive range [lo, hi] by bouncing off the
 * boundaries. This is the "ping-pong" or triangular-wave mapping.
 * If lo > hi, the arguments are swapped.
 */
export function reflect(value, lo, hi) {
  if (!Number.isInteger(value) || !Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('reflect requires integer arguments');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  const len = hi - lo;
  if (len === 0) return lo;
  const period = 2 * len;
  // Bring value into [lo, lo + period) using modular arithmetic.
  const offset = ((value - lo) % period + period) % period;
  if (offset <= len) {
    return lo + offset;
  }
  return hi - (offset - len);
}

/**
 * Object-oriented convenience wrapper around clamp.
 * The range is fixed at construction time.
 */
export function clampRange(lo, hi) {
  if (!Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('clampRange requires integer bounds');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  return {
    lo,
    hi,
    apply(value) {
      return clamp(value, lo, hi);
    }
  };
}

/**
 * Object-oriented convenience wrapper around wrap.
 */
export function wrapRange(lo, hi) {
  if (!Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('wrapRange requires integer bounds');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  return {
    lo,
    hi,
    apply(value) {
      return wrap(value, lo, hi);
    }
  };
}

/**
 * Object-oriented convenience wrapper around reflect.
 */
export function reflectRange(lo, hi) {
  if (!Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError('reflectRange requires integer bounds');
  }
  if (lo > hi) {
    [lo, hi] = [hi, lo];
  }
  return {
    lo,
    hi,
    apply(value) {
      return reflect(value, lo, hi);
    }
  };
}
