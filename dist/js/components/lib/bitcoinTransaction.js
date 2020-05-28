const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/bitcoinTransaction.js";import React, { Component } from 'react';
import urbitOb from "urbit-ob";

import Ledger from '../../lib/ledger';

const BCoin = window.BCoin;
const Path = window.BPath.Path;
// const BInputData = window.BInputData.InputData;

const STATE = {
  INIT: 'INIT',
  POINT: 'POINT',
  READY: 'READY',
  COMPLETED: 'COMPLETED'
};


export default class BitcoinTransaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      manager: new Ledger(props.network)
    }
    this.buttonMessage = this.buttonMessage.bind(this);
    this.requestAddress = this.requestAddress.bind(this);
    this.sendBTCTransaction = this.sendBTCTransaction.bind(this);
  }

  buttonMessage(status, amount, point) {
    const label =
        status === STATE.INIT      ? `Send`
      : status === STATE.POINT     ? `Request address`
      : status === STATE.READY     ? 'Send'
      // : status === STATE.READY     ? `Send ${BCoin.Amount.btc(amount)}BTC to ${point}`
      : status === STATE.COMPLETED ? 'Transaction Completed'
      : 'error!';
    return label
  }

  requestAddress () {
      this.setState({
        error: false,
        awaitingAddres: true
      }, () => {
        //  UNCOMMENT ME!
        api.request.address(
          this.props.point.replace("~", ""),
          this.props.network
        )
          .then(() => {
          this.setState({awaitingAddres: false, status: STATE.READY});
        })
      });
  }

  async sendBTCTransaction () {
    const { state, props } = this;
    const {
      wallet, address, node, wdb, amount, keyring, coinType, account
    } = props;
    const type = wallet.network.keyPrefix.coinType;
    let mtx = await wallet.createTX({
      outputs: [{
        value: BCoin.Amount.value(amount),
        address: address.toString(node.network),
      }],
    });
    console.log("address1", address);
    console.log("address2", address.toString(node.network));
    console.log("MTX address");
    mtx.getAddresses().forEach((item, i) => {
      console.log(item.toBase58(node.network))
    });
    console.log("MTX Input address");
    mtx.getInputAddresses().forEach((item, i) => {
      console.log(item.toBase58(node.network))
    });
    console.log("MTX Output address");
    mtx.getOutputAddresses().forEach((item, i) => {
      console.log(item.toBase58(node.network))
    });
    console.log("outputs", mtx.outputs);
    console.log("mtx", mtx, mtx.mutable);
    const inputs = await wallet.getInputPaths(mtx);
    console.log(inputs);
    if (keyring) {
      console.log('seed signing2');
      const rings = [];
      for (const input of inputs) {
        const ring = new BCoin.wallet.WalletKey(
          keyring.derive(input.branch).derive(input.index).privateKey);
        console.log(ring);
        if (ring)
          rings.push(ring);
      }
      // Signing
      mtx.sign(rings);
    } else {
      console.log('ledger signing');
      const inputData = [];
      console.log(mtx.inputs);
      // From: https://github.com/bcoin-org/bsigner/blob/e8c9b80ee9559b3b32f16ff5c3d9f5d23b7b921c/test/utils/common.js#L83
      for (const input of mtx.inputs) {
          console.log("input", input);
          const data = {};
          // console.log(TX.isTX(input.tx));
          const prevhash = input.prevout.hash;
          const txRecord = await wallet.getTX(prevhash);
          data.prevTX = BCoin.TX.fromOptions(txRecord.tx);
          console.log(txRecord);
          const coin = mtx.view.getCoinFor(input);
          const path = Path.fromList([44, coinType, account], true);
          const base = path.clone();

          console.log('prevTX', BCoin.TX.isTX(data.prevTX))
          // const coin = mtx.view.getCoinFor(input);
          // const coin = await wallet.getCoin(prevhash, input.prevout.index);
          // const prevout = BCoin.Outpoint.fromOptions({
          //   hash: coin.hash,
          //   index: coin.index
          // });
          // data.prevout = prevout;
          // const coin = await wallet.getCoin(prevhash, input.prevout.index);
          const address = coin.getAddress();
          const addressPath = await wallet.getPath(address.getHash());
          data.path = base.push(addressPath.branch).push(addressPath.index);
          // This will fail with Nested addresses.
          data.witness = input.type === BCoin.Address.types.WITNESS;
          data.coin = coin;

          console.log("stil?", BCoin.TX.isTX(data.prevTX));
          inputData.push(data);
          console.log(data);
      }
      console.log("mtx", mtx, mtx.mutable);
      console.log("manager.signTransaction");
      // Signing
      mtx = await this.state.manager.signTransaction(mtx, inputData);
      console.log("onto verify!");
    }
    // The transaction should now verify.
    if (mtx.verify()) {
      console.log("verifiyed!");
      let tx = mtx.toTX();
      // We need to announce by hand since
      // spv nodes are always selfish
      console.log("sending...", BCoin.TX.isTX(tx));
      if (!BCoin.TX.isTX(tx)) {
        tx = BCoin.TX.fromOptions({
          version: tx.version,
          inputs: tx.inputs,
          outputs: tx.outputs,
          locktime: tx.locktime
        });
        console.log(BCoin.TX.isTX("now?", tx));
      }
      const ans = await node.sendTX(tx);
      console.log("adding...", ans);
      await wdb.addTX(tx);
      const balance = await wallet.getBalance();
      console.log(balance);
    } else {
      console.log("ERROR tx won't verify...", mtx, keyring);
    }
    // setConfirmedBalance(BCoin.Amount.btc(balance.confirmed));
    // setUnconfirmedBalance(BCoin.Amount.btc(balance.unconfirmed));
  }

  // startBitcoinTransaction () {
  //
  //   if (this.state.status === STATE.INIT) {
  //
  //   }


  //   this.setState({
  //     error: false,
  //     awaitingAddres: true
  //   }, () => {
  //     api.request.address(event.target.value)
  //       .then(() => {
  //       this.setState({awaitingAddres: false});
  //     })
  //   });
  //
  //   const address = Address.fromString('mn13AG6EAWvwAH59KdcWJU8iJkpccvBTpG');
  //   console.log(address, amount);
  //   const mtx = await this.state.wallet.createTX({
  //     outputs: [
  //       {
  //         value: BCoin.Amount.value(this.state.amount),
  //         address: address.toString(this.state.node.network),
  //       },
  //     ],
  //   });
  //   await this.state.wallet.sign(mtx);
  //   const tx = mtx.toTX();
  //   // We need to announce by hand since
  //   // spv nodes are always selfish
  //   this.state.node.relay(tx);
  //
  //   // We add the tx to our own wallet to see the UI updated.
  //   // In main net we wouldn't get a guarantee that
  //   //  the tx has been added.
  //   await this.state.wdb.addTX(tx);
  //
  //   const balance = await this.state.wallet.getBalance();
  //   console.log(balance);
  //   this.setState({
  //     confirmedBalance: BCoin.Amount.btc(balance.confirmed),
  //     unconfirmedBalance: BCoin.Amount.btc(balance.unconfirmed),
  //     sent: true
  //   });
  // }

  render() {
    const { props, state, buttonMessage, requestAddress, sendBTCTransaction } = this;
    const isDefaultState = ( props.point === undefined || props.amount === undefined );
    let isValidPoint;
    // let isReady;
    if (props.point) {
      isValidPoint = (!isDefaultState && urbitOb.isValidPatp(props.point));
    }
    const isReady = (isValidPoint && props.address !== undefined);

    let createClasses = !isDefaultState
      ? "pointer db f9 mt2 mr2 green2 bg-gray0-d ba pv4 ph4 b--green2"
      : "pointer db f9 mt2 mr2 gray2 ba bg-gray0-d pa2 pv4 ph4 b--gray3";

    return (
      React.createElement(React.Fragment, null
        ,  isDefaultState ? (
            React.createElement('button', {
              className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
              ,  buttonMessage(STATE.INIT, props.amount, props.point) 
            )
        ): null

        ,  (isValidPoint && !isReady) ? (
            React.createElement('button', {
              onClick: requestAddress,
              className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
              ,  buttonMessage(STATE.POINT, props.amount, props.point) 
            )
        ) : null

        ,  isReady ? (
            React.createElement('button', {
              onClick: sendBTCTransaction,
              className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
              ,  buttonMessage(STATE.READY, props.amount, props.point) 
            )
        ): null
      )

    );
  }
}
