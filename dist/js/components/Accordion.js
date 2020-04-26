const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/Accordion.js";import React from 'react';
import cn from 'classnames';
import { Grid, AccessoryIcon } from 'indigo-react';

export default function Accordion({
  className,
  views,
  options,
  currentTab,
  onTabChange,

  // Tab props
  ...rest
}) {
  const Tab = views[currentTab];

  return (
    React.createElement(Grid, { className: className, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
      , options.map((option, i) => {
        const isActive = option.value === currentTab;

        return (
          React.createElement(React.Fragment, { key: option.value, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
            , React.createElement(Grid.Item, {
              full: true,
              className: cn('f5 pv3 rel', {
                pointer: !option.disabled,
                gray3: option.disabled,
              }),
              onClick: 
                option.disabled
                  ? null
                  : () => onTabChange(isActive ? undefined : option.value)
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
              , option.text
              , option.disabled && (
                React.createElement('sup', { className: "f6 lowercase" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, option.disabled)
              )
              , React.createElement('div', {
                className: "abs",
                style: {
                  top: 0,
                  right: 0,
                  height: '100%',
                  width: '44px',
                  overflow: 'hidden',
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
                , React.createElement(AccessoryIcon, {
                  className: cn({
                    black: !option.disabled,
                  }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
                  , isActive ? '▲' : '▼'
                )
              )
            )
            , isActive && React.createElement(Grid.Item, { full: true, as: Tab, ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}} )
            , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
          )
        );
      })
    )
  );
}
