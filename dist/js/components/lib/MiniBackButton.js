const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/MiniBackButton.js";import React from 'react';
import cn from 'classnames';
import { IconButton } from 'indigo-react';

import { ReactComponent as Back } from 'assets/back.svg';

export default ({ className, isExit = false, ...rest }) => {
  return (
    React.createElement(IconButton, { ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , isExit ? '⏏' : React.createElement(Back, { className: cn('black', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}} )
    )
  );
};
