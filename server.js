'use strict';

var bodyParser = require('body-parser');
var connect = require('connect');
var debug = require('debug')('wspost:server');
var fs = require('fs');
var http = require('http');
var jwt = require('jsonwebtoken');
var WebSocketServer = require('ws').Server;

function broadcast(req, resp) {
  var channel = jwt.verify(req.url.slice(1), server.secret).channel;
  resp.end(wss.broadcast(req.body, channel).toString());
}

function example(req, resp) {
  resp.end(fs.readFileSync(__dirname + '/example.html'));
}

var onConnection = function (client) {
  var channel = client.upgradeReq.url.slice(1);
  if (!channel) return client.close();
  if (!this.channels[channel]) {
    debug('channel "%s" created', channel);
    this.channels[channel] = [];
  }
  debug('new client connected to "%s"', channel);
  this.channels[channel].push(client);
  client.on('close', onClose.bind(client, channel));
};

var onClose = function(channel) {
  var index = wss.channels[channel].indexOf(this);
  if (index != -1) {
    wss.channels[channel].splice(index, 1);
  }
  debug('client disconnected from "%s"', channel);
};

function sendMessage(message, client) {
  client.send(message);
}

WebSocketServer.prototype.channels = {};
WebSocketServer.prototype.broadcast = function(data, channel) {
  var message = JSON.stringify(data);
  var clients = this.channels[channel];
  if (!clients) return 0;
  debug('broadcast to %d clients on channel "%s"', clients.length, channel, message);
  clients.forEach(sendMessage.bind(null, message));
  return clients.length;
};

var app = connect();
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use('/broadcast', broadcast);
app.use('/example.html', example);

var server = http.createServer(app);

var wss = new WebSocketServer({
  server: server,
  clientTracking: false,
});
wss.on('connection', onConnection);

module.exports = server;
