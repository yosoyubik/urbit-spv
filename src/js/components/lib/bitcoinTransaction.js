import React, { Component } from 'react';
import urbitOb from "urbit-ob";


const STATE = {
  INIT: 'INIT',
  POINT: 'POINT',
  READY: 'READY',
  COMPLETED: 'COMPLETED'
};

const BCoin = window.BCoin;

export default class BitcoinTransaction extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.buttonMessage = this.buttonMessage.bind(this);
    this.requestAddress = this.requestAddress.bind(this);
    this.sendBTCTransaction = this.sendBTCTransaction.bind(this);
  }

  buttonMessage(status, amount, point) {
    console.log(status, amount, point);
    const label =
        status === STATE.INIT      ? `Enter @p and amount`
      : status === STATE.POINT     ? `Request New Address from ${point}`
      : status === STATE.READY     ? `Send ${BCoin.Amount.btc(amount)}BTC to ${point}`
      : status === STATE.COMPLETED ? 'Transaction Completed'
      : 'error!';
    return label
  }

  requestAddress () {
      this.setState({
        error: false,
        awaitingAddres: true
      }, () => {
        api.request.address(
          this.props.point.replace("~", ""),
          this.props.network
        )
        //   .then(() => {
        //   this.setState({awaitingAddres: false, status: STATE.READY});
        // })
      });
  }

  async sendBTCTransaction () {
    const { state, props } = this;
    const { wallet, address, node, wdb, amount } = props;

    const mtx = await wallet.createTX({
      outputs: [
        {
          value: BCoin.Amount.value(amount),
          address: address.toString(node.network),
        },
      ],
    });
    await wallet.sign(mtx);
    const tx = mtx.toTX();
    // We need to announce by hand since
    // spv nodes are always selfish
    node.relay(tx);

    await wdb.addTX(tx);

    const balance = await wallet.getBalance();
    console.log(balance)
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
    console.log(props);
    console.log(props.address, props.point, props.amount);
    console.log(props.point === '' , props.amount === 0);
    const isDefaultState = ( props.point === undefined || props.amount === undefined );
    let isValidPoint;
    // let isReady;
    console.log(isDefaultState);
    if (props.point) {
      isValidPoint = (!isDefaultState && urbitOb.isValidPatp(props.point));
      console.log(isValidPoint);
      console.log(props.address);
  }
    const isReady = (isValidPoint && props.address !== undefined);
    console.log(isReady);
    console.log(isValidPoint, isReady);

    let createClasses = !isDefaultState
      ? "pointer db f9 mt7 green2 bg-gray0-d ba pv3 ph4 b--green2"
      : "pointer db f9 mt7 gray2 ba bg-gray0-d pa2 pv3 ph4 b--gray3";

    return (
      <>
        { isDefaultState ? (
            <button
              className={createClasses}>
              { buttonMessage(STATE.INIT, props.amount, props.point) }
            </button>
        ): null}

        { (isValidPoint && !isReady) ? (
            <button
              onClick={requestAddress}
              className={createClasses}>
              { buttonMessage(STATE.POINT, props.amount, props.point) }
            </button>
        ) : null}

        { isReady ? (
            <button
              onClick={sendBTCTransaction}
              className={createClasses}>
              { buttonMessage(STATE.READY, props.amount, props.point) }
            </button>
        ): null}
      </>

    );
  }
}
