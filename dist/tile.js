const _jsxFileName = "/Users/jose/urbit/btc-landscape/tile/tile.js";import React, { Component } from 'react';
import _ from 'lodash';


export default class bitcoinTile extends Component {

  render() {
    return (
      React.createElement('div', { className: "w-100 h-100 relative bg-white bg-gray0-d ba b--black b--gray1-d"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
        , React.createElement('a', { className: "w-100 h-100 db pa2 no-underline"    , href: "/~bitcoin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}
          , React.createElement('p', { className: "black white-d absolute f9"   , style: { left: 8, top: 8 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}, "bitcoin")
          , React.createElement('img', { className: "absolute", src: "/~bitcoin/img/Tile.png", style: {top: 48, left: 48}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}})
        )
      )
    );
  }

}

window.bitcoinTile = bitcoinTile;
