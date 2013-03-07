// Load modules

var Chai = require('chai');
var CollectD = require('../..');

// Test shortcuts

var expect = Chai.expect;

describe('Server', function () {

    it('creates a server', function () {
        var server = new CollectD.Server({});
        expect(server).to.exist;
    });

    it('have a hapi server created', function () {
        var server = new CollectD.Server({});

        expect(server.hapiServer).to.exist;
    });

});