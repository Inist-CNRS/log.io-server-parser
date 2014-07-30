# log.io-server-parser

Able to receive and parse messages from Log.io harvester.

## Installation

npm install log.io-server-parser

## Usage

```javascript

var server = new LogIoServerParser({
  port: 28777
});

server.listen();

server.on('+node', function (node, streams) {
  console.log('+node', node, streams);
});

server.on('-node', function (node) {
  console.log('-node', node);
});

server.on('+log', function (stream, node, type, log) {
  console.log('-log', stream, node, type, log);
});

server.on('unknown', function (data) {
  console.log('unknown', data);
});

```