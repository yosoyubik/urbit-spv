const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/PaperBuilder.js";import React from 'react';
import PaperRenderer from 'urbit-paper-renderer';

export default function PaperBuilder({ point, wallets, callback, ...props }) {
  return (
    React.createElement(PaperRenderer, {
      wallets: wallets,
      callback: data => {
        console.log(data);
        callback(data);
      },
      show: false,
      debug: false,
      output: 'png', __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
    )
  );
}
