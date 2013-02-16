var net = require('net'),
    events = require('events'),
    _ = require('lodash'),
    EntryParser = require('./lib/entry_parser'),
    options = {path: '/usr/local/var/run/collectd-unixsock'},
    regexp = /(\d+) Values found/i;

var queue = [];
var eventParser = new EntryParser();


var client = net.connect(options,
    function () {
        console.log('connected');
    }.bind(this));

client.on('data', function (data) {

    console.log('data =\n' + data.toString());

    // split
    var tokens = data.toString().split('\n').filter(function (line) {
        return line.length;
    });

    while (tokens.length) {

        var count = +tokens.shift().match(regexp)[1]; // check format

        var eventTokens = [];
        while (count--) {
            var lineToken = tokens.shift();
            eventParser.addLine(lineToken);
            eventTokens.push(lineToken);
        }

        var callback = queue.shift();
        callback(null, eventTokens);

    }

}.bind(this));

function parseDataArray(data) {

    console.log(data);

    var result = {};
    data.forEach(function (key) {
        console.log(key);
        if (!_.isUndefined(key)) {
            var tokens = key.split('=');
            result[tokens[0]] = parseFloat(tokens[1]);
        }
    });
    return result;
}

function getdata(key, callback) {
    client.write('GETVAL ' + key + '\n');
    queue.push(callback);
}


setInterval(function () {
    getdata('trogdor.campjs.com/load/load', function (err, data) {
        console.log({'load': parseDataArray(data)});
    });
    getdata('trogdor.campjs.com/interface-en1/if_errors', function (err, data) {
        console.log({'if_errors': parseDataArray(data)});
    });
    getdata('trogdor.campjs.com/interface-en1/if_octets', function (err, data) {
        console.log({'if_octets': parseDataArray(data)});
    });
    getdata('trogdor.campjs.com/interface-en1/if_packets', function (err, data) {
        console.log({'if_packets': parseDataArray(data)});
    });
}, 3000);

//client.end();