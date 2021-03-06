const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/progress.js";import React from 'react';
import cn from 'classnames';
import { Button } from 'indigo-react';
import { blinkIf } from './Blinky';

export default function ProgressButton({
  progress = 0.0,
  color = 'green4',
  ...rest
}) {
  return (
    React.createElement('div', {
      ...rest,
      solid: true,
      accessory: blinkIf(progress < 1.0, '->'),
      background: 
        React.createElement('span', {
          className: cn('abs z1 animated-width', `bg-${color}`),
          style: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: `${progress * 100.0}%`,
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}})
      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
    )
  );
}
