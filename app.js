var CollectD = require('./lib/collectd');

var collectd = new CollectD();

var metrics = [
    'trogdor.campjs.com/interface-en1/if_errors'
    , 'trogdor.campjs.com/interface-en1/if_octets'
    , 'trogdor.campjs.com/interface-en1/if_packets'
    , 'trogdor.campjs.com/load/load'
    , 'trogdor.campjs.com/memory/memory-active'
    , 'trogdor.campjs.com/memory/memory-free'
    , 'trogdor.campjs.com/memory/memory-inactive'
    , 'trogdor.campjs.com/memory/memory-wired'
];

collectd.start(metrics, 10000);


