const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/InviteSigilList.js";import React from 'react';
import cn from 'classnames';
import { Just, Nothing } from 'folktale/maybe';
import * as ob from 'urbit-ob';
import { take } from 'lodash';

import MaybeSigil from 'components/MaybeSigil';

const InviteSigilList = ({ className, pendingPoints, acceptedPoints }) => {
  const _acceptedPoints = take(
    acceptedPoints.getOrElse([]).map(x => Just(ob.patp(x))),
    6
  );

  const _pendingPoints = take(
    pendingPoints.getOrElse([]).map(x => Just(ob.patp(x))),
    6 - _acceptedPoints.length
  );

  const empty = [
    ...Array(
      Math.max(6 - _acceptedPoints.length - _pendingPoints.length, 0)
    ).keys(),
  ].map(() => Nothing());

  const renderSigil = (points, colors, klassName) => {
    return (
      React.createElement(React.Fragment, null
        , points.map((point, idx) => (
          React.createElement('div', {
            key: idx,
            title: point.getOrElse(null),
            className: cn(klassName, 'h9 w9'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
            , React.createElement(MaybeSigil, { patp: point, size: 50, colors: colors, __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
          )
        ))
      )
    );
  };

  return (
    React.createElement('div', { className: cn('flex justify-between', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
      , renderSigil(_acceptedPoints, ['#000000', '#FFFFFF'])
      , renderSigil(_pendingPoints, ['#ee892b', '#FFFFFF'])
      , renderSigil(empty, [], 'b1 b-gray3 b-dashed')
    )
  );
};

export default InviteSigilList;
