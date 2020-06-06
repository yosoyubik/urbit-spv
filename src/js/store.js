import { InitialReducer } from '/reducers/initial';
import { AddressReducer } from '/reducers/address';


class Store {

    constructor() {

        this.state = {
            walletDB: {},
        };

        this.initialReducer = new InitialReducer();
        this.addressReducer = new AddressReducer();
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

        this.setState(this.state);
    }
}

export let store = new Store();
window.store = store;
