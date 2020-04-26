const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Buttons.js";import React from 'react';
import { Button } from 'indigo-react';

import { blinkIf } from './Blinky';

// NOTE: the -> is correct because inter recognizes the pair
export const ForwardButton = ({ loading, ...props }) => (
  React.createElement(Button, { accessory: blinkIf(loading, '->'), ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}} )
);
export const DownloadButton = ({ loading, ...props }) => (
  React.createElement(Button, { accessory: blinkIf(loading, '↓'), ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}} )
);
export const RestartButton = props => React.createElement(Button, { accessory: "↺", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}} );
export const GenerateButton = ({ loading, ...props }) => (
  React.createElement(Button, { accessory: blinkIf(loading, '○'), solid: true, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} )
);
export const OutButton = props => (
  React.createElement(Button, { as: "a", target: "_blank", accessory: "↗", ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
);

export const OfflineButton = props => (
  React.createElement(OutButton, { ...props, href: "https://github.com/urbit/bridge/releases", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Offline"

  )
);

export const BootUrbitOSButton = props => (
  React.createElement(OutButton, {
    href: "https://urbit.org/docs/getting-started",
    detail: "Boot your computer"  ,
    ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, "Boot Urbit OS"

  )
);
