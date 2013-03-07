// Load modules

var Chai = require('chai');
var CollectD = require('../..');

// Test shortcuts

var expect = Chai.expect;

describe('Config', function () {

    it('load the config', function () {
        var config = new CollectD.Config({});
        expect(config).to.exist;
    });

    it('config should have an env', function () {
        var config = new CollectD.Config({});
        expect(config.env).to.exist;
    });
    it('config should enable configuring defaults', function () {
        // supply a default for the 'test' environment.
        var config = new CollectD.Config({'test': {'debug': true}});
        expect(config.env.debug).to.be.true;

    });
});