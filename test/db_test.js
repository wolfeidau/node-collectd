var Chai = require('chai')
    , metricStorage = require('../lib/metric_storage.js')
    , util = require('util');


// Test shortcuts

var expect = Chai.expect;

// Declare internals

var internals = {};

internals.datesArray = [
    new Date('Sun Feb 17 2013 12:01:47 GMT+1100 (EST)'),
    new Date('Sun Feb 17 2013 12:02:47 GMT+1100 (EST)'),
    new Date('Sun Feb 17 2013 12:03:47 GMT+1100 (EST)'),
    new Date('Sun Feb 17 2013 12:04:47 GMT+1100 (EST)')
];

describe('DB', function () {

    it('create a db', function (done) {
        expect(metricStorage).to.exist;
        done();
    });

    it('create entries', function () {

        internals.datesArray.forEach(function (dateEntry) {
            var metricKey = 'trogdor.campjs.com/interface-en0/if_errors';
            metricStorage.saveMetric(metricKey, dateEntry,
                {metricKey: metricKey, metricDate: dateEntry, metricData: {rx: 0, tx: 0 }}
            )
        });
        internals.datesArray.forEach(function (dateEntry) {
            var metricKey = 'trogdor.campjs.com/interface-en1/if_errors';
            metricStorage.saveMetric(metricKey, dateEntry,
                {metricKey: metricKey, metricDate: dateEntry, metricData: {rx: 0, tx: 0 }}
            )
        });
        internals.datesArray.forEach(function (dateEntry) {
            var metricKey = 'trogdor.campjs.com/interface-en1/if_octets';
            metricStorage.saveMetric(metricKey, dateEntry,
                {metricKey: metricKey, metricDate: dateEntry, metricData: {rx: 0, tx: 0 }}
            )
        });
    });

    it('read entries', function (done) {

        var count = 0;
        // START is inclusive
        // END is exlusive so we use ~ which is a higher character code than the - which is next in the timestamp.
        metricStorage.readStream({start: 'trogdor.campjs.com/interface-en1/if_errors/2013', end: 'trogdor.campjs.com/interface-en1/if_errors/2013~'})
            .on('data',function (data) {
                //console.log('data:\n', data);
                count++;
            }).on('end', function () {
                //console.log('Stream closed')
                expect(count).to.equal(4);
                done();
            });
    });

});

