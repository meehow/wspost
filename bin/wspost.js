#!/usr/bin/env node

var jwt = require('jsonwebtoken');
var program = require('commander');

var server = require('../server');
var version = require('../package.json').version;

program
  .version(version)
  .option('-g, --gentoken <channel_name>', 'generate channel token')
  .option('-s, --secret <secret_key>', 'secret key - Use the same secret for generating a token and starting a server.')
  .option('-l, --listen [port]', 'listen (on given port)')
  .parse(process.argv);

server.secret = program.secret || process.env.SECRET_KEY;

if (program.gentoken) {
  console.log(jwt.sign({
    channel: program.gentoken,
  }, server.secret));
} else if (program.listen) {
  var port = process.env.PORT || 3000;
  if (typeof(program.listen) != 'boolean') {
    port = program.listen;
  }
  server.listen(port);
  console.log('Listening on port %s', port);
} else {
  program.help();
}
