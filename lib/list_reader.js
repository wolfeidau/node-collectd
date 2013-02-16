var util = require('util'),
    Steez = require('steez')
    _ = require('lodash');

function ListReader() {
    Steez.call(this);
}

util.inherits(ListReader, Steez);

ListReader.prototype.parseEntries = function (data) {
    var lineTokens = data.toString().split('\n'),
        that = this;

    _(lineTokens).each(function (line) {
        if (!_.isEmpty(line)) {
            var splitVals = line.split(' ');
            if (splitVals.length == 2){
                that.emit('data', {'date': splitVals[0], 'key': splitVals[1]});
            }
        }
    });
};

ListReader.prototype.write = function write(data) {
    this.parseEntries(data);
    return !this.paused && this.writable;
};

exports = module.exports = ListReader;