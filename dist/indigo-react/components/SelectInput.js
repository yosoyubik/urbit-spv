const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/indigo-react/components/SelectInput.js";import React, { useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { useField } from 'react-final-form';
import useOnClickOutside from 'indigo-react/lib/useOnClickOutside';

import Flex from './Flex';
import { ErrorText } from './Typography';
import AccessoryIcon from './AccessoryIcon';

// NOTE: if we really care about accessibility, we should pull in a dependency
export default function SelectInput({
  name,
  label,
  placeholder,
  className,
  mono = false,
  options = [],
  disabled = false,
  warning,
}) {
  const {
    input,
    meta: { active, error, submitting, submitSucceeded, touched, valid },
  } = useField(name, {
    type: 'select',
  });

  disabled = disabled || submitting || submitSucceeded;

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // close select on outside clicks
  useOnClickOutside(ref, useCallback(() => setIsOpen(false), [setIsOpen]));

  const toggleOpen = useCallback(() => {
    input.onFocus();
    setIsOpen(isOpen => !isOpen);
  }, [input]);

  const onChange = value => {
    // construct a pseudo event that sets the value correctly
    input.onChange({ target: { value } });
    input.onBlur();
    setIsOpen(false);
  };

  const text = options.find(o => o.value === input.value).text;

  return (
    React.createElement(Flex, {
      ref: ref,
      className: cn(className, 'mb1 us-none'),
      col: true,
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
      , React.createElement(Flex.Item, { as: "label", className: "f6 lh-tall" , htmlFor: name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , label
      )
      , React.createElement(Flex.Item, { as: Flex, row: true, className: "rel pointer" , onClick: toggleOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
        , React.createElement(Flex.Item, {
          flex: true,
          className: cn(
            'b b1 p3 outline-none',
            { mono },
            {
              'bg-white': !disabled,
              'bg-gray1': disabled,
            },
            {
              gray4: isOpen,
              black: !isOpen,
            },
            {
              'b-green3': valid,
              'b-black': !valid && active,
              'b-yellow3': !valid && !active && touched && error,
              'b-gray2': !valid && !active && !touched && !error,
            }
          ),
          id: name,
          name: name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
          , isOpen ? placeholder : text
        )
        , React.createElement('div', {
          className: "abs",
          style: {
            top: 0,
            right: 0,
            height: '100%',
            width: '44px',
            overflow: 'hidden',
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
          , React.createElement(AccessoryIcon, { className: "gray4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, isOpen ? '▲' : '▼')
        )
        , isOpen && (
          React.createElement(Flex, {
            col: true,
            className: "abs bg-white b-black b1 z10"    ,
            style: {
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              overflow: 'auto',
              maxHeight: '30vh',
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
            , options.map(option => (
              React.createElement(Flex.Item, {
                key: option.value,
                className: "pv2 ph3 hover-bg-grey3"  ,
                onClick: e => {
                  e.stopPropagation();
                  onChange(option.value);
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
                , option.text
              )
            ))
          )
        )
      )

      , warning && (
        React.createElement(Flex.Item, { as: ErrorText, className: "mv1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
          , warning
        )
      )

      , touched && !active && error && (
        React.createElement(Flex.Item, { as: ErrorText, className: "mv1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
          , error
        )
      )
    )
  );
}
