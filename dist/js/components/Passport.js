const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/Passport.js";import React, { useMemo } from 'react';
import { Just, Nothing } from 'folktale/maybe';
import ob from 'urbit-ob';
import BN from 'bn.js';
import 'style/anim.css';

import * as need from 'lib/need';
import { chunkStr, Matrix, walk, rand } from 'lib/card';
import usePermissionsForPoint from 'lib/usePermissionsForPoint';
import { useSyncOwnedPoints } from 'lib/useSyncPoints';
import { buildKeyType } from 'lib/point';

import { useWallet } from 'store/wallet';

import { sigil, reactRenderer } from 'urbit-sigil-js';

function makeSigil(size, patp, colors) {
  const config = {
    patp: patp,
    colors: colors,
    margin: 0,
    renderer: reactRenderer,
  };

  // Planet
  if (patp.length === 14) {
    return sigil({
      patp: patp,
      size: size,
      ...config,
    });
  }
  // Star
  if (patp.length === 7) {
    return sigil({
      patp: patp,
      width: size * 2,
      height: size,
      full: true,
      ...config,
    });
  }
  // Galaxy
  if (patp.length === 4) {
    return sigil({
      patp: patp,
      size: size,
      full: true,
      ...config,
    });
  }
}

const symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/**
 * Address is Maybe<string>
 * point is Maybe<string>
 * animationMode is 'slide' | 'step' | 'none'
 *
 */
