var nconf = require('nconf'),
    path = require('path');

// Declare internals

var internals = {};

module.exports = internals.Config = function (defaults) {

    nconf.defaults(defaults);

    nconf.argv().env().file({
        file: path.join('config', 'env.json')
    });

    var env = process.env.NODE_ENV || 'development',
        envConf = nconf.get(env);


    this.env = {};

    for (var key in envConf) {
        if (envConf.hasOwnProperty(key)) {
            this.env[key] = envConf[key];
        }
    }
}