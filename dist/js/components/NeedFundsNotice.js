const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/NeedFundsNotice.js";import React from 'react';
import { safeFromWei } from '../lib/lib';

import Highlighted from './Highlighted';
import CopiableAddress from './CopiableAddress';
import WarningBox from './WarningBox';
import Blinky from './Blinky';

export default function NeedFundsNotice({
  address,
  minBalance,
  balance,
  ...rest
}) {
  return (
    React.createElement(WarningBox, { ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
      , React.createElement(Highlighted, { warning: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, "Your ownership address "
           , React.createElement(CopiableAddress, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}, address), ' ', "needs at least "
           , safeFromWei(minBalance), " ETH and currently has"    , ' '
        , safeFromWei(balance), " ETH. The transaction will automatically resume once enough ETH is available. Waiting... "
              , React.createElement(Blinky, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} )
      )
    )
  );
}
