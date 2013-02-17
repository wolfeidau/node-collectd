var levelup = require('levelup');

function MetricStorage(options) {
    this.options = options || {};

    this.db = levelup(options.dbName || './collectd-data', {valueEncoding: 'json'});
}

MetricStorage.prototype.saveMetric = function (metricKey, metricDate, metricData) {
    metricKey = metricKey + metricDate.toISOString();
    this.db.put(metricKey, metricData)
}

MetricStorage.prototype.readStream = function (options) {
    return this.db.readStream(options);
}

exports = module.exports = MetricStorage
