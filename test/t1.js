var LogIoServerParser = require('../index.js');

var lines = '+log|my_stream|my_node|info|this is log message\r\n' +
  '+node|my_node\r\n' +
  '+node|my_node|my_stream1,my_stream2\r\n' +
  '-node|my_node\r\n' +
  'line not well formatted\r\n';


//var request = require('request');

var nodes = {};


//logStream.pipe(request.post(options)).pipe(resultStream);


var server = new LogIoServerParser({ port: 28777 });

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

server.parseLines(lines);
