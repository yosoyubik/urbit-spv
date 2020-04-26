const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/UploadButton.js";import React, { useRef } from 'react';
import { Button } from 'indigo-react';

export default function UploadButton({ children, onChange, ...rest }) {
  const button = useRef();

  return (
    React.createElement('label', { htmlFor: "file", ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
      , React.createElement(Button, { accessory: "↑", solid: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
        , children
      )
      , React.createElement('input', {
        id: "file",
        ref: button,
        className: "super-hidden",
        type: "file",
        onChange: () => onChange(button.current), __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      )
    )
  );
}
