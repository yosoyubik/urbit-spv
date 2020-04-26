import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class UrbitApi {
  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
    this.bindPaths = [];

    this.request = {
      address: this.requestAddress.bind(this),
    };

    this.add = {
      xpubkey: this.addXPubKey.bind(this),
    };
  }

  bind(path, method, ship = this.authTokens.ship, appl = "bitcoin", success, fail) {
    this.bindPaths = _.uniq([...this.bindPaths, path]);

    window.subscriptionId = window.urb.subscribe(ship, appl, path,
      (err) => {
        fail(err);
      },
      (event) => {
        success({
          data: event,
          from: {
            ship,
            path
          }
        });
      },
      (err) => {
        fail(err);
      });
  }

  bitcoin(data) {
    this.action("bitcoin", "json", data);
  }

  requestAddress(ship, network) {
    console.log(network);
    return this.action("bitcoin", "bitcoin-action", {
      request: {
        ship: ship,
        network: network
      }
    });

  }

  addXPubKey(xpubkey) {
    // console.log(config, badges);
    return this.action("bitcoin", "bitcoin-action", {
      add: xpubkey
    });

  }

  action(appl, mark, data) {
    return new Promise((resolve, reject) => {
      window.urb.poke(ship, appl, mark, data,
        (json) => {
          resolve(json);
        },
        (err) => {
          reject(err);
        });
    });
  }
}
export let api = new UrbitApi();
window.api = api;
