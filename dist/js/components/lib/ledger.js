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
      manager: window.BManager.fromOptions({network: 'regtest'}),
      devices: [],
    }

    this.setLedgerAccount = this.setLedgerAccount.bind(this);
    this.connectLedger = this.connectLedger.bind(this);
  }

  selectDevice (device) {
    console.log('Select', device.vendor, device.key, device.handle);
  }

  deSelectDevice (device) {
    console.log('Deselect', device.vendor, device.key, device.handle);
  }

  async connectDevice (device) {
    console.log('Connect:', device.vendor, device.key, device.handle);

    await this.state.manager.selectDevice(device);
    await device.open();
  }

  disconnectDevice (device) {
    console.log('Disconnect:', device.vendor, device.key, device.handle);
  }

  setLedgerAccount() {
    this.setState({account: event.target.value});
  }

  async connectLedger() {
    if (this.state.connected)
      return;
    console.log("mounting", this.state.manager);
    this.state.manager.on('select', (device) => {
      console.log('Select', device.vendor, device.key, device.handle);
    });
    this.state.manager.on('deselect', (device) => {
        console.log('Deselect', device.vendor, device.key, device.handle);
    });
    this.state.manager.on('connect', (device) => {
      console.log('Connect:', device.vendor, device.key, device.handle);

      manager.selectDevice(device);
    });
    this.state.manager.on('disconnect', (device) => {
      console.log('Disconnect:', device.vendor, device.key, device.handle);
    });
    console.log("opening", usb);
    await this.state.manager.open();
    console.log(this.state.manager);
    const device = await this.state.manager.selectDevice();
    console.log(device);
    // this.setState({ device: device });
    // this.renderManager();
    await device.open();

    console.log('Getting pk..');
    const pubkey = await this.state.manager.getPublicKey('m/44\'/1\'/0\'');
    console.log('Public Key: ', pubkey.xpubkey('regtest'));

    await this.state.manager.close();
    this.setState({ connected: true });
  }

  deriveAddress(hd, change, index, network) {
    const pubkey = hd.derive(change).derive(index);
    const keyring = BCoin.KeyRing.fromPublic(pubkey.publicKey, network);

    return keyring.getAddress().toString();
  }

  render() {
    const { props, state, connectLedger } = this;
    console.log(props.node);
    let createClasses = !state.connected
      ? "pointer db f9 mt7 green2 bg-gray0-d ba pv3 ph4 b--green2"
      : "pointer db f9 mt7 gray2 ba bg-gray0-d pa2 pv3 ph4 b--gray3";
    return (
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
        , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Account")
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
            paddingTop: 14
          },
          onChange: this.setLedgerAccount, __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
        )
        , React.createElement('button', {
          onClick: connectLedger,
          className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
          ,  (state.connected) ? "Generate xpub key": "Connect your Ledger"
        )
      )
    );
  }
}
