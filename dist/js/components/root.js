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
    this.connectClientNode = this.connectClientNode.bind(this);
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
    console.log(coinType, network);
    const mnemonic = new BCoin.hd.Mnemonic(this.state.seed);
    const privKey = BCoin.hd.fromMnemonic(mnemonic);
    //  BIP 44: m / purpose' / coin_type' / account' / change / index
    //  Account 0 is sent to the %bitcoin app for address derivation
    const key = privKey.derivePath(`m/44'/${coinType}'`);
    const accountKey = key.derive(this.state.account, true);
    const xpub = accountKey.xpubkey(network);
    this.setState({ xpubkey: xpub, keyring: accountKey });
    return {xpub: xpub, master: key};
  }

  getInfo() {
    const { state } = this;
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
    } else {
      xpub = BCoin.HDPublicKey.fromBase58(state.xpubkey).xpubkey(networkType);
    }
    const wallet = await wdb.ensure({
      id: ship,
      // master: master
      accountKey: xpub,
      watchOnly: true
    });

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

  async connectClientNode() {
    const network = BCoin.Network.get(this.state.network);
    const walletClient = new BCoin.WalletClient({
      host: '127.0.0.1',
      port: 48334,
      network: network.type
    });
    const nodeClient = new BCoin.NodeClient({
      host: '127.0.0.1',
      port: 48445,
      network: network.type
    });

    walletClient.bind('balance', (walletID, balance) => {
      console.log('New Balance:');
      console.log(walletID, balance);
      this.setState({
        unConfirmedBalance: BCoin.Amount.btc(balance.confirmed),
        confirmedBalance: BCoin.Amount.btc(balance.unconfirmed)
      });
    });
    walletClient.bind('address', (walletID, receive) => {
      console.log('New Receiving Address:');
      console.log(walletID, receive);
    });
    walletClient.bind('tx', (walletID, details) => {
      console.log('New Wallet TX:');
      console.log(walletID, details);
    });

    // listen for new blocks
    nodeClient.bind('block connect', (raw, txs) => {
      console.log('Node - Block Connect Event:\n', BCoin.ChainEntry.fromRaw(raw));
      const chain = BCoin.ChainEntry.fromRaw(raw);
      const { progress, height, hash } = this.parseChainEntry(raw);
      this.setState({
        progress: progress,
        height: height,
        hash: hash
      });
    });

    nodeClient.on('connect', async (e) => {
      try {
        console.log('Node - Connect event:\n', e);

        // `watch chain` subscirbes us to chain events like `block`
        console.log('Node - Attempting watch chain:\n', await nodeClient.call('watch chain'));

        // Some calls simply request information from the server like an http request
        console.log('Node - Attempting get tip:');
        const tip = await nodeClient.call('get tip');
        const { progress, height, hash } = this.parseChainEntry(tip);
        const peers = await nodeClient.execute('getpeerinfo');
        this.setState({
          progress: progress,
          height: height,
          hash: hash,
          peers: peers
        });

      } catch (e) {
        console.log('Node - Connection Error:\n', e);
      }
    });

    // Authenticate and join wallet after connection to listen for events
    walletClient.on('connect', async () => {
      // Join - All wallets
      //await walletSocket.call('join', '*', '<admin token>');
      let wallet;
      if (this.state.seed) {
        const keys = this.keyFromSeed(
          network.keyPrefix.coinType,
          network.type
        );
        const xpub = keys.xpub;
        const master = keys.master;
        console.log(xpub, master.isMaster(), master.toJSON(network.type));
        try {
          await walletClient.createWallet(ship, {
            mnemonic: this.state.seed
            // master: master.toBase58(network.type)
            // watchOnly: true,
            // accountKey: xpub
          });
        } catch (e) {
          console.log('Wallet: ', e);
        }
        wallet = walletClient.wallet(ship);
        await walletClient.call('join', ship);
        console.log("sending xpub");
        api.add.xpubkey(xpub);
      } else {
        if (!this.state.hasXPub ) {
          console.log(`ERROR: a wallet [${ship}] does not exist`);
        } else {
          wallet = walletClient.wallet(ship);
          console.log(wallet);
          await walletClient.call('join', ship);
        }
      }
      if (wallet) {
        const balance = await wallet.getBalance();
        this.setState({
          wallet: wallet,
          unConfirmedBalance: BCoin.Amount.btc(balance.confirmed),
          confirmedBalance: BCoin.Amount.btc(balance.unconfirmed)
        });
      }
    });

    // open socket to listen for events
    await walletClient.open();
    await nodeClient.open();

    console.log(nodeClient);

  }

  parseChainEntry(raw) {
    const chain = BCoin.ChainEntry.fromRaw(raw);
    const start = 1231006505;
    const current = chain.time - start;
    const end = Math.floor(Date.now() / 1000) - start - 40 * 60;
    return {
      progress: Math.min(1, current / end),
      height: chain.height,
      hash: Buffer.from(chain.hash).reverse().toString('hex')
    }
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
      React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
        , React.createElement('div', { className: "absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
          , React.createElement(HeaderBar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 340}})
          , React.createElement(Route, { exact: true, path: "/~bitcoin", render:  () => {
            return (
              React.createElement('div', { className: "cf w-100 flex flex-column pa4 ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl f9 white-d"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
                , React.createElement('h1', { className: "mb3 f8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}, "Bitcoin")
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}
                  , React.createElement('div', { className: "cf w-20 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
                    , React.createElement('button', {
                      // onClick={this.startNode}
                      onClick: this.connectClientNode,
                      className: createClasses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, "Start Node Sync"

                    )
                  )
                  , React.createElement('div', { className: "cf w-60 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
                    , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "Current Height: "
                        , state.height
                    )
                    , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}, "Current Hash: "
                        , state.hash
                    )
                    ,  ProgressBar(( (state.progress) ? state.progress : 0) )
                  )
                  , React.createElement('div', { className: "cf w-20 fl pa2 pt4 overflow-x-hidden bg-gray0-d white-d flex flex-column"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}
                    , React.createElement('div', { className: "f6 mono wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, "Balance: "
                       , confirmed
                    )
                    , React.createElement('div', { className: "f6 mono wrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}, "Pending: "
                       , Math.abs(confirmed - unconfirmed)
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
                  , React.createElement('div', { className: "cf w-50 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
                    , React.createElement('div', { className: "w-100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}, "Mnemonic seed" )
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
                        onChange: this.loadMnemonic, __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
                      )
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, "Extended Public Key"  )
                          , React.createElement('div', { className: "mono wrap" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
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
                              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
                            )
                          )
                      , React.createElement(ConnectLedger, {
                        loadXPubKey: this.loadFromLedger,
                        network: state.network, __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
                      )
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 pt4 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Proxy Socket URL"  )
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
                      onChange: this.loadSocket, __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
                    )
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}, "Trusted Peer Nodes"  )
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
                      onChange: this.loadTrustedPeers, __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
                    )
                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}, "Network")
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
                      onChange: this.selectNetwork, __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}

                    , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}, "Peer Nodes" )
                    , React.createElement('div', { className: 
                        "f7 ba b--gray3 b--gray2-d bg-gray0-d white-d pa1 db w-100 mt2 " +
                        "focus-b--black focus-b--white-d"
                      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}}
                      , React.createElement('div', { className: "dt dt--fixed f8 lh-copy db fw4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}, "Host"

                        )
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}, "Agent"

                        )
                        , React.createElement('div', { className: "fl w-third bb b--gray4 b--gray2-d gray2 tc"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}}, "Bytes (↑↓)"

                        )
                      )
                      , state.peers.map((peer, index) => {
                        const addr = peer.addr;
                        const subver = peer.subver;
                        const bytes = `${peer.bytessent}/${peer.bytesrecv}`;
                        return (
                          React.createElement('div', { key: index, className: "f9 dt dt--fixed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
                              , addr
                            )
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}
                              , subver
                            )
                            , React.createElement('div', { className: "fl w-third tc mono wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}
                              , bytes
                            )
                          )
                        )
                      })
                    )
                  )

                  , React.createElement('div', { className: "w-50 fl pa2 overflow-x-hidden " +
                                  "bg-gray0-d white-d flex flex-column", __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
                      , React.createElement('p', { className: "f8 mt3 lh-copy db"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}, "Payments"

                      )
                    , React.createElement('div', { className: "w-100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}
                      , React.createElement('div', { className: "fl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}
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
                          coinType: state.coinType, __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}
                          )
                      )
                      , React.createElement('div', { className: "w-third fl pr2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}
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
                          onChange: this.setPoint, __self: this, __source: {fileName: _jsxFileName, lineNumber: 527}}
                        )
                      )
                      , React.createElement('div', { className: "w-third fl pr2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}
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
                          onChange: this.setAmount, __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}
                        )
                      )
                    )
                  )
                )
            )
            )
          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
          )
        )
      )
    )
  }
}
