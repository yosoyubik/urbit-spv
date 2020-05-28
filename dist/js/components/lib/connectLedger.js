const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/connectLedger.js";import React, { Component } from 'react';
import urbitOb from "urbit-ob";

const BCoin = window.BCoin;
const usb = navigator.usb;
console.log(window.BManager);

import Ledger from '../../lib/ledger';


export default class ConnectLedger extends Component {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      manager: new Ledger(props.network),
    }

    this.setLedgerAccount = this.setLedgerAccount.bind(this);
    this.deriveXPubKey = this.deriveXPubKey.bind(this);
  }

  async deriveXPubKey() {
    const { props, state } = this;
    console.log(props, state);
    if (state.connected || state.account === undefined)
      return;
    this.setState({ connected: true });
    const {
      pubkey,
      path,
      account
    } = await this.state.manager.deriveXPubKey(this.state.account);
    props.loadXPubKey(pubkey, path, account);
    this.setState({ connected: false });
  }

  setLedgerAccount() {
    this.setState({account: event.target.value});
  }

  // async connectLedger() {
  //   const { props, state } = this;
  //   console.log(props, state);
  //   if (state.connected || state.account === undefined)
  //     return;
  //   console.log("mounting", state.manager);
  //   console.log("opening", usb);
  //   await state.manager.open();
  //   console.log(state.manager);
  //   const device = await state.manager.selectDevice();
  //   console.log(device);
  //   return device;
  //   // // this.setState({ device: device });
  //   // // this.renderManager();
  //   await device.open();
  //
  //   this.setState({ connected: true });
  //   // await state.manager.close();
  // }
  //
  // deriveXPubKey() {
  //   const device = this.connectLedger();
  //   console.log('Getting pk..');
  //   const coinType = (props.network === 'main') ? 0 : 1;
  //   const path = `m/44'/${coinType}'/${state.account}'`;
  //   const pubkey = await state.manager.getPublicKey(path);
  //   console.log('Public Key: ', pubkey.xpubkey(props.network));
  //   props.loadXPubKey(pubkey.xpubkey(props.network), path, state.account);
  //   this.setState({ connected: false });
  //   await device.close();
  //   await state.manager.close();
  // }
  //
  // async signTransaction(mtx, inputData) {
  //   const { state } = this;
  //   const device = this.connectLedger();
  //   mtx = await state.manager.signTransaction(mtx, inputData);
  //   await device.close();
  //   await state.manager.close();
  //   this.setState({ connected: false });
  //   return mtx
  // }
  //
  // deriveAddress(hd, change, index, network) {
  //   const pubkey = hd.derive(change).derive(index);
  //   const keyring = BCoin.KeyRing.fromPublic(pubkey.publicKey, network);
  //
  //   return keyring.getAddress().toString();
  // }

  render() {
    const { props, state, deriveXPubKey } = this;
    let createClasses = !state.connected
      ? "pointer db f9 mt2 green2 bg-gray0-d ba pv4 ph2 b--green2"
      : "pointer db f9 mt2 gray2 ba bg-gray0-d pv4 ph2 b--gray3";
    return (
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
        , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Ledger")
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
         , React.createElement('div', { className: "cf w-30 fl pr2 overflow-x-hidden bg-gray0-d white-d flex flex-column"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
            , React.createElement('button', {
              onClick: deriveXPubKey,
              className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
              ,  (state.connected) ? "Generating key": "Connect"
            )
          )
          , React.createElement('div', { className: "cf w-70 fl pr2 overflow-x-hidden bg-gray0-d white-d flex flex-column"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
            , React.createElement('textarea', {
              className: 
                "f9 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                "focus-b--black focus-b--white-d"
              ,
              rows: 1,
              placeholder: "Account number to derive the extended pubkey"      ,
              style: {
                resize: "none",
                height: 48,
                paddingTop: 10
              },
              onChange: this.setLedgerAccount, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
            )
          )
        )
      )
    );
  }
}
