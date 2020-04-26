const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/Tabs.js";import React from 'react';
import cn from 'classnames';
import { Grid, Flex } from 'indigo-react';

export default function Tabs({
  views,
  options,
  currentTab,
  onTabChange,
  className,
  center = false,
  ...rest
}) {
  const Tab = views[currentTab];

  return (
    React.createElement(Grid, { className: className, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
      , React.createElement(Grid.Item, { full: true, as: Flex, className: "b-gray3 bb1 scroll-x hidden-y"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
        , React.createElement(Flex.Item, { as: Flex, className: "flex1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
          , options.map((option, i) => {
            const isActive = option.value === currentTab;
            const isFirst = i === 0;

            return (
              React.createElement(Flex.Item, {
                key: option.value,
                onClick: () => onTabChange(option.value),
                className: cn(
                  'f5 pv3 pointer nowrap',
                  {
                    'black b-black bb1': isActive,
                    gray3: !isActive,
                  },
                  {
                    't-center flex1': center,
                  },
                  {
                    // all items have right margin/padding
                    'mr2 pr2': !center,
                    // the first one is flush to the left
                    'ml2 pl2': !isFirst && !center,
                  }
                ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
                , option.text
              )
            );
          })
        )
      )
      , React.createElement(Grid.Item, { full: true, as: Tab, ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}} )
    )
  );
}
