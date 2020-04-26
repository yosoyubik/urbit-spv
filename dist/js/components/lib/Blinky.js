const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Blinky.js";import React, { useState, useRef } from 'react';
import { times } from 'lodash';

import useInterval from 'lib/useInterval';
import { formatDots } from 'lib/dateFormat';

// TODO: make these characters display as the same width
export const LOADING_CHARACTER = '▓';
export const INTERSTITIAL_CHARACTER = '░';
const BLINK_AFTER_MS = 2500; // ms

const buildDate = char =>
  [4, 2, 2].map(t => times(t, () => char).join('')).join('.');
const DATE_A = buildDate(LOADING_CHARACTER);
const DATE_B = buildDate(INTERSTITIAL_CHARACTER);

export const matchBlinky = obj =>
  obj.matchWith({
    Nothing: () => React.createElement(Blinky, { delayed: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} ),
    Just: p => p.value,
  });

export const matchBlinkyDate = obj =>
  obj.matchWith({
    Nothing: () => React.createElement(Blinky, { a: DATE_A, b: DATE_B, delayed: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} ),
    Just: p => formatDots(p.value),
  });

export const blinkIf = (test, right) => (test ? React.createElement(Blinky, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} ) : right);

export default function Blinky({
  a = LOADING_CHARACTER,
  b = INTERSTITIAL_CHARACTER,
  delayed = false,
}) {
  const [value, setValue] = useState(true);
  const now = useRef(new Date());

  useInterval(() => {
    // only start blinking if we've elapsed enough time and want to delay
    if (!delayed || new Date() - now.current > BLINK_AFTER_MS) {
      setValue(val => !val);
    }
  }, 1000);

  return React.createElement('span', { className: "arial", __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}, value ? a : b);
}
