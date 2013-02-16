var util = require('util'),
    Steez = require('steez')
_ = require('lodash');

function ObjectWriter() {
    Steez.call(this);
}

util.inherits(ObjectWriter, Steez);

ObjectWriter.prototype.write = function write(data) {
    this.emit('data', new Buffer(util.inspect(data) + '\n'));
    return !this.paused && this.writable;
};

exports = module.exports = ObjectWriter;