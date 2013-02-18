var levelup = require('levelup');

function MetricStorage() {
    this.db = levelup('./collectd-data', {valueEncoding: 'json'});
}

MetricStorage.prototype.saveMetric = function (metricKey, metricDate, metricData) {
    metricKey = metricKey + '/' + metricDate.toISOString();
//    console.log('putting data', metricData);
    this.db.put(metricKey, metricData);
}

MetricStorage.prototype.readStream = function (options) {
    return this.db.readStream(options);
}

exports = module.exports = new MetricStorage()
