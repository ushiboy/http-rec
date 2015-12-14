#!/usr/bin/env node

var program = require('commander'),
  path = require('path');
program
.version(require('../package.json').version)
.usage('<url> [options]')
.option('-d, --db [db path]', 'Set db file path. Default is ./rec_data.sqlite3', './rec_data.sqlite3')
.option('-P, --play', 'Set play mode (not recording).')
.option('-p, --port [port]', 'Set port. Default is 8008.', 8008)
.parse(process.argv);

var port = Number(program.port);
var httpRec = require('../lib').httpRec;
var dbPath = program.db;
var recording = program.play == null;

var target = program.args[0];
if (target === undefined) {
  program.help();
  process.exit(1);
} else {
  httpRec(target, dbPath, recording)
  .then(server => {
    server.listen(port);
  });
}
