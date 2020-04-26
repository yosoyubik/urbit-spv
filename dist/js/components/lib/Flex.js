const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Flex.js";import React from 'react';
import cn from 'classnames';

const Flex = React.forwardRef(function Flex(
  {
    as: As = 'div',
    row = false,
    wrap = false,
    col = false,
    align,
    justify,
    className,
    ...rest
  },
  ref
) {
  if (row && col) {
    throw new Error('Only one of row or col must be true, not both.');
  }
  return (
    React.createElement(As, {
      ref: ref,
      className: cn(
        'flex',
        {
          'flex-row': row,
          'flex-col': col,
          'flex-wrap': wrap,
        },
        {
          [`align-${align}`]: align,
          [`justify-${justify}`]: justify,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
    )
  );
});

// flex can be boolean {true} or integer flex
Flex.Item = React.forwardRef(function FlexItem(
  { as: As = 'div', flex, className, ...rest },
  ref
) {
  if (flex === true) {
    flex = 1;
  }

  return (
    React.createElement(As, {
      ref: ref,
      className: cn(
        {
          [`flex${flex}`]: flex,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
    )
  );
});

export default Flex;
