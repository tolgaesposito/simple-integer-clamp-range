import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  wrap,
  reflect,
  clampRange,
  wrapRange,
  reflectRange
} from '../src/index.js';

test('clamp returns value when inside range', () => {
  assert.equal(clamp(5, 1, 10), 5);
});

test('clamp returns lo when below range', () => {
  assert.equal(clamp(-3, 1, 10), 1);
});

test('clamp returns hi when above range', () => {
  assert.equal(clamp(99, 1, 10), 10);
});

test('clamp swaps bounds when lo > hi', () => {
  assert.equal(clamp(5, 10, 1), 5);
  assert.equal(clamp(0, 10, 1), 1);
  assert.equal(clamp(11, 10, 1), 10);
});

test('clamp throws on non-integer input', () => {
  assert.throws(() => clamp(1.5, 0, 10), TypeError);
  assert.throws(() => clamp(1, 0.5, 10), TypeError);
  assert.throws(() => clamp(1, 0, '10'), TypeError);
});

test('wrap maps values into range', () => {
  assert.equal(wrap(1, 0, 4), 1);
  assert.equal(wrap(5, 0, 4), 0);
  assert.equal(wrap(-1, 0, 4), 4);
  assert.equal(wrap(9, 0, 4), 4);
  assert.equal(wrap(10, 0, 4), 0);
});

test('wrap handles negative values and swapped bounds', () => {
  assert.equal(wrap(-5, 0, 4), 0);
  assert.equal(wrap(-6, 0, 4), 4);
  assert.equal(wrap(3, 4, 0), 3);
  assert.equal(wrap(-1, 4, 0), 4);
});

test('wrap on single-element range returns that element', () => {
  assert.equal(wrap(42, 7, 7), 7);
  assert.equal(wrap(-42, 7, 7), 7);
});

test('wrap throws on non-integer input', () => {
  assert.throws(() => wrap(1.5, 0, 10), TypeError);
  assert.throws(() => wrap(1, 0.5, 10), TypeError);
  assert.throws(() => wrap(1, 0, '10'), TypeError);
});

test('reflect bounces off boundaries', () => {
  assert.equal(reflect(0, 0, 4), 0);
  assert.equal(reflect(1, 0, 4), 1);
  assert.equal(reflect(4, 0, 4), 4);
  assert.equal(reflect(5, 0, 4), 3);
  assert.equal(reflect(6, 0, 4), 2);
  assert.equal(reflect(8, 0, 4), 0);
  assert.equal(reflect(9, 0, 4), 1);
});

test('reflect handles negative values and swapped bounds', () => {
  assert.equal(reflect(-1, 0, 4), 1);
  assert.equal(reflect(-2, 0, 4), 2);
  assert.equal(reflect(3, 4, 0), 3);
  assert.equal(reflect(-1, 4, 0), 1);
});

test('reflect on single-element range returns that element', () => {
  assert.equal(reflect(42, 7, 7), 7);
  assert.equal(reflect(-42, 7, 7), 7);
});

test('reflect throws on non-integer input', () => {
  assert.throws(() => reflect(1.5, 0, 10), TypeError);
  assert.throws(() => reflect(1, 0.5, 10), TypeError);
  assert.throws(() => reflect(1, 0, '10'), TypeError);
});

test('clampRange applies clamp with fixed bounds', () => {
  const r = clampRange(0, 10);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 10);
  assert.equal(r.apply(-5), 0);
  assert.equal(r.apply(5), 5);
  assert.equal(r.apply(15), 10);
});

test('clampRange swaps bounds at construction', () => {
  const r = clampRange(10, 0);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 10);
  assert.equal(r.apply(-5), 0);
  assert.equal(r.apply(15), 10);
});

test('wrapRange applies wrap with fixed bounds', () => {
  const r = wrapRange(0, 4);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 4);
  assert.equal(r.apply(5), 0);
  assert.equal(r.apply(-1), 4);
});

test('wrapRange swaps bounds at construction', () => {
  const r = wrapRange(4, 0);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 4);
  assert.equal(r.apply(5), 0);
  assert.equal(r.apply(-1), 4);
});

test('reflectRange applies reflect with fixed bounds', () => {
  const r = reflectRange(0, 4);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 4);
  assert.equal(r.apply(5), 3);
  assert.equal(r.apply(-1), 1);
});

test('reflectRange swaps bounds at construction', () => {
  const r = reflectRange(4, 0);
  assert.equal(r.lo, 0);
  assert.equal(r.hi, 4);
  assert.equal(r.apply(5), 3);
  assert.equal(r.apply(-1), 1);
});

test('range constructors throw on non-integer bounds', () => {
  assert.throws(() => clampRange(0.5, 10), TypeError);
  assert.throws(() => wrapRange(0, '10'), TypeError);
  assert.throws(() => reflectRange(NaN, 10), TypeError);
});
