/*
 * node-collectd
 * https://github.com/markw/collectd
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */

var internals = {
    modules: {
        server: require('./server.js'),
        config: require('./config')
    }
};

internals.export = function () {
    for (var key in internals.modules) {
        if (internals.modules.hasOwnProperty(key)) {
            module.exports[key] = module.exports[key.charAt(0).toUpperCase() + key.slice(1)] = internals.modules[key];
        }
    }
};

internals.export();




