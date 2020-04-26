const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/indigo-react/components/AccessoryIcon.js";import React from 'react';

import Flex from './Flex';

const PENDING_ACCESSORY = '⋯';
const SUCCESS_ACCESSORY = '✓';
const FAILURE_ACCESSORY = '!';

function AccessoryIcon({ ...props }) {
  return (
    React.createElement(Flex, {
      justify: "center",
      align: "center",
      style: { height: '100%', width: '100%' },
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
    )
  );
}

AccessoryIcon.Pending = () => (
  React.createElement(AccessoryIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}, PENDING_ACCESSORY)
);

AccessoryIcon.Success = () => (
  React.createElement(AccessoryIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, SUCCESS_ACCESSORY)
);

AccessoryIcon.Failure = () => (
  React.createElement(AccessoryIcon, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, FAILURE_ACCESSORY)
);

export default AccessoryIcon;
