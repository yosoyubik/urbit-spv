const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/MaybeSigil.js";import React from 'react';
import ob from 'urbit-ob';

import Sigil from './Sigil';
import AspectRatio from './AspectRatio';

/**
 * patp is Maybe<string>
 */
export default function MaybeSigil({ className, patp, size, ...rest }) {
  const validPatp = patp.matchWith({
    Nothing: () => null,
    Just: p => (ob.isValidPatp(p.value) ? p.value : null),
  });

  return validPatp ? (
    React.createElement(Sigil, { patp: validPatp, size: size, ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}} )
  ) : (
    React.createElement(AspectRatio, { aspectRatio: 1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} )
  );
}
