const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/Chip.js";import React from 'react';
import cn from 'classnames';

export default function Chip({ children, bgColor, fgColor, className }) {
  return (
    React.createElement('div', {
      className: cn(
        className,
        'h6 r-full flex-center ph2 mh2 f6',
        bgColor,
        fgColor
      ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
      , children
    )
  );
}
