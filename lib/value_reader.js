var util = require('util'),
    Steez = require('steez');

function ValueReader(callback) {
    Steez.call(this);
    this.callback = callback;
}

util.inherits(ValueReader, Steez);

ValueReader.prototype.parseEntries = function (data) {
    var lineTokens = data.toString().split('\n'),
        values = {},
        regexp = /(\d+) Values found/i,
        valueCount = 0;

    _(lineTokens).each(function (line) {

        if (line.match(regexp)) {

            valueCount = line.match(regexp)[1];

            if (Object.keys(values).length){
                this.emit('data', values);
                this.callback();
                values = {};
            }
        }

        var tokens = line.split('=');
        if (tokens.length == 2) {
            values[tokens[0]] = tokens[1];
        }

    }.bind(this));
    //console.log('values = ' + lineTokens)
    this.emit('data', values);
    this.callback();

};

ValueReader.prototype.write = function write(data) {
    this.parseEntries(data);
    return !this.paused && this.writable;
};

exports = module.exports = ValueReader;