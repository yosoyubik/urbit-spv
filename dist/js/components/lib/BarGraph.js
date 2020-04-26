const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/BarGraph.js";import React from 'react';
import cn from 'classnames';
import { Nothing } from 'folktale/maybe';

const BarGraph = ({
  className,
  available = Nothing(),
  sent = Nothing(),
  accepted = Nothing(),
}) => {
  const _available = available.getOrElse(1);
  const _sent = sent.getOrElse(0);
  const _accepted = accepted.getOrElse(0);
  const total = _available + _sent;
  return (
    React.createElement('div', { className: cn('h7 p1 b1 b-black flex', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
      , React.createElement('div', {
        className: "bg-black",
        style: { width: `${(_accepted / total) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}})
      , React.createElement('div', {
        className: "bg-yellow4",
        style: { width: `${((_sent - _accepted) / total) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}})

      , React.createElement('div', { className: "flex-grow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
    )
  );
};

export default BarGraph;
