const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/LoadingBar.js";import React from 'react';
import cn from 'classnames';

// progrss is [0, 1]
export default function LoadingBar({ className, progress = 1.0 }) {
  return (
    React.createElement('div', { className: cn('rel bg-gray2', className), style: { height: '4px' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
      , React.createElement('div', {
        className: "abs bg-green3 animated-width"  ,
        style: {
          top: 0,
          bottom: 0,
          left: 0,
          width: `${progress * 100.0}%`,
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
      )
    )
  );
}
