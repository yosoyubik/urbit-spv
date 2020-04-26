const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/CopiableWithTooltip.js";import React from 'react';
import cn from 'classnames';
import { ReactComponent as Copy } from 'assets/copy.svg';

import useCopiable from 'lib/useCopiable';
import WithTooltip from 'components/WithTooltip';

export default function CopiableWithTooltip({
  as: As = 'span',
  text,
  children,
  className,
  ...rest
}) {
  const [doCopy, didCopy] = useCopiable(text || children);

  return (
    React.createElement(As, { className: cn(className, 'nowrap'), ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
      , children
      , React.createElement(WithTooltip, { content: didCopy ? 'Copied!' : 'Copy', __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
        , React.createElement(Copy, {
          style: { height: '1em', width: '1em' },
          className: "ml1 pointer" ,
          onClick: doCopy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
        )
      )
    )
  );
}
