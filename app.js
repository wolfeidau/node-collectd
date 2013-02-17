var net = require('net')
    , _ = require('lodash')
    , MetricStorage = require('./lib/metric_storage.js');

var queue = []
    , lineQueue = []
    , metricStorage = new MetricStorage({dbName: './collectd-data', valueEncoding: 'json'});

var client = net.connect({path: '/usr/local/var/run/collectd-unixsock'},
    function () {
        console.log('connected');
    }.bind(this));

client.on('data', function (data) {

    var headerRegexp = /(\d+) Value.*/i;

    // split
    var lineTokens = data.toString().split('\n').filter(function (line) {
        return line.length;
    });

    lineQueue = lineQueue.concat(lineTokens);

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

}.bind(this));

function parseDataArray(err, data) {

    var result = {};
    data.forEach(function (key) {
        if (!_.isUndefined(key)) {
            var tokens = key.split('=');
            if (tokens.length == 2) {
                result[tokens[0]] = parseFloat(tokens[1]);
            } else {
                err = 'missing tokens';
            }
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
                var dateEntry = new Date()
                    , err = null
                    , metricEntry = {metricKey: metric, metricDate: dateEntry, metricData: parseDataArray(err, data)};

                if (err) {
                    console.log('ERROR:', err);
                } else {

                    console.log('data:\n', metricEntry);
                    metricStorage.saveMetric(metric, dateEntry, metricEntry);
                }

            });
        }
    )
}, 3000);