function Passport({
  address,
  point,
  inverted,
  animationMode = 'none',
  keyType,
}) {
  const [cols, rows, tile] = [35, 12, 12];

  const loading = Nothing.hasInstance(address) || Nothing.hasInstance(point);
  const defaultMatrix = () => {
    return Matrix.new(rows, cols);
  };

  const patp = ob.patp(point.value);

  const makeMatrix = addr => {
    // remove the 0x
    const onlyTheNumberPart = addr.substring(2);
    // make bigNum from hex
    const int = new BN(onlyTheNumberPart, 16);
    // make a bigger number
    const big = int.pow(new BN(10));
    // parse that to a string and pad
    const b10 = big.toString(10).padStart(32, '0');
    // split the big number into parts
    const chunkSize = Math.ceil(b10.length / 8);
    const chunks = chunkStr(b10, chunkSize).map(c => new BN(c));
    // generate an empty matrix
    const startMatrix = Matrix.new(rows, cols);
    // do a few random walks starting at diff coordinates
    const [, matrix] = chunks.reduce((acc, chunk) => {
      return walk(chunk, acc[1]);
      // start with the 'random' points (not actually random, they are deterministic)
    }, rand(big, startMatrix));

    return matrix;
  };

  const matrix = address.matchWith({
    Just: ({ value }) => makeMatrix(value),
    Nothing: defaultMatrix,
  });

  const bgColor = inverted ? 'white' : 'black';

  const fgColor = inverted ? 'black' : 'white';

  const sigil = useMemo(
    () => Just.hasInstance(point) && makeSigil(64, patp, [bgColor, fgColor]),
    [patp, point, bgColor, fgColor]
  );
  return (
    React.createElement('div', {
      style: {
        fontFamily: 'Inter',
        backgroundColor: bgColor,
        border: inverted ? '2px solid #E6E6E6' : '2px solid black',
        borderRadius: '20px',
        marginBottom: '16px',
        width: `${16 + 16 + cols * tile}px`,
        minWidth: `${16 + 16 + cols * tile}px`,
        display: 'flex',
        flexDirection: 'column',
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
      , React.createElement('div', {
        style: {
          height: '64px',
          padding: '16px',
          display: 'flex',
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
        , React.createElement('div', {
          style: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
          , sigil
          , React.createElement('div', {
            style: {
              marginLeft: '16px',
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
            , React.createElement('div', {
              style: {
                fontWeight: '600',
                color: fgColor,
                fontSize: '16px',
                fontFamily: 'Source Code Pro',
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
              , Just.hasInstance(point) && patp
            )
            , keyType !== '' ? (
              React.createElement('div', {
                style: {
                  marginTop: '8px',
                  fontWeight: '500',
                  color: fgColor,
                  fontSize: '14px',
                  fontFamily: 'Source Code Pro',
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
                , keyType
              )
            ) : (
              React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 165}} )
            )
          )
        )
      )
      , React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          paddingTop: '0px',
          filter: inverted ? 'invert(1)' : '',
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
        , matrix.map((row, _row) => {
          return (
            React.createElement('div', {
              key: `card:row:${_row}`,
              style: { display: 'flex', justifyContent: 'space-between' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
              , row.map((v, _col) => {
                return (
                  React.createElement(Cell, {
                    row: _row,
                    col: _col,
                    value: typeof symbols[v] === 'undefined' ? 13 : v,
                    spriteSheet: 'a',
                    spriteSheetHeight: 12,
                    spriteSheetWidth: 168,
                    inverted: inverted,
                    loading: loading,
                    animationMode: animationMode, __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                  )
                );
              })
            )
          );
        })
      )
    )
  );
}

const Cell = props => {
  return (
    React.createElement('div', {
      key: `card:cell:${props.row}:${props.col}:${props.value}`,
      className: 
        props.loading
          ? 'blink'
          : props.animationMode === 'none'
          ? ''
          : `${props.animationMode}-h-${props.value}`
      ,
      style: {
        backgroundImage: `url(/spritesheet_a.png)`,
        backgroundPosition:
          props.animationMode === 'none'
            ? `-${props.spriteSheetHeight * props.value}px 0px`
            : '',
        backgroundSize: `${props.spriteSheetWidth}px ${props.spriteSheetHeight}px`,
        width: `${props.spriteSheetHeight}px`,
        maxWidth: `${props.spriteSheetHeight}px`,
        height: `${props.spriteSheetHeight}px`,
        maxHeight: `${props.spriteSheetHeight}px`,
        animationDelay: `${props.value * 50}ms`,
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
    )
  );
};

/**
 * point is number
 *
 */
function MiniPassport({ point, inverted, ...rest }) {
  useSyncOwnedPoints([point]);
  const { wallet } = useWallet();
  const address = need.addressFromWallet(wallet);

  const patp = ob.patp(point);
  const permissions = usePermissionsForPoint(address, point);
  const keyType = buildKeyType(permissions);
  const sigil = useMemo(
    () =>
      makeSigil(44, patp, inverted ? ['white', 'black'] : ['black', 'white']),
    [inverted, patp]
  );
  return (
    React.createElement('div', {
      style: {
        fontFamily: 'Inter',
        backgroundColor: inverted ? 'white' : 'black',
        border: inverted ? '2px solid #E6E6E6' : '2px solid black',
        borderRadius: '20px',
        marginBottom: '16px',
        maxWidth: `${230}px`,
        display: 'flex',
        flexDirection: 'column',
      },
      ...rest, __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
      , React.createElement('div', {
        style: {
          height: '44px',
          padding: '16px',
          display: 'flex',
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
        , React.createElement('div', {
          style: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
          , sigil
          , React.createElement('div', {
            style: {
              marginLeft: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}
            , React.createElement('div', {
              style: {
                fontWeight: '600',
                color: inverted ? 'black' : 'white',
                fontSize: '14px',
                fontFamily: 'Source Code Pro',
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
              , patp
            )
            , keyType !== '' ? (
              React.createElement('div', {
                style: {
                  marginTop: '8px',
                  fontWeight: '500',
                  color: inverted ? 'black' : 'white',
                  fontSize: '12px',
                  fontFamily: 'Source Code Pro',
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                , keyType
              )
            ) : (
              React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} )
            )
          )
        )
      )
    )
  );
}

Passport.Mini = MiniPassport;

export default Passport;
