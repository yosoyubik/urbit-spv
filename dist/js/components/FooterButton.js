const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/FooterButton.js";import React from 'react';
import { Grid, Button } from 'indigo-react';

import Footer from './Footer';

export default function FooterButton({ as: As = Button, ...props }) {
  return (
    React.createElement(Footer, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
      , React.createElement(Grid, { className: "pt4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
        , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10}} )
        , React.createElement(Grid.Item, { full: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
          , React.createElement(As, { ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}} )
        )
      )
    )
  );
}
