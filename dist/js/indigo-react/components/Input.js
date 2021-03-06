const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/indigo-react/components/Input.js";import React from 'react';
import cn from 'classnames';
import { useField } from 'react-final-form';
import Flex from './Flex';
import { ErrorText } from './Typography';

export default function Input({
  // visuals
  type,
  name,
  label,
  className,
  accessory,
  disabled = false,
  mono = false,
  obscure,

  // callbacks
  onEnter,

  // state
  config,

  // extra
  ...rest
}) {
  const {
    input,
    meta: {
      active,
      error,
      submitError,
      dirtySinceLastSubmit,
      submitting,
      submitSucceeded,
      touched,
      valid,
    },
  } = useField(name, config);

  disabled = disabled || submitting || submitSucceeded;

  // choose the base dom component
  const BaseComponent = type === 'textarea' ? 'textarea' : 'input';

  // notify parent of enter keypress iff not disabled and passing
  // TODO: integrate this into react-final-form submission
  // const onKeyPress = useCallback(
  //   e => !disabled && valid && e.key === 'Enter' && onEnter && onEnter(),
  //   [disabled, valid] // eslint-disable-line react-hooks/exhaustive-deps
  // );

  const showError = !!error;
  const showSubmitError = !!submitError && !dirtySinceLastSubmit;
  const indicateError = touched && !active && (showError || showSubmitError);

  return (
    React.createElement(Flex, {
      col: true,
      className: cn(className, 'mb1'),
      style: {
        ...(disabled && {
          pointerEvents: 'none',
          cursor: 'not-allowed',
        }),
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
      , React.createElement(Flex.Item, {
        as: "label",
        className: cn('f6 lh-tall', {
          black: !disabled,
          gray4: disabled,
        }),
        htmlFor: name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
        , label
      )
      , React.createElement(Flex.Item, { as: Flex, row: true, className: "rel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
        , React.createElement(Flex.Item, {
          flex: true,
          as: BaseComponent,
          ...rest,
          // NOTE: 1.15 from input line-height, 24px = 12px * 2 (from p3 styling)
          style: type === 'textarea' ? { minHeight: 'calc(1.5rem * 3)' } : {},
          className: cn(
            'b b1 p3 outline-none bs-none',
            { mono },
            {
              'bg-white': !disabled,
              'bg-gray1': disabled,
            },
            {
              gray4: !(active || touched),
              black: active || touched,
            },
            {
              'b-green3': valid,
              'b-black': !valid && active,
              'b-yellow3': !valid && !active && touched,
              'b-gray2': !valid && !active && !touched,
            }
          ),
          id: name,
          name: name,
          ...input,
          type: type === 'textarea' ? undefined : type, __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
        )
        , accessory && (
          React.createElement('div', {
            className: "abs",
            style: {
              top: 0,
              right: 0,
              height: '100%',
              width: 'calc(1.5em + 24px)',
              overflow: 'hidden',
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
            , accessory
          )
        )
      )

      , indicateError && (
        React.createElement(Flex.Item, { as: ErrorText, className: "mv1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
          , error || submitError
        )
      )
    )
  );
}
