const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/View.js";import React, { useCallback } from 'react';
import cn from 'classnames';
import { Flex } from 'indigo-react';

import Footer from './Footer';
import useBreakpoints from 'lib/useBreakpoints';
import MiniBackButton from './MiniBackButton';
import { useHistory } from 'store/history';
import NavHeader from './NavHeader';

const EXPECT_LOGOUT_WHEN_POPPING_AT_DEPTH = 2;

// View is a top-level component that all Views must render to inherit styling
function View({
  className,
  children,
  inset = false,
  full = false,
  pop,
  ...rest
}) {
  const { size } = useHistory();
  const isMobile = useBreakpoints([true, false, false]);
  const shouldInset = inset && !isMobile;

  const insetPadding = cn({
    pt7: shouldInset,
    pt5: !shouldInset,
  });

  const goBack = useCallback(() => pop(), [pop]);

  const goLogout = useCallback(() => pop(size - 1), [pop, size]);

  const showBackButton = size > 1 && !!pop;
  const backIsLogout = size === EXPECT_LOGOUT_WHEN_POPPING_AT_DEPTH;

  const Header = useCallback(
    ({ logout }) => {
      return showBackButton ? (
        React.createElement(Flex.Item, {
          as: Flex,
          className: cn(insetPadding, 'flex-row-r justify-between pb5'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
          , React.createElement(Flex.Item, {
            onClick: goLogout,
            as: "a",
            className: "f5 gray4 underline mr2 pointer"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}, "Logout"

          )
          , React.createElement(Flex.Item, { as: NavHeader.Target, __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}} )
        )
      ) : (
        React.createElement(Flex.Item, { className: insetPadding, as: NavHeader.Target, __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
      );
    },
    [goLogout, insetPadding, showBackButton]
  );

  return (
    React.createElement(Flex, {
      row: !isMobile,
      col: isMobile,
      justify: "between",
      className: cn(
        'minh-100 ph5',
        {
          mw1: !full,
          'mw2 ph9-md ph10-lg': full,
        },
        className
      ),
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
      , React.createElement(Flex.Item, {
        as: Flex,
        col: true,
        style: { width: '48px' },
        className: cn(insetPadding), __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
        , showBackButton && !backIsLogout && (
          React.createElement(MiniBackButton, {
            hpadding: !isMobile,
            vpadding: isMobile,
            isExit: backIsLogout,
            onClick: goBack, __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
          )
        )
      )

      , React.createElement(Flex.Item, { flex: 1, as: Flex, col: true, justify: "between", __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
        , React.createElement(Flex.Item, { className: "pb5 " , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
          , React.createElement(Header, { logout: goBack, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} )
          , children
        )
        , React.createElement(Flex.Item, { as: Footer.Target, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}} )
      )

      , React.createElement(Flex.Item, { style: { width: '48px' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}} )
    )
  );
}

// View.Full is sugar for <View full /> to help with readability
View.Full = function FullView(props) {
  return React.createElement(View, { full: true, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}} );
};

export default View;
