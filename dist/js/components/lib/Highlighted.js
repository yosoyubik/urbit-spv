const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Highlighted.js";import React from 'react';
import cn from 'classnames';

export default function Highlighted({
  as: As = 'span',
  className,
  warning = false,
  ...rest
}) {
  return (
    React.createElement(As, {
      className: cn(
        {
          red3: warning,
          green3: !warning,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
    )
  );
}
