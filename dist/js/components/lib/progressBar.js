const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/progressBar.js";import React from 'react';

// progress is [0, 1]
export default function ProgressBar(progress) {
  return (
    React.createElement('div', { className: "rel bg-gray3 full"  , style: { height: '14px' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
      , React.createElement('div', {
        className: "abs bg-green2 animated-width tc mono"    ,
        style: {
          top: 0,
          bottom: 0,
          left: 0,
          width: `${progress * 100.0}%`,
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
      
      , `${(progress * 100.0).toFixed(2)}%`
      )
    )
  );
}
