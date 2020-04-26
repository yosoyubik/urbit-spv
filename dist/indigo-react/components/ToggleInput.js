const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/indigo-react/components/ToggleInput.js";import React from 'react';
import cn from 'classnames';

import Flex from './Flex';
import LinkButton from './LinkButton';
import { useField } from 'react-final-form';

export default function ToggleInput({
  // visuals
  name,
  label,
  inverseLabel,
  inverseColor = 'black',
  className,

  //
  disabled = false,

  ...rest
}) {
  const {
    input,
    meta: { submitting, submitSucceeded },
  } = useField(name, { type: 'checkbox' });

  disabled = disabled || submitting || submitSucceeded;

  return (
    React.createElement(Flex, {
      className: className,
      row: true,
      align: "center",
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
      /* we totally hide the checkbox itself */
      , React.createElement(Flex.Item, {
        as: "input",
        ...rest,
        className: cn('super-hidden'),
        id: name,
        name: name,
        ...input, __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
      )
      /* and then display a prettier one in its stead */
      , React.createElement(Flex.Item, {
        flex: true,
        as: "label",
        className: cn('f6 pv2 lh-tall us-none flex-row align-center', {
          pointer: !disabled,
        }),
        htmlFor: name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
        , React.createElement(LinkButton, {
          disabled: disabled,
          className: cn('f5', {
            black: !input.checked,
            [inverseColor]: input.checked,
          }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
          , input.checked ? inverseLabel : label
        )
      )
    )
  );
}
