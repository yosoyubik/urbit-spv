const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/AspectRatio.js";import React from 'react';

/**
 * A very useful Flutter widget reimplemented with
 * the world's dumbest css hack.
 *
 * Simply: container div with appropriate relative padding,
 * then absolutely pin the child.
 *
 * via: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp
 */
export default function AspectRatio({ aspectRatio = 1, children }) {
  const percent = `${(1 / aspectRatio) * 100}%`;

  return (
    React.createElement('div', { className: "rel", style: { paddingTop: percent }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
      , React.createElement('div', { className: "abs", style: { top: 0, bottom: 0, left: 0, right: 0 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , children
      )
    )
  );
}
