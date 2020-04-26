const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/InlineEthereumTransaction.js";import React, { useMemo, useCallback } from 'react';
import cn from 'classnames';
import {
  Grid,
  ToggleInput,
  ErrorText,
  Flex,
  LinkButton,
  H5,
  Text,
} from 'indigo-react';

import { useExploreTxUrls } from 'lib/explorer';
import { hexify } from 'lib/txn';
import pluralize from 'lib/pluralize';

import { composeValidator, buildCheckboxValidator } from 'form/validators';
import BridgeForm from 'form/BridgeForm';
import Condition from 'form/Condition';

import { GenerateButton, ForwardButton, RestartButton } from './Buttons';
import CopyButton from './CopyButton';
import ProgressButton from './ProgressButton';
import convertToInt from 'lib/convertToInt';
import NeedFundsNotice from './NeedFundsNotice';

export default function InlineEthereumTransaction({
  // from useEthereumTransaction.bind
  initializing,
  canSign,
  generateAndSign,
  signed,
  broadcast,
  broadcasted,
  confirmed,
  completed,
  reset,
  error,
  gasPrice,
  setGasPrice,
  resetGasPrice,
  txHashes,
  nonce,
  chainId,
  needFunds,
  signedTransactions,
  confirmationProgress,

  // additional from parent
  label = 'Generate & Sign Transaction',
  className,
  onReturn,
}) {
  // show receipt after successful broadcast
  const showReceipt = broadcasted || confirmed || completed;
  // show configure controls pre-broadcast
  const showConfigureInput = !(signed || broadcasted || confirmed || completed);
  // show the send/loading button while signed, broadcasting, or confirme
  const showBroadcastButton = signed;
  const showLoadingButton = broadcasted || confirmed;
  const canBroadcast = signed && !needFunds;
  // show signed tx only when signing (for offline usage)
  const showSignedTx = signed;

  const validate = useMemo(
    () =>
      composeValidator({
        useAdvanced: buildCheckboxValidator(),
        viewSigned: buildCheckboxValidator(),
      }),
    []
  );

  const onValues = useCallback(
    ({ valid, values, form }) => {
      if (!values.useAdvanced) {
        resetGasPrice();
      }
    },
    [resetGasPrice]
  );

  const renderPrimarySection = () => {
    if (error) {
      return (
        React.createElement(Grid.Item, { full: true, as: RestartButton, solid: true, onClick: () => reset(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Reset Transaction"

        )
      );
    } else if (completed) {
      return (
        React.createElement(Grid.Item, { full: true, className: "pv4 black f5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Transaction Complete"

        )
      );
    } else if (showBroadcastButton) {
      return (
        React.createElement(Grid.Item, {
          full: true,
          as: ForwardButton,
          solid: true,
          success: true,
          disabled: !canBroadcast,
          onClick: () => broadcast(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Send Transaction"

        )
      );
    } else if (showLoadingButton) {
      return (
        React.createElement(Grid.Item, {
          full: true,
          as: ProgressButton,
          success: true,
          disabled: true,
          progress: confirmationProgress, __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "Sending Transaction"

        )
      );
    } else {
      return (
        React.createElement(Grid.Item, {
          full: true,
          as: GenerateButton,
          onClick: generateAndSign,
          disabled: !canSign,
          loading: !canSign && initializing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
          , label
        )
      );
    }
  };

  const serializedTxsHex = useMemo(
    () =>
      signedTransactions &&
      signedTransactions.map(stx => hexify(stx.serialize())),
    [signedTransactions]
  );

  return (
    React.createElement(Grid, { className: cn(className, 'mt1'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
      , React.createElement(BridgeForm, { validate: validate, onValues: onValues, __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
        , () => (
          React.createElement(React.Fragment, null
            , renderPrimarySection()

            , error && (
              React.createElement(Grid.Item, { full: true, as: ErrorText, className: "mv1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
                , error.message
              )
            )

            , needFunds && (
              React.createElement(Grid.Item, {
                full: true,
                as: NeedFundsNotice,
                className: "mt3",
                ...needFunds, __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
              )
            )

            , showConfigureInput && (
              React.createElement(React.Fragment, null
                , React.createElement(Grid.Item, {
                  full: true,
                  as: ToggleInput,
                  name: "useAdvanced",
                  label: "Advanced",
                  inverseLabel: "Back to Defaults"  ,
                  inverseColor: "red3",
                  disabled: !showConfigureInput || initializing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
                )

                , React.createElement(Condition, { when: "useAdvanced", is: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
                  , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 175}} )
                  , React.createElement(Grid.Item, {
                    full: true,
                    as: Flex,
                    row: true,
                    justify: "between",
                    className: "mt2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
                    , React.createElement(Flex.Item, { as: H5, __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, "Gas Price" )
                    , React.createElement(Flex.Item, { as: H5, __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}, gasPrice, " Gwei" )
                  )
                  /* TODO(shrugs): move to indigo/RangeInput */
                  , React.createElement(Grid.Item, {
                    full: true,
                    as: "input",
                    type: "range",
                    min: "1",
                    max: "100",
                    value: gasPrice,
                    onChange: e =>
                      setGasPrice(convertToInt(e.target.value, 10))
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                  )
                  , React.createElement(Grid.Item, {
                    full: true,
                    as: Flex,
                    row: true,
                    justify: "between",
                    className: "f6 mt1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                    , React.createElement(Flex.Item, { as: Text, __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, "Cheap")
                    , React.createElement(Flex.Item, { as: Text, __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}, "Fast")
                  )
                  , React.createElement(Grid.Divider, { className: "mt4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}} )
                )
              )
            )

            , showSignedTx && (
              React.createElement(React.Fragment, null
                , React.createElement(Grid.Item, {
                  full: true,
                  as: ToggleInput,
                  name: "viewSigned",
                  label: "Signed Transaction" ,
                  inverseLabel: "Hide",
                  disabled: !showSignedTx, __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
                )
                , React.createElement(Condition, { when: "viewSigned", is: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                  , React.createElement(SignedTransactionList, {
                    serializedTxsHex: serializedTxsHex,
                    gasPrice: gasPrice,
                    nonce: nonce, __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                  )
                )
              )
            )

            , showReceipt && (
              React.createElement(React.Fragment, null
                , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 233}} )
                , React.createElement(HashReceiptList, { txHashes: txHashes, __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}} )

                , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 236}} )
              )
            )

            , completed && (
              React.createElement(React.Fragment, null
                , React.createElement(Grid.Item, { full: true, as: RestartButton, onClick: onReturn, __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Return"

                )
                , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} )
              )
            )
          )
        )
      )
    )
  );
}

function SignedTransactionList({ serializedTxsHex, nonce, gasPrice }) {
  return serializedTxsHex.map((serializedTxHex, i) => (
    React.createElement(React.Fragment, { key: "i", __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 258}} )
      , React.createElement(Grid.Item, { full: true, as: Flex, justify: "between", className: "pv4 black f5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}
        , React.createElement(Flex.Item, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}, "Nonce")
        , React.createElement(Flex.Item, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, nonce + i)
      )
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 263}} )
      , React.createElement(Grid.Item, { full: true, as: Flex, justify: "between", className: "pv4 black f5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
        , React.createElement(Flex.Item, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}, "Gas Price" )
        , React.createElement(Flex.Item, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}, gasPrice.toFixed(), " Gwei" )
      )
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 268}} )
      , React.createElement(Grid.Item, { full: true, as: Flex, justify: "between", className: "mt3 mb2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
        , React.createElement(Flex.Item, { as: H5, __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}, "Signed Transaction Hex"  )
        , React.createElement(Flex.Item, { as: CopyButton, text: serializedTxHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}} )
      )
      , React.createElement(Grid.Item, { full: true, as: "code", className: "mb4 f6 mono gray4 wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
        , serializedTxHex
      )
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 276}} )
    )
  ));
}

function HashReceiptList({ txHashes }) {
  const txUrls = useExploreTxUrls(txHashes);
  const header = pluralize(txHashes.length, 'Hash', 'Hashes');
  return (
    React.createElement(React.Fragment, null
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 286}} )
      , React.createElement(Grid.Item, { full: true, as: Flex, col: true, className: "pv4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
        , React.createElement(Flex.Item, { as: H5, __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}, "Transaction " , header)

        , txHashes &&
          txHashes.map((txHash, i) => (
            React.createElement(Flex.Item, { as: Flex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
              , React.createElement(React.Fragment, null
                , React.createElement(Flex.Item, {
                  key: i,
                  flex: true,
                  as: "code",
                  className: "f6 mono gray4 wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                  , txHash
                )
                , React.createElement(Flex.Item, { as: LinkButton, href: txUrls[i], __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}, "Etherscan↗"

                )
              )
            )
          ))
      )
      , React.createElement(Grid.Divider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 308}} )
    )
  );
}
