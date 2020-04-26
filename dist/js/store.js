import { InitialReducer } from '/reducers/initial';
import { AddressReducer } from '/reducers/address';
import { UpdateReducer } from '/reducers/update';
// import ProxySocket from 'bcoin/browser/src/proxysocket';
// import * as BCoin from 'bcoin/lib/bcoin-browser';

// import * as BCoin from 'BCoin';
//
const BCoin = window.Bcoin;
const Logger = window.Logger;


class Store {

    constructor() {

        this.state = {
            node: {},
            walletDB: {},
            account: {}
        };

        this.initialReducer = new InitialReducer();
        this.addressReducer = new AddressReducer();
        this.updateReducer = new UpdateReducer();
        this.setState = () => { };
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        console.log(json);
        console.log(this.state);
        this.initialReducer.reduce(json, this.state);
        this.addressReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);

        this.setState(this.state);
    }
}

export let store = new Store();
window.store = store;
