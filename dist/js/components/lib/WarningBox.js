const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/WarningBox.js";import React from 'react';
import cn from 'classnames';
import { Flex, Text } from 'indigo-react';

export default function WarningBox({ className, children }) {
  return (
    React.createElement(Flex, { className: cn('bg-red1 pv3 ph4', className), align: "center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
      , React.createElement(Text, { className: "f6 fw-bold red3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}, children)
    )
  );
}
