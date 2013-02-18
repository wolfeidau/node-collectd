/*
 * collectd
 * https://github.com/markw/collectd
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var net = require('net')
    , _ = require('lodash')
    , metricStorage = require('./metric_storage.js');

var internals = {};

function CollectD(options) {

    internals.queue = []
        , lineQueue = [];

    function _bindOnDataEvent(err, client, callBackQueue) {

        //console.log('_bindOnDataEvent called', err, client, callBackQueue);

        client.on('data', function (data) {

            var headerRegexp = /(\d+) Value.*/i;

            // split
            var lineTokens = data.toString().split('\n').filter(function (line) {
                return line.length;
            });

            lineQueue = lineQueue.concat(lineTokens);

            while (lineQueue.length) {

                if (!lineQueue[0].match(headerRegexp)) {
                    err = 'bad header line';
                    return;
                }

                var count = +lineQueue[0].match(headerRegexp)[1]; // check format

                if ((lineQueue.length - 1) < count) {
                    return;
                }

                lineQueue.shift();

                var eventTokens = [];

                while (count--) {
                    eventTokens.push(lineQueue.shift());
                }

                var callback = callBackQueue.shift();
                callback(null, eventTokens);
            }

        }.bind(this));

    }

    function _parseDataArray(err, data) {

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

    function _connect(err) {

        //console.log('_connect called', err);

        try {
            return net.connect({path: '/usr/local/var/run/collectd-unixsock'},
                function () {
                    //console.log('connected');
                }.bind(this));
        } catch (e) {
            err = e.toString();
            return;
        }

    }

    function _doGetList(client, queue, callback) {

        //console.log('_doGetList called', client, queue, callback);


        client.write('LISTVAL\n');
        queue.push(callback);
    }


    function _doGetVal(key, client, queue, callback) {
        client.write('GETVAL ' + key + '\n');
        queue.push(callback);
    }

    this.getMetricList = function (callback) {

        // connect
        var connectErr = null
            , bindErr = null
            , queue = []
            , client = null;

        client = _connect(connectErr);

        if (connectErr) {
            callback(connectErr);
            return;
        }

        _bindOnDataEvent(bindErr, client, queue);

        if (bindErr) {
            callback(bindErr);
            return;
        }

        _doGetList(client, queue, function (err, data) {

            var metrics = [];

            data.forEach(function (value) {

                var tokens = value.split(' ');

                if (tokens.length == 2){
                    metrics.push(tokens[1])
                }

            });

            // close the client
            client.end();

            // wait for call back to indicate client is disconnected
            client.on('end', function(){
                callback(err, metrics);
            })
        })


    };


    this.start = function (err, metrics, timeout) {
        var intervalTimeout = timeout || 10000;

        if (!internals.intervalId) {

            // connect
            var connectErr = null
                , bindErr = null
                , queue = []
                , client = null;

            client = _connect(connectErr);

            if (connectErr) {
                err = connectErr;
                return;
            }

            _bindOnDataEvent(bindErr, client, queue);

            if (bindErr) {
                err = bindErr;
                return;
            }

            internals.intervalId = setInterval(function () {

                metrics.forEach(function (metric) {
                        _doGetVal(metric, client, queue, function (err, data) {
                            var dateEntry = new Date()
                                , err = null
                                , metricEntry = {metricKey: metric, metricDate: dateEntry, metricData: _parseDataArray(err, data)};

                            if (err) {
                                console.log('ERROR:', err);
                            } else {

                                console.log('data:\n', metricEntry);
                                metricStorage.saveMetric(metric, dateEntry, metricEntry);
                            }

                        });
                    }
                )
            }, intervalTimeout);
        }
    }

    this.stop = function () {
        if (internals.intervalId) {
            clearInterval(internals.intervalId);

            internals.intervalId = null;
        }
    }
}

exports = module.exports = CollectD;
module.exports.metricStorage = metricStorage;


