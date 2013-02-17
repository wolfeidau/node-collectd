# collectd

NodeJS library which can retrieve values from collectd and stores it into a local leveldb database.

## Getting Started
Install the module with: `npm install collectd`

```javascript
var collectd = require('collectd');
collectd.awesome(); // "awesome"
```

## Documentation
_(Coming soon)_

## Examples

```javascript
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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Mark Wolfe  
Licensed under the MIT license.
