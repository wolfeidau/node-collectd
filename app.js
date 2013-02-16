var net = require('net'),
    ListReader = require('./lib/list_reader'),
    ValueReader = require('./lib/value_reader'),
    ObjectWriter = require('./lib/object_writer'),
    events = require('events');

var doneCallback = function(){
    // done
    console.log('DONE')
}

var objectWriter = new ObjectWriter();

var client = net.connect({path: '/usr/local/var/run/collectd-unixsock'},
    function () { //'connect' listener
        console.log('client connected');
    });

var listReader = new ListReader();

client.pipe(listReader).pipe(objectWriter).pipe(process.stdout);

//client.write('LISTVAL\r\n');

client.end();

var valueReader = new ValueReader(doneCallback);
var objectWriter = new ObjectWriter();

var valueClient = net.connect({path: '/usr/local/var/run/collectd-unixsock'},
    function () { //'connect' listener
        console.log('client connected');
    });

valueClient.pipe(valueReader).pipe(objectWriter).pipe(process.stdout);


valueClient.write('GETVAL trogdor.campjs.com/load/load\n');
valueClient.write('GETVAL trogdor.campjs.com/load/load\n');
valueClient.write('GETVAL trogdor.campjs.com/load/load\n');

valueClient.end();