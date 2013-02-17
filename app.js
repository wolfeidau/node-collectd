var net = require('net')
    , _ = require('lodash')
    , MetricStorage = require('./lib/metric_storage.js');

var options = {path: '/usr/local/var/run/collectd-unixsock'}
    , headerRegexp = /(\d+) Value.*/i;

var queue = [];
var lineQueue = [];
var metricStorage = new MetricStorage({dbName: './collectd-data', valueEncoding: 'json'});

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

    //console.log(data);

    var result = {};
    data.forEach(function (key) {
        if (!_.isUndefined(key)) {
            var tokens = key.split('=');
            result[tokens[0]] = parseFloat(tokens[1]);
        }
    });
    return result;
}

function doGetVal(key, callback) {
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
            doGetVal(metric, function (err, data) {
                var dateEntry = new Date();

                //console.log('data:\n', {metricKey: metric, metricDate: dateEntry, metricData: parseDataArray(data)});

                metricStorage.saveMetric(metric, dateEntry,
                    {metricKey: metric, metricDate: dateEntry, metricData: parseDataArray(data)});
            });
        }
    )
}, 3000);

