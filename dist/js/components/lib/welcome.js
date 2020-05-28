const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/welcome.js";import React, { Component } from 'react';


export class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      show: true
    }
    this.disableWelcome = this.disableWelcome.bind(this);
  }

  disableWelcome() {
    this.setState({ show: false });
    localStorage.setItem("bitcoin:wasWelcomed", JSON.stringify(true));
  }

  render() {
    let wasWelcomed = localStorage.getItem("bitcoin:wasWelcomed");
    if (wasWelcomed === null) {
      localStorage.setItem("bitcoin:wasWelcomed", JSON.stringify(false));
      return wasWelcomed = false;
    } else {
      wasWelcomed = JSON.parse(wasWelcomed);
    }

    let proof = !!this.props.proof ? this.props.proof : {};

    return ((!wasWelcomed && this.state.show) && (proof.length !== 0)) ? (
      React.createElement('div', { className: "ma4 pa2 bg-welcome-green bg-gray1-d white-d"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
        , React.createElement('p', { className: "f8 lh-copy" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, "Vires in Numeris"  )
        , React.createElement('p', { className: "f8 pt2 dib pointer bb"    ,
          onClick: (() => this.disableWelcome()), __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "Close this"

      )
      )
    ) : React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
  }
}

export default Welcome
