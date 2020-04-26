const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/WithTooltip.js";import React, { useState, useCallback } from 'react';

export default function WithTooltip({ content, children }) {
  const [isHovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  return (
    React.createElement('div', {
      className: "rel nowrap inline-block"  ,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , children
      , isHovered && (
        React.createElement('div', {
          className: "abs mb1 bg-black white ph4 pv2 r4"      ,
          style: { bottom: '100%' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
          , content
        )
      )
    )
  );
}
