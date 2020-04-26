const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Crumbs.js";import React from 'react';
import cn from 'classnames';
import { Flex, Breadcrumb } from 'indigo-react';

export default function Crumbs({ className, routes = [] }) {
  const lastIndex = routes.length - 1;
  const textStyle = 'gray4 mono';
  return (
    React.createElement(Flex, { className: className, row: true, wrap: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , routes.map((route, i) => {
        const disabled = !route.action;

        return (
          React.createElement(React.Fragment, { key: route.text, __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
            , React.createElement(Flex.Item, {
              as: Breadcrumb,
              onClick: route.action,
              disabled: disabled,
              className: cn(textStyle, { 'pointer underline': !disabled }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
              , route.text
            )
            , i !== lastIndex && (
              React.createElement(Flex.Item, { as: Breadcrumb, className: cn(textStyle, 'mh2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}, "/"

              )
            )
          )
        );
      })
    )
  );
}
