const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Grid.js";import React from 'react';
import cn from 'classnames';

const Grid = React.forwardRef(function Grid(
  { as: As = 'div', gap = 0, align, justify, className, ...rest },
  ref
) {
  return (
    React.createElement(As, {
      ref: ref,
      className: cn(
        'grid12',
        gap && `gap${gap}`,
        {
          [`justify-${justify}`]: justify,
          [`align-${align}`]: align,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
    )
  );
});

Grid.Item = React.forwardRef(function GridItem(
  {
    as: As = 'div',
    full = false,
    half = 0,
    third = 0,
    fourth = 0,
    rows = [],
    cols = [],
    justifySelf,
    alignSelf,
    className,
    ...rest
  },
  ref
) {
  return (
    React.createElement(As, {
      ref: ref,
      className: cn(
        {
          full,
          [`half-${half}`]: half,
          [`third-${third}`]: third,
          [`fourth-${fourth}`]: fourth,
        },
        {
          [`r${rows[0]}-${rows[1]}`]: rows.length === 2,
          [`c${cols[0]}-${cols[1]}`]: cols.length === 2,
        },
        {
          [`justify-self-${justifySelf}`]: justifySelf,
          [`align-self-${alignSelf}`]: alignSelf,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
    )
  );
});

Grid.Divider = function GridDivider({ color = 'gray2', className, ...rest }) {
  return React.createElement('div', { className: cn('full', `bt1 b-${color}`, className), ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} );
};

export default Grid;
