const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/DownloadKeyfileButton.js";import React from 'react';
import { B } from 'indigo-react';

import { DownloadButton } from 'components/Buttons';

export default function DownloadKeyfileButton({
  // useKeyfileGenerator.bind
  generating,
  available,
  downloaded,
  download,
  notice,

  // from caller
  className,
  children = 'Download Arvo Keyfile',
  ...rest
}) {
  return (
    React.createElement(DownloadButton, {
      as: "span",
      className: className,
      disabled: downloaded || !available,
      disabledDetail: 
        !available && React.createElement(B, { className: "wrap ws-normal" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "· " , notice)
      ,
      loading: generating,
      onClick: download,
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
      , children
    )
  );
}
