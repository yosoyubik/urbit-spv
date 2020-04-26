const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/Greeting.js";import React, { useCallback } from 'react';
import cn from 'classnames';
import ob from 'urbit-ob';
import { Grid, Text, LinkButton } from 'indigo-react';

import { useLocalRouter } from 'lib/LocalRouter';

import useWasGreeted from 'lib/useWasGreeted';
import useCurrentPermissions from 'lib/useCurrentPermissions';

const TEXT_STYLE = 'f5';

export default function ActivateDisclaimer({ point }) {
  const { push, names } = useLocalRouter();

  const [wasGreeted, setWasGreeted] = useWasGreeted();
  const { isActiveOwner } = useCurrentPermissions();

  const pointName = ob.patp(point);

  const dismiss = useCallback(async () => {
    setWasGreeted(true);
  }, [setWasGreeted]);

  const goInvite = useCallback(() => push(names.INVITE), [push, names]);

  return (
    !wasGreeted && (
      React.createElement(Grid, { gap: 4, className: "mb10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
        , React.createElement(Grid.Item, { full: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb4'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, "Welcome "
             , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, pointName), ","
          )

          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, "As of this moment, you own a piece of Urbit. No one can take it from you, and you can keep it for the rest of your life."


          )
          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, "Keep your Master Ticket safe. No one can recover it for you. But it can get you back into Urbit at any time."


          )
          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}, "Right now you can:"

          )
        )

        , isActiveOwner && (
          React.createElement(Grid.Item, {
            full: true,
            as: LinkButton,
            onClick: goInvite,
            className: 'yellow4', __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
            , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Invite your friends"

            )
          )
        )

        , React.createElement(Grid.Item, {
          full: true,
          as: LinkButton,
          href: "https://urbit.org/docs/getting-started/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb2'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "Boot Arvo, the Urbit OS"

          )
        )

        , React.createElement(Grid.Item, { full: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
          , React.createElement(Text, { className: cn(TEXT_STYLE, 'block mb4'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Welcome to Urbit. See you online."

          )
        )
        , React.createElement(Grid.Item, { full: true, as: LinkButton, onClick: dismiss, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Close"

        )
      )
    )
  );
}
