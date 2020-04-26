const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/indigo-react/components/LinkButton.js";import React from 'react';
import cn from 'classnames';

export default function LinkButton({
  as: As = 'a',
  disabled = false,
  className,
  onClick,
  children,
  ...rest
}) {
  return (
    React.createElement(As, {
      onClick: !disabled && onClick ? onClick : undefined,
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      },
      className: cn(
        'us-none pointer underline',
        {
          // NOTE: inherit styling from parent otherwise
          gray4: disabled,
        },
        className
      ),
      target: "_blank",
      rel: "noopener noreferrer" ,
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      , children
    )
  );
}
