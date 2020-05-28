import { BufferMap } from 'buffer-map';

const BCoin = window.BCoin;
const BManager = window.BManager;
const BInputData = window.BInputData.InputData;
const createLedgerInputs = window.BHelper.createLedgerInputs;
const applyOtherSignatures = window.BCommon.applyOtherSignatures;


export default class Ledger {

  constructor(network) {

    this.network = network;
    this.manager = BManager.fromOptions({network: network, timeout: 20000});

    this.manager.on('select', (device) => {
      console.log('Select', device.vendor, device.key, device.handle);
    });
    this.manager.on('deselect', (device) => {
        console.log('Deselect', device.vendor, device.key, device.handle);
    });
    this.manager.on('connect', (device) => {
      console.log('Connect:', device.vendor, device.key, device.handle);

      this.manager.selectDevice(device);
    });
    this.manager.on('disconnect', (device) => {
      console.log('Disconnect:', device.vendor, device.key, device.handle);
    });

  }

  async connectLedger() {
    await this.manager.open();
    const device = await this.manager.selectDevice();
    console.log(device);
    await device.open();
    return device;
  }

  async deriveXPubKey(account) {
    const device = await this.connectLedger();
    console.log('Getting pk..');
    const coinType = (this.network === 'main') ? 0 : 1;
    const path = `m/44'/${coinType}'/${account}'`;
    const pubkey = await this.manager.getPublicKey(path);
    console.log('Public Key: ', pubkey.xpubkey(this.network));
    // props.loadXPubKey(pubkey.xpubkey(this.network), path, account);
    await device.close();
    await this.manager.close();
    return {
      pubkey: pubkey.xpubkey(this.network),
      path: path,
      account: account
    }
  }

  async signTransaction(mtx, inputData) {
    console.log("signTransaction");
    const device = await this.connectLedger();
    console.log("connected");
    console.log("mtx", mtx, mtx.mutable);
    const smtx = await this.manager.signTransaction(mtx.toTX(), inputData);

    // const inputDataMap = new BufferMap();
    // for (let data of inputData) {
    //   const prevTX = data.prevTX;
    //   console.log("signTransaction", BCoin.TX.isTX(data.prevTX));
    //   if (!BInputData.isInputData(data))
    //     data = BInputData.fromOptions(data);
    //   const key = data.toKey();
    //   data.prevTX = prevTX;
    //   inputDataMap.set(key, data);
    // };
    //
    // const ledgerInputs = createLedgerInputs(
    //   tx,
    //   inputDataMap,
    //   network
    // );
    //
    // const mtx = BCoin.MTX.fromTX(tx);
    //
    // // add coins to the view.
    // for (const data of inputDataMap.values())
    //   mtx.view.addCoin(data.coin);
    //
    // await this.manager.ledgerApp.signTransaction(mtx, ledgerInputs);
    //
    // const signedMtx = applyOtherSignatures(mtx, inputDataMap, network);
    //
    // console.log("signed");
    await device.close();
    await this.manager.close();
    return smtx;
  }
}
