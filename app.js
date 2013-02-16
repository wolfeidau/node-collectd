var net = require('net'),
    events = require('events'),
    _ = require('lodash'),
    EntryParser = require('./lib/entry_parser'),
    options = {path: '/usr/local/var/run/collectd-unixsock'},
    headerRegexp = /(\d+) Value.*/i;

var queue = [];
var lineQueue = [];
var eventParser = new EntryParser();


var client = net.connect(options,
    function () {
        console.log('connected');
    }.bind(this));

client.on('data', function (data) {

    // split
    var lineTokens = data.toString().split('\n').filter(function (line) {
        return line.length;
    });

    lineQueue = lineQueue.concat(lineTokens);

    readEntry();

}.bind(this));

function readEntry() {

    while (lineQueue.length) {

        var count = +lineQueue[0].match(headerRegexp)[1]; // check format

        if ((lineQueue.length - 1) < count) {
            return;
        }

        lineQueue.shift();

        var eventTokens = [];

        while (count--) {
            eventTokens.push(lineQueue.shift());
        }

        var callback = queue.shift();
        callback(null, eventTokens);
    }

}


function parseDataArray(data) {

    var result = {};
    data.forEach(function (key) {
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

    var metrics = [
        'trogdor.campjs.com/interface-en1/if_errors'
        , 'trogdor.campjs.com/interface-en1/if_octets'
        , 'trogdor.campjs.com/interface-en1/if_packets'
        , 'trogdor.campjs.com/load/load'
        , 'trogdor.campjs.com/memory/memory-active'
        , 'trogdor.campjs.com/memory/memory-free'
        , 'trogdor.campjs.com/memory/memory-inactive'
        , 'trogdor.campjs.com/memory/memory-wired'
    ];

    metrics.forEach(function (metric) {
            getdata(metric, function (err, data) {
                console.log({metric: metric, data: parseDataArray(data)});
            });
        }
    )
}, 3000);

