# log.io-server-parser

Able to receive and parse messages from [Log.io](http://logio.org/) harvester.
A common use case is to build a proxy between log.io-harvester and log.io-server.

## Installation

```bash
npm install log.io-server-parser
```

## Usage

```javascript
var LogIoServerParser = require('log.io-server-parser');

var server = new LogIoServerParser({
  port: 28777
});

server.listen(function () {
  console.log('listening');
});

server.on('+node', function (node, streams) {
  console.log('+node', node, streams);
});

server.on('-node', function (node) {
  console.log('-node', node);
});

server.on('+log', function (stream, node, type, log) {
  console.log('+log', stream, node, type, log);
});

server.on('unknown', function (data) {
  console.log('unknown', data);
});

// receive all event as raw data
server.on('raw', function (data) {
  console.log(data);
});
```
