const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/lib/root.js";import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import _ from 'lodash';
import { HeaderBar } from "./lib/header-bar.js"


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  render() {

    return (
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
        , React.createElement(HeaderBar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 19}})
        , React.createElement(Route, { exact: true, path: "/~bitcoin", render:  () => {
          return (
            React.createElement('div', { className: "cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
              , React.createElement('h1', { className: "mt0 f8 fw4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}, "bitcoin")
              , React.createElement('p', { className: "lh-copy measure pt3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "Welcome to your Landscape application."    )
              , React.createElement('p', { className: "lh-copy measure pt3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "To get started, edit "    , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "src/index.js"), " or "  , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "bitcoin.hoon"), " and "  , React.createElement('code', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "|commit %home" ), " on your Urbit ship to see your changes."        )
              , React.createElement('a', { className: "black no-underline db f8 pt3"    , href: "https://urbit.org/docs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}, "-> Read the docs"   )
            )
          )}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
        )
        )
      )
    )
  }
}
