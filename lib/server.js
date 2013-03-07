/*
 * node-collectd
 * https://github.com/markw/collectd
 *
 * Copyright (c) 2013 Mark Wolfe
 * Licensed under the MIT license.
 */
var Hapi = require('hapi'),
    Config = require('./config');


// Declare internals

var internals = {};

module.exports = internals.Server = function(){

    // load the config
    this.config = new Config();

    // expose the server for testing purposes.
    this.hapiServer = new Hapi.Server();

}