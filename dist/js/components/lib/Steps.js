const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Steps.js";import React from 'react';
import cn from 'classnames';
import { Text } from 'indigo-react';

export default function Steps({ num = 1, total = 3, className, ...rest }) {
  return (
    React.createElement(Text, { className: cn('f5 gray3', className), ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
      , React.createElement(Text, { className: "f5 black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}, "Step " , num), " of "  , total
    )
  );
}
