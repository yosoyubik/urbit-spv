const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/Button.js";import React from 'react';
import cn from 'classnames';

import Grid from './Grid';
import Flex from './Flex';
import { HelpText } from './Typography';

export default function Button({
  as: As = 'span',
  solid = false,
  success = false,
  disabled = false,
  disabledDetail,
  detail,
  className,
  detailClassName,
  accessory = '→',
  onClick,
  background,
  type,
  children,
  center = false,
  ...rest
}) {
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !disabled) {
      onClick();
    }
  };
  return (
    React.createElement(Grid, {
      as: As,
      gap: 1,
      tabIndex: !disabled ? 0 : undefined,
      onKeyPress: handleKeyPress,
      className: cn(
        'rel pointer pv4 truncate flex-row justify-between us-none',
        {
          p4: solid,
        },
        {
          'bg-green3': success && !disabled,
          'bg-green1': success && disabled,
          'bg-black': !success && solid && !disabled,
          'bg-gray3': !success && solid && disabled,
          'bg-transparent': !success && !solid,
        },
        {
          white: solid,
          black: !solid && !disabled,
          gray4: !solid && disabled,
        },
        className
      ),
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      },
      onClick: !disabled && onClick ? onClick : undefined,
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
      , background
      , React.createElement(Grid.Item, {
        full: true,
        as: Flex,
        justify: "between",
        className: cn('z2', { 'flex-center': center }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, children)
        , type && React.createElement('button', { type: type, style: { display: 'none' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}})
        , !center && React.createElement('div', { className: cn('pl4'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, accessory)
      )
      , detail && (
        React.createElement(Grid.Item, { full: true, as: HelpText, className: cn('z2', detailClassName), __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
          , detail
        )
      )
      , disabled && disabledDetail && (
        React.createElement(Grid.Item, { full: true, className: "f6 black mt1 z2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
          , disabledDetail
        )
      )
    )
  );
}
