var Chai = require('chai')
    , CollectD = require('../../lib/collectd')
    , util = require('util');


// Test shortcuts

var expect = Chai.expect;

// Declare internals

var internals = {};

var collectd;

describe('collectd unix pipe interface', function(){

    before(function(){
        collectd = new CollectD();
    });

    it('should retrieve a list of values', function(done){

        collectd.getMetricList(function(err, data){

            expect(err).is.null;
            expect(data).is.not.empty;

            //console.log(util.inspect(data));

            done();
        })
    });

});
