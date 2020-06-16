# *Landscape* Bitcoin Wallet for \~Urbit


[Video Demo](https://youtu.be/QhFLzFDbq5c)

## Installation

In order to run the bitcoin wallet app on your ship, before `|install` is implemented natively on urbit, you will need to mount your pier to Unix with `|mount %`.

Then you need to add the path to you urbit's pier in .urbitrc. The file is not provided by this repo so you need to create it manually:

```
module.exports = {
  URBIT_PIERS: [
    "PATH/TO/YOUR/PIER",
  ]
};
```

This repo has been tested with nodejs v12.0.0. To install that run:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 12.0.0
nvm use 12.0.0
npm install
```

You have two options to mount the bitcoin into your pier:

- ##### `npm run build`

This builds your application and copies it into your Urbit ship's desk. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

- ##### `npm run serve`

Builds the application and copies it into your Urbit ship's desk, watching for changes. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

When you make changes, the `urbit` directory will update with the compiled application and, if you're running `npm run serve`, it will automatically copy itself to your Urbit ship when you save your.

## Using

From `%dojo` run `|start %bitcoin` and go to `<YOUR_URL>/~bitcoin`.

## Dependencies

In order to connect the SPV node that will be running on the browser you need to have a bcoin node installed and running in `regtest` mode.

To install bcoin run:

```
$ git clone git://github.com/bcoin-org/bcoin.git
$ cd bcoin
$ npm rebuild
$ ./bin/bcoin --network=regtest --bip37=true --http-port=48445 --listen-true --memory=false --log-level=spam --cors=true --wallet-cors=true --no-auth=true --host=127.0.0.1
```

This will have a local copy of the bitcoin blockchain that can create blocks and relay transactions to other nodes.

To generate blocks and get some coins run:

```
$ ./bin/bwallet-cli --network=regtest --account default address
## copy the address that's printed and paste it here:
$ ./bin/bcoin-cli --http-port=48445 --network=regtest rpc generatetoaddress 101 <YOUR_ADDRESS>
## run this to check that your wallet has some coins
$ ./bin/bwallet-cli --network=regtest --account=default balance
# This will send transactions to any addresses
$ ./bin/bwallet-cli --network=regtest --account default send <ADDRESS> <AMOUNT>
```

The browser can't make TCP calls

  For security reasons, web browsers do not allow scripts to create TCP connections to any server besides the one they are loaded from.

To circumvent that we need to connect the Bitcoin node to a proxy that will relay the calls for us. There's a WebSockets
server in this repo. In order to run it, open a new tab in your terminal and run from the root folder of the repo:

```
node btc-proxy-server.js
```

## Local two BCoin nodes

- Full Node with Bip37 support and SPV node.
```
$ ./bin/bcoin --network=regtest --bip37=true --http-port=48445 --listen-true --memory=false --log-level=spam --cors=true --wallet-cors=true --no-auth=true --host=127.0.0.1

$ ./bin/bcoin --network=regtest --spv --http-port=48449 --wallet-http-port=48450 --memory=false --prefix ~/.bcoin_spv  --max-outbound=1
```

## Appendix

# Bcoin dependencies

```
cd node_modules/bcoin
../bpkg/bin/bpkg --browser --umd --plugin [ uglify-es --toplevel ] --name BCoin --output ../../urbit/app/bitcoin/js/bcoin.js ./lib/bcoin.js
../bpkg/bin/bpkg --browser --umd --plugin [ uglify-es --toplevel ] --name Logger --output ../../urbit/app/bitcoin/js/logger.js ./lib/logger.js
../bpkg/bin/bpkg --browser --umd --plugin [ uglify-es --toplevel ] --name ProxySocket --output ../../urbit/app/bitcoin/js/proxy.js ./browser/src/proxysocket.js
../bpkg/bin/bpkg --browser --umd --plugin [ uglify-es --toplevel ] --name Worker --output ../../urbit/app/bitcoin/js/worker.js ./lib/workers/worker.js

cd node_modules/bledger
../bpkg/bin/bpkg --browser --umd --plugin [ uglify-es --toplevel ] --name BLedger --output ../../urbit/app/bitcoin/js/bledger.js ./lib/bledger.js
```

# Test mnemonics:

```
benefit crew supreme gesture quantum web media hazard theory mercy wing kitten
```

```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

```
legal winner thank year wave sausage worth useful legal winner thank yellow
```
