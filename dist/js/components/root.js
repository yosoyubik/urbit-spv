const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/root.js";import React, { Component } from "react";
import _ from 'lodash';
import { BrowserRouter, Route } from "react-router-dom";

import { store } from "/store";
import { api } from "/api";

import { HeaderBar } from "./lib/headerBar.js"
import ProgressBar from "./lib/progressBar";
import BitcoinTransaction from "./lib/bitcoinTransaction";
import ConnectLedger from "./lib/connectLedger";

const BCoin = window.BCoin;


export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    // this.state.seed = 'benefit crew supreme gesture quantum web media hazard theory mercy wing kitten';
    // this.state.progress = 0.0;
    this.state.peers = [];
    this.state.height = 0;
    this.state.hash = '';
    this.state.proxySocket = 'ws://127.0.0.1:9090';
    this.state.peerSeeds = ['127.0.0.1:48444'];
    this.state.network = 'regtest';
    this.state.account = 0;
    this.state.sent = false;

    store.setStateHandler(this.setState.bind(this));

    this.loadMnemonic = this.loadMnemonic.bind(this);
    this.loadSocket = this.loadSocket.bind(this);
    this.startNode = this.startNode.bind(this);
    this.loadTrustedPeers = this.loadTrustedPeers.bind(this);
    this.selectNetwork = this.selectNetwork.bind(this);
    this.setPoint = this.setPoint.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.loadFromLedger = this.loadFromLedger.bind(this);
    this.keyFromSeed = this.keyFromSeed.bind(this);
  }

  loadMnemonic(event) {
    this.setState({seed: event.target.value});
  }

  loadFromLedger(xpubkey, path, account) {
    this.setState({xpubkey: xpubkey, path: path, account: account});
  }

  loadTrustedPeers(event) {
    this.setState({peerSeeds: [event.target.value]});
  }

  selectNetwork(event) {
    this.setState({network: event.target.value});
  }

  loadSocket(event) {
    this.setState({proxySocket: event.target.value});
  }

  setPoint(event) {
    this.setState({point: event.target.value});
  }

  setAmount(event) {
    this.setState({amount: BCoin.Amount.value(event.target.value)});
  }

  keyFromSeed(coinType, network) {
    const mnemonic = new BCoin.hd.Mnemonic(this.state.seed);
    const privKey = BCoin.hd.fromMnemonic(mnemonic);
    //  BIP 44: m / purpose' / coin_type' / account' / change / index
    //  Account 0 is sent to the %bitcoin app for address derivation
    const key = privKey.derivePath(`m/44'/${coinType}'/${this.state.account}'`);
    const xpub = key.xpubkey(network);
    this.setState({ xpubkey: xpub, keyring: key });
    return {xpub: xpub, master: key};
  }

  getInfo() {
    const { state } = this;
    const node = state.node;

    const totalTX = node.mempool ? node.mempool.map.size : 0;
    const size = node.mempool ? node.mempool.getSize() : 0;
    let addr = node.pool.hosts.getLocal();
    if (!addr) addr = node.pool.hosts.address;
    const info = {
      network: node.network.type,
      chain: {
        height: node.chain.height,
        tip: node.chain.tip.rhash(),
        progress: node.chain.getProgress(),
      },
      pool: {
        host: addr.host,
        port: addr.port,
        agent: node.pool.options.agent,
        services: node.pool.options.services.toString(2),
        outbound: node.pool.peers.outbound,
        inbound: node.pool.peers.inbound,
      },
      mempool: {
        tx: totalTX,
        size: size,
      },
    };
    const peers = [];

    for (let peer = this.state.node.pool.peers.head(); peer; peer = peer.next) {
      peers.push({
        addr: peer.hostname(),
        subver: peer.agent,
        bytessent: peer.socket.bytesWritten,
        bytesrecv: peer.socket.bytesRead,
      });
    }

    this.setState({
      progress: node.chain.getProgress(),
      height: node.chain.height,
      hash: node.chain.tip.rhash(),
      peers: peers
    });
  }

  async startNode() {
    const { state } = this;
    const config = {
      hash: true,
      network: state.network,
      memory: false,
      logConsole: true,
      workers: true,
      workerFile: '/~bitcoin/js/worker.js',
      createSocket: (port, host) => {
        return window.ProxySocket.connect(this.state.proxySocket, port, host);
      },
      logger: new window.Logger({
        level: 'info',
        console: true,
      }),
      // https://github.com/bcoin-org/bcoin/issues/935
      // When running an SPV node with a wallet as a process there will be missing
      // transactions from blocks.
      // Solution: Run the SPV node and wallet in the same process as a plugin.
      plugins: [BCoin.wallet.plugin],
    }
    if (state.peerSeeds) {
      config.only = state.peerSeeds;
    }
    const spvNode = new BCoin.SPVNode(config);
    const { wdb } = spvNode.require('walletdb');

    await spvNode.ensure();
    await spvNode.open();
    await spvNode.connect();
    spvNode.startSync();
    const coinType = spvNode.network.keyPrefix.coinType;
    const networkType = spvNode.network.type;
    let xpub;
    let master;
    if (state.seed) {
      const keys = this.keyFromSeed(coinType, networkType);
      xpub = keys.xpub;
      master = keys.master
    }
    else {
      xpub = BCoin.HDPublicKey.fromBase58(state.xpubkey).xpubkey(networkType);
    }
    const wallet = await wdb.ensure({
      id: ship,
      // master: master
      accountKey: xpub,
      watchOnly: true
    });

    // Debugging
    const ak = BCoin.HDPublicKey.fromBase58(xpub);
    const pk = ak.derive(0).derive(0);
    const addr2 = new BCoin.KeyRing(pk);
    const anAddr = BCoin.Address.fromBase58(
      addr2.getAddress('base58', spvNode.network.type)
    );
    console.log(
      addr2.getAddress('base58', spvNode.network.type),
      anAddr,
      "is this my address?",
      await wallet.hasAddress(anAddr),
      await wallet.getAccountByAddress(anAddr)
    );
    // Test

    if (!state.hasXPub || state.seed) {
      console.log("sending xpub");
      api.add.xpubkey(xpub);
    }

    wallet.on('balance', balance => {
      console.log('Balance updated:\n', balance.toJSON());
      const nTX = balance.tx;
      const coins = balance.coin;
      this.setState({
        unConfirmedBalance: BCoin.Amount.btc(balance.confirmed),
        confirmedBalance: BCoin.Amount.btc(balance.unconfirmed)
      });
    });

    spvNode.on('block', async block => { this.getInfo(); });
    spvNode.on('block connect', async (block) => { this.getInfo(); });
    spvNode.on('tx', async tx => {
      await wdb.addTX(tx);
      const balance = await wallet.getBalance();
      const nTX = balance.tx;
      const coins = balance.coin;
      this.setState({
        unConfirmedBalance: BCoin.Amount.btc(balance.confirmed),
        confirmedBalance: BCoin.Amount.btc(balance.unconfirmed)
      });
    });
    spvNode.pool.on('peer connect', () => { this.getInfo(); });
    spvNode.pool.on('peer close', () => { this.getInfo(); });
    spvNode.pool.on('peer open', () => { this.getInfo(); });
    spvNode.pool.on('packet', () => { this.getInfo(); });

    this.setState({
      wallet: wallet,
      node: spvNode,
      wdb: wdb,
      coinType: coinType
    });
  }

  render() {
    const { props, state } = this;
    let node = !!state.node ? state.node : {};
    let confirmed = !!state.confirmedBalance ? state.confirmedBalance : 0;
    let unconfirmed = !!state.unConfirmedBalance ? state.unConfirmedBalance : 0;

    let createClasses = (!!state.seed || state.xpubkey)
      ? "pointer db f9 mt3 green2 bg-gray0-d ba pv3 ph4 b--green2"
      : "pointer db f9 mt3 gray2 ba bg-gray0-d pa2 pv3 ph4 b--gray3";

    return (
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
          , React.createElement(HeaderBar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 250}})
          , React.createElement(Route, { exact: true, path: "/~bitcoin", render:  () => {
            return (
              React.createElement('div', { className: "cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
                , React.createElement('h1', { className: "mb3 f8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "Bitcoin")
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
                  , React.createElement('div', { className: "cf w-20 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
                    , React.createElement('button', {
                      onClick: this.startNode,
                      className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}, "Start Node Sync"

                    )
                  )
                  , React.createElement('div', { className: "cf w-60 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
                    , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}, "Current Height: "
                        , state.height
                    )
                    , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, "Current Hash: "
                        , state.hash
                    )
                    ,  ProgressBar(( (state.progress) ? state.progress : 0) )
                  )
                  , React.createElement('div', { className: "cf w-20 fl pa2 pt4 overflow-x-hidden bg-gray0-d white-d flex flex-column"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}
                    , React.createElement('div', { className: "f6 mono wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}, "Balance: "
                       , confirmed
                    )
                    , React.createElement('div', { className: "f6 mono wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}, "Pending: "
                       , Math.abs(confirmed - unconfirmed)
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
                  , React.createElement('div', { className: "cf w-50 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                    , React.createElement('div', { className: "w-100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}, "Mnemonic seed" )
                      , React.createElement('textarea', {
                        className: 
                          "f9 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                          "focus-b--black focus-b--white-d"
                        ,
                        rows: 1,
                        placeholder: "benefit crew supreme gesture quantum web media hazard theory mercy wing kitten"           ,
                        style: {
                          resize: "none",
                          height: 48,
                          paddingTop: 14
                        },
                        onChange: this.loadMnemonic, __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}
                      )
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}, "Extended Public Key"  )
                          , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
                            , React.createElement('textarea', {
                              className: 
                                "f9 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                                "focus-b--black focus-b--white-d"
                              ,
                              rows: 1,
                              placeholder: state.xpubkey,
                              style: {
                                resize: "none",
                                height: 48,
                                paddingTop: 14
                              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                            )
                          )
                      , React.createElement(ConnectLedger, {
                        loadXPubKey: this.loadFromLedger,
                        network: state.network, __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
                      )
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Proxy Socket URL"  )
                    , React.createElement('textarea', {
                      className: 
                        "f8 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                        "focus-b--black focus-b--white-d"
                      ,
                      rows: 1,
                      placeholder: "ws://127.0.0.1:9090",
                      style: {
                        resize: "none",
                        height: 48,
                        paddingTop: 14
                      },
                      onChange: this.loadSocket, __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
                    )
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}, "Trusted Peer Nodes"  )
                    , React.createElement('textarea', {
                      className: 
                        "f8 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                        "focus-b--black focus-b--white-d"
                      ,
                      rows: 1,
                      placeholder: "No peers by default"   ,
                      style: {
                        resize: "none",
                        height: 48,
                        paddingTop: 14
                      },
                      onChange: this.loadTrustedPeers, __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
                    )
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "Network")
                    , React.createElement('textarea', {
                      className: 
                        "f8 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                        "focus-b--black focus-b--white-d"
                      ,
                      rows: 1,
                      placeholder: "main, testnet or regtest"   ,
                      style: {
                        resize: "none",
                        height: 48,
                        paddingTop: 14
                      },
                      onChange: this.selectNetwork, __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}

                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Peer Nodes" )
                    , React.createElement('div', { className: 
                        "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa1 db w-100 mt2 " +
                        "focus-b--black focus-b--white-d"
                      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
                      , React.createElement('div', { className: "dt dt--fixed f8 lh-copy db fw4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, "Host"

                        )
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, "Agent"

                        )
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}, "Bytes (↑↓)"

                        )
                      )
                      , state.peers.map((peer, index) => {
                        const addr = peer.addr;
                        const subver = peer.subver;
                        const bytes = `${peer.bytessent}/${peer.bytesrecv}`;
                        return (
                          React.createElement('div', { key: index, className: "f9 dt dt--fixed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                              , addr
                            )
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}
                              , subver
                            )
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                              , bytes
                            )
                          )
                        )
                      })
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}, "Payments"

                      )
                    , React.createElement('div', { className: "w-100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
                      , React.createElement('div', { className: "fl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}
                        , React.createElement(BitcoinTransaction, {
                          amount: state.amount,
                          point: state.point,
                          api: api,
                          address: state.address,
                          network: state.network,
                          wallet: state.wallet,
                          node: node,
                          wdb: state.wdb,
                          keyring: state.keyring,
                          account: state.account,
                          coinType: state.coinType, __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
                          )
                      )
                      , React.createElement('div', { className: "w-third fl pr2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
                        , React.createElement('textarea', {
                          className: 
                            "f8 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                            "focus-b--black focus-b--white-d"
                          ,
                          rows: 1,
                          placeholder: "~marzod",
                          style: {
                            resize: "none",
                            height: 48,
                            paddingTop: 14
                          },
                          onChange: this.setPoint, __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
                        )
                      )
                      , React.createElement('div', { className: "w-third fl pr2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
                        , React.createElement('textarea', {
                          className: 
                            "f8 ba b--gray3 b--gray2-d bg-gray0-d white-d pa3 db w-100 mt2 " +
                            "focus-b--black focus-b--white-d"
                          ,
                          rows: 1,
                          placeholder: "0.0 BTC" ,
                          style: {
                            resize: "none",
                            height: 48,
                            paddingTop: 14
                          },
                          onChange: this.setAmount, __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                        )
                      )
                    )
                  )
                )
            )
            )
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
          )
        )
      )
    )
  }
}
