const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/ledger.js";import React, { Component } from 'react';
import urbitOb from "urbit-ob";

const BCoin = window.BCoin;
const usb = navigator.usb;
console.log(window.BManager);

export default class Ledger extends Component {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      manager: window.BManager.fromOptions({network: props.network}),
      devices: [],
    }

    this.state.manager.on('select', (device) => {
      console.log('Select', device.vendor, device.key, device.handle);
    });
    this.state.manager.on('deselect', (device) => {
        console.log('Deselect', device.vendor, device.key, device.handle);
    });
    this.state.manager.on('connect', (device) => {
      console.log('Connect:', device.vendor, device.key, device.handle);

      this.state.manager.selectDevice(device);
    });
    this.state.manager.on('disconnect', (device) => {
      console.log('Disconnect:', device.vendor, device.key, device.handle);
    });

    this.setLedgerAccount = this.setLedgerAccount.bind(this);
    this.connectLedger = this.connectLedger.bind(this);
    this.deriveXPubKey = this.deriveXPubKey.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
  }

  // selectDevice (device) {
  //   console.log('Select', device.vendor, device.key, device.handle);
  // }
  // deSelectDevice (device) {
  //   console.log('Deselect', device.vendor, device.key, device.handle);
  // }
  // async connectDevice (device) {
  //   console.log('Connect:', device.vendor, device.key, device.handle);
  //
  //   await this.state.manager.selectDevice(device);
  //   await device.open();
  // }
  // disconnectDevice (device) {
  //   console.log('Disconnect:', device.vendor, device.key, device.handle);
  // }
  // setLedgerAccount() {
  //   this.setState({account: event.target.value});
  // }

  async connectLedger() {
    const { props, state } = this;
    console.log(props, state);
    if (state.connected || state.account === undefined)
      return;
    console.log("mounting", state.manager);
    console.log("opening", usb);
    await state.manager.open();
    console.log(state.manager);
    const device = await state.manager.selectDevice();
    console.log(device);
    return device;
    // // this.setState({ device: device });
    // // this.renderManager();
    await device.open();

    this.setState({ connected: true });
    // await state.manager.close();
  }

  deriveXPubKey() {
    const device = this.connectLedger();
    console.log('Getting pk..');
    const coinType = (props.network === 'main') ? 0 : 1;
    const path = `m/44'/${coinType}'/${state.account}'`;
    const pubkey = await state.manager.getPublicKey(path);
    console.log('Public Key: ', pubkey.xpubkey(props.network));
    props.loadXPubKey(pubkey.xpubkey(props.network), path, state.account);
    this.setState({ connected: false });
    await device.close();
    await state.manager.close();
  }

  async signTransaction(mtx, inputData) {
    const { state } = this;
    const device = this.connectLedger();
    mtx = await state.manager.signTransaction(mtx, inputData);
    await device.close();
    await state.manager.close();
    this.setState({ connected: false });
    return mtx
  }

  deriveAddress(hd, change, index, network) {
    const pubkey = hd.derive(change).derive(index);
    const keyring = BCoin.KeyRing.fromPublic(pubkey.publicKey, network);

    return keyring.getAddress().toString();
  }

  render() {
    const { props, state, connectLedger } = this;
    let createClasses = !state.connected
      ? "pointer db f9 mt2 green2 bg-gray0-d ba pv4 ph2 b--green2"
      : "pointer db f9 mt2 gray2 ba bg-gray0-d pv4 ph2 b--gray3";
    return (
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
        , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, "Ledger")
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
         , React.createElement('div', { className: "cf w-30 fl pr2 overflow-x-hidden bg-gray0-d white-d flex flex-column"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
            , React.createElement('button', {
              onClick: connectLedger,
              className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
              ,  (state.connected) ? "Generate xpub key": "Connect"
            )
          )
          , React.createElement('div', { className: "cf w-70 fl pr2 overflow-x-hidden bg-gray0-d white-d flex flex-column"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
            , React.createElement('textarea', {
              className: 
                "f9 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                "focus-b--black focus-b--white-d"
              ,
              rows: 1,
              placeholder: "Choose the account from which your address wil be derived"         ,
              style: {
                resize: "none",
                height: 48,
                paddingTop: 16
              },
              onChange: this.setLedgerAccount, __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
            )
          )
        )
      )
    );
  }
}
