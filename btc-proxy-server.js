// From: https://github.com/pinheadmz/mobilebcoin/blob/master/server.js
//
'use strict';

const bweb = require('bweb');
const WSProxy = require('./wsproxy');

const proxy = new WSProxy({
  ports: [8333, 18333, 48444, 18555, 18444, 28333, 28901]
});

const server = bweb.server({
  // host: '0.0.0.0',
  port: 9090,
  sockets: false,
  ssl: false
});

server.use(server.router());

server.on('error', (err) => {
  console.error('SERVER ERROR', err.stack);
});

server.get('/', (req, res) => {
  res.send(200, 'success');
});

proxy.attach(server.http);

proxy.on('error', (err) => {
  console.error('PROXY ERROR',err.stack);
});

server.open();
