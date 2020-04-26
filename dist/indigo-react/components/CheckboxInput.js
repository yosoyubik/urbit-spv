const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/indigo-react/components/CheckboxInput.js";import React from 'react';
import cn from 'classnames';

import Flex from './Flex';
import { useField } from 'react-final-form';

export default function CheckboxInput({
  // visuals
  name,
  label,
  className,

  disabled,
}) {
  const {
    input,
    meta: { submitting, submitSucceeded },
  } = useField(name, { type: 'checkbox' });

  disabled = disabled || submitting || submitSucceeded;

  return (
    React.createElement(Flex, {
      row: true,
      align: "center",
      className: cn(className, 'mv2', {
        black: !disabled,
        gray4: disabled,
      }),
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
      /* we totally hide the checkbox itself */
      , React.createElement(Flex.Item, { as: "input", className: "super-hidden", id: name, ...input, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
      /* and then display a prettier one in its stead */
      , React.createElement(Flex.Item, {
        flex: true,
        as: "label",
        className: "f6 mr3 lh-tall us-none pointer flex-row align-center"      ,
        htmlFor: name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
        , React.createElement(Flex, {
          justify: "center",
          align: "center",
          className: cn('b1 p1 mr3', {
            'bg-gray1': disabled,
            'bg-black white b-black': !disabled && input.value,
            'bg-white black b-black': !disabled && !input.value,
          }),
          style: {
            height: '14px',
            width: '14px',
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
          , input.value && '✓'
        )
        , label
      )
    )
  );
}
