// test log file
var testLogFile = '/tmp/stream1.log';

// run a harvester on this file
var config = {                                                                           
  nodeName: "t2node",                                                            
  logStreams: {
    stream1: [
      testLogFile
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 28777
  }
};
harvester = require('log.io');
harvester = new harvester.LogHarvester(config);
harvester.run();

// run a log.io-server-parser and listen for events
var LogIoServerParser = require('../index.js');
var server = new LogIoServerParser({ port: 28777 });
server.listen();
server.on('+node', function (node, streams) {
  console.log('+node', node, streams);
});
server.on('-node', function (node) {
  console.log('-node', node);
});
server.on('+log', function (stream, node, type, log) {
  console.log('+log', stream, node, type, log);
  checkLineReceived();
});
server.on('unknown', function (data) {
  console.log('unknown', data);
});

// write 10 lines into /tmp/stream1.log
var fs = require('fs');
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    fs.appendFile(testLogFile, '... line ' + this + '...' + '\n');
  }.bind(i), 100 + Math.floor(Math.random() * 100));
}


// function to check the lines have been received
var nbLine = 0;
function checkLineReceived() {
  nbLine++;
  if (nbLine == 10) {
    console.log('Test OK 10 lines have been received');
    process.exit(0);
  }
}