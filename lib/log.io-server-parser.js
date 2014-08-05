var net = require('net');
var Lazy = require('lazy');

var util = require('util');
var EventEmitter = require('events').EventEmitter;
function LogIoServerParser(options) {
  var self     = this;
  self.options = options || {};
  self.options.port = self.options.port || 28777; // default log.io server port
}
util.inherits(LogIoServerParser, EventEmitter);

LogIoServerParser.prototype.listen = function (cb) {
  var self = this;

  self.server = net.createServer(function (c) {
    self.connection = c;
    
    c.on('end', function() {
      //console.log('server disconnected');
    });

    // read the data stream
    Lazy(c)
        .lines
        .map(String)
        .map(function (line) {
          self.parseLine(line);
        });

  });
  self.server.listen(self.options.port, function () {
    if (cb) return cb();
  });
};

/**
 * Parse a new received line and emit the parsed result
 */
LogIoServerParser.prototype.parseLine = function (line) {
  var self = this;
  line = line.trim();
  self.emit('raw', line);
  line = line.split('|');
  if (line[0] === '+node') {
    self.emit('+node', line[1], line[2] ? line[2].split(',') : []);
  } else if (line[0] === '-node') {
    self.emit('-node', line[1]);
  } else if (line[0] === '+log') {
    self.emit('+log', line[1], line[2], line[3], line[4]);
  } else {
    self.emit('unknown', line);
  }
};

/**
 * Parse new received lines
 */
LogIoServerParser.prototype.parseLines = function (lines) {
  var self = this;

  var lazy = new Lazy;
  lazy.lines.map(String).map(function (line) {
    self.parseLine(line);
  });
  lazy.emit('data', lines);
};

/**
 * Close the listening server
 */
LogIoServerParser.prototype.close = function (cb) {
  var self = this;
  self.server.close(cb);
};

module.exports = LogIoServerParser;