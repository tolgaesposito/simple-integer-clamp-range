# simple-integer-clamp-range

Clamps, wraps, and reflects integer values into bounded ranges for modular coordinate systems.

```js
import { clamp, wrap, reflect } from './src/index.js';

clamp(15, 0, 10);   // 10
wrap(15, 0, 10);    // 4
reflect(15, 0, 10); // 4
```

The library exports six named functions: `clamp`, `wrap`, `reflect`, `clampRange`, `wrapRange`, and `reflectRange`. The first three are plain functions; the last three are factories that return an object `{ lo, hi, apply(value) }` with the bounds fixed at construction.

## Why this exists

When you work with modular coordinates — tile maps, game loops, dials, circular buffers — you repeatedly need to force an integer into a fixed range. Writing `((n % size) + size) % size` by hand is easy to get wrong, especially with negative numbers and with ranges that do not start at zero. This library centralises the three common mappings so the arithmetic is written once and tested.

The trade-off is that every function requires integer inputs and throws `TypeError` otherwise. That is deliberate: silently truncating floats hides bugs in callers that pass scaled coordinates. If you need float behaviour, scale to integers first and scale back after.

## Awkward edge: reversed bounds

If you pass `lo > hi`, the functions swap the bounds and proceed with the corrected range. This is a choice, not an accident. Callers frequently compute bounds dynamically and occasionally produce them in the wrong order; swapping keeps the operation total instead of throwing or returning nonsense. The factories also swap at construction time, so `clampRange(10, 0).lo === 0`. If you need to detect a reversed range, check the bounds before calling.

## API

- `clamp(value, lo, hi)` — returns `value` limited to `[lo, hi]`.
- `wrap(value, lo, hi)` — returns `value` mapped into `[lo, hi]` by modular arithmetic.
- `reflect(value, lo, hi)` — returns `value` mapped into `[lo, hi]` by bouncing off the boundaries.
- `clampRange(lo, hi)` — returns `{ lo, hi, apply(value) }` using `clamp`.
- `wrapRange(lo, hi)` — returns `{ lo, hi, apply(value) }` using `wrap`.
- `reflectRange(lo, hi)` — returns `{ lo, hi, apply(value) }` using `reflect`.

All functions throw `TypeError` if any argument is not an integer.
